"use client"

import { useMemo, useState } from "react"
import { X, Loader2 } from "lucide-react"
import type { Aggregator, AggregatorConfigField } from "@/lib/store/slices/aggregators-slice"

interface InstallDialogProps {
  open: boolean
  aggregator: Aggregator | null
  isInstalling: boolean
  onClose: () => void
  onInstall: (payload: {
    marketplaceId: string
    name: string
    config?: Record<string, any>
    credentials?: Record<string, string>
    testConnection?: boolean
  }) => void
}

export function InstallDialog({ open, aggregator, isInstalling, onClose, onInstall }: InstallDialogProps) {
  const [name, setName] = useState("")
  const [config, setConfig] = useState<Record<string, any>>({})
  const [credentials, setCredentials] = useState<Record<string, string>>({})
  const [testConnection, setTestConnection] = useState(true)

  const requiredFields = useMemo(() => aggregator?.configSchema?.fields?.filter(f => f.required) || [], [aggregator])
  const hasMissingRequired = requiredFields.some(f => !credentials[f.name] || credentials[f.name].trim() === "")

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
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none ring-0 focus:border-primary"
            required={field.required}
          >
            <option value="">Select...</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {field.helpText && <p className="text-xs text-muted-foreground">{field.helpText}</p>}
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
          placeholder={field.placeholder || field.label}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none ring-0 focus:border-primary"
          required={field.required}
        />
        {field.helpText && <p className="text-xs text-muted-foreground">{field.helpText}</p>}
      </div>
    )
  }

  if (!open || !aggregator) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onInstall({
      marketplaceId: aggregator.id,
      name: name.trim(),
      config,
      credentials,
      testConnection
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">Install {aggregator.name}</h2>
            <p className="text-sm text-muted-foreground">Give this instance a unique name</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-4 py-5">
          <div className="space-y-2">
            <label htmlFor="instanceName" className="text-sm font-medium text-card-foreground">
              Instance name
            </label>
            <input
              id="instanceName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Salesforce Production"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none ring-0 focus:border-primary"
              required
              autoFocus
            />
            <p className="text-xs text-muted-foreground">Use a unique name per instance.</p>
          </div>

          <div className="space-y-4">
            {(aggregator.configSchema?.fields || []).map((field) => renderField(field))}
            {(!aggregator.configSchema || aggregator.configSchema.fields.length === 0) && (
              <p className="text-xs text-muted-foreground">No credentials required to install.</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              id="testConnection"
              type="checkbox"
              checked={testConnection}
              onChange={(e) => setTestConnection(e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            <label htmlFor="testConnection" className="text-sm text-card-foreground">
              Test connection after install
            </label>
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              disabled={isInstalling}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
              disabled={!name.trim() || isInstalling || hasMissingRequired}
            >
              {isInstalling && <Loader2 className="h-4 w-4 animate-spin" />}
              Install
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
