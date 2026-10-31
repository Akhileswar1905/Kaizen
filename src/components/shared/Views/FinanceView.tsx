import { Wallet, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExpenseTracker } from "../Finance/ExpenseTracker"
import { VarsityTracker } from "../Finance/FinanceCourse"

export function FinanceView() {
  return (
    <div className="min-h-screen w-full bg-background px-3 py-5 font-sans text-foreground antialiased sm:px-6 sm:py-8 xl:px-10">
      <div className="mx-auto w-full max-w-[1440px] space-y-6">
        {/* Header */}
        <header className="flex items-center gap-3 border-b border-border/60 pb-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-foreground"><Wallet className="h-5 w-5" /></div>
          <div><h1 className="text-2xl font-extrabold tracking-tight">Finance & Learning</h1><p className="text-sm text-muted-foreground">Track expenses and course progress</p></div>
        </header>

        {/* Tabs for switching between Expenses and Courses */}
        <Tabs defaultValue="expenses" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="expenses" className="flex gap-2">
              <Wallet className="h-4 w-4" /> Expenses
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex gap-2">
              <BookOpen className="h-4 w-4" /> Varsity Course
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="mt-0">
            <ExpenseTracker />
          </TabsContent>

          <TabsContent value="courses" className="mt-0">
            <VarsityTracker />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
