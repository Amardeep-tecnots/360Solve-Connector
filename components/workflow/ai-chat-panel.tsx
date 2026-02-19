"use client"

import { useState, useRef, useEffect } from "react"
import { Sparkles, Send, X, Loader2, Wand2, AlertCircle, ArrowRightLeft, Box, Settings } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { cn } from "@/lib/utils"
import { aiPresetMessages } from "@/lib/mock-data"
import type { AIChatMessage, CanvasNode } from "@/lib/types"
import type { RootState, AppDispatch } from "@/lib/store"
import { 
  generateWorkflow, 
  generateMapping,
  generateSDK,
  clearGeneratedWorkflow, 
  clearGeneratedMapping 
} from "@/lib/store/slices/ai-slice"

// AI Capability types
type AICapability = "workflow" | "mapping" | "sdk"

interface AIChatPanelProps {
  open: boolean
  onClose: () => void
  onAddNodes: (nodes: CanvasNode[]) => void
  // For mapping - source and destination connectors
  sourceConnector?: {
    id: string
    name: string
    schema?: Record<string, any>
  }
  destinationConnector?: {
    id: string
    name: string
    schema?: Record<string, any>
  }
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

export function AIChatPanel({ 
  open, 
  onClose, 
  onAddNodes,
  sourceConnector,
  destinationConnector
}: AIChatPanelProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { 
    lastGeneratedWorkflow, 
    lastGeneratedMapping,
    workflowGenerating, 
    mappingGenerating,
    sdkGenerating,
    workflowError,
    mappingError 
  } = useSelector((state: RootState) => state.ai)

  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "system-1",
      role: "assistant",
      content:
        "Hey, I'm your workflow assistant. Tell me what data you want to move and where, and I'll set up the pipeline for you. You can describe it naturally -- like \"sync orders from PostgreSQL to Snowflake\" -- and I'll handle the rest. I can also help you generate mappings between schemas or create SDKs from API specifications.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [activeCapability, setActiveCapability] = useState<AICapability>("workflow")
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Check if mapping is available (requires source and destination)
  const canDoMapping = sourceConnector && destinationConnector && 
    sourceConnector.schema && destinationConnector.schema

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
      const canvasNodes = convertWorkflowToCanvasNodes(lastGeneratedWorkflow, timestamp)
      
      const aiMessage: AIChatMessage = {
        id: `msg-${timestamp}`,
        role: "assistant",
        content: lastGeneratedWorkflow.explanation || "I've generated a workflow based on your description. You can review it and apply it to the canvas.",
        timestamp: new Date(),
        action: {
          type: "suggest_workflow",
          payload: { 
            nodes: canvasNodes,
            workflow: lastGeneratedWorkflow
          },
        },
      }
      
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
      dispatch(clearGeneratedWorkflow())
    }
  }, [lastGeneratedWorkflow, isTyping, dispatch])

  // Handle mapping generation result
  useEffect(() => {
    if (lastGeneratedMapping && isTyping) {
      const timestamp = Date.now()
      const mappings = lastGeneratedMapping.mappings || []
      const suggestions = lastGeneratedMapping.suggestions || []
      
      const aiMessage: AIChatMessage = {
        id: `msg-${timestamp}`,
        role: "assistant",
        content: `I've analyzed the schemas and generated field mappings with ${mappings.length} mappings. ${suggestions.length > 0 ? `\n\nSuggestions: ${suggestions.join(", ")}` : ""}`,
        timestamp: new Date(),
        action: {
          type: "configure_node",
          payload: { 
            mappings: mappings,
            sourceConnector,
            destinationConnector
          },
        },
      }
      
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
      dispatch(clearGeneratedMapping())
    }
  }, [lastGeneratedMapping, isTyping, dispatch, sourceConnector, destinationConnector])

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

  useEffect(() => {
    if (mappingError && isTyping) {
      const aiMessage: AIChatMessage = {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: `Sorry, I encountered an error generating mappings: ${mappingError}. Please try again.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }
  }, [mappingError, isTyping])

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

    try {
      if (activeCapability === "workflow") {
        // Generate workflow
        await dispatch(generateWorkflow({ 
          description: msg 
        })).unwrap()
      } else if (activeCapability === "mapping") {
        // Generate mapping
        if (sourceConnector?.schema && destinationConnector?.schema) {
          await dispatch(generateMapping({
            sourceSchema: sourceConnector.schema,
            destinationSchema: destinationConnector.schema
          })).unwrap()
        } else {
          setIsTyping(false)
          const aiMessage: AIChatMessage = {
            id: `msg-${Date.now()}`,
            role: "assistant",
            content: "To generate mappings, I need both source and destination connectors with their schemas loaded. Please ensure both connectors are configured with their schemas.",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, aiMessage])
        }
      } else if (activeCapability === "sdk") {
        // For SDK generation, we need an OpenAPI spec in the message
        // This would typically be handled differently (file upload, etc.)
        const aiMessage: AIChatMessage = {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: "To generate an SDK, please provide the OpenAPI specification. You can paste the YAML/JSON content or describe what API you want to generate an SDK for.",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
        setIsTyping(false)
      }
    } catch (error) {
      // Error is handled by the useEffect
      console.error("AI operation failed:", error)
    }
  }

  function handleApplyNodes(msg: AIChatMessage) {
    if (msg.action?.payload?.nodes) {
      onAddNodes(msg.action.payload.nodes as CanvasNode[])
    }
  }

  // Determine if any operation is in progress
  const isGenerating = workflowGenerating || mappingGenerating || sdkGenerating

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
              AI Assistant
            </h2>
            <p className="text-[10px] text-muted-foreground">
              {activeCapability === "workflow" && "Workflow Builder"}
              {activeCapability === "mapping" && "Schema Mapper"}
              {activeCapability === "sdk" && "SDK Generator"}
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

      {/* Capability Selector */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveCapability("workflow")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 px-2 py-2 text-[11px] font-medium transition-colors",
            activeCapability === "workflow"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Wand2 className="h-3 w-3" />
          Workflow
        </button>
        <button
          onClick={() => setActiveCapability("mapping")}
          disabled={!canDoMapping}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 px-2 py-2 text-[11px] font-medium transition-colors",
            activeCapability === "mapping"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground",
            !canDoMapping && "opacity-40 cursor-not-allowed"
          )}
          title={!canDoMapping ? "Connect source and destination to enable mapping" : ""}
        >
          <ArrowRightLeft className="h-3 w-3" />
          Map Fields
        </button>
        <button
          onClick={() => setActiveCapability("sdk")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 px-2 py-2 text-[11px] font-medium transition-colors",
            activeCapability === "sdk"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Box className="h-3 w-3" />
          SDK
        </button>
      </div>

      {/* Context Info for Mapping */}
      {activeCapability === "mapping" && canDoMapping && (
        <div className="border-b border-border bg-muted/30 px-3 py-2">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <span className="font-medium text-foreground">{sourceConnector?.name}</span>
            <ArrowRightLeft className="h-3 w-3" />
            <span className="font-medium text-foreground">{destinationConnector?.name}</span>
          </div>
        </div>
      )}

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

              {/* Show mapping suggestions */}
              {msg.role === "assistant" && msg.action?.type === "configure_node" && msg.action?.payload?.mappings && (
                <div className="self-start rounded-md border border-border bg-background p-2">
                  <p className="mb-2 text-[10px] font-semibold text-muted-foreground">
                    Generated Mappings:
                  </p>
                  <div className="flex flex-col gap-1">
                    {(msg.action.payload.mappings as Array<{sourceField: string, destinationField: string, confidence: number}>).slice(0, 5).map((mapping, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[10px]">
                        <span className="font-mono text-foreground">{mapping.sourceField}</span>
                        <ArrowRightLeft className="h-2.5 w-2.5 text-muted-foreground" />
                        <span className="font-mono text-foreground">{mapping.destinationField}</span>
                        <span className={cn(
                          "text-[9px] px-1 rounded",
                          mapping.confidence >= 0.9 ? "bg-green-100 text-green-700" :
                          mapping.confidence >= 0.7 ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        )}>
                          {Math.round(mapping.confidence * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>
                {activeCapability === "workflow" && "Generating workflow..."}
                {activeCapability === "mapping" && "Analyzing schemas..."}
                {activeCapability === "sdk" && "Generating SDK..."}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Preset suggestions for workflow */}
      {activeCapability === "workflow" && messages.length <= 1 && !isTyping && (
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

      {/* Mapping-specific prompts */}
      {activeCapability === "mapping" && messages.length <= 1 && !isTyping && (
        <div className="border-t border-border px-4 py-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Quick Actions
          </p>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => handleSend("Generate field mappings between the source and destination schemas")}
              className="rounded-md border border-border px-2.5 py-2 text-left text-[11px] text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
              disabled={!canDoMapping || isTyping}
            >
              Generate all field mappings
            </button>
            <button
              onClick={() => handleSend("Identify required fields and their transformations")}
              className="rounded-md border border-border px-2.5 py-2 text-left text-[11px] text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
              disabled={!canDoMapping || isTyping}
            >
              Identify required fields
            </button>
          </div>
        </div>
      )}

      {/* SDK-specific prompts */}
      {activeCapability === "sdk" && messages.length <= 1 && !isTyping && (
        <div className="border-t border-border px-4 py-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Quick Actions
          </p>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => handleSend("Generate SDK from OpenAPI spec")}
              className="rounded-md border border-border px-2.5 py-2 text-left text-[11px] text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
              disabled={isTyping}
            >
              Generate SDK from OpenAPI
            </button>
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
            placeholder={
              activeCapability === "workflow" ? "Describe your workflow..." :
              activeCapability === "mapping" ? "Ask about field mappings..." :
              "Describe the API for SDK..."
            }
            className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
            disabled={isTyping}
            aria-label="Describe your request"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            {isGenerating ? (
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