import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Activity,
  Flame,
  X,
  Snowflake, // Added Snowflake icon for the streak freeze
} from "lucide-react"
import { useTracker } from "@/hooks/useTracker"
import { subDays, format } from "date-fns"
import { FloatingMenu } from "../Widgets/FloatingMenu"
import { DsaSheet } from "../Dsa/DsaSheet"
import { JournalView } from "./JournalView"
import * as Icons from "lucide-react"
import { FinanceView } from "./FinanceView"
import { SystemDesignHub } from "./SystemDesignTracker"
import { NotesTracker } from "../Notes"
import { StatusWindow } from "../Widgets/StatusWindow"
import { useState } from "react"
import { WorkoutTracker } from "./WorkoutTracker"
import { PlannerView } from "./PlannerView"
import { TimeAuditView } from "./TimeAuditView"
import { LearningChecklistView } from "./LearningChecklistView"

export default function KaizenTracker() {
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [isStreaksModalOpen, setIsStreaksModalOpen] = useState(false)
  const [isMultiplayerOpen, setIsMultiplayerOpen] = useState(false)

  const {
    habits,
    logs,
    currentWeekStart,
    isLoading,
    toggleHabit,
    nextWeek,
    prevWeek,
    checksThisWeek,
    weekCompletionPct,
    currentWeekDays,
    addHabit,
    updateHabit,
    deleteHabit,
    sundayReview,
    setSundayReview,
    saveWeeklyReview,
    isSavingReview,
    activeView,
    setActiveView,
    playerStats,
  } = useTracker()

  // NEW LOGIC: Advanced streak calculator with 21-day Streak Freeze
  const getHabitStreakDetails = (habitId: string) => {
    let streak = 0
    let freezeUsed = false
    let frozenDateStr: string | null = null // Track the exact frozen date
    let currentDate = new Date()

    // 1. Grace period: Check if today is logged
    let dateStr = format(currentDate, "yyyy-MM-dd")
    if (!logs[`${habitId}-${dateStr}`]) {
      currentDate = subDays(currentDate, 1)
    }

    // 2. Iterate backward through history
    while (true) {
      dateStr = format(currentDate, "yyyy-MM-dd")
      if (logs[`${habitId}-${dateStr}`]) {
        streak++
        currentDate = subDays(currentDate, 1)
      } else {
        // Missed a day! Can we apply a Streak Freeze?
        if (!freezeUsed) {
          let tempDate = subDays(currentDate, 1)
          let historicalStreak = 0

          // Calculate the historical contiguous streak BEFORE this missed day
          while (true) {
            let tempStr = format(tempDate, "yyyy-MM-dd")
            if (logs[`${habitId}-${tempStr}`]) {
              historicalStreak++
              tempDate = subDays(tempDate, 1)
            } else {
              break
            }
          }

          // If the user maintained at least a 21-day streak, trigger the freeze for 1 day
          if (historicalStreak >= 21) {
            freezeUsed = true
            frozenDateStr = dateStr // Remember which date was saved by the freeze
            streak += historicalStreak // Bridge the streak
            currentDate = tempDate // Skip past the historical streak
          } else {
            break // Not enough days maintained for a freeze; streak breaks
          }
        } else {
          break // Missed multiple days, or freeze already consumed
        }
      }
    }

    return { streak, freezeUsed, frozenDateStr }
  }

  // Wrapper helper to keep the sort logic working simply
  const getHabitStreak = (habitId: string) =>
    getHabitStreakDetails(habitId).streak

  // Calculate the Highest Active Streak for the KPI Card
  const highestActiveStreak =
    habits.filter((h) => !h.is_archived).length > 0
      ? Math.max(
          ...habits
            .filter((h) => !h.is_archived)
            .map((h) => getHabitStreak(h.id))
        )
      : 0

  const renderContent = () => {
    if (activeView === "habits") {
      return <div className="kaizen-page kaizen-page--habits"><HabitTrackerView habits={habits} logs={logs} currentWeekStart={currentWeekStart} isLoading={isLoading} toggleHabit={toggleHabit} nextWeek={nextWeek} prevWeek={prevWeek} checksThisWeek={checksThisWeek} weekCompletionPct={weekCompletionPct} currentWeekDays={currentWeekDays} addHabit={addHabit} updateHabit={updateHabit} deleteHabit={deleteHabit} sundayReview={sundayReview} setSundayReview={setSundayReview} saveWeeklyReview={saveWeeklyReview} isSavingReview={isSavingReview} getHabitStreakDetails={getHabitStreakDetails} highestActiveStreak={highestActiveStreak} onOpenStatus={() => setIsStatusOpen(true)} onOpenMultiplayer={() => setIsMultiplayerOpen(true)} onOpenStreaks={() => setIsStreaksModalOpen(true)} /></div>
    }
    if (activeView === "dsa") {
      return <div className="kaizen-page kaizen-page--dsa"><DsaSheet onBack={() => setActiveView("dashboard")} /></div>
    }
    if (activeView === "journal") {
      return <div className="kaizen-page kaizen-page--journal"><JournalView onBack={() => setActiveView("dashboard")} /></div>
    }
    if (activeView === "finance") {
      return <div className="kaizen-page kaizen-page--finance"><FinanceView onBack={() => setActiveView("dashboard")} /></div>
    }
    if (activeView === "system-design") {
      return <div className="kaizen-page kaizen-page--system-design"><SystemDesignHub onBack={() => setActiveView("dashboard")} /></div>
    }
    if (activeView === "notes") {
      return <div className="kaizen-page kaizen-page--notes"><NotesTracker onBack={() => setActiveView("dashboard")} /></div>
    }
    if (activeView === "workout-tracker") {
      return <div className="kaizen-page kaizen-page--workout"><WorkoutTracker onBack={() => setActiveView("dashboard")} /></div>
    }
    if (activeView === "planner") {
      return <div className="kaizen-page kaizen-page--planner"><PlannerView onBack={() => setActiveView("dashboard")} /></div>
    }
    if (activeView === "time-audit") {
      return <div className="kaizen-page kaizen-page--time-audit"><TimeAuditView onBack={() => setActiveView("dashboard")} /></div>
    }
    if (activeView === "learning-checklist") {
      return <div className="kaizen-page kaizen-page--learning"><LearningChecklistView onBack={() => setActiveView("dashboard")} /></div>
    }

    return (
      <div className="kaizen-desktop flex min-h-screen justify-center px-3 py-6 font-sans text-foreground antialiased sm:px-6 sm:py-10">
        <div className="kaizen-window w-full max-w-6xl space-y-8 sm:space-y-10">
          <header className="flex flex-col gap-5 border-b border-border/60 pb-6 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><img src="/light_icon.png" alt="" className="h-11 w-11 rounded-xl object-contain" /><div><p className="text-xl font-extrabold tracking-tight">Kaizen</p><p className="text-xs font-semibold tracking-wide text-muted-foreground">YOUR PERSONAL GROWTH WORKSPACE</p></div></div><div className="text-sm sm:text-right"><p className="font-semibold">{format(new Date(), "EEEE, d MMMM")}</p><p className="text-xs text-muted-foreground">A little progress adds up.</p></div></header>
          <section className="space-y-2"><p className="text-xs font-bold tracking-[0.18em] text-muted-foreground">YOUR SPACE</p><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Good things grow with consistency.</h1><p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">A clear overview of the areas you use to build better routines, learn, and stay organised.</p></section>
          <section className="grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-border/70 bg-card p-5"><p className="text-xs font-semibold text-muted-foreground">ACTIVE HABITS</p><p className="mt-3 text-3xl font-bold tabular-nums">{habits.filter((h) => !h.is_archived).length}</p><p className="mt-1 text-xs text-muted-foreground">Routines in your tracker</p></div><div className="rounded-2xl border border-border/70 bg-card p-5"><p className="text-xs font-semibold text-muted-foreground">THIS WEEK</p><p className="mt-3 text-3xl font-bold tabular-nums">{weekCompletionPct}%</p><p className="mt-1 text-xs text-muted-foreground">{checksThisWeek} completed check-ins</p></div><button onClick={() => setIsStatusOpen(true)} className="rounded-2xl border border-border/70 bg-card p-5 text-left transition-colors hover:bg-muted/40"><p className="text-xs font-semibold text-muted-foreground">YOUR PROGRESS</p><p className="mt-3 text-3xl font-bold">Level {playerStats?.level ?? 1}</p><p className="mt-1 text-xs text-muted-foreground">View your Kaizen status</p></button></section>
          <section className="space-y-4"><div><h2 className="text-lg font-bold">Workspaces</h2><p className="text-xs text-muted-foreground">Jump back into what matters today.</p></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{[
            { id: "habits", title: "Habit tracker", detail: "Daily check-ins, streaks and consistency", icon: "◷" },
            { id: "planner", title: "Task planner", detail: "Plan your days and manage priorities", icon: "▦" },
            { id: "learning-checklist", title: "Learning space", detail: "Track topics, goals and study progress", icon: "⌘" },
            { id: "dsa", title: "DSA practice", detail: "Topics, problems and coding notes", icon: "⌁" },
            { id: "notes", title: "Notes", detail: "Keep useful ideas and references close", icon: "≡" },
            { id: "journal", title: "Journal", detail: "Capture thoughts and reflections", icon: "✎" },
            { id: "workout-tracker", title: "Workout", detail: "Stay consistent with your training", icon: "↗" },
            { id: "time-audit", title: "Time audit", detail: "Understand where your time goes", icon: "◷" },
            { id: "finance", title: "Finance", detail: "Keep an eye on your finances", icon: "₹" },
            { id: "system-design", title: "System design", detail: "Learn and revise architecture concepts", icon: "◇" },
          ].map((item) => <button key={item.id} onClick={() => setActiveView(item.id as any)} className="group flex min-h-32 items-start gap-4 rounded-2xl border border-border/70 bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:bg-muted/30 hover:shadow-sm"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-lg font-semibold text-foreground">{item.icon}</span><span className="min-w-0"><span className="block font-bold">{item.title}</span><span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{item.detail}</span><span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground group-hover:text-foreground">Open workspace <span aria-hidden="true">↗</span></span></span></button>)}</div></section>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-muted/20 via-background to-background">
      <StatusWindow
        isOpen={isStatusOpen}
        onClose={() => setIsStatusOpen(false)}
        stats={playerStats}
      />

      {isMultiplayerOpen && (
        <div className="fixed inset-0 z-100 flex items-end justify-center bg-background/60 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-border/50 bg-card/90 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-black tracking-tight">
                  Multiplayer Mode
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create a private room and invite friends to share live habits.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMultiplayerOpen(false)}
                className="h-8 w-8 shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-border/50 bg-background/50 p-4">
                <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Room ID
                </p>
                <p className="mt-2 font-mono text-xl font-black">
                  KAIZEN-ROOM-01
                </p>
              </div>
              <Button className="w-full">Create / Join Room</Button>
              <Button variant="outline" className="w-full">
                Copy Invite Link
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Habit Streaks Modal WITH FREEZE INDICATORS */}
      {isStreaksModalOpen && (
        <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-background/80 p-4 backdrop-blur-sm duration-200 fade-in">
          <Card className="relative w-full max-w-md overflow-hidden border-border/50 bg-card/95 shadow-xl backdrop-blur-md">
            <CardHeader className="border-b border-border/20 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Active Streaks
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsStreaksModalOpen(false)}
                  className="h-8 w-8 rounded-full hover:bg-muted"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[60vh] space-y-3 overflow-y-auto p-4">
                {habits
                  .filter((h) => !h.is_archived)
                  .sort((a, b) => getHabitStreak(b.id) - getHabitStreak(a.id))
                  .map((habit) => {
                    const { streak, freezeUsed } = getHabitStreakDetails(
                      habit.id
                    )
                    const IconComponent =
                      (Icons as any)[habit.icon_name] || Activity

                    return (
                      <div
                        key={habit.id}
                        className="flex flex-col gap-2 rounded-xl border border-border/30 bg-muted/20 p-3 transition-colors hover:bg-muted/40"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg border border-border/50 bg-background p-2 text-foreground/80 shadow-sm">
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-semibold">
                              {habit.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Streak Freeze Indicator Badge */}
                            {freezeUsed && (
                              <div
                                className="flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-1"
                                title="A Streak Freeze was automatically applied to save this streak."
                              >
                                <Snowflake className="h-3.5 w-3.5 text-blue-500" />
                                <span className="text-[10px] font-bold text-blue-600 uppercase dark:text-blue-400">
                                  Frozen
                                </span>
                              </div>
                            )}

                            <div className="flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1">
                              <Flame className="h-3.5 w-3.5 text-orange-500" />
                              <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                                {streak} {streak === 1 ? "Day" : "Days"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                {habits.filter((h) => !h.is_archived).length === 0 && (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No active habits to track.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {renderContent()}

      <FloatingMenu
        onOpenDashboard={() => setActiveView("dashboard")}
        onOpenHabits={() => setActiveView("habits")}
        onOpenDSA={() => setActiveView("dsa")}
        onOpenJournal={() => setActiveView("journal")}
        onOpenFinance={() => setActiveView("finance")}
        onOpenSystemDesign={() => setActiveView("system-design")}
        onOpenNotes={() => setActiveView("notes")}
        onOpenWorkoutTracker={() => setActiveView("workout-tracker")}
        onOpenPlanner={() => setActiveView("planner")}
        onOpenTimeAudit={() => setActiveView("time-audit")}
        onOpenLearningChecklist={() => setActiveView("learning-checklist")}
        activeView={activeView}
      />
    </div>
  )
}
