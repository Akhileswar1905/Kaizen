import {
  X,
  Zap,
  Brain,
  Shield,
  Heart,
  Coins,
  Trophy,
  Flame,
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
        <div className="animate-pulse font-mono text-primary">
          Loading System Data...
        </div>
      </div>
    )
  }

  const statsConfig = [
    { label: "STR", value: stats.strength, icon: Shield },
    { label: "INT", value: stats.intelligence, icon: Brain },
    { label: "VIT", value: stats.vitality, icon: Heart },
    { label: "WIL", value: stats.willpower, icon: Zap },
    { label: "LCK", value: stats.luck, icon: Coins },
  ]

  return (
    <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-background/80 p-4 backdrop-blur-md duration-300 fade-in">
      <Card className="relative w-full max-w-md overflow-hidden border-border bg-card text-foreground shadow-xl">
        {/* Header / Decorative Border */}
        <div className="absolute top-0 left-0 h-1 w-full bg-primary" />

        <CardContent className="p-6">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Player Profile Section */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center justify-center rounded-full bg-secondary p-3 text-secondary-foreground">
              <Trophy className="h-8 w-8" />
            </div>
            <h2 className="mb-1 text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
              Player Status
            </h2>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl font-black tracking-tighter text-foreground">
                LEVEL {stats.level}
              </span>
              <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground uppercase">
                Rank {stats.rank}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-center gap-1.5 text-muted-foreground">
              <Flame className="h-3.5 w-3.5 text-orange-500" />
              <span className="font-mono text-[10px] font-bold tracking-widest uppercase">
                Streak: {stats.current_streak} days
              </span>
            </div>
          </div>

          {/* XP Bar */}
          <div className="mb-8 space-y-2">
            <div className="flex justify-between font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
              <span>Experience (XP)</span>
              <span>
                {stats.xp} / {getXpForNextLevel(stats.level)}
              </span>
            </div>
            <Progress
              value={(stats.xp / getXpForNextLevel(stats.level)) * 100}
              className="h-1.5 bg-secondary"
            />
          </div>

          {/* Stats Grid */}
          <div className="grid gap-3">
            {statsConfig.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="group flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3 transition-all hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded border border-border bg-background p-2 transition-colors group-hover:border-primary/50">
                    <Icon className="h-4 w-4 text-foreground" />
                  </div>
                  <span className="font-mono text-sm font-bold tracking-wider text-foreground">
                    {label}
                  </span>
                </div>
                <span className="font-mono text-lg font-black text-foreground">
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 border-t border-border pt-4 text-center">
            <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              System: Maintain consistency to evolve.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
