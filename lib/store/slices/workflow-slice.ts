import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { CanvasNode, CanvasConnection, WorkflowStatus } from '@/lib/types'

interface WorkflowState {
  // Canvas state
  nodes: CanvasNode[]
  connections: CanvasConnection[]
  selectedNodeId: string | null

  // Workflow metadata
  workflowId: string | null
  workflowName: string
  workflowDescription: string
  status: WorkflowStatus

  // UI state
  zoom: number
  viewport: { x: number; y: number }

  // Execution state
  isExecuting: boolean
  executionId: string | null

  // History for undo/redo
  history: {
    past: Array<{ nodes: CanvasNode[]; connections: CanvasConnection[] }>
    future: Array<{ nodes: CanvasNode[]; connections: CanvasConnection[] }>
  }
}

const initialState: WorkflowState = {
  nodes: [],
  connections: [],
  selectedNodeId: null,
  workflowId: null,
  workflowName: 'Untitled Workflow',
  workflowDescription: '',
  status: 'draft',
  zoom: 1,
  viewport: { x: 0, y: 0 },
  isExecuting: false,
  executionId: null,
  history: {
    past: [],
    future: [],
  },
}

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    // Node operations
    setNodes: (state, action: PayloadAction<CanvasNode[]>) => {
      state.history.past.push({ nodes: state.nodes, connections: state.connections })
      state.history.future = []
      state.nodes = action.payload
    },
    addNode: (state, action: PayloadAction<CanvasNode>) => {
      state.history.past.push({ nodes: state.nodes, connections: state.connections })
      state.history.future = []
      state.nodes.push(action.payload)
    },
    updateNode: (state, action: PayloadAction<{ id: string; data: Partial<CanvasNode> }>) => {
      const index = state.nodes.findIndex((n) => n.id === action.payload.id)
      if (index !== -1) {
        state.nodes[index] = { ...state.nodes[index], ...action.payload.data }
      }
    },
    removeNode: (state, action: PayloadAction<string>) => {
      state.history.past.push({ nodes: state.nodes, connections: state.connections })
      state.history.future = []
      state.nodes = state.nodes.filter((n) => n.id !== action.payload)
      state.connections = state.connections.filter(
        (c) => c.from !== action.payload && c.to !== action.payload
      )
      if (state.selectedNodeId === action.payload) {
        state.selectedNodeId = null
      }
    },

    // Connection operations
    setConnections: (state, action: PayloadAction<CanvasConnection[]>) => {
      state.history.past.push({ nodes: state.nodes, connections: state.connections })
      state.history.future = []
      state.connections = action.payload
    },
    addConnection: (state, action: PayloadAction<CanvasConnection>) => {
      state.history.past.push({ nodes: state.nodes, connections: state.connections })
      state.history.future = []
      state.connections.push(action.payload)
    },
    removeConnection: (state, action: PayloadAction<{ from: string; to: string }>) => {
      state.history.past.push({ nodes: state.nodes, connections: state.connections })
      state.history.future = []
      state.connections = state.connections.filter(
        (c) => !(c.from === action.payload.from && c.to === action.payload.to)
      )
    },

    // Selection
    selectNode: (state, action: PayloadAction<string | null>) => {
      state.selectedNodeId = action.payload
    },
    clearSelection: (state) => {
      state.selectedNodeId = null
    },

    // Workflow metadata
    setWorkflowId: (state, action: PayloadAction<string | null>) => {
      state.workflowId = action.payload
    },
    setWorkflowName: (state, action: PayloadAction<string>) => {
      state.workflowName = action.payload
    },
    setWorkflowDescription: (state, action: PayloadAction<string>) => {
      state.workflowDescription = action.payload
    },
    setStatus: (state, action: PayloadAction<WorkflowStatus>) => {
      state.status = action.payload
    },

    // Viewport
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload
    },
    setViewport: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.viewport = action.payload
    },

    // Execution
    setIsExecuting: (state, action: PayloadAction<boolean>) => {
      state.isExecuting = action.payload
    },
    setExecutionId: (state, action: PayloadAction<string | null>) => {
      state.executionId = action.payload
    },

    // History
    undo: (state) => {
      if (state.history.past.length > 0) {
        const previous = state.history.past.pop()!
        state.history.future.push({ nodes: state.nodes, connections: state.connections })
        state.nodes = previous.nodes
        state.connections = previous.connections
      }
    },
    redo: (state) => {
      if (state.history.future.length > 0) {
        const next = state.history.future.pop()!
        state.history.past.push({ nodes: state.nodes, connections: state.connections })
        state.nodes = next.nodes
        state.connections = next.connections
      }
    },

    // Reset
    resetWorkflow: () => initialState,
    loadWorkflow: (state, action: PayloadAction<Partial<WorkflowState>>) => {
      return { ...initialState, ...action.payload }
    },
  },
})

export const {
  setNodes,
  addNode,
  updateNode,
  removeNode,
  setConnections,
  addConnection,
  removeConnection,
  selectNode,
  clearSelection,
  setWorkflowId,
  setWorkflowName,
  setWorkflowDescription,
  setStatus,
  setZoom,
  setViewport,
  setIsExecuting,
  setExecutionId,
  undo,
  redo,
  resetWorkflow,
  loadWorkflow,
} = workflowSlice.actions

export { workflowSlice }
