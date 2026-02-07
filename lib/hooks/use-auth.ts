import { useState, useCallback } from "react"
import { apiClient } from "@/lib/api/client"

interface User {
  id: string
  email: string
  name: string
  tenantId: string
  role: string
}

interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

interface SignInData {
  email: string
  password: string
  rememberMe?: boolean
}

interface SignUpData {
  name: string
  email: string
  password: string
  companyName: string
}

interface AuthResponse {
  user: User
  tokens: AuthTokens
}

// Simple store for auth state (in production, use Zustand or Context)
let authState: {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
} = {
  user: null,
  tokens: null,
  isAuthenticated: false,
}

const listeners = new Set<() => void>()

function notifyListeners() {
  listeners.forEach((fn) => fn())
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [, setTick] = useState(0) // Force re-render

  // Subscribe to auth changes
  useState(() => {
    const listener = () => setTick((t) => t + 1)
    listeners.add(listener)
    return () => listeners.delete(listener)
  })

  const signIn = useCallback(async (data: SignInData) => {
    setIsLoading(true)
    try {
      const response = await apiClient.post<{
        success: boolean
        data: AuthResponse
        error?: { code: string; message: string }
      }>("/auth/sign-in", data)

      if (!response.data.success) {
        throw new Error(response.data.error?.message || "Sign in failed")
      }

      const { user, tokens } = response.data.data

      // Store tokens
      localStorage.setItem("accessToken", tokens.accessToken)
      localStorage.setItem("refreshToken", tokens.refreshToken)
      localStorage.setItem("tenantId", user.tenantId)

      // Update state
      authState = {
        user,
        tokens,
        isAuthenticated: true,
      }
      notifyListeners()

      return response.data.data
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signUp = useCallback(async (data: SignUpData) => {
    setIsLoading(true)
    try {
      const response = await apiClient.post<{
        success: boolean
        data: AuthResponse
        error?: { code: string; message: string }
      }>("/auth/sign-up", {
        ...data,
        tier: "standard", // Default tier
      })

      if (!response.data.success) {
        throw new Error(response.data.error?.message || "Sign up failed")
      }

      const { user, tokens } = response.data.data

      // Store tokens
      localStorage.setItem("accessToken", tokens.accessToken)
      localStorage.setItem("refreshToken", tokens.refreshToken)
      localStorage.setItem("tenantId", user.tenantId)

      // Update state
      authState = {
        user,
        tokens,
        isAuthenticated: true,
      }
      notifyListeners()

      return response.data.data
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      await apiClient.post("/auth/sign-out")
    } finally {
      // Clear storage
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("tenantId")

      // Reset state
      authState = {
        user: null,
        tokens: null,
        isAuthenticated: false,
      }
      notifyListeners()
    }
  }, [])

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading,
    signIn,
    signUp,
    signOut,
  }
}
