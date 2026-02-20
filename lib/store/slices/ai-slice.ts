import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiClient } from '@/lib/api/api-client'

// Types
export interface AIProvider {
  id: string
  name: string
  logoUrl?: string
  models: AIModel[]
}

export interface AIModel {
  id: string
  name: string
  provider: string
  capabilities?: string[]
}

export interface GeneratedSDK {
  id: string
  name: string
  status: 'pending' | 'generating' | 'completed' | 'failed'
  createdAt: string
  completedAt?: string
  source?: string
  code?: string
  error?: string
}

export interface WorkflowGenerationResult {
  name?: string
  description?: string
  definition: {
    version: string
    activities: Array<{
      id: string
      type: string
      name: string
      config: Record<string, any>
    }>
    steps: Array<{
      id: string
      activityId: string
      dependsOn: string[]
    }>
  }
  explanation?: string
}

export interface MappingResult {
  mappings: Array<{
    sourceField: string
    destinationField: string
    transform?: string
    confidence: number
  }>
  suggestions: string[]
}

interface AIState {
  // Providers & Models
  providers: AIProvider[]
  models: AIModel[]
  selectedProvider: string | null
  selectedModel: string | null
  
  // Loading states
  providersLoading: boolean
  modelsLoading: boolean
  testLoading: boolean
  workflowGenerating: boolean
  mappingGenerating: boolean
  sdkGenerating: boolean
  sdksLoading: boolean
  sdkInfoLoading: boolean
  sdkMethodExecuting: boolean
  
  // Errors
  providersError: string | null
  modelsError: string | null
  testError: string | null
  workflowError: string | null
  mappingError: string | null
  sdkError: string | null
  
  // Results
  testResult: string | null
  lastGeneratedWorkflow: WorkflowGenerationResult | null
  lastGeneratedMapping: MappingResult | null
  
  // SDKs
  sdks: GeneratedSDK[]
  selectedSDK: GeneratedSDK | null
  
  // NEW: SDK Info & Execution
  sdkInfo: any | null
  sdkExecutionResult: any | null
}

const initialState: AIState = {
  // Providers & Models
  providers: [],
  models: [],
  selectedProvider: null,
  selectedModel: null,
  
  // Loading states
  providersLoading: false,
  modelsLoading: false,
  testLoading: false,
  workflowGenerating: false,
  mappingGenerating: false,
  sdkGenerating: false,
  sdksLoading: false,
  sdkInfoLoading: false,
  sdkMethodExecuting: false,
  
  // Errors
  providersError: null,
  modelsError: null,
  testError: null,
  workflowError: null,
  mappingError: null,
  sdkError: null,
  
  // Results
  testResult: null,
  lastGeneratedWorkflow: null,
  lastGeneratedMapping: null,
  
  // SDKs
  sdks: [],
  selectedSDK: null,
  
  // NEW: SDK Info & Execution
  sdkInfo: null,
  sdkExecutionResult: null,
}

