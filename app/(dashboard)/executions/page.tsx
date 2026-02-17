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
  ChevronRight,
  Zap,
  TrendingUp,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from "lucide-react"
import { StatusBadge } from "@/components/shared/status-badge"
import { ExecutionDetailPanel } from "@/components/executions/execution-detail-panel"
import { formatDuration, getRelativeTime, cn } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { fetchExecutions, selectExecution, clearExecutionErrors } from "@/lib/store/slices/executions-slice"
import { fetchWorkflows } from "@/lib/store/slices/workflows-slice"
import { toast } from "sonner"
import type { ExecutionResponseDto } from "@/src/generated/api/api"

const filterTabs: Array<{ label: string; value: string; icon: React.ElementType }> = [
  { label: "All", value: "all", icon: BarChart3 },
  { label: "Completed", value: "COMPLETED", icon: CheckCircle },
  { label: "Failed", value: "FAILED", icon: XCircle },
  { label: "Running", value: "RUNNING", icon: Zap },
  { label: "Paused", value: "PAUSED", icon: Clock },
]

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
  const { workflows } = useAppSelector((state) => state.workflows)

  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState<string>("all")

  // Build a workflowId -> name lookup map
  const workflowNameMap = useMemo(() => {
    const map: Record<string, string> = {}
    for (const w of workflows) {
      map[w.id] = w.name
    }
    return map
  }, [workflows])

  useEffect(() => {
    dispatch(fetchWorkflows())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchExecutions({
      status: activeFilter === "all" ? undefined : activeFilter as any
    }))
  }, [dispatch, activeFilter])

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
      const workflowName = workflowNameMap[exec.workflowId] || exec.workflowId || "Unknown Workflow"
      const matchesSearch =
        search === "" ||
        workflowName.toLowerCase().includes(search.toLowerCase())
      return matchesSearch
    })
  }, [executions, search, workflowNameMap])

  const totalRuns = total || executions.length
  const successCount = executions.filter((e: any) => e.status === "COMPLETED").length
  const failedCount = executions.filter((e: any) => e.status === "FAILED").length
  const runningCount = executions.filter((e: any) => e.status === "RUNNING").length

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

  const successRate = totalRuns > 0 ? Math.round((successCount / totalRuns) * 100) : 0

  const handleRefresh = () => {
    dispatch(fetchExecutions({
      status: activeFilter === "all" ? undefined : activeFilter as any
    }))
  }

  return (
    <div className="flex h-full">
      <div className={cn(
        "flex-1 transition-all duration-300 overflow-y-auto",
        selectedExecution ? "mr-0" : ""
      )}>
        <div className={cn(
          "mx-auto px-6 py-8",
          selectedExecution ? "max-w-5xl" : "max-w-7xl"
        )}>
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                      Executions
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Monitor and manage workflow execution history
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleRefresh}
                disabled={listLoading}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-accent hover:shadow-md disabled:opacity-50"
              >
                {listLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Runs */}
            <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <BarChart3 className="h-4.5 w-4.5 text-primary" />
                </div>
                {runningCount > 0 && (
                  <span className="flex items-center gap-1 text-xs font-medium text-primary">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                    </span>
                    {runningCount} active
                  </span>
                )}
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold tabular-nums text-card-foreground">{totalRuns}</p>
                <p className="mt-0.5 text-xs font-medium text-muted-foreground">Total Executions</p>
              </div>
            </div>

            {/* Success Rate */}
            <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-success/20">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10">
                  <TrendingUp className="h-4.5 w-4.5 text-success" />
                </div>
                <span className="flex items-center gap-0.5 text-xs font-medium text-success">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  {successCount}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold tabular-nums text-card-foreground">{successRate}%</p>
                <p className="mt-0.5 text-xs font-medium text-muted-foreground">Success Rate</p>
              </div>
              {/* Mini progress bar */}
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-success transition-all duration-500"
                  style={{ width: `${successRate}%` }}
                />
              </div>
            </div>

            {/* Failed */}
            <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-destructive/20">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10">
                  <XCircle className="h-4.5 w-4.5 text-destructive" />
                </div>
                {failedCount > 0 && (
                  <span className="flex items-center gap-0.5 text-xs font-medium text-destructive">
                    <ArrowDownRight className="h-3.5 w-3.5" />
                    {failedCount}
                  </span>
                )}
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold tabular-nums text-card-foreground">{failedCount}</p>
                <p className="mt-0.5 text-xs font-medium text-muted-foreground">Failed Runs</p>
              </div>
            </div>

            {/* Avg Duration */}
            <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Timer className="h-4.5 w-4.5 text-primary" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold tabular-nums text-card-foreground">
                  {formatDuration(avgDuration)}
                </p>
                <p className="mt-0.5 text-xs font-medium text-muted-foreground">Avg Duration</p>
              </div>
            </div>
          </div>

          {/* Search + Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by workflow name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground shadow-sm placeholder:text-muted-foreground outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                aria-label="Search executions"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex gap-1 rounded-lg border border-border bg-card p-1 shadow-sm" role="tablist">
                {filterTabs.map((tab) => {
                  const TabIcon = tab.icon
                  return (
                    <button
                      key={tab.value}
                      role="tab"
                      aria-selected={activeFilter === tab.value}
                      onClick={() => setActiveFilter(tab.value)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                        activeFilter === tab.value
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <TabIcon className="h-3.5 w-3.5" />
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Workflow
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                    <th className="hidden px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">
                      Execution ID
                    </th>
                    <th className="hidden px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">
                      Duration
                    </th>
                    <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Started
                    </th>
                    <th className="w-10 px-3 py-3.5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {listLoading && filtered.length === 0 ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4">
                          <div className="h-4 w-32 animate-pulse rounded-md bg-muted"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-5 w-20 animate-pulse rounded-full bg-muted"></div>
                        </td>
                        <td className="hidden px-6 py-4 sm:table-cell">
                          <div className="h-4 w-16 animate-pulse rounded-md bg-muted"></div>
                        </td>
                        <td className="hidden px-6 py-4 md:table-cell">
                          <div className="ml-auto h-4 w-12 animate-pulse rounded-md bg-muted"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="ml-auto h-4 w-14 animate-pulse rounded-md bg-muted"></div>
                        </td>
                        <td className="w-10 px-3 py-4"></td>
                      </tr>
                    ))
                  ) : filtered.map((exec: any) => {
                    const duration = (exec.startedAt && exec.completedAt)
                      ? new Date(exec.completedAt).getTime() - new Date(exec.startedAt).getTime()
                      : 0
                    const isSelected = selectedExecution?.id === exec.id

                    return (
                      <tr
                        key={exec.id}
                        className={cn(
                          "group cursor-pointer transition-colors",
                          isSelected
                            ? "bg-primary/[0.04]"
                            : "hover:bg-muted/40"
                        )}
                        onClick={() => dispatch(selectExecution(exec))}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                              exec.status === "COMPLETED" && "bg-success/10",
                              exec.status === "FAILED" && "bg-destructive/10",
                              exec.status === "RUNNING" && "bg-primary/10",
                              (exec.status === "PAUSED" || exec.status === "CANCELLED") && "bg-muted",
                            )}>
                              <Zap className={cn(
                                "h-4 w-4",
                                exec.status === "COMPLETED" && "text-success",
                                exec.status === "FAILED" && "text-destructive",
                                exec.status === "RUNNING" && "text-primary",
                                (exec.status === "PAUSED" || exec.status === "CANCELLED") && "text-muted-foreground",
                              )} />
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-card-foreground">
                                  {workflowNameMap[exec.workflowId] || exec.workflowId}
                                </span>
                              <p className="mt-0.5 text-[11px] text-muted-foreground">
                                v{exec.workflowVersion || "1"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={mapStatus(exec.status)} />
                        </td>
                        <td className="hidden px-6 py-4 sm:table-cell">
                          <code className="rounded-md bg-muted/70 px-2 py-1 text-[11px] font-mono text-muted-foreground">
                            {exec.id.length > 12 ? `...${exec.id.slice(-8)}` : exec.id}
                          </code>
                        </td>
                        <td className="hidden px-6 py-4 text-right md:table-cell">
                          <span className="text-sm tabular-nums text-muted-foreground">
                            {duration > 0 ? formatDuration(duration) : (
                              exec.status === "RUNNING" ? (
                                <span className="inline-flex items-center gap-1 text-primary">
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  <span className="text-xs">Running</span>
                                </span>
                              ) : "--"
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-xs text-muted-foreground">
                            {getRelativeTime(exec.startedAt)}
                          </span>
                        </td>
                        <td className="w-10 px-3 py-4">
                          <ChevronRight className={cn(
                            "h-4 w-4 text-muted-foreground/40 transition-all",
                            "group-hover:text-muted-foreground group-hover:translate-x-0.5",
                            isSelected && "text-primary"
                          )} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {!listLoading && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50">
                  <Clock className="h-7 w-7 text-muted-foreground/60" />
                </div>
                <p className="mt-4 text-sm font-semibold text-foreground">
                  No executions found
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {search ? "Try adjusting your search query" : "Workflow runs will appear here once triggered"}
                </p>
              </div>
            )}

            {/* Footer with count */}
            {filtered.length > 0 && (
              <div className="border-t border-border bg-muted/20 px-6 py-3">
                <p className="text-xs text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{filtered.length}</span> of{" "}
                  <span className="font-medium text-foreground">{totalRuns}</span> executions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedExecution && (
        <ExecutionDetailPanel
            execution={selectedExecution as any}
            workflowName={workflowNameMap[(selectedExecution as any).workflowId] || (selectedExecution as any).workflowId}
            onClose={() => dispatch(selectExecution(null))}
          />
      )}
    </div>
  )
}
