import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiClient } from '@/lib/api/api-client'
import type { CreateConnectorDto, UpdateConnectorDto } from '@/src/generated/api/api'
import type { ConnectorStatus } from '@/lib/types'

export interface Connector {
  id: string
  name: string
  status: ConnectorStatus
  ipAddress?: string
  version: string
  lastSeen: string
  os: string
  cpuUsage?: number
  memoryUsage?: number
  activeWorkflows: number
  apiKeyPrefix: string
}

interface ConnectorState {
  connectors: Connector[]
  selectedConnectorId: string | null
  isLoading: boolean
  error: string | null

  // Stats
  totalConnectors: number
  onlineCount: number
  offlineCount: number

  // Connection form
  newConnectorName: string
  newConnectorOs: string
  generatedApiKey: string | null
  downloadUrl: string | null
}

const initialState: ConnectorState = {
  connectors: [],
  selectedConnectorId: null,
  isLoading: false,
  error: null,
  totalConnectors: 0,
  onlineCount: 0,
  offlineCount: 0,
  newConnectorName: '',
  newConnectorOs: 'windows',
  generatedApiKey: null,
  downloadUrl: null,
}

// Thunks
export const fetchConnectors = createAsyncThunk(
  'connector/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.getConnectors()
      // Map API response to Connector interface
      return (response as any[]).map(c => ({
        id: c.id,
        name: c.name,
        status: (c.status?.toLowerCase() || 'offline') as ConnectorStatus,
        ipAddress: c.ipAddress || undefined,
        version: c.version || '1.0.0',
        lastSeen: c.lastHeartbeat || c.updatedAt || new Date().toISOString(),
        os: c.os || 'linux',
        cpuUsage: c.cpuUsage || 0,
        memoryUsage: c.memoryUsage || 0,
        activeWorkflows: 0, // Default as not currently in API list response
        apiKeyPrefix: c.apiKeyPrefix || '',
        ...c
      })) as Connector[]
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const createConnector = createAsyncThunk(
  'connector/create',
  async (data: CreateConnectorDto, { rejectWithValue }) => {
    try {
      const response = await apiClient.createConnector(data)
      return response as Connector
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const updateConnector = createAsyncThunk(
  'connector/update',
  async ({ id, data }: { id: string; data: UpdateConnectorDto }, { rejectWithValue }) => {
    try {
      const response = await apiClient.updateConnector(id, data)
      return response as Connector
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const deleteConnector = createAsyncThunk(
  'connector/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.deleteConnector(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

const connectorSlice = createSlice({
  name: 'connector',
  initialState,
  reducers: {
    setConnectors: (state, action: PayloadAction<Connector[]>) => {
      state.connectors = action.payload
      state.totalConnectors = action.payload.length
      state.onlineCount = action.payload.filter((c) => c.status === 'online').length
      state.offlineCount = action.payload.filter((c) => c.status === 'offline').length
    },
    addConnector: (state, action: PayloadAction<Connector>) => {
      state.connectors.push(action.payload)
      state.totalConnectors++
      if (action.payload.status === 'online') state.onlineCount++
      if (action.payload.status === 'offline') state.offlineCount++
    },
    // This synchronous updateConnector reducer is kept as it handles partial updates directly to state,
    // while the thunk handles full replacement after an API call.
    updateConnectorState: (state, action: PayloadAction<{ id: string; data: Partial<Connector> }>) => {
      const connector = state.connectors.find((c) => c.id === action.payload.id)
      if (connector) {
        Object.assign(connector, action.payload.data)
      }
    },
    removeConnector: (state, action: PayloadAction<string>) => {
      const connector = state.connectors.find((c) => c.id === action.payload)
      state.connectors = state.connectors.filter((c) => c.id !== action.payload)
      state.totalConnectors--
      if (connector?.status === 'online') state.onlineCount--
      if (connector?.status === 'offline') state.offlineCount--
      if (state.selectedConnectorId === action.payload) {
        state.selectedConnectorId = null
      }
    },
    selectConnector: (state, action: PayloadAction<string | null>) => {
      state.selectedConnectorId = action.payload
    },
    setConnectorStatus: (
      state,
      action: PayloadAction<{ id: string; status: Connector['status'] }>
    ) => {
      const connector = state.connectors.find((c) => c.id === action.payload.id)
      if (connector) {
        const oldStatus = connector.status
        connector.status = action.payload.status
        connector.lastSeen = new Date().toISOString()

        if (oldStatus === 'online' && action.payload.status !== 'online') {
          state.onlineCount--
          if (action.payload.status === 'offline') state.offlineCount++
        } else if (oldStatus !== 'online' && action.payload.status === 'online') {
          state.onlineCount++
          if (oldStatus === 'offline') state.offlineCount--
        }
      }
    },

    // Form state
    setNewConnectorName: (state, action: PayloadAction<string>) => {
      state.newConnectorName = action.payload
    },
    setNewConnectorOs: (state, action: PayloadAction<string>) => {
      state.newConnectorOs = action.payload
    },
    setGeneratedApiKey: (state, action: PayloadAction<string | null>) => {
      state.generatedApiKey = action.payload
    },
    setDownloadUrl: (state, action: PayloadAction<string | null>) => {
      state.downloadUrl = action.payload
    },
    resetNewConnectorForm: (state) => {
      state.newConnectorName = ''
      state.newConnectorOs = 'windows'
      state.generatedApiKey = null
      state.downloadUrl = null
    },

    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConnectors.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchConnectors.fulfilled, (state, action) => {
        state.isLoading = false
        state.connectors = action.payload
        state.totalConnectors = action.payload.length
        state.onlineCount = action.payload.filter(c => c.status === 'online').length
        state.offlineCount = action.payload.filter(c => c.status === 'offline').length
      })
      .addCase(fetchConnectors.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(createConnector.fulfilled, (state, action) => {
        state.connectors.push(action.payload)
        state.totalConnectors++
        if (action.payload.status === 'online') state.onlineCount++
        else state.offlineCount++
      })
      .addCase(updateConnector.fulfilled, (state, action) => {
        const index = state.connectors.findIndex(c => c.id === action.payload.id)
        if (index !== -1) {
          state.connectors[index] = action.payload
        }
      })
      .addCase(deleteConnector.fulfilled, (state, action) => {
        state.connectors = state.connectors.filter(c => c.id !== action.payload)
        state.totalConnectors--
        // Recalculate counts
        state.onlineCount = state.connectors.filter(c => c.status === 'online').length
        state.offlineCount = state.connectors.filter(c => c.status === 'offline').length
      })
  },
})

export const {
  setConnectors,
  addConnector,
  // The synchronous updateConnector is still exported here.
  // If the thunk is meant to fully replace it, this line should be removed.
  updateConnectorState,
  removeConnector,
  selectConnector,
  setConnectorStatus,
  setNewConnectorName,
  setNewConnectorOs,
  setGeneratedApiKey,
  setDownloadUrl,
  resetNewConnectorForm,
  setIsLoading,
  setError,
} = connectorSlice.actions

export { connectorSlice }
