import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Plus, IndianRupee, Trash2, Receipt } from "lucide-react"
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

export function ExpenseTracker() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("General")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

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

  const totalSpent = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0)

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Card className="overflow-hidden border-none bg-primary text-primary-foreground shadow-xl">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-sm font-medium tracking-wider uppercase opacity-80">
            Total Spent
          </p>
          <h2 className="mt-2 flex items-center text-4xl font-bold">
            <IndianRupee className="mr-1 h-8 w-8" />
            {totalSpent.toLocaleString("en-IN")}
          </h2>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleAddExpense} className="grid gap-3">
            <Input
              placeholder="What did you buy?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-muted/20"
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <IndianRupee className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-muted/20 pl-9"
                  required
                />
              </div>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-muted/20 uppercase"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-muted/20">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button disabled={isSubmitting} type="submit" className="w-full">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Add Expense
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
          Recent Transactions
        </h3>
        {expenses.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border/50 bg-card p-6 text-center text-sm text-muted-foreground">
            <Receipt className="h-6 w-6" />
            No expenses added yet.
          </div>
        ) : (
          expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-all hover:border-primary/20"
            >
              <div className="flex flex-col">
                <span className="font-semibold">{expense.title}</span>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span className="rounded-sm bg-muted px-1.5 py-0.5">
                    {expense.category}
                  </span>
                  <span>{format(new Date(expense.date), "MMM d, yyyy")}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold">
                  ₹{expense.amount.toLocaleString("en-IN")}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(expense.id)}
                  className="h-8 w-8 text-destructive/70 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
