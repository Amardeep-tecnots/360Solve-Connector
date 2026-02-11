"use client"

import { Download, Check, Star, Users, Loader2, Settings, X, Database, RefreshCw, AlertCircle } from "lucide-react"
import { cn, formatNumber } from "@/lib/utils"
import type { Aggregator } from "@/lib/store/slices/aggregators-slice"
import type { AggregatorCategory } from "@/lib/types"

interface AggregatorCardProps {
  aggregator: Aggregator
  onInstall: (aggregator: Aggregator) => void
  onConfigure?: (aggregator: Aggregator) => void
  onDelete?: (aggregator: Aggregator) => void | Promise<void>
  onRetryDiscovery?: (aggregator: Aggregator) => void
  onViewSchema?: (aggregator: Aggregator) => void
  isInstalling?: boolean
  isDeleting?: boolean
}

const categoryColors: Record<AggregatorCategory, string> = {
  ERP: "bg-primary/10 text-primary",
  CRM: "bg-success/10 text-success",
  Database: "bg-info/10 text-info",
  Cloud: "bg-warning/10 text-warning",
  Analytics: "bg-chart-5/10 text-chart-5",
  Communication: "bg-muted text-muted-foreground",
}

// Map aggregator names to 2-letter abbreviations + distinctive colors
function getLogoProps(name: string): { initials: string; bg: string; fg: string } {
  const map: Record<string, { initials: string; bg: string; fg: string }> = {
    "SAP Business One": { initials: "SA", bg: "bg-blue-600", fg: "text-white" },
    "Tally Prime": { initials: "TP", bg: "bg-red-600", fg: "text-white" },
    "Salesforce": { initials: "SF", bg: "bg-sky-500", fg: "text-white" },
    "Snowflake": { initials: "SN", bg: "bg-cyan-500", fg: "text-white" },
    "HubSpot": { initials: "HS", bg: "bg-orange-500", fg: "text-white" },
    "Oracle Database": { initials: "OR", bg: "bg-red-700", fg: "text-white" },
    "Google BigQuery": { initials: "BQ", bg: "bg-blue-500", fg: "text-white" },
    "PostgreSQL": { initials: "PG", bg: "bg-indigo-600", fg: "text-white" },
    "Microsoft Dynamics": { initials: "MD", bg: "bg-green-600", fg: "text-white" },
    "Slack": { initials: "SL", bg: "bg-purple-600", fg: "text-white" },
    "AWS S3": { initials: "S3", bg: "bg-amber-600", fg: "text-white" },
    "Zoho CRM": { initials: "ZO", bg: "bg-emerald-600", fg: "text-white" },
  }
  return map[name] || { initials: name.slice(0, 2).toUpperCase(), bg: "bg-muted", fg: "text-foreground" }
}

import { useAppDispatch } from "@/lib/store/hooks"
import { fetchTables } from "@/lib/store/slices/aggregators-slice"
import { useEffect } from "react"

export function AggregatorCard({ aggregator, onInstall, onConfigure, onDelete, onRetryDiscovery, onViewSchema, isInstalling, isDeleting }: AggregatorCardProps) {
  const dispatch = useAppDispatch()

  // Auto-sync schema status on mount if missing
  useEffect(() => {
    if (aggregator.isInstalled && !aggregator.schemaStatus) {
      dispatch(fetchTables(aggregator.id))
    }
  }, [aggregator.id, aggregator.isInstalled, aggregator.schemaStatus, dispatch])

  const logo = getLogoProps(aggregator.name)
  const badgeColor = categoryColors[aggregator.category as AggregatorCategory] || "bg-muted text-muted-foreground"

  return (
    <div className="group flex flex-col rounded-lg border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
            logo.bg,
            logo.fg
          )}
        >
          {logo.initials}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-card-foreground">
            {aggregator.name}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold",
                badgeColor
              )}
            >
              {aggregator.category}
            </span>
            <span className="text-[10px] text-muted-foreground">
              v{aggregator.version}
            </span>
          </div>
        </div>
      </div>

      {/* Schema Status Badge */}
      {aggregator.isInstalled && (
        <div className="mt-2">
          {aggregator.schemaStatus === 'discovering' ? (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              <RefreshCw className="h-2.5 w-2.5 animate-spin" />
              Discovering schema...
            </div>
          ) : aggregator.schemaStatus === 'discovered' ? (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
              <Database className="h-2.5 w-2.5" />
              {aggregator.schema?.tableCount || 0} tables discovered
            </div>
          ) : aggregator.schemaStatus === 'failed' ? (
            <div className="flex items-center justify-between gap-1.5">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
                <AlertCircle className="h-2.5 w-2.5" />
                Discovery failed
              </div>
              {onRetryDiscovery && (
                <button
                  onClick={() => onRetryDiscovery(aggregator)}
                  className="text-[10px] font-semibold text-primary hover:underline"
                >
                  Retry
                </button>
              )}
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              <Database className="h-2.5 w-2.5" />
              Schema not discovered
            </div>
          )}
        </div>
      )}

      {/* Description */}
      <p className="mt-3 flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
        {aggregator.description}
      </p>

      {/* Footer */}
      <div className="mt-4 flex flex-col gap-3 border-t border-border pt-3">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-current text-amber-400" />
              {aggregator.rating}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {formatNumber(aggregator.installs)}
            </span>
          </div>
        </div>

        {aggregator.isInstalled ? (
          <div className="flex flex-wrap items-center justify-end gap-2">
            {onViewSchema && aggregator.schemaStatus === 'discovered' && (
              <button
                onClick={() => onViewSchema(aggregator)}
                className="inline-flex items-center gap-1.5 rounded-md bg-info/10 px-3 py-1.5 text-xs font-semibold text-info transition-colors hover:bg-info/20"
              >
                <Database className="h-3 w-3" />
                View Schema
              </button>
            )}
            {onConfigure ? (
              <button
                onClick={() => onConfigure(aggregator)}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <Settings className="h-3 w-3" />
                Configure
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                <Check className="h-3.5 w-3.5" />
                Installed
              </span>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(aggregator)}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 rounded-md border border-destructive px-3 py-1.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
                Delete
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => onInstall(aggregator)}
            disabled={isInstalling}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isInstalling ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Download className="h-3 w-3" />
            )}
            {isInstalling ? "Installing..." : "Install"}
          </button>
        )}
      </div>
    </div>
  )
}
