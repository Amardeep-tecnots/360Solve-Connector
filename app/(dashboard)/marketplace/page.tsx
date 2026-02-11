"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search, SlidersHorizontal, Loader2 } from "lucide-react"
import { AggregatorCard } from "@/components/marketplace/aggregator-card"
import { InstallDialog } from "@/components/marketplace/install-dialog"
import { ConfigureModal } from "@/components/marketplace/configure-modal"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { fetchMarketplace, fetchInstalled, installAggregator, deleteAggregator, triggerDiscovery, Aggregator, InstalledAggregator } from "@/lib/store/slices/aggregators-slice"
import { cn } from "@/lib/utils"
import type { AggregatorCategory } from "@/lib/types"
import { toast } from "sonner"

const tabs: Array<{ label: string; value: AggregatorCategory | "All" | "Installed" }> = [
  { label: "All", value: "All" },
  { label: "ERP", value: "ERP" },
  { label: "CRM", value: "CRM" },
  { label: "Database", value: "Database" },
  { label: "Cloud", value: "Cloud" },
  { label: "Analytics", value: "Analytics" },
  { label: "Installed", value: "Installed" },
]

export default function MarketplacePage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { marketplaceItems, marketplaceLoading, installed, isInstalling, isDeleting } = useAppSelector(
    state => state.aggregators
  )
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<string>("All")
  const [installDialog, setInstallDialog] = useState<{ aggregator: Aggregator | null; open: boolean }>({ aggregator: null, open: false })
  const [configureModalId, setConfigureModalId] = useState<string | null>(null)
  const [selectedAggregator, setSelectedAggregator] = useState<Aggregator | null>(null)

  // Load marketplace on mount
  useEffect(() => {
    dispatch(fetchMarketplace({}))
    dispatch(fetchInstalled())
  }, [dispatch])

  // Re-fetch when filters change
  useEffect(() => {
    if (activeTab !== "Installed") {
      dispatch(fetchMarketplace({
        category: activeTab === "All" ? "" : activeTab,
        search
      }))
    }
  }, [dispatch, activeTab, search])

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

      {/* Grid */}
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
