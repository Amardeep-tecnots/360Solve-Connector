import { Cpu, HardDrive, GitBranch } from "lucide-react"
import { StatusBadge } from "@/components/shared/status-badge"
import { getRelativeTime, cn } from "@/lib/utils"
import type { MiniConnector } from "@/lib/types"

interface ConnectorStatusCardProps {
  connector: MiniConnector
}

export function ConnectorStatusCard({ connector }: ConnectorStatusCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-card-foreground">
            {connector.name}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {connector.ipAddress} &middot; v{connector.version}
          </p>
        </div>
        <StatusBadge status={connector.status} />
      </div>

      {connector.status !== "offline" && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          {/* CPU */}
          <div className="flex flex-col items-center gap-1">
            <Cpu className="h-3.5 w-3.5 text-muted-foreground" />
            <div className="text-xs font-medium text-card-foreground">
              {connector.cpuUsage}%
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  connector.cpuUsage > 70 ? "bg-warning" : "bg-primary"
                )}
                style={{ width: `${connector.cpuUsage}%` }}
              />
            </div>
          </div>

          {/* Memory */}
          <div className="flex flex-col items-center gap-1">
            <HardDrive className="h-3.5 w-3.5 text-muted-foreground" />
            <div className="text-xs font-medium text-card-foreground">
              {connector.memoryUsage}%
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  connector.memoryUsage > 70 ? "bg-warning" : "bg-primary"
                )}
                style={{ width: `${connector.memoryUsage}%` }}
              />
            </div>
          </div>

          {/* Active Workflows */}
          <div className="flex flex-col items-center gap-1">
            <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
            <div className="text-xs font-medium text-card-foreground">
              {connector.activeWorkflows}
            </div>
            <div className="text-[10px] text-muted-foreground">workflows</div>
          </div>
        </div>
      )}

      {connector.status === "offline" && (
        <div className="mt-4 rounded-md bg-muted p-3 text-center">
          <p className="text-xs text-muted-foreground">
            Last seen {getRelativeTime(connector.lastSeen)}
          </p>
        </div>
      )}
    </div>
  )
}
