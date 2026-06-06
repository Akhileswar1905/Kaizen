import { useState, useEffect, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dumbbell,
  Trophy,
  Plus,
  Timer,
  Target,
  Loader2,
  ChevronLeft,
  Shield,
  BookOpen,
  Tv,
  CheckCircle2,
} from "lucide-react"
import { format } from "date-fns"

const XP_MULTIPLIERS: Record<string, number> = {
  "Push-ups": 1.0,
  Squats: 1.0,
  Lunges: 1.0,
  Plank: 0.5,
  "Wall Sits": 0.8,
  "Inverted Rows": 1.1,
  "Diamond Push-ups": 1.2,
  Dips: 1.2,
  "Chin-ups": 1.4,
  "Pull-ups": 1.5,
  "Pike Push-ups": 1.5,
  "Bulgarian Split Squats": 1.3,
  "Hollow Body Hold": 0.8,
  "Archer Push-ups": 1.6,
  "Explosive Pull-ups": 1.8,
  "Pistol Squats": 1.8,
  "Shrimp Squats": 1.8,
  "Straight Bar Dips": 1.7,
  "L-Sit": 1.5,
  "Muscle-ups": 2.5,
  "Handstand Push-ups": 2.5,
  "Front Lever Raises": 2.3,
  "Typewriter Pull-ups": 2.0,
  "Dragon Flags": 2.2,
  "One-Arm Push-ups": 3.0,
  "One-Arm Pull-ups": 4.0,
  "Front Lever Hold": 2.5,
  "Human Flag": 3.5,
  Planche: 4.0,
}

const RANK_GROUPS = {
  "E-Rank (Fundamentals)": [
    "Push-ups",
    "Squats",
    "Lunges",
    "Plank",
    "Wall Sits",
    "Inverted Rows",
  ],
  "D-Rank (Intermediate)": [
    "Diamond Push-ups",
    "Dips",
    "Chin-ups",
    "Pull-ups",
    "Pike Push-ups",
    "Bulgarian Split Squats",
    "Hollow Body Hold",
  ],
  "C-Rank (Advanced)": [
    "Archer Push-ups",
    "Explosive Pull-ups",
    "Pistol Squats",
    "Shrimp Squats",
    "Straight Bar Dips",
    "L-Sit",
  ],
  "B-Rank (Elite)": [
    "Muscle-ups",
    "Handstand Push-ups",
    "Front Lever Raises",
    "Typewriter Pull-ups",
    "Dragon Flags",
  ],
  "A-Rank (Mastery)": [
    "One-Arm Push-ups",
    "One-Arm Pull-ups",
    "Front Lever Hold",
    "Human Flag",
    "Planche",
  ],
}

const TIMED_EXERCISES = [
  "Plank",
  "Wall Sits",
  "Hollow Body Hold",
  "L-Sit",
  "Front Lever Hold",
  "Human Flag",
  "Planche",
]

// Guide data matrix containing execution rules and media placeholder configurations
interface GuideItem {
  description: string
  muscles: string[]
  cues: string[]
  videoUrl?: string // Drop YouTube embed or MP4/GIF assets here
}

