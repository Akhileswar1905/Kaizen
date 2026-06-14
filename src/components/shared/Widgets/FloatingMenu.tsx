import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  BicepsFlexed,
  Book,
  BookOpen,
  GraduationCap,
  MenuIcon,
  StickyNote,
  Wallet,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FloatingMenuProps {
  onOpenDSA: () => void
  onOpenJournal: () => void
  onOpenFinance: () => void
  onOpenSystemDesign: () => void
  onOpenNotes?: () => void
  onOpenWorkoutTracker?: () => void
}

export function FloatingMenu({
  onOpenDSA,
  onOpenJournal,
  onOpenFinance,
  onOpenSystemDesign,
  onOpenNotes,
  onOpenWorkoutTracker,
}: FloatingMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu automatically if user clicks outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div
      ref={menuRef}
      className="pointer-events-none fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6"
    >
      {/* Expanded Menu Stack */}
      <div
        className={cn(
          "pointer-events-none flex origin-bottom flex-col items-end gap-3 transition-all duration-300 ease-out",
          isOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "translate-y-4 scale-75 opacity-0"
        )}
      >
        {/* Option 1: DSA Problemsheet */}
        <div className="group flex items-center gap-3">
          <span className="rounded-lg border bg-popover px-2.5 py-1 text-xs font-semibold text-popover-foreground shadow-sm transition-opacity group-hover:opacity-100 md:opacity-0">
            DSA Problemsheet
          </span>
          <Button
            variant="secondary"
            size="icon"
            className="h-12 w-12 rounded-full border bg-card shadow-md hover:bg-accent hover:text-accent-foreground"
            onClick={() => {
              onOpenDSA()
              setIsOpen(false)
            }}
          >
            <GraduationCap className="h-5 w-5" />
          </Button>
        </div>

        {/* Option 2: Journal */}
        <div className="group flex items-center gap-3">
          <span className="rounded-lg border bg-popover px-2.5 py-1 text-xs font-semibold text-popover-foreground shadow-sm transition-opacity group-hover:opacity-100 md:opacity-0">
            Journal
          </span>
          <Button
            variant="secondary"
            size="icon"
            className="h-12 w-12 rounded-full border bg-card shadow-md hover:bg-accent hover:text-accent-foreground"
            onClick={() => {
              onOpenJournal()
              setIsOpen(false)
            }}
          >
            <BookOpen className="h-5 w-5" />
          </Button>
        </div>

        {/* Option 3: Finance */}
        <div className="group flex items-center gap-3">
          <span className="rounded-lg border bg-popover px-2.5 py-1 text-xs font-semibold text-popover-foreground shadow-sm transition-opacity group-hover:opacity-100 md:opacity-0">
            Finance & Learning
          </span>
          <Button
            variant="secondary"
            size="icon"
            className="h-12 w-12 rounded-full border bg-card shadow-md hover:bg-accent hover:text-accent-foreground"
            onClick={() => {
              onOpenFinance()
              setIsOpen(false)
            }}
          >
            <Wallet className="h-5 w-5" />
          </Button>
        </div>

        {/* Option 4: System Design */}
        <div className="group flex items-center gap-3">
          <span className="rounded-lg border bg-popover px-2.5 py-1 text-xs font-semibold text-popover-foreground shadow-sm transition-opacity group-hover:opacity-100 md:opacity-0">
            System Design
          </span>
          <Button
            variant="secondary"
            size="icon"
            className="h-12 w-12 rounded-full border bg-card shadow-md hover:bg-accent hover:text-accent-foreground"
            onClick={() => {
              onOpenSystemDesign()
              setIsOpen(false)
            }}
          >
            <Book className="h-5 w-5" />
          </Button>
        </div>

        {/* Option 5: Notes */}
        <div className="group flex items-center gap-3">
          <span className="rounded-lg border bg-popover px-2.5 py-1 text-xs font-semibold text-popover-foreground shadow-sm transition-opacity group-hover:opacity-100 md:opacity-0">
            Notes
          </span>
          <Button
            variant="secondary"
            size="icon"
            className="h-12 w-12 rounded-full border bg-card shadow-md hover:bg-accent hover:text-accent-foreground"
            onClick={() => {
              onOpenNotes?.()
              setIsOpen(false)
            }}
          >
            <StickyNote className="h-5 w-5" />
          </Button>
        </div>

        {/* Option 6: Workout Tracker */}
        <div className="group flex items-center gap-3">
          <span className="rounded-lg border bg-popover px-2.5 py-1 text-xs font-semibold text-popover-foreground shadow-sm transition-opacity group-hover:opacity-100 md:opacity-0">
            Workout Tracker
          </span>
          <Button
            variant="secondary"
            size="icon"
            className="h-12 w-12 rounded-full border bg-card shadow-md hover:bg-accent hover:text-accent-foreground"
            onClick={() => {
              onOpenWorkoutTracker?.()
              setIsOpen(false)
            }}
          >
            <BicepsFlexed className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Trigger FAB */}
      <Button
        size="icon"
        className="pointer-events-auto h-14 w-14 rounded-full shadow-xl transition-all duration-300 ease-in-out sm:h-16 sm:w-16"
      >
        <MenuIcon className="h-6 w-6" />
      </Button>
    </div>
  )
}
