import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"
import { varsityModules } from "@/lib/varsity"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  Sparkles,
  BookMarked,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function VarsityTracker() {
  const { user } = useAuth()
  const [completedSet, setCompletedSet] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchProgress()
  }, [user])

  const fetchProgress = async () => {
    const { data, error } = await supabase
      .from("varsity_progress")
      .select("module_number, chapter_number")

    if (!error && data) {
      const formatted = new Set(
        data.map((row) => `${row.module_number}-${row.chapter_number}`)
      )
      setCompletedSet(formatted)
    }
    setLoading(false)
  }

  const toggleChapter = async (
    moduleId: number,
    chapterIndex: number,
    isCompleted: boolean
  ) => {
    const key = `${moduleId}-${chapterIndex}`
    const newSet = new Set(completedSet)

    if (isCompleted) {
      newSet.delete(key)
    } else {
      newSet.add(key)
    }
    setCompletedSet(newSet)

    if (isCompleted) {
      await supabase.from("varsity_progress").delete().match({
        user_id: user?.id,
        module_number: moduleId,
        chapter_number: chapterIndex,
      })
    } else {
      await supabase.from("varsity_progress").insert({
        user_id: user?.id,
        module_number: moduleId,
        chapter_number: chapterIndex,
      })
    }
  }

  const totalChapters = varsityModules.reduce(
    (acc, mod) => acc + mod.chapters.length,
    0
  )
  const completedCount = completedSet.size
  const progressPercentage =
    Math.round((completedCount / totalChapters) * 100) || 0

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 w-full animate-pulse rounded-2xl border border-border/40 bg-muted/20" />
        <div className="h-64 w-full animate-pulse rounded-2xl border border-border/40 bg-muted/10" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Core Jumbotron Panel */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl space-y-1.5">
            <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground">
              <Sparkles className="h-4 w-4 text-foreground/60" />
              Varsity Curriculum
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Track your academic modules and reading assignments continuously
              to maintain momentum through the semester.
            </p>
          </div>
          <div className="w-full shrink-0 rounded-xl border border-border/40 bg-muted/10 p-4 sm:w-64">
            <div className="mb-2 flex justify-between text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              <span>Overall Progress</span>
              <span className="font-mono font-semibold text-foreground">
                {progressPercentage}%
              </span>
            </div>
            <Progress
              value={progressPercentage}
              className="mb-2 h-1.5 bg-muted"
            />
            <div className="text-right text-[10px] font-medium text-muted-foreground">
              {completedCount} / {totalChapters} Chapters
            </div>
          </div>
        </div>
      </div>

      {/* Accordion List */}
      <Accordion type="single" collapsible className="w-full space-y-4">
        {varsityModules.map((mod) => {
          const moduleCompletedCount = mod.chapters.filter((_, idx) =>
            completedSet.has(`${mod.id}-${idx}`)
          ).length
          const isFullyCompleted = moduleCompletedCount === mod.chapters.length

          return (
            <AccordionItem
              key={mod.id}
              value={`item-${mod.id}`}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-border/40 bg-card transition-all duration-300 hover:border-border/80 hover:shadow-sm data-[state=open]:border-border/80",
                isFullyCompleted && "border-border/60 bg-muted/5"
              )}
            >
              <AccordionTrigger className="px-5 py-4 transition-colors hover:bg-muted/30 hover:no-underline">
                <div className="flex flex-1 items-center justify-between pr-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-background shadow-sm">
                      <BookMarked className="h-4 w-4 text-foreground/70" />
                    </div>
                    <div className="flex flex-col items-start space-y-1 text-left">
                      <span className="line-clamp-1 text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-foreground/90">
                        {mod.title}
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                        <span className="tracking-wider uppercase">
                          Module {String(mod.id).padStart(2, "0")}
                        </span>
                        <span className="opacity-40">•</span>
                        <span>{mod.chapters.length} Chapters</span>
                      </span>
                    </div>
                  </div>

                  <div className="hidden text-[11px] font-medium text-muted-foreground sm:block">
                    Index:{" "}
                    <span className="font-mono font-bold text-foreground">
                      {moduleCompletedCount}
                    </span>
                    <span className="text-muted-foreground/40">
                      /{mod.chapters.length}
                    </span>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-5 pt-1 pb-5">
                <div className="mt-3 flex flex-col gap-2 border-t border-border/30 pt-4">
                  {mod.chapters.map((chapter, index) => {
                    const isChecked = completedSet.has(`${mod.id}-${index}`)

                    return (
                      <div
                        key={index}
                        className={cn(
                          "group/row flex items-center justify-between rounded-xl border border-border/40 p-3 transition-all duration-200 hover:border-border/80 hover:bg-muted/30",
                          isChecked
                            ? "border-border/20 bg-muted/10 opacity-70 hover:opacity-100"
                            : "bg-card"
                        )}
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-4">
                          <button
                            onClick={() =>
                              toggleChapter(mod.id, index, isChecked)
                            }
                            className="shrink-0 transition-transform focus:outline-none active:scale-90"
                          >
                            {isChecked ? (
                              <CheckCircle2 className="h-5 w-5 stroke-2 text-foreground" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground/30 transition-colors group-hover/row:text-muted-foreground/60" />
                            )}
                          </button>

                          <div
                            onClick={() =>
                              toggleChapter(mod.id, index, isChecked)
                            }
                            className="min-w-0 flex-1 cursor-pointer space-y-0.5"
                          >
                            <span
                              className={cn(
                                "block truncate text-sm font-medium tracking-tight transition-colors",
                                isChecked
                                  ? "text-muted-foreground line-through decoration-muted-foreground/30"
                                  : "text-foreground"
                              )}
                            >
                              {chapter.title}
                            </span>
                            <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground/60">
                              <span className="font-mono tracking-wider uppercase">
                                Chapter {String(index + 1).padStart(2, "0")}
                              </span>
                            </div>
                          </div>
                        </div>

                        {chapter.url && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-2 h-8 w-8 shrink-0 rounded-lg border border-transparent opacity-0 transition-opacity group-hover/row:opacity-100 hover:border-border/40 hover:bg-background"
                            asChild
                          >
                            <a
                              href={chapter.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Read Chapter"
                            >
                              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                            </a>
                          </Button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
