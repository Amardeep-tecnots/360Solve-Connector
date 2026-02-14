"use client"

import { Activity, GitBranch, CheckCircle, AlertTriangle, Server, Clock } from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { ActivityTable } from "@/components/dashboard/activity-table"
import { ConnectorStatusCard } from "@/components/dashboard/connector-status-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { dashboardStats, recentActivities } from "@/lib/mock-data"
import { formatNumber, formatDuration } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { fetchConnectors } from "@/lib/store/slices/connector-slice"
import { useEffect } from "react"

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const { connectors, isLoading } = useAppSelector((state) => state.connector)

  // Create a display list of 4 connectors for the dashboard
  const displayConnectors = connectors.slice(0, 4)
  const onlineCount = connectors.filter(c => c.status === 'online').length

  useEffect(() => {
    dispatch(fetchConnectors())
  }, [dispatch])

  return (
    <div className="mx-auto max-w-7xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground text-balance">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your integration platform
        </p>
      </div>

      {/* Stats Row */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Workflows"
          value={dashboardStats.activeWorkflows}
          trend={{ direction: "up", value: "12%", label: "vs last week" }}
          icon={<GitBranch className="h-4 w-4" />}
          accentColor="primary"
        />
        <StatCard
          label="Success Rate"
          value={`${dashboardStats.successRate}%`}
          trend={{ direction: "up", value: "0.3%", label: "vs last week" }}
          icon={<CheckCircle className="h-4 w-4" />}
          accentColor="success"
        />
        <StatCard
          label="Failed (24h)"
          value={dashboardStats.failedLast24h}
          trend={{ direction: "down", value: "2", label: "vs yesterday" }}
          icon={<AlertTriangle className="h-4 w-4" />}
          accentColor="destructive"
        />
        <StatCard
          label="Avg Duration"
          value={formatDuration(dashboardStats.avgDuration)}
          trend={{ direction: "up", value: "8%", label: "faster" }}
          icon={<Clock className="h-4 w-4" />}
          accentColor="primary"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="flex flex-col gap-8">
          {/* Activity Table */}
          <ActivityTable activities={recentActivities} />

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
              {isLoading ? (
                <div className="col-span-2 py-8 text-center text-muted-foreground">Loading connectors...</div>
              ) : displayConnectors.length === 0 ? (
                <div className="col-span-2 py-8 text-center text-muted-foreground">No connectors found.</div>
              ) : (
                displayConnectors.map((connector) => (
                  <ConnectorStatusCard
                    key={connector.id}
                    connector={connector as any} // Cast to any to avoid type mismatch if mock types differ slightly
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
                  {formatNumber(dashboardStats.totalExecutions)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Records Processed</span>
                <span className="text-sm font-semibold text-card-foreground tabular-nums">
                  {formatNumber(dashboardStats.recordsProcessed)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Connectors</span>
                <span className="text-sm font-semibold text-card-foreground tabular-nums">
                  {onlineCount}/{connectors.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Installed Aggregators</span>
                <span className="text-sm font-semibold text-card-foreground tabular-nums">
                  5
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
