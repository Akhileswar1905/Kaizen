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
          ? "pointer-events-auto inset-0 flex items-center justify-center bg-black/90 backdrop-blur-md"
          : "pointer-events-none top-6 right-6 flex flex-col gap-2"
      )}
    >
      <div
        className={cn(
          "pointer-events-auto relative animate-in overflow-hidden bg-zinc-950/95 backdrop-blur-xl transition-all duration-300",
          isLevelUp
            ? "w-full max-w-md scale-100 border border-white/40 p-8 text-center shadow-[0_0_60px_-10px_rgba(255,255,255,0.2)] duration-500 zoom-in-95"
            : "w-80 border border-zinc-700 p-5 shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)] fade-in slide-in-from-top-4"
        )}
      >
        {/* Solo Leveling Corner UI Framing Accents (Monochrome) */}
        <div
          className={cn(
            "absolute top-0 left-0 h-4 w-4 border-t-[3px] border-l-[3px]",
            isLevelUp
              ? "border-white/80 shadow-[0_0_8px_rgba(255,255,255,0.5)]"
              : "border-zinc-500"
          )}
        />
        <div
          className={cn(
            "absolute top-0 right-0 h-4 w-4 border-t-[3px] border-r-[3px]",
            isLevelUp
              ? "border-white/80 shadow-[0_0_8px_rgba(255,255,255,0.5)]"
              : "border-zinc-500"
          )}
        />
        <div
          className={cn(
            "absolute bottom-0 left-0 h-4 w-4 border-b-[3px] border-l-[3px]",
            isLevelUp
              ? "border-white/80 shadow-[0_0_8px_rgba(255,255,255,0.5)]"
              : "border-zinc-500"
          )}
        />
        <div
          className={cn(
            "absolute right-0 bottom-0 h-4 w-4 border-r-[3px] border-b-[3px]",
            isLevelUp
              ? "border-white/80 shadow-[0_0_8px_rgba(255,255,255,0.5)]"
              : "border-zinc-500"
          )}
        />

        {/* Top Status Border Strip (Scanning Effect) */}
        <div
          className={cn(
            "absolute top-0 left-0 h-[1px] transition-all",
            isLevelUp
              ? "w-full animate-pulse bg-white opacity-90 drop-shadow-[0_0_5px_rgba(255,255,255,1)]"
              : "w-1/2 bg-zinc-400 opacity-60"
          )}
        />

        <div className="space-y-5">
          {/* Header Module */}
          <div
            className={cn(
              "flex items-center gap-2",
              isLevelUp ? "justify-center" : "justify-start"
            )}
          >
            {isLevelUp ? (
              <Sparkles className="h-5 w-5 animate-pulse text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] [animation-duration:2s]" />
            ) : (
              <Info className="h-4 w-4 text-zinc-400" />
            )}
            <span
              className={cn(
                "font-mono font-black tracking-[0.3em] uppercase",
                isLevelUp
                  ? "text-sm text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  : "text-[11px] text-zinc-400 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]"
              )}
            >
              {isLevelUp ? "[ SYSTEM : LEVEL UP ]" : "[ SYSTEM ALARM ]"}
            </span>
          </div>

          {/* Content Body Module */}
          <div className={cn("space-y-4", isLevelUp ? "py-2" : "py-0")}>
            <p
              className={cn(
                "font-mono leading-relaxed font-medium",
                isLevelUp
                  ? "text-lg tracking-wider text-white drop-shadow-md"
                  : "text-sm text-zinc-300"
              )}
            >
              {isLevelUp
                ? `CONGRATULATIONS. ${message.toUpperCase()}`
                : message}
            </p>

            {/* Incremental Stat Updates */}
            {stat && (
              <div
                className={cn(
                  "flex items-center justify-between border bg-zinc-900/80 px-4 py-2 font-mono font-bold tracking-widest text-white backdrop-blur-sm",
                  isLevelUp
                    ? "mx-auto max-w-xs border-white/30 text-sm shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]"
                    : "border-zinc-700/50 text-xs shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]"
                )}
              >
                <span
                  className={cn(
                    "text-[10px] tracking-[0.2em] uppercase",
                    isLevelUp ? "text-zinc-400" : "text-zinc-500"
                  )}
                >
                  {stat.label}
                </span>
                <span
                  className={cn(
                    isLevelUp
                      ? "text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]"
                      : "text-zinc-300"
                  )}
                >
                  [ +{stat.value} ]
                </span>
              </div>
            )}

            {/* Main Level Crest */}
            {levelUp && (
              <div className="relative mt-8 py-6 text-center">
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  {/* Subtle background glow effect behind the level */}
                  <div className="h-20 w-20 rounded-full bg-white blur-2xl" />
                </div>
                <div className="relative border-y border-white/30 bg-zinc-900/40 py-4 shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]">
                  <span className="block font-mono text-5xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]">
                    LV. {levelUp}
                  </span>
                  <span className="mt-2 block font-mono text-[10px] font-bold tracking-[0.4em] text-zinc-400 uppercase">
                    Limits Broken // Potential Expanded
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
