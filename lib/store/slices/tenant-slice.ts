import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiClient } from '@/lib/api/api-client'
import type { UpdateTenantDto, TenantResponseDto } from '@/src/generated/api/api'

interface TenantState {
    currentTenant: TenantResponseDto | null
    isLoading: boolean
    error: string | null
}

const initialState: TenantState = {
    currentTenant: null,
    isLoading: false,
    error: null,
}

export const fetchCurrentTenant = createAsyncThunk(
    'tenant/fetchCurrent',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.getCurrentTenant()
            return response as TenantResponseDto
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

export const updateCurrentTenant = createAsyncThunk(
    'tenant/updateCurrent',
    async (data: UpdateTenantDto, { rejectWithValue }) => {
        try {
            const response = await apiClient.updateCurrentTenant(data)
            return response as TenantResponseDto
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

const tenantSlice = createSlice({
    name: 'tenant',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCurrentTenant.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchCurrentTenant.fulfilled, (state, action) => {
                state.isLoading = false
                state.currentTenant = action.payload
            })
            .addCase(fetchCurrentTenant.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
            .addCase(updateCurrentTenant.fulfilled, (state, action) => {
                state.currentTenant = action.payload
            })
    },
})

export const { clearError } = tenantSlice.actions
export { tenantSlice }
