import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  ChevronLeft,
  ChevronRight,
  Star,
  RefreshCw,
  Activity,
  Loader2,
  UserCircle,
  CheckCircle2,
  Flame,
  X,
  Users,
  Snowflake, // Added Snowflake icon for the streak freeze
} from "lucide-react"
import { useTracker } from "@/hooks/useTracker"
import { addDays, subDays, format } from "date-fns"
import { Heatmap } from "../Habits/Heatmap"
import { AddHabitModal } from "../Habits/AddHabit"
import { HabitActions } from "../Habits/HabitActions"
import { FloatingMenu } from "../Widgets/FloatingMenu"
import { DsaSheet } from "../Dsa/DsaSheet"
import { JournalView } from "./JournalView"
import * as Icons from "lucide-react"
import { FinanceView } from "./FinanceView"
import { SystemDesignHub } from "./SystemDesignTracker"
import { NotesTracker } from "../Notes"
import { StatusWindow } from "../Widgets/StatusWindow"
import { useState } from "react"
import { cn } from "@/lib/utils"
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
      <div className="kaizen-desktop flex min-h-screen justify-center px-3 py-4 font-sans text-foreground antialiased sm:px-6 sm:py-8">
        <div className="kaizen-window w-full max-w-5xl space-y-7 sm:space-y-9">
          {/* Dashboard identity and weekly controls */}
          <header className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-card/75 p-5 shadow-sm backdrop-blur-xl sm:p-7">
            <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-primary/[0.06] blur-3xl" />
            <div className="relative flex flex-col gap-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img src="/light_icon.png" alt="Kaizen" className="h-12 w-auto object-contain sm:h-14" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Your personal workspace</p>
                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">A little better, every day.</h1>
                  </div>
                </div>
                <div className="hidden rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-right sm:block">
                  <p className="text-xs font-semibold text-muted-foreground">{format(new Date(), "EEEE")}</p>
                  <p className="mt-0.5 text-lg font-bold tracking-tight">{format(new Date(), "d MMMM")}</p>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-4 border-t border-border/50 pt-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-xl border border-border/60 bg-background/75 p-1 shadow-sm">
                    <Button variant="ghost" size="icon" onClick={prevWeek} className="h-8 w-8 rounded-lg"><ChevronLeft className="h-4 w-4" /></Button>
                    <span className="min-w-36 px-2 text-center text-sm font-semibold">{format(currentWeekStart, "d MMM")} – {format(addDays(currentWeekStart, 6), "d MMM")}</span>
                    <Button variant="ghost" size="icon" onClick={nextWeek} className="h-8 w-8 rounded-lg"><ChevronRight className="h-4 w-4" /></Button>
                  </div>
                  <span className="hidden text-xs font-medium text-muted-foreground md:inline">Weekly overview</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setIsStatusOpen(true)} className="h-10 w-10 rounded-xl border-border/60 bg-background/70" title="Your status"><UserCircle className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" onClick={() => setIsMultiplayerOpen(true)} className="h-10 w-10 rounded-xl border-border/60 bg-background/70" title="Multiplayer"><Users className="h-4 w-4" /></Button>
                  <AddHabitModal onAddHabit={addHabit} />
                </div>
              </div>
            </div>
          </header>

          {/* Focus panel */}
          <section className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
            <Card className="overflow-hidden rounded-[1.75rem] border-border/60 bg-card shadow-sm">
              <CardContent className="relative p-5 sm:p-7">
                <div className="pointer-events-none absolute -bottom-20 -right-12 h-56 w-56 rounded-full bg-primary/[0.055] blur-3xl" />
                <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                  <div className="max-w-md">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/55 px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                      <Activity className="h-3.5 w-3.5" /> Your weekly rhythm
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Progress is built in the small moments.</h2>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">Keep showing up for the habits that matter. Every check-in is another step forward.</p>
                  </div>
                  <div className="flex items-end gap-3">
                    <span className="text-5xl font-bold tracking-tighter tabular-nums">{weekCompletionPct}<span className="text-2xl text-muted-foreground">%</span></span>
                    <span className="mb-1.5 text-xs font-semibold text-muted-foreground">week complete</span>
                  </div>
                </div>
                <div className="relative mt-7">
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-foreground/75 transition-all duration-500" style={{ width: `${Math.max(0, Math.min(100, weekCompletionPct))}%` }} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs font-medium text-muted-foreground">
                    <span>{checksThisWeek} check-ins completed</span>
                    <span>{habits.filter((h) => !h.is_archived).length} active habits</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
              <Card className="rounded-[1.5rem] border-border/60 bg-card/80 shadow-sm">
                <CardContent className="flex h-full items-center justify-between gap-3 p-4 sm:p-5">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">Checks this week</p>
                    <p className="mt-1 text-3xl font-bold tracking-tight tabular-nums">{checksThisWeek}</p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted text-foreground"><CheckCircle2 className="h-5 w-5" /></span>
                </CardContent>
              </Card>
              <Card onClick={() => setIsStreaksModalOpen(true)} className="cursor-pointer rounded-[1.5rem] border-border/60 bg-card/80 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <CardContent className="flex h-full items-center justify-between gap-3 p-4 sm:p-5">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">Longest active streak</p>
                    <p className="mt-1 text-3xl font-bold tracking-tight tabular-nums">{highestActiveStreak}<span className="ml-1 text-sm font-semibold text-muted-foreground">days</span></p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted text-foreground"><Flame className="h-5 w-5" /></span>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Habit check-in workspace */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3 px-1">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Stay consistent</p>
                <h2 className="mt-1 text-xl font-bold tracking-tight">Your habits</h2>
              </div>
              <span className="rounded-full border border-border/60 bg-card/70 px-3 py-1.5 text-xs font-semibold text-muted-foreground">{habits.filter((h) => !h.is_archived).length} in progress</span>
            </div>

            {isLoading ? (
              <div className="flex h-52 flex-col items-center justify-center gap-3 rounded-[1.5rem] border border-dashed border-border bg-card/40">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">Loading your habits…</p>
              </div>
            ) : habits.filter((h) => !h.is_archived).length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-border bg-card/40 p-8 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground"><Activity className="h-5 w-5" /></span>
                <h3 className="mt-4 text-base font-bold">Make room for a new routine</h3>
                <p className="mt-1 max-w-xs text-sm text-muted-foreground">Start with something small and repeatable. Your progress will build from there.</p>
                <div className="mt-4"><AddHabitModal onAddHabit={addHabit} /></div>
              </div>
            ) : (
              habits.filter((habit) => !habit.is_archived).map((habit) => {
                const { frozenDateStr } = getHabitStreakDetails(habit.id)
                const completedCount = currentWeekDays.reduce((count, date) => {
                  const dateStr = format(date, "yyyy-MM-dd")
                  return count + (logs[`${habit.id}-${dateStr}`] ? 1 : 0)
                }, 0)
                const isTargetMet = completedCount >= habit.target_days
                const IconComponent = (Icons as any)[habit.icon_name] || Activity

                return (
                  <Card key={habit.id} className={cn("overflow-hidden rounded-[1.5rem] border-border/60 bg-card/85 shadow-sm transition-all duration-200 hover:shadow-md", isTargetMet && "border-foreground/20")}>
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-muted/65 text-foreground", isTargetMet && "bg-foreground text-background")}><IconComponent className="h-5 w-5" /></span>
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-bold sm:text-base">{habit.title}</h3>
                            {habit.description && <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{habit.description}</p>}
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-2 rounded-2xl bg-muted/35 px-3 py-2.5 lg:justify-center lg:bg-transparent lg:px-0">
                          {currentWeekDays.map((date) => {
                            const dateStr = format(date, "yyyy-MM-dd")
                            const isChecked = Boolean(logs[`${habit.id}-${dateStr}`])
                            const isFrozenDay = dateStr === frozenDateStr
                            return (
                              <div key={dateStr} className="flex min-w-8 flex-col items-center gap-1.5">
                                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{format(date, "EEEEE")}</span>
                                {isFrozenDay ? (
                                  <button onClick={() => toggleHabit(habit.id, date)} title="Streak freeze auto-applied" className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground"><Snowflake className="h-3.5 w-3.5" /></button>
                                ) : (
                                  <Checkbox checked={isChecked} onCheckedChange={() => toggleHabit(habit.id, date)} className="h-7 w-7 rounded-full border-muted-foreground/30 data-[state=checked]:border-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-background" />
                                )}
                              </div>
                            )
                          })}
                        </div>
                        <div className="flex items-center justify-between gap-3 border-t border-border/50 pt-3 lg:w-36 lg:justify-end lg:border-0 lg:pt-0">
                          <span className={cn("text-xs font-semibold tabular-nums", isTargetMet ? "text-foreground" : "text-muted-foreground")}>{completedCount}/{habit.target_days} days</span>
                          <HabitActions habit={habit} onUpdate={updateHabit} onDelete={deleteHabit} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </section>

          {/* Weekly reflection */}
          <section className="space-y-4 border-t border-border/50 pt-7">
            <div className="px-1">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Pause and reflect</p>
              <h2 className="mt-1 text-xl font-bold tracking-tight">A moment for your week</h2>
            </div>
            {isSavingReview && <p className="px-1 text-xs font-medium text-muted-foreground">Saving your reflection…</p>}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="rounded-[1.5rem] border-border/60 bg-card/75 shadow-sm">
                <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm font-bold"><Star className="h-4 w-4 text-muted-foreground" /> A win worth remembering</CardTitle></CardHeader>
                <CardContent><Textarea placeholder="What went well this week?" className="min-h-28 resize-none rounded-xl border-border/60 bg-background/60 text-sm leading-relaxed" value={sundayReview.one_percent_win} onChange={(e) => setSundayReview((prev) => ({ ...prev, one_percent_win: e.target.value }))} onBlur={() => saveWeeklyReview(sundayReview.one_percent_win, sundayReview.adjustments)} /></CardContent>
              </Card>
              <Card className="rounded-[1.5rem] border-border/60 bg-card/75 shadow-sm">
                <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm font-bold"><RefreshCw className="h-4 w-4 text-muted-foreground" /> One thing to improve</CardTitle></CardHeader>
                <CardContent><Textarea placeholder="What would make next week smoother?" className="min-h-28 resize-none rounded-xl border-border/60 bg-background/60 text-sm leading-relaxed" value={sundayReview.adjustments} onChange={(e) => setSundayReview((prev) => ({ ...prev, adjustments: e.target.value }))} onBlur={() => saveWeeklyReview(sundayReview.one_percent_win, sundayReview.adjustments)} /></CardContent>
              </Card>
            </div>
          </section>

          {/* Consistency history */}
          <section className="space-y-3 border-t border-border/50 pt-7">
            <div className="px-1">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">The bigger picture</p>
              <h2 className="mt-1 text-xl font-bold tracking-tight">Your consistency</h2>
            </div>
            <div className="rounded-[1.5rem] border border-border/60 bg-card/65 p-4 shadow-sm sm:p-5">
              <Heatmap logs={logs} />
            </div>
          </section>
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
