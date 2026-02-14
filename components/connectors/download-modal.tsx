"use client"

import { useState } from "react"
import { X, Key, Download, Terminal, Check, Copy, Monitor, Server } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { createConnector } from "@/lib/store/slices/connector-slice"
import { CreateConnectorDtoTypeEnum, CreateConnectorDtoNetworkAccessEnum } from "@/src/generated/api/api"

interface DownloadModalProps {
  open: boolean
  onClose: () => void
}

type Platform = "windows" | "linux" | "macos"

const platforms: Array<{ value: Platform; label: string; icon: React.ReactNode }> = [
  { value: "linux", label: "Linux", icon: <Terminal className="h-4 w-4" /> },
  { value: "windows", label: "Windows", icon: <Monitor className="h-4 w-4" /> },
  { value: "macos", label: "macOS", icon: <Monitor className="h-4 w-4" /> },
]

export function DownloadModal({ open, onClose }: DownloadModalProps) {
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector((state) => state.connector)

  const [step, setStep] = useState(0) // Start at 0 for Name input
  const [platform, setPlatform] = useState<Platform>("linux")
  const [connectorName, setConnectorName] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  if (!open) return null

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  async function handleCreate() {
    if (!connectorName.trim()) {
      toast.error("Please enter a connector name")
      return
    }

    setIsCreating(true)
    try {
      const resultAction = await dispatch(createConnector({
        name: connectorName,
        type: CreateConnectorDtoTypeEnum.Mini,
        networkAccess: CreateConnectorDtoNetworkAccessEnum.Local,
        supportedAggregators: []
      }))

      if (createConnector.fulfilled.match(resultAction)) {
        const newConnector = resultAction.payload
        // API returns apiKey only on creation
        if (newConnector.apiKey) {
          setApiKey(newConnector.apiKey)
          setStep(1)
        } else {
          toast.error("API Key not received")
        }
      } else {
        toast.error("Failed to create connector: " + (resultAction.payload as string))
      }
    } catch (err) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-card-foreground">
            Download Mini Connector
          </h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 border-b border-border px-6 py-3">
          {[0, 1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                  s < step
                    ? "bg-success text-success-foreground"
                    : s === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {s < step ? <Check className="h-3 w-3" /> : s}
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  s === step ? "text-card-foreground" : "text-muted-foreground"
                )}
              >
                {s === 0 && "Name"}
                {s === 1 && "API Key"}
                {s === 2 && "Download"}
                {s === 3 && "Setup"}
              </span>
              {s < 3 && (
                <div className="mx-1 h-px w-8 bg-border" />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {step === 0 && (
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-semibold text-card-foreground">
                  Name Your Connector
                </h3>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                Give your local connector a recognizable name (e.g., "Office Server", "Backup Laptop").
              </p>
              <input
                type="text"
                value={connectorName}
                onChange={(e) => setConnectorName(e.target.value)}
                placeholder="e.g. My Local Connector"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                autoFocus
              />
            </div>
          )}

          {step === 1 && (
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-semibold text-card-foreground">
                  Generate API Key
                </h3>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                This key authenticates your Mini Connector with the 360Solve cloud. Keep it secure.
              </p>
              <div className="flex items-center gap-2 rounded-md border border-border bg-background p-3">
                <code className="flex-1 truncate font-mono text-xs text-card-foreground">
                  {apiKey}
                </code>
                <button
                  onClick={() => handleCopy(apiKey)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="Copy API key"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-semibold text-card-foreground">
                  Choose Platform
                </h3>
              </div>
              <div className="flex flex-col gap-2">
                {platforms.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPlatform(p.value)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-4 transition-all",
                      platform === p.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-md",
                        platform === p.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {p.icon}
                    </div>
                    <span className="text-sm font-medium text-card-foreground">
                      {p.label}
                    </span>
                    {platform === p.value && (
                      <Check className="ml-auto h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-semibold text-card-foreground">
                  Setup Instructions
                </h3>
              </div>
              <div className="flex flex-col gap-3">
                <div className="rounded-lg bg-foreground p-4">
                  <p className="mb-2 text-xs font-medium text-primary-foreground/70">
                    1. Extract and install
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 font-mono text-xs text-primary-foreground">
                      {platform === "linux" && "tar -xzf connector-linux.tar.gz && cd connector && ./install.sh"}
                      {platform === "windows" && "Expand-Archive connector-win.zip -DestinationPath .\\connector"}
                      {platform === "macos" && "tar -xzf connector-macos.tar.gz && cd connector && ./install.sh"}
                    </code>
                    <button
                      onClick={() => handleCopy("tar -xzf connector.tar.gz")}
                      className="text-primary-foreground/50 hover:text-primary-foreground"
                      aria-label="Copy command"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="rounded-lg bg-foreground p-4">
                  <p className="mb-2 text-xs font-medium text-primary-foreground/70">
                    2. Configure and start
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 font-mono text-xs text-primary-foreground">
                      ./connector --api-key {apiKey.slice(0, 12)}... --start
                    </code>
                    <button
                      onClick={() => handleCopy(`./connector --api-key ${apiKey} --start`)}
                      className="text-primary-foreground/50 hover:text-primary-foreground"
                      aria-label="Copy command"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border bg-muted/30 px-6 py-4">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1} // Can't go back to creation once created
              className={cn(
                "rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
                step === 1 && "invisible"
              )}
            >
              Back
            </button>
          ) : (
            <div />
          )}
          {step === 0 ? (
            <button
              onClick={handleCreate}
              disabled={isCreating || !connectorName.trim()}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {isCreating ? "Creating..." : "Create & Get Key"}
            </button>
          ) : step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98]"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={onClose}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98]"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
