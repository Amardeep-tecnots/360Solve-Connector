"use client"

import { ArrowRight } from "lucide-react"
import { StatusBadge } from "@/components/shared/status-badge"
import { formatDuration, getRelativeTime } from "@/lib/utils"
import type { Activity } from "@/lib/types"

interface ActivityTableProps {
  activities: Activity[]
}

export function ActivityTable({ activities }: ActivityTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 className="text-sm font-semibold text-card-foreground">Recent Activity</h2>
        <a
          href="/executions"
          className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
        >
          View all
        </a>
      </div>
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
              <th className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">
                Route
              </th>
              <th className="hidden px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">
                Records
              </th>
              <th className="hidden px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">
                Duration
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {activities.map((activity) => (
              <tr
                key={activity.id}
                className="cursor-pointer transition-colors hover:bg-muted/30"
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-card-foreground">
                    {activity.workflowName}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={activity.status} />
                </td>
                <td className="hidden px-6 py-4 md:table-cell">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{activity.source}</span>
                    <ArrowRight className="h-3 w-3" />
                    <span>{activity.destination}</span>
                  </div>
                </td>
                <td className="hidden px-6 py-4 text-right sm:table-cell">
                  <span className="text-sm tabular-nums text-muted-foreground">
                    {activity.recordsProcessed.toLocaleString()}
                  </span>
                </td>
                <td className="hidden px-6 py-4 text-right sm:table-cell">
                  <span className="text-sm tabular-nums text-muted-foreground">
                    {activity.duration > 0 ? formatDuration(activity.duration) : "--"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-xs text-muted-foreground">
                    {getRelativeTime(activity.startedAt)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
