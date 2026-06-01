import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
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
}

export function FloatingMenu({
  onOpenDSA,
  onOpenJournal,
  onOpenFinance,
  onOpenSystemDesign,
  onOpenNotes,
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
      className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3"
    >
      {/* Expanded Menu Stack */}
      <div
        className={cn(
          "flex origin-bottom flex-col items-end gap-3 transition-all duration-300 ease-out",
          isOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-75 opacity-0"
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
      </div>

      {/* Main Trigger FAB */}
      <Button
        size="icon"
        className={cn(
          "h-14 w-14 rounded-full shadow-xl transition-all duration-300 ease-in-out",
          isOpen
            ? "text-destructive-foreground rotate-45 bg-destructive hover:bg-destructive/90"
            : "bg-primary text-primary-foreground hover:scale-105 hover:bg-primary/90"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <MenuIcon className="h-6 w-6" />
      </Button>
    </div>
  )
}
