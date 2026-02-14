"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Settings,
  Info,
  Database,
  Globe,
  Store,
  Link,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Layers
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import type { RootState, AppDispatch } from "@/lib/store"
import { updateNode } from "@/lib/store/slices/workflow-slice"
import type { NodeType, ConnectionMethod, CanvasNode, ConnectionConfig } from "@/lib/types"
import { cn } from "@/lib/utils"

interface PropertiesPanelProps {
  node: CanvasNode | null
}

const typeLabels: Record<NodeType, string> = {
  source: "Source Node",
  transform: "Transform Node",
  destination: "Destination Node",
}

const connectionMethods: Array<{
  value: ConnectionMethod
  label: string
  icon: React.ElementType
  description: string
}> = [
    {
      value: "credentials",
      label: "Database Credentials",
      icon: Database,
      description: "Host, port, username, password",
    },
    {
      value: "connection_string",
      label: "Connection String",
      icon: Link,
      description: "postgres://, mongodb://, etc.",
    },
    {
      value: "aggregator",
      label: "Marketplace Aggregator",
      icon: Store,
      description: "Use a pre-built connector",
    },
    {
      value: "custom_api",
      label: "Custom API",
      icon: Globe,
      description: "Your own REST/GraphQL endpoint",
    },
  ]

const dbTypes = [
  "postgresql",
  "mysql",
  "mongodb",
  "oracle",
  "mssql",
  "snowflake",
  "bigquery",
]

