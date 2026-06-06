import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"
import {
  type PlayerStats,
  type GamificationEvent,
  XP_MAPPING,
  getXpForNextLevel,
  calculateRank,
  calculateStatIncrease,
  derivePlayerStats,
  type LogAggregation,
} from "@/lib/gamification"
import { SystemNotification } from "@/components/shared/Widgets/SystemNotification"
import { format, subDays } from "date-fns"

interface GamificationContextType {
  playerStats: PlayerStats | null
  triggerGamificationEvent: (event: GamificationEvent) => Promise<any>
  subtractGamificationPoints: (event: GamificationEvent) => Promise<any>
  recalculateAndSyncStats: () => Promise<PlayerStats | null>
  showNotification: (config: {
    message: string
    stat?: { label: string; value: number }
    levelUp?: number
  }) => void
}

const GamificationContext = createContext<GamificationContextType | undefined>(
  undefined
)

export function GamificationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const userId = user?.id || "anonymous"

  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null)
  const [notification, setNotification] = useState<{
    message: string
    stat?: { label: string; value: number }
    levelUp?: number
  } | null>(null)

  const fetchPlayerStats = useCallback(async () => {
    const { data, error } = await supabase
      .from("player_stats")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching player stats:", error)
      return
    }

    if (data) {
      setPlayerStats(data)
    } else {
      const { data: newData, error: initError } = await supabase
        .from("player_stats")
        .insert([{ user_id: userId }])
        .select()
        .single()

      if (initError) {
        console.error("Error initializing player stats:", initError)
      } else if (newData) {
        setPlayerStats(newData)
      }
    }
  }, [userId])

  useEffect(() => {
    if (userId !== "anonymous") {
      fetchPlayerStats()
    }
  }, [userId, fetchPlayerStats])

  const showNotification = useCallback(
    (config: {
      message: string
      stat?: { label: string; value: number }
      levelUp?: number
    }) => {
      setNotification(config)
      setTimeout(() => setNotification(null), 4000)
    },
    []
  )

  const triggerGamificationEvent = async (event: GamificationEvent) => {
    if (!playerStats) return null

    const mapping = XP_MAPPING[event.type]
    const statIncrease = calculateStatIncrease(event)

    let newXp = playerStats.xp + mapping.xp
    let newLevel = playerStats.level
    let leveledUp = false

    while (newXp >= getXpForNextLevel(newLevel)) {
      newXp -= getXpForNextLevel(newLevel)
      newLevel++
      leveledUp = true
    }

    const updatedStats = {
      ...playerStats,
      xp: newXp,
      level: newLevel,
      [statIncrease.stat]: playerStats[statIncrease.stat] + statIncrease.value,
      rank: calculateRank(newLevel, playerStats.current_streak),
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from("player_stats").upsert(updatedStats)

    if (error) {
      console.error("Failed to update gamification stats:", error)
      return null
    } else {
      setPlayerStats(updatedStats)

      // Auto-trigger notification
      showNotification({
        message: `System: ${event.type.replace(/_/g, " ")} detected.`,
        stat: {
          label: statIncrease.stat.toUpperCase(),
          value: statIncrease.value,
        },
        levelUp: leveledUp ? newLevel : undefined,
      })

      return {
        xpGained: mapping.xp,
        statGained: {
          label: statIncrease.stat.toUpperCase(),
          value: statIncrease.value,
        },
        newLevel: newLevel,
        leveledUp,
      }
    }
  }

  const subtractGamificationPoints = async (event: GamificationEvent) => {
    if (!playerStats) return null

    const mapping = XP_MAPPING[event.type]
    const statIncrease = calculateStatIncrease(event)

    let newXp = Math.max(0, playerStats.xp - mapping.xp)
    let newLevel = playerStats.level

    const updatedStats = {
      ...playerStats,
      xp: newXp,
      level: newLevel,
      [statIncrease.stat]: Math.max(
        0,
        playerStats[statIncrease.stat] - statIncrease.value
      ),
      rank: calculateRank(newLevel, playerStats.current_streak),
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from("player_stats").upsert(updatedStats)

    if (error) {
      console.error("Failed to subtract gamification stats:", error)
      return null
    } else {
      setPlayerStats(updatedStats)
      return true
    }
  }

  const recalculateAndSyncStats = useCallback(async () => {
    if (userId === "anonymous") return null

    try {
      const [
        habitLogsRes,
        dsaCompletionsRes,
        journalsRes,
        weeklyReviewsRes,
        systemDesignRes,
        financeRes,
        varsityRes,
        notesRes,
      ] = await Promise.all([
        supabase.from("habit_logs").select("*").eq("user_id", userId),
        supabase.from("dsa_completions").select("*").eq("user_id", userId),
        supabase.from("journals").select("entry_date").eq("user_id", userId),
        supabase
          .from("weekly_reviews")
          .select("week_start_date")
          .eq("user_id", userId),
        supabase
          .from("system_design_progress")
          .select("*")
          .eq("user_id", userId),
        supabase.from("expenses").select("id").eq("user_id", userId),
        supabase.from("varsity_progress").select("*").eq("user_id", userId),
        supabase.from("notes").select("id").eq("user_id", userId),
      ])

      const aggregation: LogAggregation = {
        habitLogs: habitLogsRes.data || [],
        dsaCompletions: dsaCompletionsRes.data || [],
        journals: journalsRes.data || [],
        weeklyReviews: weeklyReviewsRes.data || [],
        systemDesignProgress: systemDesignRes.data || [],
        financeLogs: financeRes.data || [],
        varsityProgress: varsityRes.data || [],
        notes: notesRes.data || [],
      }

      let globalStreak = 0
      let checkDate = new Date()
      const activityDates = new Set([
        ...aggregation.habitLogs
          .filter((l) => l.is_completed)
          .map((l) => l.log_date),
        ...aggregation.journals.map((j) => j.entry_date),
        ...aggregation.weeklyReviews.map((r) => r.week_start_date),
      ])

      let dateStr = format(checkDate, "yyyy-MM-dd")
      if (!activityDates.has(dateStr)) {
        checkDate = subDays(checkDate, 1)
        dateStr = format(checkDate, "yyyy-MM-dd")
      }
      while (activityDates.has(dateStr)) {
        globalStreak++
        checkDate = subDays(checkDate, 1)
        dateStr = format(checkDate, "yyyy-MM-dd")
      }

      const derivedStats = derivePlayerStats(userId, aggregation, globalStreak)

      const { error } = await supabase.from("player_stats").upsert(derivedStats)
      if (error) throw error

      setPlayerStats(derivedStats)
      return derivedStats
    } catch (err) {
      console.error("Error recalculating stats:", err)
      return null
    }
  }, [userId])

  return (
    <GamificationContext.Provider
      value={{
        playerStats,
        triggerGamificationEvent,
        subtractGamificationPoints,
        recalculateAndSyncStats,
        showNotification,
      }}
    >
      {children}
      <SystemNotification
        isOpen={!!notification}
        onClose={() => setNotification(null)}
        message={notification?.message || ""}
        stat={notification?.stat}
        levelUp={notification?.levelUp}
      />
    </GamificationContext.Provider>
  )
}

export function useGamification() {
  const context = useContext(GamificationContext)
  if (context === undefined) {
    throw new Error(
      "useGamification must be used within a GamificationProvider"
    )
  }
  return context
}
