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
    <main className="kaizen-desktop kaizen-auth-page flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-[440px]">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
            <img src="/light_icon.png" alt="Kaizen" className="h-10 w-10 object-contain" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Your personal workspace</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">Welcome to Kaizen</h1>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            {isSignUp ? "Create an account and build a better daily rhythm." : "Sign in to pick up where your progress left off."}
          </p>
        </div>

        <Card className="kaizen-auth-window overflow-hidden border-border/70 shadow-xl">
          <CardHeader className="space-y-1 pb-4 text-center">
            <div className="mx-auto mb-2 inline-flex items-center rounded-full border border-border/70 bg-muted/70 px-3 py-1 text-xs font-semibold text-muted-foreground">
              {isSignUp ? "Create your account" : "Welcome back"}
            </div>
            <CardTitle className="text-xl font-bold tracking-tight">
              {isSignUp ? "Get started" : "Sign in"}
            </CardTitle>
            <CardDescription>
              {isSignUp ? "Your habits, plans and learning progress in one place." : "Continue your habits, plans and learning journey."}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <Button variant="outline" onClick={handleGithubLogin} disabled={isLoading} className="h-11 w-full gap-2 rounded-xl border-border/80 bg-card font-semibold shadow-sm transition-colors hover:bg-muted">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              Continue with GitHub
            </Button>

            <div className="relative flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">or use email</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={handleEmailAuth} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm font-semibold">Email address</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required disabled={isLoading} className="h-11 rounded-xl border-border/80 bg-background/80 px-3 shadow-none focus-visible:ring-2 focus-visible:ring-primary/25" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                <Input id="password" type="password" placeholder={isSignUp ? "At least 6 characters" : "Enter your password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={isSignUp ? "new-password" : "current-password"} minLength={isSignUp ? 6 : undefined} required disabled={isLoading} className="h-11 rounded-xl border-border/80 bg-background/80 px-3 shadow-none focus-visible:ring-2 focus-visible:ring-primary/25" />
              </div>

              {error && <div role="alert" className="rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-sm font-medium text-destructive">{error}</div>}
              {success && <div role="status" className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5 text-sm font-medium text-foreground">{success}</div>}

              <Button disabled={isLoading} type="submit" className="mt-1 h-11 w-full rounded-xl bg-primary font-bold text-primary-foreground shadow-sm transition-opacity hover:opacity-90">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{isSignUp ? "Create account" : "Sign in"}
              </Button>
            </form>

            <div className="border-t border-border/70 pt-4 text-center text-sm">
              <span className="text-muted-foreground">{isSignUp ? "Already have an account?" : "New to Kaizen?"} </span>
              <button type="button" onClick={switchMode} disabled={isLoading} className="font-bold text-primary underline-offset-4 hover:underline disabled:opacity-50">
                {isSignUp ? "Sign in" : "Create an account"}
              </button>
            </div>
          </CardContent>
        </Card>
        <p className="mt-5 text-center text-xs font-medium text-muted-foreground">Small steps. Consistent progress.</p>
      </div>
    </main>
  )
}
