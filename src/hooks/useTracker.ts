import { addDays, subDays } from "date-fns"

import { useState, useEffect, useCallback } from "react"
import { startOfWeek, subWeeks, addWeeks, format } from "date-fns"
import { supabase } from "@/lib/supabase"

export type Habit = {
  id: string
  title: string
  description: string
  target_days: number
  icon_name: string
  is_archived: boolean
}

export function useTracker() {
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

  // Fetch initial data
  const fetchData = useCallback(async () => {
    setIsLoading(true)

    // 1. Fetch Habits
    const { data: habitsData } = await supabase.from("habits").select("*")

    if (habitsData) setHabits(habitsData)

    // 2. Fetch all logs (you might want to filter this by date range later)
    const { data: logsData } = await supabase.from("habit_logs").select("*")

    if (logsData) {
      const logMap: Record<string, boolean> = {}
      logsData.forEach((log) => {
        logMap[`${log.habit_id}-${log.log_date}`] = log.is_completed
      })
      setLogs(logMap)
    }

    setIsLoading(false)
  }, [])

  const addHabit = async (newHabit: any) => {
    const { data, error } = await supabase
      .from("habits")
      .insert([newHabit])
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
    const { error } = await supabase.from("habits").delete().eq("id", habitId)

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
      },
      { onConflict: "week_start_date" } // This prevents duplicates!
    )

    if (error) {
      console.error("Error saving review:", error)
    }
    setIsSavingReview(false)
  }

  useEffect(() => {
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
    }

    fetchWeekData()
  }, [currentWeekStart])
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

  return {
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
  }
}
