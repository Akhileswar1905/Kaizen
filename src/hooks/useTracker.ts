import { addDays, subDays } from "date-fns"

import { useState, useEffect, useCallback, useMemo } from "react"
import { startOfWeek, subWeeks, addWeeks, format } from "date-fns"
import { supabase } from "@/lib/supabase"
import * as Icons from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

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
    "dashboard" | "dsa" | "journal" | "finance"
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
  }, [])

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

    // Revert if Supabase fails
    if (error) {
      console.error("Failed to save log:", error)
      setLogs((prev) => ({ ...prev, [logKey]: currentStatus }))
    }
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

    if (error) {
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
    } else {
      // Check it (Insert to Supabase)
      await supabase
        .from("dsa_completions")
        .insert([{ problem_id: problemId, user_id: userId }])
      setDsaCompleted((prev) => [...prev, problemId])
    }
  }

  const saveDsaNote = async (problemId: string, noteText: string) => {
    // Instantly update local UI state for zero-latency feedback
    setDsaNotes((prev) => ({ ...prev, [problemId]: noteText }))

    // Persist changes directly to the Supabase Cloud
    const { error } = await supabase
      .from("dsa_problems")
      .update({ notes: noteText })
      .eq("id", problemId)
      .select()
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

  const fetchWeekData = async () => {
    fetchData()
    const formattedDate = format(currentWeekStart, "yyyy-MM-dd")
    const { data: reviewData } = await supabase
      .from("weekly_reviews")
      .select("*")
      .eq("week_start_date", formattedDate)
      .single()

    if (reviewData) {
      setSundayReview({
        one_percent_win: reviewData.one_percent_win || "",
        adjustments: reviewData.adjustments || "",
      })
    } else {
      // Clear it if no review exists for this week yet
      setSundayReview({ one_percent_win: "", adjustments: "" })
    }

    const { data: problems } = await supabase.from("dsa_problems").select("*")
    if (problems) {
      const grouped = problems.reduce(
        (acc, curr) => {
          if (!acc[curr.category]) acc[curr.category] = []
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
  }

  async function fetchDsaProgress() {
    const { data, error } = await supabase.from("dsa_problems").select("id")

    const { data: progressData, error: progressError } = await supabase
      .from("dsa_completions")
      .select("problem_id")
      .eq("user_id", userId)

    if (data && !error && !progressError) {
      const completedIds = progressData?.map((p) => p.problem_id)

      // Reduce data array into an easily readable key-value pair map for the UI
      const notesMap = completedIds?.reduce(
        (acc, current) => {
          if (current.notes) acc[current.id] = current.notes
          return acc
        },
        {} as Record<string, string>
      )

      setDsaCompleted(completedIds || [])
      setDsaNotes(notesMap)
    }
  }

  useEffect(() => {
    fetchWeekData()
    fetchDsaProgress()
  }, [currentWeekStart])

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
  }
}