const EXERCISE_GUIDES: Record<string, GuideItem> = {
  // --- E-RANK ---
  "Push-ups": {
    description: "The foundation of all horizontal pressing power.",
    muscles: ["Chest", "Triceps", "Anterior Deltoids", "Core"],
    cues: [
      "Rigid straight line from head to heels.",
      "Brace core and glutes.",
      "Elbows at 45-degree angle.",
    ],
    videoUrl: "https://www.youtube.com/embed/IODxDxX7oi4",
  },
  Squats: {
    description: "Foundation of lower body kinetic chain output.",
    muscles: ["Quadriceps", "Glutes", "Adductors", "Core"],
    cues: [
      "Drive knees outward.",
      "Maintain neutral spine.",
      "Explode through heels.",
    ],
    videoUrl: "https://www.youtube.com/embed/UXbPVIGU0Jc",
  },
  Lunges: {
    description: "Unilateral stability and leg strength building.",
    muscles: ["Quadriceps", "Glutes", "Hamstrings"],
    cues: [
      "Keep torso vertical.",
      "Front knee tracking over toes.",
      "Controlled descent.",
    ],
    videoUrl: "https://www.youtube.com/embed/Z2n58m2i4jg",
  },
  Plank: {
    description: "Isometric pillar check for core stability.",
    muscles: ["Rectus Abdominis", "Obliques", "Transverse Abdominis"],
    cues: ["Protract shoulders.", "Posterior pelvic tilt.", "Squeeze quads."],
    videoUrl: "https://www.youtube.com/embed/pSHjTRCQxIw",
  },
  "Wall Sits": {
    description: "Endurance static hold for knee and quad integrity.",
    muscles: ["Quadriceps", "Glutes"],
    cues: [
      "Keep thighs parallel to floor.",
      "Back flat against wall.",
      "Breathe steadily.",
    ],
    videoUrl: "https://www.youtube.com/embed/F-k5P140d3E",
  },
  "Inverted Rows": {
    description: "Horizontal pulling foundation for upper back thickness.",
    muscles: ["Rhomboids", "Lats", "Biceps"],
    cues: [
      "Keep chest proud.",
      "Pull elbows toward ribs.",
      "Full scapular retraction.",
    ],
    videoUrl: "https://www.youtube.com/embed/e21gW0aYt7U",
  },

  // --- D-RANK ---
  "Diamond Push-ups": {
    description: "Triceps-dominant pressing variation.",
    muscles: ["Triceps", "Inner Chest", "Deltoids"],
    cues: [
      "Hands in diamond shape.",
      "Keep elbows close to body.",
      "Full range of motion.",
    ],
    videoUrl: "https://www.youtube.com/embed/J0DnG1_S92I",
  },
  Dips: {
    description: "Superior isolation for triceps and lower pectorals.",
    muscles: ["Triceps", "Chest", "Anterior Deltoids"],
    cues: [
      "Keep shoulders depressed.",
      "Forward lean for chest.",
      "Lock out elbows.",
    ],
    videoUrl: "https://www.youtube.com/embed/wjUmnrzES4I",
  },
  "Chin-ups": {
    description: "Vertical pull with increased biceps engagement.",
    muscles: ["Biceps", "Lats", "Brachialis"],
    cues: ["Supinated grip.", "Full extension at bottom.", "Chest to bar."],
    videoUrl: "https://www.youtube.com/embed/brxkoP_sZ1g",
  },
  "Pull-ups": {
    description: "Primary vertical pulling test of absolute strength.",
    muscles: ["Lats", "Biceps", "Rhomboids", "Core"],
    cues: [
      "Scapular depression.",
      "Drive elbows to hips.",
      "Clean chin clearance.",
    ],
    videoUrl: "https://www.youtube.com/embed/eGo4IYlbE5g",
  },
  "Pike Push-ups": {
    description: "Foundational shoulder and overhead pressing power.",
    muscles: ["Deltoids", "Upper Chest", "Triceps"],
    cues: [
      "Hips high (inverted V).",
      "Head moves forward of hands.",
      "Control descent.",
    ],
    videoUrl: "https://www.youtube.com/embed/mk5r9t1j1_4",
  },
  "Bulgarian Split Squats": {
    description: "Extreme unilateral leg development and balance.",
    muscles: ["Quadriceps", "Glutes"],
    cues: ["Elevated rear foot.", "Chest upright.", "Deep hip flexion."],
    videoUrl: "https://www.youtube.com/embed/v2Y4s1Y4v6A",
  },
  "Hollow Body Hold": {
    description: "Core compression strength essential for advanced levers.",
    muscles: ["Abs", "Obliques", "Hip Flexors"],
    cues: [
      "Lower back pressed to floor.",
      "Shoulders and legs elevated.",
      "Total body tension.",
    ],
    videoUrl: "https://www.youtube.com/embed/vF_W9a-m9Xo",
  },

  // --- C-RANK ---
  "Archer Push-ups": {
    description: "Unilateral weight shifting for chest and shoulder strength.",
    muscles: ["Chest", "Deltoids", "Core"],
    cues: [
      "Full extension of non-working arm.",
      "Deep range of motion.",
      "Keep core stabilized.",
    ],
    videoUrl: "https://www.youtube.com/embed/wJKLatFY-aU",
  },
  "Explosive Pull-ups": {
    description: "Power output training for pulling movements.",
    muscles: ["Lats", "Upper Back", "Biceps"],
    cues: ["Aggressive pull.", "High velocity.", "Full control."],
    videoUrl: "https://www.youtube.com/embed/i0WJ5vC9L00",
  },
  "Pistol Squats": {
    description: "Mastery of unilateral balance and absolute knee stability.",
    muscles: ["Quadriceps", "Glutes", "Hamstrings"],
    cues: [
      "Keep non-working leg clear.",
      "Drive through mid-foot.",
      "Upright torso.",
    ],
    videoUrl: "https://www.youtube.com/embed/2eH3t9rK_fQ",
  },
  "Shrimp Squats": {
    description: "Dynamic unilateral balance for leg development.",
    muscles: ["Glutes", "Quadriceps"],
    cues: ["Hold rear foot.", "Touch knee to floor.", "Maintain balance."],
    videoUrl: "https://www.youtube.com/embed/L13-e40YmG8",
  },
  "Straight Bar Dips": {
    description: "Functional upper body pushing strength on a straight bar.",
    muscles: ["Triceps", "Chest", "Shoulders"],
    cues: ["Keep bar centered.", "Full lockout.", "Stabilize core."],
    videoUrl: "https://www.youtube.com/embed/gB-eH49Nn1U",
  },
  "L-Sit": {
    description: "Core compression and hip flexor strength endurance.",
    muscles: ["Abs", "Hip Flexors", "Triceps"],
    cues: [
      "Legs parallel to ground.",
      "Shoulders depressed.",
      "Hard protraction.",
    ],
    videoUrl: "https://www.youtube.com/embed/w253Fw6041A",
  },

  // --- B-RANK ---
  "Muscle-ups": {
    description:
      "Elite dynamic execution converting pulling velocity into pushing leverage.",
    muscles: ["Lats", "Chest", "Triceps", "Core"],
    cues: [
      "Hollow body swing.",
      "Explosive sternum pull.",
      "Aggressive transition.",
    ],
    videoUrl: "https://www.youtube.com/embed/g2J_S-3-qS4",
  },
  "Handstand Push-ups": {
    description: "Gravity-defying vertical pressing mastery.",
    muscles: ["Deltoids", "Triceps", "Traps"],
    cues: [
      "Wall support or free standing.",
      "Brace core for stability.",
      "Controlled descent.",
    ],
    videoUrl: "https://www.youtube.com/embed/KEfazWGOUok",
  },
  "Front Lever Raises": {
    description: "Dynamic progression for elite isometric back strength.",
    muscles: ["Lats", "Core", "Shoulders"],
    cues: [
      "Straight arm engagement.",
      "Full range of motion.",
      "Controlled tempo.",
    ],
    videoUrl: "https://www.youtube.com/embed/W9l6-i0n0XQ",
  },
  "Typewriter Pull-ups": {
    description: "Unilateral weight shifting under high-load tension.",
    muscles: ["Lats", "Biceps"],
    cues: ["Hold top position.", "Shift side to side.", "Maintain tension."],
    videoUrl: "https://www.youtube.com/embed/kR2U2b9f3Xg",
  },
  "Dragon Flags": {
    description: "Total core annihilation and spinal stability mastery.",
    muscles: ["Abs", "Lats", "Glutes"],
    cues: [
      "Lock hands behind head.",
      "Keep body as one plank.",
      "Slow eccentric.",
    ],
    videoUrl: "https://www.youtube.com/embed/6Lar9utB5ZU",
  },

  // --- A-RANK ---
  "One-Arm Push-ups": {
    description: "Ultimate horizontal pressing stability test.",
    muscles: ["Chest", "Shoulders", "Core"],
    cues: [
      "Wide stance for balance.",
      "Body square to floor.",
      "Controlled descent.",
    ],
    videoUrl: "https://www.youtube.com/embed/vH2s41u2Wq4",
  },
  "One-Arm Pull-ups": {
    description: "Absolute pinnacle of vertical pulling strength.",
    muscles: ["Lats", "Biceps", "Forearms"],
    cues: ["Active hang.", "Engage scapula.", "Vertical drive."],
    videoUrl: "https://www.youtube.com/embed/rR171h0xH-4",
  },
  "Front Lever Hold": {
    description: "The core strength test for absolute back dominance.",
    muscles: ["Lats", "Core", "Lower Back"],
    cues: ["Arms locked.", "Full body line.", "Shoulder depression."],
    videoUrl: "https://www.youtube.com/embed/69sxB5FBR6o",
  },
  "Human Flag": {
    description: "Mastery of gravity and core-shoulder lateral leverage.",
    muscles: ["Obliques", "Lats", "Shoulders"],
    cues: ["Push top hand/pull bottom.", "Core rigid.", "Body perpendicular."],
    videoUrl: "https://www.youtube.com/embed/DtraL3XSrtQ",
  },
  Planche: {
    description: "Absolute center-of-mass dominance and shoulder leverage.",
    muscles: ["Deltoids", "Chest", "Serratus"],
    cues: ["Locked elbows.", "Intense forward lean.", "Deep protraction."],
    videoUrl: "https://www.youtube.com/embed/3m4a3T2R8Xw",
  },
}

