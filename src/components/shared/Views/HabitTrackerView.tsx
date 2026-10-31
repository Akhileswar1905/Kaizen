import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronRight, Star, Activity, Loader2, UserCircle, Users, Snowflake } from "lucide-react"
import { addDays, format } from "date-fns"
import { Heatmap } from "../Habits/Heatmap"
import { AddHabitModal } from "../Habits/AddHabit"
import { HabitActions } from "../Habits/HabitActions"
import * as Icons from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import type { Habit } from "@/hooks/useTracker"

type HabitTrackerViewProps = {
  habits: Habit[]
  logs: Record<string, boolean>
  currentWeekStart: Date
  isLoading: boolean
  toggleHabit: (habitId: string, date: Date) => void
  nextWeek: () => void
  prevWeek: () => void
  checksThisWeek: number
  weekCompletionPct: number
  currentWeekDays: Date[]
  addHabit: (habit: any) => void
  updateHabit: (habit: Habit) => void
  deleteHabit: (habitId: string) => void
  sundayReview: { one_percent_win: string; adjustments: string }
  setSundayReview: React.Dispatch<React.SetStateAction<{ one_percent_win: string; adjustments: string }>>
  saveWeeklyReview: (onePercentWin: string, adjustments: string) => void
  isSavingReview: boolean
  getHabitStreakDetails: (habitId: string) => { streak: number; freezeUsed: boolean; frozenDateStr: string | null }
  highestActiveStreak: number
  onOpenStatus: () => void
  onOpenMultiplayer: () => void
  onOpenStreaks: () => void
}

