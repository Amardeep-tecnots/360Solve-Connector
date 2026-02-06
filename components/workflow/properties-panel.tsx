"use client"

import { useState } from "react"
import { Settings, Info, Database, Globe, Store, Link, Sparkles } from "lucide-react"
import type { NodeType, ConnectionMethod, CanvasNode } from "@/lib/types"
import { cn } from "@/lib/utils"
import { aggregators } from "@/lib/mock-data"

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
  const [connectionMethod, setConnectionMethod] = useState<ConnectionMethod>("credentials")

  if (!node) {
    return (
      <div className="flex w-80 shrink-0 flex-col border-l border-border bg-card">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Properties
          </h2>
        </div>
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="text-center">
            <Settings className="mx-auto mb-2 h-6 w-6 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">
              Select a node to configure it
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground/70">
              Click any node on the canvas
            </p>
          </div>
        </div>
      </div>
    )
  }

  const isDataNode = node.type === "source" || node.type === "destination"

  return (
    <div className="flex w-80 shrink-0 flex-col border-l border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Properties
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {/* Node Info */}
        <div className="mb-5">
          <div className="mb-2 flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-card-foreground">
              {node.label}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">{node.description}</p>
          <div className="mt-2 flex items-center gap-2 text-[10px]">
            <span
              className={cn(
                "rounded px-1.5 py-0.5 font-semibold",
                node.type === "source" && "bg-primary/10 text-primary",
                node.type === "transform" && "bg-warning/10 text-warning",
                node.type === "destination" && "bg-success/10 text-success"
              )}
            >
              {typeLabels[node.type]}
            </span>
          </div>
        </div>

        {/* ── Source / Destination Config ── */}
        {isDataNode && (
          <div className="flex flex-col gap-4">
            {/* Connection Method Selector */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-card-foreground">
                Connection Method
              </label>
              <div className="flex flex-col gap-1.5">
                {connectionMethods.map((cm) => {
                  const Icon = cm.icon
                  return (
                    <button
                      key={cm.value}
                      onClick={() => setConnectionMethod(cm.value)}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md border px-3 py-2 text-left transition-all",
                        connectionMethod === cm.value
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-3.5 w-3.5 shrink-0",
                          connectionMethod === cm.value
                            ? "text-primary"
                            : "text-muted-foreground"
                        )}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-card-foreground">
                          {cm.label}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {cm.description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* ── Credentials Form ── */}
            {connectionMethod === "credentials" && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-card-foreground">
                    Database Type
                  </label>
                  <select className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10">
                    {dbTypes.map((db) => (
                      <option key={db} value={db}>
                        {db.charAt(0).toUpperCase() + db.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-card-foreground">
                      Host
                    </label>
                    <input
                      type="text"
                      placeholder="db.example.com"
                      className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-card-foreground">
                      Port
                    </label>
                    <input
                      type="number"
                      placeholder="5432"
                      className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-card-foreground">
                    Database Name
                  </label>
                  <input
                    type="text"
                    placeholder="my_database"
                    className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-card-foreground">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="admin"
                    className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-card-foreground">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
                {node.type === "source" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-card-foreground">
                      Query / Table
                    </label>
                    <textarea
                      placeholder="SELECT * FROM orders WHERE..."
                      rows={3}
                      className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 font-mono text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
                    />
                  </div>
                )}
                {node.type === "destination" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-card-foreground">
                      Target Table
                    </label>
                    <input
                      type="text"
                      placeholder="public.orders"
                      className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                )}
              </div>
            )}

            {/* ── Connection String Form ── */}
            {connectionMethod === "connection_string" && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-card-foreground">
                    Connection String
                  </label>
                  <textarea
                    placeholder="postgresql://user:pass@host:5432/dbname?sslmode=require"
                    rows={3}
                    className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 font-mono text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Supports PostgreSQL, MySQL, MongoDB, MSSQL, and more
                  </p>
                </div>
                {node.type === "source" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-card-foreground">
                      Query
                    </label>
                    <textarea
                      placeholder="SELECT * FROM table_name"
                      rows={2}
                      className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 font-mono text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
                    />
                  </div>
                )}
                {node.type === "destination" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-card-foreground">
                      Target Table
                    </label>
                    <input
                      type="text"
                      placeholder="schema.table_name"
                      className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                )}
              </div>
            )}

            {/* ── Aggregator Form ── */}
            {connectionMethod === "aggregator" && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-card-foreground">
                    Select Aggregator
                  </label>
                  <select className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10">
                    <option value="">Choose a connector...</option>
                    {aggregators
                      .filter((a) => a.isInstalled)
                      .map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-card-foreground">
                    API Key / Auth Token
                  </label>
                  <input
                    type="password"
                    placeholder="sk_live_..."
                    className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
                <div className="rounded-md border border-border bg-muted/30 p-2.5">
                  <p className="text-[10px] text-muted-foreground">
                    Need more connectors? Visit the{" "}
                    <a
                      href="/marketplace"
                      className="font-medium text-primary hover:underline"
                    >
                      Marketplace
                    </a>{" "}
                    to install new ones.
                  </p>
                </div>
              </div>
            )}

            {/* ── Custom API Form ── */}
            {connectionMethod === "custom_api" && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-card-foreground">
                    Endpoint URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://api.mycompany.com/data"
                    className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-card-foreground">
                    HTTP Method
                  </label>
                  <select className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10">
                    <option>GET</option>
                    <option>POST</option>
                    <option>PUT</option>
                    <option>PATCH</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-card-foreground">
                    Authentication
                  </label>
                  <select className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10">
                    <option value="none">No Authentication</option>
                    <option value="bearer">Bearer Token</option>
                    <option value="api_key">API Key (Header)</option>
                    <option value="basic">Basic Auth</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-card-foreground">
                    Auth Token / Key
                  </label>
                  <input
                    type="password"
                    placeholder="Bearer token or API key"
                    className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-card-foreground">
                    Custom Headers (JSON)
                  </label>
                  <textarea
                    placeholder={'{"Content-Type": "application/json"}'}
                    rows={2}
                    className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 font-mono text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
                  />
                </div>
              </div>
            )}

            {/* Write Mode for destinations */}
            {node.type === "destination" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-card-foreground">
                  Write Mode
                </label>
                <select className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10">
                  <option>Insert</option>
                  <option>Upsert</option>
                  <option>Append</option>
                  <option>Replace</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* ── Transform Config ── */}
        {node.type === "transform" && (
          <div className="flex flex-col gap-4">
            {node.icon === "Sparkles" && (
              <div className="rounded-md border border-primary/20 bg-primary/5 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-semibold text-primary">
                    AI-Powered Transform
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Describe your transformation in plain English and the AI will
                  generate the mapping logic for you.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-card-foreground">
                {node.icon === "Sparkles"
                  ? "Describe transformation"
                  : "Transform Logic"}
              </label>
              <textarea
                placeholder={
                  node.icon === "Sparkles"
                    ? "Map 'order_id' to 'OrderID', convert dates to ISO format, merge first_name and last_name into full_name..."
                    : "Define your mapping rules..."
                }
                rows={4}
                className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
              />
            </div>

            {/* Field Mappings */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-card-foreground">
                Field Mappings
              </label>
              <div className="flex flex-col gap-2">
                {[
                  { from: "order_id", to: "OrderID" },
                  { from: "created_at", to: "CreatedDate" },
                  { from: "amount", to: "TotalAmount" },
                ].map((mapping, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 rounded-md bg-muted/50 px-2.5 py-1.5"
                  >
                    <code className="text-[10px] font-mono text-card-foreground">
                      {mapping.from}
                    </code>
                    <span className="text-[10px] text-muted-foreground">
                      {" -> "}
                    </span>
                    <code className="text-[10px] font-mono text-primary">
                      {mapping.to}
                    </code>
                  </div>
                ))}
              </div>
              <button className="mt-2 text-[10px] font-medium text-primary hover:underline">
                + Add field mapping
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="skipNull"
                className="h-3.5 w-3.5 rounded border-border text-primary"
              />
              <label
                htmlFor="skipNull"
                className="text-xs text-card-foreground"
              >
                Skip null values
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="border-t border-border p-4 flex gap-2">
        <button className="flex-1 rounded-md border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent">
          Test Connection
        </button>
        <button className="flex-1 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98]">
          Save Config
        </button>
      </div>
    </div>
  )
}
