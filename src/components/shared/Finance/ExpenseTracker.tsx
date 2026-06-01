import { useState, useEffect, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Loader2,
  Plus,
  IndianRupee,
  Trash2,
  Receipt,
  PieChart,
  Coffee,
  Car,
  ShoppingBag,
  Zap,
  Film,
  Tag,
  TrendingUp,
  Activity,
  Calendar,
} from "lucide-react"
import { format } from "date-fns"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const CATEGORIES = [
  "General",
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
]

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
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("General")
  const [date] = useState(new Date().toISOString().split("T")[0])

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
      date,
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
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id))
    await supabase.from("expenses").delete().match({ id })
  }

  const totalSpent = useMemo(
    () => expenses.reduce((sum, exp) => sum + Number(exp.amount), 0),
    [expenses]
  )

  const categoryAnalytics = useMemo(() => {
    const totals: Record<string, number> = {}
    expenses.forEach((exp) => {
      totals[exp.category] = (totals[exp.category] || 0) + Number(exp.amount)
    })

    return Object.entries(totals)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: (amount / totalSpent) * 100,
      }))
      .sort((a, b) => b.amount - a.amount)
  }, [expenses, totalSpent])

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 p-4">
        <div className="h-32 w-full animate-pulse rounded-2xl border border-border/40 bg-muted/20" />
        <div className="h-48 w-full animate-pulse rounded-2xl border border-border/40 bg-muted/10" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in mx-auto max-w-3xl space-y-5 p-3 sm:p-6">
      {/* Dashboard Top Row: Total & Analytics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
        {/* Core Jumbotron Panel */}
        <Card className="relative flex flex-col justify-center overflow-hidden rounded-2xl border border-border/50 bg-card p-5 shadow-sm sm:col-span-1 sm:p-6 md:col-span-2">
          <div className="pointer-events-none absolute top-0 right-0 p-4 opacity-[0.03] sm:opacity-10">
            <TrendingUp className="h-20 w-20 sm:h-24 sm:w-24" />
          </div>
          <div className="z-10 space-y-1 sm:space-y-2">
            <h2 className="flex items-center gap-2 text-xs font-semibold tracking-tight text-foreground/80 sm:text-sm">
              <Activity className="h-3.5 w-3.5 text-foreground/60" />
              Total Outflow
            </h2>
            <div className="flex items-baseline gap-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
              <IndianRupee className="h-5 w-6 shrink-0 text-foreground/60 sm:h-6" />
              <span className="truncate text-3xl font-bold tracking-tighter text-foreground sm:text-4xl">
                {totalSpent.toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
            <p className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
              Lifetime Spend
            </p>
          </div>
        </Card>

        {/* Analytics Distribution Panel */}
        <Card className="flex flex-col justify-between rounded-2xl border border-border/50 bg-card p-5 shadow-sm sm:col-span-1 md:col-span-3">
          <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-tight text-foreground sm:mb-4 sm:text-sm">
            <PieChart className="h-3.5 w-3.5 text-foreground/60" />
            Category Distribution
          </h2>

          {categoryAnalytics.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {categoryAnalytics.slice(0, 3).map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between gap-2 text-xs font-medium">
                    <span className="flex items-center gap-1.5 truncate text-foreground/80">
                      {getCategoryIcon(cat.name, "h-3 w-3 opacity-70 shrink-0")}
                      <span className="truncate">{cat.name}</span>
                    </span>
                    <span className="shrink-0 font-mono text-foreground/90">
                      ₹
                      {cat.amount.toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                      })}
                      <span className="ml-1 text-[10px] text-muted-foreground">
                        ({Math.round(cat.percentage)}%)
                      </span>
                    </span>
                  </div>
                  <Progress
                    value={cat.percentage}
                    className="h-1 bg-muted/50 sm:h-1.5"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center py-3 text-xs text-muted-foreground opacity-50">
              <PieChart className="mb-1 h-6 w-6" />
              <span>No data to analyze</span>
            </div>
          )}
        </Card>
      </div>

      {/* Action Layer: Add Expense Form */}
      <Card className="rounded-2xl border border-border/50 bg-card shadow-sm">
        <CardContent className="p-4 sm:p-5">
          <form
            onSubmit={handleAddExpense}
            className="flex flex-col gap-3 md:flex-row md:items-end"
          >
            <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-4 md:grid-cols-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  Description
                </label>
                <Input
                  placeholder="What did you buy?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-9 border-border/40 bg-muted/10 text-sm shadow-none sm:h-10"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  Amount
                </label>
                <div className="relative">
                  <IndianRupee className="absolute top-2.5 left-3 h-3.5 w-3.5 text-muted-foreground/70 sm:top-3" />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-9 border-border/40 bg-muted/10 pl-8 font-mono text-sm shadow-none sm:h-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  Category
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-9 border-border/40 bg-muted/10 text-sm shadow-none sm:h-10">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem
                        key={cat}
                        value={cat}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-2 text-sm">
                          {getCategoryIcon(
                            cat,
                            "h-3.5 w-3.5 text-muted-foreground"
                          )}
                          {cat}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              disabled={isSubmitting}
              type="submit"
              className="mt-2 h-9 w-full shrink-0 rounded-xl transition-all active:scale-95 sm:h-10 md:mt-0 md:w-20"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="mr-1 h-4 w-4 md:hidden" />
                  <span>Add</span>
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Ledger Layer: Transaction History */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase sm:text-xs">
            Recent Transactions
          </h3>
          <span className="font-mono text-[10px] font-medium text-muted-foreground/60">
            {expenses.length} Records
          </span>
        </div>

        {expenses.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/60 bg-muted/5 py-10 text-center text-xs text-muted-foreground sm:text-sm">
            <Receipt className="h-7 w-7 opacity-40" />
            <p>
              Your ledger is empty.
              <br />
              Add your first expense above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="group flex items-center justify-between gap-4 rounded-xl border border-border/40 bg-card p-3 transition-all duration-200 hover:border-border/80 hover:shadow-sm"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/30 bg-muted/20 text-foreground/70 transition-colors group-hover:bg-background group-hover:shadow-sm">
                    {getCategoryIcon(expense.category, "h-3.5 w-3.5")}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-semibold tracking-tight text-foreground">
                      {expense.title}
                    </span>
                    <div className="mt-0.5 flex items-center gap-1.5 overflow-hidden text-[10px] font-medium text-muted-foreground/80">
                      <span className="shrink-0 tracking-wider uppercase">
                        {expense.category}
                      </span>
                      <span className="shrink-0 text-muted-foreground/30">
                        •
                      </span>
                      <span className="flex items-center gap-1 truncate font-mono">
                        <Calendar className="h-2.5 w-2.5 shrink-0 opacity-60" />
                        {format(new Date(expense.date), "MMM dd, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="ml-2 flex shrink-0 items-center gap-2 sm:gap-3">
                  <span className="font-mono text-sm font-bold text-foreground">
                    -₹
                    {expense.amount.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(expense.id)}
                    className="h-8 w-8 shrink-0 rounded-lg text-destructive/70 opacity-100 transition-all hover:bg-destructive/10 hover:text-destructive md:opacity-0 md:group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
