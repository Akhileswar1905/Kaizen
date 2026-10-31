import { Button } from "@/components/ui/button"
import {
  BicepsFlexed,
  Book,
  BookOpen,
  Calendar,
  GraduationCap,
  Grid2x2,
  ListChecks,
  StickyNote,
  Wallet,
} from "lucide-react"
import { cn } from "@/lib/utils"

const HIDDEN_MENU_ITEMS = ["journal", "system-design", "workout-tracker", "time-audit"] as const

interface FloatingMenuProps {
  onOpenDSA: () => void
  onOpenJournal: () => void
  onOpenFinance: () => void
  onOpenSystemDesign: () => void
  onOpenNotes?: () => void
  onOpenWorkoutTracker?: () => void
  onOpenPlanner?: () => void
  onOpenTimeAudit?: () => void
  onOpenLearningChecklist?: () => void
}

export function FloatingMenu({
  onOpenDSA,
  onOpenJournal,
  onOpenFinance,
  onOpenSystemDesign,
  onOpenNotes,
  onOpenWorkoutTracker,
  onOpenPlanner,
  onOpenTimeAudit,
  onOpenLearningChecklist,
}: FloatingMenuProps) {
  const items = [
    { label: "DSA", icon: GraduationCap, action: onOpenDSA },
    { label: "Finance", icon: Wallet, action: onOpenFinance },
    { label: "Notes", icon: StickyNote, action: () => onOpenNotes?.() },
    { label: "Planner", icon: Calendar, action: () => onOpenPlanner?.() },
    { label: "Learning", icon: ListChecks, action: () => onOpenLearningChecklist?.() },
    ...(!HIDDEN_MENU_ITEMS.includes("journal") ? [{ label: "Journal", icon: BookOpen, action: onOpenJournal }] : []),
    ...(!HIDDEN_MENU_ITEMS.includes("system-design") ? [{ label: "System design", icon: Book, action: onOpenSystemDesign }] : []),
    ...(!HIDDEN_MENU_ITEMS.includes("workout-tracker") ? [{ label: "Workout", icon: BicepsFlexed, action: () => onOpenWorkoutTracker?.() }] : []),
    ...(!HIDDEN_MENU_ITEMS.includes("time-audit") ? [{ label: "Time audit", icon: Grid2x2, action: () => onOpenTimeAudit?.() }] : []),
  ]

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-3 sm:bottom-6">
      <div className="kaizen-dock pointer-events-auto flex max-w-[calc(100vw-1.5rem)] items-end gap-1.5 rounded-2xl p-2 sm:gap-2 sm:p-2.5">
        {items.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            size="icon"
            title={item.label}
            aria-label={item.label}
            onClick={item.action}
            className={cn(
              "h-10 w-10 shrink-0 rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary sm:h-12 sm:w-12",
              "focus-visible:ring-2 focus-visible:ring-primary"
            )}
          >
            <item.icon className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" />
          </Button>
        ))}
      </div>
    </div>
  )
}
