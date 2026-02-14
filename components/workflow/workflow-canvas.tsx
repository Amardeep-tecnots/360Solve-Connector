"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import {
  X,
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
  GripVertical,
  Activity,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { NodeType, CanvasNode, CanvasConnection } from "@/lib/types"

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

const typeAccents: Record<
  NodeType,
  { border: string; bg: string; dot: string; label: string; glow: string }
> = {
  source: {
    border: "border-l-primary",
    bg: "bg-primary/5",
    dot: "bg-primary",
    label: "Source",
    glow: "shadow-[0_0_15px_rgba(var(--primary-rgb),0.15)]",
  },
  transform: {
    border: "border-l-warning",
    bg: "bg-warning/5",
    dot: "bg-warning",
    label: "Transform",
    glow: "shadow-[0_0_15px_rgba(var(--warning-rgb),0.15)]",
  },
  destination: {
    border: "border-l-success",
    bg: "bg-success/5",
    dot: "bg-success",
    label: "Destination",
    glow: "shadow-[0_0_15px_rgba(var(--success-rgb),0.15)]",
  },
}

interface WorkflowCanvasProps {
  nodes: CanvasNode[]
  connections: CanvasConnection[]
  onNodesChange: (nodes: CanvasNode[]) => void
  onConnectionsChange: (connections: CanvasConnection[]) => void
  onNodeSelect: (node: CanvasNode | null) => void
}

