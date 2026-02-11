"use client"

import { useState, useEffect } from "react"
import { Table, Database, Search, ChevronRight, Hash, Type, Calendar, Loader2, Maximize2, Minimize2, ArrowRight, AlertCircle, Link2, GitGraph } from "lucide-react"
import { cn } from "@/lib/utils"
import { apiClient } from "@/lib/api/api-client"
import { useAppDispatch } from "@/lib/store/hooks"
import { fetchTables, fetchRelationships } from "@/lib/store/slices/aggregators-slice"

interface SchemaBrowserProps {
    aggregatorId: string
    initialTables?: Array<{ name: string; columnCount?: number }>
}

interface TableDetail {
    name: string
    columns: Array<{
        name: string
        type: string
        nullable: boolean
        isPrimary?: boolean
        isForeign?: boolean
    }>
}

export function SchemaBrowser({ aggregatorId, initialTables = [] }: SchemaBrowserProps) {
    const dispatch = useAppDispatch()
    const [tables, setTables] = useState<any[]>(Array.isArray(initialTables) ? initialTables : [])
    const [search, setSearch] = useState("")
    const [selectedTable, setSelectedTable] = useState<string | null>(null)
    const [tableDetail, setTableDetail] = useState<TableDetail | null>(null)
    const [previewData, setPreviewData] = useState<any[] | null>(null)
    const [isLoadingDetail, setIsLoadingDetail] = useState(false)
    const [isLoadingPreview, setIsLoadingPreview] = useState(false)
    const [isLoadingSchema, setIsLoadingSchema] = useState(false)
    const [viewMode, setViewMode] = useState<'structure' | 'preview' | 'relationships'>('structure')
    const [fullSchema, setFullSchema] = useState<any>(null)
    const [hasFetched, setHasFetched] = useState(false)

    // Sync state with props
    useEffect(() => {
        if (Array.isArray(initialTables) && initialTables.length > 0) {
            setTables(initialTables)
            setHasFetched(true)
        } else {
            setTables([])
            setHasFetched(false)
        }
        setSelectedTable(null)
        setTableDetail(null)
        setPreviewData(null)
    }, [aggregatorId, initialTables])

    useEffect(() => {
        const currentTables = Array.isArray(tables) ? tables : []
        if (!hasFetched && currentTables.length === 0) {
            setHasFetched(true)
            dispatch(fetchTables(aggregatorId)).then((result: any) => {
                if (result.payload) {
                    const data = Array.isArray(result.payload) ? result.payload : (result.payload.tables || [])
                    setTables(data)
                }
            })
        }
    }, [aggregatorId, tables, hasFetched, dispatch])

    useEffect(() => {
        if (selectedTable) {
            loadTableDetail(selectedTable)
            loadPreviewData(selectedTable)
        }
    }, [selectedTable])

    useEffect(() => {
        if (viewMode === 'relationships' && !fullSchema) {
            loadFullSchema()
        }
    }, [viewMode, fullSchema])

    const loadFullSchema = async () => {
        setIsLoadingSchema(true)
        try {
            const result: any = await dispatch(fetchRelationships(aggregatorId)).unwrap()
            setFullSchema(result)
        } catch (error) {
            console.error("Failed to load full schema", error)
        } finally {
            setIsLoadingSchema(false)
        }
    }

    const loadTableDetail = async (tableName: string) => {
        setIsLoadingDetail(true)
        try {
            const data = await apiClient.getTableDetails(aggregatorId, tableName)
            setTableDetail(data)
        } catch (error) {
            console.error("Failed to load table details", error)
        } finally {
            setIsLoadingDetail(false)
        }
    }

    const loadPreviewData = async (tableName: string) => {
        setIsLoadingPreview(true)
        try {
            const data = await apiClient.previewTable(aggregatorId, tableName, 20)
            // Handle both array of rows and wrapped data object
            const rows = Array.isArray(data) ? data : (data.rows || [])
            setPreviewData(rows)
        } catch (error) {
            console.error("Failed to load preview data", error)
            setPreviewData([])
        } finally {
            setIsLoadingPreview(false)
        }
    }

    const filteredTables = Array.isArray(tables)
        ? tables.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))
        : []

    const getTypeIcon = (type: string) => {
        const t = type.toLowerCase()
        if (t.includes('int') || t.includes('decimal') || t.includes('number')) return <Hash className="h-3 w-3" />
        if (t.includes('date') || t.includes('time')) return <Calendar className="h-3 w-3" />
        return <Type className="h-3 w-3" />
    }

    return (
        <div className="flex flex-1 min-h-[600px] w-full items-stretch overflow-hidden rounded-xl border border-border bg-card shadow-lg">
            {/* Tables Sidebar */}
            <div className="flex w-64 flex-col border-r border-border bg-muted/5">
                <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                            <Database className="h-4 w-4 text-primary" />
                            Tables
                        </h3>
                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold">
                            {tables.length}
                        </span>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search tables..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-md border border-border bg-background pl-8 pr-3 py-1.5 text-xs outline-none focus:border-primary"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5 custom-scrollbar">
                    {filteredTables.map((table) => (
                        <button
                            key={table.name}
                            onClick={() => setSelectedTable(table.name)}
                            className={cn(
                                "w-full flex items-center justify-between rounded-md px-3 py-2 text-left text-xs transition-colors",
                                selectedTable === table.name
                                    ? "bg-primary text-primary-foreground font-medium"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <div className="flex items-center gap-2 truncate">
                                <Table className={cn("h-3.5 w-3.5", selectedTable === table.name ? "text-primary-foreground" : "text-primary/60")} />
                                <span className="truncate">{table.name}</span>
                            </div>
                            <ChevronRight className={cn("h-3 w-3 opacity-50", selectedTable === table.name ? "block" : "hidden")} />
                        </button>
                    ))}
                    {filteredTables.length === 0 && (
                        <div className="py-8 text-center text-xs text-muted-foreground italic">
                            No tables found
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col bg-background min-w-0">
                {selectedTable ? (
                    <>
                        {/* Tab Header */}
                        <div className="flex items-center justify-between border-b border-border px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Table className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-lg font-bold text-foreground leading-tight truncate">{selectedTable}</h2>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span>{tableDetail?.columns.length || 0} columns</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/30 p-1 shrink-0 ml-4">
                                <button
                                    onClick={() => setViewMode('structure')}
                                    className={cn(
                                        "rounded-md px-3 py-1 text-xs font-semibold transition-all",
                                        viewMode === 'structure' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    Structure
                                </button>
                                <button
                                    onClick={() => setViewMode('preview')}
                                    className={cn(
                                        "rounded-md px-3 py-1 text-xs font-semibold transition-all",
                                        viewMode === 'preview' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    Preview
                                </button>
                                <button
                                    onClick={() => setViewMode('relationships')}
                                    className={cn(
                                        "rounded-md px-3 py-1 text-xs font-semibold transition-all",
                                        viewMode === 'relationships' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    Relationships
                                </button>
                            </div>
                        </div>

                        {/* View Content */}
                        <div className="flex-1 overflow-hidden">
                            {viewMode === 'structure' && (
                                <div className="p-6 h-full overflow-auto custom-scrollbar">
                                    {isLoadingDetail ? (
                                        <div className="flex items-center justify-center py-20">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        </div>
                                    ) : tableDetail ? (
                                        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                                            <table className="w-full text-left text-sm">
                                                <thead>
                                                    <tr className="border-b border-border bg-muted/20">
                                                        <th className="px-4 py-3 font-semibold text-muted-foreground">Column</th>
                                                        <th className="px-4 py-3 font-semibold text-muted-foreground">Type</th>
                                                        <th className="px-4 py-3 font-semibold text-muted-foreground">Nullable</th>
                                                        <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Key</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border">
                                                    {tableDetail.columns.map((col) => (
                                                        <tr key={col.name} className="hover:bg-muted/5 transition-colors">
                                                            <td className="px-4 py-3">
                                                                <span className="font-medium text-foreground">{col.name}</span>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                                    {getTypeIcon(col.type)}
                                                                    <span className="text-xs">{col.type}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span className={cn(
                                                                    "text-xs px-2 py-0.5 rounded-full font-medium",
                                                                    col.nullable ? "text-amber-600 bg-amber-500/10" : "text-emerald-600 bg-emerald-500/10"
                                                                )}>
                                                                    {col.nullable ? 'YES' : 'NO'}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-right">
                                                                {col.isPrimary && (
                                                                    <span className="inline-flex items-center gap-1 rounded bg-info/10 px-1.5 py-0.5 text-[10px] font-bold text-info">
                                                                        PK
                                                                    </span>
                                                                )}
                                                                {col.isForeign && (
                                                                    <span className="ml-1 inline-flex items-center gap-1 rounded bg-chart-5/10 px-1.5 py-0.5 text-[10px] font-bold text-chart-5">
                                                                        FK
                                                                    </span>
                                                                )}
                                                                {!col.isPrimary && !col.isForeign && <span className="text-muted-foreground text-xs">—</span>}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                                            <AlertCircle className="mb-2 h-8 w-8 opacity-20" />
                                            <p>Failed to load structure</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {viewMode === 'preview' && (
                                <div className="h-full flex flex-col overflow-hidden">
                                    {isLoadingPreview ? (
                                        <div className="flex items-center justify-center py-20">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        </div>
                                    ) : previewData && previewData.length > 0 ? (
                                        <div className="flex-1 overflow-auto custom-scrollbar">
                                            <table className="min-w-full divide-y divide-border text-left text-xs">
                                                <thead className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
                                                    <tr>
                                                        {Object.keys(previewData[0]).map((key) => (
                                                            <th key={key} className="whitespace-nowrap px-4 py-3 font-bold text-foreground">
                                                                {key}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border bg-background">
                                                    {previewData.map((row, i) => (
                                                        <tr key={i} className="hover:bg-muted/30 transition-colors">
                                                            {Object.values(row).map((val: any, j) => (
                                                                <td key={j} className="whitespace-nowrap px-4 py-2.5 text-muted-foreground">
                                                                    {val === null ? (
                                                                        <span className="text-[10px] font-bold text-muted-foreground/30 italic">NULL</span>
                                                                    ) : typeof val === 'object' ? (
                                                                        JSON.stringify(val)
                                                                    ) : (
                                                                        String(val)
                                                                    )}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                                            <Maximize2 className="mb-2 h-8 w-8 opacity-20" />
                                            <p>No preview data available</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {viewMode === 'relationships' && (
                                <div className="p-6 h-full overflow-auto custom-scrollbar bg-muted/5">
                                    <div className="mb-6">
                                        <h3 className="text-sm font-bold flex items-center gap-2 mb-1 text-foreground">
                                            <Link2 className="h-4 w-4 text-primary" />
                                            Table Relationships
                                        </h3>
                                        <p className="text-xs text-muted-foreground">Visualization of interconnections via foreign keys.</p>
                                    </div>

                                    {isLoadingSchema ? (
                                        <div className="flex items-center justify-center py-20">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        </div>
                                    ) : (() => {
                                        const relationships = fullSchema?.relationships?.filter((rel: any) =>
                                            rel.fromTable === selectedTable || rel.toTable === selectedTable
                                        ) || []

                                        return relationships.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {relationships.map((rel: any, i: number) => (
                                                    <div key={i} className="rounded-xl border border-border bg-card p-4 shadow-sm hover:border-primary/30 transition-all">
                                                        <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
                                                            <div className="flex items-center gap-2 min-w-0">
                                                                <span className={cn(
                                                                    "text-xs font-bold truncate",
                                                                    rel.fromTable === selectedTable ? "text-primary" : "text-foreground"
                                                                )}>{rel.fromTable}</span>
                                                            </div>
                                                            <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0 mx-2" />
                                                            <div className="flex items-center gap-2 min-w-0">
                                                                <span className={cn(
                                                                    "text-xs font-bold truncate",
                                                                    rel.toTable === selectedTable ? "text-primary" : "text-foreground"
                                                                )}>{rel.toTable}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                                            <span className="truncate">{rel.fromColumn}</span>
                                                            <span className="px-1.5 py-0.5 rounded-full bg-muted font-mono shrink-0 mx-2">{rel.constraintName ? 'FK' : '1:N'}</span>
                                                            <span className="truncate">{rel.toColumn}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-xl bg-muted/10">
                                                <GitGraph className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                                                <p className="text-sm font-medium text-foreground">No relationships for {selectedTable}</p>
                                                <p className="text-xs text-muted-foreground mt-1 max-w-xs text-center">
                                                    Foreign key connections involving this table will appear here.
                                                </p>
                                            </div>
                                        )
                                    })()}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center text-center p-12 bg-muted/5">
                        <div className="relative mb-6">
                            <div className="absolute -inset-4 rounded-full bg-primary/5 blur-xl" />
                            <div className="relative h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Search className="h-8 w-8" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-foreground">Select a table</h3>
                        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                            Choose a table from the sidebar to explore its structure, preview data, and view relationships.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
