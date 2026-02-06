"use client"

import { useState } from "react"
import { Save, Play, Undo } from "lucide-react"
import { NodePalette } from "@/components/workflow/node-palette"
import { WorkflowCanvas } from "@/components/workflow/workflow-canvas"
import { PropertiesPanel } from "@/components/workflow/properties-panel"
import { paletteNodes } from "@/lib/mock-data"
import { toast } from "sonner"

export default function WorkflowsPage() {
  const [selectedNode, setSelectedNode] = useState<{
    id: string
    type: "extract" | "transform" | "load" | "trigger" | "condition"
    label: string
    description: string
    icon: string
  } | null>(null)

  return (
    <div className="-m-6 lg:-m-8 flex h-[calc(100vh-4rem)] flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2.5">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold text-foreground">
            Workflow Designer
          </h1>
          <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            Untitled Workflow
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
            onClick={() => toast.info("Undo not yet implemented")}
          >
            <Undo className="h-3 w-3" />
            Undo
          </button>
          <button
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
            onClick={() => toast.success("Workflow saved")}
          >
            <Save className="h-3 w-3" />
            Save
          </button>
          <button
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98]"
            onClick={() =>
              toast.success("Workflow execution started", {
                description: "Check the Execution Monitor for progress.",
              })
            }
          >
            <Play className="h-3 w-3" />
            Run
          </button>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        <NodePalette nodes={paletteNodes} />
        <WorkflowCanvas
          onNodeSelect={(node) =>
            setSelectedNode(
              node
                ? {
                    id: node.id,
                    type: node.type,
                    label: node.label,
                    description: node.description,
                    icon: node.icon,
                  }
                : null
            )
          }
        />
        <PropertiesPanel node={selectedNode} />
      </div>
    </div>
  )
}
