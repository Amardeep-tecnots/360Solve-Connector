"use client"

import { useState } from "react"
import {
  Download,
  MoreHorizontal,
  RefreshCw,
  Trash2,
  Terminal,
  Cpu,
  HardDrive,
  GitBranch,
  Server,
} from "lucide-react"
import { StatusBadge } from "@/components/shared/status-badge"
import { DownloadModal } from "@/components/connectors/download-modal"
import { miniConnectors } from "@/lib/mock-data"
import { getRelativeTime, cn } from "@/lib/utils"

export default function ConnectorsPage() {
  const [downloadOpen, setDownloadOpen] = useState(false)

  const onlineCount = miniConnectors.filter((c) => c.status === "online").length
  const totalCount = miniConnectors.length

  return (
    <div className="mx-auto max-w-5xl">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground text-balance">
            Mini Connectors
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage on-premise agents that bridge your local systems to the cloud.{" "}
            <span className="font-medium text-foreground">
              {onlineCount}/{totalCount} online
            </span>
          </p>
        </div>
        <button
          onClick={() => setDownloadOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 active:scale-[0.98]"
        >
          <Download className="h-4 w-4" />
          Download New
        </button>
      </div>

      {/* Connector List */}
      <div className="flex flex-col gap-4">
        {miniConnectors.map((connector) => (
          <div
            key={connector.id}
            className="rounded-lg border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              {/* Left: Info */}
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                    connector.status === "online"
                      ? "bg-success/10 text-success"
                      : connector.status === "warning"
                        ? "bg-warning/10 text-warning"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  <Server className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-semibold text-card-foreground">
                      {connector.name}
                    </h3>
                    <StatusBadge status={connector.status} />
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>{connector.ipAddress}</span>
                    <span>v{connector.version}</span>
                    <span className="capitalize">{connector.os}</span>
                    <span>Last seen {getRelativeTime(connector.lastSeen)}</span>
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2">
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="Restart connector"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="Open terminal"
                >
                  <Terminal className="h-3.5 w-3.5" />
                </button>
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Delete connector"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Resource bars */}
            {connector.status !== "offline" && (
              <div className="mt-4 grid grid-cols-3 gap-6 rounded-md bg-muted/30 p-4">
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Cpu className="h-3 w-3" /> CPU
                    </span>
                    <span className="text-xs font-semibold tabular-nums text-card-foreground">
                      {connector.cpuUsage}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        connector.cpuUsage > 70 ? "bg-warning" : "bg-primary"
                      )}
                      style={{ width: `${connector.cpuUsage}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <HardDrive className="h-3 w-3" /> Memory
                    </span>
                    <span className="text-xs font-semibold tabular-nums text-card-foreground">
                      {connector.memoryUsage}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        connector.memoryUsage > 70 ? "bg-warning" : "bg-primary"
                      )}
                      style={{ width: `${connector.memoryUsage}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <GitBranch className="h-3 w-3" /> Workflows
                    </span>
                    <span className="text-xs font-semibold tabular-nums text-card-foreground">
                      {connector.activeWorkflows}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-primary/10">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${Math.min(connector.activeWorkflows * 10, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <DownloadModal open={downloadOpen} onClose={() => setDownloadOpen(false)} />
    </div>
  )
}
