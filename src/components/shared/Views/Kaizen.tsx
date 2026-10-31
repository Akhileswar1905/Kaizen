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
import { HabitTrackerView } from "./HabitTrackerView"

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
      return <div className="kaizen-page kaizen-page--finance"><FinanceView /></div>
    }
    if (activeView === "system-design") {
      return <div className="kaizen-page kaizen-page--system-design"><SystemDesignHub onBack={() => setActiveView("dashboard")} /></div>
    }
    if (activeView === "notes") {
      return <div className="kaizen-page kaizen-page--notes"><NotesTracker /></div>
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
      return <div className="kaizen-page kaizen-page--learning"><LearningChecklistView /></div>
    }

    return (
      <main className="kaizen-dashboard min-h-screen w-full px-3 pb-28 pt-5 text-foreground antialiased sm:px-6 sm:pt-8 xl:px-10">
        <div className="mx-auto w-full max-w-[1440px] space-y-8">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
            <div className="flex items-center gap-3">
              <img src="/light_icon.png" alt="Kaizen logo" className="h-12 w-12 shrink-0 rounded-2xl border border-border/70 bg-card p-1 object-contain shadow-sm" />
              <div><p className="text-2xl font-extrabold tracking-tight">Kaizen</p><p className="text-[11px] font-bold tracking-[0.15em] text-muted-foreground">PERSONAL GROWTH WORKSPACE</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block"><p className="text-sm font-bold">{format(new Date(), "EEEE, d MMMM")}</p><p className="text-xs text-muted-foreground">Make today count.</p></div>
              <Button variant="outline" size="icon" onClick={() => setIsStatusOpen(true)} className="h-10 w-10 rounded-xl" title="Your progress"><Icons.UserRound className="h-4 w-4" /></Button>
            </div>
          </header>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <div className="rounded-2xl border border-border/70 bg-card p-4"><p className="text-[11px] font-bold tracking-wide text-muted-foreground">ACTIVE HABITS</p><p className="mt-2 text-3xl font-extrabold tabular-nums">{activeHabits.length}</p><p className="mt-1 text-xs text-muted-foreground">Routines you're building</p></div>
            <div className="rounded-2xl border border-border/70 bg-card p-4"><p className="text-[11px] font-bold tracking-wide text-muted-foreground">TODAY'S PROGRESS</p><p className="mt-2 text-3xl font-extrabold tabular-nums">{completedToday}<span className="text-base font-bold text-muted-foreground"> / {activeHabits.length}</span></p><p className="mt-1 text-xs text-muted-foreground">{todayProgress}% of habits checked in</p></div>
            <div className="rounded-2xl border border-border/70 bg-card p-4"><p className="text-[11px] font-bold tracking-wide text-muted-foreground">WEEKLY CHECK-INS</p><p className="mt-2 text-3xl font-extrabold tabular-nums">{checksThisWeek}</p><p className="mt-1 text-xs text-muted-foreground">Completed this week</p></div>
            <button onClick={() => setIsStreaksModalOpen(true)} className="rounded-2xl border border-border/70 bg-card p-4 text-left transition-colors hover:bg-muted/40"><p className="text-[11px] font-bold tracking-wide text-muted-foreground">BEST ACTIVE STREAK</p><p className="mt-2 text-3xl font-extrabold tabular-nums">{highestActiveStreak}<span className="ml-1 text-base font-bold text-muted-foreground">days</span></p><p className="mt-1 text-xs text-muted-foreground">View all habit streaks</p></button>
            <button onClick={() => setIsStatusOpen(true)} className="rounded-2xl border border-border/70 bg-card p-4 text-left transition-colors hover:bg-muted/40"><p className="text-[11px] font-bold tracking-wide text-muted-foreground">KAIZEN LEVEL</p><p className="mt-2 text-3xl font-extrabold tabular-nums">{playerStats?.level ?? 1}</p><p className="mt-1 text-xs text-muted-foreground">Your overall progress</p></button>
          </section>

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.75fr)]">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-card p-6 sm:p-9">
              <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-muted/70 blur-3xl" />
              <div className="relative max-w-2xl">
                <p className="text-xs font-bold tracking-[0.18em] text-muted-foreground">YOUR SPACE, AT A GLANCE</p>
                <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">Small steps.<br />Steady progress.</h1>
                <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">A calmer place to build routines, make time for what matters, and keep growing a little every day.</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button onClick={() => setActiveView("habits")} className="h-11 rounded-xl px-5 font-bold"><Icons.CheckCircle2 className="mr-2 h-4 w-4" />Go to habits</Button>
                  <Button variant="outline" onClick={() => setActiveView("planner")} className="h-11 rounded-xl px-5 font-bold"><Icons.CalendarDays className="mr-2 h-4 w-4" />Plan your day</Button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-1">
              <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6">
                <div className="flex items-center justify-between gap-2"><p className="text-xs font-bold tracking-wide text-muted-foreground">WEEKLY CONSISTENCY</p><Icons.ChartNoAxesColumnIncreasing className="h-4 w-4 text-muted-foreground" /></div>
                <p className="mt-3 text-4xl font-extrabold tabular-nums">{weekCompletionPct}<span className="ml-1 text-xl text-muted-foreground">%</span></p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-foreground/75 transition-all" style={{ width: Math.max(0, Math.min(100, weekCompletionPct)) + "%" }} /></div>
                <p className="mt-2 text-xs text-muted-foreground">{checksThisWeek} check-ins completed this week</p>
              </div>
              <button onClick={() => setIsStatusOpen(true)} className="rounded-2xl border border-border/70 bg-card p-5 text-left transition-colors hover:bg-muted/40 sm:p-6">
                <div className="flex items-center justify-between gap-2"><p className="text-xs font-bold tracking-wide text-muted-foreground">YOUR LEVEL</p><Icons.Orbit className="h-4 w-4 text-muted-foreground" /></div>
                <p className="mt-3 text-4xl font-extrabold tabular-nums">{playerStats?.level ?? 1}</p><p className="mt-2 text-xs text-muted-foreground">Open your progress and achievements</p>
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-2"><div><p className="text-xs font-bold tracking-[0.16em] text-muted-foreground">JUMP BACK IN</p><h2 className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">Your everyday workspaces</h2></div><p className="text-xs text-muted-foreground">Pick up where you left off</p></div>
            <div className="grid gap-4 lg:grid-cols-2">
              <button onClick={() => setActiveView("habits")} className="group flex min-h-44 items-start justify-between gap-5 rounded-2xl border border-border/70 bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-md sm:p-6">
                <span><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted"><Icons.CalendarCheck className="h-5 w-5" /></span><span className="mt-5 block text-lg font-extrabold">Habit tracker</span><span className="mt-1 block max-w-sm text-sm text-muted-foreground">Build routines with daily check-ins and streaks.</span><span className="mt-4 block text-xs font-bold text-muted-foreground">{habits.filter((h) => !h.is_archived).length} active habits</span></span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground group-hover:text-foreground"><Icons.ArrowUpRight className="h-4 w-4" /></span>
              </button>
              <button onClick={() => setActiveView("planner")} className="group flex min-h-44 items-start justify-between gap-5 rounded-2xl border border-border/70 bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-md sm:p-6">
                <span><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted"><Icons.CalendarDays className="h-5 w-5" /></span><span className="mt-5 block text-lg font-extrabold">Task planner</span><span className="mt-1 block max-w-sm text-sm text-muted-foreground">Shape your day and keep important work moving.</span><span className="mt-4 block text-xs font-bold text-muted-foreground">Daily planning</span></span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground group-hover:text-foreground"><Icons.ArrowUpRight className="h-4 w-4" /></span>
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <div><p className="text-xs font-bold tracking-[0.16em] text-muted-foreground">MORE TOOLS</p><h2 className="mt-1 text-xl font-extrabold tracking-tight">Everything else, in one place</h2></div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { id: "learning-checklist", title: "Learning space", description: "Keep learning goals and topics on track.", icon: Icons.GraduationCap, meta: "Study progress" },
                { id: "dsa", title: "DSA practice", description: "Work through problems and revisit notes.", icon: Icons.Braces, meta: "Problem solving" },
                { id: "notes", title: "Notes", description: "Save ideas, references and useful details.", icon: Icons.NotebookPen, meta: "Knowledge base" },
                { id: "journal", title: "Journal", description: "Make space for reflection and daily thoughts.", icon: Icons.BookOpen, meta: "Personal reflection" },
                { id: "workout-tracker", title: "Workout", description: "Keep your training consistent over time.", icon: Icons.Dumbbell, meta: "Training log" },
                { id: "time-audit", title: "Time audit", description: "See how your time is spent.", icon: Icons.Clock3, meta: "Time awareness" },
                { id: "finance", title: "Finance", description: "Track your money and stay intentional.", icon: Icons.Wallet, meta: "Money overview" },
                { id: "system-design", title: "System design", description: "Organise architecture concepts and revision.", icon: Icons.Network, meta: "Technical learning" },
              ].map((item) => (
                <button key={item.id} onClick={() => setActiveView(item.id as any)} className="group flex min-h-36 items-start gap-3 rounded-2xl border border-border/70 bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-foreground/25 hover:bg-muted/20 hover:shadow-sm">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted"><item.icon className="h-[18px] w-[18px]" /></span>
                  <span className="min-w-0 flex-1"><span className="block font-bold">{item.title}</span><span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{item.description}</span><span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground group-hover:text-foreground">{item.meta}<Icons.ArrowUpRight className="h-3 w-3" /></span></span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>
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
