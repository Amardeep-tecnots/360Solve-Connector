"use client"

import { useState, useMemo } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { AggregatorCard } from "@/components/marketplace/aggregator-card"
import { aggregators } from "@/lib/mock-data"
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
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<string>("All")

  const filtered = useMemo(() => {
    return aggregators.filter((agg) => {
      const matchesSearch =
        search === "" ||
        agg.name.toLowerCase().includes(search.toLowerCase()) ||
        agg.description.toLowerCase().includes(search.toLowerCase()) ||
        agg.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))

      const matchesTab =
        activeTab === "All" ||
        (activeTab === "Installed" ? agg.isInstalled : agg.category === activeTab)

      return matchesSearch && matchesTab
    })
  }, [search, activeTab])

  function handleInstall(id: string) {
    const agg = aggregators.find((a) => a.id === id)
    if (agg) {
      toast.success(`${agg.name} installation started`, {
        description: "The connector will be ready in a few moments.",
      })
    }
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
      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((agg) => (
            <AggregatorCard
              key={agg.id}
              aggregator={agg}
              onInstall={handleInstall}
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
    </div>
  )
}
