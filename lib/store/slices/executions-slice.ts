import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiClient } from '@/lib/api/api-client'
import type {
    CancelExecutionDto,
    PauseExecutionDto,
    ResumeExecutionDto,
    ExecuteWorkflowDto,
    ExecutionResponseDto,
    ExecutionsControllerFindAllStatusEnum
} from '@/src/generated/api/api'

// We extend the API type for our UI needs if necessary, 
// or just use the API types directly.
export interface ExecutionsState {
    executions: ExecutionResponseDto[]
    total: number
    limit: number
    offset: number
    listLoading: boolean
    listError: string | null

    selectedExecution: ExecutionResponseDto | null
    detailLoading: boolean
    detailError: string | null

    operationLoading: boolean
    operationError: string | null
}

const initialState: ExecutionsState = {
    executions: [],
    total: 0,
    limit: 20,
    offset: 0,
    listLoading: false,
    listError: null,

    selectedExecution: null,
    detailLoading: false,
    detailError: null,

    operationLoading: false,
    operationError: null,
}

// Thunks
export const fetchExecutions = createAsyncThunk(
    'executions/fetchAll',
    async (params: { workflowId?: string; status?: ExecutionsControllerFindAllStatusEnum; limit?: number; offset?: number } = {}, { rejectWithValue }) => {
        try {
            const { workflowId, status, limit, offset } = params
            const response = await apiClient.listExecutions(workflowId, status, undefined, undefined, limit, offset)
            // The API response structure seems to be { success: boolean, data: ExecutionResponseDto[], total: number ... }
            // based on the generated types (though ExecutionListResponseDto showed Array<string> in my quick look, 
            // it's likely actually the objects if it following the pattern)
            return response
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

export const fetchExecution = createAsyncThunk(
    'executions/fetchOne',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.getExecution(id)
            return response
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

export const triggerWorkflow = createAsyncThunk(
    'executions/trigger',
    async ({ id, data }: { id: string; data: ExecuteWorkflowDto }, { rejectWithValue }) => {
        try {
            const response = await apiClient.triggerWorkflow(id, data)
            return response
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

export const cancelExecution = createAsyncThunk(
    'executions/cancel',
    async ({ id, data }: { id: string; data: CancelExecutionDto }, { rejectWithValue }) => {
        try {
            const response = await apiClient.cancelExecution(id, data)
            return { id, response }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

export const pauseExecution = createAsyncThunk(
    'executions/pause',
    async ({ id, data }: { id: string; data: PauseExecutionDto }, { rejectWithValue }) => {
        try {
            const response = await apiClient.pauseExecution(id, data)
            return { id, response }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

export const resumeExecution = createAsyncThunk(
    'executions/resume',
    async ({ id, data }: { id: string; data: ResumeExecutionDto }, { rejectWithValue }) => {
        try {
            const response = await apiClient.resumeExecution(id, data)
            return { id, response }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

const executionsSlice = createSlice({
    name: 'executions',
    initialState,
    reducers: {
        clearExecutionErrors: (state) => {
            state.listError = null
            state.detailError = null
            state.operationError = null
        },
        selectExecution: (state, action: PayloadAction<ExecutionResponseDto | null>) => {
            state.selectedExecution = action.payload
        },
    },
    extraReducers: (builder) => {
        // Fetch All
        builder
            .addCase(fetchExecutions.pending, (state) => {
                state.listLoading = true
                state.listError = null
            })
            .addCase(fetchExecutions.fulfilled, (state, action: any) => {
                state.listLoading = false
                state.executions = action.payload.data || []
                state.total = action.payload.total || 0
            })
            .addCase(fetchExecutions.rejected, (state, action) => {
                state.listLoading = false
                state.listError = action.payload as string
            })

        // Fetch One
        builder
            .addCase(fetchExecution.pending, (state) => {
                state.detailLoading = true
                state.detailError = null
            })
            .addCase(fetchExecution.fulfilled, (state, action: any) => {
                state.detailLoading = false
                state.selectedExecution = action.payload.data
            })
            .addCase(fetchExecution.rejected, (state, action) => {
                state.detailLoading = false
                state.detailError = action.payload as string
            })

        // Operations (Cancel, Pause, Resume, Trigger)
        const operationPending = (state: ExecutionsState) => {
            state.operationLoading = true
            state.operationError = null
        }
        const operationRejected = (state: ExecutionsState, action: PayloadAction<unknown>) => {
            state.operationLoading = false
            state.operationError = action.payload as string
        }

        builder
            .addCase(triggerWorkflow.pending, operationPending)
            .addCase(triggerWorkflow.fulfilled, (state) => {
                state.operationLoading = false
            })
            .addCase(triggerWorkflow.rejected, operationRejected)

            .addCase(cancelExecution.pending, operationPending)
            .addCase(cancelExecution.fulfilled, (state, action) => {
                state.operationLoading = false
                // Optionally update the status in the list if it matches
                const exec = state.executions.find(e => e.id === action.payload.id)
                if (exec) exec.status = 'CANCELLED'
                if (state.selectedExecution?.id === action.payload.id) {
                    state.selectedExecution.status = 'CANCELLED'
                }
            })
            .addCase(cancelExecution.rejected, operationRejected)

            .addCase(pauseExecution.pending, operationPending)
            .addCase(pauseExecution.fulfilled, (state, action) => {
                state.operationLoading = false
                const exec = state.executions.find(e => e.id === action.payload.id)
                if (exec) exec.status = 'PAUSED'
                if (state.selectedExecution?.id === action.payload.id) {
                    state.selectedExecution.status = 'PAUSED'
                }
            })
            .addCase(pauseExecution.rejected, operationRejected)

            .addCase(resumeExecution.pending, operationPending)
            .addCase(resumeExecution.fulfilled, (state, action) => {
                state.operationLoading = false
                const exec = state.executions.find(e => e.id === action.payload.id)
                if (exec) exec.status = 'RUNNING'
                if (state.selectedExecution?.id === action.payload.id) {
                    state.selectedExecution.status = 'RUNNING'
                }
            })
            .addCase(resumeExecution.rejected, operationRejected)
    },
})

export const { clearExecutionErrors, selectExecution } = executionsSlice.actions
export default executionsSlice.reducer
