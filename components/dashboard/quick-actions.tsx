import { Plus, Store, Sparkles } from "lucide-react"
import Link from "next/link"

const actions = [
  {
    label: "Build with AI",
    description: "Describe a pipeline, AI builds it",
    href: "/workflows",
    icon: Sparkles,
    accent: "bg-primary/10 text-primary",
  },
  {
    label: "Create Workflow",
    description: "Drag-and-drop Source to Destination",
    href: "/workflows",
    icon: Plus,
    accent: "bg-success/10 text-success",
  },
  {
    label: "Browse Connectors",
    description: "Install from the marketplace",
    href: "/marketplace",
    icon: Store,
    accent: "bg-info/10 text-info",
  },
]

export function QuickActions() {
  return (
    <div className="flex flex-col gap-2">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Link
            key={action.label}
            href={action.href}
            className="group flex items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${action.accent}`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-card-foreground group-hover:text-primary transition-colors">
                {action.label}
              </p>
              <p className="text-xs text-muted-foreground">
                {action.description}
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