export function WorkflowCanvas({
  nodes,
  connections,
  onNodesChange,
  onConnectionsChange,
  onNodeSelect,
}: WorkflowCanvasProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{
    nodeId: string
    offsetX: number
    offsetY: number
  } | null>(null)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const data = e.dataTransfer.getData("application/json")
      if (!data) return

      const nodeData = JSON.parse(data)
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const newNode: CanvasNode = {
        id: `node-${Date.now()}`,
        type: nodeData.type,
        label: nodeData.label,
        description: nodeData.description,
        icon: nodeData.icon,
        x: e.clientX - rect.left - 80 + (canvasRef.current?.scrollLeft || 0),
        y: e.clientY - rect.top - 30 + (canvasRef.current?.scrollTop || 0),
      }

      onNodesChange([...nodes, newNode])
    },
    [nodes, onNodesChange]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
  }, [])

  const handleNodeMouseDown = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
      if ((e.target as HTMLElement).closest("[data-connector]")) return
      e.stopPropagation()
      const node = nodes.find((n) => n.id === nodeId)
      if (!node || !canvasRef.current) return

      const rect = canvasRef.current.getBoundingClientRect()
      dragRef.current = {
        nodeId,
        offsetX: e.clientX - rect.left - node.x + canvasRef.current.scrollLeft,
        offsetY: e.clientY - rect.top - node.y + canvasRef.current.scrollTop,
      }

      const handleMouseMove = (me: MouseEvent) => {
        if (!dragRef.current || !canvasRef.current) return
        const r = canvasRef.current.getBoundingClientRect()
        const newX =
          me.clientX - r.left - dragRef.current.offsetX + canvasRef.current.scrollLeft
        const newY =
          me.clientY - r.top - dragRef.current.offsetY + canvasRef.current.scrollTop
        onNodesChange(
          nodes.map((n) =>
            n.id === dragRef.current!.nodeId
              ? { ...n, x: Math.max(0, newX), y: Math.max(0, newY) }
              : n
          )
        )
      }

      const handleMouseUp = () => {
        dragRef.current = null
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    },
    [nodes, onNodesChange]
  )

  const handleNodeClick = useCallback(
    (node: CanvasNode) => {
      setSelectedNode(node.id)
      onNodeSelect(node)
    },
    [onNodeSelect]
  )

  const handleConnectorClick = useCallback(
    (nodeId: string, isOutput: boolean) => {
      if (isOutput) {
        setConnectingFrom(nodeId)
      } else if (connectingFrom && connectingFrom !== nodeId) {
        const exists = connections.some(
          (c) => c.from === connectingFrom && c.to === nodeId
        )
        if (!exists) {
          onConnectionsChange([
            ...connections,
            { from: connectingFrom, to: nodeId },
          ])
        }
        setConnectingFrom(null)
      }
    },
    [connectingFrom, connections, onConnectionsChange]
  )

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      onNodesChange(nodes.filter((n) => n.id !== nodeId))
      onConnectionsChange(
        connections.filter((c) => c.from !== nodeId && c.to !== nodeId)
      )
      if (selectedNode === nodeId) {
        setSelectedNode(null)
        onNodeSelect(null)
      }
    },
    [
      nodes,
      connections,
      selectedNode,
      onNodeSelect,
      onNodesChange,
      onConnectionsChange,
    ]
  )

  const handleCanvasClick = useCallback(() => {
    setSelectedNode(null)
    setConnectingFrom(null)
    onNodeSelect(null)
  }, [onNodeSelect])

  function getNodeCenter(id: string, isOutput: boolean) {
    const node = nodes.find((n) => n.id === id)
    if (!node) return { x: 0, y: 0 }
    return {
      x: isOutput ? node.x + 184 : node.x,
      y: node.y + 32,
    }
  }

  return (
    <div
      ref={canvasRef}
      className={cn(
        "relative flex-1 overflow-auto bg-background",
        connectingFrom && "cursor-crosshair"
      )}
      style={{
        backgroundImage: `
          radial-gradient(circle at 2px 2px, hsl(var(--muted-foreground) / 0.1) 1px, transparent 0)
        `,
        backgroundSize: "24px 24px",
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleCanvasClick}
      role="application"
      aria-label="Workflow canvas"
    >
      {/* Premium Glow Gradient Overlays */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_70%)]" />

      {/* Connections SVG */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <filter id="connection-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {connections.map((conn, i) => {
          const from = getNodeCenter(conn.from, true)
          const to = getNodeCenter(conn.to, false)
          const midX = (from.x + to.x) / 2
          return (
            <g key={i}>
              <path
                d={`M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeOpacity="0.5"
                filter="url(#connection-glow)"
                className="transition-all duration-300"
              />
              {/* Animated Dash Path for "active" flow feel */}
              <path
                d={`M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`}
                fill="none"
                stroke="white"
                strokeWidth="1"
                strokeDasharray="4 12"
                strokeOpacity="0.2"
                className="animate-[dash_20s_linear_infinite]"
              />
              {/* Arrow/Dot terminal */}
              <circle
                cx={to.x}
                cy={to.y}
                r="3"
                fill="hsl(var(--primary))"
                className="drop-shadow-[0_0_3px_hsl(var(--primary))]"
              />
            </g>
          )
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node) => {
        const accents = typeAccents[node.type]
        const Icon = iconMap[node.icon] || Database
        const isSelected = selectedNode === node.id

        return (
          <div
            key={node.id}
            className={cn(
              "absolute flex w-[184px] cursor-move items-center rounded-xl border border-border bg-card/90 backdrop-blur-md transition-all duration-200 shadow-sm",
              isSelected
                ? cn("ring-2 ring-primary/20", accents.glow)
                : "hover:border-primary/20 hover:bg-accent/50"
            )}
            style={{ left: node.x, top: node.y }}
            onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
            onClick={(e) => {
              e.stopPropagation()
              handleNodeClick(node)
            }}
          >
            {/* Input connector */}
            {(node.type === "transform" || node.type === "destination") && (
              <button
                data-connector
                className={cn(
                  "absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-card shadow-sm transition-all",
                  connectingFrom
                    ? "bg-primary scale-110 ring-4 ring-primary/10"
                    : "bg-muted hover:bg-primary hover:scale-110"
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  handleConnectorClick(node.id, false)
                }}
                aria-label={`Connect to ${node.label}`}
              />
            )}

            {/* Node content */}
            <div className="flex flex-1 items-center gap-2.5 px-3 py-3">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-gradient-to-br",
                  node.type === "source" ? "from-primary/10 to-transparent" :
                    node.type === "transform" ? "from-warning/10 to-transparent" :
                      "from-success/10 to-transparent"
                )}
              >
                <Icon className={cn(
                  "h-4 w-4",
                  node.type === "source" ? "text-primary" :
                    node.type === "transform" ? "text-warning" :
                      "text-success"
                )} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-foreground">
                  {node.label}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className={cn("h-1 w-1 rounded-full", accents.dot)} />
                  <p className="truncate text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    {accents.label}
                  </p>
                </div>
              </div>
            </div>

            {/* Output connector */}
            {(node.type === "source" || node.type === "transform") && (
              <button
                data-connector
                className={cn(
                  "absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-card shadow-sm transition-all",
                  connectingFrom === node.id
                    ? "bg-primary scale-110 ring-4 ring-primary/10"
                    : "bg-muted hover:bg-primary hover:scale-110"
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  handleConnectorClick(node.id, true)
                }}
                aria-label={`Connect from ${node.label}`}
              />
            )}

            {/* Delete button (Glassmorphism) */}
            {isSelected && (
              <button
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive/10 text-destructive border border-destructive/20 backdrop-blur-md shadow-lg transition-transform hover:scale-110 active:scale-95"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteNode(node.id)
                }}
                aria-label={`Delete ${node.label}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )
      })}

      {/* Empty state (Redesigned for Premium look) */}
      {nodes.length === 0 && (
        <div className="flex h-full items-center justify-center">
          <div className="text-center max-w-sm px-6">
            <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 animate-pulse rounded-full bg-primary/5 blur-xl" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card shadow-xl">
                <Activity className="h-8 w-8 text-primary/30" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              Start Building Your Pipeline
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed balance">
              Drag tools from the palette or ask the assistant to generate a workflow.
              Connect nodes to define your data flow architecture.
            </p>
            <div className="mt-8 flex justify-center gap-2">
              <div className="flex items-center gap-2 rounded-full border border-border bg-accent/50 px-3 py-1.5">
                <span className="flex h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Connectors</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border bg-accent/50 px-3 py-1.5">
                <span className="flex h-1.5 w-1.5 rounded-full bg-warning" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Logic</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border bg-accent/50 px-3 py-1.5">
                <span className="flex h-1.5 w-1.5 rounded-full bg-success" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Storage</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -1000;
          }
        }
      `}</style>
    </div>
  )
}
