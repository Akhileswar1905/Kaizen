import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  BicepsFlexed,
  Book,
  BookOpen,
  Calendar,
  GraduationCap,
  Grid2x2,
  LayoutDashboard,
  ListChecks,
  MoreHorizontal,
  StickyNote,
  Target,
  Wallet,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

const HIDDEN_MENU_ITEMS = ["journal", "system-design", "workout-tracker", "time-audit"] as const

interface FloatingMenuProps {
  onOpenDashboard: () => void
  onOpenHabits: () => void
  onOpenDSA: () => void
  onOpenJournal: () => void
  onOpenFinance: () => void
  onOpenSystemDesign: () => void
  onOpenNotes?: () => void
  onOpenWorkoutTracker?: () => void
  onOpenPlanner?: () => void
  onOpenTimeAudit?: () => void
  onOpenLearningChecklist?: () => void
  activeView: string
}

export function FloatingMenu({
  onOpenDashboard,
  onOpenHabits,
  onOpenDSA,
  onOpenJournal,
  onOpenFinance,
  onOpenSystemDesign,
  onOpenNotes,
  onOpenWorkoutTracker,
  onOpenPlanner,
  onOpenTimeAudit,
  onOpenLearningChecklist,
  activeView,
}: FloatingMenuProps) {
  const [moreOpen, setMoreOpen] = useState(false)

  const items = [
    { label: "Dashboard", view: "dashboard", icon: LayoutDashboard, action: onOpenDashboard },
    { label: "Habits", view: "habits", icon: Target, action: onOpenHabits },
    { label: "DSA", view: "dsa", icon: GraduationCap, action: onOpenDSA },
    { label: "Finance", view: "finance", icon: Wallet, action: onOpenFinance },
    { label: "Notes", view: "notes", icon: StickyNote, action: () => onOpenNotes?.() },
    { label: "Planner", view: "planner", icon: Calendar, action: () => onOpenPlanner?.() },
    { label: "Learning", view: "learning-checklist", icon: ListChecks, action: () => onOpenLearningChecklist?.() },
    ...(!HIDDEN_MENU_ITEMS.includes("journal") ? [{ label: "Journal", view: "journal", icon: BookOpen, action: onOpenJournal }] : []),
    ...(!HIDDEN_MENU_ITEMS.includes("system-design") ? [{ label: "System design", view: "system-design", icon: Book, action: onOpenSystemDesign }] : []),
    ...(!HIDDEN_MENU_ITEMS.includes("workout-tracker") ? [{ label: "Workout", view: "workout-tracker", icon: BicepsFlexed, action: () => onOpenWorkoutTracker?.() }] : []),
    ...(!HIDDEN_MENU_ITEMS.includes("time-audit") ? [{ label: "Time audit", view: "time-audit", icon: Grid2x2, action: () => onOpenTimeAudit?.() }] : []),
  ]

  const mobilePrimary = items.filter((item) =>
    ["dashboard", "habits", "dsa", "planner"].includes(item.view)
  )
  const mobileMore = items.filter((item) => !mobilePrimary.includes(item))
  const moreIsActive = mobileMore.some((item) => item.view === activeView)

  const navigate = (action: () => void) => {
    action()
    setMoreOpen(false)
  }

  const renderIconButton = (item: (typeof items)[number], compact = false) => (
    <Button
      key={item.view}
      variant="ghost"
      size="icon"
      title={item.label}
      aria-label={item.label}
      aria-current={activeView === item.view ? "page" : undefined}
      onClick={() => navigate(item.action)}
      className={cn(
        "shrink-0 rounded-xl text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary",
        compact ? "h-11 w-11" : "h-10 w-10 sm:h-12 sm:w-12",
        "focus-visible:ring-2 focus-visible:ring-primary",
        activeView === item.view
          ? "is-active bg-foreground/10 text-foreground shadow-sm ring-1 ring-foreground/10 hover:bg-foreground/10 hover:text-foreground"
          : "text-muted-foreground"
      )}
    >
      <item.icon className="h-5 w-5" strokeWidth={activeView === item.view ? 2.5 : 1.9} />
    </Button>
  )

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:bottom-6 sm:pb-0">
      {moreOpen && (
        <>
          <button
            type="button"
            aria-label="Close navigation menu"
            className="pointer-events-auto fixed inset-0 z-[-1] bg-background/20"
            onClick={() => setMoreOpen(false)}
          />
          <div className="kaizen-dock-more pointer-events-auto absolute bottom-[calc(100%+0.65rem)] right-3 grid w-[min(19rem,calc(100vw-1.5rem))] grid-cols-3 gap-2 rounded-2xl border border-border/70 bg-card/95 p-3 shadow-2xl backdrop-blur-xl sm:hidden">
            {mobileMore.map((item) => (
              <button
                key={item.view}
                type="button"
                onClick={() => navigate(item.action)}
                aria-current={activeView === item.view ? "page" : undefined}
                className={cn(
                  "flex min-w-0 flex-col items-center justify-center gap-2 rounded-xl px-2 py-3 text-center text-[11px] font-semibold transition-colors",
                  activeView === item.view
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" strokeWidth={2} />
                <span className="w-full truncate">{item.label}</span>
              </button>
            ))}
          </div>
        </>
      )}

      <div className="kaizen-dock pointer-events-auto flex w-full max-w-[min(100%,28rem)] items-center justify-around gap-1 rounded-2xl p-1.5 shadow-xl sm:hidden">
        {mobilePrimary.map((item) => renderIconButton(item, true))}
        <Button
          variant="ghost"
          size="icon"
          title="More pages"
          aria-label={moreOpen ? "Close more pages" : "More pages"}
          aria-expanded={moreOpen}
          onClick={() => setMoreOpen((open) => !open)}
          className={cn(
            "h-11 w-11 shrink-0 rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary",
            moreOpen || moreIsActive
              ? "bg-foreground/10 text-foreground ring-1 ring-foreground/10"
              : ""
          )}
        >
          {moreOpen ? <X className="h-5 w-5" /> : <MoreHorizontal className="h-5 w-5" />}
        </Button>
      </div>

      <div className="kaizen-dock pointer-events-auto hidden max-w-[calc(100vw-1.5rem)] items-end gap-1.5 rounded-2xl p-2 sm:flex sm:gap-2 sm:p-2.5">
        {items.map((item) => renderIconButton(item))}
      </div>
    </div>
  )
}
