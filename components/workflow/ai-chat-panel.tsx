"use client"

import { useState, useRef, useEffect } from "react"
import { Sparkles, Send, X, Loader2, Wand2, AlertCircle } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { cn } from "@/lib/utils"
import { aiPresetMessages } from "@/lib/mock-data"
import type { AIChatMessage, CanvasNode } from "@/lib/types"
import type { RootState, AppDispatch } from "@/lib/store"
import { generateWorkflow, clearGeneratedWorkflow } from "@/lib/store/slices/ai-slice"

interface AIChatPanelProps {
  open: boolean
  onClose: () => void
  onAddNodes: (nodes: CanvasNode[]) => void
}

// Helper to convert AI workflow response to canvas nodes
function convertWorkflowToCanvasNodes(workflow: any, baseTimestamp: number): CanvasNode[] {
  const nodes: CanvasNode[] = []
  
  if (!workflow?.definition?.activities) {
    return nodes
  }

  const activities = workflow.definition.activities
  
  activities.forEach((activity: any, index: number) => {
    let nodeType: "source" | "transform" | "destination" = "transform"
    
    if (activity.type === "extract" || activity.type === "mini-connector-source" || activity.type === "cloud-connector-source") {
      nodeType = "source"
    } else if (activity.type === "load" || activity.type === "cloud-connector-sink") {
      nodeType = "destination"
    }

    nodes.push({
      id: `ai-${activity.id}-${baseTimestamp}-${index}`,
      type: nodeType,
      label: activity.name || activity.config?.label || "Unnamed Node",
      description: activity.config?.description || "",
      icon: activity.config?.ui_metadata?.icon || (nodeType === "source" ? "Database" : nodeType === "destination" ? "Database" : "Sparkles"),
      x: 80 + (index * 260),
      y: 150,
      connectionConfig: activity.config?.connectionConfig || {},
      transformConfig: activity.config?.transformConfig || {},
    })
  })

  return nodes
}

export function AIChatPanel({ open, onClose, onAddNodes }: AIChatPanelProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { lastGeneratedWorkflow, workflowGenerating, workflowError } = useSelector((state: RootState) => state.ai)

  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "system-1",
      role: "assistant",
      content:
        "Hey, I'm your workflow assistant. Tell me what data you want to move and where, and I'll set up the pipeline for you. You can describe it naturally -- like \"sync orders from PostgreSQL to Snowflake\" -- and I'll handle the rest.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    }
  }, [open])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Handle workflow generation result
  useEffect(() => {
    if (lastGeneratedWorkflow && isTyping) {
      const timestamp = Date.now()
      const canvasNodes = convertWorkflowToCanvasNodes(lastGeneratedWorkflow.workflow, timestamp)
      
      const aiMessage: AIChatMessage = {
        id: `msg-${timestamp}`,
        role: "assistant",
        content: lastGeneratedWorkflow.explanation || "I've generated a workflow based on your description. You can review it and apply it to the canvas.",
        timestamp: new Date(),
        action: {
          type: "suggest_workflow",
          payload: { 
            nodes: canvasNodes,
            workflow: lastGeneratedWorkflow.workflow
          },
        },
      }
      
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
      dispatch(clearGeneratedWorkflow())
    }
  }, [lastGeneratedWorkflow, isTyping, dispatch])

  // Handle errors
  useEffect(() => {
    if (workflowError && isTyping) {
      const aiMessage: AIChatMessage = {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: `Sorry, I encountered an error: ${workflowError}. Please try again or describe your workflow differently.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }
  }, [workflowError, isTyping])

  async function handleSend(text?: string) {
    const msg = text || input.trim()
    if (!msg) return

    const userMessage: AIChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: msg,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Call the AI API to generate workflow
    try {
      await dispatch(generateWorkflow({ 
        description: msg 
      })).unwrap()
    } catch (error) {
      // Error is handled by the useEffect
      console.error("Workflow generation failed:", error)
    }
  }

  function handleApplyNodes(msg: AIChatMessage) {
    if (msg.action?.payload?.nodes) {
      onAddNodes(msg.action.payload.nodes as CanvasNode[])
    }
  }

  if (!open) return null

  return (
    <div className="flex w-80 shrink-0 flex-col border-l border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <h2 className="text-xs font-semibold text-card-foreground">
              AI Workflow Builder
            </h2>
            <p className="text-[10px] text-muted-foreground">
              Describe your pipeline
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Close AI panel"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3">
        <div className="flex flex-col gap-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex flex-col gap-1.5",
                msg.role === "user" && "items-end"
              )}
            >
              <div
                className={cn(
                  "max-w-[90%] rounded-lg px-3 py-2 text-xs leading-relaxed",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-card-foreground"
                )}
              >
                {msg.content}
              </div>

              {/* Apply nodes button for AI messages with workflow suggestions */}
              {msg.role === "assistant" && msg.action?.type === "suggest_workflow" && (
                <button
                  onClick={() => handleApplyNodes(msg)}
                  className="inline-flex items-center gap-1.5 self-start rounded-md border border-primary/30 bg-primary/5 px-2.5 py-1.5 text-[11px] font-medium text-primary transition-colors hover:bg-primary/10"
                >
                  <Wand2 className="h-3 w-3" />
                  Apply to canvas
                </button>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Generating workflow...</span>
            </div>
          )}
        </div>
      </div>

      {/* Preset suggestions */}
      {messages.length <= 1 && !isTyping && (
        <div className="border-t border-border px-4 py-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Try asking
          </p>
          <div className="flex flex-col gap-1.5">
            {aiPresetMessages.map((preset) => (
              <button
                key={preset}
                onClick={() => handleSend(preset)}
                className="rounded-md border border-border px-2.5 py-2 text-left text-[11px] text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
                disabled={isTyping}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Describe your workflow..."
            className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
            disabled={isTyping}
            aria-label="Describe your workflow"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            {workflowGenerating ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Send className="h-3 w-3" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
