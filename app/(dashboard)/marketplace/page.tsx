"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search, SlidersHorizontal, Loader2, Sparkles, Code, Download, FileCode, ChevronDown, ChevronUp, Key, Lock, Clock, Globe } from "lucide-react"
import { AggregatorCard } from "@/components/marketplace/aggregator-card"
import { InstallDialog } from "@/components/marketplace/install-dialog"
import { ConfigureModal } from "@/components/marketplace/configure-modal"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { fetchMarketplace, fetchInstalled, installAggregator, deleteAggregator, triggerDiscovery, Aggregator, InstalledAggregator } from "@/lib/store/slices/aggregators-slice"
import { fetchSDKs, generateSDK, downloadSDK, fetchSDK } from "@/lib/store/slices/ai-slice"
import { cn } from "@/lib/utils"
import type { AggregatorCategory } from "@/lib/types"
import { toast } from "sonner"

const tabs: Array<{ label: string; value: AggregatorCategory | "All" | "Installed" | "AISDK" }> = [
  { label: "All", value: "All" },
  { label: "ERP", value: "ERP" },
  { label: "CRM", value: "CRM" },
  { label: "Database", value: "Database" },
  { label: "Cloud", value: "Cloud" },
  { label: "Analytics", value: "Analytics" },
  { label: "Installed", value: "Installed" },
  { label: "AI SDK", value: "AISDK" },
]

