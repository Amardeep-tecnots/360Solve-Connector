import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiClient } from '@/lib/api/api-client'

export type ConfigFieldType = 'text' | 'password' | 'url' | 'select'

export interface AggregatorConfigField {
  name: string
  label: string
  type: ConfigFieldType
  required: boolean
  options?: string[]
  placeholder?: string
  helpText?: string
}

export interface AggregatorConfigSchema {
  authType?: 'api_key' | 'oauth' | 'basic' | 'connection_string'
  fields: AggregatorConfigField[]
}

// Types
export interface Aggregator {
  id: string
  installedId?: string
  name: string
  description: string
  category: string
  version: string
  installs: number
  rating: number
  isInstalled: boolean
  author: string
  tags: string[]
  requiresMiniConnector: boolean
  logoUrl: string
  configSchema?: AggregatorConfigSchema
  aggregatorName?: string
  aggregatorDescription?: string
  schemaStatus?: 'pending' | 'discovering' | 'discovered' | 'failed' | null
  schema?: {
    tableCount?: number
    relationshipCount?: number
    discoveredAt?: string
    tables?: Array<{ name: string; columnCount?: number }>
    relationships?: Array<{
      fromTable: string
      fromColumn: string
      toTable: string
      toColumn: string
      constraintName?: string
    }>
  }
}

export interface InstalledAggregator {
  id: string
  marketplaceId: string
  name: string
  description: string
  aggregatorName?: string
  aggregatorDescription?: string
  category: string
  type?: string
  connectionMethod?: string
  version: string
  logoUrl: string
  status: 'active' | 'error' | 'unconfigured' | 'waiting_for_connector'
  lastSyncAt?: string
  errorMessage?: string
  config?: Record<string, any>
  configuration?: {
    hasCredentials: boolean
    connectionMethod: string
    testStatus?: 'passed' | 'failed'
  }
  requiresMiniConnector: boolean
  miniConnectorId?: string
  configSchema?: AggregatorConfigSchema
  schemaStatus?: 'pending' | 'discovering' | 'discovered' | 'failed' | null
  schema?: {
    tableCount?: number
    relationshipCount?: number
    discoveredAt?: string
    tables?: Array<{ name: string; columnCount?: number }>
    relationships?: Array<{
      fromTable: string
      fromColumn: string
      toTable: string
      toColumn: string
      constraintName?: string
    }>
  }
}

interface AggregatorsState {
  marketplaceItems: Aggregator[]
  marketplaceLoading: boolean
  marketplaceError: string | null

  installed: InstalledAggregator[]
  installedLoading: boolean
  installedError: string | null

  selectedAggregator: InstalledAggregator | null

  isInstalling: boolean
  isConfiguring: boolean
  isTesting: boolean
  isDeleting: boolean
  operationError: string | null
}

const initialState: AggregatorsState = {
  marketplaceItems: [],
  marketplaceLoading: false,
  marketplaceError: null,
  installed: [],
  installedLoading: false,
  installedError: null,
  selectedAggregator: null,
  isInstalling: false,
  isConfiguring: false,
  isTesting: false,
  isDeleting: false,
  operationError: null,
}

// Thunks
export const fetchMarketplace = createAsyncThunk(
  'aggregators/fetchMarketplace',
  async (params: { category?: string; search?: string }, { rejectWithValue }) => {
    try {
      return await apiClient.listMarketplaceAggregators({
        page: '1',
        limit: '50',
        category: params.category || '',
        search: params.search || ''
      })
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message)
    }
  }
)

export const fetchInstalled = createAsyncThunk(
  'aggregators/fetchInstalled',
  async (_, { rejectWithValue }) => {
    try {
      return await apiClient.listInstalledAggregators()
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message)
    }
  }
)

export const installAggregator = createAsyncThunk(
  'aggregators/install',
  async (
    {
      marketplaceId,
      name,
      config,
      credentials,
      testConnection
    }: {
      marketplaceId: string
      name: string
      config?: Record<string, any>
      credentials?: Record<string, string>
      testConnection?: boolean
    },
    { rejectWithValue }
  ) => {
    try {
      return await apiClient.installAggregator(marketplaceId, name, config, credentials, testConnection)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message)
    }
  }
)

export const configureAggregator = createAsyncThunk(
  'aggregators/configure',
  async ({ id, name, credentials }: { id: string; name: string; credentials: Record<string, string> }, { rejectWithValue }) => {
    try {
      return await apiClient.configureAggregator(id, name, credentials)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message)
    }
  }
)

export const testConnection = createAsyncThunk(
  'aggregators/testConnection',
  async (id: string, { rejectWithValue }) => {
    try {
      return await apiClient.testAggregatorConnection(id)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message)
    }
  }
)

export const deleteAggregator = createAsyncThunk(
  'aggregators/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.deleteAggregator(id)
      return id
    } catch (error: any) {
      if (error.response?.status === 409) {
        return rejectWithValue(error.response?.data?.message || 'Cannot delete: used by active workflows')
      }
      return rejectWithValue(error.response?.data?.error?.message || error.message)
    }
  }
)

export const triggerDiscovery = createAsyncThunk(
  'aggregators/triggerDiscovery',
  async (id: string, { rejectWithValue }) => {
    try {
      return await apiClient.triggerSchemaDiscovery(id)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message)
    }
  }
)

export const fetchSchema = createAsyncThunk(
  'aggregators/fetchSchema',
  async (id: string, { rejectWithValue }) => {
    try {
      return await apiClient.getSchema(id)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message)
    }
  }
)

export const fetchTables = createAsyncThunk(
  'aggregators/fetchTables',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.getTables(id)
      return response.tables || response // Fallback if already an array
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message)
    }
  }
)

