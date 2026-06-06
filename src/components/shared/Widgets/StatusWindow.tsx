import {
  X,
  Zap,
  Brain,
  Shield,
  Heart,
  Coins,
  Trophy,
  Flame,
  Activity,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { type PlayerStats, getXpForNextLevel } from "@/lib/gamification"

interface StatusWindowProps {
  stats: PlayerStats | null
  isOpen: boolean
  onClose: () => void
}

export function StatusWindow({ stats, isOpen, onClose }: StatusWindowProps) {
  if (!isOpen) return null

  if (!stats) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
        <div className="animate-pulse font-mono text-xs tracking-[0.3em] text-white uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
          [ ACCESSING SYSTEM CODES... ]
        </div>
      </div>
    )
  }

  const statsConfig = [
    {
      label: "STR",
      fullLabel: "Strength",
      value: stats.strength,
      icon: Shield,
    },
    {
      label: "INT",
      fullLabel: "Intelligence",
      value: stats.intelligence,
      icon: Brain,
    },
    { label: "VIT", fullLabel: "Vitality", value: stats.vitality, icon: Heart },
    { label: "WIL", fullLabel: "Willpower", value: stats.willpower, icon: Zap },
    { label: "LCK", fullLabel: "Luck", value: stats.luck, icon: Coins },
  ]

  const xpMax = getXpForNextLevel(stats.level)
  const xpPercentage = (stats.xp / xpMax) * 100

  return (
    <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/80 p-4 backdrop-blur-md duration-300 fade-in">
      <Card className="relative w-full max-w-md overflow-hidden rounded-none border border-zinc-800 bg-zinc-950/90 text-zinc-100 shadow-[0_0_40px_-10px_rgba(255,255,255,0.1),inset_0_0_20px_rgba(255,255,255,0.02)] backdrop-blur-xl">
        {/* Solo Leveling Corner UI Framing Brackets (Monochrome Glow) */}
        <div className="pointer-events-none absolute top-0 left-0 h-5 w-5 border-t-[3px] border-l-[3px] border-white/70 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
        <div className="pointer-events-none absolute top-0 right-0 h-5 w-5 border-t-[3px] border-r-[3px] border-white/70 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-5 w-5 border-b-[3px] border-l-[3px] border-white/70 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-5 w-5 border-r-[3px] border-b-[3px] border-white/70 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />

        {/* Core System Bar Indicator (Scanning Line) */}
        <div className="absolute top-0 left-0 h-[1px] w-full animate-pulse bg-white opacity-80 drop-shadow-[0_0_5px_rgba(255,255,255,1)]" />

        <CardContent className="space-y-6 p-6 sm:p-8">
          {/* System Kill Switch (Close) */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-zinc-500 transition-all hover:text-white hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] focus:outline-none"
            aria-label="Close Status Window"
          >
            <X className="h-5 w-5 stroke-[2.5]" />
          </button>

          {/* Profile Identity HUD Header */}
          <div className="border-b border-zinc-800 pb-5">
            <div className="mb-2 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-zinc-400" />
              <span className="font-mono text-[11px] font-black tracking-[0.3em] text-zinc-400 uppercase drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">
                [ PLAYER STATUS ]
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <h2 className="font-mono text-4xl font-black tracking-tighter text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                LV. {stats.level}
              </h2>
              <div className="border border-white/40 bg-white/10 px-3 py-1 font-mono text-[11px] font-black tracking-widest text-white uppercase drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                {stats.rank}-RANK
              </div>
            </div>

            {/* Daily Sequence Engine Status */}
            <div className="mt-4 flex items-center gap-5 font-mono text-xs">
              <div className="flex items-center gap-2 text-zinc-400">
                <Flame className="h-4 w-4 animate-pulse text-white" />
                <span>
                  Streak:{" "}
                  <span className="font-bold text-white drop-shadow-[0_0_3px_rgba(255,255,255,0.8)]">
                    {stats.current_streak}D
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <Activity className="h-4 w-4 text-zinc-300" />
                <span>
                  Condition:{" "}
                  <span className="font-bold text-white drop-shadow-[0_0_3px_rgba(255,255,255,0.8)]">
                    OPTIMAL
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Combat Experience Progress Module */}
          <div className="space-y-2">
            <div className="flex justify-between font-mono text-[10px] tracking-wider text-zinc-400 uppercase">
              <span className="font-bold">Progression Metric (XP)</span>
              <span className="font-semibold text-zinc-200">
                {stats.xp} / {xpMax}
              </span>
            </div>
            <div className="relative h-2 w-full border border-zinc-800 bg-black p-[1px] shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]">
              <Progress
                value={xpPercentage}
                className="h-full rounded-none bg-transparent transition-all duration-500 [&>div]:bg-white [&>div]:shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              />
            </div>
          </div>

          {/* Dynamic Core Attributes Matrix */}
          <div className="space-y-3">
            <span className="mb-2 block font-mono text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">
              Ability Attributes
            </span>

            <div className="grid gap-2">
              {statsConfig.map(({ label, fullLabel, value, icon: Icon }) => (
                <div
                  key={label}
                  className="group flex items-center justify-between border border-zinc-800/50 bg-zinc-900/30 p-3 transition-all duration-300 hover:border-zinc-400/50 hover:bg-zinc-800/50 hover:shadow-[inset_0_0_15px_rgba(255,255,255,0.1)]"
                >
                  <div className="flex items-center gap-4">
                    <div className="border border-zinc-800 bg-black p-2 text-zinc-400 transition-all duration-300 group-hover:border-zinc-400 group-hover:text-white group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-sm font-black tracking-wider text-zinc-200">
                        {label}
                      </span>
                      <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase">
                        {fullLabel}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 font-mono text-lg font-black text-zinc-300 transition-all duration-300 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
                    [ {value} ]
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Core System Directive Block Footer */}
          <div className="border-t border-zinc-800 pt-5 text-center">
            <p className="font-mono text-[9px] font-bold tracking-[0.25em] text-zinc-500 uppercase">
              Warning: Stagnation triggers baseline fatigue. Evolve daily.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
