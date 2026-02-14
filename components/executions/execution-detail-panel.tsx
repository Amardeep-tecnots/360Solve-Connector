"use client"

import { X, RefreshCw, StopCircle, ExternalLink, Pause, Play, Loader2 } from "lucide-react"
import { StatusBadge } from "@/components/shared/status-badge"
import { formatDuration, getRelativeTime, cn } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { cancelExecution, pauseExecution, resumeExecution, triggerWorkflow } from "@/lib/store/slices/executions-slice"
import { toast } from "sonner"
import type { ExecutionResponseDto } from "@/src/generated/api/api"

interface ExecutionDetailPanelProps {
  execution: ExecutionResponseDto
  onClose: () => void
}

const logLevelStyles = {
  info: "text-info",
  warn: "text-warning",
  error: "text-destructive",
  debug: "text-muted-foreground",
}

export function ExecutionDetailPanel({
  execution,
  onClose,
}: ExecutionDetailPanelProps) {
  const dispatch = useAppDispatch()
  const { operationLoading } = useAppSelector((state) => state.executions)

  const handleCancel = async () => {
    try {
      await dispatch(cancelExecution({ id: execution.id, data: { reason: "User cancelled" } })).unwrap()
      toast.success("Execution cancelled")
    } catch (error) {
      // Error handled by slice/toast in page
    }
  }

  const handlePause = async () => {
    try {
      await dispatch(pauseExecution({ id: execution.id, data: { reason: "User paused" } })).unwrap()
      toast.success("Execution paused")
    } catch (error) {
    }
  }

  const handleResume = async () => {
    try {
      await dispatch(resumeExecution({ id: execution.id, data: {} })).unwrap()
      toast.success("Execution resumed")
    } catch (error) {
    }
  }

  const handleRetry = async () => {
    try {
      await dispatch(triggerWorkflow({ id: execution.workflowId, data: { immediate: true } })).unwrap()
      toast.success("Workflow triggered")
    } catch (error) {
    }
  }

  // Map API status to UI status
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

  const duration = (execution.startedAt && (execution as any).completedAt)
    ? new Date((execution as any).completedAt).getTime() - new Date(execution.startedAt).getTime()
    : 0

  return (
    <div className="flex w-96 shrink-0 flex-col border-l border-border bg-card shadow-lg animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-card-foreground">
            {(execution as any).workflowName || execution.workflowId}
          </h2>
          <p className="mt-0.5 text-[10px] font-mono text-muted-foreground">
            {execution.id}
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Close panel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Overview */}
      <div className="border-b border-border px-5 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </p>
            <div className="mt-1">
              <StatusBadge status={mapStatus(execution.status)} size="md" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Version
            </p>
            <p className="mt-1 text-sm font-medium text-card-foreground">
              v{execution.workflowVersion}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Duration
            </p>
            <p className="mt-1 text-sm font-medium tabular-nums text-card-foreground">
              {duration > 0
                ? formatDuration(duration)
                : execution.status === 'RUNNING' ? "In progress..." : "--"}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Started
            </p>
            <p className="mt-1 text-xs font-medium text-card-foreground">
              {getRelativeTime(execution.startedAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 border-b border-border px-5 py-3 bg-muted/30">
        {execution.status === "FAILED" && (
          <button
            onClick={handleRetry}
            disabled={operationLoading}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {operationLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
            Retry
          </button>
        )}

        {execution.status === "RUNNING" && (
          <>
            <button
              onClick={handlePause}
              disabled={operationLoading}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent disabled:opacity-50"
            >
              <Pause className="h-3 w-3" />
              Pause
            </button>
            <button
              onClick={handleCancel}
              disabled={operationLoading}
              className="inline-flex items-center gap-1.5 rounded-md bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:opacity-50"
            >
              <StopCircle className="h-3 w-3" />
              Cancel
            </button>
          </>
        )}

        {execution.status === "PAUSED" && (
          <>
            <button
              onClick={handleResume}
              disabled={operationLoading}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              <Play className="h-3 w-3" />
              Resume
            </button>
            <button
              onClick={handleCancel}
              disabled={operationLoading}
              className="inline-flex items-center gap-1.5 rounded-md bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:opacity-50"
            >
              <StopCircle className="h-3 w-3" />
              Cancel
            </button>
          </>
        )}

        <button className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent whitespace-nowrap">
          <ExternalLink className="h-3 w-3" />
          View Data
        </button>
      </div>

      {/* Logs */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="px-5 py-3 border-b border-border/50">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Activity History
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto bg-foreground/[0.02] px-4 py-3">
          <div className="flex flex-col gap-3">
            {(!execution.activities || execution.activities.length === 0) ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-[10px] text-muted-foreground italic">No activities recorded yet</p>
              </div>
            ) : (
              execution.activities.map((activity: any, idx) => (
                <div key={idx} className="flex gap-2 text-[11px] font-mono leading-relaxed">
                  <span className="shrink-0 tabular-nums text-muted-foreground opacity-70">
                    {idx + 1}.
                  </span>
                  <span className="text-card-foreground break-words">{typeof activity === 'string' ? activity : JSON.stringify(activity)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