export function HabitTrackerView(props: HabitTrackerViewProps) {
  const {
    habits, logs, currentWeekStart, isLoading, toggleHabit, nextWeek, prevWeek,
    checksThisWeek, weekCompletionPct, currentWeekDays, addHabit, updateHabit,
    deleteHabit, sundayReview, setSundayReview, saveWeeklyReview, isSavingReview,
    getHabitStreakDetails, highestActiveStreak, onOpenStatus, onOpenMultiplayer,
    onOpenStreaks,
  } = props
  const [showArchived, setShowArchived] = useState(false)
  const visibleHabits = habits.filter((habit) => showArchived ? habit.is_archived : !habit.is_archived)

  return (
      <div className="kaizen-desktop flex min-h-screen justify-center px-3 py-4 font-sans text-foreground antialiased sm:px-6 sm:py-8">
        <div className="kaizen-window w-full max-w-5xl space-y-7 sm:space-y-9">
          {/* Dashboard workspace */}
          <div className="space-y-8">
            <header className="flex flex-col gap-6 border-b border-border/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <img src="/light_icon.png" alt="" className="h-10 w-10 rounded-xl object-contain" />
                <div>
                  <p className="text-xl font-extrabold tracking-tight text-foreground">Kaizen</p>
                  <p className="text-xs font-medium tracking-wide text-muted-foreground">PERSONAL GROWTH WORKSPACE</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                <div className="text-left sm:text-right">
                  <p className="text-sm font-semibold">{format(new Date(), "EEEE, d MMMM")}</p>
                  <p className="text-xs text-muted-foreground">A little progress adds up.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setIsStatusOpen(true)} className="h-9 w-9 rounded-xl" title="Your status"><UserCircle className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" onClick={() => setIsMultiplayerOpen(true)} className="h-9 w-9 rounded-xl" title="Multiplayer"><Users className="h-4 w-4" /></Button>
                  <AddHabitModal onAddHabit={addHabit} />
                </div>
              </div>
            </header>

            <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="min-w-0 space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">YOUR WEEK AT A GLANCE</p>
                    <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Build your rhythm.</h1>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">Small actions, repeated with intention. Pick up where you left off and make today count.</p>
                  </div>
                  <div className="flex items-center gap-1 self-start rounded-xl border border-border/70 bg-card p-1 sm:self-auto">
                    <Button variant="ghost" size="icon" onClick={prevWeek} className="h-8 w-8 rounded-lg"><ChevronLeft className="h-4 w-4" /></Button>
                    <span className="min-w-32 text-center text-xs font-semibold tabular-nums">{format(currentWeekStart, "d MMM")} – {format(addDays(currentWeekStart, 6), "d MMM")}</span>
                    <Button variant="ghost" size="icon" onClick={nextWeek} className="h-8 w-8 rounded-lg"><ChevronRight className="h-4 w-4" /></Button>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
                  <div className="flex items-center justify-between border-b border-border/60 px-4 py-4 sm:px-5">
                    <div>
                      <h2 className="font-bold">Daily habits</h2>
                      <p className="mt-0.5 text-xs text-muted-foreground">Check in as you go through the week</p>
                    </div>
                    <span className="rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">{habits.filter((h) => !h.is_archived).length} active</span>
                  </div>
                  {isLoading ? (
                    <div className="flex h-48 items-center justify-center gap-3 text-sm text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /> Loading your habits…</div>
                  ) : habits.filter((h) => !h.is_archived).length === 0 ? (
                    <div className="flex min-h-56 flex-col items-center justify-center px-6 py-10 text-center">
                      <Activity className="h-7 w-7 text-muted-foreground" />
                      <h3 className="mt-3 font-bold">Start with one small habit</h3>
                      <p className="mt-1 max-w-xs text-sm text-muted-foreground">Add a routine you want to make part of your everyday life.</p>
                      <div className="mt-4"><AddHabitModal onAddHabit={addHabit} /></div>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/60">
                      <div className="hidden grid-cols-[minmax(150px,1fr)_repeat(7,36px)_84px] items-center gap-2 bg-muted/35 px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:grid">
                        <span>Routine</span>
                        {currentWeekDays.map((date) => <span key={format(date, "yyyy-MM-dd")} className="text-center">{format(date, "EEEEE")}</span>)}
                        <span className="text-right">Progress</span>
                      </div>
                      {habits.filter((habit) => !habit.is_archived).map((habit) => {
                        const { frozenDateStr } = getHabitStreakDetails(habit.id)
                        const completedCount = currentWeekDays.reduce((count, date) => count + (logs[`${habit.id}-${format(date, "yyyy-MM-dd")}`] ? 1 : 0), 0)
                        const isTargetMet = completedCount >= habit.target_days
                        const IconComponent = (Icons as any)[habit.icon_name] || Activity
                        return (
                          <div key={habit.id} className="grid grid-cols-1 gap-3 px-4 py-4 transition-colors hover:bg-muted/20 sm:grid-cols-[minmax(150px,1fr)_repeat(7,36px)_84px] sm:items-center sm:gap-2 sm:px-5">
                            <div className="flex min-w-0 items-center gap-3">
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground"><IconComponent className="h-4 w-4" /></span>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold">{habit.title}</p>
                                {habit.description && <p className="truncate text-xs text-muted-foreground">{habit.description}</p>}
                              </div>
                              <div className="sm:hidden"><HabitActions habit={habit} onUpdate={updateHabit} onDelete={deleteHabit} /></div>
                            </div>
                            <div className="flex items-center justify-between rounded-xl bg-muted/35 px-2 py-2 sm:contents">
                              {currentWeekDays.map((date) => {
                                const dateStr = format(date, "yyyy-MM-dd")
                                const isChecked = Boolean(logs[`${habit.id}-${dateStr}`])
                                const isFrozenDay = dateStr === frozenDateStr
                                return (
                                  <div key={dateStr} className="flex flex-col items-center gap-1.5">
                                    <span className="text-[9px] font-semibold text-muted-foreground sm:hidden">{format(date, "EEEEE")}</span>
                                    {isFrozenDay ? <span title="Streak freeze auto-applied" className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground"><Snowflake className="h-3.5 w-3.5" /></span> : <Checkbox checked={isChecked} onCheckedChange={() => toggleHabit(habit.id, date)} className="h-7 w-7 rounded-full border-muted-foreground/30 data-[state=checked]:border-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-background" />}
                                  </div>
                                )
                              })}
                            </div>
                            <div className="flex items-center justify-between sm:justify-end sm:gap-2">
                              <span className={cn("text-xs font-semibold tabular-nums", isTargetMet ? "text-foreground" : "text-muted-foreground")}>{completedCount}/{habit.target_days}</span>
                              <div className="hidden sm:block"><HabitActions habit={habit} onUpdate={updateHabit} onDelete={deleteHabit} /></div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div><h2 className="font-bold">Consistency over time</h2><p className="mt-0.5 text-xs text-muted-foreground">Your effort, one day at a time</p></div>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Heatmap logs={logs} />
                </div>
              </div>

              <aside className="space-y-4">
                <div className="rounded-2xl border border-border/70 bg-card p-5">
                  <p className="text-xs font-bold tracking-wide text-muted-foreground">WEEKLY COMPLETION</p>
                  <div className="mt-4 flex items-end gap-2">
                    <span className="text-5xl font-bold tracking-tighter tabular-nums">{weekCompletionPct}</span><span className="mb-1 text-xl font-semibold text-muted-foreground">%</span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-foreground/80 transition-all duration-500" style={{ width: `${Math.max(0, Math.min(100, weekCompletionPct))}%` }} /></div>
                  <p className="mt-3 text-xs text-muted-foreground">{checksThisWeek} check-ins completed this week</p>
                  <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border/60 pt-4">
                    <div><p className="text-2xl font-bold tabular-nums">{habits.filter((h) => !h.is_archived).length}</p><p className="text-[11px] text-muted-foreground">Active habits</p></div>
                    <button onClick={() => setIsStreaksModalOpen(true)} className="text-left"><p className="text-2xl font-bold tabular-nums">{highestActiveStreak}<span className="ml-1 text-xs font-semibold text-muted-foreground">d</span></p><p className="text-[11px] text-muted-foreground">Best active streak</p></button>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/70 bg-card p-5">
                  <div className="flex items-center gap-2"><Star className="h-4 w-4 text-muted-foreground" /><h2 className="text-sm font-bold">Weekly reflection</h2></div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Take a moment to notice what worked and what you want to adjust.</p>
                  {isSavingReview && <p className="mt-2 text-[11px] text-muted-foreground">Saving…</p>}
                  <div className="mt-4 space-y-4">
                    <div><label className="mb-1.5 block text-xs font-semibold">A win worth remembering</label><Textarea placeholder="What went well?" className="min-h-24 resize-none rounded-xl bg-background/60 text-sm" value={sundayReview.one_percent_win} onChange={(e) => setSundayReview((prev) => ({ ...prev, one_percent_win: e.target.value }))} onBlur={() => saveWeeklyReview(sundayReview.one_percent_win, sundayReview.adjustments)} /></div>
                    <div><label className="mb-1.5 block text-xs font-semibold">One thing to improve</label><Textarea placeholder="What could be smoother?" className="min-h-24 resize-none rounded-xl bg-background/60 text-sm" value={sundayReview.adjustments} onChange={(e) => setSundayReview((prev) => ({ ...prev, adjustments: e.target.value }))} onBlur={() => saveWeeklyReview(sundayReview.one_percent_win, sundayReview.adjustments)} /></div>
                  </div>
                </div>
              </aside>
            </section>
          </div>

        </div>
      </div>
  )
}
