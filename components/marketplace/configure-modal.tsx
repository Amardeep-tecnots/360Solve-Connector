"use client"

import { useEffect, useState } from "react"
import { CheckCircle, XCircle, Loader2, Database, RefreshCw, AlertCircle, Table } from "lucide-react"
import { useAppDispatch } from "@/lib/store/hooks"
import { configureAggregator, testConnection, triggerDiscovery, fetchTables, InstalledAggregator, AggregatorConfigField } from "@/lib/store/slices/aggregators-slice"
import { toast } from "sonner"

interface ConfigureModalProps {
  aggregator: InstalledAggregator | null
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ConfigureModal({ aggregator, open, onClose, onSuccess }: ConfigureModalProps) {
  const dispatch = useAppDispatch()
  const [instanceName, setInstanceName] = useState("")
  const [credentials, setCredentials] = useState<Record<string, string>>({})
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [activeTab, setActiveTab] = useState<'config' | 'schema'>('config')
  const [isDiscovering, setIsDiscovering] = useState(false)
  const [isLocked, setIsLocked] = useState(true)

  useEffect(() => {
    if (aggregator) {
      setInstanceName(aggregator.name)
      // Initialize credential values from saved config if available
      const initialCreds: Record<string, string> = {}
      const savedConfig = aggregator.config || {}

      aggregator.configSchema?.fields?.forEach((field) => {
        // Only populate non-password fields or check if they exist
        if (savedConfig[field.name]) {
          initialCreds[field.name] = savedConfig[field.name]
        } else if (field.required) {
          initialCreds[field.name] = ""
        }
      })

      setCredentials(initialCreds)
      setTestResult(null)
      setIsSaving(false)
      setIsTesting(false)
      setActiveTab('config')
      setIsLocked(aggregator.configuration?.hasCredentials || false)

      // Fetch schema if it's already discovered and we don't have tables yet
      if (aggregator.schemaStatus === 'discovered' && (!Array.isArray(aggregator.schema?.tables) || aggregator.schema.tables.length === 0)) {
        dispatch(fetchTables(aggregator.id))
      }
    }
  }, [aggregator, dispatch])

  if (!open || !aggregator) return null

  const handleDiscover = async () => {
    setIsDiscovering(true)
    try {
      await dispatch(triggerDiscovery(aggregator.id)).unwrap()
      toast.success("Schema discovery triggered")
      // Start polling or just inform user
    } catch (error: any) {
      toast.error(error || "Failed to trigger discovery")
    } finally {
      setIsDiscovering(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await dispatch(
        configureAggregator({ id: aggregator.id, name: instanceName, credentials })
      ).unwrap()
      toast.success("Configuration saved")
      onSuccess()
      setIsLocked(true)
      setTestResult(null)
    } catch (error: any) {
      toast.error(error || "Failed to save configuration")
    } finally {
      setIsSaving(false)
    }
  }

  const handleTest = async () => {
    setIsTesting(true)
    setTestResult(null)
    try {
      // Save credentials first to backend storage
      await dispatch(
        configureAggregator({ id: aggregator.id, name: instanceName, credentials })
      ).unwrap()

      // Use backend response to determine actual status
      const result = await dispatch(testConnection(aggregator.id)).unwrap()
      if (result?.success) {
        setTestResult({ success: true, message: result.message || "Connection successful" })
        setIsLocked(true)
      } else {
        setTestResult({ success: false, message: result?.message || "Connection failed" })
      }
    } catch (error: any) {
      setTestResult({ success: false, message: error || "Connection failed" })
    } finally {
      setIsTesting(false)
    }
  }

  const renderField = (field: AggregatorConfigField) => {
    const value = credentials[field.name] ?? ""

    if (field.type === "select") {
      return (
        <div className="space-y-2" key={field.name}>
          <label className="text-sm font-medium text-card-foreground" htmlFor={field.name}>
            {field.label}
            {field.required && <span className="text-destructive"> *</span>}
          </label>
          <select
            id={field.name}
            value={value}
            onChange={(e) => setCredentials({ ...credentials, [field.name]: e.target.value })}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none ring-0 focus:border-primary disabled:opacity-50 disabled:bg-muted/20"
            required={field.required}
            disabled={isLocked}
          >
            <option value="">Select...</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {field.helpText && (
            <p className="text-xs text-muted-foreground">{field.helpText}</p>
          )}
        </div>
      )
    }

    return (
      <div className="space-y-2" key={field.name}>
        <label className="text-sm font-medium text-card-foreground" htmlFor={field.name}>
          {field.label}
          {field.required && <span className="text-destructive"> *</span>}
        </label>
        <input
          id={field.name}
          type={field.type === "password" ? "password" : field.type === "url" ? "url" : "text"}
          value={value}
          onChange={(e) => setCredentials({ ...credentials, [field.name]: e.target.value })}
          placeholder={isLocked && field.type === "password" ? "••••••••••••••••" : (field.placeholder || field.label)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none ring-0 focus:border-primary disabled:opacity-50 disabled:bg-muted/20"
          required={field.required}
          disabled={isLocked}
        />
        {field.helpText && (
          <p className="text-xs text-muted-foreground">{field.helpText}</p>
        )}
      </div>
    )
  }

  const hasMissingRequired = (aggregator.configSchema?.fields || []).some(
    (f) => f.required && (!credentials[f.name] || credentials[f.name].trim() === "")
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">Configure {aggregator.name}</h2>
            <p className="text-sm text-muted-foreground">Enter credentials to connect</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border bg-muted/20 px-4">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'config'
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Configuration
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'schema'
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Schema
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {activeTab === 'config' ? (
            <div className="space-y-4 px-4 py-5">
              {aggregator.type && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-muted px-2 py-1 font-medium text-foreground/80">{aggregator.type}</span>
                  {aggregator.aggregatorName && <span className="text-foreground/70">{aggregator.aggregatorName}</span>}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="instanceName" className="text-sm font-medium text-card-foreground">
                  Instance name
                </label>
                <input
                  id="instanceName"
                  value={instanceName}
                  onChange={(e) => setInstanceName(e.target.value)}
                  disabled={isLocked}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none ring-0 focus:border-primary disabled:opacity-50 disabled:bg-muted/20"
                />
              </div>

              {isLocked && (
                <div className="flex items-center justify-between rounded-md border border-green-500/30 bg-green-500/5 px-3 py-2">
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span>Connection established</span>
                  </div>
                  <button
                    onClick={() => setIsLocked(false)}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Edit Connection
                  </button>
                </div>
              )}

              <div className="space-y-4">
                {(aggregator.configSchema?.fields || []).map(renderField)}
                {(!aggregator.configSchema || aggregator.configSchema.fields.length === 0) && (
                  <p className="text-sm text-muted-foreground">No configuration required for this connector.</p>
                )}
              </div>

              {testResult && (
                <div
                  className={`flex items-start gap-2 rounded-md border px-3 py-2 ${testResult.success ? "border-green-500 bg-green-500/5" : "border-red-500 bg-red-500/5"}`}
                >
                  {testResult.success ? (
                    <CheckCircle className="mt-0.5 h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 text-red-600" />
                  )}
                  <div className="text-sm text-card-foreground">{testResult.message}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 px-4 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-foreground">Discovery Status</h3>
                  <p className="text-xs text-muted-foreground">Cached schema info</p>
                </div>
                <button
                  onClick={handleDiscover}
                  disabled={isDiscovering || aggregator.schemaStatus === 'discovering'}
                  className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-all hover:bg-secondary/80 disabled:opacity-50"
                >
                  {isDiscovering || aggregator.schemaStatus === 'discovering' ? (
                    <RefreshCw className="h-3 w-3 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3 w-3" />
                  )}
                  {aggregator.schemaStatus === 'discovered' ? "Rediscover" : "Discover Now"}
                </button>
              </div>

              <div className="rounded-lg border border-border bg-muted/10 p-4">
                {aggregator.schemaStatus === 'discovering' ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <Loader2 className="mb-2 h-6 w-6 animate-spin text-primary" />
                    <p className="text-sm font-medium">Schema discovery in progress...</p>
                    <p className="text-xs text-muted-foreground">This may take a few moments</p>
                  </div>
                ) : aggregator.schemaStatus === 'discovered' ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{aggregator.schema?.tableCount || 0} Tables found</span>
                      {aggregator.schema?.discoveredAt && (
                        <span>Last updated: {new Date(aggregator.schema.discoveredAt).toLocaleString()}</span>
                      )}
                    </div>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                      {Array.isArray(aggregator.schema?.tables) ? (
                        aggregator.schema!.tables.map((table) => (
                          <div key={table.name} className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2">
                            <div className="flex items-center gap-2">
                              <Table className="h-3.5 w-3.5 text-primary/70" />
                              <span className="text-sm font-medium">{table.name}</span>
                            </div>
                            <span className="text-[10px] text-muted-foreground">{table.columnCount} columns</span>
                          </div>
                        ))
                      ) : (
                        <p className="py-4 text-center text-xs text-muted-foreground italic">No tables found</p>
                      )}
                      {(Array.isArray(aggregator.schema?.tables) && aggregator.schema!.tables.length === 0) && (
                        <p className="py-4 text-center text-xs text-muted-foreground italic">No tables found</p>
                      )}
                    </div>
                  </div>
                ) : aggregator.schemaStatus === 'failed' ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center text-destructive">
                    <AlertCircle className="mb-2 h-6 w-6" />
                    <p className="text-sm font-medium">Discovery failed</p>
                    <p className="text-xs text-muted-foreground">Please check your credentials and try again</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <Database className="mb-2 h-6 w-6 text-muted-foreground" />
                    <p className="text-sm font-medium">No schema data</p>
                    <p className="text-xs text-muted-foreground">Trigger discovery to see available tables</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border bg-muted/30 px-4 py-3">
          <button
            onClick={onClose}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            disabled={isSaving || isTesting}
          >
            Cancel
          </button>
          <button
            onClick={handleTest}
            className="inline-flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/90 disabled:opacity-60"
            disabled={isTesting || hasMissingRequired}
          >
            {isTesting && <Loader2 className="h-4 w-4 animate-spin" />}
            Test Connection
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            disabled={isSaving || hasMissingRequired}
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
