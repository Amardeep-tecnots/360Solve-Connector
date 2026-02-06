"use client"

import { useState, useCallback } from "react"
import { Save, Play, Undo, Sparkles } from "lucide-react"
import { NodePalette } from "@/components/workflow/node-palette"
import { WorkflowCanvas } from "@/components/workflow/workflow-canvas"
import { PropertiesPanel } from "@/components/workflow/properties-panel"
import { AIChatPanel } from "@/components/workflow/ai-chat-panel"
import { paletteNodes } from "@/lib/mock-data"
import type { CanvasNode, CanvasConnection } from "@/lib/types"
import { toast } from "sonner"

export default function WorkflowsPage() {
  const [selectedNode, setSelectedNode] = useState<CanvasNode | null>(null)
  const [nodes, setNodes] = useState<CanvasNode[]>([])
  const [connections, setConnections] = useState<CanvasConnection[]>([])
  const [aiPanelOpen, setAiPanelOpen] = useState(false)

  const handleAddNodesFromAI = useCallback(
    (aiNodes: CanvasNode[]) => {
      setNodes((prev) => [...prev, ...aiNodes])
      // Auto-connect them in sequence
      const newConnections: CanvasConnection[] = []
      for (let i = 0; i < aiNodes.length - 1; i++) {
        newConnections.push({ from: aiNodes[i].id, to: aiNodes[i + 1].id })
      }
      setConnections((prev) => [...prev, ...newConnections])
      toast.success("Workflow nodes added to canvas", {
        description: `${aiNodes.length} nodes placed and connected.`,
      })
    },
    []
  )

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
          <span className="hidden sm:inline-flex text-[10px] text-muted-foreground">
            Source {"->"} Transform {"->"} Destination
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
            onClick={() => toast.info("Undo not yet implemented")}
          >
            <Undo className="h-3 w-3" />
            <span className="hidden sm:inline">Undo</span>
          </button>
          <button
            className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
              aiPanelOpen
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-foreground hover:bg-accent"
            }`}
            onClick={() => setAiPanelOpen(!aiPanelOpen)}
          >
            <Sparkles className="h-3 w-3" />
            <span className="hidden sm:inline">AI Assist</span>
          </button>
          <button
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
            onClick={() => toast.success("Workflow saved")}
          >
            <Save className="h-3 w-3" />
            <span className="hidden sm:inline">Save</span>
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
            <span className="hidden sm:inline">Run</span>
          </button>
        </div>
      </div>

      {/* 3/4-Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        <NodePalette nodes={paletteNodes} />
        <WorkflowCanvas
          nodes={nodes}
          connections={connections}
          onNodesChange={setNodes}
          onConnectionsChange={setConnections}
          onNodeSelect={setSelectedNode}
        />
        {!aiPanelOpen && <PropertiesPanel node={selectedNode} />}
        {aiPanelOpen && (
          <AIChatPanel
            open={aiPanelOpen}
            onClose={() => setAiPanelOpen(false)}
            onAddNodes={handleAddNodesFromAI}
          />
        )}
      </div>
    </div>
  )
}
