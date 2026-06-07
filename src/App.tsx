import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContext"
import { GamificationProvider } from "@/contexts/GamificationContext"
import { ProtectedRoute } from "@/components/shared/Routes/ProtectedRoute"
import { Auth } from "@/components/shared/Auth/Auth"
import KaizenTracker from "./components/shared/Views/Kaizen"

export function App() {
  return (
    <AuthProvider>
      <GamificationProvider>
        <Router>
          <Routes>
            {/* Public Route - The Login Page */}
            <Route path="/login" element={<Auth />} />

            {/* Protected Routes - Only accessible if logged in */}
            <Route element={<ProtectedRoute />}>
              {/* Your main app is now locked securely inside this block */}
              <Route path="/" element={<KaizenTracker />} />

              {/* Future routes (like /finance) will go right here! */}
            </Route>

            {/* Catch-all: If a user types a random URL, send them back to the dashboard (or login) */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </GamificationProvider>
    </AuthProvider>
  )
}

export default App
