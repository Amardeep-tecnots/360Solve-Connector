"use client"

import { Download, Check, Star, Users } from "lucide-react"
import { cn, formatNumber } from "@/lib/utils"
import type { Aggregator, AggregatorCategory } from "@/lib/types"

interface AggregatorCardProps {
  aggregator: Aggregator
  onInstall: (id: string) => void
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

export function AggregatorCard({ aggregator, onInstall }: AggregatorCardProps) {
  const logo = getLogoProps(aggregator.name)

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
                "inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold",
                categoryColors[aggregator.category]
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

      {/* Description */}
      <p className="mt-3 flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
        {aggregator.description}
      </p>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-current text-amber-400" />
            {aggregator.rating}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {formatNumber(aggregator.installs)}
          </span>
        </div>

        {aggregator.isInstalled ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
            <Check className="h-3.5 w-3.5" />
            Installed
          </span>
        ) : (
          <button
            onClick={() => onInstall(aggregator.id)}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98]"
          >
            <Download className="h-3 w-3" />
            Install
          </button>
        )}
      </div>
    </div>
  )
}
