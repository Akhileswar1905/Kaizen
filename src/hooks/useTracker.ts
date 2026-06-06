import { addDays, subDays } from "date-fns"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { startOfWeek, subWeeks, addWeeks, format } from "date-fns"
import { supabase } from "@/lib/supabase"
import * as Icons from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useGamification } from "@/contexts/GamificationContext"

export type Habit = {
  id: string
  title: string
  description: string
  target_days: number
  icon_name: string
  is_archived: boolean
}

export function useTracker() {
  const IconMap = useMemo(() => {
    return Object.keys(Icons).filter((key) => {
      return (
        typeof (Icons as any)[key] === "object" ||
        typeof (Icons as any)[key] === "function"
      )
    })
  }, [])

  const { user } = useAuth() // Get the authenticated user
  const userId = user?.id || "anonymous" // Fallback to "anonymous" if user is not logged in
  const {
    triggerGamificationEvent,
    subtractGamificationPoints,
    playerStats,
    recalculateAndSyncStats,
  } = useGamification()

  const [habits, setHabits] = useState<Habit[]>([])

  // Format: { "habitId-YYYY-MM-DD": true }
  const [logs, setLogs] = useState<Record<string, boolean>>({})

  const [currentWeekStart, setCurrentWeekStart] = useState(
    () => startOfWeek(new Date(), { weekStartsOn: 1 }) // 1 = Monday
  )
  const [isLoading, setIsLoading] = useState(true)

  const [sundayReview, setSundayReview] = useState({
    one_percent_win: "",
    adjustments: "",
  })
  const [isSavingReview, setIsSavingReview] = useState(false)

  const [dsaData, setDsaData] = useState<Record<string, any[]>>({})
  const [dsaCompleted, setDsaCompleted] = useState<string[]>([])
  // Add state to store cached notes from the DB: { "problem_id": "notes content" }
  const [dsaNotes, setDsaNotes] = useState<Record<string, string>>({})

  const [journals, setJournals] = useState<any[]>([])
  const [isSavingJournal, setIsSavingJournal] = useState(false)

  const [activeView, setActiveView] = useState<
    | "dashboard"
    | "dsa"
    | "journal"
    | "finance"
    | "system-design"
    | "notes"
    | "workout-tracker"
  >("dashboard")

  // Fetch initial data
  const fetchData = useCallback(async () => {
    setIsLoading(true)

    // 1. Fetch Habits
    const { data: habitsData } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", userId) // Filter habits by the authenticated user

    if (habitsData) setHabits(habitsData)

    // 2. Fetch all logs (you might want to filter this by date range later)
    const { data: logsData } = await supabase
      .from("habit_logs")
      .select("*")
      .eq("user_id", userId) // Filter logs by the authenticated user

    if (logsData) {
      const logMap: Record<string, boolean> = {}
      logsData.forEach((log) => {
        logMap[`${log.habit_id}-${log.log_date}`] = log.is_completed
      })
      setLogs(logMap)
    }

    setIsLoading(false)
  }, [userId])

  // Handle checking/unchecking a habit
  const toggleHabit = async (habitId: string, date: Date) => {
    const dateString = format(date, "yyyy-MM-dd")
    const logKey = `${habitId}-${dateString}`
    const currentStatus = logs[logKey] || false
    const newStatus = !currentStatus

    // Optimistic UI update (feels instant to the user)
    setLogs((prev) => ({ ...prev, [logKey]: newStatus }))

    // Background Database update
    const { error } = await supabase.from("habit_logs").upsert(
      {
        user_id: userId,
        habit_id: habitId,
        log_date: dateString,
        is_completed: newStatus,
      },
      { onConflict: "habit_id,log_date" }
    )

    let result = null
    if (newStatus) {
      result = await triggerGamificationEvent({
        type: "HABIT_COMPLETED",
        amount: 1,
      })
    } else {
      // Subtract points when unchecking a habit to prevent point farming
      await subtractGamificationPoints({ type: "HABIT_COMPLETED", amount: 1 })
    }

    // Revert if Supabase fails
    if (error) {
      console.error("Failed to save log:", error)
      setLogs((prev) => ({ ...prev, [logKey]: currentStatus }))
      return null
    }

    return result
  }

  // Week navigation
  const nextWeek = () => setCurrentWeekStart((prev) => addWeeks(prev, 1))
  const prevWeek = () => {
    setCurrentWeekStart((prev) => subWeeks(prev, 1))
  }

  const currentWeekDays = Array.from({ length: 7 }).map((_, i) =>
    addDays(currentWeekStart, i)
  )

  // --- STATS CALCULATIONS ---

  // 1. Checks this week
  const checksThisWeek = currentWeekDays.reduce((total, date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    let dailyChecks = 0
    habits.forEach((habit) => {
      if (logs[`${habit.id}-${dateStr}`]) dailyChecks++
    })
    return total + dailyChecks
  }, 0)

  // 2. Week Completion Percentage
  const totalTargetDays = habits.reduce(
    (total, habit) => total + habit.target_days,
    0
  )
  const weekCompletionPct =
    totalTargetDays === 0
      ? 0
      : Math.round((checksThisWeek / totalTargetDays) * 100)

  // 3. DSA Streak Calculation
  // Find the specific habit (case-insensitive check)
  const dsaHabit = habits.find((h) => h.title.toLowerCase().includes("dsa"))
  let dsaStreak = 0

  if (dsaHabit) {
    let checkDate = new Date() // Start today
    let dateStr = format(checkDate, "yyyy-MM-dd")

    // If today is NOT checked yet, give them grace and start counting from yesterday
    if (!logs[`${dsaHabit.id}-${dateStr}`]) {
      checkDate = subDays(checkDate, 1)
      dateStr = format(checkDate, "yyyy-MM-dd")
    }

    // Count backwards day-by-day until a break in the chain is found
    while (logs[`${dsaHabit.id}-${dateStr}`]) {
      dsaStreak++
      checkDate = subDays(checkDate, 1)
      dateStr = format(checkDate, "yyyy-MM-dd")
    }
  }

  const addHabit = async (newHabit: any) => {
    const { data, error } = await supabase
      .from("habits")
      .insert([{ ...newHabit, user_id: userId }]) // Inject user_id
      .select()
      .single()

    if (error) {
      console.error("Error adding habit:", error)
      return
    }

    // Immediately add it to the UI without refreshing the page
    setHabits([...habits, data])
  }

  const updateHabit = async (habitId: string, updates: any) => {
    const { data, error } = await supabase
      .from("habits")
      .update(updates)
      .eq("id", habitId)
      .eq("user_id", userId) // Ensure users can only update their own habits
      .select()
      .single()

    if (error) {
      console.error("Error updating habit:", error)
      return
    }

    // Update state immediately
    setHabits(habits.map((h) => (h.id === habitId ? data : h)))
  }

  const deleteHabit = async (habitId: string) => {
    const { error } = await supabase
      .from("habits")
      .delete()
      .eq("id", habitId)
      .eq("user_id", userId)

    if (error) {
      console.error("Error deleting habit:", error)
      return
    }

    // Remove from state immediately
    setHabits(habits.filter((h) => h.id !== habitId))
  }

  const saveWeeklyReview = async (winText: string, adjustText: string) => {
    setIsSavingReview(true)
    const formattedDate = format(currentWeekStart, "yyyy-MM-dd")

    const { error } = await supabase.from("weekly_reviews").upsert(
      {
        week_start_date: formattedDate,
        one_percent_win: winText,
        adjustments: adjustText,
        user_id: userId,
      },
      { onConflict: "week_start_date" } // This prevents duplicates!
    )

    if (!error) {
      await triggerGamificationEvent({ type: "WEEKLY_REVIEW_DONE", amount: 1 })
    } else {
      console.error("Error saving review:", error)
    }
    setIsSavingReview(false)
  }

  const toggleDsaProblem = async (
    problemId: string,
    isCurrentlyCompleted: boolean
  ) => {
    if (isCurrentlyCompleted) {
      // Uncheck it (Delete from Supabase)
      await supabase
        .from("dsa_completions")
        .delete()
        .eq("problem_id", problemId)
        .eq("user_id", userId)
      setDsaCompleted((prev) => prev.filter((id) => id !== problemId))
      await subtractGamificationPoints({ type: "DSA_SOLVED", amount: 1 })
    } else {
      // Check it (Insert to Supabase)
      await supabase
        .from("dsa_completions")
        .insert([{ problem_id: problemId, user_id: userId }])
      setDsaCompleted((prev) => [...prev, problemId])

      await triggerGamificationEvent({
        type: "DSA_SOLVED",
        amount: 1,
      })
    }
  }

  const saveDsaNote = async (problemId: string, noteText: string) => {
    // 1. Guard clause: Ensure we have a user
    if (!user?.id) {
      console.error("No user found")
      return
    }

    // Instantly update local UI state for zero-latency feedback
    setDsaNotes((prev) => ({ ...prev, [problemId]: noteText }))

    // Persist changes directly to the Supabase Cloud using UPSERT
    const { error } = await supabase.from("dsa_completions").upsert(
      {
        user_id: user.id, // Explicitly tie it to the user
        problem_id: problemId, // The ID of the problem
        notes: noteText, // The actual note
      },
      {
        onConflict: "user_id,problem_id", // Tells Supabase how to find the specific row to update
      }
    )

    if (error) {
      console.error("Failed to sync notes to Supabase:", error.message)
      // Optional: Roll back local state if network failure occurs
    }
  }

  const saveJournalEntry = async (dateStr: string, content: string) => {
    setIsSavingJournal(true)

    const { data, error } = await supabase
      .from("journals")
      .upsert(
        { entry_date: dateStr, content: content, user_id: userId },
        { onConflict: "entry_date" }
      )
      .select()
      .single()

    if (!error && data) {
      await triggerGamificationEvent({ type: "JOURNAL_SAVED", amount: 1 })
      // Update local state so the sidebar reflects the new content immediately
      setJournals((prev) => {
        const exists = prev.find((j) => j.entry_date === dateStr)
        if (exists) {
          return prev.map((j) => (j.entry_date === dateStr ? data : j))
        }
        // If it's a brand new entry, add it and sort by date descending
        return [data, ...prev].sort((a, b) =>
          b.entry_date.localeCompare(a.entry_date)
        )
      })
    } else {
      console.error("Error saving journal:", error)
    }

    setIsSavingJournal(false)
  }

  const fetchWeekData = useCallback(async () => {
    await fetchData()

    const formattedDate = format(currentWeekStart, "yyyy-MM-dd")

    const { data: reviewData } = await supabase
      .from("weekly_reviews")
      .select("*")
      .eq("week_start_date", formattedDate)
      .eq("user_id", userId)
      .single()

    if (reviewData) {
      setSundayReview({
        one_percent_win: reviewData.one_percent_win || "",
        adjustments: reviewData.adjustments || "",
      })
    } else {
      setSundayReview({
        one_percent_win: "",
        adjustments: "",
      })
    }

    const { data: problems } = await supabase.from("dsa_problems").select("*")

    if (problems) {
      const grouped = problems.reduce(
        (acc, curr) => {
          if (!acc[curr.category]) {
            acc[curr.category] = []
          }

          acc[curr.category].push(curr)
          return acc
        },
        {} as Record<string, any[]>
      )

      setDsaData(grouped)
    }

    const { data: completions } = await supabase
      .from("dsa_completions")
      .select("problem_id")
      .eq("user_id", userId)

    if (completions) {
      setDsaCompleted(completions.map((c) => c.problem_id))
    }

    const { data: journalData } = await supabase
      .from("journals")
      .select("*")
      .eq("user_id", userId)
      .order("entry_date", { ascending: false })

    if (journalData) {
      setJournals(journalData)
    }
  }, [currentWeekStart, userId, fetchData])

  const fetchDsaProgress = useCallback(async () => {
    const { data, error } = await supabase.from("dsa_problems").select("id")

    const { data: progressData, error: progressError } = await supabase
      .from("dsa_completions")
      .select("problem_id, notes")
      .eq("user_id", userId)

    if (data && !error && !progressError) {
      const completedIds = progressData?.map((p) => p.problem_id) || []

      const notesMap =
        progressData?.reduce(
          (acc, current) => {
            if (current.notes) {
              acc[current.problem_id] = current.notes
            }

            return acc
          },
          {} as Record<string, string>
        ) || {}

      setDsaCompleted(completedIds)
      setDsaNotes(notesMap)
    }
  }, [userId])

  // ==========================================
  // POMODORO LOGIC (Cross-Browser Synced)
  // ==========================================
  const WORK_TIME = 25 * 60
  const BREAK_TIME = 5 * 60

  const [pomoTimeLeft, setPomoTimeLeft] = useState(WORK_TIME)
  const [isPomoActive, setIsPomoActive] = useState(false)
  const [isPomoBreak, setIsPomoBreak] = useState(false)

  // Keep a ref of the latest state to sync with new tabs without triggering re-connects
  const pomoStateRef = useRef({
    isActive: isPomoActive,
    timeLeft: pomoTimeLeft,
    isBreak: isPomoBreak,
  })

  // Update the ref silently every time state changes
  useEffect(() => {
    pomoStateRef.current = {
      isActive: isPomoActive,
      timeLeft: pomoTimeLeft,
      isBreak: isPomoBreak,
    }
  }, [isPomoActive, pomoTimeLeft, isPomoBreak])

  // 1. Audio Notification
  const playSystemAlarm = useCallback(() => {
    try {
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContext) return

      const ctx = new AudioContext()

      // Ensure the audio context is resumed (browser safety requirement)
      if (ctx.state === "suspended") {
        ctx.resume()
      }

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.type = "sine"
      // Solo Leveling style: Sharp, rising "system" tone
      osc.frequency.setValueAtTime(400, ctx.currentTime)
      osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.5)

      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 1.5)

      osc.start()
      osc.stop(ctx.currentTime + 1.5)
    } catch (error) {
      console.error("Audio playback blocked by browser policy", error)
    }
  }, [])

  // 2. Supabase Realtime Cross-Browser Sync
  useEffect(() => {
    if (!user?.id) return

    const pomoChannel = supabase.channel(`pomo_sync_${user.id}`)

    pomoChannel
      .on("broadcast", { event: "SYNC_STATE" }, ({ payload }) => {
        setIsPomoActive(payload.isActive)
        setPomoTimeLeft(payload.timeLeft)
        setIsPomoBreak(payload.isBreak)
      })
      .on("broadcast", { event: "REQUEST_STATE" }, () => {
        // Use the REF here. This guarantees we send the freshest data
        // without putting state in the dependency array.
        const current = pomoStateRef.current
        if (
          current.isActive ||
          current.timeLeft !== (current.isBreak ? BREAK_TIME : WORK_TIME)
        ) {
          pomoChannel.send({
            type: "broadcast",
            event: "SYNC_STATE",
            payload: current,
          })
        }
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          pomoChannel.send({
            type: "broadcast",
            event: "REQUEST_STATE",
          })
        }
      })

    return () => {
      // ONLY tear down the websocket when the user logs out or closes the app
      supabase.removeChannel(pomoChannel)
    }
  }, [user?.id]) // DEPENDENCY ARRAY FIXED: Only depends on User ID now

  // Helper to shout our state changes to other browsers
  const broadcastState = useCallback(
    (active: boolean, time: number, breakMode: boolean) => {
      if (!user) return
      supabase.channel(`pomo_sync_${user.id}`).send({
        type: "broadcast",
        event: "SYNC_STATE",
        payload: { isActive: active, timeLeft: time, isBreak: breakMode },
      })
    },
    [user]
  )

  // 3. Timer Engine (Optimized)
  useEffect(() => {
    let interval: any

    // We only create the interval if it's active AND time is greater than 0.
    if (isPomoActive && pomoTimeLeft > 0) {
      interval = setInterval(() => {
        setPomoTimeLeft((prev) => prev - 1)
      }, 1000)
    }

    return () => clearInterval(interval)
    // The trick here is using `pomoTimeLeft > 0` as a boolean dependency.
    // It prevents the interval from restarting every single second!
  }, [isPomoActive, pomoTimeLeft > 0])

  // 4. Handle Time Completion
  useEffect(() => {
    if (pomoTimeLeft === 0 && isPomoActive) {
      setIsPomoActive(false)
      playSystemAlarm()

      // Auto-switch modes when time is up
      const nextIsBreak = !isPomoBreak
      const nextTime = nextIsBreak ? BREAK_TIME : WORK_TIME

      setIsPomoBreak(nextIsBreak)
      setPomoTimeLeft(nextTime)
      broadcastState(false, nextTime, nextIsBreak)
    }
  }, [pomoTimeLeft, isPomoActive, isPomoBreak, playSystemAlarm, broadcastState])

  // 5. Action Controls
  const togglePomoTimer = () => {
    const newState = !isPomoActive
    setIsPomoActive(newState)
    broadcastState(newState, pomoTimeLeft, isPomoBreak)
  }

  const resetPomoTimer = () => {
    const time = isPomoBreak ? BREAK_TIME : WORK_TIME
    setIsPomoActive(false)
    setPomoTimeLeft(time)
    broadcastState(false, time, isPomoBreak)
  }

  const setPomoMode = (mode: "work" | "break") => {
    const isBreak = mode === "break"
    const time = isBreak ? BREAK_TIME : WORK_TIME
    setIsPomoActive(false)
    setIsPomoBreak(isBreak)
    setPomoTimeLeft(time)
    broadcastState(false, time, isBreak)
  }

  const formatPomoTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")
    const s = (seconds % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }

  useEffect(() => {
    fetchWeekData()
    fetchDsaProgress()
  }, [fetchWeekData, fetchDsaProgress])

  return {
    IconMap,
    habits,
    logs,
    currentWeekStart,
    isLoading,
    toggleHabit,
    nextWeek,
    prevWeek,
    checksThisWeek,
    weekCompletionPct,
    dsaStreak,
    currentWeekDays,

    addHabit,
    updateHabit,
    deleteHabit,
    sundayReview,
    setSundayReview,
    saveWeeklyReview,
    isSavingReview,

    dsaData,
    dsaNotes,
    setDsaNotes,
    saveDsaNote,
    dsaCompleted,
    toggleDsaProblem,

    journals,
    saveJournalEntry,
    isSavingJournal,

    activeView,
    setActiveView,
    playerStats,
    triggerGamificationEvent,
    subtractGamificationPoints,
    recalculateAndSyncStats,

    pomoTimeLeft,
    isPomoActive,
    isPomoBreak,
    togglePomoTimer,
    resetPomoTimer,
    setPomoMode,
    formatPomoTime,
  }
}
