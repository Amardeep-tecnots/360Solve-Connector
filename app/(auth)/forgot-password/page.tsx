"use client"

import { useState } from "react"
import Link from "next/link"
import { Zap, Loader2, Check, ArrowLeft } from "lucide-react"
import { api } from "@/lib/api/client"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await api.post("/auth/forgot-password", { email })
      setIsSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset email")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-foreground">360Solve</span>
            <span className="text-xs text-muted-foreground">Connector</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
        {!isSuccess ? (
          <>
            <div className="text-center mb-6">
              <h1 className="text-xl font-semibold text-foreground">Reset password</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Enter your email and we'll send you a reset link
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="you@company.com"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send reset link"
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Check your email</h2>
            <p className="text-sm text-muted-foreground mb-6">
              We've sent a password reset link to {email}
            </p>
            <Link
              href="/sign-in"
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              Back to sign in
            </Link>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-border">
          <Link
            href="/sign-in"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
