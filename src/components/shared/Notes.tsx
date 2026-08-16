import { useState, useEffect, useMemo, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { RichTextEditor } from "./RichTextEditor"
import {
  Loader2,
  Trash2,
  Search,
  Inbox,
  PenTool,
  ChevronLeft,
  SaveAll,
  Folder,
  FolderPlus,
  PlusCircle,
  Plus,
  Edit3,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  FileText,
  X,
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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Mobile view state for switching between list and editor on small screens
  const [mobileView, setMobileView] = useState<"list" | "editor">("list")

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
      setMobileView("editor")
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
    setMobileView("editor")
  }

  const handleInitNewNote = () => {
    setSelectedNote(null)
    setIsEditing(true)
    setTitle("")
    setContent("")
    setSelectedTag(categories.length > 0 ? categories[0].name : "General")
    setSelectedFolderId(activeFilterFolder)
    setWorkspaceMode("edit")
    setMobileView("editor")
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
      <div className="flex min-h-dvh items-center justify-center bg-background text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Sidebar content component to reuse for both desktop sidebar and mobile sheet drawer
  const renderSidebarContent = () => (
    <div className="space-y-5 px-4">
      {/* Folders Section */}
      <div className="space-y-1">
        <div className="group flex items-center justify-between pb-1.5">
          <span className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
            Folders
          </span>
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsAddingFolder(!isAddingFolder)}
              className="h-6 w-6 text-muted-foreground opacity-70 transition-opacity hover:bg-accent hover:text-accent-foreground hover:opacity-100"
              title="Add Folder"
            >
              <FolderPlus className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsSidebarCollapsed(true)
                setIsMobileSidebarOpen(false)
              }}
              className="hidden h-6 w-6 text-muted-foreground hover:bg-accent hover:text-accent-foreground lg:flex"
              title="Collapse Sidebar"
            >
              <PanelLeftClose className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {isAddingFolder && (
          <div className="flex items-center gap-1 py-1">
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="New folder name"
              className="h-8 border-border bg-background text-xs shadow-none focus-visible:ring-1 focus-visible:ring-ring"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleAddFolder()}
            />
          </div>
        )}

        <div className="space-y-0.5">
          <button
            onClick={() => {
              setActiveFilterFolder(null)
              setIsMobileSidebarOpen(false)
            }}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all duration-150",
              activeFilterFolder === null
                ? "bg-primary font-medium text-primary-foreground shadow-sm"
                : "text-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Inbox className="h-4 w-4 shrink-0" />
            <span>All Notes</span>
            <span
              className={cn(
                "ml-auto text-xs tabular-nums",
                activeFilterFolder === null
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground/70"
              )}
            >
              {notes.length}
            </span>
          </button>

          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => {
                setActiveFilterFolder(folder.id)
                setIsMobileSidebarOpen(false)
              }}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all duration-150",
                activeFilterFolder === folder.id
                  ? "bg-primary font-medium text-primary-foreground shadow-sm"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Folder className="h-4 w-4 shrink-0" />
              <span className="truncate">{folder.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tags Section */}
      <div className="space-y-1">
        <div className="group flex items-center justify-between pb-1.5">
          <span className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
            Tags
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsAddingCategory(!isAddingCategory)}
            className="h-6 w-6 text-muted-foreground opacity-70 transition-opacity hover:bg-accent hover:text-accent-foreground hover:opacity-100"
            title="Add Tag"
          >
            <PlusCircle className="h-3.5 w-3.5" />
          </Button>
        </div>

        {isAddingCategory && (
          <div className="flex items-center gap-1 py-1">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New tag name"
              className="h-8 border-border bg-background text-xs shadow-none focus-visible:ring-1 focus-visible:ring-ring"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
            />
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {["All", ...categories.map((c) => c.name)].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setActiveFilterTag(tag)
                setIsMobileSidebarOpen(false)
              }}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-all duration-150",
                activeFilterTag === tag
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-dvh justify-center bg-background/50 px-2 py-2 font-sans text-foreground antialiased sm:px-6 sm:py-1 md:px-12 md:py-7">
      <div className="flex w-full max-w-6xl animate-in flex-col space-y-3 duration-500 fade-in slide-in-from-bottom-4 sm:space-y-6">
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between gap-3 px-1 sm:px-0">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-9 w-9 shrink-0 rounded-full hover:bg-accent hover:text-accent-foreground sm:h-10 sm:w-10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex sm:h-11 sm:w-11">
                <PenTool className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-lg font-extrabold tracking-tight text-foreground sm:text-3xl">
                  Study Notes
                </h1>
                <p className="mt-0.5 hidden text-xs font-medium text-muted-foreground sm:block sm:text-sm">
                  Organize, edit, and review your study materials.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile drawer trigger for folders/tags */}
          <div className="flex shrink-0 items-center lg:hidden">
            <Sheet
              open={isMobileSidebarOpen}
              onOpenChange={setIsMobileSidebarOpen}
            >
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 border-border text-xs shadow-none"
                >
                  <Menu className="h-3.5 w-3.5" />
                  <span className="xs:inline hidden">Folders & Tags</span>
                  <span className="xs:hidden">Browse</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[85vw] max-w-72 overflow-y-auto bg-card p-6"
              >
                <SheetTitle className="mb-4 text-base font-bold">
                  Workspace Filters
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Manage and filter your study notes by folders and tags.
                </SheetDescription>
                {renderSidebarContent()}
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Workspace Card */}
        <Card className="flex h-[calc(100dvh-8.5rem)] min-h-dvh flex-col overflow-hidden rounded-lg border border-border bg-card/40 shadow-md backdrop-blur-sm sm:h-[calc(100dvh-12rem)] sm:min-h-150 sm:rounded-2xl">
          <CardContent className="flex min-h-0 flex-1 flex-col gap-0 p-0 lg:flex-row">
            {/* COLUMN 1: Desktop Sidebar (Folders & Tags) */}
            <aside
              className={cn(
                "hidden shrink-0 flex-col overflow-y-auto border-border py-5 transition-all duration-300 ease-in-out lg:flex",
                isSidebarCollapsed
                  ? "lg:w-0 lg:overflow-hidden lg:border-r-0 lg:py-0"
                  : "lg:w-60 lg:border-r"
              )}
            >
              <div
                className={cn(
                  "transition-opacity duration-300",
                  isSidebarCollapsed && "lg:pointer-events-none lg:opacity-0"
                )}
              >
                {renderSidebarContent()}
              </div>
            </aside>

            {/* Inner Flex columns 2 and 3 */}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col sm:flex-row">
              {/* COLUMN 2: Notes List */}
              <div
                className={cn(
                  "flex min-h-0 w-full flex-col border-border bg-card/20 sm:w-64 sm:shrink-0 sm:border-r sm:border-b-0",
                  // On mobile, hide list view if mobileView is set to 'editor'
                  mobileView === "editor" ? "hidden sm:flex" : "flex"
                )}
              >
                <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2.5 sm:px-4 sm:py-1.5">
                  <div className="flex min-w-0 flex-1 items-center gap-1">
                    {isSidebarCollapsed && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setIsSidebarCollapsed(!isSidebarCollapsed)
                        }
                        className="hidden h-8 w-8 shrink-0 text-muted-foreground hover:bg-accent hover:text-accent-foreground lg:flex"
                        title={
                          isSidebarCollapsed
                            ? "Expand Sidebar"
                            : "Collapse Sidebar"
                        }
                      >
                        <PanelLeftOpen className="h-4 w-4" />
                      </Button>
                    )}
                    <div className="relative flex-1">
                      <Search className="absolute top-2.5 left-2.5 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Search notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-8 rounded-md border-border bg-background pl-8 text-sm shadow-none focus-visible:ring-1 focus-visible:ring-ring"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute top-2 right-2 rounded-full p-0.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleInitNewNote}
                    className="h-8 w-8 shrink-0 text-foreground hover:bg-accent hover:text-accent-foreground"
                    title="New note"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                  {filteredNotes.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
                      <FileText className="h-8 w-8 text-muted-foreground/30" />
                      <p className="text-sm font-medium text-muted-foreground">
                        {searchQuery || activeFilterTag !== "All"
                          ? "No notes match"
                          : "No notes yet"}
                      </p>
                      {!searchQuery && activeFilterTag === "All" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleInitNewNote}
                          className="mt-1 gap-1 text-xs text-primary hover:bg-primary/10 hover:text-primary"
                        >
                          <Plus className="h-3.5 w-3.5" /> Create one
                        </Button>
                      )}
                    </div>
                  ) : (
                    filteredNotes.map((note) => {
                      const isCurrent =
                        selectedNote?.id === note.id && !isEditing
                      const plainTextPreview = note.content
                        .replace(/<[^>]+>/g, "")
                        .substring(0, 60)
                      const noteDate = new Date(note.created_at)
                      const timeString = format(noteDate, "h:mm a")

                      return (
                        <div
                          key={note.id}
                          onClick={() => handleSelectNote(note)}
                          className={cn(
                            "group relative mb-1 cursor-pointer rounded-lg px-3 py-2.5 text-left transition-all duration-150",
                            isCurrent
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "hover:bg-accent hover:text-accent-foreground active:scale-[0.99]"
                          )}
                        >
                          <h4
                            className={cn(
                              "truncate pr-5 text-sm leading-tight font-semibold",
                              isCurrent
                                ? "text-primary-foreground"
                                : "text-foreground"
                            )}
                          >
                            {note.title || "New Note"}
                          </h4>
                          <div
                            className={cn(
                              "mt-1 flex items-center gap-2 text-xs",
                              isCurrent
                                ? "text-primary-foreground/80"
                                : "text-muted-foreground"
                            )}
                          >
                            <span className="shrink-0">{timeString}</span>
                            <span className="truncate">
                              {plainTextPreview || "No additional text"}
                            </span>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* COLUMN 3: Editor */}
              <div
                className={cn(
                  "flex min-h-0 min-w-0 flex-1 flex-col bg-card/10",
                  // On mobile, hide editor view if mobileView is set to 'list' and no note is selected/editing
                  mobileView === "list" ? "hidden sm:flex" : "flex"
                )}
              >
                {/* Editor Toolbar */}
                <div className="flex min-h-14 shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2 sm:px-5">
                  <div className="flex items-center gap-2">
                    {/* Mobile Back to List button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMobileView("list")}
                      className="gap-1 pl-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground sm:hidden"
                    >
                      <ChevronLeft className="h-4 w-4" /> Notes
                    </Button>

                    {hasAvailableDraft && !isEditing && (
                      <Button
                        onClick={loadDraft}
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-xs text-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        <SaveAll className="h-3.5 w-3.5" /> Restore Draft
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2">
                    {selectedNote && !isEditing && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleDelete(selectedNote.id, e)}
                        className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        title="Delete note"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}

                    {!isEditing && selectedNote && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setIsEditing(true)
                          setWorkspaceMode("edit")
                        }}
                        className="h-8 w-8 text-foreground hover:bg-accent hover:text-accent-foreground"
                        title="Edit note"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    )}

                    {isEditing && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleSaveNote}
                        disabled={
                          isSubmitting || (!title.trim() && !content.trim())
                        }
                        className="gap-1.5 font-semibold shadow-sm"
                      >
                        {isSubmitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Done"
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Editor Content area */}
                <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-3 md:px-10">
                  <div className="mb-5 text-center text-xs font-medium text-muted-foreground sm:mb-6">
                    {selectedNote
                      ? format(
                          new Date(selectedNote.created_at),
                          "MMMM d, yyyy 'at' h:mm a"
                        )
                      : format(new Date(), "MMMM d, yyyy 'at' h:mm a")}

                    {isEditing && draftSavedAt && (
                      <span className="ml-2 inline-flex items-center gap-1 text-muted-foreground">
                        · Draft saved {format(draftSavedAt, "h:mm a")}
                      </span>
                    )}
                  </div>

                  {isEditing ? (
                    <form
                      id="note-form"
                      onSubmit={handleSaveNote}
                      className="mx-auto flex h-full max-w-3xl flex-col"
                    >
                      <div className="mb-4 flex flex-wrap items-center gap-2 sm:mb-6 sm:gap-3">
                        <Select
                          value={selectedFolderId || "none"}
                          onValueChange={(v) =>
                            setSelectedFolderId(v === "none" ? null : v)
                          }
                        >
                          <SelectTrigger className="h-8 w-auto min-w-[110px] border-border bg-background text-xs shadow-none focus:ring-0">
                            <SelectValue placeholder="Folder" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No Folder</SelectItem>
                            {folders.map((f) => (
                              <SelectItem key={f.id} value={f.id}>
                                {f.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={selectedTag}
                          onValueChange={setSelectedTag}
                        >
                          <SelectTrigger className="h-8 w-auto min-w-[110px] border-border bg-background text-xs shadow-none focus:ring-0">
                            <SelectValue placeholder="Tag" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((c) => (
                              <SelectItem key={c.id} value={c.name}>
                                #{c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Input
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mb-3 h-auto border-none bg-transparent p-2 text-xl font-bold shadow-none placeholder:text-muted-foreground/40 focus-visible:ring-0 sm:mb-4 sm:text-3xl"
                        required
                      />

                      <div className="flex-1 pb-12">
                        <RichTextEditor value={content} onChange={setContent} />
                      </div>
                    </form>
                  ) : (
                    <div className="mx-auto flex h-full max-w-3xl flex-col">
                      {selectedNote ? (
                        <>
                          <div className="mb-4 flex flex-wrap items-center gap-2 sm:mb-5">
                            {selectedNote.tag && (
                              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                                #{selectedNote.tag}
                              </span>
                            )}
                            {selectedNote.folder_id && (
                              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                <Folder className="h-3 w-3" />
                                {
                                  folders.find(
                                    (f) => f.id === selectedNote.folder_id
                                  )?.name
                                }
                              </span>
                            )}
                          </div>
                          <h1 className="mb-4 text-xl font-bold tracking-tight text-foreground sm:text-3xl">
                            {selectedNote.title}
                          </h1>
                          <div className="apple-notes-preview pb-20 text-[15px] leading-relaxed text-foreground">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: selectedNote.content,
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          <div className="text-center">
                            <Edit3 className="mx-auto mb-3 h-10 w-10 opacity-20" />
                            <p className="text-sm font-medium">
                              Select a note or create a new one.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style>{`
        .apple-notes-preview h1 { font-size: 1.5rem; font-weight: 700; margin-top: 1.25rem; margin-bottom: 0.5rem; }
        .apple-notes-preview h2 { font-size: 1.3rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem; }
        .apple-notes-preview h3 { font-size: 1.1rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem; }
        .apple-notes-preview p { margin-bottom: 1rem; line-height: 1.6; }
        .apple-notes-preview ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
        .apple-notes-preview ol { list-style: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
        .apple-notes-preview li { margin-bottom: 0.25rem; }
        .apple-notes-preview strong { font-weight: 600; }
        .apple-notes-preview blockquote { border-left: 3px solid hsl(var(--border)); padding-left: 1rem; color: hsl(var(--muted-foreground)); }
        .apple-notes-preview code { font-family: ui-monospace, monospace; background: hsl(var(--muted)); padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.9em; }
        .apple-notes-preview pre { background: hsl(var(--muted)/0.5); padding: 1rem; border-radius: 8px; overflow-x: auto; margin-bottom: 1rem; }
        .apple-notes-preview pre code { background: transparent; padding: 0; }
      `}</style>
    </div>
  )
}
