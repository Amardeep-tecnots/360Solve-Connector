"use client"

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
}

const typeConfig: Record<NodeType, { label: string; accent: string; border: string; description: string }> = {
  source: {
    label: "Source",
    accent: "bg-primary/10 text-primary",
    border: "border-l-primary",
    description: "Where data comes from",
  },
  transform: {
    label: "Transform",
    accent: "bg-warning/10 text-warning",
    border: "border-l-warning",
    description: "How data is processed",
  },
  destination: {
    label: "Destination",
    accent: "bg-success/10 text-success",
    border: "border-l-success",
    description: "Where data goes to",
  },
}

interface NodePaletteProps {
  nodes: {
    source: PaletteNode[]
    transform: PaletteNode[]
    destination: PaletteNode[]
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
        <p className="mt-0.5 text-[10px] text-muted-foreground">
          Drag nodes onto the canvas
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {(["source", "transform", "destination"] as const).map((type) => {
          const config = typeConfig[type]
          return (
            <div key={type} className="mb-5">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold",
                    config.accent
                  )}
                >
                  {config.label}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {config.description}
                </span>
              </div>
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
