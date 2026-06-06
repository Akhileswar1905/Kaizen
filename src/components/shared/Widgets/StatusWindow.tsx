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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
        <div className="animate-pulse font-mono text-xs tracking-[0.3em] text-white uppercase">
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
    <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/75 p-4 backdrop-blur-sm duration-200 fade-in">
      <Card className="relative w-full max-w-md overflow-hidden rounded-none border border-zinc-800 bg-zinc-950/95 text-zinc-100 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        {/* Solo Leveling Corner UI Framing Brackets */}
        <div className="pointer-events-none absolute top-3 left-3 h-3 w-3 border-t border-l border-zinc-700" />
        <div className="pointer-events-none absolute top-3 right-3 h-3 w-3 border-t border-r border-zinc-700" />
        <div className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-zinc-700" />
        <div className="pointer-events-none absolute right-3 bottom-3 h-3 w-3 border-r border-b border-zinc-700" />

        {/* Core System Bar Indicator */}
        <div className="absolute top-0 left-0 h-[2px] w-full bg-white opacity-80" />

        <CardContent className="space-y-6 p-6 sm:p-8">
          {/* System Kill Switch (Close) */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-zinc-500 transition-colors hover:text-white focus:outline-none"
            aria-label="Close Status Window"
          >
            <X className="h-4 w-4 stroke-[2.5]" />
          </button>

          {/* Profile Identity HUD Header */}
          <div className="border-b border-zinc-900 pb-5">
            <div className="mb-1.5 flex items-center gap-2">
              <Trophy className="h-3.5 w-3.5 text-zinc-400" />
              <span className="font-mono text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase">
                [ PLAYER STATUS STATUS ]
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <h2 className="font-mono text-3xl font-black tracking-tighter text-white">
                LV. {stats.level}
              </h2>
              <div className="border border-white/20 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] font-black tracking-widest text-white uppercase">
                {stats.rank}-RANK
              </div>
            </div>

            {/* Daily Sequence Engine Status */}
            <div className="mt-3 flex items-center gap-4 font-mono text-xs">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Flame className="h-3.5 w-3.5 animate-pulse text-white" />
                <span>
                  Streak:{" "}
                  <span className="font-bold text-white">
                    {stats.current_streak}D
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Activity className="h-3.5 w-3.5 text-zinc-500" />
                <span>
                  Condition:{" "}
                  <span className="font-bold text-white">OPTIMAL</span>
                </span>
              </div>
            </div>
          </div>

          {/* Combat Experience Progress Module */}
          <div className="space-y-2">
            <div className="flex justify-between font-mono text-[10px] tracking-wider text-zinc-400 uppercase">
              <span className="font-bold">Progression Metric (XP)</span>
              <span className="font-semibold text-zinc-300">
                {stats.xp} / {xpMax}
              </span>
            </div>
            <div className="relative h-1.5 w-full border border-zinc-800 bg-zinc-900 p-[1px]">
              <Progress
                value={xpPercentage}
                className="h-full rounded-none bg-transparent transition-all duration-500 [&>div]:bg-white"
              />
            </div>
          </div>

          {/* Dynamic Core Attributes Matrix */}
          <div className="space-y-2.5">
            <span className="mb-1 block font-mono text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">
              Ability Attributes
            </span>

            <div className="grid gap-2">
              {statsConfig.map(({ label, fullLabel, value, icon: Icon }) => (
                <div
                  key={label}
                  className="group flex items-center justify-between border border-zinc-900 bg-zinc-900/30 p-2.5 transition-all hover:border-zinc-800 hover:bg-zinc-900/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="border border-zinc-800 bg-zinc-950 p-1.5 text-zinc-400 transition-colors group-hover:border-zinc-600 group-hover:text-white">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-xs font-black tracking-wider text-white">
                        {label}
                      </span>
                      <span className="font-mono text-[9px] tracking-tight text-zinc-500 uppercase">
                        {fullLabel}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 font-mono text-base font-black text-white">
                    [ {value} ]
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Core System Directive Block Footer */}
          <div className="border-t border-zinc-900 pt-4 text-center">
            <p className="font-mono text-[9px] font-medium tracking-[0.25em] text-zinc-500 uppercase">
              Warning: Stagnation triggers baseline fatigue. Evolve daily.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