export function PropertiesPanel({ node }: PropertiesPanelProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { installed: aggregators } = useSelector((state: RootState) => state.aggregators)
  const { connectors: miniConnectors } = useSelector((state: RootState) => state.connector)

  const [connectionMethod, setConnectionMethod] = useState<ConnectionMethod>("credentials")

  // Sync local state with node config
  useEffect(() => {
    if (node?.connectionConfig?.method) {
      setConnectionMethod(node.connectionConfig.method)
    }
  }, [node])

  if (!node) {
    return (
      <div className="flex w-80 shrink-0 flex-col border-l border-border bg-card">
        <div className="border-b border-border px-4 py-4">
          <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-muted-foreground">
            Properties
          </h2>
        </div>
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="text-center max-w-[200px]">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/50 border border-border">
              <Settings className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-foreground/70">
              No Node Selected
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
              Select a component on the canvas to configure its properties and logic.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const isDataNode = node.type === "source" || node.type === "destination"
  const selectedAggregator = aggregators.find(a => a.id === node.connectionConfig?.aggregatorId)

  const updateConfig = (updates: Partial<ConnectionConfig>) => {
    dispatch(updateNode({
      id: node.id,
      data: {
        connectionConfig: {
          ...(node.connectionConfig || { method: connectionMethod }),
          ...updates
        }
      }
    }))
  }

  return (
    <div className="flex w-80 shrink-0 flex-col border-l border-border bg-card">
      <div className="border-b border-border px-4 py-4 flex items-center justify-between">
        <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-muted-foreground">
          Properties
        </h2>
        <div className="flex items-center gap-1.5 rounded-full bg-accent/50 px-2 py-0.5 border border-border">
          <div className={cn(
            "h-1.5 w-1.5 rounded-full animate-pulse",
            node.type === "source" ? "bg-primary" : node.type === "transform" ? "bg-warning" : "bg-success"
          )} />
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">Live</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {/* Node Identity */}
        <div className="mb-8">
          <div className="flex items-start gap-3 mb-4">
            <div className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-gradient-to-br",
              node.type === "source" ? "from-primary/10 to-transparent" :
                node.type === "transform" ? "from-warning/10 to-transparent" :
                  "from-success/10 to-transparent"
            )}>
              <Zap className={cn(
                "h-5 w-5",
                node.type === "source" ? "text-primary" :
                  node.type === "transform" ? "text-warning" :
                    "text-success"
              )} />
            </div>
            <div className="min-w-0">
              <input
                className="w-full bg-transparent text-sm font-bold text-foreground outline-none focus:text-primary transition-colors"
                value={node.label}
                onChange={(e) => dispatch(updateNode({ id: node.id, data: { label: e.target.value } }))}
              />
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-0.5">
                {typeLabels[node.type]}
              </p>
            </div>
          </div>

          <textarea
            className="w-full bg-transparent text-[11px] text-muted-foreground leading-relaxed outline-none border-none resize-none px-0"
            value={node.description}
            placeholder="Click to add a description for this node..."
            rows={2}
            onChange={(e) => dispatch(updateNode({ id: node.id, data: { description: e.target.value } }))}
          />
        </div>

        {/* ── Source / Destination Configuration ── */}
        {isDataNode && (
          <div className="space-y-6">
            <section>
              <h3 className="text-[10px] font-bold uppercase tracking-[2px] text-muted-foreground/60 mb-3">
                Connection
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {connectionMethods.map((cm) => {
                  const Icon = cm.icon
                  const active = connectionMethod === cm.value
                  return (
                    <button
                      key={cm.value}
                      onClick={() => {
                        setConnectionMethod(cm.value)
                        updateConfig({ method: cm.value })
                      }}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all duration-300",
                        active
                          ? "border-primary/30 bg-primary/5"
                          : "border-border bg-accent/30 hover:border-primary/20 hover:bg-accent/50"
                      )}
                    >
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-colors",
                        active ? "bg-primary text-white" : "bg-background text-muted-foreground group-hover:text-foreground"
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className={cn(
                          "text-[12px] font-bold transition-colors",
                          active ? "text-primary" : "text-foreground/70 group-hover:text-foreground"
                        )}>
                          {cm.label}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {cm.description}
                        </p>
                      </div>
                      {active && (
                        <div className="absolute right-3 h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </button>
                  )
                })}
              </div>
            </section>

            <div className="h-px bg-border" />

            {/* ── Dynamic Form Based on Method ── */}
            <div className="space-y-5 animate-in fade-in slide-in-from-top-1 duration-300">
              {connectionMethod === "credentials" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground px-1">DB Type</label>
                    <div className="grid grid-cols-4 gap-1">
                      {dbTypes.slice(0, 4).map(db => (
                        <button
                          key={db}
                          onClick={() => updateConfig({ dbType: db as any })}
                          className={cn(
                            "text-[9px] font-bold uppercase py-1.5 rounded-md border transition-all",
                            node.connectionConfig?.dbType === db
                              ? "bg-primary border-primary text-white"
                              : "bg-background border-border text-muted-foreground hover:border-primary/30"
                          )}
                        >
                          {db.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-[11px] font-bold text-muted-foreground px-1">Host</label>
                      <input
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-[12px] text-foreground outline-none focus:border-primary/30"
                        placeholder="db.example.com"
                        value={node.connectionConfig?.host || ""}
                        onChange={(e) => updateConfig({ host: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-muted-foreground px-1">Port</label>
                      <input
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-[12px] text-foreground outline-none focus:border-primary/30"
                        placeholder="5432"
                        type="number"
                        value={node.connectionConfig?.port || ""}
                        onChange={(e) => updateConfig({ port: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground px-1">Database</label>
                    <input
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-[12px] text-foreground outline-none focus:border-primary/30"
                      placeholder="production_db"
                      value={node.connectionConfig?.database || ""}
                      onChange={(e) => updateConfig({ database: e.target.value })}
                    />
                  </div>
                </>
              )}

              {connectionMethod === "aggregator" && (
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground px-1">Installed Connector</label>
                    <select
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-[12px] text-foreground outline-none focus:border-primary/30 appearance-none"
                      value={node.connectionConfig?.aggregatorId || ""}
                      onChange={e => updateConfig({ aggregatorId: e.target.value })}
                    >
                      <option value="" className="bg-card">Select an aggregator...</option>
                      {aggregators.map(a => (
                        <option key={a.id} value={a.id} className="bg-card">{a.name}</option>
                      ))}
                    </select>
                  </div>

                  {selectedAggregator && (
                    <div className="space-y-4 pt-2">
                      <div className="rounded-xl border border-border bg-accent/30 p-3">
                        <div className="flex items-center gap-3 mb-2">
                          <img src={selectedAggregator.logoUrl} className="h-6 w-6 rounded" alt="" />
                          <span className="text-xs font-bold text-foreground/80">{selectedAggregator.name}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground line-clamp-2">
                          {selectedAggregator.description}
                        </p>
                      </div>

                      {/* Mini Connector Support */}
                      {selectedAggregator.requiresMiniConnector && (
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between px-1">
                            <label className="text-[11px] font-bold text-muted-foreground">Mini Connector</label>
                            <span className="text-[9px] font-bold text-primary uppercase tracking-tighter">On-Premise Required</span>
                          </div>
                          <select
                            className="w-full rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5 text-[12px] text-foreground outline-none focus:border-primary/40 appearance-none"
                            value={node.connectionConfig?.headers?.['x-mini-connector'] || ""}
                            onChange={e => updateConfig({ headers: { ...node.connectionConfig?.headers, 'x-mini-connector': e.target.value } })}
                          >
                            <option value="" className="bg-card">Select active agent...</option>
                            {miniConnectors.map(mc => (
                              <option key={mc.id} value={mc.id} className="bg-card">
                                {mc.name} ({mc.status})
                              </option>
                            ))}
                          </select>
                          <div className="flex items-center gap-2 px-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-success" />
                            <span className="text-[10px] text-muted-foreground">Connected to Del-Site-01</span>
                          </div>
                        </div>
                      )}

                      {/* Auth Fields */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-muted-foreground px-1">API Key / Token</label>
                        <input
                          type="password"
                          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-[12px] text-foreground outline-none focus:border-primary/30"
                          placeholder="••••••••••••••••"
                          value={node.connectionConfig?.apiKey || ""}
                          onChange={(e) => updateConfig({ apiKey: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Common Actions */}
              <div className="pt-4 flex flex-col gap-2">
                <button className="w-full rounded-lg bg-primary/10 border border-primary/20 py-2.5 text-xs font-bold text-primary hover:bg-primary/20 transition-all flex items-center justify-center gap-2">
                  <Globe className="h-3.5 w-3.5" />
                  Test Connection
                </button>
                <div className="flex items-center gap-2 px-1 text-[10px] text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 text-success" />
                  <span>System verified: Salesforce API v52.0</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Transform Configuration ── */}
        {node.type === "transform" && (
          <div className="space-y-6">
            <section>
              <h3 className="text-[10px] font-bold uppercase tracking-[2px] text-muted-foreground/60 mb-3">
                Transformation Node
              </h3>

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                    <Sparkles className="h-3 w-3" />
                  </div>
                  <span className="text-[11px] font-bold text-primary uppercase">AI Transformation</span>
                </div>
                <p className="text-[11px] text-foreground/70 leading-relaxed">
                  The SDK will be automatically generated based on the source and destination schemas.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-muted-foreground px-1">Logic Pattern</label>
                  <div className="grid grid-cols-1 gap-2">
                    <button className="flex items-center justify-between rounded-xl border border-primary/40 bg-primary/5 px-4 py-3 text-left">
                      <div className="flex items-center gap-3">
                        <ArrowRight className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold text-white">Direct Mapping</span>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </button>
                    <button className="flex items-center justify-between rounded-xl border border-white/5 bg-accent/30 px-4 py-3 text-left opacity-50">
                      <div className="flex items-center gap-3">
                        <Layers className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-bold text-muted-foreground">Aggregation</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-muted-foreground px-1">Mapping Script (Read Only)</label>
                  <div className="rounded-xl border border-border bg-accent/30 p-3 font-mono text-[10px] text-primary/70 overflow-hidden">
                    <span className="text-muted-foreground">// Auto-generated by Antigravity AI</span><br />
                    <span className="text-purple-400">export function</span> transform(source) &#123;<br />
                    &nbsp;&nbsp;<span className="text-purple-400">return</span> &#123;<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;id: source.external_id,<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;name: source.full_name<br />
                    &nbsp;&nbsp;&#125;;<br />
                    &#125;
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="border-t border-border p-4 bg-accent/10">
        <button
          onClick={() => toast.success("Node configuration saved")}
          className="w-full rounded-xl bg-primary text-primary-foreground py-3 text-xs font-bold hover:bg-primary/90 active:scale-[0.98] transition-all shadow-md"
        >
          Close & Return to Canvas
        </button>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(var(--primary-rgb), 0.2);
        }
      `}</style>
    </div>
  )
}
