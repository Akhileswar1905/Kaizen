import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Settings, X } from "lucide-react"

interface PomodoroSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  workDuration: number
  breakDuration: number
  onSave: (workDuration: number, breakDuration: number) => Promise<void>
}

export function PomodoroSettingsModal({
  isOpen,
  onClose,
  workDuration,
  breakDuration,
  onSave,
}: PomodoroSettingsModalProps) {
  const [workMinutes, setWorkMinutes] = useState(Math.floor(workDuration / 60))
  const [breakMinutes, setBreakMinutes] = useState(
    Math.floor(breakDuration / 60)
  )
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    // Validate input
    if (
      workMinutes < 1 ||
      breakMinutes < 1 ||
      workMinutes > 120 ||
      breakMinutes > 120
    ) {
      alert("Please enter times between 1 and 120 minutes")
      return
    }

    setIsSaving(true)
    await onSave(workMinutes * 60, breakMinutes * 60)
    setIsSaving(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-sm border-border/50 bg-card/95 shadow-xl backdrop-blur-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <Settings className="h-5 w-5 text-primary" />
              Pomodoro Settings
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-muted"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Work Duration */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground/90">
              Focus Duration (minutes)
            </Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min="1"
                max="120"
                value={workMinutes}
                onChange={(e) =>
                  setWorkMinutes(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="h-10 rounded-lg border-border/50 bg-background/40 text-center text-lg font-bold focus-visible:ring-primary/20"
              />
              <span className="text-sm text-muted-foreground">minutes</span>
            </div>
            <p className="text-xs text-muted-foreground/70">
              Time for focused work sessions
            </p>
          </div>

          {/* Break Duration */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground/90">
              Break Duration (minutes)
            </Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min="1"
                max="120"
                value={breakMinutes}
                onChange={(e) =>
                  setBreakMinutes(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="h-10 rounded-lg border-border/50 bg-background/40 text-center text-lg font-bold focus-visible:ring-primary/20"
              />
              <span className="text-sm text-muted-foreground">minutes</span>
            </div>
            <p className="text-xs text-muted-foreground/70">
              Time for breaks between sessions
            </p>
          </div>

          {/* Summary */}
          <div className="rounded-lg border border-border/30 bg-muted/20 p-3">
            <p className="text-xs font-semibold text-muted-foreground">
              Session Preview:
            </p>
            <p className="mt-1 text-sm text-foreground">
              {workMinutes}m focus → {breakMinutes}m break
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 border-t border-border/20 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
