"use client"

import { useState, useRef, useEffect } from "react"
import { Sparkles, Send, X, Loader2, Wand2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { aiPresetMessages } from "@/lib/mock-data"
import type { AIChatMessage, CanvasNode } from "@/lib/types"

interface AIChatPanelProps {
  open: boolean
  onClose: () => void
  onAddNodes: (nodes: CanvasNode[]) => void
}

const mockResponses: Record<string, { text: string; nodes: CanvasNode[] }> = {
  default: {
    text: "I can help you build that workflow. Let me set up the nodes for you. I've added a Source, Transform, and Destination node to the canvas -- now you can configure each one with your connection details.",
    nodes: [
      {
        id: `ai-src-${Date.now()}`,
        type: "source",
        label: "PostgreSQL Source",
        description: "Database source with credentials",
        icon: "Database",
        x: 80,
        y: 150,
      },
      {
        id: `ai-xfm-${Date.now() + 1}`,
        type: "transform",
        label: "AI Transform",
        description: "AI-assisted field mapping",
        icon: "Sparkles",
        x: 340,
        y: 150,
      },
      {
        id: `ai-dst-${Date.now() + 2}`,
        type: "destination",
        label: "Snowflake Dest",
        description: "Cloud data warehouse",
        icon: "Database",
        x: 600,
        y: 150,
      },
    ],
  },
}

export function AIChatPanel({ open, onClose, onAddNodes }: AIChatPanelProps) {
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

  function handleSend(text?: string) {
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

    // Simulate AI response
    setTimeout(() => {
      const response = mockResponses.default
      const aiTimestamp = Date.now()
      const aiNodes = response.nodes.map((n, i) => ({
        ...n,
        id: `ai-${n.type}-${aiTimestamp}-${i}`,
      }))

      const aiMessage: AIChatMessage = {
        id: `msg-${aiTimestamp}`,
        role: "assistant",
        content: response.text,
        timestamp: new Date(),
        action: {
          type: "suggest_workflow",
          payload: { nodes: aiNodes },
        },
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
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
              <span>Thinking...</span>
            </div>
          )}
        </div>
      </div>

      {/* Preset suggestions */}
      {messages.length <= 1 && (
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
            <Send className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
