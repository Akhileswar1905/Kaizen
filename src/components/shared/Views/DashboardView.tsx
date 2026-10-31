import { useEffect, useMemo, useState, type ReactNode } from "react"
import { addDays, format, isAfter, parseISO, startOfMonth, startOfWeek, subDays } from "date-fns"
import * as Icons from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { useTodos } from "@/hooks/useTodos"
import { useLearningChecklist } from "@/hooks/useLearningChecklist"
import { useTimeBlocks } from "@/hooks/useTimeBlocks"
import { systemDesignSyllabus } from "@/lib/systemDesign"
import type { Habit } from "@/hooks/useTracker"

type FinanceEntry = {
  id: string
  title: string
  amount: number
  category: string
  date: string
  type: "income" | "expense"
  created_at?: string
}

type DashboardProps = {
  habits: Habit[]
  logs: Record<string, boolean>
  toggleHabit: (habitId: string, date: Date) => Promise<unknown>
  highestActiveStreak: number
  dsaData: Record<string, any[]>
  dsaCompleted: string[]
  setActiveView: (view: any) => void
  onOpenStatus: () => void
  onOpenFinanceTab: (tab: "income" | "expenses") => void
}

const money = (amount: number) => "₹" + amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })

function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-2">
      <div>
        {eyebrow && <p className="text-[10px] font-bold tracking-[0.16em] text-muted-foreground">{eyebrow}</p>}
        <h2 className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">{title}</h2>
      </div>
      {action}
    </div>
  )
}

