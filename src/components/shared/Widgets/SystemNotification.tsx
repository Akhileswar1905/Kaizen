import { useEffect } from "react"
import { Zap, Trophy } from "lucide-react"
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
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 5000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const isLevelUp = !!levelUp

  return (
    <div
      className={cn(
        "pointer-events-none fixed z-100 transition-all duration-500",
        isLevelUp
          ? "inset-0 flex items-center justify-center"
          : "top-6 right-6 flex flex-col gap-2"
      )}
    >
      <div
        className={cn(
          "animate-in overflow-hidden rounded-lg border bg-card p-0 shadow-2xl transition-all duration-300 fade-in",
          isLevelUp
            ? "w-full max-w-md scale-110 border-primary bg-card/90 shadow-primary/40 backdrop-blur-xl"
            : "w-72 border-primary bg-card p-4 shadow-primary/20"
        )}
      >
        {/* Header Line */}
        <div
          className={cn("h-1 w-full bg-primary", isLevelUp && "animate-pulse")}
        />

        <div
          className={cn(
            "p-4",
            !isLevelUp && "p-0" // Handle padding differently for toast
          )}
        >
          <div className="mb-2 flex items-center gap-2">
            {isLevelUp ? (
              <Trophy className="h-5 w-5 animate-bounce text-primary" />
            ) : (
              <Zap className="h-4 w-4 animate-pulse text-primary" />
            )}
            <span
              className={cn(
                "font-mono font-bold tracking-widest text-primary uppercase",
                isLevelUp ? "text-sm" : "text-[10px]"
              )}
            >
              {isLevelUp ? "System: Level Up Achieved" : "System Message"}
            </span>
          </div>

          <div className="space-y-3">
            <p
              className={cn(
                "font-mono text-foreground",
                isLevelUp
                  ? "text-center text-lg font-bold"
                  : "text-sm font-medium"
              )}
            >
              {message}
            </p>

            {stat && (
              <div
                className={cn(
                  "flex items-center justify-center gap-2 font-mono font-bold text-primary",
                  isLevelUp ? "text-base" : "text-xs"
                )}
              >
                <span>{stat.label}</span>
                <span className="text-lg">+{stat.value}</span>
              </div>
            )}

            {levelUp && (
              <div className="mt-4 animate-in rounded-md border border-primary/30 bg-primary/10 p-4 text-center duration-500 zoom-in">
                <span className="block font-mono text-2xl font-black tracking-tighter text-primary uppercase">
                  LEVEL {levelUp}
                </span>
                <span className="font-mono text-[10px] tracking-[0.3em] text-primary/60 uppercase">
                  Limits broken. Potential expanded.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
