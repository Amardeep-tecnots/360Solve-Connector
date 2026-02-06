"use client"

import { useState, useMemo } from "react"
import {
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Timer,
  Search,
} from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { StatusBadge } from "@/components/shared/status-badge"
import { ExecutionDetailPanel } from "@/components/executions/execution-detail-panel"
import { executions } from "@/lib/mock-data"
import { formatDuration, getRelativeTime, cn } from "@/lib/utils"
import type { ExecutionStatus } from "@/lib/types"

const filterTabs: Array<{ label: string; value: ExecutionStatus | "all" }> = [
  { label: "All", value: "all" },
  { label: "Success", value: "success" },
  { label: "Failed", value: "failed" },
  { label: "Running", value: "running" },
  { label: "Pending", value: "pending" },
]

export default function ExecutionsPage() {
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return executions.filter((exec) => {
      const matchesSearch =
        search === "" ||
        exec.workflowName.toLowerCase().includes(search.toLowerCase())
      const matchesFilter =
        activeFilter === "all" || exec.status === activeFilter
      return matchesSearch && matchesFilter
    })
  }, [search, activeFilter])

  const selectedExecution = selectedId
    ? executions.find((e) => e.id === selectedId) || null
    : null

  // Compute stats
  const totalRuns = executions.length
  const successCount = executions.filter((e) => e.status === "success").length
  const failedCount = executions.filter((e) => e.status === "failed").length
  const avgDuration =
    executions
      .filter((e) => e.duration > 0)
      .reduce((sum, e) => sum + e.duration, 0) /
    (executions.filter((e) => e.duration > 0).length || 1)

  return (
    <div className="flex h-full">
      <div className={cn("mx-auto flex-1 max-w-7xl", selectedExecution && "max-w-5xl")}>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground text-balance">
            Execution Monitor
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track and debug workflow executions in real time
          </p>
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
            value={`${Math.round((successCount / totalRuns) * 100)}%`}
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
                    Trigger
                  </th>
                  <th className="hidden px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">
                    Records
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
                {filtered.map((exec) => (
                  <tr
                    key={exec.id}
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-muted/30",
                      selectedId === exec.id && "bg-primary/5"
                    )}
                    onClick={() => setSelectedId(exec.id)}
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-card-foreground">
                        {exec.workflowName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={exec.status} />
                    </td>
                    <td className="hidden px-6 py-4 sm:table-cell">
                      <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-medium capitalize text-muted-foreground">
                        {exec.triggeredBy}
                      </span>
                    </td>
                    <td className="hidden px-6 py-4 text-right md:table-cell">
                      <span className="text-sm tabular-nums text-muted-foreground">
                        {exec.recordsProcessed.toLocaleString()}
                      </span>
                    </td>
                    <td className="hidden px-6 py-4 text-right md:table-cell">
                      <span className="text-sm tabular-nums text-muted-foreground">
                        {exec.duration > 0
                          ? formatDuration(exec.duration)
                          : "--"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs text-muted-foreground">
                        {getRelativeTime(exec.startedAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <Clock className="mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                No executions found
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try adjusting your search or filter
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedExecution && (
        <ExecutionDetailPanel
          execution={selectedExecution}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  )
}
