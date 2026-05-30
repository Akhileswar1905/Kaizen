import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  ChevronLeft,
  ChevronRight,
  Code,
  Server,
  Briefcase,
  PiggyBank,
  Star,
  RefreshCw,
  Activity,
  Loader2,
} from "lucide-react"
import { useTracker } from "@/hooks/useTracker"
import { addDays, format } from "date-fns"
import { Heatmap } from "./Heatmap"

const IconMap: Record<string, React.ReactNode> = {
  Code: <Code className="h-5 w-5" />,
  Server: <Server className="h-5 w-5" />,
  Briefcase: <Briefcase className="h-5 w-5" />,
  PiggyBank: <PiggyBank className="h-5 w-5" />,
  default: <Activity className="h-5 w-5" />,
}

export default function KaizenTracker() {
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
  } = useTracker()

  return (
    <div className="flex min-h-screen justify-center bg-background p-6 font-sans text-foreground md:p-12">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header Section */}
        <header className="flex items-center justify-between">
          <div className="flex items-center">
            <div>
              <img src="/light_icon.png" alt="Kaizen Logo" className="h-25" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Kaizen</h1>
              <p className="text-sm text-muted-foreground">
                Small wins, every day
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={prevWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-semibold text-foreground">
              {format(currentWeekStart, "d MMM")} –{" "}
              {format(addDays(currentWeekStart, 6), "d MMM")}
            </span>
            <Button variant="outline" size="icon" onClick={nextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-card py-4 text-center">
            <h2 className="mb-1 text-3xl font-bold text-foreground">
              {checksThisWeek}
            </h2>
            <p className="text-xs font-medium text-muted-foreground">
              Checks this week
            </p>
          </Card>
          <Card className="bg-card py-4 text-center">
            <h2 className="mb-1 text-3xl font-bold text-foreground">
              {dsaStreak}
            </h2>
            <p className="text-xs font-medium text-muted-foreground">
              DSA streak (days)
            </p>
          </Card>
          <Card className="bg-card py-4 text-center">
            <h2 className="mb-1 text-3xl font-bold text-foreground">
              {weekCompletionPct}%
            </h2>
            <p className="text-xs font-medium text-muted-foreground">
              Week completion
            </p>
          </Card>
        </div>

        {/* Habits List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">
                Loading habits...
              </p>
            </div>
          ) : (
            habits.map((habit) => {
              const completedCount = currentWeekDays.reduce((count, date) => {
                const dateStr = format(date, "yyyy-MM-dd")
                const isCompleted = logs[`${habit.id}-${dateStr}`]
                return count + (isCompleted ? 1 : 0)
              }, 0)
              return (
                <Card key={habit.id} className="bg-card">
                  <CardContent className="flex flex-col justify-between gap-6 p-4 md:flex-row md:items-center">
                    {/* Habit Info */}
                    <div className="flex min-w-50 items-center gap-4">
                      <div className="rounded-lg bg-secondary p-2 text-secondary-foreground">
                        {IconMap[habit.icon_name] || IconMap.default}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {habit.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {habit.description}
                        </p>
                      </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="flex w-full max-w-lg flex-1 justify-between md:w-auto md:gap-4">
                      {currentWeekDays.map((date) => {
                        const dateStr = format(date, "yyyy-MM-dd")
                        const dayName = format(date, "EEE")

                        return (
                          <div
                            key={dateStr}
                            className="flex flex-col items-center gap-2"
                          >
                            <Checkbox
                              className="h-8 w-8 rounded-lg"
                              checked={logs[`${habit.id}-${dateStr}`] || false}
                              onCheckedChange={() =>
                                toggleHabit(habit.id, date)
                              }
                            />
                            <span className="text-[10px] font-medium text-muted-foreground">
                              {dayName}
                            </span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Target Badge */}
                    <div className="hidden items-center md:flex">
                      <span className="rounded-full bg-secondary px-2 py-1 text-xs font-bold text-secondary-foreground">
                        {completedCount}/{habit.target_days}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* Sunday Review Section */}
        <div className="pt-4">
          <h2 className="mb-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
            Sunday Review
          </h2>
          <div className="space-y-4">
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Star className="h-4 w-4 text-muted-foreground" /> My 1% win
                  this week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="e.g. Solved sliding window without hints..."
                  className="min-h-25 resize-none"
                />
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <RefreshCw className="h-4 w-4 text-muted-foreground" /> What
                  to adjust next week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="e.g. Move DSA to morning, evening is too tired..."
                  className="min-h-25 resize-none"
                />
              </CardContent>
            </Card>
          </div>
        </div>
        <Heatmap logs={logs} />
      </div>
    </div>
  )
}
