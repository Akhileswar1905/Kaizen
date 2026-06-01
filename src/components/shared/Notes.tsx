import { useState, useEffect, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import ReactMarkdown from "react-markdown"
import {
  Loader2,
  Plus,
  Trash2,
  Search,
  Calendar,
  Inbox,
  Eye,
  PenTool,
  ChevronLeft,
  BookOpen,
  Edit3,
  Sparkles,
  CheckCircle2,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const TAGS = ["General", "Work", "Ideas", "Personal", "Study"]

interface NotesTrackerProps {
  onBack: () => void
}

export function NotesTracker({ onBack }: NotesTrackerProps) {
  const { user } = useAuth()
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Core Application Workspace State
  const [selectedNote, setSelectedNote] = useState<any | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Form State
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedTag, setSelectedTag] = useState("General")
  const [workspaceMode, setWorkspaceMode] = useState<"edit" | "preview">("edit")

  // Filter State
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilterTag, setActiveFilterTag] = useState("All")

  useEffect(() => {
    if (user) fetchNotes()
  }, [user])

  const fetchNotes = async (selectId?: string) => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setNotes(data)
      // Automatically focus the first note or retain existing selection
      if (data.length > 0) {
        const nextSelected = selectId
          ? data.find((n) => n.id === selectId)
          : data[0]
        handleSelectNote(nextSelected || data[0])
      } else {
        handleInitNewNote()
      }
    }
    setLoading(false)
  }

  const handleSelectNote = (note: any) => {
    setSelectedNote(note)
    setIsEditing(false)
    setTitle(note.title)
    setContent(note.content)
    setSelectedTag(note.tag)
    setWorkspaceMode("preview") // Default to reading mode for fast retention
  }

  const handleInitNewNote = () => {
    setSelectedNote(null)
    setIsEditing(true)
    setTitle("")
    setContent("")
    setSelectedTag("General")
    setWorkspaceMode("edit")
  }

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    setIsSubmitting(true)

    const payload = {
      user_id: user?.id,
      title: title.trim(),
      content: content.trim(),
      tag: selectedTag,
    }

    if (selectedNote?.id) {
      // Update existing record
      const { data, error } = await supabase
        .from("notes")
        .update(payload)
        .eq("id", selectedNote.id)
        .select()
        .single()

      if (!error && data) {
        setNotes(notes.map((n) => (n.id === data.id ? data : n)))
        setSelectedNote(data)
        setIsEditing(false)
        setWorkspaceMode("preview")
      }
    } else {
      // Create new record
      const { data, error } = await supabase
        .from("notes")
        .insert(payload)
        .select()
        .single()

      if (!error && data) {
        setNotes([data, ...notes])
        setSelectedNote(data)
        setIsEditing(false)
        setWorkspaceMode("preview")
      }
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent resetting active panel focus
    const remainingNotes = notes.filter((n) => n.id !== id)
    setNotes(remainingNotes)

    if (selectedNote?.id === id) {
      if (remainingNotes.length > 0) {
        handleSelectNote(remainingNotes[0])
      } else {
        handleInitNewNote()
      }
    }
    await supabase.from("notes").delete().match({ id })
  }

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesTag =
        activeFilterTag === "All" || note.tag === activeFilterTag
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesTag && matchesSearch
    })
  }, [notes, activeFilterTag, searchQuery])

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 p-6">
        <div className="h-16 w-full animate-pulse rounded-2xl border border-border/20 bg-muted/10" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="h-137.5 animate-pulse rounded-2xl border border-border/20 bg-muted/5 md:col-span-4" />
          <div className="h-137.5 animate-pulse rounded-2xl border border-border/20 bg-muted/5 md:col-span-8" />
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in mx-auto max-w-6xl space-y-6 p-4 text-foreground selection:bg-primary/10 sm:p-6">
      {/* Premium Dashboard Navigation */}
      <header className="flex flex-col gap-4 border-b border-border/40 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            className="h-9 w-9 shrink-0 rounded-xl border-border/50 bg-background/50 shadow-sm backdrop-blur-sm transition-all hover:bg-muted/50 active:scale-95"
          >
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          </Button>
          <div>
            <h1 className="flex items-center gap-2 text-lg font-bold tracking-tight sm:text-xl">
              <BookOpen className="h-4 w-4 text-primary" />
              Personal Study Studio
            </h1>
            <p className="text-xs font-medium text-muted-foreground">
              Document frameworks, conceptual models, and system foundations.
            </p>
          </div>
        </div>
        <Button
          onClick={handleInitNewNote}
          size="sm"
          className="gap-1.5 self-start rounded-xl font-semibold shadow-sm sm:self-center"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Compile Entry
        </Button>
      </header>

      {/* Primary Workspace Architecture */}
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-12">
        {/* LEFT COLUMN: Ledger Navigation & Search Deck (4 Cols) */}
        <div className="space-y-4 md:col-span-4">
          <div className="flex flex-col gap-2.5 rounded-2xl border border-border/40 bg-card/40 p-3 shadow-sm backdrop-blur-md">
            <div className="relative">
              <Search className="absolute top-2.5 left-3 h-3.5 w-3.5 text-muted-foreground/50" />
              <Input
                placeholder="Search ledger indexing..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 rounded-xl border-border/30 bg-background/50 pl-9 text-xs placeholder:text-muted-foreground/40 focus-visible:ring-1 focus-visible:ring-primary/30"
              />
            </div>

            <div className="no-scrollbar flex items-center gap-1 overflow-x-auto">
              {["All", ...TAGS].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveFilterTag(tag)}
                  className={cn(
                    "shrink-0 rounded-lg border px-2.5 py-1 text-[11px] font-semibold tracking-tight transition-all",
                    activeFilterTag === tag
                      ? "border-foreground bg-foreground text-background"
                      : "border-border/30 bg-background/40 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Chronological List Ledger */}
          <div className="no-scrollbar max-h-125 space-y-2 overflow-y-auto pr-1">
            {filteredNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/30 bg-card/10 py-12 text-center">
                <Inbox className="h-5 w-5 text-muted-foreground/30" />
                <p className="text-[11px] font-medium text-muted-foreground/60">
                  No documents index verified
                </p>
              </div>
            ) : (
              filteredNotes.map((note) => {
                const isCurrent = selectedNote?.id === note.id
                return (
                  <div
                    key={note.id}
                    onClick={() => handleSelectNote(note)}
                    className={cn(
                      "group relative cursor-pointer rounded-xl border p-3.5 transition-all duration-200 select-none",
                      isCurrent
                        ? "border-primary/50 bg-card shadow-sm ring-1 ring-primary/10"
                        : "border-border/30 bg-card/40 hover:border-border/80 hover:bg-card/70"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 space-y-1">
                        <h4
                          className={cn(
                            "truncate text-xs font-bold tracking-tight",
                            isCurrent ? "text-primary" : "text-foreground"
                          )}
                        >
                          {note.title || "Untitled Fragment"}
                        </h4>
                        <p className="line-clamp-2 text-[10px] leading-relaxed text-muted-foreground/70">
                          {note.content.replace(/[#*`\-]/g, "")}
                        </p>
                      </div>
                      <span className="shrink-0 rounded bg-muted/60 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-muted-foreground uppercase">
                        {note.tag}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-border/10 pt-2 font-mono text-[9px] text-muted-foreground/40">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(note.created_at), "MMM dd, yyyy")}
                      </div>
                      <button
                        onClick={(e) => handleDelete(note.id, e)}
                        className="rounded p-0.5 text-destructive/60 opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Study Workspace Engine (8 Cols) */}
        <div className="md:col-span-8">
          <Card className="flex min-h-145 flex-col overflow-hidden rounded-2xl border border-border/40 bg-card/50 shadow-md backdrop-blur-md">
            {/* Control Bar */}
            <div className="flex items-center justify-between border-b border-border/30 bg-muted/20 px-4 py-3 sm:px-5">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    isEditing ? "animate-pulse bg-amber-500" : "bg-emerald-500"
                  )}
                />
                <span className="font-mono text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  {isEditing ? "Compilation Mode" : "Knowledge Base Viewer"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {!isEditing && selectedNote && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="h-8 gap-1 rounded-lg border-border/60 px-2.5 text-xs font-semibold"
                  >
                    <Edit3 className="h-3 w-3" />
                    Modify Asset
                  </Button>
                )}

                {isEditing && (
                  <div className="flex items-center gap-1 rounded-xl border border-border/30 bg-background/50 p-0.5">
                    <button
                      type="button"
                      onClick={() => setWorkspaceMode("edit")}
                      className={cn(
                        "flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all",
                        workspaceMode === "edit"
                          ? "bg-card text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <PenTool className="h-3 w-3" />
                      Write
                    </button>
                    <button
                      type="button"
                      disabled={!content.trim()}
                      onClick={() => setWorkspaceMode("preview")}
                      className={cn(
                        "flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all disabled:opacity-30",
                        workspaceMode === "preview"
                          ? "bg-card text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Eye className="h-3 w-3" />
                      Preview
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Workspace Content Core */}
            <div className="flex flex-1 flex-col p-4 sm:p-6">
              {isEditing ? (
                <form
                  onSubmit={handleSaveNote}
                  className="flex flex-1 flex-col space-y-4"
                >
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
                      System Title
                    </label>
                    <Input
                      placeholder="e.g., CAP Theorem, Event-Driven Architectures..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="h-10 rounded-xl border-border/30 bg-background/30 font-semibold focus-visible:ring-1 focus-visible:ring-primary/20"
                      required
                    />
                  </div>

                  <div className="flex min-h-75 flex-1 flex-col space-y-1">
                    <label className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
                      Technical Architecture Markdown Docs
                    </label>
                    {workspaceMode === "edit" ? (
                      <Textarea
                        placeholder="Structure your notes utilizing structured Markdown templates..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="flex-1 resize-none rounded-xl border-border/30 bg-background/30 p-4 font-mono text-xs leading-relaxed shadow-inner focus-visible:ring-1 focus-visible:ring-primary/20"
                        required
                      />
                    ) : (
                      <div className="markdown-preview flex-1 overflow-y-auto rounded-xl border border-border/20 bg-background/20 p-5 text-sm leading-relaxed wrap-break-word shadow-inner">
                        <ReactMarkdown>{content}</ReactMarkdown>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto flex flex-col gap-3 border-t border-border/20 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1.5">
                      <span className="block text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
                        Vault Cataloging Anchor Tag
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {TAGS.map((tag) => (
                          <button
                            type="button"
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className={cn(
                              "rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all",
                              selectedTag === tag
                                ? "border-foreground/80 bg-foreground/5 font-bold text-foreground"
                                : "border-border/30 bg-background/40 text-muted-foreground hover:border-border/60"
                            )}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end">
                      {selectedNote && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSelectNote(selectedNote)}
                          className="h-9 rounded-xl text-muted-foreground hover:text-foreground"
                        >
                          Cancel
                        </Button>
                      )}
                      <Button
                        disabled={isSubmitting}
                        type="submit"
                        size="sm"
                        className="h-9 gap-1.5 rounded-xl font-semibold shadow-sm"
                      >
                        {isSubmitting ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.5]" />
                            <span>Commit Asset</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              ) : (
                /* PREVIEW/STUDY VIEW MODE */
                <div className="flex flex-1 flex-col space-y-5 select-text">
                  {selectedNote ? (
                    <>
                      <div className="space-y-1.5 border-b border-border/20 pb-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-md border border-primary/20 bg-primary/5 px-2 py-0.5 text-[9px] font-bold tracking-wide text-primary uppercase">
                            {selectedNote.tag}
                          </span>
                          <div className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground/50">
                            <Calendar className="h-3 w-3" />
                            Compiled{" "}
                            {format(
                              new Date(selectedNote.created_at),
                              "MMMM dd, yyyy"
                            )}
                          </div>
                        </div>
                        <h2 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                          {selectedNote.title}
                        </h2>
                      </div>

                      {/* Full-Scale Fluid Technical Text Engine */}
                      <div className="markdown-preview max-h-115 flex-1 overflow-y-auto pr-1 text-sm leading-relaxed font-medium text-foreground/90">
                        <ReactMarkdown>{selectedNote.content}</ReactMarkdown>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center">
                      <div className="rounded-full border border-primary/10 bg-primary/5 p-3 text-primary">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground">
                          Study Studio Vacant
                        </p>
                        <p className="mx-auto mt-0.5 max-w-xs text-[11px] text-muted-foreground/50">
                          Select an entry from the ledger index panel or build a
                          pristine configuration.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Global CSS Typography Engine for Knowledge Base Text Structures */}
      <style>{`
        .markdown-preview h1 { font-size: 1.35rem; font-weight: 800; margin-top: 1.25rem; margin-bottom: 0.5rem; color: var(--foreground); tracking: -0.02em; border-b: 1px solid hsl(var(--border)/0.3); padding-bottom: 0.25rem; }
        .markdown-preview h2 { font-size: 1.15rem; font-weight: 700; margin-top: 1rem; margin-bottom: 0.4rem; color: var(--foreground); tracking: -0.01em; }
        .markdown-preview h3 { font-size: 1rem; font-weight: 600; margin-top: 0.75rem; margin-bottom: 0.3rem; color: var(--foreground); }
        .markdown-preview p { margin-bottom: 0.75rem; color: inherit; line-height: 1.65; text-align: justify; }
        .markdown-preview p:last-child { margin-bottom: 0; }
        .markdown-preview strong { font-weight: 700; color: var(--foreground); }
        .markdown-preview ul { list-style-type: disc; padding-left: 1.25rem; margin-bottom: 0.75rem; }
        .markdown-preview ol { list-style-type: decimal; padding-left: 1.25rem; margin-bottom: 0.75rem; }
        .markdown-preview li { margin-bottom: 0.25rem; }
        .markdown-preview code { font-family: monospace; background-color: hsl(var(--muted)/0.5); border: 1px solid hsl(var(--border)/0.4); padding: 0.15rem 0.35rem; border-radius: 6px; font-size: 0.85em; color: hsl(var(--primary)); font-weight: 600; }
        .markdown-preview pre { background: hsl(var(--muted)/0.3); padding: 0.75rem 1rem; border-radius: 12px; overflow-x: auto; margin-top: 0.5rem; margin-bottom: 0.75rem; border: 1px solid hsl(var(--border)/0.3); shadow: inset 0 1px 2px rgba(0,0,0,0.05); }
        .markdown-preview pre code { background: transparent; padding: 0; border: none; color: var(--foreground); font-weight: 400; }
        .markdown-preview blockquote { border-left: 3px solid hsl(var(--primary)/0.6); padding-left: 0.85rem; color: hsl(var(--muted-foreground)); font-style: italic; margin-top: 0.5rem; margin-bottom: 0.75rem; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