export const fetchRelationships = createAsyncThunk(
  'aggregators/fetchRelationships',
  async (id: string, { rejectWithValue }) => {
    try {
      return await apiClient.getRelationships(id)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || error.message)
    }
  }
)

const aggregatorsSlice = createSlice({
  name: 'aggregators',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.marketplaceError = null
      state.installedError = null
      state.operationError = null
    },
    selectAggregator: (state, action: PayloadAction<InstalledAggregator | null>) => {
      state.selectedAggregator = action.payload
    },
  },
  extraReducers: (builder) => {
    // Fetch Marketplace
    builder
      .addCase(fetchMarketplace.pending, (state) => {
        state.marketplaceLoading = true
        state.marketplaceError = null
      })
      .addCase(fetchMarketplace.fulfilled, (state, action) => {
        state.marketplaceLoading = false
        state.marketplaceItems = action.payload
      })
      .addCase(fetchMarketplace.rejected, (state, action) => {
        state.marketplaceLoading = false
        state.marketplaceError = action.payload as string
      })

    // Fetch Installed
    builder
      .addCase(fetchInstalled.pending, (state) => {
        state.installedLoading = true
        state.installedError = null
      })
      .addCase(fetchInstalled.fulfilled, (state, action) => {
        state.installedLoading = false
        state.installed = action.payload
      })
      .addCase(fetchInstalled.rejected, (state, action) => {
        state.installedLoading = false
        state.installedError = action.payload as string
      })

    // Install
    builder
      .addCase(installAggregator.pending, (state) => {
        state.isInstalling = true
        state.operationError = null
      })
      .addCase(installAggregator.fulfilled, (state, action) => {
        state.isInstalling = false
        state.installed.push(action.payload)
      })
      .addCase(installAggregator.rejected, (state, action) => {
        state.isInstalling = false
        state.operationError = action.payload as string
      })

    // Configure
    builder
      .addCase(configureAggregator.pending, (state) => {
        state.isConfiguring = true
        state.operationError = null
      })
      .addCase(configureAggregator.fulfilled, (state, action) => {
        state.isConfiguring = false
        const idx = state.installed.findIndex(a => a.id === action.payload.id)
        if (idx !== -1) {
          state.installed[idx] = {
            ...state.installed[idx],
            ...action.payload,
            // Ensure config is explicitly updated if present in payload
            config: action.payload.config || state.installed[idx].config,
            configuration: action.payload.configuration || state.installed[idx].configuration
          }
        }
      })
      .addCase(configureAggregator.rejected, (state, action) => {
        state.isConfiguring = false
        state.operationError = action.payload as string
      })

    // Test
    builder
      .addCase(testConnection.pending, (state) => {
        state.isTesting = true
        state.operationError = null
      })
      .addCase(testConnection.fulfilled, (state) => {
        state.isTesting = false
      })
      .addCase(testConnection.rejected, (state, action) => {
        state.isTesting = false
        state.operationError = action.payload as string
      })

    // Delete
    builder
      .addCase(deleteAggregator.pending, (state) => {
        state.isDeleting = true
        state.operationError = null
      })
      .addCase(deleteAggregator.fulfilled, (state, action) => {
        state.isDeleting = false
        state.installed = state.installed.filter(a => a.id !== action.payload)
      })
      .addCase(deleteAggregator.rejected, (state, action) => {
        state.isDeleting = false
        state.operationError = action.payload as string
      })

    // Schema Discovery
    builder
      .addCase(triggerDiscovery.pending, (state, action) => {
        const idx = state.installed.findIndex(a => a.id === action.meta.arg)
        if (idx !== -1) {
          state.installed[idx].schemaStatus = 'discovering'
        }
      })
      .addCase(triggerDiscovery.fulfilled, (state, action) => {
        const idx = state.installed.findIndex(a => a.id === action.meta.arg)
        if (idx !== -1) {
          // If the response contains data immediately, mark as discovered
          if (action.payload && (action.payload.tables || action.payload.tableCount)) {
            state.installed[idx].schema = action.payload
            state.installed[idx].schemaStatus = 'discovered'
          } else {
            state.installed[idx].schemaStatus = 'discovering'
          }
        }
      })
      .addCase(triggerDiscovery.rejected, (state, action) => {
        const idx = state.installed.findIndex(a => a.id === action.meta.arg)
        if (idx !== -1) {
          state.installed[idx].schemaStatus = 'failed'
        }
      })
      .addCase(fetchSchema.fulfilled, (state, action) => {
        const idx = state.installed.findIndex(a => a.id === action.meta.arg)
        if (idx !== -1) {
          state.installed[idx].schema = action.payload
          state.installed[idx].schemaStatus = 'discovered'
        }
      })
      .addCase(fetchTables.fulfilled, (state, action) => {
        const idx = state.installed.findIndex(a => a.id === action.meta.arg)
        if (idx !== -1) {
          if (!state.installed[idx].schema) {
            state.installed[idx].schema = {}
          }
          const tablesArray = Array.isArray(action.payload) ? action.payload : (action.payload?.tables || [])
          state.installed[idx].schema!.tables = tablesArray
          state.installed[idx].schema!.tableCount = tablesArray.length
          state.installed[idx].schemaStatus = 'discovered'
        }
      })
      .addCase(fetchRelationships.fulfilled, (state, action) => {
        const idx = state.installed.findIndex(a => a.id === action.meta.arg)
        if (idx !== -1) {
          if (!state.installed[idx].schema) {
            state.installed[idx].schema = {}
          }
          state.installed[idx].schema!.relationships = action.payload.relationships || []
          state.installed[idx].schema!.relationshipCount = action.payload.relationshipCount || 0
        }
      })
  },
})

export const { clearErrors, selectAggregator } = aggregatorsSlice.actions
export { aggregatorsSlice }
