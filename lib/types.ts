// ─── Status Types ─────────────────────────────────────
export type ConnectorStatus = "online" | "offline" | "warning" | "syncing"
export type ExecutionStatus = "success" | "failed" | "running" | "pending" | "cancelled"
export type WorkflowStatus = "active" | "inactive" | "draft"
export type NodeType = "extract" | "transform" | "load" | "trigger" | "condition"

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
  config: Record<string, unknown>
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
