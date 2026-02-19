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
  Layers,
  Server,
  Cloud,
  ArrowLeftRight,
  Wand2,
  Code
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import type { RootState, AppDispatch } from "@/lib/store"
import { updateNode } from "@/lib/store/slices/workflow-slice"
import { generateMapping, clearGeneratedMapping } from "@/lib/store/slices/ai-slice"
import type { NodeType, ConnectionMethod, CanvasNode, CanvasConnection, ConnectionConfig } from "@/lib/types"
import { cn } from "@/lib/utils"
import { apiClient } from "@/lib/api/api-client"

interface PropertiesPanelProps {
  node: CanvasNode | null
  nodes: CanvasNode[]
  connections: CanvasConnection[]
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
      value: "aggregator",
      label: "Marketplace Aggregator",
      icon: Store,
      description: "Use a pre-built connector",
    },
    {
      value: "mini_connector",
      label: "Mini Connector",
      icon: Server,
      description: "Connect to local agent database",
    },
    {
      value: "generated_sdk",
      label: "Generated SDK",
      icon: Code,
      description: "Use AI-generated TypeScript SDK",
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

export function PropertiesPanel({ node, nodes, connections }: PropertiesPanelProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { installed: aggregators } = useSelector((state: RootState) => state.aggregators)
  const { connectors: miniConnectors } = useSelector((state: RootState) => state.connector)

  const [connectionMethod, setConnectionMethod] = useState<ConnectionMethod>("credentials")
  const [databases, setDatabases] = useState<string[]>([])
  const [tables, setTables] = useState<string[]>([])
  const [columns, setColumns] = useState<any[]>([])
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false)
  const [sdks, setSdks] = useState<any[]>([])
  const [sdksLoading, setSdksLoading] = useState(false)
  const [sdkInfo, setSdkInfo] = useState<any>(null)
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Fetch SDKs when generated_sdk method is selected
  useEffect(() => {
    if (connectionMethod === 'generated_sdk') {
      const fetchSdks = async () => {
        setSdksLoading(true)
        try {
          const sdkList = await apiClient.listSDKs()
          setSdks(sdkList || [])
        } catch (error) {
          console.error("Failed to fetch SDKs:", error)
          setSdks([])
        } finally {
          setSdksLoading(false)
        }
      }
      fetchSdks()
    }
  }, [connectionMethod])

  // Fetch SDK info when SDK is selected
  useEffect(() => {
    if (connectionMethod === 'generated_sdk' && node?.connectionConfig?.sdkId) {
      const fetchSdkInfo = async () => {
        try {
          const info = await apiClient.getSDKInfo(node.connectionConfig!.sdkId!)
          setSdkInfo(info)
        } catch (error) {
          console.error("Failed to fetch SDK info:", error)
          setSdkInfo(null)
        }
      }
      fetchSdkInfo()
    } else {
      setSdkInfo(null)
    }
  }, [connectionMethod, node?.connectionConfig?.sdkId])

  // Sync local state with node config
  useEffect(() => {
    if (node?.connectionConfig?.method) {
      setConnectionMethod(node.connectionConfig.method)
    }
  }, [node])

  // Effect to fetch databases when connectorId changes
  useEffect(() => {
    if (connectionMethod === 'mini_connector' && node?.connectionConfig?.connectorId) {
      const fetchDatabases = async () => {
        setIsLoadingMetadata(true)
        try {
          const dbs = await apiClient.getMiniDatabases(node.connectionConfig!.connectorId!)
          setDatabases(dbs)
        } catch (error) {
          console.error("Failed to fetch databases", error)
          toast.error("Failed to fetch databases")
        } finally {
          setIsLoadingMetadata(false)
        }
      }
      fetchDatabases()
    }
  }, [connectionMethod, node?.connectionConfig?.connectorId])

  // Effect to fetch tables when database changes
  useEffect(() => {
    if (connectionMethod === 'mini_connector' && node?.connectionConfig?.connectorId && node?.connectionConfig?.database) {
      const fetchTables = async () => {
        setIsLoadingMetadata(true)
        try {
          const tbls = await apiClient.getMiniTables(node.connectionConfig!.connectorId!, node.connectionConfig!.database!)
          setTables(tbls)
        } catch (error) {
          console.error("Failed to fetch tables", error)
          toast.error("Failed to fetch tables")
        } finally {
          setIsLoadingMetadata(false)
        }
      }
      fetchTables()
    } else {
        setTables([])
    }
  }, [connectionMethod, node?.connectionConfig?.connectorId, node?.connectionConfig?.database])

  // Effect to fetch columns when table changes
  useEffect(() => {
    if (connectionMethod === 'mini_connector' && node?.connectionConfig?.connectorId && node?.connectionConfig?.database && node?.connectionConfig?.table) {
      const fetchColumns = async () => {
        setIsLoadingMetadata(true)
        try {
          const cols = await apiClient.getMiniColumns(node.connectionConfig!.connectorId!, node.connectionConfig!.database!, node.connectionConfig!.table!)
          setColumns(cols)
        } catch (error) {
           console.error("Failed to fetch columns", error)
           toast.error("Failed to fetch columns")
        } finally {
          setIsLoadingMetadata(false)
        }
      }
      fetchColumns()
    } else {
        setColumns([])
    }
  }, [connectionMethod, node?.connectionConfig?.connectorId, node?.connectionConfig?.database, node?.connectionConfig?.table])

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

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-muted-foreground px-1">Username</label>
                      <input
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-[12px] text-foreground outline-none focus:border-primary/30"
                        placeholder="db_user"
                        value={node.connectionConfig?.username || ""}
                        onChange={(e) => updateConfig({ username: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-muted-foreground px-1">Password</label>
                      <input
                        type="password"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-[12px] text-foreground outline-none focus:border-primary/30"
                        placeholder="••••••••"
                        value={node.connectionConfig?.password || ""}
                        onChange={(e) => updateConfig({ password: e.target.value })}
                      />
                    </div>
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

              {connectionMethod === "mini_connector" && (
                <div className="space-y-5">
                   {/* Select Mini Connector */}
                   <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground px-1">Local Agent</label>
                    <select
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-[12px] text-foreground outline-none focus:border-primary/30 appearance-none"
                      value={node.connectionConfig?.connectorId || ""}
                      onChange={e => updateConfig({ connectorId: e.target.value, database: undefined, table: undefined, columns: [] })}
                    >
                      <option value="" className="bg-card">Select an agent...</option>
                      {miniConnectors.map(mc => (
                        <option key={mc.id} value={mc.id} className="bg-card">
                          {mc.name} ({mc.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  {node.connectionConfig?.connectorId && (
                     <>
                        {/* Select Database */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-muted-foreground px-1">Database</label>
                            <select
                                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-[12px] text-foreground outline-none focus:border-primary/30 appearance-none"
                                value={node.connectionConfig?.database || ""}
                                onChange={e => updateConfig({ database: e.target.value, table: undefined, columns: [] })}
                                disabled={isLoadingMetadata}
                            >
                                <option value="" className="bg-card">Select a database...</option>
                                {databases.map(db => (
                                    <option key={db} value={db} className="bg-card">{db}</option>
                                ))}
                            </select>
                        </div>

                        {/* Select Table */}
                        {node.connectionConfig?.database && (
                             <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-muted-foreground px-1">Table</label>
                                <select
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-[12px] text-foreground outline-none focus:border-primary/30 appearance-none"
                                    value={node.connectionConfig?.table || ""}
                                    onChange={e => updateConfig({ table: e.target.value, columns: [] })}
                                    disabled={isLoadingMetadata}
                                >
                                    <option value="" className="bg-card">Select a table...</option>
                                    {tables.map(tbl => (
                                        <option key={tbl} value={tbl} className="bg-card">{tbl}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Select Columns */}
                        {node.connectionConfig?.table && (
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-muted-foreground px-1">Columns</label>
                                <div className="max-h-40 overflow-y-auto rounded-lg border border-border bg-background p-2 custom-scrollbar">
                                    {isLoadingMetadata ? (
                                        <div className="flex items-center justify-center py-4">
                                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                        </div>
                                    ) : (
                                        columns.map((col: any) => (
                                            <label key={col.name} className="flex items-center gap-2 px-2 py-1.5 hover:bg-accent/50 rounded cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={node.connectionConfig?.columns?.includes(col.name) || false}
                                                    onChange={(e) => {
                                                        const currentColumns = node.connectionConfig?.columns || []
                                                        const newColumns = e.target.checked
                                                            ? [...currentColumns, col.name]
                                                            : currentColumns.filter(c => c !== col.name)
                                                        updateConfig({ columns: newColumns })
                                                    }}
                                                    className="rounded border-border text-primary focus:ring-primary/30"
                                                />
                                                <span className="text-[11px] font-medium text-foreground">{col.name}</span>
                                                <span className="ml-auto text-[9px] text-muted-foreground uppercase">{col.type}</span>
                                            </label>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                     </>
                  )}
                </div>
              )}

              {connectionMethod === "generated_sdk" && (
                <div className="space-y-5">
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="h-4 w-4 text-primary" />
                      <span className="text-[11px] font-bold text-primary uppercase">AI-Generated SDK</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      Use a TypeScript SDK generated from your OpenAPI specification. 
                      The SDK provides type-safe methods for interacting with your API.
                    </p>
                  </div>

                  {/* Select SDK */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-muted-foreground px-1">Generated SDK</label>
                    {sdksLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <select
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-[12px] text-foreground outline-none focus:border-primary/30 appearance-none"
                        value={node.connectionConfig?.sdkId || ""}
                        onChange={e => updateConfig({ sdkId: e.target.value, sdkName: sdks.find(s => s.id === e.target.value)?.className })}
                      >
                        <option value="" className="bg-card">Select an SDK...</option>
                        {sdks.map(sdk => (
                          <option key={sdk.id} value={sdk.id} className="bg-card">
                            {sdk.className || sdk.name || sdk.id}
                          </option>
                        ))}
                      </select>
                    )}
                    {sdks.length === 0 && !sdksLoading && (
                      <p className="text-[10px] text-muted-foreground px-1">
                        No SDKs generated yet. Generate an SDK from the AI page.
                      </p>
                    )}
                  </div>

                  {/* Show SDK Info */}
                  {sdkInfo && (
                    <div className="rounded-xl border border-border bg-accent/30 p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-foreground">Available Methods</span>
                        <span className="text-[9px] text-muted-foreground">
                          {sdkInfo.methods?.length || 0} methods
                        </span>
                      </div>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {(sdkInfo.methods || []).map((method: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 px-2 py-1 rounded bg-background/50">
                            <Code className="h-3 w-3 text-primary" />
                            <span className="text-[10px] font-mono text-foreground">{method.name || method}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Select Method */}
                  {sdkInfo?.methods?.length > 0 && (
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-muted-foreground px-1">SDK Method</label>
                      <select
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-[12px] text-foreground outline-none focus:border-primary/30 appearance-none"
                        value={node.connectionConfig?.sdkMethods?.[0] || ""}
                        onChange={e => updateConfig({ sdkMethods: [e.target.value] })}
                      >
                        <option value="" className="bg-card">Select a method...</option>
                        {sdkInfo.methods.map((method: any) => (
                          <option key={method.name || method} value={method.name || method} className="bg-card">
                            {method.name || method}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Common Actions */}
              <div className="pt-4 flex flex-col gap-2">
                <button 
                  onClick={async () => {
                    setIsTestingConnection(true)
                    setConnectionStatus('idle')
                    try {
                      if (connectionMethod === 'aggregator' && node.connectionConfig?.aggregatorId) {
                        const result = await apiClient.testAggregatorConnection(node.connectionConfig.aggregatorId)
                        setConnectionStatus('success')
                        toast.success("Connection successful", { description: "The aggregator connection test passed." })
                      } else if (connectionMethod === 'mini_connector' && node.connectionConfig?.connectorId) {
                        // Mini connector test - check if connector is online
                        const connector = miniConnectors.find(mc => mc.id === node.connectionConfig?.connectorId)
                        if (connector && connector.status === 'online') {
                          setConnectionStatus('success')
                          toast.success("Connection successful", { description: "Mini connector is online and reachable." })
                        } else {
                          setConnectionStatus('error')
                          toast.error("Connection failed", { description: "Mini connector is offline or unreachable." })
                        }
                      } else if (connectionMethod === 'credentials') {
                        // Credentials - no backend endpoint yet
                        toast.info("Test Connection", { description: "Database credential testing requires backend support. Please ensure your credentials are correct." })
                      } else if (connectionMethod === 'generated_sdk' && node.connectionConfig?.sdkId) {
                        // SDK test - check if SDK exists
                        try {
                          const info = await apiClient.getSDKInfo(node.connectionConfig.sdkId)
                          if (info) {
                            setConnectionStatus('success')
                            toast.success("SDK verified", { description: `SDK loaded with ${info.methods?.length || 0} available methods.` })
                          }
                        } catch {
                          setConnectionStatus('error')
                          toast.error("SDK verification failed", { description: "Could not load SDK information." })
                        }
                      } else {
                        toast.info("Test Connection", { description: "Please configure the connection first." })
                      }
                    } catch (error: any) {
                      setConnectionStatus('error')
                      toast.error("Connection failed", { description: error.message || "An error occurred while testing the connection." })
                    } finally {
                      setIsTestingConnection(false)
                    }
                  }}
                  disabled={isTestingConnection}
                  className="w-full rounded-lg bg-primary/10 border border-primary/20 py-2.5 text-xs font-bold text-primary hover:bg-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isTestingConnection ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Globe className="h-3.5 w-3.5" />
                      Test Connection
                    </>
                  )}
                </button>
                {connectionStatus === 'success' && (
                  <div className="flex items-center gap-2 px-1 text-[10px] text-success">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Connection verified successfully</span>
                  </div>
                )}
                {connectionStatus === 'error' && (
                  <div className="flex items-center gap-2 px-1 text-[10px] text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    <span>Connection test failed</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Transform Configuration ── */}
        {node.type === "transform" && (
          <TransformConfigWithAI 
            node={node} 
            updateConfig={updateConfig} 
            nodes={nodes}
            connections={connections}
            aggregators={aggregators}
          />
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

// Transform node configuration with AI Field Mapping
interface TransformConfigWithAIProps {
  node: CanvasNode
  updateConfig: (updates: Partial<ConnectionConfig>) => void
  nodes: CanvasNode[]
  connections: CanvasConnection[]
  aggregators: any[]
}

function TransformConfigWithAI({ node, updateConfig, nodes, connections, aggregators }: TransformConfigWithAIProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { mappingGenerating, lastGeneratedMapping, mappingError } = useSelector((state: RootState) => state.ai)
  
  const [showMapping, setShowMapping] = useState(false)
  const [sourceNode, setSourceNode] = useState<CanvasNode | null>(null)
  const [destinationNode, setDestinationNode] = useState<CanvasNode | null>(null)

  // Find connected source and destination nodes
  useEffect(() => {
    // Find source node (node that connects TO this transform)
    const incomingConnection = connections.find(c => c.to === node.id)
    if (incomingConnection) {
      const src = nodes.find(n => n.id === incomingConnection.from)
      setSourceNode(src || null)
    } else {
      setSourceNode(null)
    }

    // Find destination node (node that this transform connects TO)
    const outgoingConnection = connections.find(c => c.from === node.id)
    if (outgoingConnection) {
      const dest = nodes.find(n => n.id === outgoingConnection.to)
      setDestinationNode(dest || null)
    } else {
      setDestinationNode(null)
    }
  }, [node.id, nodes, connections])

  // Handle mapping generation result
  useEffect(() => {
    if (lastGeneratedMapping && showMapping) {
      // Update transform config with the generated mappings
      const fieldMappings = lastGeneratedMapping.mappings.map(m => ({
        from: m.sourceField,
        to: m.destinationField,
        transform: m.transform
      }))
      
      updateConfig({ fieldMappings })
      toast.success("Field mappings generated successfully!")
      dispatch(clearGeneratedMapping())
      setShowMapping(false)
    }
  }, [lastGeneratedMapping, showMapping, dispatch, updateConfig])

  // Handle errors
  useEffect(() => {
    if (mappingError && showMapping) {
      toast.error(`Mapping generation failed: ${mappingError}`)
      setShowMapping(false)
    }
  }, [mappingError, showMapping])

  // Build schema from node configuration
  const buildSchemaFromNode = (node: CanvasNode | null): Record<string, any> => {
    if (!node || !node.connectionConfig) {
      return { tables: [] }
    }

    const config = node.connectionConfig

    // For mini connector - use the selected columns
    if (config.method === 'mini_connector' && config.columns && config.columns.length > 0) {
      return {
        tables: [{
          name: config.table || 'unknown_table',
          columns: config.columns
        }],
        connectorId: config.connectorId,
        database: config.database
      }
    }

    // For aggregator - try to get schema from aggregator config
    if (config.method === 'aggregator' && config.aggregatorId) {
      const aggregator = aggregators.find(a => a.id === config.aggregatorId)
      return {
        tables: aggregator?.configSchema?.fields?.map((f: any) => f.name) || [],
        aggregatorId: config.aggregatorId,
        aggregatorName: aggregator?.name
      }
    }

    // For credentials - use database/table info
    if (config.method === 'credentials') {
      return {
        tables: [{
          name: config.table || config.database || 'unknown_table',
          columns: [] // Would need backend to discover columns
        }],
        host: config.host,
        port: config.port,
        database: config.database,
        dbType: config.dbType
      }
    }

    // For generated SDK - use SDK methods/schema
    if (config.method === 'generated_sdk' && config.sdkId) {
      return {
        sdkId: config.sdkId,
        sdkName: config.sdkName,
        methods: config.sdkMethods || []
      }
    }

    return { tables: [] }
  }

  const handleGenerateMapping = async () => {
    if (!sourceNode) {
      toast.error("No source node connected", { description: "Connect a source node to this transform to generate mappings." })
      return
    }

    if (!destinationNode) {
      toast.error("No destination node connected", { description: "Connect a destination node to this transform to generate mappings." })
      return
    }

    const sourceSchema = buildSchemaFromNode(sourceNode)
    const destinationSchema = buildSchemaFromNode(destinationNode)

    // Check if we have meaningful schema data
    const hasSourceColumns = sourceSchema.tables?.some((t: any) => t.columns && t.columns.length > 0)
    const hasDestColumns = destinationSchema.tables?.some((t: any) => t.columns && t.columns.length > 0)

    if (!hasSourceColumns && !sourceSchema.methods?.length) {
      toast.warning("Limited source schema", { 
        description: "The source node has no column data. Configure the source connection with specific columns for better mappings, or the AI will make its best guess." 
      })
    }

    if (!hasDestColumns && !destinationSchema.methods?.length) {
      toast.warning("Limited destination schema", { 
        description: "The destination node has no column data. Configure the destination connection for better mappings." 
      })
    }

    setShowMapping(true)
    try {
      await dispatch(generateMapping({
        sourceSchema,
        destinationSchema
      })).unwrap()
    } catch (error) {
      // Error handled by useEffect
    }
  }

  return (
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

        {/* AI Field Mapping Button */}
        <div className="mb-4">
          <button
            onClick={handleGenerateMapping}
            disabled={mappingGenerating}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-left hover:bg-primary/20 transition-all"
          >
            {mappingGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-xs font-bold text-primary">Generating Mappings...</span>
              </>
            ) : (
              <>
                <ArrowLeftRight className="h-4 w-4 text-primary" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-primary">AI Field Mapping</span>
                  <span className="text-[10px] text-muted-foreground">Auto-generate field mappings from schemas</span>
                </div>
              </>
            )}
          </button>
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
            <label className="text-[11px] font-bold text-muted-foreground px-1">Field Mappings</label>
            <div className="rounded-xl border border-border bg-accent/30 p-3 max-h-40 overflow-y-auto custom-scrollbar">
              {Array.isArray(node.transformConfig?.fieldMappings) && node.transformConfig.fieldMappings.length > 0 ? (
                node.transformConfig.fieldMappings.map((mapping: { from: string; to: string; transform?: string }, idx: number) => (
                  <div key={idx} className="flex items-center gap-2 py-1.5 border-b border-border last:border-0">
                    <span className="text-[10px] text-muted-foreground flex-1 truncate">{mapping.from}</span>
                    <ArrowRight className="h-3 w-3 text-primary" />
                    <span className="text-[10px] text-foreground flex-1 truncate">{mapping.to}</span>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-muted-foreground text-center py-2">
                  No mappings configured. Click "AI Field Mapping" to generate automatically.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
