"use client"

import { GitBranch, CheckCircle, AlertTriangle, Clock, Loader2 } from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { ActivityTable } from "@/components/dashboard/activity-table"
import { ConnectorStatusCard } from "@/components/dashboard/connector-status-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { formatNumber, formatDuration } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { fetchConnectors } from "@/lib/store/slices/connector-slice"
import { fetchWorkflows } from "@/lib/store/slices/workflows-slice"
import { fetchExecutions } from "@/lib/store/slices/executions-slice"
import { fetchInstalled } from "@/lib/store/slices/aggregators-slice"
import { useEffect, useMemo } from "react"

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const { connectors, isLoading: connectorsLoading } = useAppSelector((state) => state.connector)
  const { workflows, listLoading: workflowsLoading } = useAppSelector((state) => state.workflows)
  const { executions, listLoading: executionsLoading } = useAppSelector((state) => state.executions)
  const { installed, installedLoading: aggregatorsLoading } = useAppSelector((state) => state.aggregators)

  // Fetch all data on mount
  useEffect(() => {
    dispatch(fetchConnectors())
    dispatch(fetchWorkflows('all'))
    dispatch(fetchExecutions({}))
    dispatch(fetchInstalled())
  }, [dispatch])

  // Calculate stats from real data
  const stats = useMemo(() => {
    const activeWorkflows = workflows.filter(w => w.status === 'active').length
    const totalWorkflows = workflows.length
    
    // Calculate success rate from executions
    const completedExecutions = executions.filter(e => e.status === 'COMPLETED')
    const failedExecutions = executions.filter(e => e.status === 'FAILED')
    const totalCompleted = completedExecutions.length + failedExecutions.length
    const successRate = totalCompleted > 0 
      ? Math.round((completedExecutions.length / totalCompleted) * 1000) / 10 
      : 0
    
    // Failed in last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const failedLast24h = executions.filter(e => 
      e.status === 'FAILED' && e.startedAt && new Date(e.startedAt) > oneDayAgo
    ).length
    
    // Average duration
    const completedWithDuration = executions.filter(e => e.status === 'COMPLETED' && e.startedAt && (e as any).completedAt)
    const avgDuration = completedWithDuration.length > 0 
      ? completedWithDuration.reduce((sum, e) => {
          const duration = new Date((e as any).completedAt).getTime() - new Date(e.startedAt).getTime()
          return sum + duration
        }, 0) / completedWithDuration.length
      : 0

    // Total executions
    const totalExecutions = executions.length

    // Records processed (sum from completed executions)
    const recordsProcessed = completedExecutions.reduce((sum, e) => sum + ((e as any).recordsProcessed || 0), 0)

    // Online connectors
    const onlineCount = connectors.filter(c => c.status === 'online').length

    return {
      activeWorkflows,
      totalWorkflows,
      successRate,
      failedLast24h,
      avgDuration,
      totalExecutions,
      recordsProcessed,
      onlineCount,
      totalConnectors: connectors.length,
      installedAggregators: installed.length,
    }
  }, [workflows, executions, connectors, installed])

  const isLoading = connectorsLoading || workflowsLoading || executionsLoading || aggregatorsLoading

  // Display connectors (up to 4)
  const displayConnectors = connectors.slice(0, 4)

  // Recent executions for activity table (last 10)
  const recentExecutions = useMemo(() => {
    // Create a copy before sorting to avoid mutating Redux state
    return [...executions]
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
      .slice(0, 10)
      .map(exec => ({
        id: exec.id,
        workflowName: exec.workflowId,
        status: (exec.status === 'COMPLETED' ? 'success' : exec.status === 'FAILED' ? 'failed' : exec.status === 'RUNNING' ? 'running' : 'pending') as any,
        startedAt: new Date(exec.startedAt),
        duration: exec.startedAt && (exec as any).completedAt 
          ? new Date((exec as any).completedAt).getTime() - new Date(exec.startedAt).getTime()
          : 0,
        recordsProcessed: (exec as any).recordsProcessed || 0,
        source: 'Source',
        destination: 'Destination',
      }))
  }, [executions])

  return (
    <div className="mx-auto max-w-7xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground text-balance">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your integration platform
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading dashboard...</span>
        </div>
      ) : (
        <>
          {/* Stats Row */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Active Workflows"
              value={stats.activeWorkflows}
              trend={{ direction: "up", value: `${stats.totalWorkflows}`, label: "total workflows" }}
              icon={<GitBranch className="h-4 w-4" />}
              accentColor="primary"
            />
            <StatCard
              label="Success Rate"
              value={`${stats.successRate}%`}
              trend={{ direction: stats.successRate >= 90 ? "up" : "down", value: `${stats.totalExecutions}`, label: "total runs" }}
              icon={<CheckCircle className="h-4 w-4" />}
              accentColor="success"
            />
            <StatCard
              label="Failed (24h)"
              value={stats.failedLast24h}
              trend={{ direction: stats.failedLast24h === 0 ? "up" : "down", value: "24h", label: "time window" }}
              icon={<AlertTriangle className="h-4 w-4" />}
              accentColor="destructive"
            />
            <StatCard
              label="Avg Duration"
              value={formatDuration(stats.avgDuration)}
              trend={{ direction: "up", value: "ms", label: "average" }}
              icon={<Clock className="h-4 w-4" />}
              accentColor="primary"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
            <div className="flex flex-col gap-8">
              {/* Activity Table */}
              <ActivityTable activities={recentExecutions} />

              {/* Connectors Section */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground">
                    Mini Connectors
                  </h2>
                  <a
                    href="/connectors"
                    className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    Manage all
                  </a>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {displayConnectors.length === 0 ? (
                    <div className="col-span-2 py-8 text-center text-muted-foreground">No connectors found.</div>
                  ) : (
                    displayConnectors.map((connector) => (
                      <ConnectorStatusCard
                        key={connector.id}
                        connector={connector as any}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Quick Actions + Summary */}
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="mb-3 text-sm font-semibold text-foreground">
                  Quick Actions
                </h2>
                <QuickActions />
              </div>

              {/* Summary Card */}
              <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Platform Summary
                </h3>
                <div className="mt-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Executions</span>
                    <span className="text-sm font-semibold text-card-foreground tabular-nums">
                      {formatNumber(stats.totalExecutions)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Records Processed</span>
                    <span className="text-sm font-semibold text-card-foreground tabular-nums">
                      {formatNumber(stats.recordsProcessed)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Connectors</span>
                    <span className="text-sm font-semibold text-card-foreground tabular-nums">
                      {stats.onlineCount}/{stats.totalConnectors}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Installed Aggregators</span>
                    <span className="text-sm font-semibold text-card-foreground tabular-nums">
                      {stats.installedAggregators}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
