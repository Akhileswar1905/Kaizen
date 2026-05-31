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
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, ExternalLink } from "lucide-react"

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

  if (loading)
    return <div className="h-40 animate-pulse rounded-xl bg-muted"></div>

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <BookOpen className="h-5 w-5 text-primary" />
            Varsity Progress
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {completedCount} of {totalChapters} chapters completed
          </p>
        </div>
        <div className="text-2xl font-bold text-primary">
          {progressPercentage}%
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Progress value={progressPercentage} className="h-2 w-full" />

        <Accordion type="single" collapsible className="w-full">
          {varsityModules.map((mod) => {
            const moduleCompleted = mod.chapters.filter((_, idx) =>
              completedSet.has(`${mod.id}-${idx}`)
            ).length

            return (
              <AccordionItem
                key={mod.id}
                value={`item-${mod.id}`}
                className="border-b-border/50"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex flex-col items-start text-left">
                    <span className="font-semibold text-foreground">
                      {mod.title}
                    </span>
                    <span className="text-xs font-normal text-muted-foreground">
                      Module {mod.id} • {moduleCompleted}/{mod.chapters.length}{" "}
                      completed
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-3 pt-2">
                    {mod.chapters.map((chapter, index) => {
                      const isChecked = completedSet.has(`${mod.id}-${index}`)
                      return (
                        <div
                          key={index}
                          className="group flex items-center justify-between rounded-md p-2 transition-colors hover:bg-muted/50"
                        >
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id={`mod-${mod.id}-chap-${index}`}
                              checked={isChecked}
                              onCheckedChange={() =>
                                toggleChapter(mod.id, index, isChecked)
                              }
                              className="h-5 w-5"
                            />
                            <label
                              htmlFor={`mod-${mod.id}-chap-${index}`}
                              className={`cursor-pointer text-sm leading-none font-medium select-none ${
                                isChecked
                                  ? "text-muted-foreground line-through"
                                  : "text-foreground"
                              }`}
                            >
                              {index + 1}. {chapter.title}
                            </label>
                          </div>
                          <a
                            href={chapter.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground opacity-0 transition-colors group-hover:opacity-100 hover:text-primary"
                            title="Read Chapter"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      )
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </CardContent>
    </Card>
  )
}
