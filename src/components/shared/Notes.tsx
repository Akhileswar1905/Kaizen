import { useState, useEffect, useMemo, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { RichTextEditor } from "./RichTextEditor" // Make sure this path is correct
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
  Clock,
  SaveAll,
  Folder,
  FolderPlus,
  PlusCircle,
  Tag,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useGamification } from "@/contexts/GamificationContext"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const DRAFT_KEY = "study_studio_local_draft"

interface NotesTrackerProps {
  onBack: () => void
}

export function NotesTracker({ onBack }: NotesTrackerProps) {
  const { user } = useAuth()
  const { triggerGamificationEvent, subtractGamificationPoints } =
    useGamification()

  const [notes, setNotes] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [folders, setFolders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Core Application Workspace State
  const [selectedNote, setSelectedNote] = useState<any | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [workspaceMode, setWorkspaceMode] = useState<"edit" | "preview">(
    "preview"
  )

  // Form State
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedTag, setSelectedTag] = useState("General")
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)

  // Dynamic Creation State
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [isAddingFolder, setIsAddingFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")

  // Filter State
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilterTag, setActiveFilterTag] = useState("All")
  const [activeFilterFolder, setActiveFilterFolder] = useState<string | null>(
    null
  )

  // Draft State
  const [draftSavedAt, setDraftSavedAt] = useState<Date | null>(null)
  const [hasAvailableDraft, setHasAvailableDraft] = useState(false)

  useEffect(() => {
    if (user) {
      fetchNotes()
      fetchCategories()
      fetchFolders()
    }
    checkExistingDraft()
  }, [user])

  // Auto-Save Draft Logic
  useEffect(() => {
    if (workspaceMode === "edit" && (title.trim() || content.trim())) {
      const timer = setTimeout(() => {
        const draftData = {
          title,
          content,
          tag: selectedTag,
          folderId: selectedFolderId,
          noteId: selectedNote?.id || null,
          timestamp: new Date().toISOString(),
        }
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData))
        setDraftSavedAt(new Date())
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [
    title,
    content,
    selectedTag,
    selectedFolderId,
    workspaceMode,
    selectedNote,
  ])

  const checkExistingDraft = () => {
    const savedDraft = localStorage.getItem(DRAFT_KEY)
    if (savedDraft) setHasAvailableDraft(true)
  }

  const loadDraft = useCallback(() => {
    const savedDraftStr = localStorage.getItem(DRAFT_KEY)
    if (savedDraftStr) {
      const draft = JSON.parse(savedDraftStr)
      setTitle(draft.title)
      setContent(draft.content)
      setSelectedTag(draft.tag)
      setSelectedFolderId(draft.folderId)
      setIsEditing(true)
      setWorkspaceMode("edit")
      setSelectedNote(notes.find((n) => n.id === draft.noteId) || null)
      setHasAvailableDraft(false)
    }
  }, [notes])

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY)
    setDraftSavedAt(null)
    setHasAvailableDraft(false)
  }

  // --- API Methods ---
  const fetchNotes = async (selectId?: string) => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setNotes(data)
      if (data.length > 0 && !hasAvailableDraft) {
        const nextSelected = selectId
          ? data.find((n) => n.id === selectId)
          : data[0]
        handleSelectNote(nextSelected || data[0])
      } else if (!hasAvailableDraft) {
        handleInitNewNote()
      }
    }
    setLoading(false)
  }

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("note_categories")
      .select("*")
      .order("name")
    if (!error && data) setCategories(data)
  }

  const fetchFolders = async () => {
    const { data, error } = await supabase
      .from("note_folders")
      .select("*")
      .order("created_at")
    if (!error && data) setFolders(data)
  }

  const handleAddFolder = async () => {
    if (!newFolderName.trim()) return
    const { data, error } = await supabase
      .from("note_folders")
      .insert([{ name: newFolderName.trim(), user_id: user?.id }])
      .select()
      .single()

    if (!error && data) {
      setFolders([...folders, data])
      setNewFolderName("")
      setIsAddingFolder(false)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return
    const { data, error } = await supabase
      .from("note_categories")
      .insert([{ name: newCategoryName.trim(), user_id: user?.id }])
      .select()
      .single()

    if (!error && data) {
      setCategories([...categories, data])
      setSelectedTag(data.name)
      setNewCategoryName("")
      setIsAddingCategory(false)
    }
  }

  // --- UI Handlers ---
  const handleSelectNote = (note: any) => {
    setSelectedNote(note)
    setIsEditing(false)
    setTitle(note.title)
    setContent(note.content)
    setSelectedTag(note.tag)
    setSelectedFolderId(note.folder_id || null)
    setWorkspaceMode("preview")
  }

  const handleInitNewNote = () => {
    setSelectedNote(null)
    setIsEditing(true)
    setTitle("")
    setContent("")
    setSelectedTag(categories.length > 0 ? categories[0].name : "General")
    setSelectedFolderId(activeFilterFolder) // Default to currently viewed folder
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
      folder_id: selectedFolderId,
    }

    if (selectedNote?.id) {
      const { data, error } = await supabase
        .from("notes")
        .update(payload)
        .eq("id", selectedNote.id)
        .select()
        .single()
      if (!error && data) {
        setNotes(notes.map((n) => (n.id === data.id ? data : n)))
        setSelectedNote(data)
        await triggerGamificationEvent({ type: "NOTE_SAVED", amount: 1 })
      }
    } else {
      const { data, error } = await supabase
        .from("notes")
        .insert(payload)
        .select()
        .single()
      if (!error && data) {
        setNotes([data, ...notes])
        setSelectedNote(data)
        await triggerGamificationEvent({ type: "NOTE_SAVED", amount: 1 })
      }
    }

    clearDraft()
    setIsEditing(false)
    setWorkspaceMode("preview")
    setIsSubmitting(false)
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const remainingNotes = notes.filter((n) => n.id !== id)
    setNotes(remainingNotes)

    if (selectedNote?.id === id) {
      if (remainingNotes.length > 0) handleSelectNote(remainingNotes[0])
      else handleInitNewNote()
    }
    await supabase.from("notes").delete().match({ id })
    await subtractGamificationPoints({ type: "NOTE_SAVED", amount: 1 })
  }

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesTag =
        activeFilterTag === "All" || note.tag === activeFilterTag
      const matchesFolder =
        activeFilterFolder === null || note.folder_id === activeFilterFolder
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesTag && matchesFolder && matchesSearch
    })
  }, [notes, activeFilterTag, activeFilterFolder, searchQuery])

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 p-6">
        <div className="h-16 w-full animate-pulse rounded-2xl border border-border/20 bg-muted/10" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="h-[500px] animate-pulse rounded-2xl border border-border/20 bg-muted/5 md:col-span-4" />
          <div className="h-[500px] animate-pulse rounded-2xl border border-border/20 bg-muted/5 md:col-span-8" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl animate-in space-y-6 p-4 text-foreground duration-500 fade-in slide-in-from-bottom-4 selection:bg-primary/20 sm:p-6 md:p-8">
      {/* Header */}
      <header className="flex flex-col gap-4 border-b border-border/40 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            className="h-10 w-10 shrink-0 rounded-full border-border/50 bg-card/50 shadow-sm backdrop-blur-sm transition-all hover:scale-105 hover:bg-muted active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-0.5">
            <h1 className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight sm:text-2xl">
              <div className="rounded-xl bg-primary/10 p-1.5 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Study Studio
              </span>
            </h1>
            <p className="text-xs font-medium text-muted-foreground/80 sm:text-sm">
              Document frameworks, conceptual models, and system foundations.
            </p>
          </div>
        </div>
        <div className="flex gap-3 self-start sm:self-center">
          {hasAvailableDraft && !isEditing && (
            <Button
              onClick={loadDraft}
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl border-amber-500/30 bg-amber-500/5 font-semibold text-amber-600 shadow-sm hover:bg-amber-500/10 dark:text-amber-400"
            >
              <SaveAll className="h-4 w-4" />
              Restore Draft
            </Button>
          )}
          <Button
            onClick={handleInitNewNote}
            size="sm"
            className="gap-2 rounded-xl px-5 font-bold shadow-sm shadow-primary/20 transition-all hover:shadow-md active:scale-95"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            Compile Entry
          </Button>
        </div>
      </header>

      {/* Primary Workspace */}
      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12">
        {/* LEFT COLUMN: Ledger Navigation */}
        <div className="space-y-5 md:col-span-4">
          {/* Folders List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-extrabold tracking-widest text-muted-foreground uppercase">
                Vault Directories
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsAddingFolder(true)}
                className="h-6 w-6 rounded-full hover:bg-primary/10 hover:text-primary"
              >
                <FolderPlus className="h-3.5 w-3.5" />
              </Button>
            </div>

            {isAddingFolder && (
              <div className="flex animate-in gap-2 fade-in slide-in-from-top-2">
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder name..."
                  className="h-8 border-border/50 bg-background/50 text-xs focus-visible:ring-1 focus-visible:ring-primary"
                  autoFocus
                />
                <Button
                  size="sm"
                  onClick={handleAddFolder}
                  className="h-8 px-2"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingFolder(false)}
                  className="h-8 px-2"
                >
                  Cancel
                </Button>
              </div>
            )}

            <div className="space-y-1">
              <button
                onClick={() => setActiveFilterFolder(null)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all",
                  activeFilterFolder === null
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted/60"
                )}
              >
                <Inbox className="h-4 w-4" />
                All Notes
              </button>
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setActiveFilterFolder(folder.id)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all",
                    activeFilterFolder === folder.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted/60"
                  )}
                >
                  <Folder className="h-4 w-4" />
                  {folder.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-border/40 bg-card/40 p-4 shadow-sm backdrop-blur-md">
            <div className="group relative">
              <Search className="absolute top-3 left-3.5 h-4 w-4 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
              <Input
                placeholder="Search ledger indexing..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 rounded-xl border-border/40 bg-background/50 pl-10 text-sm placeholder:text-muted-foreground/40 focus-visible:ring-1 focus-visible:ring-primary/40"
              />
            </div>

            <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-1">
              {["All", ...categories.map((c) => c.name)].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveFilterTag(tag)}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-bold tracking-wide transition-all",
                    activeFilterTag === tag
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-border/40 bg-background/40 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Chronological List Ledger */}
          <div className="no-scrollbar max-h-[calc(100vh-300px)] space-y-3 overflow-y-auto pr-2">
            {filteredNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border/40 bg-card/20 py-16 text-center">
                <div className="rounded-full bg-muted/50 p-3">
                  <Inbox className="h-6 w-6 text-muted-foreground/50" />
                </div>
                <p className="text-xs font-medium text-muted-foreground/70">
                  No documents index verified
                </p>
              </div>
            ) : (
              filteredNotes.map((note) => {
                const isCurrent = selectedNote?.id === note.id && !isEditing
                // Clean HTML for preview
                const plainTextPreview = note.content
                  .replace(/<[^>]+>/g, "")
                  .substring(0, 100)

                return (
                  <div
                    key={note.id}
                    onClick={() => handleSelectNote(note)}
                    className={cn(
                      "group relative cursor-pointer rounded-2xl border p-4 transition-all duration-300 select-none",
                      isCurrent
                        ? "border-primary/40 bg-primary/5 shadow-sm ring-1 ring-primary/20"
                        : "border-border/40 bg-card/30 backdrop-blur-sm hover:border-border/80 hover:bg-card/80"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <h4
                          className={cn(
                            "truncate text-sm font-bold tracking-tight transition-colors",
                            isCurrent
                              ? "text-primary"
                              : "text-foreground group-hover:text-primary/90"
                          )}
                        >
                          {note.title || "Untitled Fragment"}
                        </h4>
                        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground/70">
                          {plainTextPreview}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-md border border-border/50 bg-muted/80 px-2 py-1 text-[10px] font-bold tracking-wide text-muted-foreground uppercase">
                        {note.tag}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border/20 pt-3 font-mono text-[10px] text-muted-foreground/60">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="h-3.5 w-3.5" />
                        {format(new Date(note.created_at), "MMM dd, yyyy")}
                      </div>
                      <button
                        onClick={(e) => handleDelete(note.id, e)}
                        className="rounded-md p-1.5 text-destructive/60 opacity-0 transition-all group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Study Workspace Engine */}
        <div className="md:col-span-8">
          <Card className="flex min-h-[600px] flex-col overflow-hidden rounded-3xl border border-border/40 bg-card/40 shadow-lg backdrop-blur-xl transition-all duration-500 focus-within:border-primary/30 focus-within:shadow-xl focus-within:shadow-primary/5">
            {/* Control Bar */}
            <div className="flex items-center justify-between border-b border-border/30 bg-muted/20 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-2.5 w-2.5 rounded-full shadow-inner",
                    isEditing
                      ? "animate-pulse bg-amber-500 shadow-amber-500/50"
                      : "bg-emerald-500 shadow-emerald-500/50"
                  )}
                />
                <span className="font-mono text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  {isEditing ? "Compilation Mode" : "Knowledge Base Viewer"}
                </span>

                {isEditing && draftSavedAt && (
                  <span className="ml-2 hidden animate-in items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground fade-in sm:flex">
                    <Clock className="h-3 w-3" />
                    Draft saved {format(draftSavedAt, "HH:mm")}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {!isEditing && selectedNote && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditing(true)
                      setWorkspaceMode("edit")
                    }}
                    className="h-9 gap-2 rounded-xl border-border/60 px-4 text-xs font-bold hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                  >
                    <Edit3 className="h-4 w-4" />
                    Modify Asset
                  </Button>
                )}

                {isEditing && (
                  <div className="flex items-center gap-1 rounded-xl border border-border/40 bg-background/60 p-1 shadow-sm backdrop-blur-md">
                    <button
                      type="button"
                      onClick={() => setWorkspaceMode("edit")}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
                        workspaceMode === "edit"
                          ? "bg-card text-foreground shadow-sm ring-1 ring-border/50"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <PenTool className="h-3.5 w-3.5" />
                      Write
                    </button>
                    <button
                      type="button"
                      disabled={!content.trim()}
                      onClick={() => setWorkspaceMode("preview")}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all disabled:opacity-30",
                        workspaceMode === "preview"
                          ? "bg-card text-foreground shadow-sm ring-1 ring-border/50"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Preview
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Workspace Content Core */}
            <div className="relative flex flex-1 flex-col">
              {isEditing ? (
                <form
                  onSubmit={handleSaveNote}
                  className="z-10 flex flex-1 flex-col p-5 sm:p-8"
                >
                  <div className="flex flex-1 flex-col space-y-6">
                    <div className="space-y-2">
                      <Input
                        placeholder="System Title (e.g., CAP Theorem...)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="h-auto rounded-none border-0 border-b border-border/30 bg-transparent px-1 py-2 text-2xl font-black tracking-tight transition-colors placeholder:text-muted-foreground/30 focus-visible:border-primary/50 focus-visible:ring-0 sm:p-2 sm:text-3xl"
                        required
                      />
                    </div>

                    <div className="group relative flex flex-1 flex-col">
                      {workspaceMode === "edit" ? (
                        <RichTextEditor value={content} onChange={setContent} />
                      ) : (
                        <div className="markdown-preview flex-1 overflow-y-auto px-2 text-base leading-relaxed wrap-break-word">
                          <div dangerouslySetInnerHTML={{ __html: content }} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-6 border-t border-border/30 pt-6 sm:flex-row sm:items-start sm:justify-between">
                    {/* Metadata Selection */}
                    <div className="flex flex-wrap gap-4 sm:gap-8">
                      {/* Folder Selection */}
                      <div className="space-y-2">
                        <span className="block text-[10px] font-extrabold tracking-widest text-muted-foreground uppercase">
                          Directory
                        </span>
                        <Select
                          value={selectedFolderId || "none"}
                          onValueChange={(v) =>
                            setSelectedFolderId(v === "none" ? null : v)
                          }
                        >
                          <SelectTrigger className="h-9 w-[180px] border-border/40 bg-background/50 text-xs font-semibold">
                            <SelectValue placeholder="Select Folder" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none" className="text-xs">
                              <Folder className="mr-2 inline h-3 w-3 opacity-50" />{" "}
                              No Folder
                            </SelectItem>
                            {folders.map((f) => (
                              <SelectItem
                                key={f.id}
                                value={f.id}
                                className="text-xs"
                              >
                                <Folder className="mr-2 inline h-3 w-3 text-primary" />{" "}
                                {f.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Tag Selection */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="block text-[10px] font-extrabold tracking-widest text-muted-foreground uppercase">
                            Primary Tag
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() =>
                              setIsAddingCategory(!isAddingCategory)
                            }
                            className="h-5 w-5 rounded-full hover:bg-primary/10 hover:text-primary"
                          >
                            <PlusCircle className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        {isAddingCategory ? (
                          <div className="flex gap-2">
                            <Input
                              value={newCategoryName}
                              onChange={(e) =>
                                setNewCategoryName(e.target.value)
                              }
                              placeholder="Tag name..."
                              className="h-9 w-[140px] bg-background/50 text-xs"
                              autoFocus
                            />
                            <Button
                              size="sm"
                              type="button"
                              onClick={handleAddCategory}
                              className="h-9 px-3 text-xs"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <Select
                            value={selectedTag}
                            onValueChange={setSelectedTag}
                          >
                            <SelectTrigger className="h-9 w-[180px] border-border/40 bg-background/50 text-xs font-semibold">
                              <SelectValue placeholder="Select Tag" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((c) => (
                                <SelectItem
                                  key={c.id}
                                  value={c.name}
                                  className="text-xs"
                                >
                                  <Tag className="mr-2 inline h-3 w-3 text-primary/70" />{" "}
                                  {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end">
                      {selectedNote && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            clearDraft()
                            handleSelectNote(selectedNote)
                          }}
                          className="h-10 rounded-xl px-5 text-sm font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                          Discard
                        </Button>
                      )}
                      <Button
                        disabled={isSubmitting}
                        type="submit"
                        className="h-10 gap-2 rounded-xl px-6 font-bold shadow-md shadow-primary/20 transition-all hover:shadow-lg active:scale-95"
                      >
                        {isSubmitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
                            <span>Commit Asset</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              ) : (
                /* PREVIEW VIEW MODE */
                <div className="flex flex-1 flex-col space-y-6 p-6 select-text sm:p-10">
                  {selectedNote ? (
                    <>
                      <div className="space-y-4 border-b border-border/30 pb-6">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="rounded-md border border-primary/20 bg-primary/5 px-2.5 py-1 text-[10px] font-black tracking-widest text-primary uppercase shadow-sm">
                            {selectedNote.tag}
                          </span>
                          {selectedNote.folder_id && (
                            <span className="flex items-center gap-1.5 rounded-md border border-border/50 bg-muted/40 px-2.5 py-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                              <Folder className="h-3 w-3" />
                              {folders.find(
                                (f) => f.id === selectedNote.folder_id
                              )?.name || "Folder"}
                            </span>
                          )}
                          <div className="flex items-center gap-1.5 font-mono text-xs font-medium text-muted-foreground/60">
                            <Calendar className="h-3.5 w-3.5" />
                            Compiled{" "}
                            {format(
                              new Date(selectedNote.created_at),
                              "MMMM dd, yyyy"
                            )}
                          </div>
                        </div>
                        <h2 className="text-2xl leading-tight font-black tracking-tight text-foreground sm:text-4xl">
                          {selectedNote.title}
                        </h2>
                      </div>
                      <div className="markdown-preview max-h-[60vh] flex-1 overflow-y-auto pr-2 text-base leading-relaxed font-medium text-foreground/90">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: selectedNote.content,
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-1 animate-in flex-col items-center justify-center gap-4 py-20 text-center duration-500 zoom-in-95">
                      <div className="rounded-full border border-primary/20 bg-primary/10 p-5 text-primary shadow-inner">
                        <Sparkles className="h-8 w-8" />
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-lg font-bold text-foreground">
                          Study Studio Vacant
                        </p>
                        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground/60">
                          Select an entry from the ledger index panel or
                          initiate a pristine configuration to begin logging.
                        </p>
                      </div>
                      <Button
                        onClick={handleInitNewNote}
                        variant="outline"
                        className="mt-4 rounded-xl border-border/50 bg-background/50 shadow-sm backdrop-blur-sm hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                      >
                        Start Writing Now
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <style>{`
        .markdown-preview h1 { font-size: 1.75rem; font-weight: 900; margin-top: 1.5rem; margin-bottom: 0.75rem; color: var(--foreground); letter-spacing: -0.03em; border-b: 1px solid hsl(var(--border)/0.4); padding-bottom: 0.5rem; }
        .markdown-preview h2 { font-size: 1.4rem; font-weight: 800; margin-top: 1.25rem; margin-bottom: 0.5rem; color: var(--foreground); letter-spacing: -0.02em; }
        .markdown-preview h3 { font-size: 1.15rem; font-weight: 700; margin-top: 1rem; margin-bottom: 0.4rem; color: var(--foreground); letter-spacing: -0.01em;}
        .markdown-preview p { margin-bottom: 1rem; color: inherit; line-height: 1.75; text-align: left; }
        .markdown-preview p:last-child { margin-bottom: 0; }
        .markdown-preview strong { font-weight: 800; color: var(--foreground); }
        .markdown-preview ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
        .markdown-preview ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
        .markdown-preview li { margin-bottom: 0.35rem; padding-left: 0.25rem; }
        .markdown-preview code { font-family: monospace; background-color: hsl(var(--muted)/0.7); border: 1px solid hsl(var(--border)/0.5); padding: 0.2rem 0.4rem; border-radius: 6px; font-size: 0.85em; color: hsl(var(--primary)); font-weight: 600; }
        .markdown-preview pre { background: hsl(var(--muted)/0.4); padding: 1rem 1.25rem; border-radius: 12px; overflow-x: auto; margin-top: 0.75rem; margin-bottom: 1rem; border: 1px solid hsl(var(--border)/0.4); box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); }
        .markdown-preview pre code { background: transparent; padding: 0; border: none; color: var(--foreground); font-weight: 400; font-size: 0.9em; }
        .markdown-preview blockquote { border-left: 4px solid hsl(var(--primary)/0.6); background: hsl(var(--primary)/0.03); padding: 0.75rem 1rem; border-radius: 0 8px 8px 0; color: hsl(var(--muted-foreground)); font-style: italic; margin-top: 1rem; margin-bottom: 1rem; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
