import { ChevronLeft, Wallet, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExpenseTracker } from "../Finance/ExpenseTracker"
import { VarsityTracker } from "../Finance/FinanceCourse"

interface FinanceViewProps {
  onBack: () => void
}

export function FinanceView({ onBack }: FinanceViewProps) {
  return (
    <div className="flex min-h-screen justify-center bg-background p-6 font-sans text-foreground md:p-12">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <header className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            className="h-10 w-10 shrink-0 rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
              <Wallet className="h-6 w-6 text-primary" />
              Finance & Learning
            </h1>
            <p className="text-sm text-muted-foreground">
              Track expenses and course progress
            </p>
          </div>
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
