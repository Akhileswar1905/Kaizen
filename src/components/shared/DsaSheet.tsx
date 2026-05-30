import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  ExternalLink,
  Code2,
  Loader2,
  Trophy,
  CheckCircle2,
} from "lucide-react"
import { useTracker } from "@/hooks/useTracker"

export function DsaSheet({ onBack }: { onBack: () => void }) {
  const { dsaData, dsaCompleted, toggleDsaProblem } = useTracker()

  if (Object.keys(dsaData).length === 0) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="animate-pulse text-sm font-medium text-muted-foreground">
          Syncing with Supabase...
        </p>
      </div>
    )
  }

  const firstCategory = Object.keys(dsaData)[0]

  // Calculate high-level metrics for gamification
  const allProblems = Object.values(dsaData).flat()
  const totalCount = allProblems.length
  const completedCount = dsaCompleted.length
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="mx-auto max-w-4xl animate-in space-y-8 p-4 duration-500 fade-in slide-in-from-bottom-4 md:p-6">
      {/* Dynamic Header Workspace */}
      <div className="flex flex-col gap-4 border-b border-border/40 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            className="rounded-full bg-background/50 backdrop-blur-sm transition-transform hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-foreground md:text-3xl">
              <Code2 className="h-7 w-7 text-primary" /> DSA Sheet
            </h1>
            <p className="text-xs font-medium text-muted-foreground">
              Master industrial system algorithms step-by-step
            </p>
          </div>
        </div>

        {/* Gamified Analytics Card */}
        <div className="flex items-center gap-4 rounded-2xl border bg-card/40 p-3 px-4 shadow-sm backdrop-blur-md sm:w-auto">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Trophy className="h-5 w-5" />
          </div>
          <div className="min-w-[120px] space-y-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-mono text-foreground">
                {completedCount}/{totalCount}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Categories Navigation Engine */}
      <Tabs defaultValue={firstCategory} className="w-full space-y-6">
        {/* PASTE THIS FIXED BLOCK */}
        <div className="w-full scrollbar-none overflow-x-auto pb-2 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <TabsList className="inline-flex w-max justify-start rounded-xl bg-muted/50 p-1 backdrop-blur-sm">
            {Object.keys(dsaData).map((category) => {
              const categoryProblems = dsaData[category] || []
              const categoryCompleted = categoryProblems.filter((p) =>
                dsaCompleted.includes(p.id)
              ).length

              return (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="relative rounded-lg px-4 py-2 text-xs font-bold whitespace-nowrap text-muted-foreground transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  {category}
                  {categoryCompleted > 0 && (
                    <span className="ml-1.5 rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] text-primary">
                      {categoryCompleted}
                    </span>
                  )}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>

        {Object.entries(dsaData).map(([category, problems]) => (
          <TabsContent
            key={category}
            value={category}
            className="mt-0 animate-in space-y-3 duration-300 fade-in-50 outline-none"
          >
            {problems.map((problem) => {
              const isDone = dsaCompleted.includes(problem.id)

              // Handle clean border styles dynamically based on difficulty
              const difficultyStyles =
                problem.difficulty === "Easy"
                  ? {
                      border: "border-l-emerald-500",
                      badge:
                        "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                    }
                  : problem.difficulty === "Medium"
                    ? {
                        border: "border-l-amber-500",
                        badge:
                          "bg-amber-500/10 text-amber-500 border-amber-500/20",
                      }
                    : {
                        border: "border-l-rose-500",
                        badge:
                          "bg-rose-500/10 text-rose-500 border-rose-500/20",
                      }

              return (
                <div
                  key={problem.id}
                  className={`group flex items-center justify-between rounded-xl border border-l-4 bg-card/40 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-card hover:shadow-md ${difficultyStyles.border} ${isDone ? "opacity-75" : ""}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative flex items-center justify-center">
                      <Checkbox
                        id={problem.id}
                        checked={isDone}
                        onCheckedChange={() =>
                          toggleDsaProblem(problem.id, isDone)
                        }
                        className="h-5 w-5 rounded-md transition-transform group-hover:scale-105 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                      />
                    </div>

                    <div className="space-y-0.5">
                      <label
                        htmlFor={problem.id}
                        className={`cursor-pointer text-sm font-semibold tracking-tight transition-colors ${
                          isDone
                            ? "text-muted-foreground line-through decoration-muted-foreground/60"
                            : "text-foreground group-hover:text-primary"
                        }`}
                      >
                        {problem.title}
                      </label>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-md border px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider uppercase ${difficultyStyles.badge}`}
                        >
                          {problem.difficulty}
                        </span>
                        {isDone && (
                          <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-500">
                            <CheckCircle2 className="h-3 w-3" /> Solved
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-9 w-9 rounded-xl text-muted-foreground opacity-60 transition-all group-hover:opacity-100 hover:scale-105 hover:bg-muted hover:text-foreground hover:opacity-100 md:opacity-0"
                  >
                    <a
                      href={problem.url}
                      target="_blank"
                      rel="noreferrer"
                      title="Open Code Canvas"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              )
            })}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
