import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Save,
  Loader2,
  Sparkles,
} from "lucide-react"
import { useTracker } from "@/hooks/useTracker"
import { format, parseISO } from "date-fns"

export function JournalView({ onBack }: { onBack: () => void }) {
  const { journals, saveJournalEntry, isSavingJournal } = useTracker()

  const todayStr = format(new Date(), "yyyy-MM-dd")
  const [activeDate, setActiveDate] = useState(todayStr)
  const [journalText, setJournalText] = useState("")

  useEffect(() => {
    const entry = journals.find((j) => j.entry_date === activeDate)
    setJournalText(entry ? entry.content : "")
  }, [activeDate, journals])

  const handleSave = () => {
    saveJournalEntry(activeDate, journalText)
  }

  const displayJournals = [...journals]
  if (!displayJournals.find((j) => j.entry_date === todayStr)) {
    displayJournals.unshift({ entry_date: todayStr, content: "" })
  }

  displayJournals.sort((a, b) => b.entry_date.localeCompare(a.entry_date))

  return (
    <div className="mx-auto flex h-[calc(100vh-2rem)] max-w-6xl animate-in flex-col gap-4 p-4 duration-500 fade-in slide-in-from-bottom-4 md:gap-6 md:p-6">
      {/* RESPONSIVE HEADER: Stacks on mobile, rows on desktop */}
      <div className="flex flex-col gap-4 border-b border-border/40 pb-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Left Side: Navigation Context */}
        <div className="flex items-start gap-3 sm:items-center sm:gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            className="mt-0.5 shrink-0 rounded-full bg-background/50 backdrop-blur-sm transition-transform hover:scale-105 active:scale-95 sm:mt-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-0.5">
            <h1 className="flex items-center gap-2 text-xl font-black tracking-tight text-foreground sm:text-2xl md:text-3xl">
              <BookOpen className="h-5 w-5 shrink-0 text-primary sm:h-6 sm:w-6 md:h-7 md:w-7" />
              <span>Daily Journal</span>
            </h1>
            <p className="text-[11px] leading-normal font-medium text-muted-foreground sm:text-xs">
              Clear mental clutter and log architectural adjustments
            </p>
          </div>
        </div>

        {/* Right Side Action: Adapts size beautifully */}
        <Button
          size="sm"
          className="w-full shrink-0 gap-2 rounded-xl px-4 py-2.5 font-semibold shadow-sm shadow-primary/20 transition-all active:scale-95 sm:w-auto sm:py-2"
          onClick={handleSave}
          disabled={isSavingJournal}
        >
          {isSavingJournal ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSavingJournal ? "Saving..." : "Save Entry"}
        </Button>
      </div>

      {/* Main Splits Workspace */}
      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Left Side: Editorial Timeline Selector */}
        <div className="hidden h-full w-72 flex-col gap-3 border-r border-border/40 pr-4 md:flex">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-extrabold tracking-widest text-muted-foreground uppercase">
              Entries Timeline
            </span>
            <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
              {displayJournals.length} Days
            </span>
          </div>

          <ScrollArea className="flex-1 pr-2">
            <div className="space-y-2 pb-4">
              {displayJournals.map((entry) => {
                const isToday = entry.entry_date === todayStr
                const isActive = activeDate === entry.entry_date
                const displayDate = isToday
                  ? "Today"
                  : format(parseISO(entry.entry_date), "MMM d, yyyy")

                const abstract = entry.content.trim()
                  ? entry.content.substring(0, 30) + "..."
                  : "Draft empty..."

                return (
                  <button
                    key={entry.entry_date}
                    onClick={() => setActiveDate(entry.entry_date)}
                    className={`group relative w-full rounded-xl border border-l-4 p-3 text-left transition-all duration-200 ${
                      isActive
                        ? "border-primary border-l-primary bg-primary/5 font-semibold text-foreground shadow-sm shadow-primary/5"
                        : "border-transparent border-l-transparent bg-card/40 text-muted-foreground hover:bg-card hover:text-foreground"
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between text-xs font-bold text-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar
                          className={`h-3.5 w-3.5 transition-colors ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}
                        />
                        {displayDate}
                      </div>
                      {isToday && !isActive && (
                        <Sparkles className="h-3 w-3 animate-pulse text-primary" />
                      )}
                    </div>
                    <p
                      className={`truncate text-[11px] leading-relaxed transition-colors ${isActive ? "text-foreground/80" : "text-muted-foreground/70"}`}
                    >
                      {abstract}
                    </p>
                  </button>
                )
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Right Side: Distraction-Free Canvas Workspace */}
        <div className="flex h-full flex-1 animate-in flex-col gap-3 duration-300 fade-in-50">
          <div className="flex items-center justify-between border-b border-border/20 pb-2">
            <div className="space-y-0.5">
              <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                Active Session
              </span>
              <h2 className="text-sm font-bold text-foreground">
                {activeDate === todayStr
                  ? "Today's Logbook"
                  : format(parseISO(activeDate), "eeee, MMMM d, yyyy")}
              </h2>
            </div>

            <div className="rounded-lg border bg-muted/30 px-2 py-1 font-mono text-[10px] font-bold tracking-tight text-muted-foreground">
              {journalText.length}{" "}
              <span className="font-sans font-medium text-muted-foreground/60">
                chars
              </span>
            </div>
          </div>

          <div className="group relative flex-1">
            <Textarea
              className="h-full w-full resize-none rounded-2xl border border-border/60 bg-card/20 p-4 font-serif text-base leading-relaxed shadow-inner transition-all placeholder:font-sans placeholder:text-sm placeholder:text-muted-foreground/40 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20 md:p-6 md:text-lg"
              placeholder="What's blocking your momentum right now? Map out structural friction points, systems engineering insights, or tactical reflections..."
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
            />
            <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-linear-to-tr from-primary/5 via-transparent to-transparent opacity-0 blur-xl transition-opacity duration-300 group-focus-within:opacity-100" />
          </div>
        </div>
      </div>
    </div>
  )
}