export function DashboardView({
  habits,
  logs,
  toggleHabit,
  highestActiveStreak,
  dsaData,
  dsaCompleted,
  setActiveView,
  onOpenStatus,
  onOpenFinanceTab,
}: DashboardProps) {
  const { user } = useAuth()
  const { todos, loading: todosLoading, toggleTodo } = useTodos()
  const { items: learningItems, isLoading: learningLoading } = useLearningChecklist()
  const today = new Date()
  const todayKey = format(today, "yyyy-MM-dd")
  const activeHabits = habits.filter((habit) => !habit.is_archived)
  const todayTodos = todos.filter((todo) => todo.date === todayKey)
  const pendingTodos = todayTodos.filter((todo) => !todo.completed)
  const completedTodos = todayTodos.filter((todo) => todo.completed)
  const completedHabitsToday = activeHabits.filter((habit) => logs[habit.id + "-" + todayKey]).length
  const dailyTotal = todayTodos.length + activeHabits.length
  const dailyDone = completedTodos.length + completedHabitsToday
  const dailyProgress = dailyTotal ? Math.round((dailyDone / dailyTotal) * 100) : 0

  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index))
  const weeklyCounts = weekDays.map((day) => {
    const key = format(day, "yyyy-MM-dd")
    return activeHabits.filter((habit) => logs[habit.id + "-" + key]).length
  })
  const weeklyCheckins = weeklyCounts.reduce((sum, count) => sum + count, 0)
  const elapsedWeekDays = Math.min(7, Math.max(1, today.getDay() === 0 ? 7 : today.getDay()))
  const weeklyTarget = activeHabits.reduce((sum, habit) => sum + Math.round((Math.min(7, Math.max(0, habit.target_days || 0)) * elapsedWeekDays) / 7), 0)
  const weeklyConsistency = weeklyTarget ? Math.min(100, Math.round((weeklyCheckins / weeklyTarget) * 100)) : 0
  const maxWeeklyCount = Math.max(1, ...weeklyCounts)
  const learningDone = learningItems.filter((item) => item.is_completed).length
  const learningProgress = learningItems.length ? Math.round((learningDone / learningItems.length) * 100) : 0
  const dsaTotal = Object.values(dsaData).reduce((sum, rows) => sum + rows.length, 0)
  const dsaProgress = dsaTotal ? Math.round((dsaCompleted.length / dsaTotal) * 100) : 0
  const systemDesignTotal = systemDesignSyllabus.reduce((sum, module) => sum + module.topics.length, 0)

  const { blocks } = useTimeBlocks(weekStart)
  const nowTime = format(today, "HH:mm")
  const todaysBlocks = blocks
    .filter((block) => block.date === todayKey && block.end > nowTime)
    .sort((a, b) => a.start.localeCompare(b.start))
    .slice(0, 3)

  const [systemDesignDone, setSystemDesignDone] = useState(0)
  const [financeEntries, setFinanceEntries] = useState<FinanceEntry[]>([])
  const [recentTransactions, setRecentTransactions] = useState<FinanceEntry[]>([])
  const [financeLoading, setFinanceLoading] = useState(true)

  useEffect(() => {
    let active = true
    if (!user?.id) {
      setFinanceEntries([])
      setRecentTransactions([])
      setFinanceLoading(false)
      return
    }

    const loadDashboardData = async () => {
      setFinanceLoading(true)
      const monthStart = format(startOfMonth(parseISO(todayKey)), "yyyy-MM-dd")
      const [financeResult, recentResult, designResult] = await Promise.all([
        supabase.from("expenses").select("id,title,amount,category,date,type,created_at").eq("user_id", user.id).gte("date", monthStart).lte("date", todayKey).order("date", { ascending: false }),
        supabase.from("expenses").select("id,title,amount,category,date,type,created_at").eq("user_id", user.id).order("date", { ascending: false }).order("created_at", { ascending: false }).limit(4),
        supabase.from("system_design_progress").select("module_number,topic_index").eq("user_id", user.id),
      ])
      if (!active) return
      if (!financeResult.error && financeResult.data) setFinanceEntries(financeResult.data as FinanceEntry[])
      if (!recentResult.error && recentResult.data) setRecentTransactions(recentResult.data as FinanceEntry[])
      if (!designResult.error && designResult.data) setSystemDesignDone(designResult.data.length)
      setFinanceLoading(false)
    }

    void loadDashboardData()
    return () => { active = false }
  }, [user?.id, todayKey])

  const income = financeEntries.filter((entry) => entry.type === "income").reduce((sum, entry) => sum + Number(entry.amount), 0)
  const expenses = financeEntries.filter((entry) => entry.type === "expense").reduce((sum, entry) => sum + Number(entry.amount), 0)
  const netSavings = income - expenses
  const savingsRate = income > 0 ? Math.round((netSavings / income) * 100) : 0

  const heatmapStart = subDays(weekStart, 77)
  const heatmapDays = Array.from({ length: 84 }, (_, index) => addDays(heatmapStart, index))
  const heatmapLevels = ["bg-muted/80", "bg-emerald-100 dark:bg-emerald-950/80", "bg-emerald-200 dark:bg-emerald-900", "bg-emerald-400 dark:bg-emerald-700", "bg-emerald-600 dark:bg-emerald-500"]
  const greeting = today.getHours() < 12 ? "Good morning." : today.getHours() < 17 ? "Good afternoon." : "Good evening."

  const activities = useMemo(() => {
    const rows: { id: string; title: string; detail: string; date: string; kind: "habit" | "task" | "finance"; amount?: number; type?: string }[] = []
    Object.entries(logs).forEach(([key, completed]) => {
      if (!completed) return
      const date = key.slice(-10)
      const habitId = key.slice(0, -11)
      const habit = activeHabits.find((item) => item.id === habitId)
      if (habit && date <= todayKey) rows.push({ id: "habit-" + key, title: "Completed " + habit.title, detail: "Habit tracker", date, kind: "habit" })
    })
    todos.filter((todo) => todo.completed && todo.date <= todayKey).forEach((todo) => {
      rows.push({ id: "task-" + todo.id, title: "Completed " + todo.title, detail: "Task planner", date: todo.date, kind: "task" })
    })
    learningItems.forEach((item) => {
      const updatedAt = (item as typeof item & { updated_at?: string }).updated_at
      if (item.is_completed && updatedAt) {
        const date = updatedAt.slice(0, 10)
        if (date <= todayKey) rows.push({ id: "learning-" + item.id, title: "Completed " + item.title, detail: "Learning space · " + item.category, date, kind: "task" })
      }
    })
    recentTransactions.forEach((entry) => {
      rows.push({ id: "finance-" + entry.id, title: entry.title, detail: entry.type === "income" ? "Income recorded · " + entry.category : "Expense recorded · " + entry.category, date: entry.date, kind: "finance", amount: Number(entry.amount), type: entry.type })
    })
    return rows
      .filter((row) => row.date <= todayKey && row.date >= format(subDays(today, 30), "yyyy-MM-dd"))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5)
  }, [logs, activeHabits, todayKey, todos, recentTransactions, learningItems])

  return (
    <main className="kaizen-dashboard min-h-screen w-full px-3 pb-28 pt-5 text-foreground antialiased sm:px-6 sm:pt-8 xl:px-10">
      <div className="mx-auto w-full max-w-[1440px] space-y-8">
        <header className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
            <div className="flex items-center gap-3">
              <img src="/light_icon.png" alt="Kaizen logo" className="h-11 w-11 shrink-0 rounded-2xl border border-border/70 bg-card p-1 object-contain shadow-sm" />
              <div><p className="text-2xl font-extrabold tracking-tight">Kaizen</p><p className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground">PERSONAL GROWTH WORKSPACE</p></div>
            </div>
            <div className="flex items-center gap-3">
              <p className="hidden text-sm font-bold text-muted-foreground sm:block">{format(today, "EEEE, d MMMM yyyy")}</p>
              <Button variant="outline" size="icon" onClick={onOpenStatus} className="h-10 w-10 rounded-xl" title="Your progress"><Icons.UserRound className="h-4 w-4" /></Button>
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{greeting}</h1>
            <p className="text-xl font-bold tracking-tight text-muted-foreground sm:text-2xl">Let's make today count.</p>
            <p className="text-sm text-muted-foreground">Small steps. Steady progress.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { title: "Add task", description: "Plan work", icon: Icons.ListPlus, action: () => setActiveView("planner") },
              { title: "Log habit", description: "Track progress", icon: Icons.Target, action: () => setActiveView("habits") },
              { title: "Add income", description: "Money received", icon: Icons.TrendingUp, action: () => onOpenFinanceTab("income") },
              { title: "Add expense", description: "Money spent", icon: Icons.Wallet, action: () => onOpenFinanceTab("expenses") },
            ].map((action) => (
              <button key={action.title} onClick={action.action} className="group flex min-h-[104px] flex-col items-start justify-between rounded-2xl border border-border/70 bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-sm">
                <action.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
                <span><span className="block text-sm font-extrabold">{action.title}</span><span className="mt-0.5 block text-xs text-muted-foreground">{action.description}</span></span>
              </button>
            ))}
          </div>
        </header>

        <section className="space-y-4">
          <SectionHeading eyebrow="YOUR MOMENTUM" title="Overall progress" />
          <div className="grid gap-3 lg:grid-cols-2">
            <div className="row-span-1 rounded-2xl border border-border/70 bg-card p-4 sm:p-5 lg:row-span-2">
              <div className="flex items-start justify-between gap-3">
                <div><p className="text-[10px] font-bold tracking-[0.14em] text-muted-foreground">WEEKLY ACTIVITY</p><p className="mt-2 text-3xl font-extrabold tabular-nums">{weeklyCheckins}</p><p className="text-xs text-muted-foreground">Habit check-ins this week</p></div>
                <span className="rounded-xl bg-muted p-2 text-muted-foreground"><Icons.ChartNoAxesColumnIncreasing className="h-4 w-4" /></span>
              </div>
              <div className="mt-5 flex h-36 items-end gap-2">
                {weekDays.map((day, index) => {
                  const count = weeklyCounts[index]
                  const height = count ? Math.max(10, (count / maxWeeklyCount) * 100) : 4
                  return <div key={format(day, "yyyy-MM-dd")} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"><span className="text-[10px] tabular-nums text-muted-foreground">{count || ""}</span><div className="w-full rounded-t-md bg-muted" style={{ height: height + "%" }}><div className="h-full w-full rounded-t-md bg-foreground/65" /></div><span className="text-[10px] text-muted-foreground">{format(day, "EEEEE")}</span></div>
                })}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground"><span>{weeklyConsistency}% of expected check-ins so far</span><span>{activeHabits.length} active habits</span></div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5">
              <p className="text-[10px] font-bold tracking-[0.14em] text-muted-foreground">CURRENT STREAK</p>
              <div className="mt-2 flex items-end gap-2"><p className="text-3xl font-extrabold tabular-nums">{highestActiveStreak}</p><p className="pb-1 text-sm font-semibold text-muted-foreground">days</p></div>
              <p className="mt-1 text-xs text-muted-foreground">Your longest active habit streak</p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5">
              <div className="flex items-center justify-between"><p className="text-[10px] font-bold tracking-[0.14em] text-muted-foreground">HABIT CONSISTENCY</p><p className="text-lg font-extrabold tabular-nums">{weeklyConsistency}%</p></div>
              <div className="mt-3 grid grid-flow-col grid-cols-12 grid-rows-7 gap-1">
                {heatmapDays.map((day) => {
                  const key = format(day, "yyyy-MM-dd")
                  const count = activeHabits.filter((habit) => logs[habit.id + "-" + key]).length
                  const ratio = activeHabits.length ? count / activeHabits.length : 0
                  const level = count === 0 ? 0 : ratio < 0.25 ? 1 : ratio < 0.5 ? 2 : ratio < 0.75 ? 3 : 4
                  const future = isAfter(day, today)
                  return <div key={key} title={future ? format(day, "MMM d") + " · Upcoming" : format(day, "MMM d") + " · " + count + " of " + activeHabits.length + " habits"} className={"aspect-square rounded-[3px] " + (future ? "bg-muted/30" : heatmapLevels[level])} />
                })}
              </div>
              <div className="mt-2 flex items-center justify-between text-[9px] text-muted-foreground"><span>Last 12 weeks</span><span className="flex items-center gap-1">Less {heatmapLevels.map((level, index) => <span key={index} className={"h-2 w-2 rounded-[2px] " + level} />)} More</span></div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5">
              <p className="text-[10px] font-bold tracking-[0.14em] text-muted-foreground">LEARNING PROGRESS</p>
              <div className="mt-2 flex items-baseline gap-2"><p className="text-3xl font-extrabold tabular-nums">{learningLoading ? "—" : learningProgress + "%"}</p><p className="text-xs text-muted-foreground">{learningDone} of {learningItems.length} topics</p></div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-foreground/70 transition-all" style={{ width: learningProgress + "%" }} /></div>
              <p className="mt-2 text-xs text-muted-foreground">Learning checklist completion</p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5">
              <p className="text-[10px] font-bold tracking-[0.14em] text-muted-foreground">TODAY'S PRODUCTIVITY</p>
              <div className="mt-2 flex items-baseline gap-2"><p className="text-3xl font-extrabold tabular-nums">{dailyProgress}%</p><p className="text-xs text-muted-foreground">{dailyDone} of {dailyTotal} completed</p></div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-foreground/70 transition-all" style={{ width: dailyProgress + "%" }} /></div>
              <p className="mt-2 text-xs text-muted-foreground">Tasks and habits completed today</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeading eyebrow="MAKE TODAY COUNT" title="Today's focus" action={<button onClick={() => setActiveView("planner")} className="text-xs font-bold text-muted-foreground transition-colors hover:text-foreground">Open planner <Icons.ArrowUpRight className="ml-1 inline h-3.5 w-3.5" /></button>} />
          <div className="grid gap-3 lg:grid-cols-4">
            <div className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5 lg:col-span-2">
              <div className="flex items-center justify-between gap-2"><div><p className="font-extrabold">Today's tasks</p><p className="mt-0.5 text-xs text-muted-foreground">{pendingTodos.length} pending · {completedTodos.length} completed</p></div><button onClick={() => setActiveView("planner")} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Open task planner"><Icons.ArrowUpRight className="h-4 w-4" /></button></div>
              <div className="mt-4 space-y-3">
                {todosLoading ? <p className="py-4 text-sm text-muted-foreground">Loading today's tasks…</p> : pendingTodos.length === 0 ? <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">{todayTodos.length ? "Everything planned for today is complete." : "Nothing planned for today yet."}<button onClick={() => setActiveView("planner")} className="ml-1 font-bold text-foreground underline-offset-4 hover:underline">Add a task</button></div> : pendingTodos.slice(0, 4).map((todo) => <label key={todo.id} className="flex cursor-pointer items-center gap-3 text-sm"><input type="checkbox" checked={todo.completed} onChange={() => void toggleTodo(todo.id)} className="h-4 w-4 rounded border-border accent-foreground" /><span className="min-w-0 flex-1 truncate font-semibold">{todo.title}</span><span className="text-[10px] text-muted-foreground">Today</span></label>)}
                {completedTodos.length > 0 && <details className="border-t border-border/50 pt-3"><summary className="cursor-pointer text-xs font-bold text-muted-foreground">Completed ({completedTodos.length})</summary><div className="mt-3 space-y-2">{completedTodos.map((todo) => <label key={todo.id} className="flex cursor-pointer items-center gap-3 text-sm"><input type="checkbox" checked={todo.completed} onChange={() => void toggleTodo(todo.id)} className="h-4 w-4 rounded border-border accent-foreground" /><span className="min-w-0 flex-1 truncate text-muted-foreground line-through">{todo.title}</span></label>)}</div></details>}
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5">
              <div className="flex items-center justify-between"><p className="font-extrabold">Daily habits</p><button onClick={() => setActiveView("habits")} className="text-xs font-bold text-muted-foreground hover:text-foreground">View all</button></div>
              <p className="mt-1 text-xs text-muted-foreground">{completedHabitsToday} of {activeHabits.length} completed</p>
              <div className="mt-4 space-y-3">
                {activeHabits.length === 0 ? <p className="text-sm text-muted-foreground">Add a habit to start building consistency.</p> : activeHabits.slice(0, 4).map((habit) => {
                  const done = Boolean(logs[habit.id + "-" + todayKey])
                  return <button key={habit.id} onClick={() => void toggleHabit(habit.id, today)} className="flex w-full items-center gap-2 text-left text-sm"><span className={done ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>{done ? <Icons.CheckCircle2 className="h-4 w-4" /> : <Icons.Circle className="h-4 w-4" />}</span><span className={"min-w-0 flex-1 truncate font-semibold " + (done ? "text-muted-foreground line-through" : "")}>{habit.title}</span></button>
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5">
              <div className="flex items-center justify-between"><p className="font-extrabold">Upcoming schedule</p><button onClick={() => setActiveView("planner")} className="text-xs font-bold text-muted-foreground hover:text-foreground">Planner</button></div>
              <p className="mt-1 text-xs text-muted-foreground">Today's time blocks</p>
              <div className="mt-4 space-y-3">
                {todaysBlocks.length === 0 ? <p className="text-sm text-muted-foreground">No upcoming time blocks.</p> : todaysBlocks.map((block) => <div key={block.id} className="border-l-2 border-foreground/25 pl-3"><p className="text-[10px] font-bold text-muted-foreground">{block.start} – {block.end}</p><p className="mt-0.5 line-clamp-2 text-sm font-bold">{block.title}</p></div>)}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeading eyebrow="MONEY AT A GLANCE" title="Finance overview" action={<button onClick={() => setActiveView("finance")} className="text-xs font-bold text-muted-foreground hover:text-foreground">Open finance <Icons.ArrowUpRight className="ml-1 inline h-3.5 w-3.5" /></button>} />
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Income", value: income, icon: Icons.TrendingUp },
              { label: "Expenses", value: expenses, icon: Icons.TrendingDown },
              { label: "Net savings", value: netSavings, icon: Icons.Wallet },
            ].map((metric) => <div key={metric.label} className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5"><div className="flex items-center justify-between"><p className="text-xs font-bold text-muted-foreground">{metric.label}</p><metric.icon className="h-4 w-4 text-muted-foreground" /></div><p className="mt-2 text-2xl font-extrabold tabular-nums">{financeLoading ? "—" : money(metric.value)}</p>{metric.label === "Net savings" && !financeLoading && <p className={"mt-1 text-xs font-semibold " + (netSavings >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>{income > 0 ? savingsRate + "% of income" : "No income recorded this month"}</p>}</div>)}
          </div>
          <div className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between"><p className="font-extrabold">Recent transactions</p><button onClick={() => setActiveView("finance")} className="text-xs font-bold text-muted-foreground hover:text-foreground">View all</button></div>
            {financeLoading ? <p className="py-3 text-sm text-muted-foreground">Loading transactions…</p> : recentTransactions.length === 0 ? <p className="py-3 text-sm text-muted-foreground">No transactions recorded yet. Add income or an expense to get started.</p> : <div className="divide-y divide-border/50">{recentTransactions.slice(0, 4).map((entry) => <div key={entry.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">{entry.type === "income" ? <Icons.TrendingUp className="h-4 w-4" /> : <Icons.Receipt className="h-4 w-4" />}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{entry.title}</p><p className="text-xs text-muted-foreground">{entry.category} · {format(parseISO(entry.date), "MMM d, yyyy")}</p></div><p className={"shrink-0 text-sm font-extrabold tabular-nums " + (entry.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-foreground")}>{entry.type === "income" ? "+" : "−"}{money(Number(entry.amount))}</p></div>)}</div>}
            <p className="mt-3 border-t border-border/50 pt-3 text-[11px] text-muted-foreground">{format(today, "MMMM yyyy")} · Monthly totals</p>
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeading eyebrow="KEEP BUILDING" title="Learning & technical growth" action={<button onClick={() => setActiveView("learning-checklist")} className="text-xs font-bold text-muted-foreground hover:text-foreground">Learning space <Icons.ArrowUpRight className="ml-1 inline h-3.5 w-3.5" /></button>} />
          <div className="grid gap-3 lg:grid-cols-3">
            <button onClick={() => setActiveView("learning-checklist")} className="rounded-2xl border border-border/70 bg-card p-4 text-left transition-colors hover:bg-muted/30 sm:p-5">
              <div className="flex items-center gap-2"><Icons.BookOpen className="h-4 w-4 text-muted-foreground" /><span className="font-extrabold">Learning Space</span></div>
              <p className="mt-3 text-3xl font-extrabold tabular-nums">{learningLoading ? "—" : learningProgress + "%"}</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-foreground/70" style={{ width: learningProgress + "%" }} /></div>
              <p className="mt-2 text-xs text-muted-foreground">{learningDone} of {learningItems.length} topics completed</p>
            </button>
            <button onClick={() => setActiveView("dsa")} className="rounded-2xl border border-border/70 bg-card p-4 text-left transition-colors hover:bg-muted/30 sm:p-5">
              <div className="flex items-center gap-2"><Icons.Code2 className="h-4 w-4 text-muted-foreground" /><span className="font-extrabold">DSA practice</span></div>
              <p className="mt-3 text-3xl font-extrabold tabular-nums">{dsaCompleted.length}<span className="ml-1 text-sm font-semibold text-muted-foreground">/ {dsaTotal}</span></p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-foreground/70" style={{ width: dsaProgress + "%" }} /></div>
              <p className="mt-2 text-xs text-muted-foreground">Problems solved</p>
            </button>
            <button onClick={() => setActiveView("system-design")} className="rounded-2xl border border-border/70 bg-card p-4 text-left transition-colors hover:bg-muted/30 sm:p-5">
              <div className="flex items-center gap-2"><Icons.Network className="h-4 w-4 text-muted-foreground" /><span className="font-extrabold">System Design</span></div>
              <p className="mt-3 text-3xl font-extrabold tabular-nums">{systemDesignDone}<span className="ml-1 text-sm font-semibold text-muted-foreground">/ {systemDesignTotal}</span></p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-foreground/70" style={{ width: systemDesignTotal ? Math.round(systemDesignDone / systemDesignTotal * 100) + "%" : "0%" }} /></div>
              <p className="mt-2 text-xs text-muted-foreground">Concepts completed</p>
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeading eyebrow="YOUR RECENT MOMENTUM" title="Recent activities" action={<span className="text-xs text-muted-foreground">Last 30 days</span>} />
          <div className="rounded-2xl border border-border/70 bg-card p-4 sm:p-5">
            {activities.length === 0 ? <div className="py-6 text-center"><Icons.Activity className="mx-auto h-6 w-6 text-muted-foreground" /><p className="mt-2 text-sm font-bold">Your activity will show up here</p><p className="mt-1 text-xs text-muted-foreground">Complete a habit, task or record a transaction to start your timeline.</p></div> : <div className="space-y-0">{activities.map((activity, index) => {
              const ActivityIcon = activity.kind === "habit" ? Icons.CheckCircle2 : activity.kind === "task" ? Icons.ListTodo : Icons.Wallet
              return <div key={activity.id} className={"flex items-center gap-3 py-3 " + (index ? "border-t border-border/50" : "")}>{(index === 0 || activities[index - 1].date !== activity.date) && <span className="w-20 shrink-0 text-[10px] font-bold text-muted-foreground">{activity.date === todayKey ? "Today" : activity.date === format(subDays(today, 1), "yyyy-MM-dd") ? "Yesterday" : format(parseISO(activity.date), "MMM d")}</span>}<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground"><ActivityIcon className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{activity.title}</p><p className="text-xs text-muted-foreground">{activity.detail}</p></div></div>
            })}</div>}
          </div>
        </section>
      </div>
    </main>
  )
}
