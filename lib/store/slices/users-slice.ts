import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiClient } from '@/lib/api/api-client'
import type { UserResponseDto, UpdateUserDto } from '@/src/generated/api/api'

interface UsersState {
    users: UserResponseDto[]
    currentUser: UserResponseDto | null
    isLoading: boolean
    error: string | null
}

const initialState: UsersState = {
    users: [],
    currentUser: null,
    isLoading: false,
    error: null,
}

export const fetchUsers = createAsyncThunk(
    'users/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.getUsers()
            return response as UserResponseDto[]
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

export const fetchUser = createAsyncThunk(
    'users/fetchOne',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.getUser(id)
            return response as UserResponseDto
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

export const updateUser = createAsyncThunk(
    'users/update',
    async ({ id, data }: { id: string; data: UpdateUserDto }, { rejectWithValue }) => {
        try {
            const response = await apiClient.updateUser(id, data)
            return response as UserResponseDto
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

export const deleteUser = createAsyncThunk(
    'users/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await apiClient.deleteUser(id)
            return id
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        setCurrentUser: (state, action: PayloadAction<UserResponseDto | null>) => {
            state.currentUser = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.isLoading = false
                state.users = action.payload
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.currentUser = action.payload
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const index = state.users.findIndex(u => u.id === action.payload.id)
                if (index !== -1) {
                    state.users[index] = action.payload
                }
                if (state.currentUser?.id === action.payload.id) {
                    state.currentUser = action.payload
                }
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(u => u.id !== action.payload)
                if (state.currentUser?.id === action.payload) {
                    state.currentUser = null
                }
            })
    },
})

export const { clearError, setCurrentUser } = usersSlice.actions
export { usersSlice }
