import { useState, useMemo, useEffect } from "react"
import { format, addDays, isSameDay } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CalendarDays,
  Trash2,
  ListTodo,
  CheckCircle2,
  Circle,
  ClipboardList,
  Loader2,
  AlertCircle,
  Pencil,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTodos } from "@/hooks/useTodos"

interface PlannerViewProps {
  onBack: () => void
}

export function PlannerView({ onBack }: PlannerViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null)

  // Dialog State (add task)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDesc, setNewTaskDesc] = useState("")

  // Inline editing state for the detail panel (title/description)
  const [isEditingDetail, setIsEditingDetail] = useState(false)
  const [editTaskTitle, setEditTaskTitle] = useState("")
  const [editTaskDesc, setEditTaskDesc] = useState("")
  const [isSavingEdit, setIsSavingEdit] = useState(false)

  // Leaving edit mode whenever the selected task changes (or is deselected)
  // avoids stale edits bleeding into a different task.
  useEffect(() => {
    setIsEditingDetail(false)
  }, [selectedTodoId])

  // Backed by Supabase — see useTodos.ts for the table schema and RLS policy.
  const { todos, loading, error, addTodo, toggleTodo, updateTodo, deleteTodo } =
    useTodos()

  const dateStr = format(currentDate, "yyyy-MM-dd")
  const activeTodos = todos.filter((t) => t.date === dateStr)
  const selectedTodo = activeTodos.find((t) => t.id === selectedTodoId) ?? null

  const completedCount = activeTodos.filter((t) => t.completed).length
  const progressPct =
    activeTodos.length === 0
      ? 0
      : Math.round((completedCount / activeTodos.length) * 100)

  // Days shown in the left rail: dates that have todos, plus always "today"
  // and "tomorrow" (so you can plan ahead the night before) and whatever
  // date is currently selected — otherwise navigating away from an empty
  // day strands you with no way back to it.
  const dayRail = useMemo(() => {
    const todayStr = format(new Date(), "yyyy-MM-dd")
    const tomorrowStr = format(addDays(new Date(), 1), "yyyy-MM-dd")
    const uniqueDates = Array.from(
      new Set([...todos.map((t) => t.date), todayStr, tomorrowStr, dateStr])
    ).sort()
    return uniqueDates.map((d) => new Date(`${d}T00:00:00`))
  }, [todos, dateStr])

  const countForDay = (day: Date) => {
    const key = format(day, "yyyy-MM-dd")
    const dayTodos = todos.filter((t) => t.date === key)
    return {
      total: dayTodos.length,
      completed: dayTodos.filter((t) => t.completed).length,
    }
  }

  const selectDay = (day: Date) => {
    setCurrentDate(day)
    setSelectedTodoId(null)
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    // Require both fields
    if (!newTaskTitle.trim() || !newTaskDesc.trim()) return

    setIsSubmitting(true)
    const todo = await addTodo(newTaskTitle.trim(), newTaskDesc.trim(), dateStr)
    setIsSubmitting(false)

    if (todo) {
      setSelectedTodoId(todo.id)
      // Reset and close dialog
      setNewTaskTitle("")
      setNewTaskDesc("")
      setIsDialogOpen(false)
    }
    // On failure, the dialog stays open and `error` from the hook surfaces
    // in the banner so the person can retry.
  }

  const handleDeleteTodo = (id: string) => {
    deleteTodo(id)
    if (selectedTodoId === id) setSelectedTodoId(null)
  }

  const startEditingDetail = () => {
    if (!selectedTodo) return
    setEditTaskTitle(selectedTodo.title)
    setEditTaskDesc(selectedTodo.description)
    setIsEditingDetail(true)
  }

  const cancelEditingDetail = () => {
    setIsEditingDetail(false)
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTodo) return
    if (!editTaskTitle.trim() || !editTaskDesc.trim()) return

    setIsSavingEdit(true)
    const success = await updateTodo(selectedTodo.id, {
      title: editTaskTitle.trim(),
      description: editTaskDesc.trim(),
    })
    setIsSavingEdit(false)

    if (success) {
      setIsEditingDetail(false)
    }
    // On failure, edit mode stays open and `error` from the hook surfaces
    // in the banner so the person can retry.
  }

  return (
    <div className="flex min-h-screen justify-center bg-background/50 px-3 py-6 font-sans text-foreground antialiased sm:px-6 sm:py-10 md:px-12 md:py-14">
      <div className="w-full max-w-5xl animate-in space-y-6 duration-500 fade-in slide-in-from-bottom-4">
        {/* Header */}
        <header className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-10 w-10 shrink-0 rounded-full bg-card/60 hover:bg-muted"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="flex items-center gap-2 bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-2xl font-extrabold tracking-tight text-transparent sm:text-3xl">
              <ListTodo className="h-6 w-6 text-primary" /> Daily Planner
            </h1>
            <p className="mt-0.5 text-sm font-medium text-muted-foreground/80">
              Execute your specific tasks for the day.
            </p>
          </div>
        </header>

        {/* Error banner surfaces auth/network failures from Supabase */}
        {error && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Main shell: day rail + workspace */}
        {loading ? (
          <Card className="overflow-hidden border border-border/50 bg-card/40 shadow-sm backdrop-blur-sm">
            <CardContent className="flex h-72 flex-col items-center justify-center gap-3 p-0">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/60" />
              <p className="text-sm font-medium text-muted-foreground">
                Loading your tasks...
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="overflow-hidden border border-border/50 bg-card/40 shadow-sm backdrop-blur-sm">
            <CardContent className="flex flex-col gap-0 p-0 lg:flex-row">
              {/* Left rail: list of days */}
              <aside className="flex shrink-0 flex-col border-b border-border/40 lg:w-56 lg:border-r lg:border-b-0">
                <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
                  <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Days
                  </span>
                  <div className="flex items-center gap-0.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const idx = dayRail.findIndex((d) =>
                          isSameDay(d, currentDate)
                        )
                        if (idx > 0) selectDay(dayRail[idx - 1])
                      }}
                      disabled={
                        dayRail.findIndex((d) => isSameDay(d, currentDate)) <= 0
                      }
                      className="h-6 w-6 rounded-md hover:bg-muted disabled:opacity-30"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const idx = dayRail.findIndex((d) =>
                          isSameDay(d, currentDate)
                        )
                        if (idx >= 0 && idx < dayRail.length - 1)
                          selectDay(dayRail[idx + 1])
                      }}
                      disabled={
                        dayRail.findIndex((d) => isSameDay(d, currentDate)) ===
                        dayRail.length - 1
                      }
                      className="h-6 w-6 rounded-md hover:bg-muted disabled:opacity-30"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex max-h-40 gap-1.5 overflow-x-auto px-3 py-3 lg:max-h-none lg:flex-col lg:gap-1 lg:overflow-x-visible lg:overflow-y-auto">
                  {dayRail.map((day) => {
                    const { total, completed } = countForDay(day)
                    const selected = isSameDay(day, currentDate)
                    const today = isSameDay(day, new Date())
                    const tomorrow = isSameDay(day, addDays(new Date(), 1))
                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => selectDay(day)}
                        className={cn(
                          "flex shrink-0 items-center justify-between gap-2 rounded-lg px-3 py-2 text-left transition-colors duration-150 lg:shrink",
                          selected
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "hover:bg-muted"
                        )}
                      >
                        <div className="flex flex-col leading-tight">
                          <span
                            className={cn(
                              "text-[10px] font-bold tracking-wider uppercase",
                              selected
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground/70"
                            )}
                          >
                            {today
                              ? "Today"
                              : tomorrow
                                ? "Tomorrow"
                                : format(day, "EEE")}
                          </span>
                          <span className="text-sm font-semibold whitespace-nowrap">
                            {format(day, "MMM d")}
                          </span>
                        </div>
                        {total > 0 && (
                          <span
                            className={cn(
                              "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                              selected
                                ? "bg-primary-foreground/20 text-primary-foreground"
                                : completed === total
                                  ? "bg-primary/15 text-primary"
                                  : "bg-muted text-muted-foreground"
                            )}
                          >
                            {completed}/{total}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </aside>

              {/* Right workspace */}
              <div className="flex min-w-0 flex-1 flex-col">
                {/* Day header + add button */}
                <div className="flex items-center justify-between gap-3 border-b border-border/40 px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <CalendarDays className="h-4 w-4 text-muted-foreground/70" />
                    <div>
                      <h2 className="text-base font-bold tracking-tight">
                        {isSameDay(currentDate, new Date())
                          ? "Today"
                          : isSameDay(currentDate, addDays(new Date(), 1))
                            ? "Tomorrow"
                            : format(currentDate, "EEEE")}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {format(currentDate, "MMMM do, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {activeTodos.length > 0 && (
                      <div className="hidden items-center gap-2 sm:flex">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-primary transition-all duration-500 ease-out"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-muted-foreground tabular-nums">
                          {progressPct}%
                        </span>
                      </div>
                    )}

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className="gap-1.5 rounded-lg shadow-sm"
                        >
                          <Plus className="h-4 w-4" />
                          Add
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="border-border/50 bg-card/95 backdrop-blur-xl sm:max-w-106.25">
                        <form onSubmit={handleAddTask}>
                          <DialogHeader>
                            <DialogTitle>New Task</DialogTitle>
                            <DialogDescription>
                              Add a specific execution goal for{" "}
                              {isSameDay(currentDate, new Date())
                                ? "today"
                                : isSameDay(currentDate, addDays(new Date(), 1))
                                  ? "tomorrow"
                                  : format(currentDate, "MMM do")}
                              .
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-6">
                            <div className="grid gap-2">
                              <Label
                                htmlFor="title"
                                className="text-xs font-bold tracking-wider text-muted-foreground uppercase"
                              >
                                Title *
                              </Label>
                              <Input
                                id="title"
                                placeholder="e.g. Complete landing page"
                                value={newTaskTitle}
                                onChange={(e) =>
                                  setNewTaskTitle(e.target.value)
                                }
                                className="border-border/50 bg-background/50 focus-visible:ring-primary/50"
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label
                                htmlFor="description"
                                className="text-xs font-bold tracking-wider text-muted-foreground uppercase"
                              >
                                Description *
                              </Label>
                              <Textarea
                                id="description"
                                placeholder="Specific details on how to execute this..."
                                value={newTaskDesc}
                                onChange={(e) => setNewTaskDesc(e.target.value)}
                                className="min-h-25 resize-none border-border/50 bg-background/50 focus-visible:ring-primary/50"
                                required
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => setIsDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              disabled={
                                !newTaskTitle.trim() ||
                                !newTaskDesc.trim() ||
                                isSubmitting
                              }
                              className="gap-1.5"
                            >
                              {isSubmitting && (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              )}
                              {isSubmitting ? "Saving..." : "Save Task"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Body: todo list + detail panel */}
                <div className="flex min-w-0 flex-1 flex-col sm:flex-row">
                  {/* Todo list */}
                  <div className="flex w-full flex-col border-b border-border/40 sm:w-64 sm:shrink-0 sm:border-r sm:border-b-0">
                    {activeTodos.length === 0 ? (
                      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-10 text-center">
                        <CheckCircle2 className="h-7 w-7 text-muted-foreground/30" />
                        <p className="text-xs font-medium text-muted-foreground">
                          No tasks scheduled for this day.
                        </p>
                      </div>
                    ) : (
                      <ul className="flex-1 divide-y divide-border/30 overflow-y-auto">
                        {activeTodos.map((todo) => {
                          const selected = todo.id === selectedTodoId
                          return (
                            <li key={todo.id}>
                              <button
                                onClick={() => setSelectedTodoId(todo.id)}
                                className={cn(
                                  "group flex w-full items-start gap-2.5 px-4 py-3 text-left transition-colors duration-150",
                                  selected ? "bg-muted/60" : "hover:bg-muted/30"
                                )}
                              >
                                <span
                                  role="button"
                                  tabIndex={0}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleTodo(todo.id)
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      e.stopPropagation()
                                      toggleTodo(todo.id)
                                    }
                                  }}
                                  className="mt-0.5 shrink-0 transition-transform hover:scale-110 focus:outline-none"
                                >
                                  {todo.completed ? (
                                    <CheckCircle2 className="h-4.5 w-4.5 text-primary" />
                                  ) : (
                                    <Circle className="h-4.5 w-4.5 text-muted-foreground/50 group-hover:text-primary/70" />
                                  )}
                                </span>
                                <span
                                  className={cn(
                                    "line-clamp-2 text-sm leading-snug font-medium",
                                    todo.completed
                                      ? "text-muted-foreground line-through opacity-70"
                                      : "text-foreground/90"
                                  )}
                                >
                                  {todo.title}
                                </span>
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>

                  {/* Detail panel */}
                  <div className="flex min-w-0 flex-1 flex-col p-5">
                    {selectedTodo ? (
                      isEditingDetail ? (
                        <form
                          onSubmit={handleSaveEdit}
                          className="flex h-full flex-col"
                        >
                          <div className="grid gap-4">
                            <div className="grid gap-2">
                              <Label
                                htmlFor="edit-title"
                                className="text-xs font-bold tracking-wider text-muted-foreground uppercase"
                              >
                                Title *
                              </Label>
                              <Input
                                id="edit-title"
                                autoFocus
                                placeholder="e.g. Complete landing page"
                                value={editTaskTitle}
                                onChange={(e) =>
                                  setEditTaskTitle(e.target.value)
                                }
                                className="border-border/50 bg-background/50 text-base font-semibold focus-visible:ring-primary/50"
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label
                                htmlFor="edit-description"
                                className="text-xs font-bold tracking-wider text-muted-foreground uppercase"
                              >
                                Description *
                              </Label>
                              <Textarea
                                id="edit-description"
                                placeholder="Specific details on how to execute this..."
                                value={editTaskDesc}
                                onChange={(e) =>
                                  setEditTaskDesc(e.target.value)
                                }
                                className="min-h-32 flex-1 resize-none border-border/50 bg-background/50 text-sm leading-relaxed focus-visible:ring-primary/50"
                                required
                              />
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-end gap-2 border-t border-border/30 pt-4">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={cancelEditingDetail}
                              disabled={isSavingEdit}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              size="sm"
                              disabled={
                                !editTaskTitle.trim() ||
                                !editTaskDesc.trim() ||
                                isSavingEdit
                              }
                              className="gap-1.5 rounded-lg"
                            >
                              {isSavingEdit && (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              )}
                              {isSavingEdit ? "Saving..." : "Save Changes"}
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex h-full flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5">
                              <button
                                onClick={() => toggleTodo(selectedTodo.id)}
                                className="mt-0.5 shrink-0 transition-transform hover:scale-110 focus:outline-none"
                              >
                                {selectedTodo.completed ? (
                                  <CheckCircle2 className="h-5 w-5 text-primary" />
                                ) : (
                                  <Circle className="h-5 w-5 text-muted-foreground/50 hover:text-primary/70" />
                                )}
                              </button>
                              <h3
                                className={cn(
                                  "text-lg font-bold tracking-tight",
                                  selectedTodo.completed
                                    ? "text-muted-foreground line-through opacity-70"
                                    : "text-foreground"
                                )}
                              >
                                {selectedTodo.title}
                              </h3>
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={startEditingDetail}
                                className="h-8 w-8 hover:bg-muted"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleDeleteTodo(selectedTodo.id)
                                }
                                className="h-8 w-8 hover:bg-red-500/10 hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <p
                            className={cn(
                              "mt-4 flex-1 text-sm leading-relaxed whitespace-pre-wrap",
                              selectedTodo.completed
                                ? "text-muted-foreground/60"
                                : "text-muted-foreground"
                            )}
                          >
                            {selectedTodo.description}
                          </p>

                          <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-4">
                            <span className="text-xs font-medium text-muted-foreground/70">
                              {selectedTodo.completed
                                ? "Completed"
                                : "In progress"}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleTodo(selectedTodo.id)}
                              className="gap-1.5 rounded-lg border-border/50"
                            >
                              {selectedTodo.completed ? (
                                <>
                                  <Circle className="h-3.5 w-3.5" /> Mark
                                  incomplete
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Mark
                                  complete
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/40 px-6 py-10 text-center">
                        <ClipboardList className="h-7 w-7 text-muted-foreground/30" />
                        <p className="text-sm font-medium text-muted-foreground">
                          {activeTodos.length === 0
                            ? "Add a task to get started."
                            : "Select a task to see its details."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
