import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Connector {
  id: string
  name: string
  status: 'online' | 'offline' | 'error'
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
    updateConnector: (state, action: PayloadAction<{ id: string; data: Partial<Connector> }>) => {
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
})

export const {
  setConnectors,
  addConnector,
  updateConnector,
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
