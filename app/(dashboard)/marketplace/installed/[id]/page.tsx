"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Settings, Database, Info, Layout, Loader2 } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { fetchInstalled, selectAggregator } from "@/lib/store/slices/aggregators-slice"
import { SchemaBrowser } from "@/components/marketplace/schema-browser"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function AggregatorDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { installed, installedLoading } = useAppSelector(state => state.aggregators)
    const [activeTab, setActiveTab] = useState<'overview' | 'schema' | 'settings'>('schema')

    useEffect(() => {
        dispatch(fetchInstalled())
    }, [dispatch])

    const aggregator = installed.find(a => a.id === id)

    useEffect(() => {
        if (aggregator) {
            dispatch(selectAggregator(aggregator))
        }
    }, [aggregator, dispatch])

    if (installedLoading && !aggregator) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!aggregator) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
                <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-4">
                    <Info className="h-8 w-8" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Aggregator Not Found</h1>
                <p className="text-muted-foreground mt-2 max-w-sm">
                    We couldn't find the aggregator you're looking for. It might have been deleted or you may not have permission to view it.
                </p>
                <button
                    onClick={() => router.push('/marketplace')}
                    className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Marketplace
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen -m-6 overflow-hidden bg-background">
            {/* Top Header */}
            <div className="border-b border-border bg-card px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/marketplace')}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                {aggregator.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-foreground leading-tight">{aggregator.name}</h1>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                                        {aggregator.category || aggregator.type}
                                    </span>
                                    <span>v{aggregator.version}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/30 p-1">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={cn(
                                    "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
                                    activeTab === 'overview' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <Layout className="h-4 w-4" />
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('schema')}
                                className={cn(
                                    "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
                                    activeTab === 'schema' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <Database className="h-4 w-4" />
                                Schema
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={cn(
                                    "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
                                    activeTab === 'settings' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <Settings className="h-4 w-4" />
                                Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden p-6 bg-muted/5 min-h-0">
                {activeTab === 'schema' ? (
                    <div className="h-full flex flex-col">
                        <SchemaBrowser
                            aggregatorId={aggregator.id}
                            initialTables={aggregator.schema?.tables}
                        />
                    </div>
                ) : activeTab === 'overview' ? (
                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-2 space-y-6">
                            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                                <h3 className="font-bold text-foreground mb-4">About this Connector</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {aggregator.aggregatorDescription || aggregator.description}
                                </p>
                            </div>

                            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                                <h3 className="font-bold text-foreground mb-4">Connection Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Status</p>
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "h-2 w-2 rounded-full",
                                                aggregator.status === 'active' ? "bg-success" : "bg-destructive"
                                            )} />
                                            <span className="text-sm font-semibold capitalize">{aggregator.status}</span>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Last Sync</p>
                                        <p className="text-sm font-semibold">
                                            {aggregator.lastSyncAt ? new Date(aggregator.lastSyncAt).toLocaleString() : 'Never'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                                <h3 className="font-bold text-foreground mb-4">Configuration</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Instance Name</p>
                                        <p className="text-sm font-medium">{aggregator.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Category</p>
                                        <p className="text-sm font-medium">{aggregator.category}</p>
                                    </div>
                                    <button
                                        onClick={() => setActiveTab('settings')}
                                        className="w-full mt-2 rounded-md bg-secondary px-4 py-2 text-xs font-bold text-secondary-foreground hover:bg-secondary/80"
                                    >
                                        Edit Configuration
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-xl border border-border bg-card p-12 text-center max-w-2xl mx-auto shadow-sm">
                        <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <h3 className="text-xl font-bold text-foreground">Settings coming soon</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                            Configuration editing and advanced settings for {aggregator.name} will be available in the next update.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
