"use client"

import { useState, useMemo } from "react"
import {
  Database,
  Globe,
  ArrowLeftRight,
  Filter,
  Layers,
  Code,
  Cloud,
  Sparkles,
  Link,
  FileSpreadsheet,
  Store,
  Webhook,
  Search,
  ChevronRight,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { NodeType, PaletteNode } from "@/lib/types"

const iconMap: Record<string, React.ElementType> = {
  Database,
  Globe,
  ArrowLeftRight,
  Filter,
  Layers,
  Code,
  Cloud,
  Sparkles,
  Link,
  FileSpreadsheet,
  Store,
  Webhook,
  Workflow: Zap,
}

// Fixed type and adding marketplace/workflows
type PaletteCategory = NodeType | "marketplace" | "workflows"

const categoryConfig: Record<PaletteCategory, { label: string; accent: string; border: string; description: string }> = {
  source: {
    label: "Sources",
    accent: "bg-primary/10 text-primary",
    border: "border-l-primary",
    description: "Standard data entry points",
  },
  transform: {
    label: "Logic",
    accent: "bg-warning/10 text-warning",
    border: "border-l-warning",
    description: "Data manipulation steps",
  },
  destination: {
    label: "Storage",
    accent: "bg-success/10 text-success",
    border: "border-l-success",
    description: "Data delivery points",
  },
  marketplace: {
    label: "Marketplace",
    accent: "bg-purple-500/10 text-purple-400",
    border: "border-l-purple-500",
    description: "Installed aggregators",
  },
  workflows: {
    label: "Workflows",
    accent: "bg-blue-400/10 text-blue-400",
    border: "border-l-blue-400",
    description: "Callable sub-workflows",
  },
}

interface NodePaletteProps {
  nodes: {
    source: PaletteNode[]
    transform: PaletteNode[]
    destination: PaletteNode[]
    marketplace?: PaletteNode[]
    workflows?: PaletteNode[]
  }
}

export function NodePalette({ nodes }: NodePaletteProps) {
  const [search, setSearch] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["source", "transform", "destination", "marketplace", "workflows"])
  )

  const toggleCategory = (cat: string) => {
    const next = new Set(expandedCategories)
    if (next.has(cat)) next.delete(cat)
    else next.add(cat)
    setExpandedCategories(next)
  }

  const filteredNodes = useMemo(() => {
    const filtered: any = {}
    Object.entries(nodes).forEach(([key, list]) => {
      const typedList = list as PaletteNode[]
      filtered[key] = typedList.filter(
        (n) =>
          n.label.toLowerCase().includes(search.toLowerCase()) ||
          n.description.toLowerCase().includes(search.toLowerCase())
      )
    })
    return filtered
  }, [nodes, search])

  function handleDragStart(e: React.DragEvent, node: PaletteNode) {
    e.dataTransfer.setData("application/json", JSON.stringify(node))
    e.dataTransfer.effectAllowed = "copy"
  }

  return (
    <div className="flex w-64 shrink-0 flex-col border-r border-border bg-card">
      <div className="border-b border-border px-4 py-4">
        <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-muted-foreground">
          Components
        </h2>
        <div className="relative mt-3">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2 pl-8 pr-3 text-[12px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/30"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {(Object.keys(categoryConfig) as PaletteCategory[]).map((type) => {
          const config = categoryConfig[type]
          const categoryNodes = filteredNodes[type] || []
          const isExpanded = expandedCategories.has(type)

          if (search && categoryNodes.length === 0) return null

          return (
            <div key={type} className="mb-2">
              <button
                onClick={() => toggleCategory(type)}
                className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left transition-colors hover:bg-accent/50"
              >
                <div className="flex items-center gap-2">
                  <ChevronRight
                    className={cn(
                      "h-3.5 w-3.5 text-muted-foreground transition-transform",
                      isExpanded && "rotate-90"
                    )}
                  />
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider",
                    config.accent.split(' ')[1]
                  )}>
                    {config.label}
                  </span>
                  <span className="rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                    {categoryNodes.length}
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="mt-1 flex flex-col gap-1 px-1">
                  {categoryNodes.map((node: PaletteNode) => {
                    const Icon = iconMap[node.icon] || Database
                    return (
                      <div
                        key={node.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, node)}
                        className={cn(
                          "group relative flex cursor-grab items-center gap-3 rounded-lg border border-transparent bg-transparent px-3 py-2.5 transition-all hover:bg-accent active:cursor-grabbing",
                          "before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:rounded-full before:bg-transparent hover:before:bg-current",
                          config.accent.split(' ')[1].replace('text-', 'before:bg-')
                        )}
                      >
                        <div className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background group-hover:bg-card transition-colors",
                          isSelected(node) && "ring-1 ring-primary/50"
                        )}>
                          <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[12px] font-medium text-foreground/80 group-hover:text-foreground">
                            {node.label}
                          </p>
                          <p className="truncate text-[10px] text-muted-foreground">
                            {node.description}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  {categoryNodes.length === 0 && !search && (
                    <p className="px-8 py-2 text-[10px] italic text-muted-foreground/50">
                      No nodes available
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function isSelected(node: PaletteNode) {
  // Logic for selection if needed
  return false
}
