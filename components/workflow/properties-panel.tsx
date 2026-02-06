"use client"

import { Settings, Info } from "lucide-react"
import type { NodeType } from "@/lib/types"

interface SelectedNodeData {
  id: string
  type: NodeType
  label: string
  description: string
  icon: string
}

interface PropertiesPanelProps {
  node: SelectedNodeData | null
}

const typeLabels: Record<NodeType, string> = {
  extract: "Extract Node",
  transform: "Transform Node",
  load: "Load Node",
  trigger: "Trigger Node",
  condition: "Condition Node",
}

export function PropertiesPanel({ node }: PropertiesPanelProps) {
  if (!node) {
    return (
      <div className="flex w-72 shrink-0 flex-col border-l border-border bg-card">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Properties
          </h2>
        </div>
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="text-center">
            <Settings className="mx-auto mb-2 h-6 w-6 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">
              Select a node to view its properties
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-72 shrink-0 flex-col border-l border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Properties
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {/* Node Info */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-card-foreground">{node.label}</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">{node.description}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded bg-muted px-1.5 py-0.5 font-medium">{typeLabels[node.type]}</span>
            <span>ID: {node.id.slice(0, 12)}</span>
          </div>
        </div>

        {/* Config Fields */}
        <div className="flex flex-col gap-4">
          {node.type === "extract" && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-card-foreground">
                  Connection String
                </label>
                <input
                  type="text"
                  placeholder="host:port/database"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-card-foreground">
                  Query / Table
                </label>
                <textarea
                  placeholder="SELECT * FROM orders WHERE..."
                  rows={3}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-card-foreground">
                  Batch Size
                </label>
                <input
                  type="number"
                  defaultValue={1000}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </>
          )}

          {node.type === "transform" && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-card-foreground">
                  Transform Logic
                </label>
                <textarea
                  placeholder="Define your mapping rules..."
                  rows={4}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="skipNull"
                  className="h-3.5 w-3.5 rounded border-border text-primary"
                />
                <label htmlFor="skipNull" className="text-xs text-card-foreground">
                  Skip null values
                </label>
              </div>
            </>
          )}

          {node.type === "load" && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-card-foreground">
                  Target Endpoint
                </label>
                <input
                  type="text"
                  placeholder="https://api.example.com/..."
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-card-foreground">
                  Write Mode
                </label>
                <select className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10">
                  <option>Insert</option>
                  <option>Upsert</option>
                  <option>Append</option>
                  <option>Replace</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="retryFailed"
                  defaultChecked
                  className="h-3.5 w-3.5 rounded border-border text-primary"
                />
                <label htmlFor="retryFailed" className="text-xs text-card-foreground">
                  Auto-retry failed records
                </label>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-border p-4">
        <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98]">
          Apply Changes
        </button>
      </div>
    </div>
  )
}
