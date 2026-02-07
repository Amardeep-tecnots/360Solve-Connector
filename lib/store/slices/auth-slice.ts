import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiClient, authCookies } from '@/lib/api/api-client'
import type { SignInDto, SignUpDto } from '@/lib/api/api-client'

interface User {
  id: string
  email: string
  name: string
  tenantId: string
  role: string
}

interface Tokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

interface AuthState {
  user: User | null
  tokens: Tokens | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const getStoredAuth = (): Partial<AuthState> => {
  if (typeof window === 'undefined') return {}
  const hasToken = !!authCookies.getAccessToken()
  return {
    isAuthenticated: hasToken,
  }
}

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  ...getStoredAuth(),
}

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (credentials: SignInDto, { rejectWithValue }) => {
    try {
      const { user, tokens } = await apiClient.signIn(credentials)
      return { user, tokens }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message || 'Sign in failed')
    }
  }
)

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (data: SignUpDto, { rejectWithValue }) => {
    try {
      const { user, tokens } = await apiClient.signUp(data)
      return { user, tokens }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message || 'Sign up failed')
    }
  }
)

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.signOut()
      return null
    } catch (error: any) {
      return rejectWithValue(error.message || 'Sign out failed')
    }
  }
)

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const { accessToken } = await apiClient.refreshToken()
      return { accessToken }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Token refresh failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.tokens = action.payload.tokens
        state.isAuthenticated = true
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(signUp.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.tokens = action.payload.tokens
        state.isAuthenticated = true
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null
        state.tokens = null
        state.isAuthenticated = false
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        if (state.tokens) {
          state.tokens.accessToken = action.payload.accessToken
        }
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null
        state.tokens = null
        state.isAuthenticated = false
      })
  },
})

export const { clearError, setUser } = authSlice.actions
export { authSlice }