interface ExerciseLog {
  id: string
  name: string
  reps: number
  sets: number
  rest_seconds: number
  xp_earned: number
  created_at: string
}

interface WorkoutTrackerProps {
  onBack: () => void
}

export function WorkoutTracker({ onBack }: WorkoutTrackerProps) {
  const { user } = useAuth()
  const [view, setView] = useState<"tracker" | "codex">("tracker")
  const [selectedCodexExercise, setSelectedCodexExercise] =
    useState<string>("Push-ups")

  const [exercises, setExercises] = useState<ExerciseLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: "",
    reps: "",
    sets: "",
    rest: "90",
    duration: "",
  })

  const isCurrentExerciseTimed = useMemo(
    () => TIMED_EXERCISES.includes(form.name),
    [form.name]
  )

  const exerciseStats = useMemo(() => {
    const stats: Record<
      string,
      { pb: number; totalVolume: number; lastDate: string }
    > = {}
    exercises.forEach((ex) => {
      if (!stats[ex.name])
        stats[ex.name] = { pb: 0, totalVolume: 0, lastDate: "" }
      const volume = ex.sets * ex.reps
      stats[ex.name].pb = Math.max(stats[ex.name].pb, ex.reps)
      stats[ex.name].totalVolume += volume
      stats[ex.name].lastDate = ex.created_at
    })
    return stats
  }, [exercises])

  useEffect(() => {
    if (user) fetchExercises()
  }, [user])

  const fetchExercises = async () => {
    const { data, error } = await supabase
      .from("calisthenics_logs")
      .select("*")
      .order("created_at", { ascending: false })
    if (!error && data) setExercises(data)
    setIsLoading(false)
  }

  const handleAddExercise = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.sets || !user) return
    if (isCurrentExerciseTimed && !form.duration) return
    if (!isCurrentExerciseTimed && !form.reps) return

    setIsSubmitting(true)
    const multiplier = XP_MULTIPLIERS[form.name] || 1.0
    const targetVolume = isCurrentExerciseTimed
      ? Number(form.duration)
      : Number(form.reps)
    const calculatedXp = Math.round(
      targetVolume * Number(form.sets) * multiplier
    )

    const newLog = {
      user_id: user.id,
      name: form.name,
      sets: Number(form.sets),
      reps: targetVolume,
      rest_seconds: Number(form.rest),
      xp_earned: calculatedXp,
    }

    const { data, error } = await supabase
      .from("calisthenics_logs")
      .insert([newLog])
      .select()
      .single()
    if (!error && data) {
      setExercises([data, ...exercises])
      setForm({ name: "", reps: "", sets: "", rest: "90", duration: "" })
    }
    setIsSubmitting(false)
  }

  const totalXp = useMemo(
    () => exercises.reduce((sum, ex) => sum + ex.xp_earned, 0),
    [exercises]
  )
  const currentLevel = Math.floor(Math.sqrt(totalXp / 100)) + 1
  const xpForNextLevel = Math.pow(currentLevel, 2) * 100
  const xpForCurrentLevel = Math.pow(currentLevel - 1, 2) * 100
  const progressPct =
    totalXp === 0
      ? 0
      : ((totalXp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) *
        100

  const getExerciseRank = (name: string) => {
    if (RANK_GROUPS["A-Rank (Mastery)"].includes(name))
      return "text-destructive border-destructive/30 bg-destructive/5"
    if (RANK_GROUPS["B-Rank (Elite)"].includes(name))
      return "text-amber-500 border-amber-500/30 bg-amber-500/5"
    if (RANK_GROUPS["C-Rank (Advanced)"].includes(name))
      return "text-primary border-primary/30 bg-primary/5"
    return "text-muted-foreground border-border bg-muted/20"
  }

  const activeGuideData = useMemo(() => {
    return (
      EXERCISE_GUIDES[selectedCodexExercise] || {
        description:
          "Tactical telemetry missing from mainframe matrix database. Execute protocol clean form.",
        muscles: ["Full Body Compound Synchronization"],
        cues: [
          "Maintain balanced center-of-mass gravity alignment.",
          "Brace baseline muscle fibers cleanly.",
        ],
      }
    )
  }, [selectedCodexExercise])

  if (isLoading) {
    return (
      <div className="flex min-h-screen justify-center p-4 sm:p-6 md:p-8">
        <div className="h-96 w-full max-w-5xl animate-pulse rounded-2xl border border-border/40 bg-muted/20" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in flex min-h-screen justify-center bg-background p-4 font-sans text-foreground sm:p-6 md:p-8">
      <div className="w-full max-w-5xl space-y-8">
        {/* Header Control Unit */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={onBack}
              className="h-9 w-9 shrink-0 rounded-xl border-border/60 transition-all hover:bg-muted/50 active:scale-95"
            >
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </Button>
            <div>
              <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
                <Dumbbell className="h-5 w-5 text-foreground/80" />
                Physical Conditioning
              </h1>
              <p className="text-xs text-muted-foreground">
                Hypertrophy Protocol & Strength Matrix
              </p>
            </div>
          </div>

          {/* View Toggler Tabs */}
          <div className="flex h-10 items-center rounded-xl border border-border/30 bg-muted/40 p-1">
            <Button
              variant={view === "tracker" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("tracker")}
              className="h-8 rounded-lg px-4 text-xs font-semibold transition-all"
            >
              <Target className="mr-1.5 h-3.5 w-3.5" /> Tracker
            </Button>
            <Button
              variant={view === "codex" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("codex")}
              className="h-8 rounded-lg px-4 text-xs font-semibold transition-all"
            >
              <BookOpen className="mr-1.5 h-3.5 w-3.5" /> Codex Guide
            </Button>
          </div>
        </header>

        {view === "tracker" ? (
          <>
            {/* Level Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-xl space-y-1.5">
                  <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground">
                    <Trophy className="h-4 w-4 text-foreground/60" />
                    System Strength: Level {currentLevel}
                  </h2>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {exercises.length > 0
                      ? "Hypertrophy protocols optimal. Maintain consistency for progressive overload and muscle adaptations."
                      : "Awaiting initial combat data to formulate progression trajectories."}
                  </p>
                </div>
                <div className="w-full shrink-0 rounded-xl border border-border/40 bg-muted/10 p-4 sm:w-64">
                  <div className="mb-2 flex justify-between text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                    <span>STR Progression</span>
                    <span className="font-mono font-semibold text-foreground">
                      {totalXp} / {xpForNextLevel}
                    </span>
                  </div>
                  <Progress
                    value={progressPct}
                    className="h-1.5 bg-muted transition-all duration-1000"
                  />
                </div>
              </div>
            </div>

            {/* Exercise Mastery Index */}
            <div className="space-y-4 pt-4">
              <h3 className="px-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                Exercise Mastery Index
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(exerciseStats).map(([name, data]) => {
                  const timed = TIMED_EXERCISES.includes(name)
                  return (
                    <Card
                      key={name}
                      className="border border-border/50 bg-card/50"
                    >
                      <CardContent className="space-y-3 p-4">
                        <div className="flex items-start justify-between gap-2">
                          <span className="truncate text-sm font-bold">
                            {name}
                          </span>
                          <div
                            className={cn(
                              "rounded-full border px-2 py-0.5 text-[10px] font-bold whitespace-nowrap",
                              getExerciseRank(name)
                            )}
                          >
                            PB: {data.pb}
                            {timed ? "s" : " Reps"}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>
                              {timed ? "Total Duration" : "Total Volume"}
                            </span>
                            <span className="font-mono font-bold">
                              {data.totalVolume}
                              {timed ? "s" : " reps"}
                            </span>
                          </div>
                          <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full bg-primary transition-all duration-500"
                              style={{
                                width: `${Math.min((data.totalVolume / (timed ? 1200 : 500)) * 100, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Input Form Card */}
            <Card className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-bold tracking-wider text-foreground uppercase">
                    Log Execution
                  </span>
                </div>
                <form
                  onSubmit={handleAddExercise}
                  className="grid grid-cols-1 gap-4 sm:grid-cols-12"
                >
                  <div className="space-y-1.5 sm:col-span-5">
                    <label className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                      Exercise Matrix
                    </label>
                    <Select
                      value={form.name}
                      onValueChange={(value) =>
                        setForm({ ...form, name: value })
                      }
                      required
                    >
                      <SelectTrigger className="border-border/60 bg-muted/20 text-sm focus:ring-1 focus:ring-primary/25">
                        <SelectValue placeholder="Select active protocol..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-72">
                        {Object.entries(RANK_GROUPS).map(
                          ([groupLabel, items]) => (
                            <SelectGroup key={groupLabel}>
                              <SelectLabel className="mb-1 flex items-center gap-1 border-b border-border/30 pt-2 pb-1 text-[10px] font-bold tracking-wider text-muted-foreground/80 uppercase">
                                <Shield className="inline h-3 w-3 opacity-60" />{" "}
                                {groupLabel}
                              </SelectLabel>
                              {items.map((exerciseName) => (
                                <SelectItem
                                  key={exerciseName}
                                  value={exerciseName}
                                  className="text-xs"
                                >
                                  {exerciseName}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                      Sets
                    </label>
                    <Input
                      type="number"
                      value={form.sets}
                      onChange={(e) =>
                        setForm({ ...form, sets: e.target.value })
                      }
                      placeholder="0"
                      min="1"
                      className="border-border/60 bg-muted/20 text-center font-mono text-sm focus-visible:ring-primary/20"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                      {isCurrentExerciseTimed ? "Duration" : "Reps"}
                    </label>
                    {isCurrentExerciseTimed ? (
                      <Input
                        type="number"
                        value={form.duration}
                        onChange={(e) =>
                          setForm({ ...form, duration: e.target.value })
                        }
                        placeholder="Secs"
                        min="1"
                        className="border-border/60 bg-muted/20 text-center font-mono text-sm focus-visible:ring-primary/20"
                        required
                      />
                    ) : (
                      <Input
                        type="number"
                        value={form.reps}
                        onChange={(e) =>
                          setForm({ ...form, reps: e.target.value })
                        }
                        placeholder="0"
                        min="1"
                        className="border-border/60 bg-muted/20 text-center font-mono text-sm focus-visible:ring-primary/20"
                        required
                      />
                    )}
                  </div>

                  <div className="space-y-1.5 sm:col-span-3">
                    <label className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                      Rest (Sec)
                    </label>
                    <Input
                      type="number"
                      value={form.rest}
                      onChange={(e) =>
                        setForm({ ...form, rest: e.target.value })
                      }
                      placeholder="90"
                      min="0"
                      className="border-border/60 bg-muted/20 text-center font-mono text-sm focus-visible:ring-primary/20"
                      required
                    />
                  </div>

                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    className="mt-1 h-10 w-full font-semibold sm:col-span-12"
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    Commit to Matrix
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Combat History Logs */}
            <div className="space-y-4">
              <h3 className="px-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                Combat Log History
              </h3>
              {exercises.length === 0 ? (
                <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/30 text-center">
                  <p className="text-xs font-semibold tracking-tight text-muted-foreground/70">
                    No conditioning records found.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {exercises.map((ex) => {
                    const timed = TIMED_EXERCISES.includes(ex.name)
                    return (
                      <Card
                        key={ex.id}
                        className="group relative overflow-hidden border border-border/40 bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-border/80"
                      >
                        <CardContent className="flex h-full flex-col justify-between space-y-5 px-5 pt-5 pb-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-3xl font-black tracking-tighter text-foreground opacity-15 select-none">
                                +{ex.xp_earned}
                              </span>
                              <span className="rounded-md border border-border/40 bg-muted/30 px-2 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                                {ex.created_at
                                  ? format(
                                      new Date(ex.created_at),
                                      "MMM dd, HH:mm"
                                    )
                                  : "Syncing..."}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <h3 className="line-clamp-1 text-sm font-semibold tracking-tight text-foreground">
                                {ex.name}
                              </h3>
                              <p className="font-mono text-xs leading-relaxed text-muted-foreground/80">
                                {ex.sets} Sets × {ex.reps}
                                {timed ? "s Hold" : " Reps"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between border-t border-border/30 pt-3">
                            <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                              <Timer className="h-3.5 w-3.5" />
                              {ex.rest_seconds}s Rest
                            </div>
                            <span className="text-[10px] font-bold tracking-widest text-muted-foreground/50 uppercase">
                              XP
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Condition Codex Guide Layer UI */
          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-12">
            {/* Left Column: Navigation Directory */}
            <div className="max-h-[calc(100vh-14rem)] space-y-4 overflow-y-auto pr-2 md:col-span-4">
              {Object.entries(RANK_GROUPS).map(([groupLabel, items]) => (
                <div key={groupLabel} className="space-y-1.5">
                  <span className="block px-1 text-[10px] font-extrabold tracking-widest text-muted-foreground/70 uppercase">
                    {groupLabel}
                  </span>
                  <div className="space-y-1">
                    {items.map((item) => {
                      const isActive = selectedCodexExercise === item
                      return (
                        <button
                          key={item}
                          onClick={() => setSelectedCodexExercise(item)}
                          className={cn(
                            "flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-all",
                            isActive
                              ? "border-foreground bg-foreground font-bold text-background shadow-sm"
                              : "border-border/50 bg-card/50 text-foreground hover:bg-muted/40"
                          )}
                        >
                          <span>{item}</span>
                          <span className="font-mono text-[10px] opacity-60">
                            ×{XP_MULTIPLIERS[item]?.toFixed(1)}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Execution Information Display */}
            <div className="space-y-6 md:col-span-8">
              <Card className="overflow-hidden border-border/60 bg-card shadow-sm">
                {/* Interactive Dynamic Media Frame Container */}
                <div className="group relative flex aspect-video w-full items-center justify-center border-b border-border/40 bg-muted/30">
                  {activeGuideData.videoUrl ? (
                    <iframe
                      src={activeGuideData.videoUrl}
                      title={`${selectedCodexExercise} Form Guide`}
                      className="h-full w-full object-cover"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    /* Tactical System Fallback Interface when live video link is unpopulated */
                    <div className="space-y-3 p-6 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-border/50 bg-foreground/5 text-muted-foreground">
                        <Tv className="h-5 w-5 animate-pulse opacity-70" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold tracking-wider text-foreground uppercase">
                          Media Frame Holo-Link
                        </p>
                        <p className="mx-auto max-w-xs text-[11px] text-muted-foreground">
                          Drop an embed link or a loop GIF inside{" "}
                          <code className="rounded bg-muted px-1 py-0.5 font-mono text-foreground">
                            EXERCISE_GUIDES["{selectedCodexExercise}"].videoUrl
                          </code>{" "}
                          to initialize active telemetry projection.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <CardContent className="space-y-6 p-6">
                  {/* Title Header metadata block */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold tracking-tight text-foreground">
                        {selectedCodexExercise}
                      </h2>
                      <div
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[9px] font-black tracking-widest uppercase",
                          getExerciseRank(selectedCodexExercise)
                        )}
                      >
                        XP Modifier: {XP_MULTIPLIERS[selectedCodexExercise]}x
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {activeGuideData.description}
                    </p>
                  </div>

                  {/* Targeted Muscle Structural Groupings */}
                  <div className="space-y-2">
                    <span className="block text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                      Targeted Fibers
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeGuideData.muscles.map((muscle) => (
                        <span
                          key={muscle}
                          className="rounded-lg border border-border/40 bg-muted px-2.5 py-1 text-xs font-medium"
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Execution Mechanics / Form Cues Checkpoints */}
                  <div className="space-y-3 pt-2">
                    <span className="block text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                      Execution Matrix Cues
                    </span>
                    <div className="space-y-2.5">
                      {activeGuideData.cues.map((cue, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 text-xs leading-relaxed text-foreground/90"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          <span>{cue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
