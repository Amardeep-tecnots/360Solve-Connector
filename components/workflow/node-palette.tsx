"use client"

import {
  Database,
  Globe,
  ArrowLeftRight,
  Filter,
  Layers,
  Code,
  Cloud,
  Snowflake,
  BarChart3,
  HardDrive,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { NodeType } from "@/lib/types"

const iconMap: Record<string, React.ElementType> = {
  Database,
  Globe,
  ArrowLeftRight,
  Filter,
  Layers,
  Code,
  Cloud,
  Snowflake,
  BarChart3,
  HardDrive,
}

const typeConfig: Record<NodeType, { label: string; accent: string; border: string }> = {
  extract: { label: "Extract", accent: "bg-primary/10 text-primary", border: "border-l-primary" },
  transform: { label: "Transform", accent: "bg-warning/10 text-warning", border: "border-l-warning" },
  load: { label: "Load", accent: "bg-success/10 text-success", border: "border-l-success" },
  trigger: { label: "Trigger", accent: "bg-info/10 text-info", border: "border-l-info" },
  condition: { label: "Condition", accent: "bg-muted text-muted-foreground", border: "border-l-muted-foreground" },
}

interface PaletteNode {
  id: string
  type: NodeType
  label: string
  description: string
  icon: string
}

interface NodePaletteProps {
  nodes: {
    extract: PaletteNode[]
    transform: PaletteNode[]
    load: PaletteNode[]
  }
}

export function NodePalette({ nodes }: NodePaletteProps) {
  function handleDragStart(e: React.DragEvent, node: PaletteNode) {
    e.dataTransfer.setData("application/json", JSON.stringify(node))
    e.dataTransfer.effectAllowed = "copy"
  }

  return (
    <div className="flex w-60 shrink-0 flex-col border-r border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Node Palette
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {(["extract", "transform", "load"] as const).map((type) => {
          const config = typeConfig[type]
          return (
            <div key={type} className="mb-5">
              <p className={cn("mb-2 inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold", config.accent)}>
                {config.label}
              </p>
              <div className="flex flex-col gap-1.5">
                {nodes[type].map((node) => {
                  const Icon = iconMap[node.icon] || Database
                  return (
                    <div
                      key={node.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, node)}
                      className={cn(
                        "flex cursor-grab items-center gap-2.5 rounded-md border border-border border-l-2 bg-card px-3 py-2.5 transition-all hover:shadow-sm active:cursor-grabbing active:scale-[0.98]",
                        config.border
                      )}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-card-foreground">
                          {node.label}
                        </p>
                        <p className="truncate text-[10px] text-muted-foreground">
                          {node.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
