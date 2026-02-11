import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiClient } from '@/lib/api/api-client'
import type { CreateWorkflowDto, UpdateWorkflowDto, WorkflowDefinitionDto, WorkflowResponseDto } from '@/src/generated/api/api'

// Types
export interface Workflow {
  id: string
  tenantId: string
  version: number
  hash: string
  name: string
  description?: string
  status: 'active' | 'inactive' | 'draft'
  isActive: boolean
  schedule?: string
  createdAt: string
  updatedAt: string
  deprecatedAfter?: string
  forceCancelAfter?: string
  definition: {
    version: string
    activities: Array<{
      id: string
      type: 'extract' | 'transform' | 'load' | 'filter' | 'join'
      name: string
      config: Record<string, any>
    }>
    steps: Array<{
      id: string
      activityId: string
      dependsOn: string[]
    }>
    schedule?: string
  }
}

interface WorkflowsState {
  workflows: Workflow[]
  listLoading: boolean
  listError: string | null
  
  selectedWorkflow: Workflow | null
  detailLoading: boolean
  detailError: string | null
  
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  isValidating: boolean
  operationError: string | null
  
  validationResult: {
    valid: boolean
    errors: Array<{ field: string; message: string }>
    warnings: string[]
    activitiesChecked: number
    aggregatorsVerified: string[]
  } | null
}

const initialState: WorkflowsState = {
  workflows: [],
  listLoading: false,
  listError: null,
  
  selectedWorkflow: null,
  detailLoading: false,
  detailError: null,
  
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isValidating: false,
  operationError: null,
  
  validationResult: null,
}

// Thunks
export const fetchWorkflows = createAsyncThunk(
  'workflows/fetchAll',
  async (status: string = 'all', { rejectWithValue }) => {
    try {
      const response = await apiClient.listWorkflows(status)
      return response as Workflow[]
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const fetchWorkflow = createAsyncThunk(
  'workflows/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.getWorkflow(id)
      return response as Workflow
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const createWorkflow = createAsyncThunk(
  'workflows/create',
  async (data: CreateWorkflowDto, { rejectWithValue }) => {
    try {
      const response = await apiClient.createWorkflow(data)
      return response as Workflow
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const updateWorkflow = createAsyncThunk(
  'workflows/update',
  async (
    { id, data }: { id: string; data: UpdateWorkflowDto },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.updateWorkflow(id, data)
      return response as Workflow
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const deleteWorkflow = createAsyncThunk(
  'workflows/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.deleteWorkflow(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const validateWorkflow = createAsyncThunk(
  'workflows/validate',
  async (data: WorkflowDefinitionDto, { rejectWithValue }) => {
    try {
      const response = await apiClient.validateWorkflow(data)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

const workflowsSlice = createSlice({
  name: 'workflows',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.listError = null
      state.detailError = null
      state.operationError = null
    },
    selectWorkflow: (state, action: PayloadAction<Workflow | null>) => {
      state.selectedWorkflow = action.payload
    },
    clearSelected: (state) => {
      state.selectedWorkflow = null
    },
    clearValidationResult: (state) => {
      state.validationResult = null
    },
  },
  extraReducers: (builder) => {
    // Fetch All
    builder
      .addCase(fetchWorkflows.pending, (state) => {
        state.listLoading = true
        state.listError = null
      })
      .addCase(fetchWorkflows.fulfilled, (state, action) => {
        state.listLoading = false
        state.workflows = action.payload
      })
      .addCase(fetchWorkflows.rejected, (state, action) => {
        state.listLoading = false
        state.listError = action.payload as string
      })

    // Fetch One
    builder
      .addCase(fetchWorkflow.pending, (state) => {
        state.detailLoading = true
        state.detailError = null
      })
      .addCase(fetchWorkflow.fulfilled, (state, action) => {
        state.detailLoading = false
        state.selectedWorkflow = action.payload
      })
      .addCase(fetchWorkflow.rejected, (state, action) => {
        state.detailLoading = false
        state.detailError = action.payload as string
      })

    // Create
    builder
      .addCase(createWorkflow.pending, (state) => {
        state.isCreating = true
        state.operationError = null
      })
      .addCase(createWorkflow.fulfilled, (state, action) => {
        state.isCreating = false
        state.workflows.push(action.payload)
        state.selectedWorkflow = action.payload
      })
      .addCase(createWorkflow.rejected, (state, action) => {
        state.isCreating = false
        state.operationError = action.payload as string
      })

    // Update
    builder
      .addCase(updateWorkflow.pending, (state) => {
        state.isUpdating = true
        state.operationError = null
      })
      .addCase(updateWorkflow.fulfilled, (state, action) => {
        state.isUpdating = false
        const idx = state.workflows.findIndex(w => w.id === action.payload.id)
        if (idx !== -1) {
          state.workflows[idx] = action.payload
        }
        state.selectedWorkflow = action.payload
      })
      .addCase(updateWorkflow.rejected, (state, action) => {
        state.isUpdating = false
        state.operationError = action.payload as string
      })

    // Delete
    builder
      .addCase(deleteWorkflow.pending, (state) => {
        state.isDeleting = true
        state.operationError = null
      })
      .addCase(deleteWorkflow.fulfilled, (state, action) => {
        state.isDeleting = false
        state.workflows = state.workflows.filter(w => w.id !== action.payload)
        if (state.selectedWorkflow?.id === action.payload) {
          state.selectedWorkflow = null
        }
      })
      .addCase(deleteWorkflow.rejected, (state, action) => {
        state.isDeleting = false
        state.operationError = action.payload as string
      })

    // Validate
    builder
      .addCase(validateWorkflow.pending, (state) => {
        state.isValidating = true
        state.operationError = null
        state.validationResult = null
      })
      .addCase(validateWorkflow.fulfilled, (state, action) => {
        state.isValidating = false
        state.validationResult = action.payload as any
      })
      .addCase(validateWorkflow.rejected, (state, action) => {
        state.isValidating = false
        state.operationError = action.payload as string
      })
  },
})

export const { clearErrors, selectWorkflow, clearSelected, clearValidationResult } = workflowsSlice.actions
export { workflowsSlice }
