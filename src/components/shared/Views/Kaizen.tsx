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
  Percent,
  CalendarDays,
  Play,
  Pause,
  RotateCcw,
  X,
  Settings,
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
import { PomodoroSettingsModal } from "../Widgets/Pomodoro Settings"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { WorkoutTracker } from "./WorkoutTracker"

export default function KaizenTracker() {
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [isStreaksModalOpen, setIsStreaksModalOpen] = useState(false)
  const [isPomoSettingsOpen, setIsPomoSettingsOpen] = useState(false)
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
    dsaStreak,
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
    pomoTimeLeft,
    isPomoActive,
    isPomoBreak,
    togglePomoTimer,
    resetPomoTimer,
    setPomoMode,
    formatPomoTime,
    workDuration,
    breakDuration,
    savePomoSettings,
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
      return <DsaSheet onBack={() => setActiveView("dashboard")} />
    }
    if (activeView === "journal") {
      return <JournalView onBack={() => setActiveView("dashboard")} />
    }
    if (activeView === "finance") {
      return <FinanceView onBack={() => setActiveView("dashboard")} />
    }
    if (activeView === "system-design") {
      return <SystemDesignHub onBack={() => setActiveView("dashboard")} />
    }
    if (activeView === "notes") {
      return <NotesTracker onBack={() => setActiveView("dashboard")} />
    }
    if (activeView === "workout-tracker") {
      return <WorkoutTracker onBack={() => setActiveView("dashboard")} />
    }
    return (
      <div className="flex min-h-screen justify-center bg-background/50 px-3 py-6 font-sans text-foreground antialiased sm:px-6 sm:py-10 md:px-12 md:py-14">
        <div className="w-full max-w-4xl space-y-8 sm:space-y-10">
          {/* Header Section */}
          <header className="flex flex-col gap-4 border-b border-border/40 pb-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Left Column: Branding */}
            <div className="flex items-center gap-4">
              <div className="group relative">
                <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-primary/20 to-purple-500/20 opacity-0 blur transition duration-500 group-hover:opacity-100" />
                <img
                  src="/light_icon.png"
                  alt="Kaizen Logo"
                  className="relative h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:h-16"
                />
              </div>
              <div>
                <h1 className="bg-linear-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-2xl font-extrabold tracking-tight text-transparent sm:text-3xl">
                  Kaizen
                </h1>
                <p className="mt-0.5 text-sm font-medium text-muted-foreground/80">
                  Small wins, every day
                </p>
              </div>
            </div>

            {/* Right Column: Dynamic Action Control Deck */}
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
              <div className="flex flex-1 items-center justify-between rounded-xl border border-border/60 bg-card/40 p-1.5 shadow-sm backdrop-blur-sm sm:flex-initial sm:gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevWeek}
                  className="h-8 w-8 shrink-0 rounded-lg hover:bg-muted"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="flex items-center gap-1.5 px-3 text-xs font-semibold tracking-tight text-foreground/90 sm:text-sm">
                  <CalendarDays className="h-3.5 w-3.5 text-muted-foreground/70" />
                  {format(currentWeekStart, "d MMM")} –{" "}
                  {format(addDays(currentWeekStart, 6), "d MMM")}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextWeek}
                  className="h-8 w-8 shrink-0 rounded-lg hover:bg-muted"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex w-full items-center gap-2 sm:w-auto">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsStatusOpen(true)}
                  className="h-10 w-10 shrink-0 rounded-full border-border/50 bg-card/60 shadow-sm transition-all hover:bg-blue-500/10"
                  title="Status"
                >
                  <UserCircle className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsMultiplayerOpen(true)}
                  className="h-10 w-10 shrink-0 rounded-full border-border/50 bg-card/60 shadow-sm transition-all hover:bg-blue-500/10"
                  title="Multiplayer"
                >
                  <Users className="h-5 w-5" />
                </Button>
                <div className="flex-1 sm:flex-none">
                  <AddHabitModal onAddHabit={addHabit} />
                </div>
              </div>
            </div>
          </header>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            {[
              {
                label: "Checks this week",
                value: checksThisWeek,
                icon: CheckCircle2,
                color:
                  "text-emerald-500 bg-emerald-500/5 border-emerald-500/10",
              },
              {
                label: "Highest Streak", // Changed label to be more generic
                value: highestActiveStreak, // Replaced dsaStreak with dynamic calculation
                icon: Flame,
                color: "text-orange-500 bg-orange-500/5 border-orange-500/10",
                onClick: () => setIsStreaksModalOpen(true),
              },
              {
                label: "Week completion",
                value: `${weekCompletionPct}%`,
                icon: Percent,
                color: "text-blue-500 bg-blue-500/5 border-blue-500/10",
              },
            ].map((stat, i) => (
              <Card
                key={i}
                onClick={stat.onClick}
                className={cn(
                  "relative overflow-hidden border border-border/50 bg-card/60 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-md",
                  stat.color,
                  stat.onClick && "cursor-pointer hover:scale-[1.02]"
                )}
              >
                <CardContent className="flex flex-col items-center justify-center p-4 text-center md:p-6">
                  <div className="absolute top-3 right-3 opacity-20">
                    <stat.icon className="h-5 w-5 md:h-6 md:w-6" />
                  </div>
                  <h2 className="mb-1 text-3xl font-black tracking-tight text-foreground md:text-4xl">
                    {stat.value}
                  </h2>
                  <p className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase md:text-xs">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pomodoro Focus Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                Focus Session
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground/60">
                  {isPomoActive ? "Running" : "Idle"}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsPomoSettingsOpen(true)}
                  className="h-7 w-7 rounded-md text-muted-foreground hover:bg-muted"
                  title="Pomodoro Settings"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Card className="relative overflow-hidden border border-border/50 bg-card/60 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-md">
              <CardContent className="flex flex-col items-center justify-center p-8 sm:p-10">
                <div className="mb-6 flex gap-2 rounded-full border border-border/50 bg-muted/40 p-1 backdrop-blur-sm">
                  <button
                    onClick={() => setPomoMode("work")}
                    className={cn(
                      "rounded-full px-5 py-1.5 text-xs font-bold transition-all",
                      !isPomoBreak
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Focus
                  </button>
                  <button
                    onClick={() => setPomoMode("break")}
                    className={cn(
                      "rounded-full px-5 py-1.5 text-xs font-bold transition-all",
                      isPomoBreak
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Break
                  </button>
                </div>

                <div className="mb-8 font-mono text-6xl font-black tracking-tighter text-foreground sm:text-8xl">
                  {formatPomoTime(pomoTimeLeft)}
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    onClick={togglePomoTimer}
                    className="h-12 w-36 rounded-xl font-bold tracking-wide transition-all hover:opacity-90"
                  >
                    {isPomoActive ? (
                      <Pause className="mr-2 h-4 w-4" />
                    ) : (
                      <Play className="mr-2 h-4 w-4" />
                    )}
                    {isPomoActive ? "Pause" : "Start"}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={resetPomoTimer}
                    className="h-12 w-12 rounded-xl border-border/50 bg-background/50 hover:bg-muted"
                  >
                    <RotateCcw className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Habits List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                Active Frameworks
              </h2>
              <span className="text-xs font-medium text-muted-foreground/60">
                {habits.filter((h) => !h.is_archived).length} Tracking
              </span>
            </div>

            {isLoading ? (
              <div className="flex h-64 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed bg-card/30">
                <Loader2 className="h-7 w-7 animate-spin text-muted-foreground/70" />
                <p className="text-xs font-semibold tracking-tight text-muted-foreground/70">
                  Synchronizing matrix data...
                </p>
              </div>
            ) : habits.length === 0 ? (
              <div className="flex h-64 w-full flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-card/30 p-6 text-center">
                <div className="rounded-full bg-muted/40 p-3 text-muted-foreground">
                  <Activity className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">
                    No habits operating
                  </p>
                  <p className="max-w-xs text-xs text-muted-foreground">
                    Initialize small routines to begin compounding daily
                    operational wins.
                  </p>
                </div>
              </div>
            ) : (
              habits
                .filter((habit) => !habit.is_archived)
                .map((habit) => {
                  const { frozenDateStr } = getHabitStreakDetails(habit.id)
                  const completedCount = currentWeekDays.reduce(
                    (count, date) => {
                      const dateStr = format(date, "yyyy-MM-dd")
                      const isCompleted = logs[`${habit.id}-${dateStr}`]
                      return count + (isCompleted ? 1 : 0)
                    },
                    0
                  )
                  const isTargetMet = completedCount >= habit.target_days

                  return (
                    <Card
                      key={habit.id}
                      className={cn(
                        "group border border-border/50 bg-card/70 backdrop-blur-sm transition-all duration-200 hover:border-border/80 hover:shadow-sm",
                        isTargetMet &&
                          "bg-linear-to-r from-card/70 to-emerald-500/1"
                      )}
                    >
                      <CardContent className="flex flex-col justify-between gap-6 p-4 md:flex-row md:items-center md:p-5">
                        <div className="flex min-w-55 items-start gap-4 md:items-center">
                          <div
                            className={cn(
                              "rounded-xl border p-2.5 text-secondary-foreground shadow-sm transition-colors",
                              isTargetMet
                                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                                : "border-border bg-muted/60"
                            )}
                          >
                            {(() => {
                              const IconComponent = (Icons as any)[
                                habit.icon_name
                              ]
                              return IconComponent ? (
                                <IconComponent className="h-5 w-5" />
                              ) : (
                                <Activity className="h-5 w-5" />
                              )
                            })()}
                          </div>
                          <div className="space-y-0.5">
                            <h3 className="text-sm font-bold tracking-tight text-foreground transition-colors group-hover:text-primary md:text-base">
                              {habit.title}
                            </h3>
                            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground/80">
                              {habit.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex w-full max-w-md flex-1 items-center justify-between rounded-xl border border-border/30 bg-muted/30 p-2.5 md:w-auto md:border-0 md:bg-transparent md:p-0">
                          {currentWeekDays.map((date) => {
                            const dateStr = format(date, "yyyy-MM-dd")
                            const dayName = format(date, "EEE")
                            const isChecked =
                              logs[`${habit.id}-${dateStr}`] || false

                            // Check if this specific day is the one being bridged by the freeze
                            const isFrozenDay = dateStr === frozenDateStr

                            return (
                              <div
                                key={dateStr}
                                className="flex flex-col items-center gap-1.5"
                              >
                                <span
                                  className={cn(
                                    "text-[10px] font-bold tracking-wider uppercase transition-colors",
                                    isChecked
                                      ? "text-primary/90"
                                      : isFrozenDay
                                        ? "text-blue-500"
                                        : "text-muted-foreground/60"
                                  )}
                                >
                                  {dayName}
                                </span>

                                {isFrozenDay ? (
                                  // FROZEN STATE VISUAL
                                  <button
                                    onClick={() => toggleHabit(habit.id, date)}
                                    className="flex h-7 w-7 items-center justify-center rounded-md border border-blue-500/40 bg-blue-500/10 shadow-sm ring-1 ring-blue-500/20 transition-all hover:bg-blue-500/20"
                                    title="Streak Freeze Auto-Applied"
                                  >
                                    <Snowflake className="h-4 w-4 text-blue-500" />
                                  </button>
                                ) : (
                                  // NORMAL CHECKBOX
                                  <Checkbox
                                    className={cn(
                                      "h-7 w-7 rounded-md border-muted-foreground/30 transition-all duration-150 hover:border-primary/50 focus-visible:ring-offset-background data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500 data-[state=checked]:shadow-sm data-[state=checked]:shadow-emerald-500/20"
                                    )}
                                    checked={isChecked}
                                    onCheckedChange={() =>
                                      toggleHabit(habit.id, date)
                                    }
                                  />
                                )}
                              </div>
                            )
                          })}
                        </div>

                        <div className="flex items-center justify-between gap-3 border-t border-border/30 pt-3 md:justify-end md:border-0 md:pt-0">
                          <span
                            className={cn(
                              "rounded-full border px-2.5 py-0.5 text-xs font-bold tracking-tight whitespace-nowrap transition-colors",
                              isTargetMet
                                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                                : "border-border bg-secondary text-muted-foreground"
                            )}
                          >
                            {completedCount} / {habit.target_days} Days
                          </span>

                          <div className="opacity-80 transition-opacity hover:opacity-100">
                            <HabitActions
                              habit={habit}
                              onUpdate={updateHabit}
                              onDelete={deleteHabit}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
            )}
          </div>

          {/* Sunday Review Section */}
          <div className="space-y-4 border-t border-border/40 pt-8">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                Retrospective Loop
              </h2>
              {isSavingReview && (
                <div className="flex animate-pulse items-center gap-1.5 text-xs font-medium text-muted-foreground/70">
                  <Loader2 className="h-3 w-3 animate-spin text-primary" />{" "}
                  Auto-syncing updates
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
              <Card className="border border-border/50 bg-card/60 shadow-sm backdrop-blur-sm transition-all duration-300 focus-within:border-primary/40">
                <CardHeader className="pb-2.5">
                  <CardTitle className="flex items-center gap-2 text-xs font-bold tracking-wide text-foreground/80 uppercase">
                    <Star className="h-4 w-4 text-amber-500" /> My 1% Win This
                    Week
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Identify metrics or concepts resolved without assistance..."
                    className="min-h-27.5 resize-none rounded-xl border-border/50 bg-background/40 text-sm leading-relaxed placeholder:text-muted-foreground/50 focus-visible:ring-primary/20"
                    value={sundayReview.one_percent_win}
                    onChange={(e) =>
                      setSundayReview((prev) => ({
                        ...prev,
                        one_percent_win: e.target.value,
                      }))
                    }
                    onBlur={() =>
                      saveWeeklyReview(
                        sundayReview.one_percent_win,
                        sundayReview.adjustments
                      )
                    }
                  />
                </CardContent>
              </Card>

              <Card className="border border-border/50 bg-card/60 shadow-sm backdrop-blur-sm transition-all duration-300 focus-within:border-primary/40">
                <CardHeader className="pb-2.5">
                  <CardTitle className="flex items-center gap-2 text-xs font-bold tracking-wide text-foreground/80 uppercase">
                    <RefreshCw className="h-3.5 w-3.5 text-blue-500" />{" "}
                    Iterations For Next Sprint
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Optimize blockages (e.g. Schedule execution block early inside stack)..."
                    className="min-h-27.5 resize-none rounded-xl border-border/50 bg-background/40 text-sm leading-relaxed placeholder:text-muted-foreground/50 focus-visible:ring-primary/20"
                    value={sundayReview.adjustments}
                    onChange={(e) =>
                      setSundayReview((prev) => ({
                        ...prev,
                        adjustments: e.target.value,
                      }))
                    }
                    onBlur={() =>
                      saveWeeklyReview(
                        sundayReview.one_percent_win,
                        sundayReview.adjustments
                      )
                    }
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Heatmap Area */}
          <div className="border-t border-border/40 pt-8">
            <div className="mb-4 px-1">
              <h2 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                Consistency Mapping
              </h2>
            </div>
            <div className="rounded-2xl border border-border/50 bg-card/40 p-4 shadow-sm backdrop-blur-sm">
              <Heatmap logs={logs} />
            </div>
          </div>
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
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-background/60 p-4 backdrop-blur-sm sm:items-center">
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

      <PomodoroSettingsModal
        isOpen={isPomoSettingsOpen}
        onClose={() => setIsPomoSettingsOpen(false)}
        workDuration={workDuration}
        breakDuration={breakDuration}
        onSave={savePomoSettings}
      />

      <FloatingMenu
        onOpenDSA={() => setActiveView("dsa")}
        onOpenJournal={() => setActiveView("journal")}
        onOpenFinance={() => setActiveView("finance")}
        onOpenSystemDesign={() => setActiveView("system-design")}
        onOpenNotes={() => setActiveView("notes")}
        onOpenWorkoutTracker={() => setActiveView("workout-tracker")}
      />
    </div>
  )
}
