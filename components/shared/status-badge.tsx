import {
  CheckCircle,
  XCircle,
  Loader2,
  Clock,
  MinusCircle,
  Wifi,
  WifiOff,
  AlertTriangle,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { ExecutionStatus, ConnectorStatus } from "@/lib/types"

interface StatusBadgeProps {
  status: ExecutionStatus | ConnectorStatus
  size?: "sm" | "md"
}

const executionConfig: Record<
  ExecutionStatus,
  { label: string; icon: React.ElementType; className: string }
> = {
  success: {
    label: "Success",
    icon: CheckCircle,
    className: "bg-success/10 text-success",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive",
  },
  running: {
    label: "Running",
    icon: Loader2,
    className: "bg-primary/10 text-primary",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-muted text-muted-foreground",
  },
  cancelled: {
    label: "Cancelled",
    icon: MinusCircle,
    className: "bg-muted text-muted-foreground",
  },
}

const connectorConfig: Record<
  ConnectorStatus,
  { label: string; icon: React.ElementType; className: string }
> = {
  online: {
    label: "Online",
    icon: Wifi,
    className: "bg-success/10 text-success",
  },
  offline: {
    label: "Offline",
    icon: WifiOff,
    className: "bg-muted text-muted-foreground",
  },
  warning: {
    label: "Warning",
    icon: AlertTriangle,
    className: "bg-warning/10 text-warning",
  },
  syncing: {
    label: "Syncing",
    icon: RefreshCw,
    className: "bg-primary/10 text-primary",
  },
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const allConfig = { ...executionConfig, ...connectorConfig }
  const config = allConfig[status]
  if (!config) return null

  const Icon = config.icon

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold",
        config.className,
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-3 py-1 text-sm"
      )}
    >
      <Icon
        className={cn(
          "shrink-0",
          size === "sm" && "h-3 w-3",
          size === "md" && "h-3.5 w-3.5",
          status === "running" && "animate-spin",
          status === "syncing" && "animate-spin"
        )}
      />
      {config.label}
    </span>
  )
}
