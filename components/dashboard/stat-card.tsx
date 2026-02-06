import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string | number
  trend?: {
    direction: "up" | "down"
    value: string
    label: string
  }
  icon?: React.ReactNode
  accentColor?: "primary" | "success" | "destructive" | "warning"
}

export function StatCard({
  label,
  value,
  trend,
  icon,
  accentColor = "primary",
}: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      {/* Accent bar at top */}
      <div
        className={cn(
          "absolute left-0 top-0 h-1 w-full",
          accentColor === "primary" && "bg-primary",
          accentColor === "success" && "bg-success",
          accentColor === "destructive" && "bg-destructive",
          accentColor === "warning" && "bg-warning"
        )}
      />

      <div className="flex items-start justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>

      <div className="mt-2 text-3xl font-bold text-card-foreground">{value}</div>

      {trend && (
        <div className="mt-3 flex items-center text-sm">
          {trend.direction === "up" ? (
            <TrendingUp className="mr-1 h-4 w-4 text-success" />
          ) : (
            <TrendingDown className="mr-1 h-4 w-4 text-destructive" />
          )}
          <span
            className={cn(
              "font-medium",
              trend.direction === "up" ? "text-success" : "text-destructive"
            )}
          >
            {trend.value}
          </span>
          <span className="ml-1 text-muted-foreground">{trend.label}</span>
        </div>
      )}
    </div>
  )
}
