import { Configuration } from '@/src/generated/api/configuration'
import { AuthApi } from '@/src/generated/api/api'
import type { SignInDto, SignUpDto, RefreshTokenDto } from '@/src/generated/api/api'

// Cookie utilities for auth tokens
export const authCookies = {
  getAccessToken(): string | null {
    return this.getCookie('accessToken')
  },

  getRefreshToken(): string | null {
    return this.getCookie('refreshToken')
  },

  getTenantId(): string | null {
    return this.getCookie('tenantId')
  },

  setTokens(accessToken: string, refreshToken: string, tenantId: string) {
    // 7 days for access token, 30 days for refresh
    this.setCookie('accessToken', accessToken, 7)
    this.setCookie('refreshToken', refreshToken, 30)
    this.setCookie('tenantId', tenantId, 7)
  },

  clearTokens() {
    this.deleteCookie('accessToken')
    this.deleteCookie('refreshToken')
    this.deleteCookie('tenantId')
  },

  // Helper methods
  getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null
    return null
  },

  setCookie(name: string, value: string, days: number) {
    if (typeof document === 'undefined') return
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Strict`
  },

  deleteCookie(name: string) {
    if (typeof document === 'undefined') return
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
  },
}

// API Client wrapper that handles authentication
export class ApiClient {
  private authApi!: AuthApi
  private configuration: Configuration

  constructor() {
    this.configuration = this.getConfig()
    this.initializeApis()
  }

  private getApiUrl(): string {
    const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    return raw.replace(/\/+$/, '')
  }

  private getConfig(): Configuration {
    const apiUrl = this.getApiUrl()
    const jwt = authCookies.getAccessToken()
    const tenantId = authCookies.getTenantId()

    const config = new Configuration({
      basePath: apiUrl,
      accessToken: jwt || undefined,
    })

    if (jwt) {
      config.baseOptions = {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
          ...(tenantId && { 'X-Tenant-ID': tenantId }),
        },
      }
    }

    return config
  }

  private initializeApis() {
    this.authApi = new AuthApi(this.configuration)
  }

  // Call this after login/logout to refresh API instances with new token
  refreshConfiguration() {
    this.configuration = this.getConfig()
    this.initializeApis()
  }

  // Get API instances
  get auth() {
    return this.authApi
  }

  // Auth helpers
  async signIn(data: SignInDto) {
    const response = await this.auth.authControllerSignIn(data)
    const responseData = response.data as any
    const { user, tokens } = responseData.data || responseData

    // Store in cookies
    authCookies.setTokens(tokens.accessToken, tokens.refreshToken, user.tenantId)

    // Refresh config with new token
    this.refreshConfiguration()

    return { user, tokens }
  }

  async signUp(data: SignUpDto) {
    const response = await this.auth.authControllerSignUp(data)
    const responseData = response.data as any
    const { user, tokens } = responseData.data || responseData

    // Store in cookies
    authCookies.setTokens(tokens.accessToken, tokens.refreshToken, user.tenantId)

    // Refresh config with new token
    this.refreshConfiguration()

    return { user, tokens }
  }

  async signOut() {
    try {
      await this.auth.authControllerSignOut()
    } finally {
      authCookies.clearTokens()
      this.refreshConfiguration()
    }
  }

  async refreshToken() {
    const refreshToken = authCookies.getRefreshToken()
    if (!refreshToken) throw new Error('No refresh token')

    const response = await this.auth.authControllerRefresh({ refreshToken })
    const responseData = response.data as any
    const { accessToken } = responseData.data || responseData

    const tenantId = authCookies.getTenantId() || ''
    const currentRefresh = authCookies.getRefreshToken() || ''

    // Update access token cookie only
    authCookies.setTokens(accessToken, currentRefresh, tenantId)

    // Refresh config
    this.refreshConfiguration()

    return { accessToken }
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return !!authCookies.getAccessToken()
  }

  // Get current token info
  getTokenInfo() {
    return {
      accessToken: authCookies.getAccessToken(),
      refreshToken: authCookies.getRefreshToken(),
      tenantId: authCookies.getTenantId(),
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Re-export types
export type { SignInDto, SignUpDto, RefreshTokenDto }
