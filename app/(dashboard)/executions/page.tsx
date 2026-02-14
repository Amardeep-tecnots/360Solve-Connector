"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Timer,
  Search,
  RefreshCw,
  Loader2,
} from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { StatusBadge } from "@/components/shared/status-badge"
import { ExecutionDetailPanel } from "@/components/executions/execution-detail-panel"
import { formatDuration, getRelativeTime, cn } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { fetchExecutions, selectExecution, clearExecutionErrors } from "@/lib/store/slices/executions-slice"
import { toast } from "sonner"
import type { ExecutionResponseDto } from "@/src/generated/api/api"

const filterTabs: Array<{ label: string; value: string }> = [
  { label: "All", value: "all" },
  { label: "Success", value: "COMPLETED" },
  { label: "Failed", value: "FAILED" },
  { label: "Running", value: "RUNNING" },
  { label: "Paused", value: "PAUSED" },
]

export default function ExecutionsPage() {
  const dispatch = useAppDispatch()
  const {
    executions,
    total,
    listLoading,
    listError,
    selectedExecution,
    operationLoading,
    operationError
  } = useAppSelector((state) => state.executions)

  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState<string>("all")

  // Fetch executions on mount and when filter changes
  useEffect(() => {
    dispatch(fetchExecutions({
      status: activeFilter === "all" ? undefined : activeFilter as any
    }))
  }, [dispatch, activeFilter])

  // Handle errors
  useEffect(() => {
    if (listError) {
      toast.error("Failed to load executions", { description: listError })
      dispatch(clearExecutionErrors())
    }
    if (operationError) {
      toast.error("Operation failed", { description: operationError })
      dispatch(clearExecutionErrors())
    }
  }, [listError, operationError, dispatch])

  const filtered = useMemo(() => {
    return (executions as any[]).filter((exec: any) => {
      const workflowName = exec.workflowName || exec.workflowId || "Unknown Workflow"
      const matchesSearch =
        search === "" ||
        workflowName.toLowerCase().includes(search.toLowerCase())
      return matchesSearch
    })
  }, [executions, search])

  // Compute stats from local list (ideally would come from API as overview)
  const totalRuns = total || executions.length
  const successCount = executions.filter((e: any) => e.status === "COMPLETED").length
  const failedCount = executions.filter((e: any) => e.status === "FAILED").length

  // Calculate average duration logic (approximate if field names differ)
  const durations = executions
    .map((e: any) => {
      if (e.startedAt && e.completedAt) {
        return new Date(e.completedAt).getTime() - new Date(e.startedAt).getTime()
      }
      return 0
    })
    .filter(d => d > 0)

  const avgDuration = durations.length > 0
    ? durations.reduce((sum, d) => sum + d, 0) / durations.length
    : 0

  const handleRefresh = () => {
    dispatch(fetchExecutions({
      status: activeFilter === "all" ? undefined : activeFilter as any
    }))
  }

  // Map API status to UI status for StatusBadge
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

  return (
    <div className="flex h-full">
      <div className={cn("mx-auto flex-1 max-w-7xl", selectedExecution && "max-w-5xl transition-all duration-300")}>
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground text-balance">
              Execution Monitor
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track and debug workflow executions in real time
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={listLoading}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50"
          >
            {listLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </button>
        </div>

        {/* Stats Row */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Runs"
            value={totalRuns}
            icon={<Activity className="h-4 w-4" />}
            accentColor="primary"
          />
          <StatCard
            label="Success Rate"
            value={totalRuns > 0 ? `${Math.round((successCount / totalRuns) * 100)}%` : '0%'}
            icon={<CheckCircle className="h-4 w-4" />}
            accentColor="success"
          />
          <StatCard
            label="Failed"
            value={failedCount}
            icon={<XCircle className="h-4 w-4" />}
            accentColor="destructive"
          />
          <StatCard
            label="Avg Duration"
            value={formatDuration(avgDuration)}
            icon={<Timer className="h-4 w-4" />}
            accentColor="primary"
          />
        </div>

        {/* Search + Filters */}
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full max-w-sm items-center gap-2 rounded-md border border-border bg-card px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search executions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              aria-label="Search executions"
            />
          </div>

          <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-card p-1" role="tablist">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                role="tab"
                aria-selected={activeFilter === tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  activeFilter === tab.value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Workflow
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">
                    ID
                  </th>
                  <th className="hidden px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Started
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {listLoading && filtered.length === 0 ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-4 h-12 bg-muted/20"></td>
                    </tr>
                  ))
                ) : filtered.map((exec: any) => {
                  const duration = (exec.startedAt && exec.completedAt)
                    ? new Date(exec.completedAt).getTime() - new Date(exec.startedAt).getTime()
                    : 0

                  return (
                    <tr
                      key={exec.id}
                      className={cn(
                        "cursor-pointer transition-colors hover:bg-muted/30",
                        selectedExecution?.id === exec.id && "bg-primary/5"
                      )}
                      onClick={() => dispatch(selectExecution(exec))}
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-card-foreground">
                          {exec.workflowName || exec.workflowId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={mapStatus(exec.status)} />
                      </td>
                      <td className="hidden px-6 py-4 sm:table-cell">
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                          {exec.id.split('-').pop()}
                        </span>
                      </td>
                      <td className="hidden px-6 py-4 text-right md:table-cell">
                        <span className="text-sm tabular-nums text-muted-foreground">
                          {duration > 0 ? formatDuration(duration) : "--"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs text-muted-foreground">
                          {getRelativeTime(exec.startedAt)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {!listLoading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <Clock className="mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                No executions found
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {search ? "Try adjusting your search" : "Workflow runs will appear here"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedExecution && (
        <ExecutionDetailPanel
          execution={selectedExecution as any}
          onClose={() => dispatch(selectExecution(null))}
        />
      )}
    </div>
  )
}
