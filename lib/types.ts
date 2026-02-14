// ─── Status Types ─────────────────────────────────────
export type ConnectorStatus = "online" | "offline" | "warning" | "syncing" | "error" | "connecting" | "busy"
export type ExecutionStatus = "success" | "failed" | "running" | "pending" | "cancelled"
export type WorkflowStatus = "active" | "inactive" | "draft"

// ─── Node Types (Zapier-like: Source → Transform → Destination) ────
export type NodeType = "source" | "transform" | "destination"

// Connection method for Source/Destination nodes
export type ConnectionMethod =
  | "credentials"       // Direct DB credentials (host, port, user, pass, db)
  | "connection_string"  // Raw connection string (postgres://..., mongodb://..., etc.)
  | "aggregator"        // Pre-built aggregator from marketplace (with auth)
  | "custom_api"        // User-created REST/GraphQL API endpoint

export interface ConnectionConfig {
  method: ConnectionMethod
  // For credentials
  host?: string
  port?: number
  username?: string
  password?: string
  database?: string
  dbType?: "postgresql" | "mysql" | "mongodb" | "oracle" | "mssql" | "snowflake" | "bigquery"
  // For connection_string
  connectionString?: string
  // For aggregator
  aggregatorId?: string
  aggregatorName?: string
  apiKey?: string
  // For custom_api
  endpoint?: string
  method_type?: "GET" | "POST" | "PUT" | "PATCH"
  headers?: Record<string, string>
  authType?: "bearer" | "api_key" | "basic" | "none"
  authToken?: string
}

// ─── Stat Card ────────────────────────────────────────
export interface StatCardData {
  label: string
  value: string | number
  trend?: {
    direction: "up" | "down"
    value: string
    label: string
  }
  icon?: React.ReactNode
}

// ─── Activity ─────────────────────────────────────────
export interface Activity {
  id: string
  workflowName: string
  status: ExecutionStatus
  startedAt: Date
  duration: number // ms
  recordsProcessed: number
  source: string
  destination: string
}

// ─── Aggregator / Connector ───────────────────────────
export type AggregatorCategory = "ERP" | "CRM" | "Database" | "Cloud" | "Analytics" | "Communication"

export interface Aggregator {
  id: string
  installedId?: string
  name: string
  description: string
  category: AggregatorCategory
  logoUrl: string
  version: string
  installs: number
  rating: number
  isInstalled: boolean
  author: string
  tags: string[]
  aggregatorName?: string
  aggregatorDescription?: string
  connectionMethod?: string
  configSchema?: {
    authType?: "api_key" | "oauth" | "basic" | "connection_string"
    fields: Array<{
      name: string
      label: string
      type: "text" | "password" | "url" | "select"
      required: boolean
      options?: string[]
    }>
  }
}

// ─── Mini Connector ───────────────────────────────────
export interface MiniConnector {
  id: string
  name: string
  status: ConnectorStatus
  ipAddress: string
  version: string
  lastSeen: Date
  os: "windows" | "linux" | "macos"
  cpuUsage: number
  memoryUsage: number
  activeWorkflows: number
}

// ─── Workflow ─────────────────────────────────────────
export interface Workflow {
  id: string
  name: string
  description: string
  status: WorkflowStatus
  lastRun: Date | null
  nextRun: Date | null
  successRate: number
  totalRuns: number
  createdAt: Date
  updatedAt: Date
}

// ─── Workflow Node ────────────────────────────────────
export interface WorkflowNode {
  id: string
  type: NodeType
  label: string
  description: string
  icon: string
  config: ConnectionConfig
}

// ─── Canvas Node (runtime) ────────────────────────────
export interface CanvasNode {
  id: string
  type: NodeType
  label: string
  description: string
  icon: string
  x: number
  y: number
  connectionConfig?: ConnectionConfig
  transformConfig?: TransformConfig
}

export interface TransformConfig {
  logic: string
  aiAssisted: boolean
  skipNulls: boolean
  fieldMappings: Array<{ from: string; to: string; transform?: string }>
}

export interface CanvasConnection {
  from: string
  to: string
}

// ─── AI Chat Messages ─────────────────────────────────
export interface AIChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  action?: {
    type: "add_node" | "connect_nodes" | "configure_node" | "suggest_workflow"
    payload: Record<string, unknown>
  }
}

// ─── Execution ────────────────────────────────────────
export interface Execution {
  id: string
  workflowId: string
  workflowName: string
  status: ExecutionStatus
  startedAt: Date
  completedAt: Date | null
  duration: number
  recordsProcessed: number
  recordsFailed: number
  triggeredBy: "schedule" | "manual" | "webhook"
  logs: ExecutionLog[]
}

export interface ExecutionLog {
  id: string
  timestamp: Date
  level: "info" | "warn" | "error" | "debug"
  message: string
  metadata?: Record<string, unknown>
}

// ─── API Response ─────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
  meta?: {
    page?: number
    total?: number
  }
}

// ─── Navigation ───────────────────────────────────────
export interface NavItem {
  label: string
  href: string
  icon: string
  badge?: string | number
}

// ─── Palette Node (for drag-and-drop) ─────────────────
export interface PaletteNode {
  id: string
  type: NodeType
  label: string
  description: string
  icon: string
  connectionMethod?: ConnectionMethod
}