export default function MarketplacePage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { marketplaceItems, marketplaceLoading, installed, isInstalling, isDeleting } = useAppSelector(
    state => state.aggregators
  )
  const { sdks, sdksLoading, sdkGenerating, sdkError } = useAppSelector(state => state.ai)
  
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<string>("All")
  const [installDialog, setInstallDialog] = useState<{ aggregator: Aggregator | null; open: boolean }>({ aggregator: null, open: false })
  const [configureModalId, setConfigureModalId] = useState<string | null>(null)
  const [selectedAggregator, setSelectedAggregator] = useState<Aggregator | null>(null)
  
  // AI SDK Generator state
  const [sdkName, setSdkName] = useState("")
  const [openApiSpec, setOpenApiSpec] = useState("")
  const [showSDKTab, setShowSDKTab] = useState(false)
  
  // SDK Credentials state
  const [showCredentials, setShowCredentials] = useState(false)
  const [credentials, setCredentials] = useState({
    baseUrl: "",
    apiKey: "",
    bearerToken: "",
    timeout: 30000,
    authType: "apiKey" as "apiKey" | "bearerToken"
  })

  // Load marketplace on mount
  useEffect(() => {
    dispatch(fetchMarketplace({}))
    dispatch(fetchInstalled())
  }, [dispatch])

  // Load SDKs when AI SDK tab is shown
  useEffect(() => {
    if (activeTab === "AISDK") {
      dispatch(fetchSDKs())
      setShowSDKTab(true)
    } else {
      setShowSDKTab(false)
    }
  }, [activeTab, dispatch])

  // Re-fetch when filters change
  useEffect(() => {
    if (activeTab !== "Installed" && activeTab !== "AISDK") {
      dispatch(fetchMarketplace({
        category: activeTab === "All" ? "" : activeTab,
        search
      }))
    }
  }, [dispatch, activeTab, search])

  // Handle SDK generation
  const handleGenerateSDK = async () => {
    if (!sdkName.trim() || !openApiSpec.trim()) {
      toast.error("Please provide both SDK name and OpenAPI specification")
      return
    }

    // Validate credentials if shown
    if (showCredentials && !credentials.baseUrl.trim()) {
      toast.error("Base URL is required when credentials are enabled")
      return
    }

    try {
      await dispatch(generateSDK({
        className: sdkName,
        openApiSpec: openApiSpec,
        credentials: showCredentials ? {
          baseUrl: credentials.baseUrl,
          apiKey: credentials.authType === "apiKey" ? credentials.apiKey : undefined,
          bearerToken: credentials.authType === "bearerToken" ? credentials.bearerToken : undefined,
          timeout: credentials.timeout
        } : undefined
      })).unwrap()
      
      toast.success("SDK generation started")
      setSdkName("")
      setOpenApiSpec("")
      setShowCredentials(false)
      setCredentials({
        baseUrl: "",
        apiKey: "",
        bearerToken: "",
        timeout: 30000,
        authType: "apiKey"
      })
      // Refresh SDKs list
      dispatch(fetchSDKs())
    } catch (error) {
      toast.error("Failed to generate SDK")
    }
  }

  // Handle SDK download
  const handleDownloadSDK = async (sdkId: string) => {
    try {
      await dispatch(downloadSDK(sdkId)).unwrap()
      toast.success("SDK downloaded")
    } catch (error) {
      toast.error("Failed to download SDK")
    }
  }

  // Merge installed status into marketplace items
  const itemsWithInstalledStatus = useMemo(() => {
    const installedIds = new Set(installed.map(i => i.marketplaceId))
    const installedMap = new Map(installed.map(i => [i.marketplaceId, i]))
    return marketplaceItems.map(item => {
      const inst = installedMap.get(item.id)
      return {
        ...item,
        isInstalled: installedIds.has(item.id),
        installedId: inst?.id,
        schemaStatus: inst?.schemaStatus,
        schema: inst?.schema
      }
    })
  }, [marketplaceItems, installed])

  const handleRetryDiscovery = (aggregator: Aggregator) => {
    toast.info("Retrying schema discovery...")
    dispatch(triggerDiscovery(aggregator.installedId || aggregator.id))
  }

  const handleViewSchema = (aggregator: Aggregator) => {
    const id = aggregator.installedId || aggregator.id
    router.push(`/marketplace/installed/${id}`)
  }

  // Filter for "Installed" tab
  const filteredAggregators = useMemo(() => {
    let itemsToFilter: Aggregator[] = []

    if (activeTab === "Installed") {
      // Return installed aggregators directly without needing marketplace data
      itemsToFilter = installed.map(inst => ({
        ...inst,
        id: inst.id, // Use installed aggregator's own ID
        isInstalled: true,
        installedId: inst.id,
        // Prefer marketplace metadata when available
        name: inst.aggregatorName ? `${inst.name} (${inst.aggregatorName})` : inst.name,
        description: inst.aggregatorDescription || inst.description || 'Installed aggregator',
        category: inst.category || inst.type || 'Unknown',
        version: inst.version || '1.0.0',
        installs: 0,
        rating: 0,
        author: 'Unknown',
        tags: [],
        requiresMiniConnector: inst.requiresMiniConnector || false,
        logoUrl: inst.logoUrl || ''
      } as Aggregator))
    } else {
      itemsToFilter = itemsWithInstalledStatus
    }

    return itemsToFilter.filter(agg =>
      agg.name.toLowerCase().includes(search.toLowerCase()) ||
      agg.description.toLowerCase().includes(search.toLowerCase()) ||
      agg.category.toLowerCase().includes(search.toLowerCase())
    )
  }, [itemsWithInstalledStatus, installed, activeTab, search])

  const handleInstallClick = (agg: Aggregator) => {
    setSelectedAggregator(agg)
    setInstallDialog({ aggregator: agg, open: true })
  }

  const handleInstallSubmit = async (payload: {
    marketplaceId: string
    name: string
    config?: Record<string, any>
    credentials?: Record<string, string>
    testConnection?: boolean
  }) => {
    const result = await dispatch(installAggregator(payload))

    if (installAggregator.fulfilled.match(result)) {
      const data = result.payload
      let message = `${payload.name} installed successfully`

      // Handle test results if connection was tested
      if (payload.testConnection && data?.testResult) {
        if (data.testResult.success) {
          message += ` and connection tested successfully`
        } else {
          toast.warning(`${payload.name} installed but connection test failed: ${data.testResult.message}`)
          dispatch(fetchInstalled())
          setInstallDialog({ aggregator: null, open: false })
          setSelectedAggregator(null)
          return
        }
      }

      toast.success(message)
      dispatch(fetchInstalled())

      // Auto-trigger discovery if test was successful
      if (payload.testConnection && data?.testResult?.success) {
        toast.info("Schema discovery in progress...")
        dispatch(triggerDiscovery(data.id))
      }
    } else {
      toast.error(result.payload as string)
    }
    setInstallDialog({ aggregator: null, open: false })
    setSelectedAggregator(null)
  }

  const handleConfigure = (agg: Aggregator) => {
    const instId = agg.installedId || agg.id
    setConfigureModalId(instId)
    setSelectedAggregator(agg)
  }

  const activeConfigAggregator = useMemo(() => {
    if (!configureModalId) return null
    return installed.find(i => i.id === configureModalId) || null
  }, [configureModalId, installed])

  const handleDelete = async (agg: Aggregator) => {
    const instId = agg.installedId || agg.id
    const confirm = window.confirm(`Delete ${agg.name}? This cannot be undone.`)
    if (!confirm) return

    setSelectedAggregator(agg)
    const result = await dispatch(deleteAggregator(instId))
    if (deleteAggregator.fulfilled.match(result)) {
      toast.success("Aggregator deleted")
      dispatch(fetchInstalled())
    } else {
      toast.error(result.payload as string)
    }
    setSelectedAggregator(null)
  }

  // Loading state
  if (marketplaceLoading && marketplaceItems.length === 0) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Aggregator Marketplace</h1>
          <p className="mt-1 text-sm text-muted-foreground">Loading...</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground text-balance">
          Aggregator Marketplace
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse and install connectors for your data sources and destinations
        </p>
      </div>

      {/* Search + Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center gap-2 rounded-md border border-border bg-card px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search aggregators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            aria-label="Search aggregators"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mb-6 flex flex-wrap gap-1 rounded-lg border border-border bg-card p-1" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            role="tab"
            aria-selected={activeTab === tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              activeTab === tab.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* AI SDK Panel */}
      {activeTab === "AISDK" && (
        <div className="space-y-6">
          {/* Generate SDK Form */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">AI SDK Generator</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Generate a TypeScript SDK from an OpenAPI specification using AI. The SDK can be used in your workflows for custom integrations.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  SDK Name
                </label>
                <input
                  type="text"
                  value={sdkName}
                  onChange={(e) => setSdkName(e.target.value)}
                  placeholder="e.g., MyCustomAPI"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  OpenAPI Specification (JSON or YAML)
                </label>
                <textarea
                  value={openApiSpec}
                  onChange={(e) => setOpenApiSpec(e.target.value)}
                  placeholder='{"openapi": "3.0.0", "info": {...}, "paths": {...}}'
                  rows={10}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 font-mono"
                />
              </div>
              
              {/* API Credentials Section */}
              <div className="border border-border rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowCredentials(!showCredentials)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-accent/30 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">API Credentials (Optional)</span>
                  </div>
                  {showCredentials ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
                
                {showCredentials && (
                  <div className="p-4 space-y-4 bg-background">
                    <p className="text-xs text-muted-foreground">
                      Provide API credentials to be stored with the SDK. These will be used when executing SDK methods.
                    </p>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Base URL <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          type="url"
                          value={credentials.baseUrl}
                          onChange={(e) => setCredentials({ ...credentials, baseUrl: e.target.value })}
                          placeholder="https://api.example.com"
                          className="w-full rounded-md border border-border bg-background pl-10 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Authentication Type
                      </label>
                      <select
                        value={credentials.authType}
                        onChange={(e) => setCredentials({ ...credentials, authType: e.target.value as "apiKey" | "bearerToken" })}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                      >
                        <option value="apiKey">API Key</option>
                        <option value="bearerToken">Bearer Token</option>
                      </select>
                    </div>
                    
                    {credentials.authType === "apiKey" ? (
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          API Key
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            type="password"
                            value={credentials.apiKey}
                            onChange={(e) => setCredentials({ ...credentials, apiKey: e.target.value })}
                            placeholder="••••••••••••••••"
                            className="w-full rounded-md border border-border bg-background pl-10 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Bearer Token
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            type="password"
                            value={credentials.bearerToken}
                            onChange={(e) => setCredentials({ ...credentials, bearerToken: e.target.value })}
                            placeholder="••••••••••••••••"
                            className="w-full rounded-md border border-border bg-background pl-10 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Timeout (ms)
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          type="number"
                          value={credentials.timeout}
                          onChange={(e) => setCredentials({ ...credentials, timeout: parseInt(e.target.value) || 30000 })}
                          placeholder="30000"
                          className="w-full rounded-md border border-border bg-background pl-10 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Default: 30000ms (30 seconds)</p>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleGenerateSDK}
                disabled={sdkGenerating || !sdkName.trim() || !openApiSpec.trim()}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sdkGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate SDK
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated SDKs List */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Code className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Generated SDKs</h2>
            </div>
            
            {sdksLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : sdks.length > 0 ? (
              <div className="space-y-3">
                {sdks.map((sdk) => (
                  <div
                    key={sdk.id}
                    className="flex items-center justify-between rounded-md border border-border bg-background p-4"
                  >
                    <div className="flex items-center gap-3">
                      <FileCode className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">{sdk.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Created: {new Date(sdk.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                        sdk.status === "completed" && "bg-green-100 text-green-800",
                        sdk.status === "generating" && "bg-yellow-100 text-yellow-800",
                        sdk.status === "pending" && "bg-gray-100 text-gray-800",
                        sdk.status === "failed" && "bg-red-100 text-red-800"
                      )}>
                        {sdk.status}
                      </span>
                      {sdk.status === "completed" && (
                        <button
                          onClick={() => handleDownloadSDK(sdk.id)}
                          className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-foreground hover:bg-accent"
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No SDKs generated yet. Use the form above to generate your first SDK.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Regular Aggregator Grid (when not AI SDK tab) */}
      {activeTab !== "AISDK" && (
        <>
          {filteredAggregators.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredAggregators.map((agg) => (
                <AggregatorCard
                  key={agg.id}
                  aggregator={agg}
                  onInstall={handleInstallClick}
                  onConfigure={agg.isInstalled ? handleConfigure : undefined}
                  onDelete={agg.isInstalled ? handleDelete : undefined}
                  onRetryDiscovery={agg.isInstalled ? handleRetryDiscovery : undefined}
                  onViewSchema={agg.isInstalled ? handleViewSchema : undefined}
                  isInstalling={isInstalling && selectedAggregator?.id === agg.id}
                  isDeleting={isDeleting && selectedAggregator?.id === agg.id}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card py-16">
              <SlidersHorizontal className="mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                No aggregators found
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </>
      )}

      <InstallDialog
        open={installDialog.open}
        aggregator={installDialog.aggregator}
        isInstalling={isInstalling}
        onClose={() => setInstallDialog({ aggregator: null, open: false })}
        onInstall={handleInstallSubmit}
      />

      <ConfigureModal
        aggregator={activeConfigAggregator}
        open={!!configureModalId}
        onClose={() => setConfigureModalId(null)}
        onSuccess={() => dispatch(fetchInstalled())}
      />
    </div>
  )
}
