import { useEffect } from "react"
import { Sparkles, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface SystemNotificationProps {
  message: string
  stat?: { label: string; value: number }
  levelUp?: number
  isOpen: boolean
  onClose: () => void
}

export function SystemNotification({
  message,
  stat,
  levelUp,
  isOpen,
  onClose,
}: SystemNotificationProps) {
  const isLevelUp = Boolean(levelUp)

  useEffect(() => {
    if (!isOpen) return

    // Keep level-up screens visible slightly longer for impact.
    const duration = isLevelUp ? 6000 : 4500
    const timer = window.setTimeout(onClose, duration)

    return () => window.clearTimeout(timer)
  }, [isOpen, isLevelUp, onClose])

  if (!isOpen) return null

  return (
    <div
      className={cn(
        "fixed z-[100] transition-all duration-300",
        isLevelUp
          ? "pointer-events-auto inset-0 flex items-center justify-center bg-background/55 p-4 backdrop-blur-md"
          : "pointer-events-none top-4 right-4 flex flex-col gap-2 sm:top-6 sm:right-6"
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        role="status"
        className={cn(
          "pointer-events-auto relative w-full overflow-hidden rounded-2xl border border-border/70 bg-card/95 text-card-foreground shadow-xl shadow-black/10 backdrop-blur-2xl",
          "animate-in fade-in slide-in-from-top-2 duration-300",
          isLevelUp
            ? "max-w-md p-7 text-center shadow-2xl zoom-in-95 sm:p-9"
            : "max-w-[min(24rem,calc(100vw-2rem))] p-4 sm:p-5"
        )}
      >
        <div className="absolute inset-x-0 top-0 h-0.5 bg-foreground/15" />
        <div className={cn("space-y-4", isLevelUp && "space-y-6")}>
          <div className={cn("flex items-center gap-2.5", isLevelUp && "justify-center")}>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-muted/70 text-foreground">
              {isLevelUp ? <Sparkles className="h-4 w-4" /> : <Info className="h-4 w-4" />}
            </span>
            <div className={cn("min-w-0 text-left", isLevelUp && "text-center")}>
              <p className="text-sm font-bold tracking-tight">
                {isLevelUp ? "Level up" : "Kaizen update"}
              </p>
              <p className="text-xs font-medium text-muted-foreground">
                {isLevelUp ? "A new milestone reached" : "Progress notification"}
              </p>
            </div>
          </div>

          <p className={cn("text-sm font-semibold leading-relaxed text-foreground", isLevelUp && "text-base")}>
            {message}
          </p>

          {stat && (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-border/70 bg-muted/45 px-4 py-3">
              <span className="text-xs font-semibold text-muted-foreground">{stat.label}</span>
              <span className="text-sm font-black tabular-nums text-foreground">+{stat.value}</span>
            </div>
          )}

          {levelUp !== undefined && levelUp > 0 && (
            <div className="rounded-2xl border border-border/70 bg-muted/35 px-5 py-6">
              <span className="block text-4xl font-black tracking-tight text-foreground sm:text-5xl">
                LV. {levelUp}
              </span>
              <span className="mt-2 block text-xs font-semibold tracking-wide text-muted-foreground">
                KEEP BUILDING MOMENTUM
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
