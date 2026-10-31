import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type { FormEvent } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export function Auth() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleEmailAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isLoading) return

    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail || !password) {
      setError("Enter both your email address and password.")
      return
    }
    if (isSignUp && password.length < 6) {
      setError("Your password must contain at least 6 characters.")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            // The app uses HashRouter, so return to the app origin after confirmation.
            emailRedirectTo: window.location.origin,
          },
        })
        if (signUpError) throw signUpError

        if (data.session) {
          navigate("/", { replace: true })
        } else {
          setSuccess(
            "Account created. Check your inbox (and spam folder) for the confirmation link before signing in."
          )
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        })
        if (signInError) throw signInError
        // AuthProvider receives the Supabase auth event; send the user to the dashboard.
        navigate("/", { replace: true })
      }
    } catch (cause: unknown) {
      const message =
        cause instanceof Error ? cause.message : "Authentication failed. Please try again."
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGithubLogin = async () => {
    setError(null)
    setSuccess(null)
    setIsLoading(true)
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: { redirectTo: window.location.origin },
      })
      if (oauthError) throw oauthError
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : "GitHub sign-in failed.")
      setIsLoading(false)
    }
  }

  const switchMode = () => {
    setIsSignUp((current) => !current)
    setError(null)
    setSuccess(null)
  }

  return (
    <div className="kaizen-desktop flex min-h-screen items-center justify-center p-4">
      <Card className="kaizen-auth-window w-full max-w-100 overflow-hidden border-border/50 shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome to Kaizen
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? "Create an account to save your progress"
              : "Sign in to track your habits and daily wins"}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            variant="outline"
            onClick={handleGithubLogin}
            disabled={isLoading}
            className="w-full gap-2 font-medium"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Continue with GitHub
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                minLength={isSignUp ? 6 : undefined}
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div role="alert" className="text-center text-sm font-medium text-destructive">
                {error}
              </div>
            )}
            {success && (
              <div role="status" className="text-center text-sm font-medium text-emerald-600">
                {success}
              </div>
            )}

            <Button disabled={isLoading} type="submit" className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={switchMode}
              disabled={isLoading}
              className="font-medium text-primary hover:underline disabled:opacity-50"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
