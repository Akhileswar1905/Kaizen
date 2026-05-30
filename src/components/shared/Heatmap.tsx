import { format, subWeeks, startOfWeek, eachDayOfInterval } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"
import { useMemo } from "react"

interface HeatmapProps {
  logs: Record<string, boolean>
  // 1. INCREASED DEFAULT WEEKS: Changed from 13 to 26 (half a year) to fill the card
  weeksToShow?: number
}

export function Heatmap({ logs, weeksToShow = 26 }: HeatmapProps) {
  const heatmapData = useMemo(() => {
    const dailyCounts: Record<string, number> = {}

    Object.entries(logs).forEach(([key, isCompleted]) => {
      if (isCompleted) {
        const actualDateString = key.slice(key.length - 10)
        dailyCounts[actualDateString] = (dailyCounts[actualDateString] || 0) + 1
      }
    })

    const today = new Date()
    const startDate = startOfWeek(subWeeks(today, weeksToShow - 1), {
      weekStartsOn: 0,
    })
    const days = eachDayOfInterval({ start: startDate, end: today })

    return days.map((date) => {
      const dateString = format(date, "yyyy-MM-dd")
      return {
        date: dateString,
        count: dailyCounts[dateString] || 0,
      }
    })
  }, [logs, weeksToShow])

  const getSquareStyles = (count: number) => {
    // 2. INCREASED SQUARE SIZE: h-4 w-4 on mobile, md:h-5 md:w-5 on desktop
    const base =
      "h-4 w-4 md:h-5 md:w-5 rounded-sm transition-all duration-200 hover:ring-2 hover:ring-ring hover:ring-offset-1 hover:ring-offset-background cursor-pointer"

    if (count === 0) return `${base} bg-secondary/60 border border-border/50`
    if (count === 1) return `${base} bg-emerald-900/60`
    if (count === 2) return `${base} bg-emerald-700/80`
    if (count === 3) return `${base} bg-emerald-500`
    return `${base} bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]`
  }

  return (
    <Card className="border-border/50 bg-card shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Activity className="h-4 w-4 text-emerald-500" />
          Consistency Map
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* 3. SCROLL CONTAINER: Keeps it from breaking on small phones */}
        <div className="w-full touch-pan-x overflow-x-auto overflow-y-hidden overscroll-contain pb-4 [-webkit-overflow-scrolling:touch]">
          {" "}
          {/* Changed gap-3 to gap-4 for a bit more breathing room */}
          <div className="flex min-w-max gap-4">
            <div className="flex flex-col justify-between py-1 text-[10px] font-medium text-muted-foreground md:text-xs">
              <span className="invisible">Sun</span>
              <span>Mon</span>
              <span className="invisible">Tue</span>
              <span>Wed</span>
              <span className="invisible">Thu</span>
              <span>Fri</span>
              <span className="invisible">Sat</span>
            </div>

            {/* 4. INCREASED GAP: gap-1.5 to separate the larger squares nicely */}
            <div className="grid grid-flow-col grid-rows-7 gap-1.5">
              {heatmapData.map((day) => (
                <div
                  key={day.date}
                  title={`${day.date}: ${day.count} habits completed`}
                  className={getSquareStyles(day.count)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-end gap-2 text-[10px] font-medium text-muted-foreground md:text-xs">
          <span>Less</span>
          {/* 5. MATCHED LEGEND SIZE: Made the legend squares slightly bigger to match */}
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-sm border border-border/50 bg-secondary/60 md:h-4 md:w-4" />
            <div className="h-3 w-3 rounded-sm bg-emerald-900/60 md:h-4 md:w-4" />
            <div className="h-3 w-3 rounded-sm bg-emerald-700/80 md:h-4 md:w-4" />
            <div className="h-3 w-3 rounded-sm bg-emerald-500 md:h-4 md:w-4" />
            <div className="h-3 w-3 rounded-sm bg-emerald-400 md:h-4 md:w-4" />
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  )
}
