import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { supabase } from "@/lib/supabase"

export interface SlotEntry {
  task: string
  urgent: boolean | null
  important: boolean | null
}

export type Quadrant = "doFirst" | "schedule" | "delegate" | "eliminate"

export interface TimeAuditStats {
  /** Slots where both Urgent? and Important? have been answered. */
  classified: number
  /** Slots with a task written in them. */
  filled: number
  quadrants: Record<Quadrant, number> // percentages, 0-100
  urgentYes: number
  urgentNo: number
  importantYes: number
  importantNo: number
}

interface EntryRow {
  slot: string
  task: string | null
  urgent: boolean | null
  important: boolean | null
}

const EMPTY: SlotEntry = { task: "", urgent: null, important: null }
const SAVE_DELAY_MS = 600

/** 30 minute slots as "HH:mm" strings, e.g. 04:00 ... 23:30. */
export function buildSlots(startHour = 4, endHour = 24): string[] {
  const slots: string[] = []
  for (let h = startHour; h < endHour; h++) {
    for (const m of [0, 30]) {
      slots.push(`${String(h).padStart(2, "0")}:${m === 0 ? "00" : "30"}`)
    }
  }
  return slots
}

export function formatSlot(slot: string): string {
  const [h, m] = slot.split(":").map(Number)
  const suffix = h >= 12 ? "PM" : "AM"
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${String(m).padStart(2, "0")} ${suffix}`
}

const pct = (n: number, total: number) =>
  total === 0 ? 0 : Math.round((n / total) * 100)

export function computeStats(entries: Record<string, SlotEntry>): TimeAuditStats {
  let doFirst = 0
  let schedule = 0
  let delegate = 0
  let eliminate = 0
  let filled = 0

  for (const e of Object.values(entries)) {
    if (e.task.trim()) filled++
    if (e.urgent === null || e.important === null) continue
    if (e.urgent && e.important) doFirst++
    else if (!e.urgent && e.important) schedule++
    else if (e.urgent && !e.important) delegate++
    else eliminate++
  }

  const classified = doFirst + schedule + delegate + eliminate
  return {
    classified,
    filled,
    quadrants: {
      doFirst: pct(doFirst, classified),
      schedule: pct(schedule, classified),
      delegate: pct(delegate, classified),
      eliminate: pct(eliminate, classified),
    },
    urgentYes: pct(doFirst + delegate, classified),
    urgentNo: pct(schedule + eliminate, classified),
    importantYes: pct(doFirst + schedule, classified),
    importantNo: pct(delegate + eliminate, classified),
  }
}

/**
 * Loads and saves one day of the Time Audit (30 minute slots tagged
 * Urgent? / Important?) plus the end-of-day "did I feel happy?" answer.
 *
 * Tables are defined in supabase/time_audit.sql.
 */
export function useTimeAudit(date: string) {
  const [entries, setEntries] = useState<Record<string, SlotEntry>>({})
  const [happy, setHappyState] = useState<boolean | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const entriesRef = useRef(entries)
  const userIdRef = useRef<string | null>(null)
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const pendingSaves = useRef(0)

  const trackSave = useCallback(async (job: () => Promise<void>) => {
    pendingSaves.current++
    setSaving(true)
    try {
      await job()
    } finally {
      pendingSaves.current--
      if (pendingSaves.current === 0) setSaving(false)
    }
  }, [])

  const persistSlot = useCallback(
    async (uid: string, entryDate: string, slot: string, entry: SlotEntry) => {
      const isEmpty =
        !entry.task.trim() && entry.urgent === null && entry.important === null

      const query = isEmpty
        ? supabase
            .from("time_audit_entries")
            .delete()
            .eq("user_id", uid)
            .eq("entry_date", entryDate)
            .eq("slot", slot)
        : supabase.from("time_audit_entries").upsert(
            {
              user_id: uid,
              entry_date: entryDate,
              slot,
              task: entry.task,
              urgent: entry.urgent,
              important: entry.important,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id,entry_date,slot" }
          )

      const { error: saveError } = await query
      if (saveError) setError(saveError.message)
    },
    []
  )

  useEffect(() => {
    entriesRef.current = entries
  }, [entries])

  useEffect(() => {
    userIdRef.current = userId
  }, [userId])

  // Load the selected day.
  useEffect(() => {
    let active = true

    async function load() {
      // Anything still waiting to be saved belongs to the previous day and is
      // flushed by the cleanup below, so just reset the view.
      setLoading(true)
      setError(null)
      setEntries({})
      setHappyState(null)

      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (!active) return

      if (authError || !authData.user) {
        setError("Sign in to use the time audit.")
        setLoading(false)
        return
      }
      setUserId(authData.user.id)

      const [entriesRes, dayRes] = await Promise.all([
        supabase
          .from("time_audit_entries")
          .select("slot, task, urgent, important")
          .eq("user_id", authData.user.id)
          .eq("entry_date", date),
        supabase
          .from("time_audit_days")
          .select("happy")
          .eq("user_id", authData.user.id)
          .eq("entry_date", date)
          .maybeSingle(),
      ])
      if (!active) return

      if (entriesRes.error) {
        setError(entriesRes.error.message)
      } else {
        const next: Record<string, SlotEntry> = {}
        for (const row of (entriesRes.data ?? []) as EntryRow[]) {
          next[row.slot] = {
            task: row.task ?? "",
            urgent: row.urgent,
            important: row.important,
          }
        }
        setEntries(next)
      }

      if (dayRes.error) {
        setError(dayRes.error.message)
      } else {
        setHappyState(dayRes.data?.happy ?? null)
      }
      setLoading(false)
    }

    load()

    const pending = timers.current
    return () => {
      active = false
      // Flush edits that were still debounced when the day changed / unmounted.
      // `date` here is the day those edits belong to.
      const uid = userIdRef.current
      for (const [slot, timer] of Object.entries(pending)) {
        clearTimeout(timer)
        delete pending[slot]
        if (uid) {
          const entry = entriesRef.current[slot] ?? EMPTY
          void trackSave(() => persistSlot(uid, date, slot, entry))
        }
      }
    }
  }, [date, persistSlot, trackSave])

  const scheduleSave = useCallback(
    (slot: string, entry: SlotEntry, immediate: boolean) => {
      if (!userId) return
      clearTimeout(timers.current[slot])
      const run = () => {
        delete timers.current[slot]
        void trackSave(() => persistSlot(userId, date, slot, entry))
      }
      if (immediate) run()
      else timers.current[slot] = setTimeout(run, SAVE_DELAY_MS)
    },
    [userId, date, persistSlot, trackSave]
  )

  const updateSlot = useCallback(
    (slot: string, patch: Partial<SlotEntry>) => {
      const current = entriesRef.current[slot] ?? EMPTY
      const next = { ...current, ...patch }
      setEntries((prev) => ({ ...prev, [slot]: next }))
      // Typing is debounced; Y/N taps save right away.
      scheduleSave(slot, next, patch.task === undefined)
    },
    [scheduleSave]
  )

  const setHappy = useCallback(
    async (value: boolean | null) => {
      setHappyState(value)
      if (!userId) return
      await trackSave(async () => {
        const { error: saveError } = await supabase
          .from("time_audit_days")
          .upsert(
            {
              user_id: userId,
              entry_date: date,
              happy: value,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id,entry_date" }
          )
        if (saveError) setError(saveError.message)
      })
    },
    [userId, date, trackSave]
  )

  const stats = useMemo(() => computeStats(entries), [entries])

  return { entries, stats, happy, loading, saving, error, updateSlot, setHappy }
}
