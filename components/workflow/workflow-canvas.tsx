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
}

const typeAccents: Record<
  NodeType,
  { border: string; bg: string; dot: string; label: string }
> = {
  source: {
    border: "border-l-primary",
    bg: "bg-primary/5",
    dot: "bg-primary",
    label: "Source",
  },
  transform: {
    border: "border-l-warning",
    bg: "bg-warning/5",
    dot: "bg-warning",
    label: "Transform",
  },
  destination: {
    border: "border-l-success",
    bg: "bg-success/5",
    dot: "bg-success",
    label: "Destination",
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
        "relative flex-1 overflow-auto",
        connectingFrom && "cursor-crosshair"
      )}
      style={{
        backgroundImage:
          "radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleCanvasClick}
      role="application"
      aria-label="Workflow canvas"
    >
      {/* Connections SVG */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full">
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
                opacity="0.4"
              />
              {/* Arrow */}
              <circle
                cx={to.x}
                cy={to.y}
                r="3"
                fill="hsl(var(--primary))"
                opacity="0.6"
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
              "absolute flex w-[184px] cursor-move items-center rounded-lg border border-l-[3px] bg-card shadow-sm transition-shadow",
              accents.border,
              isSelected
                ? "ring-2 ring-primary shadow-md"
                : "hover:shadow-md"
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
                  "absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-card transition-colors",
                  connectingFrom
                    ? "bg-primary ring-2 ring-primary/20"
                    : "bg-border hover:bg-primary"
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  handleConnectorClick(node.id, false)
                }}
                aria-label={`Connect to ${node.label}`}
              />
            )}

            {/* Node content */}
            <div className="flex flex-1 items-center gap-2 px-3 py-2.5">
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded",
                  accents.bg
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-card-foreground">
                  {node.label}
                </p>
                <p className="truncate text-[10px] text-muted-foreground">
                  {accents.label}
                </p>
              </div>
            </div>

            {/* Output connector */}
            {(node.type === "source" || node.type === "transform") && (
              <button
                data-connector
                className={cn(
                  "absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-card transition-colors",
                  connectingFrom === node.id
                    ? "bg-primary ring-2 ring-primary/20"
                    : "bg-border hover:bg-primary"
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  handleConnectorClick(node.id, true)
                }}
                aria-label={`Connect from ${node.label}`}
              />
            )}

            {/* Delete button */}
            {isSelected && (
              <button
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm transition-transform hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteNode(node.id)
                }}
                aria-label={`Delete ${node.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        )
      })}

      {/* Empty state */}
      {nodes.length === 0 && (
        <div className="flex h-full items-center justify-center">
          <div className="text-center max-w-xs">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <GripVertical className="h-6 w-6 text-primary/40" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Build your data pipeline
            </p>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Drag Source, Transform, and Destination nodes from the palette, or
              use the AI assistant to generate a workflow from a description.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
