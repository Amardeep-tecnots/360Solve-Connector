"use client"

import { X, RefreshCw, StopCircle, ExternalLink } from "lucide-react"
import { StatusBadge } from "@/components/shared/status-badge"
import { formatDuration, getRelativeTime, cn } from "@/lib/utils"
import type { Execution } from "@/lib/types"

interface ExecutionDetailPanelProps {
  execution: Execution
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
  return (
    <div className="flex w-96 shrink-0 flex-col border-l border-border bg-card shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-card-foreground">
            {execution.workflowName}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
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
              <StatusBadge status={execution.status} size="md" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Triggered By
            </p>
            <p className="mt-1 text-sm font-medium capitalize text-card-foreground">
              {execution.triggeredBy}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Duration
            </p>
            <p className="mt-1 text-sm font-medium tabular-nums text-card-foreground">
              {execution.duration > 0
                ? formatDuration(execution.duration)
                : "In progress..."}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Records
            </p>
            <p className="mt-1 text-sm font-medium tabular-nums text-card-foreground">
              {execution.recordsProcessed.toLocaleString()}
              {execution.recordsFailed > 0 && (
                <span className="text-destructive">
                  {" "}
                  ({execution.recordsFailed} failed)
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 border-b border-border px-5 py-3">
        {execution.status === "failed" && (
          <button className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            <RefreshCw className="h-3 w-3" />
            Retry
          </button>
        )}
        {execution.status === "running" && (
          <button className="inline-flex items-center gap-1.5 rounded-md bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground transition-colors hover:bg-destructive/90">
            <StopCircle className="h-3 w-3" />
            Cancel
          </button>
        )}
        <button className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent">
          <ExternalLink className="h-3 w-3" />
          View Data
        </button>
      </div>

      {/* Logs */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="px-5 py-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Execution Logs
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto bg-foreground/[0.03] px-4 py-3">
          <div className="flex flex-col gap-2">
            {execution.logs.map((log) => (
              <div key={log.id} className="flex gap-2 text-[11px] font-mono">
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  {log.timestamp.toLocaleTimeString()}
                </span>
                <span
                  className={cn(
                    "shrink-0 w-10 font-semibold uppercase",
                    logLevelStyles[log.level]
                  )}
                >
                  {log.level}
                </span>
                <span className="text-card-foreground">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
