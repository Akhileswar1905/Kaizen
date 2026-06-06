import { useState, useEffect, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import {
  Loader2,
  Trash2,
  PieChart as PieChartIcon,
  Coffee,
  Car,
  ShoppingBag,
  Zap,
  Film,
  Tag,
  TrendingUp,
  Activity,
  Calendar,
  ChevronRight,
  BarChart3,
  Wallet,
} from "lucide-react"
import { format, subDays } from "date-fns"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useGamification } from "@/contexts/GamificationContext"

// Recharts primitives (shadcn wraps these)
import { PieChart, Pie, AreaChart, Area, XAxis, YAxis } from "recharts"

// Shadcn Chart Components
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const CATEGORIES = [
  "General",
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
]

// 1. Define the Chart Config for shadcn
const chartConfig = {
  amount: {
    label: "Amount",
    color: "hsl(var(--chart-1))",
  },
  general: { label: "General", color: "hsl(var(--chart-1))" },
  food: { label: "Food", color: "hsl(var(--chart-2))" },
  transport: { label: "Transport", color: "hsl(var(--chart-3))" },
  shopping: { label: "Shopping", color: "hsl(var(--chart-4))" },
  bills: { label: "Bills", color: "hsl(var(--chart-5))" },
  entertainment: { label: "Entertainment", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig

const getCategoryIcon = (category: string, className: string = "h-4 w-4") => {
  switch (category) {
    case "Food":
      return <Coffee className={className} />
    case "Transport":
      return <Car className={className} />
    case "Shopping":
      return <ShoppingBag className={className} />
    case "Bills":
      return <Zap className={className} />
    case "Entertainment":
      return <Film className={className} />
    default:
      return <Tag className={className} />
  }
}

export function ExpenseTracker() {
  const { user } = useAuth()
  const { triggerGamificationEvent, subtractGamificationPoints } =
    useGamification()
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("General")
  const [date, setDate] = useState<Date>(new Date())

  useEffect(() => {
    if (user) fetchExpenses()
  }, [user])

  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false })

    if (!error && data) setExpenses(data)
    setLoading(false)
  }

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !amount) return
    setIsSubmitting(true)

    const newExpense = {
      user_id: user?.id,
      title,
      amount: parseFloat(amount),
      category,
      date: format(date, "yyyy-MM-dd"),
    }

    const { data, error } = await supabase
      .from("expenses")
      .insert(newExpense)
      .select()
      .single()

    if (!error && data) {
      setExpenses([data, ...expenses])
      setTitle("")
      setAmount("")
      setDate(new Date())
      await triggerGamificationEvent({ type: "FINANCE_LOGGED", amount: 1 })
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id))
    await supabase.from("expenses").delete().match({ id })
    await subtractGamificationPoints({ type: "FINANCE_LOGGED", amount: 1 })
  }

  // --- ANALYTICS COMPUTATIONS ---
  const totalSpent = useMemo(
    () => expenses.reduce((sum, exp) => sum + Number(exp.amount), 0),
    [expenses]
  )

  const highestCategory = useMemo(() => {
    const totals: Record<string, number> = {}
    expenses.forEach((exp) => {
      totals[exp.category] = (totals[exp.category] || 0) + Number(exp.amount)
    })
    const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1])
    return sorted.length > 0
      ? { name: sorted[0][0], amount: sorted[0][1] }
      : null
  }, [expenses])

  const categoryAnalytics = useMemo(() => {
    const totals: Record<string, number> = {}
    expenses.forEach((exp) => {
      totals[exp.category] = (totals[exp.category] || 0) + Number(exp.amount)
    })
    return Object.entries(totals)
      .map(([name, amount]) => ({
        category: name,
        value: amount,
        // Map to shadcn CSS variable keys based on the category name
        fill: `var(--chart-${CATEGORIES.indexOf(name) + 1})`,
      }))
      .sort((a, b) => b.value - a.value)
  }, [expenses])

  const dailyTrend = useMemo(() => {
    const days = Array.from({ length: 7 })
      .map((_, i) => {
        return format(subDays(new Date(), i), "MMM dd")
      })
      .reverse()

    const trendData = days.map((day) => ({ name: day, amount: 0 }))

    expenses.forEach((exp) => {
      const expDate = format(new Date(exp.date), "MMM dd")
      const dayIndex = trendData.findIndex((d) => d.name === expDate)
      if (dayIndex !== -1) {
        trendData[dayIndex].amount += Number(exp.amount)
      }
    })

    return trendData
  }, [expenses])

  // --- RENDER ---
  if (loading)
    return (
      <div className="mx-auto max-w-5xl animate-pulse space-y-6 p-6">
        <div className="h-32 rounded-2xl bg-muted/20" />
        <div className="flex gap-6">
          <div className="h-64 flex-1 rounded-2xl bg-muted/10" />
          <div className="h-64 flex-1 rounded-2xl bg-muted/10" />
        </div>
      </div>
    )

  return (
    <div className="mx-auto max-w-5xl animate-in space-y-6 p-2 duration-700 fade-in sm:p-4">
      {/* 1. KPI Stats Row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                Net Outflow
              </p>
              <Wallet className="h-4 w-4 text-primary opacity-50" />
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-xl font-light text-muted-foreground">
                ₹
              </span>
              <span className="text-4xl font-black tracking-tighter text-foreground">
                {totalSpent.toLocaleString("en-IN")}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                Total Logs
              </p>
              <Activity className="h-4 w-4 text-primary opacity-50" />
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-black tracking-tighter text-foreground">
                {expenses.length}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                Transactions
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                Highest Drain
              </p>
              <TrendingUp className="h-4 w-4 text-destructive opacity-50" />
            </div>
            <div className="mt-4 flex flex-col">
              <span className="text-2xl font-black tracking-tighter text-foreground">
                {highestCategory?.name || "N/A"}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                ₹{highestCategory?.amount.toLocaleString("en-IN") || 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Analytics Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Trend Area Chart */}
        <Card className="flex flex-col border-border/50 bg-card/20 lg:col-span-7">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">
              <BarChart3 className="h-4 w-4" /> 7-Day Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="min-h-[250px] flex-1 p-4">
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <AreaChart
                data={dailyTrend}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(val) => `₹${val}`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="var(--chart-1)"
                  fillOpacity={1}
                  fill="url(#fillAmount)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Category Donut Chart */}
        <Card className="flex flex-col border-border/50 bg-card/20 lg:col-span-5">
          <CardHeader className="pb-0">
            <CardTitle className="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">
              <PieChartIcon className="h-4 w-4" /> Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="relative flex min-h-[250px] flex-1 items-center justify-center">
            {categoryAnalytics.length > 0 ? (
              <>
                <ChartContainer
                  config={chartConfig}
                  className="h-[250px] w-full"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={categoryAnalytics}
                      dataKey="value"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      stroke="none"
                    />
                  </PieChart>
                </ChartContainer>
                {/* Center text for donut */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                    Total
                  </span>
                  <span className="text-lg font-black">
                    ₹
                    {totalSpent > 999
                      ? (totalSpent / 1000).toFixed(1) + "k"
                      : totalSpent}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No data to display.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 3. Input Form */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-xl">
        <CardContent className="p-6">
          <form
            onSubmit={handleAddExpense}
            className="grid grid-cols-1 items-end gap-4 sm:grid-cols-12"
          >
            <div className="space-y-2 sm:col-span-4">
              <label className="ml-1 text-[10px] font-bold tracking-tighter text-muted-foreground uppercase">
                Detail
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Terminal access, supplies, etc."
                className="border-border/50 bg-background/50 shadow-inner focus-visible:ring-1 focus-visible:ring-primary"
                required
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="ml-1 text-[10px] font-bold tracking-tighter text-muted-foreground uppercase">
                Amount
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="border-border/50 bg-background/50 font-mono shadow-inner focus-visible:ring-1 focus-visible:ring-primary"
                required
              />
            </div>

            <div className="space-y-2 sm:col-span-3">
              <label className="ml-1 text-[10px] font-bold tracking-tighter text-muted-foreground uppercase">
                Category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="border-border/50 bg-background/50 shadow-inner focus:ring-1 focus:ring-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-3">
              <label className="ml-1 text-[10px] font-bold tracking-tighter text-muted-foreground uppercase">
                Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start border-border/50 bg-background/50 text-left font-normal shadow-inner hover:bg-background/80 hover:text-foreground",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto border-border/50 p-0">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button
              disabled={isSubmitting}
              type="submit"
              className="mt-2 w-full font-bold tracking-wide transition-all hover:opacity-90 sm:col-span-12"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Add Expense"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 4. Ledger List */}
      <div className="space-y-4 pt-4">
        <h3 className="flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
          <ChevronRight className="h-3 w-3" /> Recent Transactions
        </h3>
        <div className="grid gap-3">
          {expenses.length === 0 && (
            <div className="rounded-xl border border-dashed border-border/50 py-8 text-center text-sm text-muted-foreground">
              No transactions found. Begin tracking.
            </div>
          )}
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="group flex items-center justify-between rounded-xl border border-border/20 bg-card/40 p-4 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-card/60"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {getCategoryIcon(expense.category, "h-4 w-4")}
                </div>
                <div>
                  <p className="font-bold tracking-tight text-foreground">
                    {expense.title}
                  </p>
                  <p className="flex items-center gap-1.5 text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                    {expense.category} •{" "}
                    {format(new Date(expense.date), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-base font-black text-foreground">
                  -₹{expense.amount.toLocaleString()}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(expense.id)}
                  className="h-8 w-8 text-destructive opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
