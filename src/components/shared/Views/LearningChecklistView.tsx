import { useMemo, useState } from "react"
import { ArrowLeft, BookOpen, CheckCircle2, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useLearningChecklist, type LearningChecklistItem } from "@/hooks/useLearningChecklist"

type Props = { onBack: () => void }
type Filter = "all" | "pending" | "completed"
export function LearningChecklistView({ onBack }: Props) {
  const { items, categories, isLoading, errorMessage, createItem, updateItem, deleteItem, addCategory } = useLearningChecklist()
  const [selected, setSelected] = useState("All")
  const [filter, setFilter] = useState<Filter>("all")
  const [search, setSearch] = useState("")
  const [dialog, setDialog] = useState(false)
  const [categoryDialog, setCategoryDialog] = useState(false)
  const [editing, setEditing] = useState<LearningChecklistItem | null>(null)
  const [deleting, setDeleting] = useState<LearningChecklistItem | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("DSA")
  const [newCategory, setNewCategory] = useState("")
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const completed = items.filter(item => item.is_completed).length
  const progress = items.length ? Math.round(completed / items.length * 100) : 0
  const visible = useMemo(() => items.filter(item =>
    (selected === "All" || item.category === selected) &&
    (filter === "all" || (filter === "completed" ? item.is_completed : !item.is_completed)) &&
    (!search.trim() || `${item.title} ${item.description}`.toLowerCase().includes(search.trim().toLowerCase()))
  ), [items, selected, filter, search])
  const openCreate = (cat = selected === "All" ? (categories[0] ?? "DSA") : selected) => {
    setEditing(null); setTitle(""); setDescription(""); setCategory(cat); setActionError(null); setDialog(true)
  }
  const openEdit = (item: LearningChecklistItem) => {
    setEditing(item); setTitle(item.title); setDescription(item.description ?? ""); setCategory(item.category); setActionError(null); setDialog(true)
  }
  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!title.trim()) return
    setSaving(true); setActionError(null)
    const result = editing
      ? await updateItem(editing.id, { title: title.trim(), description: description.trim(), category })
      : await createItem({ title: title.trim(), description: description.trim(), category, sort_order: items.length })
    setSaving(false)
    if (result.error) { setActionError(result.error); return }
    setDialog(false)
  }
  const remove = async () => {
    if (!deleting) return
    setSaving(true); const result = await deleteItem(deleting.id); setSaving(false)
    if (result.error) { setActionError(result.error); return }
    setDeleting(null); setActionError(null)
  }
  const addNewCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!newCategory.trim()) return
    setSaving(true); setActionError(null)
    const result = await addCategory(newCategory); setSaving(false)
    if (result.error) { setActionError(result.error); return }
    setSelected(newCategory.trim()); setCategory(newCategory.trim()); setNewCategory(""); setCategoryDialog(false)
  }
  return <main className="min-h-screen bg-background/50 px-3 py-6 text-foreground sm:px-6 sm:py-9">
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-col gap-4 border-b border-border/40 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3"><Button variant="ghost" size="icon" onClick={onBack} aria-label="Back to dashboard"><ArrowLeft className="h-4 w-4" /></Button><div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Learning workspace</p>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Learning checklist</h1>
          <p className="mt-1 text-sm text-muted-foreground">Make progress visible. Keep showing up.</p>
        </div></div>
        <div className="flex gap-2 pl-12 sm:pl-0"><Button variant="outline" className="gap-2 rounded-xl" onClick={() => { setActionError(null); setCategoryDialog(true) }}><Plus className="h-4 w-4" /> Category</Button><Button className="gap-2 rounded-xl" onClick={() => openCreate()}><Plus className="h-4 w-4" /> Add task</Button></div>
      </header>
      {actionError && <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{actionError}</div>}
      <section className="grid gap-4 sm:grid-cols-2">
        <Card className="border-border/50 bg-card/70"><CardContent className="p-5"><p className="text-sm text-muted-foreground">Overall progress</p><div className="mt-1 text-4xl font-black">{progress}%</div><div className="mt-4 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div><p className="mt-2 text-xs text-muted-foreground">{completed} of {items.length} tasks complete · {items.length - completed} remaining</p></CardContent></Card>
        <Card className="border-border/50 bg-card/70"><CardContent className="flex h-full items-center gap-4 p-5"><div className="rounded-2xl bg-primary/10 p-3 text-primary"><CheckCircle2 className="h-6 w-6" /></div><div><p className="text-sm text-muted-foreground">Learning areas</p><p className="text-2xl font-bold">{categories.length}</p><p className="text-xs text-muted-foreground">Your plan, editable as you grow.</p></div></CardContent></Card>
      </section>
      <div className="flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search your learning plan..." className="rounded-xl pl-9" /></div><div className="flex gap-1 rounded-xl border border-border/50 p-1">{(["all","pending","completed"] as Filter[]).map(value => <Button key={value} size="sm" variant={filter === value ? "secondary" : "ghost"} className="rounded-lg capitalize" onClick={() => setFilter(value)}>{value === "all" ? "All tasks" : value}</Button>)}</div></div>
      <div className="flex gap-2 overflow-x-auto pb-1">{["All",...categories].map(value => { const count = items.filter(i => value === "All" || i.category === value); return <button key={value} onClick={() => setSelected(value)} className={cn("shrink-0 rounded-xl border px-3 py-2 text-left", selected === value ? "border-primary/40 bg-primary/10 text-primary" : "border-border/50 bg-card/50 text-muted-foreground")}><span className="block text-sm font-semibold">{value}</span><span className="text-[11px] opacity-80">{count.filter(i => i.is_completed).length}/{count.length} complete</span></button> })}</div>
      {isLoading ? <div className="flex min-h-52 items-center justify-center gap-3 text-sm text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /> Loading your checklist…</div> : errorMessage ? <Card className="border-destructive/30"><CardContent className="space-y-2 p-5"><h2 className="font-semibold">Could not load your checklist</h2><p className="text-sm text-muted-foreground">{errorMessage}</p><p className="text-sm text-muted-foreground">Run <code>supabase/learning_checklist.sql</code> in your Supabase SQL Editor first.</p></CardContent></Card> : visible.length === 0 ? <Card className="border-dashed"><CardContent className="flex flex-col items-center gap-3 p-10 text-center"><BookOpen className="h-7 w-7 text-muted-foreground" /><h2 className="font-semibold">Nothing here yet</h2><p className="text-sm text-muted-foreground">Try another filter or add a task.</p><Button onClick={() => openCreate()}><Plus className="mr-2 h-4 w-4" />Add task</Button></CardContent></Card> :
        <div className="space-y-5">{categories.filter(cat => selected === "All" || cat === selected).map(cat => { const section = visible.filter(item => item.category === cat).sort((a,b) => a.sort_order - b.sort_order); if (!section.length) return null; const done = section.filter(item => item.is_completed).length; return <section key={cat} className="overflow-hidden rounded-2xl border border-border/50 bg-card/60"><div className="flex items-center justify-between gap-3 border-b border-border/40 px-4 py-4"><div><h2 className="font-bold">{cat}</h2><p className="text-xs text-muted-foreground">{done}/{section.length} complete</p></div><Button size="sm" variant="ghost" className="gap-1" onClick={() => openCreate(cat)}><Plus className="h-4 w-4" /> Add</Button></div><div className="divide-y divide-border/30">{section.map(item => <div key={item.id} className="group flex items-start gap-3 px-4 py-3"><Checkbox checked={item.is_completed} onCheckedChange={async checked => { const result = await updateItem(item.id, { is_completed: checked === true }); if (result.error) setActionError(result.error); else setActionError(null) }} className="mt-1" aria-label={item.is_completed ? "Mark incomplete" : "Mark complete"} /><div className="min-w-0 flex-1"><button onClick={() => openEdit(item)} className={cn("text-left text-sm font-medium leading-relaxed", item.is_completed && "text-muted-foreground line-through")}>{item.title}</button>{item.description && <p className="mt-1 whitespace-pre-wrap text-xs text-muted-foreground">{item.description}</p>}</div><div className="flex shrink-0"><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)} aria-label="Edit task"><Pencil className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => { setDeleting(item); setActionError(null) }} aria-label="Delete task"><Trash2 className="h-3.5 w-3.5" /></Button></div></div>)}</div></section> })}</div>}
      <p className="pb-8 text-center text-xs text-muted-foreground">A little better every day. Progress is saved to your account.</p>
    </div>
    <Dialog open={dialog} onOpenChange={open => { if (!saving) setDialog(open) }}><DialogContent className="sm:max-w-lg"><DialogHeader><DialogTitle>{editing ? "Edit learning task" : "Add learning task"}</DialogTitle><DialogDescription>Keep a task clear, actionable, and easy to revisit.</DialogDescription></DialogHeader><form onSubmit={save} className="space-y-4"><div className="grid gap-2"><Label htmlFor="learning-title">Task title</Label><Input id="learning-title" value={title} onChange={e => setTitle(e.target.value)} required maxLength={240} placeholder="e.g. Practice binary search" /></div><div className="grid gap-2"><Label htmlFor="learning-category">Category</Label><select id="learning-category" value={category} onChange={e => setCategory(e.target.value)} className="h-10 rounded-xl border border-input bg-background px-3 text-sm">{[...new Set([...categories,category])].map(c => <option key={c} value={c}>{c}</option>)}</select></div><div className="grid gap-2"><Label htmlFor="learning-description">Notes (optional)</Label><Textarea id="learning-description" value={description} onChange={e => setDescription(e.target.value)} rows={4} maxLength={2000} placeholder="Add context, links, or what you want to remember…" /></div>{actionError && <p role="alert" className="text-sm text-destructive">{actionError}</p>}<DialogFooter><Button type="button" variant="ghost" onClick={() => setDialog(false)} disabled={saving}>Cancel</Button><Button type="submit" disabled={!title.trim() || saving}>{saving ? "Saving…" : editing ? "Save changes" : "Create task"}</Button></DialogFooter></form></DialogContent></Dialog>
    <Dialog open={categoryDialog} onOpenChange={open => { if (!saving) setCategoryDialog(open) }}><DialogContent className="sm:max-w-md"><DialogHeader><DialogTitle>Add a category</DialogTitle><DialogDescription>A new category starts with a task you can edit or delete.</DialogDescription></DialogHeader><form onSubmit={addNewCategory} className="space-y-4"><div className="grid gap-2"><Label htmlFor="new-learning-category">Category name</Label><Input id="new-learning-category" value={newCategory} onChange={e => setNewCategory(e.target.value)} required maxLength={80} placeholder="e.g. System Design" /></div>{actionError && <p role="alert" className="text-sm text-destructive">{actionError}</p>}<DialogFooter><Button type="button" variant="ghost" onClick={() => setCategoryDialog(false)} disabled={saving}>Cancel</Button><Button type="submit" disabled={!newCategory.trim() || saving}>{saving ? "Adding…" : "Create category"}</Button></DialogFooter></form></DialogContent></Dialog>
    <Dialog open={!!deleting} onOpenChange={open => { if (!saving && !open) setDeleting(null) }}><DialogContent className="sm:max-w-md"><DialogHeader><DialogTitle>Delete this task?</DialogTitle><DialogDescription>This will permanently remove “{deleting?.title}” from your checklist.</DialogDescription></DialogHeader>{actionError && <p role="alert" className="text-sm text-destructive">{actionError}</p>}<DialogFooter><Button variant="ghost" onClick={() => setDeleting(null)} disabled={saving}>Cancel</Button><Button variant="destructive" onClick={() => void remove()} disabled={saving}>{saving ? "Deleting…" : "Delete task"}</Button></DialogFooter></DialogContent></Dialog>
  </main>
}
