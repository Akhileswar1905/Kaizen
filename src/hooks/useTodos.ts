import { useCallback, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export interface Todo {
  id: string
  title: string
  description: string
  completed: boolean
  date: string // ISO date string, "yyyy-MM-dd"
}

interface TodoRow {
  id: string
  user_id: string
  title: string
  description: string | null
  completed: boolean
  date: string
  created_at: string
}

function rowToTodo(row: TodoRow): Todo {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    completed: row.completed,
    date: row.date,
  }
}

/**
 * Loads and mutates the signed-in user's todos in Supabase.
 *
 * Expects a `daily_todos` table:
 *   id           uuid        primary key default gen_random_uuid()
 *   user_id      uuid        references auth.users(id) not null
 *   title        text        not null
 *   description  text
 *   completed    boolean     not null default false
 *   date         date        not null
 *   created_at   timestamptz not null default now()
 *
 * With row level security enabled and policies restricting all
 * operations to `auth.uid() = user_id`, e.g.:
 *
 *   alter table todos enable row level security;
 *
 *   create policy "Users manage their own todos"
 *     on todos for all
 *     using (auth.uid() = user_id)
 *     with check (auth.uid() = user_id);
 */
export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function init() {
      setLoading(true)
      setError(null)

      const { data: authData, error: authError } = await supabase.auth.getUser()

      if (!active) return

      if (authError || !authData.user) {
        setError("Sign in to see your tasks.")
        setLoading(false)
        return
      }

      setUserId(authData.user.id)

      const { data, error: fetchError } = await supabase
        .from("daily_todos")
        .select("*")
        .eq("user_id", authData.user.id)
        .order("date", { ascending: true })
        .order("created_at", { ascending: true })

      if (!active) return

      if (fetchError) {
        setError(fetchError.message)
      } else {
        setTodos((data as TodoRow[]).map(rowToTodo))
      }
      setLoading(false)
    }

    init()

    // Keep in sync across tabs/devices.
    const channel = supabase
      .channel("todos-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "daily_todos" },
        (payload) => {
          setTodos((current) => {
            if (payload.eventType === "INSERT") {
              const row = payload.new as TodoRow
              if (current.some((t) => t.id === row.id)) return current
              return [...current, rowToTodo(row)]
            }
            if (payload.eventType === "UPDATE") {
              const row = payload.new as TodoRow
              return current.map((t) => (t.id === row.id ? rowToTodo(row) : t))
            }
            if (payload.eventType === "DELETE") {
              const row = payload.old as TodoRow
              return current.filter((t) => t.id !== row.id)
            }
            return current
          })
        }
      )
      .subscribe()

    return () => {
      active = false
      supabase.removeChannel(channel)
    }
  }, [])

  const addTodo = useCallback(
    async (title: string, description: string, date: string) => {
      if (!userId) {
        setError("Sign in to add tasks.")
        return null
      }

      const { data, error: insertError } = await supabase
        .from("daily_todos")
        .insert({ user_id: userId, title, description, date, completed: false })
        .select()
        .single()

      if (insertError) {
        setError(insertError.message)
        return null
      }

      const todo = rowToTodo(data as TodoRow)
      setTodos((current) => [...current, todo])
      return todo
    },
    [userId]
  )

  const toggleTodo = useCallback(async (id: string) => {
    let previous: Todo[] = []
    setTodos((current) => {
      previous = current
      return current.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    })

    const next = !previous.find((t) => t.id === id)?.completed
    const { error: updateError } = await supabase
      .from("daily_todos")
      .update({ completed: next })
      .eq("id", id)

    if (updateError) {
      setError(updateError.message)
      setTodos(previous) // revert on failure
    }
  }, [])

  const updateTodo = useCallback(
    async (id: string, updates: { title: string; description: string }) => {
      let previous: Todo[] = []
      setTodos((current) => {
        previous = current
        return current.map((t) => (t.id === id ? { ...t, ...updates } : t))
      })

      const { error: updateError } = await supabase
        .from("daily_todos")
        .update(updates)
        .eq("id", id)

      if (updateError) {
        setError(updateError.message)
        setTodos(previous) // revert on failure
        return false
      }
      return true
    },
    []
  )

  const deleteTodo = useCallback(async (id: string) => {
    let previous: Todo[] = []
    setTodos((current) => {
      previous = current
      return current.filter((t) => t.id !== id)
    })

    const { error: deleteError } = await supabase
      .from("daily_todos")
      .delete()
      .eq("id", id)

    if (deleteError) {
      setError(deleteError.message)
      setTodos(previous) // revert on failure
    }
  }, [])

  return { todos, loading, error, addTodo, toggleTodo, updateTodo, deleteTodo }
}
