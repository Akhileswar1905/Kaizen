import { useEffect } from "react"
import { ShieldAlert, Sparkles } from "lucide-react"
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
      // Keep level-up screens visible slightly longer for impact
      const duration = levelUp ? 6000 : 4500
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose, levelUp])

  if (!isOpen) return null

  const isLevelUp = !!levelUp

  return (
    <div
      className={cn(
        "fixed z-50 transition-all duration-500",
        isLevelUp
          ? "pointer-events-auto inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          : "pointer-events-none top-6 right-6 flex flex-col gap-2"
      )}
    >
      <div
        className={cn(
          "pointer-events-auto animate-in overflow-hidden border bg-zinc-950/95 shadow-2xl transition-all duration-300",
          isLevelUp
            ? "relative w-full max-w-md scale-100 rounded-none border-white/40 p-6 text-center tracking-tight shadow-white/10 duration-500 zoom-in-95"
            : "w-80 rounded-sm border-zinc-800 p-4 shadow-black/80 fade-in slide-in-from-top-4"
        )}
      >
        {/* Solo Leveling Corner UI Framing Accents (Only for Level Up Screens) */}
        {isLevelUp && (
          <>
            <div className="absolute top-2 left-2 h-2 w-2 border-t-2 border-l-2 border-white/60" />
            <div className="absolute top-2 right-2 h-2 w-2 border-t-2 border-r-2 border-white/60" />
            <div className="absolute bottom-2 left-2 h-2 w-2 border-b-2 border-l-2 border-white/60" />
            <div className="absolute right-2 bottom-2 h-2 w-2 border-r-2 border-b-2 border-white/60" />
          </>
        )}

        {/* Top Status Border Strip */}
        <div
          className={cn(
            "absolute top-0 left-0 h-[2px] bg-white transition-all",
            isLevelUp ? "w-full animate-pulse opacity-80" : "w-1/3 opacity-40"
          )}
        />

        <div className="space-y-4">
          {/* Header Module */}
          <div
            className={cn(
              "flex items-center gap-2",
              isLevelUp ? "justify-center" : "justify-start"
            )}
          >
            {isLevelUp ? (
              <Sparkles className="h-4 w-4 animate-spin text-white [animation-duration:3s]" />
            ) : (
              <ShieldAlert className="h-3.5 w-3.5 text-zinc-400" />
            )}
            <span
              className={cn(
                "font-mono font-black tracking-[0.25em] text-white uppercase",
                isLevelUp ? "text-xs" : "text-[10px] text-zinc-400"
              )}
            >
              {isLevelUp ? "[ SYSTEM: LEVELED UP ]" : "[ SYSTEM NOTICE ]"}
            </span>
          </div>

          {/* Content Body Module */}
          <div className={cn("space-y-3", isLevelUp ? "py-2" : "py-0")}>
            <p
              className={cn(
                "font-mono leading-relaxed font-medium text-zinc-300",
                isLevelUp ? "text-base tracking-wide text-white" : "text-xs"
              )}
            >
              {isLevelUp ? `Congratulations. ${message}` : message}
            </p>

            {/* Incremental Stat Updates */}
            {stat && (
              <div
                className={cn(
                  "flex items-center justify-between border border-zinc-800/80 bg-zinc-900/60 px-3 py-1.5 font-mono font-bold tracking-wide text-white",
                  isLevelUp ? "mx-auto max-w-xs text-sm" : "text-xs"
                )}
              >
                <span className="text-[10px] tracking-wider text-zinc-400 uppercase">
                  {stat.label}
                </span>
                <span>[ +{stat.value} ]</span>
              </div>
            )}

            {/* Main Level Crest */}
            {levelUp && (
              <div className="mt-6 border-y border-zinc-800 bg-zinc-900/20 py-4 text-center">
                <span className="block font-mono text-4xl font-black tracking-tight text-white">
                  LV. {levelUp}
                </span>
                <span className="mt-1 block font-mono text-[9px] font-bold tracking-[0.35em] text-zinc-500 uppercase">
                  Limits Broken // Potential Expanded
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