// Thunks
export const fetchAIProviders = createAsyncThunk(
  'ai/fetchProviders',
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.getAIProviders()
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const fetchAIModels = createAsyncThunk(
  'ai/fetchModels',
  async (provider: string, { rejectWithValue }) => {
    try {
      return await apiClient.getAIModels(provider)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const testAI = createAsyncThunk(
  'ai/test',
  async ({ prompt, provider, model }: { prompt: string; provider?: string; model?: string }, { rejectWithValue }) => {
    try {
      return await apiClient.testAI(prompt, provider, model)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const generateWorkflow = createAsyncThunk(
  'ai/generateWorkflow',
  async ({ description, provider, model }: { description: string; provider?: string; model?: string }, { rejectWithValue }) => {
    try {
      return await apiClient.generateWorkflow(description, provider, model)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const generateMapping = createAsyncThunk(
  'ai/generateMapping',
  async ({
    sourceSchema,
    destinationSchema,
    provider,
    model
  }: {
    sourceSchema: Record<string, any>
    destinationSchema: Record<string, any>
    provider?: string
    model?: string
  }, { rejectWithValue }) => {
    try {
      return await apiClient.generateMapping(sourceSchema, destinationSchema, provider, model)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const generateSDK = createAsyncThunk(
  'ai/generateSDK',
  async ({
    openApiSpec,
    className,
    credentials,
    model
  }: {
    openApiSpec: string | Record<string, any>
    className: string
    credentials?: { baseUrl: string; apiKey?: string; bearerToken?: string; timeout?: number }
    model?: string
  }, { rejectWithValue }) => {
    try {
      return await apiClient.generateSDK(openApiSpec, className, credentials, model)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const fetchSDKs = createAsyncThunk(
  'ai/fetchSDKs',
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.listSDKs()
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const fetchSDK = createAsyncThunk(
  'ai/fetchSDK',
  async (id: string, { rejectWithValue }) => {
    try {
      return await apiClient.getSDK(id)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const downloadSDK = createAsyncThunk(
  'ai/downloadSDK',
  async (id: string, { rejectWithValue }) => {
    try {
      const blob = await apiClient.downloadSDK(id)
      return { id, blob }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

// NEW: Get SDK Info (available methods, schema)
export const fetchSDKInfo = createAsyncThunk(
  'ai/fetchSDKInfo',
  async (id: string, { rejectWithValue }) => {
    try {
      return await apiClient.getSDKInfo(id)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

// NEW: Execute SDK method
export const executeSDKMethod = createAsyncThunk(
  'ai/executeSDKMethod',
  async ({ id, method, params }: { id: string; method: string; params: Record<string, any> }, { rejectWithValue }) => {
    try {
      return await apiClient.executeSDKMethod(id, method, params)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

// NEW: List tenant SDKs
export const fetchTenantSDKs = createAsyncThunk(
  'ai/fetchTenantSDKs',
  async (tenantId: string, { rejectWithValue }) => {
    try {
      return await apiClient.listTenantSDKs(tenantId)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.providersError = null
      state.modelsError = null
      state.testError = null
      state.workflowError = null
      state.mappingError = null
      state.sdkError = null
    },
    clearTestResult: (state) => {
      state.testResult = null
    },
    clearGeneratedWorkflow: (state) => {
      state.lastGeneratedWorkflow = null
    },
    clearGeneratedMapping: (state) => {
      state.lastGeneratedMapping = null
    },
    setSelectedProvider: (state, action: PayloadAction<string | null>) => {
      state.selectedProvider = action.payload
      state.selectedModel = null
      state.models = []
    },
    setSelectedModel: (state, action: PayloadAction<string | null>) => {
      state.selectedModel = action.payload
    },
    selectSDK: (state, action: PayloadAction<GeneratedSDK | null>) => {
      state.selectedSDK = action.payload
    },
    clearSDKExecutionResult: (state) => {
      state.sdkExecutionResult = null
    },
    clearSDKInfo: (state) => {
      state.sdkInfo = null
    },
  },
  extraReducers: (builder) => {
    // Fetch Providers
    builder
      .addCase(fetchAIProviders.pending, (state) => {
        state.providersLoading = true
        state.providersError = null
      })
      .addCase(fetchAIProviders.fulfilled, (state, action) => {
        state.providersLoading = false
        state.providers = action.payload as AIProvider[]
      })
      .addCase(fetchAIProviders.rejected, (state, action) => {
        state.providersLoading = false
        state.providersError = action.payload as string
      })

    // Fetch Models
    builder
      .addCase(fetchAIModels.pending, (state) => {
        state.modelsLoading = true
        state.modelsError = null
      })
      .addCase(fetchAIModels.fulfilled, (state, action) => {
        state.modelsLoading = false
        state.models = action.payload as AIModel[]
      })
      .addCase(fetchAIModels.rejected, (state, action) => {
        state.modelsLoading = false
        state.modelsError = action.payload as string
      })

    // Test AI
    builder
      .addCase(testAI.pending, (state) => {
        state.testLoading = true
        state.testError = null
      })
      .addCase(testAI.fulfilled, (state, action) => {
        state.testLoading = false
        state.testResult = (action.payload as any)?.response || action.payload
      })
      .addCase(testAI.rejected, (state, action) => {
        state.testLoading = false
        state.testError = action.payload as string
      })

    // Generate Workflow
    builder
      .addCase(generateWorkflow.pending, (state) => {
        state.workflowGenerating = true
        state.workflowError = null
      })
      .addCase(generateWorkflow.fulfilled, (state, action) => {
        state.workflowGenerating = false
        state.lastGeneratedWorkflow = action.payload as WorkflowGenerationResult
      })
      .addCase(generateWorkflow.rejected, (state, action) => {
        state.workflowGenerating = false
        state.workflowError = action.payload as string
      })

    // Generate Mapping
    builder
      .addCase(generateMapping.pending, (state) => {
        state.mappingGenerating = true
        state.mappingError = null
      })
      .addCase(generateMapping.fulfilled, (state, action) => {
        state.mappingGenerating = false
        state.lastGeneratedMapping = action.payload as MappingResult
      })
      .addCase(generateMapping.rejected, (state, action) => {
        state.mappingGenerating = false
        state.mappingError = action.payload as string
      })

    // Generate SDK
    builder
      .addCase(generateSDK.pending, (state) => {
        state.sdkGenerating = true
        state.sdkError = null
      })
      .addCase(generateSDK.fulfilled, (state, action) => {
        state.sdkGenerating = false
        state.sdks.unshift(action.payload as GeneratedSDK)
      })
      .addCase(generateSDK.rejected, (state, action) => {
        state.sdkGenerating = false
        state.sdkError = action.payload as string
      })

    // Fetch SDKs
    builder
      .addCase(fetchSDKs.pending, (state) => {
        state.sdksLoading = true
      })
      .addCase(fetchSDKs.fulfilled, (state, action) => {
        state.sdksLoading = false
        state.sdks = action.payload as GeneratedSDK[]
      })
      .addCase(fetchSDKs.rejected, (state, action) => {
        state.sdksLoading = false
        state.sdkError = action.payload as string
      })

    // Fetch Single SDK
    builder
      .addCase(fetchSDK.fulfilled, (state, action) => {
        state.selectedSDK = action.payload as GeneratedSDK
        // Update in list if exists
        const idx = state.sdks.findIndex(s => s.id === (action.payload as GeneratedSDK).id)
        if (idx !== -1) {
          state.sdks[idx] = action.payload as GeneratedSDK
        }
      })

    // Download SDK
    builder
      .addCase(downloadSDK.fulfilled, (state, action) => {
        const { id, blob } = action.payload as { id: string; blob: Blob }
        const idx = state.sdks.findIndex(s => s.id === id)
        if (idx !== -1) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${state.sdks[idx].name}.zip`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }
      })

    // Fetch SDK Info (NEW)
    builder
      .addCase(fetchSDKInfo.pending, (state) => {
        state.sdkInfoLoading = true
      })
      .addCase(fetchSDKInfo.fulfilled, (state, action) => {
        state.sdkInfoLoading = false
        state.sdkInfo = action.payload
      })
      .addCase(fetchSDKInfo.rejected, (state, action) => {
        state.sdkInfoLoading = false
        state.sdkError = action.payload as string
      })

    // Execute SDK Method (NEW)
    builder
      .addCase(executeSDKMethod.pending, (state) => {
        state.sdkMethodExecuting = true
      })
      .addCase(executeSDKMethod.fulfilled, (state, action) => {
        state.sdkMethodExecuting = false
        state.sdkExecutionResult = action.payload
      })
      .addCase(executeSDKMethod.rejected, (state, action) => {
        state.sdkMethodExecuting = false
        state.sdkError = action.payload as string
      })

    // Fetch Tenant SDKs (NEW)
    builder
      .addCase(fetchTenantSDKs.fulfilled, (state, action) => {
        state.sdks = action.payload as GeneratedSDK[]
      })
  },
})

export const {
  clearErrors,
  clearTestResult,
  clearGeneratedWorkflow,
  clearGeneratedMapping,
  setSelectedProvider,
  setSelectedModel,
  selectSDK,
  clearSDKExecutionResult,
  clearSDKInfo
} = aiSlice.actions

export { aiSlice }
