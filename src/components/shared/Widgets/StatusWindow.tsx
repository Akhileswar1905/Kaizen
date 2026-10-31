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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm">
        <div className="rounded-2xl border border-border bg-card px-6 py-5 text-sm font-semibold text-muted-foreground shadow-xl">
          Loading player status…
        </div>
      </div>
    )
  }

  const statsConfig = [
    { label: "STR", fullLabel: "Strength", value: stats.strength, icon: Shield },
    { label: "INT", fullLabel: "Intelligence", value: stats.intelligence, icon: Brain },
    { label: "VIT", fullLabel: "Vitality", value: stats.vitality, icon: Heart },
    { label: "WIL", fullLabel: "Willpower", value: stats.willpower, icon: Zap },
    { label: "LCK", fullLabel: "Luck", value: stats.luck, icon: Coins },
  ]

  const xpMax = getXpForNextLevel(stats.level)
  const xpPercentage = xpMax > 0 ? Math.min(100, (stats.xp / xpMax) * 100) : 0

  return (
    <div
      className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-background/70 p-4 backdrop-blur-sm duration-200 fade-in"
      onClick={onClose}
    >
      <Card
        role="dialog"
        aria-modal="true"
        aria-labelledby="player-status-title"
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="h-1 w-full bg-primary/15">
          <div className="h-full bg-primary/70" style={{ width: xpPercentage + "%" }} />
        </div>
        <CardContent className="space-y-6 p-5 sm:p-7">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close player status"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="border-b border-border/70 pb-5">
            <div className="mb-3 flex items-center gap-2 text-primary">
              <Trophy className="h-4 w-4" />
              <span className="text-[11px] font-bold tracking-[0.18em]">PLAYER STATUS</span>
            </div>
            <div className="flex items-end justify-between gap-3 pr-8">
              <h2 id="player-status-title" className="text-4xl font-extrabold tracking-tight">
                LV. {stats.level}
              </h2>
              <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold tracking-wide text-primary">
                {stats.rank}-RANK
              </span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-primary" />
                <span>Streak: <strong className="text-foreground">{stats.current_streak}D</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span>Condition: <strong className="text-foreground">OPTIMAL</strong></span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[11px] font-bold tracking-wide text-muted-foreground">
              <span>EXPERIENCE</span>
              <span className="tabular-nums text-foreground">{stats.xp} / {xpMax} XP</span>
            </div>
            <Progress value={xpPercentage} className="h-2 bg-muted [&>div]:bg-primary" />
          </div>

          <div className="space-y-3">
            <span className="block text-[11px] font-bold tracking-[0.16em] text-muted-foreground">
              ABILITY ATTRIBUTES
            </span>
            <div className="grid gap-2">
              {statsConfig.map(({ label, fullLabel, value, icon: Icon }) => (
                <div
                  key={label}
                  className="group flex items-center justify-between rounded-xl border border-border/70 bg-muted/30 p-3 transition-colors hover:border-primary/30 hover:bg-muted/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg border border-border bg-background p-2 text-muted-foreground transition-colors group-hover:text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">{label}</span>
                      <span className="text-[10px] font-medium text-muted-foreground">{fullLabel}</span>
                    </div>
                  </div>
                  <span className="px-2 text-lg font-extrabold tabular-nums text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border/70 pt-4 text-center">
            <p className="text-[11px] font-medium text-muted-foreground">
              Small steps. Steady progress. Keep evolving.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
