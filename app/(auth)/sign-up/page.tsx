"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Zap, Eye, EyeOff, Loader2, Check } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"

export default function SignUpPage() {
  const router = useRouter()
  const { signUp, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  const [error, setError] = useState("")

  const passwordStrength = () => {
    const { password } = formData
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (passwordStrength() < 3) {
      setError("Password must be at least 8 characters with uppercase, number, and special character")
      return
    }

    try {
      await signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        companyName: formData.companyName,
      })
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed")
    }
  }

  const strength = passwordStrength()
  const strengthLabels = ["Weak", "Fair", "Good", "Strong", "Very Strong"]
  const strengthColors = ["bg-destructive", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-green-600"]

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
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold text-foreground">Create an account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Get started with your data integration platform
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                Full name
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-foreground mb-1.5">
                Company
              </label>
              <input
                id="company"
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Acme Corp"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {formData.password && (
              <div className="mt-2">
                <div className="flex gap-1 h-1.5 mb-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full ${i < strength ? strengthColors[strength - 1] : "bg-muted"}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {strengthLabels[strength]} • Use 8+ chars with uppercase, number & symbol
                </p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1.5">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••••"
            />
          </div>

          <label className="flex items-start gap-2 text-sm text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              required
              checked={formData.agreeToTerms}
              onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
              className="mt-0.5 rounded border-input h-4 w-4"
            />
            <span>
              I agree to the{" "}
              <a href="#" className="text-primary hover:text-primary/80">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-primary hover:text-primary/80">Privacy Policy</a>
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary hover:text-primary/80 transition-colors font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
