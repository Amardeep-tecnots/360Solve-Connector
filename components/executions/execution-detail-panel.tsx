"use client"

import {
  X,
  RefreshCw,
  StopCircle,
  ExternalLink,
  Pause,
  Play,
  Loader2,
  Clock,
  Timer,
  Hash,
  GitBranch,
  Calendar,
  CheckCircle,
  XCircle,
  Zap,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react"
import { useState } from "react"
import { StatusBadge } from "@/components/shared/status-badge"
import { formatDuration, getRelativeTime, cn } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { cancelExecution, pauseExecution, resumeExecution, triggerWorkflow } from "@/lib/store/slices/executions-slice"
import { toast } from "sonner"
import type { ExecutionResponseDto } from "@/src/generated/api/api"

interface ExecutionDetailPanelProps {
  execution: ExecutionResponseDto
  workflowName?: string
  onClose: () => void
}

const mapStatus = (status: string): any => {
  switch (status) {
    case 'COMPLETED': return 'success'
    case 'FAILED': return 'failed'
    case 'RUNNING': return 'running'
    case 'PAUSED': return 'pending'
    case 'CANCELLED': return 'cancelled'
    default: return 'pending'
  }
}

const statusConfig: Record<string, { color: string; bgColor: string; icon: React.ElementType; label: string }> = {
  COMPLETED: { color: "text-success", bgColor: "bg-success/10", icon: CheckCircle, label: "Completed" },
  FAILED: { color: "text-destructive", bgColor: "bg-destructive/10", icon: XCircle, label: "Failed" },
  RUNNING: { color: "text-primary", bgColor: "bg-primary/10", icon: Zap, label: "Running" },
  PAUSED: { color: "text-warning", bgColor: "bg-warning/10", icon: Pause, label: "Paused" },
  CANCELLED: { color: "text-muted-foreground", bgColor: "bg-muted", icon: StopCircle, label: "Cancelled" },
}

export function ExecutionDetailPanel({
  execution,
  workflowName,
  onClose,
}: ExecutionDetailPanelProps) {
  const dispatch = useAppDispatch()
  const { operationLoading } = useAppSelector((state) => state.executions)
  const [copiedId, setCopiedId] = useState(false)

  const handleCancel = async () => {
    try {
      await dispatch(cancelExecution({ id: execution.id, data: { reason: "User cancelled" } })).unwrap()
      toast.success("Execution cancelled")
    } catch (error) {}
  }

  const handlePause = async () => {
    try {
      await dispatch(pauseExecution({ id: execution.id, data: { reason: "User paused" } })).unwrap()
      toast.success("Execution paused")
    } catch (error) {}
  }

  const handleResume = async () => {
    try {
      await dispatch(resumeExecution({ id: execution.id, data: {} })).unwrap()
      toast.success("Execution resumed")
    } catch (error) {}
  }

  const handleRetry = async () => {
    try {
      await dispatch(triggerWorkflow({ id: execution.workflowId, data: { immediate: true } })).unwrap()
      toast.success("Workflow triggered")
    } catch (error) {}
  }

  const handleCopyId = () => {
    navigator.clipboard.writeText(execution.id)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

  const duration = (execution.startedAt && (execution as any).completedAt)
    ? new Date((execution as any).completedAt).getTime() - new Date(execution.startedAt).getTime()
    : 0

  const config = statusConfig[execution.status] || statusConfig.PAUSED
  const StatusIcon = config.icon

  return (
    <div className="flex w-[420px] max-w-full shrink-0 flex-col border-l border-border bg-card shadow-2xl animate-in slide-in-from-right duration-300 h-full max-h-screen overflow-hidden">
        {/* Header */}
        <div className="border-b border-border px-6 py-5 shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5">
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", config.bgColor)}>
                <StatusIcon className={cn("h-4.5 w-4.5", config.color, execution.status === "RUNNING" && "animate-pulse")} />
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold text-card-foreground">
                    {workflowName || execution.workflowId}
                  </h2>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <StatusBadge status={mapStatus(execution.status)} size="sm" />
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {/* Status Banner */}
          <div className={cn("mx-6 mt-5 rounded-xl p-4", config.bgColor)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <StatusIcon className={cn("h-5 w-5", config.color, execution.status === "RUNNING" && "animate-pulse")} />
              <div>
                <p className={cn("text-sm font-bold", config.color)}>{config.label}</p>
                <p className="text-[11px] text-muted-foreground">
                  {execution.status === "RUNNING" ? "Execution in progress..." :
                   execution.status === "COMPLETED" ? "Completed successfully" :
                   execution.status === "FAILED" ? "Execution encountered an error" :
                   execution.status === "PAUSED" ? "Execution is paused" :
                   "Execution was cancelled"}
                </p>
              </div>
            </div>
            {execution.status === "RUNNING" && (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            )}
          </div>
        </div>

        {/* Error Details (for failed executions) */}
        {execution.status === "FAILED" && execution.errorMessage && (
          <div className="mx-6 mt-4">
            <h3 className="mb-2 text-[11px] font-bold uppercase tracking-widest text-destructive">
              Error Details
            </h3>
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                  <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-destructive">Execution Failed</p>
                  <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-destructive/5 p-3 font-mono text-[11px] leading-relaxed text-destructive/90">
                    {execution.errorMessage}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Details Grid */}
      <div className="mx-6 mt-5">
        <h3 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          Details
        </h3>
        <div className="space-y-1">
          {/* Execution ID */}
          <div className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50">
            <div className="flex items-center gap-2.5">
              <Hash className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Execution ID</span>
            </div>
            <div className="flex items-center gap-1.5">
              <code className="text-[11px] font-mono text-card-foreground">
                {execution.id.length > 16 ? `${execution.id.slice(0, 8)}...${execution.id.slice(-6)}` : execution.id}
              </code>
              <button
                onClick={handleCopyId}
                className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {copiedId ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
          </div>

          {/* Version */}
          <div className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50">
            <div className="flex items-center gap-2.5">
              <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Version</span>
            </div>
            <span className="rounded-md bg-muted/70 px-2 py-0.5 text-xs font-semibold text-card-foreground">
              v{execution.workflowVersion}
            </span>
          </div>

          {/* Duration */}
          <div className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50">
            <div className="flex items-center gap-2.5">
              <Timer className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Duration</span>
            </div>
            <span className="text-xs font-semibold tabular-nums text-card-foreground">
              {duration > 0
                ? formatDuration(duration)
                : execution.status === 'RUNNING' ? (
                    <span className="inline-flex items-center gap-1.5 text-primary">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      In progress
                    </span>
                  ) : "--"}
            </span>
          </div>

          {/* Started */}
          <div className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50">
            <div className="flex items-center gap-2.5">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Started</span>
            </div>
            <span className="text-xs font-medium text-card-foreground">
              {getRelativeTime(execution.startedAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mx-6 mt-5">
        <h3 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          Actions
        </h3>
        <div className="flex flex-wrap gap-2">
          {execution.status === "FAILED" && (
            <button
              onClick={handleRetry}
              disabled={operationLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md disabled:opacity-50"
            >
              {operationLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
              Retry Execution
            </button>
          )}

          {execution.status === "RUNNING" && (
            <>
              <button
                onClick={handlePause}
                disabled={operationLoading}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-sm transition-all hover:bg-accent hover:shadow-md disabled:opacity-50"
              >
                <Pause className="h-3.5 w-3.5" />
                Pause
              </button>
              <button
                onClick={handleCancel}
                disabled={operationLoading}
                className="inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-xs font-semibold text-destructive-foreground shadow-sm transition-all hover:bg-destructive/90 hover:shadow-md disabled:opacity-50"
              >
                <StopCircle className="h-3.5 w-3.5" />
                Cancel
              </button>
            </>
          )}

          {execution.status === "PAUSED" && (
            <>
              <button
                onClick={handleResume}
                disabled={operationLoading}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md disabled:opacity-50"
              >
                <Play className="h-3.5 w-3.5" />
                Resume
              </button>
              <button
                onClick={handleCancel}
                disabled={operationLoading}
                className="inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-xs font-semibold text-destructive-foreground shadow-sm transition-all hover:bg-destructive/90 hover:shadow-md disabled:opacity-50"
              >
                <StopCircle className="h-3.5 w-3.5" />
                Cancel
              </button>
            </>
          )}

          <button className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-xs font-medium text-foreground shadow-sm transition-all hover:bg-accent hover:shadow-md whitespace-nowrap">
            <ExternalLink className="h-3.5 w-3.5" />
            View Data
          </button>
        </div>
      </div>

        {/* Activity Timeline */}
        <div className="mt-5 border-t border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Activity Timeline
            </h3>
            {execution.activities && execution.activities.length > 0 && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                {execution.activities.length}
              </span>
            )}
          </div>
          <div className="px-6 pb-6">
            {(!execution.activities || execution.activities.length === 0) ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/50">
                  <Clock className="h-5 w-5 text-muted-foreground/50" />
                </div>
                <p className="mt-3 text-xs font-medium text-muted-foreground">
                  No activities recorded yet
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground/70">
                  Activities will appear here as the execution progresses
                </p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
                <div className="space-y-4">
                  {execution.activities.map((activity: any, idx) => (
                    <div key={idx} className="relative flex gap-3">
                      <div className={cn(
                        "relative z-10 mt-1 flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full border-2",
                        idx === 0
                          ? "border-primary bg-primary/20"
                          : "border-border bg-card"
                      )}>
                        <div className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          idx === 0 ? "bg-primary" : "bg-muted-foreground/40"
                        )} />
                      </div>
                      <div className="flex-1 rounded-lg bg-muted/30 px-3 py-2">
                        <p className="text-[11px] font-mono leading-relaxed text-card-foreground">
                          {typeof activity === 'string' ? activity : JSON.stringify(activity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        </div>{/* end scrollable content */}
      </div>
    )
  }
