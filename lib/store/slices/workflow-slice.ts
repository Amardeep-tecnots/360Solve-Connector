import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface WorkflowNode {
  id: string
  type: 'source' | 'transform' | 'destination' | 'condition' | 'merge'
  position: { x: number; y: number }
  data: {
    label: string
    aggregatorId?: string
    connectionConfig?: Record<string, unknown>
    transformConfig?: Record<string, unknown>
    status?: 'idle' | 'running' | 'success' | 'error'
  }
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  type?: string
  animated?: boolean
  style?: Record<string, unknown>
}

interface WorkflowState {
  // Canvas state
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  selectedNodeId: string | null
  selectedEdgeId: string | null
  
  // Workflow metadata
  workflowId: string | null
  workflowName: string
  workflowDescription: string
  isDraft: boolean
  
  // UI state
  zoom: number
  viewport: { x: number; y: number }
  
  // Execution state
  isExecuting: boolean
  executionId: string | null
  
  // History for undo/redo
  history: {
    past: Array<{ nodes: WorkflowNode[]; edges: WorkflowEdge[] }>
    future: Array<{ nodes: WorkflowNode[]; edges: WorkflowEdge[] }>
  }
}

const initialState: WorkflowState = {
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  workflowId: null,
  workflowName: 'New Workflow',
  workflowDescription: '',
  isDraft: true,
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
    setNodes: (state, action: PayloadAction<WorkflowNode[]>) => {
      state.history.past.push({ nodes: state.nodes, edges: state.edges })
      state.history.future = []
      state.nodes = action.payload
    },
    addNode: (state, action: PayloadAction<WorkflowNode>) => {
      state.history.past.push({ nodes: state.nodes, edges: state.edges })
      state.history.future = []
      state.nodes.push(action.payload)
    },
    updateNode: (state, action: PayloadAction<{ id: string; data: Partial<WorkflowNode['data']> }>) => {
      const node = state.nodes.find((n) => n.id === action.payload.id)
      if (node) {
        node.data = { ...node.data, ...action.payload.data }
      }
    },
    removeNode: (state, action: PayloadAction<string>) => {
      state.history.past.push({ nodes: state.nodes, edges: state.edges })
      state.history.future = []
      state.nodes = state.nodes.filter((n) => n.id !== action.payload)
      state.edges = state.edges.filter(
        (e) => e.source !== action.payload && e.target !== action.payload
      )
      if (state.selectedNodeId === action.payload) {
        state.selectedNodeId = null
      }
    },
    
    // Edge operations
    setEdges: (state, action: PayloadAction<WorkflowEdge[]>) => {
      state.history.past.push({ nodes: state.nodes, edges: state.edges })
      state.history.future = []
      state.edges = action.payload
    },
    addEdge: (state, action: PayloadAction<WorkflowEdge>) => {
      state.history.past.push({ nodes: state.nodes, edges: state.edges })
      state.history.future = []
      state.edges.push(action.payload)
    },
    removeEdge: (state, action: PayloadAction<string>) => {
      state.history.past.push({ nodes: state.nodes, edges: state.edges })
      state.history.future = []
      state.edges = state.edges.filter((e) => e.id !== action.payload)
      if (state.selectedEdgeId === action.payload) {
        state.selectedEdgeId = null
      }
    },
    
    // Selection
    selectNode: (state, action: PayloadAction<string | null>) => {
      state.selectedNodeId = action.payload
      state.selectedEdgeId = null
    },
    selectEdge: (state, action: PayloadAction<string | null>) => {
      state.selectedEdgeId = action.payload
      state.selectedNodeId = null
    },
    clearSelection: (state) => {
      state.selectedNodeId = null
      state.selectedEdgeId = null
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
    setIsDraft: (state, action: PayloadAction<boolean>) => {
      state.isDraft = action.payload
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
    updateNodeStatus: (
      state,
      action: PayloadAction<{ nodeId: string; status: WorkflowNode['data']['status'] }>
    ) => {
      const node = state.nodes.find((n) => n.id === action.payload.nodeId)
      if (node) {
        node.data.status = action.payload.status
      }
    },
    
    // History
    undo: (state) => {
      if (state.history.past.length > 0) {
        const previous = state.history.past.pop()!
        state.history.future.push({ nodes: state.nodes, edges: state.edges })
        state.nodes = previous.nodes
        state.edges = previous.edges
      }
    },
    redo: (state) => {
      if (state.history.future.length > 0) {
        const next = state.history.future.pop()!
        state.history.past.push({ nodes: state.nodes, edges: state.edges })
        state.nodes = next.nodes
        state.edges = next.edges
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
  setEdges,
  addEdge,
  removeEdge,
  selectNode,
  selectEdge,
  clearSelection,
  setWorkflowId,
  setWorkflowName,
  setWorkflowDescription,
  setIsDraft,
  setZoom,
  setViewport,
  setIsExecuting,
  setExecutionId,
  updateNodeStatus,
  undo,
  redo,
  resetWorkflow,
  loadWorkflow,
} = workflowSlice.actions

export { workflowSlice }
