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
  ChevronRight,
  GraduationCap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useGamification } from "@/contexts/GamificationContext"

export function VarsityTracker() {
  const { user } = useAuth()
  const { triggerGamificationEvent, subtractGamificationPoints } =
    useGamification()
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
      await subtractGamificationPoints({
        type: "VARSITY_CHAPTER_COMPLETED",
        amount: 1,
      })
    } else {
      await supabase.from("varsity_progress").insert({
        user_id: user?.id,
        module_number: moduleId,
        chapter_number: chapterIndex,
      })
      await triggerGamificationEvent({
        type: "VARSITY_CHAPTER_COMPLETED",
        amount: 1,
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
      <div className="mx-auto max-w-4xl animate-pulse space-y-6 p-4 sm:p-8">
        <div className="h-40 w-full rounded-2xl bg-muted/20" />
        <div className="h-64 w-full rounded-2xl bg-muted/10" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl animate-in space-y-8 p-2 duration-700 fade-in sm:p-2">
      {/* Top Banner Dashboard Panel */}
      <div className="relative overflow-hidden rounded-2xl border border-none bg-linear-to-br from-primary/10 via-primary/5 to-transparent p-6 sm:p-8">
        <div className="pointer-events-none absolute -top-6 -right-6 opacity-[0.04] sm:opacity-10">
          <GraduationCap className="h-40 w-40 rotate-12 text-primary" />
        </div>

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-2">
            <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
              <Sparkles className="h-5 w-5 text-primary" />
              Varsity Curriculum
            </h2>
            <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
              Keep your module benchmarks aligned. Track reading intervals and
              academic milestones dynamically to maximize learning retention
              throughout the semester.
            </p>
          </div>

          <div className="w-full shrink-0 rounded-xl border border-border/30 bg-card/40 p-4 shadow-inner backdrop-blur-md md:w-72">
            <div className="mb-2 flex justify-between text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              <span>Syllabus Covered</span>
              <span className="font-mono font-bold text-primary">
                {progressPercentage}%
              </span>
            </div>
            <Progress
              value={progressPercentage}
              className="mb-2 h-1.5 bg-muted/50"
            />
            <div className="text-left text-[10px] font-semibold text-muted-foreground/80">
              {completedCount} of {totalChapters} chapters unlocked
            </div>
          </div>
        </div>
      </div>

      {/* Accordion Module Layout */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 px-1 text-xs font-bold tracking-widest text-muted-foreground uppercase">
          <ChevronRight className="h-3 w-3 text-primary" /> Core Syllabus
          Modules
        </h3>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {varsityModules.map((mod) => {
            const moduleCompletedCount = mod.chapters.filter((_, idx) =>
              completedSet.has(`${mod.id}-${idx}`)
            ).length
            const isFullyCompleted =
              moduleCompletedCount === mod.chapters.length
            const modulePercent =
              Math.round((moduleCompletedCount / mod.chapters.length) * 100) ||
              0

            return (
              <AccordionItem
                key={mod.id}
                value={`item-${mod.id}`}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-border/80 hover:shadow-sm data-[state=open]:border-border/80 data-[state=open]:bg-card",
                  isFullyCompleted &&
                    "border-primary/20 bg-muted/5 backdrop-blur-none"
                )}
              >
                <AccordionTrigger className="px-5 py-4 transition-colors hover:bg-muted/20 hover:no-underline">
                  <div className="flex flex-1 flex-col justify-between gap-4 pr-4 text-left sm:flex-row sm:items-center">
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <div
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-background text-muted-foreground/80 shadow-sm transition-colors group-hover:text-primary",
                          isFullyCompleted &&
                            "border-primary/30 bg-primary/5 text-primary"
                        )}
                      >
                        <BookMarked className="h-4 w-4" />
                      </div>
                      <div className="flex min-w-0 flex-col space-y-1">
                        <span className="truncate text-sm font-bold tracking-tight text-foreground">
                          {mod.title}
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-wide text-muted-foreground/80 uppercase">
                          Module {String(mod.id).padStart(2, "0")}
                          <span className="text-muted-foreground/40">•</span>
                          <span className="font-mono font-medium normal-case">
                            {mod.chapters.length} chapters
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Module Progress Metric */}
                    <div className="flex w-32 shrink-0 items-center gap-3 self-end sm:w-auto sm:self-center">
                      <div className="flex w-full flex-col items-end gap-1 sm:w-24">
                        <span className="font-mono text-[11px] font-bold text-foreground/90">
                          {moduleCompletedCount}
                          <span className="font-normal text-muted-foreground/40">
                            /{mod.chapters.length}
                          </span>
                        </span>
                        <Progress
                          value={modulePercent}
                          className="h-1 w-16 bg-muted/60"
                        />
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-5 pt-2 pb-5">
                  <div className="mt-2 flex flex-col gap-2 border-t border-border/30 pt-4">
                    {mod.chapters.map((chapter, index) => {
                      const isChecked = completedSet.has(`${mod.id}-${index}`)

                      return (
                        <div
                          key={index}
                          className={cn(
                            "group/row flex items-center justify-between gap-4 rounded-xl border border-border/40 p-3.5 transition-all duration-200 hover:border-border/80 hover:bg-muted/30",
                            isChecked
                              ? "border-border/10 bg-muted/10 opacity-60 hover:opacity-90"
                              : "bg-card/50"
                          )}
                        >
                          <div className="flex min-w-0 flex-1 items-center gap-3.5">
                            <button
                              type="button"
                              onClick={() =>
                                toggleChapter(mod.id, index, isChecked)
                              }
                              className="shrink-0 transition-transform focus:outline-none active:scale-95"
                            >
                              {isChecked ? (
                                <CheckCircle2 className="h-5 w-5 stroke-[2.5] text-primary" />
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
                                  "block truncate text-sm font-semibold tracking-tight text-foreground transition-colors",
                                  isChecked &&
                                    "font-medium text-muted-foreground line-through decoration-muted-foreground/40"
                                )}
                              >
                                {chapter.title}
                              </span>
                              <div className="font-mono text-[10px] font-bold tracking-wider text-muted-foreground/50 uppercase">
                                Unit {String(index + 1).padStart(2, "0")}
                              </div>
                            </div>
                          </div>

                          {chapter.url && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0 rounded-lg border border-transparent opacity-100 shadow-sm transition-all group-hover/row:opacity-100 hover:border-border/50 hover:bg-background sm:opacity-0"
                              asChild
                            >
                              <a
                                href={chapter.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Read Chapter"
                              >
                                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/80 hover:text-foreground" />
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
    </div>
  )
}
