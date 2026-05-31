import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

export function ProtectedRoute() {
  const { session } = useAuth()

  // If there is no logged-in user, redirect them to the Auth page
  if (!session) {
    return <Navigate to="/login" replace />
  }

  // Otherwise, let them see the child components (your dashboard)
  return <Outlet />
}
