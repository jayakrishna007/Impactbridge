"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, UserPlus, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { useAuth, UserRole, getDashboardPath } from "@/lib/auth-context"

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole | "">("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name || !email || !password || !role) {
      setError("Please fill in all fields and select a role.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setIsLoading(true)

    // Simulate registration delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Save to backend (falls back to localStorage if backend is offline)
    const result = await login(name, email, role as UserRole)

    setIsLoading(false)

    if (result.error) {
      setError(result.error)
      return
    }

    setIsSuccess(true)

    // Redirect to their dashboard after a short delay
    setTimeout(() => {
      router.push(getDashboardPath(role as UserRole, result.hasProfile))
    }, 1000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-primary-foreground">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              ImpactBridge
            </span>
          </Link>
          <h1
            className="text-2xl font-bold tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Create your account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Join the platform and start making an impact
          </p>
        </div>

        <Card className="border-border bg-card shadow-lg">
          <CardContent className="flex flex-col gap-6 p-6">
            {isSuccess ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 animate-in zoom-in duration-300">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                    Account Created!
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Welcome aboard, {name}! Redirecting to dashboard...
                  </p>
                </div>
              </div>
            ) : (
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {error && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <Label htmlFor="role">I am a...</Label>
                  <Select value={role} onValueChange={(val) => setRole(val as UserRole)}>
                    <SelectTrigger id="role" className="transition-all focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ngo">NGO</SelectItem>
                      <SelectItem value="funder">CSR Funder</SelectItem>
                      <SelectItem value="beneficiary">Beneficiary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Full Name or Organization Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    className="transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="reg-email">Email Address</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      className="pr-10 transition-all focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
                </div>

                <Button className="w-full gap-2 mt-2" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>
            )}

            {!isSuccess && (
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
