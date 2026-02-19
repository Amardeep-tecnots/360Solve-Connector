"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Save, Play, Undo, Sparkles, Loader2, ArrowLeft } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import {
  addNode,
  addConnection,
  setNodes,
  setConnections,
  selectNode,
  undo,
  resetWorkflow,
  setWorkflowName,
  setWorkflowDescription,
  setWorkflowId,
  loadWorkflow,
} from "@/lib/store/slices/workflow-slice"
import type { RootState, AppDispatch } from "@/lib/store"
import {
  fetchWorkflow,
  createWorkflow,
  updateWorkflow,
  fetchWorkflows,
  validateWorkflow,
  clearErrors,
  clearSelected,
} from "@/lib/store/slices/workflows-slice"
import { triggerWorkflow } from "@/lib/store/slices/executions-slice"
import { fetchInstalled } from "@/lib/store/slices/aggregators-slice"
import { fetchConnectors } from "@/lib/store/slices/connector-slice"
import { NodePalette } from "@/components/workflow/node-palette"
import { WorkflowCanvas } from "@/components/workflow/workflow-canvas"
import { PropertiesPanel } from "@/components/workflow/properties-panel"
import { AIChatPanel } from "@/components/workflow/ai-chat-panel"
import type { CanvasNode, CanvasConnection, NodeType, ConnectionMethod, PaletteNode } from "@/lib/types"
import { toast } from "sonner"
import { apiClient } from "@/lib/api/api-client"

export default function WorkflowsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const workflowIdFromQuery = searchParams.get("id")

  const dispatch = useDispatch<AppDispatch>()
  const {
    nodes,
    connections,
    selectedNodeId,
    workflowId,
    workflowName,
    workflowDescription,
  } = useSelector((state: RootState) => state.workflow)

  const {
    selectedWorkflow,
    detailLoading,
    isCreating,
    isUpdating,
    isValidating,
    operationError,
    workflows: allWorkflows,
  } = useSelector((state: RootState) => state.workflows)

  const {
    installed: installedAggregators
  } = useSelector((state: RootState) => state.aggregators)

  const {
    connectors: miniConnectors
  } = useSelector((state: RootState) => state.connector)

  const {
    operationLoading: isExecuting
  } = useSelector((state: RootState) => state.executions)

  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  const [isLoadingWorkflow, setIsLoadingWorkflow] = useState(false)
  const [sdks, setSdks] = useState<any[]>([])
  const [sdksLoading, setSdksLoading] = useState(false)

  // Fetch SDKs for palette
  useEffect(() => {
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
  }, [])

  // Load workflow from query param
  useEffect(() => {
    if (workflowIdFromQuery) {
      setIsLoadingWorkflow(true)
      dispatch(fetchWorkflow(workflowIdFromQuery))
    } else {
      // Reset for new workflow
      dispatch(resetWorkflow())
      dispatch(clearSelected())
    }

    // Fetch resources for palette
    dispatch(fetchInstalled())
    dispatch(fetchWorkflows("all"))
    dispatch(fetchConnectors())

    return () => {
      dispatch(clearErrors())
    }
  }, [workflowIdFromQuery, dispatch])

  // Map loaded workflow to canvas state
  useEffect(() => {
    if (selectedWorkflow && workflowIdFromQuery) {
      // Map API workflow to canvas state
      const canvasNodes: CanvasNode[] = selectedWorkflow.definition.activities.map(
        (activity): CanvasNode => ({
          id: activity.id,
          type:
            activity.type === "extract" || 
            activity.type === "mini-connector-source" || 
            activity.type === "cloud-connector-source"
              ? "source"
              : activity.type === "load" || 
                activity.type === "cloud-connector-sink"
                ? "destination"
                : "transform",
          label: activity.name,
          description: "",
          icon: activity.config?.ui_metadata?.icon || "Database",
          x: activity.config?.ui_metadata?.x || 100,
          y: activity.config?.ui_metadata?.y || 100,
          connectionConfig: (activity.config || {}) as any,
          transformConfig: (activity.config || {}) as any,
        })
      )

      const stepToActivity = new Map<string, string>()
      selectedWorkflow.definition.steps.forEach((s) => {
        stepToActivity.set(s.id, s.activityId)
      })

      const canvasConnections: CanvasConnection[] = []
      selectedWorkflow.definition.steps.forEach((step) => {
        if (step.dependsOn && step.dependsOn.length > 0) {
          step.dependsOn.forEach((depId) => {
            const sourceActivityId = stepToActivity.get(depId)
            // Fallback to depId if not found (legacy support where depId might be activityId)
            const fromId = sourceActivityId || depId
            
            if (fromId) {
              canvasConnections.push({
                from: fromId,
                to: step.activityId,
              })
            }
          })
        }
      })

      dispatch(
        loadWorkflow({
          workflowId: selectedWorkflow.id,
          workflowName: selectedWorkflow.name,
          workflowDescription: selectedWorkflow.description || "",
          status: selectedWorkflow.status,
          nodes: canvasNodes,
          connections: canvasConnections,
        })
      )
      setIsLoadingWorkflow(false)
    }
  }, [selectedWorkflow, workflowIdFromQuery, dispatch])

  // Handle operation errors
  useEffect(() => {
    if (operationError) {
      toast.error("Operation failed", { description: operationError })
      dispatch(clearErrors())
    }
  }, [operationError, dispatch])

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null

  const handleSave = async () => {
    try {
      // Map to API DTO
      const definition = {
        version: "1.0",
        activities: nodes.map((n) => {
          let activityType = "extract"
          if (n.type === "source") {
            if (n.connectionConfig?.method === "mini_connector") activityType = "mini-connector-source"
            else if (n.connectionConfig?.method === "cloud_connector") activityType = "cloud-connector-source"
            else activityType = "extract"
          } else if (n.type === "destination") {
            if (n.connectionConfig?.method === "cloud_connector") activityType = "cloud-connector-sink"
            else activityType = "load"
          } else {
            activityType = "transform"
          }

          return {
            id: n.id,
            type: activityType as any,
            name: n.label,
            config: {
              ...n.connectionConfig,
              ...n.transformConfig,
              ui_metadata: { x: n.x, y: n.y, icon: n.icon },
            },
          }
        }),
        steps: nodes.map((n) => ({
          id: `step-${n.id}`,
          activityId: n.id,
          dependsOn: connections
            .filter((c) => c.to === n.id)
            .map((c) => `step-${c.from}`),
        })),
      }

      if (workflowId) {
        // Update existing
        const result = await dispatch(
          updateWorkflow({
            id: workflowId,
            data: {
              name: workflowName,
              description: workflowDescription,
              definition: definition as any,
            },
          })
        ).unwrap()
        toast.success("Workflow updated successfully")
      } else {
        // Create new
        const result = await dispatch(
          createWorkflow({
            name: workflowName,
            description: workflowDescription,
            definition: definition as any,
          })
        ).unwrap()
        // Update URL with new workflow ID
        router.replace(`/workflows?id=${result.id}`)
        toast.success("Workflow created successfully")
      }
    } catch (error: any) {
      toast.error("Failed to save workflow", {
        description: error.message || "An unexpected error occurred",
      })
    }
  }

  const handleValidate = async () => {
    try {
      const definition = {
        version: "1.0",
        activities: nodes.map((n) => {
          let activityType = "extract"
          if (n.type === "source") {
            if (n.connectionConfig?.method === "mini_connector") activityType = "mini-connector-source"
            else if (n.connectionConfig?.method === "cloud_connector") activityType = "cloud-connector-source"
            else activityType = "extract"
          } else if (n.type === "destination") {
            if (n.connectionConfig?.method === "cloud_connector") activityType = "cloud-connector-sink"
            else activityType = "load"
          } else {
            activityType = "transform"
          }

          return {
            id: n.id,
            type: activityType as any,
            name: n.label,
            config: {
              ...n.connectionConfig,
              ...n.transformConfig,
              ui_metadata: { x: n.x, y: n.y, icon: n.icon },
            },
          }
        }),
        steps: nodes.map((n) => ({
          id: `step-${n.id}`,
          activityId: n.id,
          dependsOn: connections
            .filter((c) => c.to === n.id)
            .map((c) => `step-${c.from}`),
        })),
      }

      const result = await dispatch(
        validateWorkflow(definition as any)
      ).unwrap()

      if (result.valid) {
        toast.success("Workflow is valid", {
          description: `${result.activitiesChecked} activities verified`,
        })
      } else {
        toast.error("Workflow validation failed", {
          description: `${result.errors.length} errors found`,
        })
      }
    } catch (error: any) {
      toast.error("Validation failed", {
        description: error.message || "An unexpected error occurred",
      })
    }
  }

  const handleAddNodesFromAI = useCallback(
    (aiNodes: CanvasNode[]) => {
      aiNodes.forEach(node => dispatch(addNode(node)))
      // Auto-connect them in sequence
      for (let i = 0; i < aiNodes.length - 1; i++) {
        dispatch(addConnection({ from: aiNodes[i].id, to: aiNodes[i + 1].id }))
      }
      toast.success("Workflow nodes added to canvas", {
        description: `${aiNodes.length} nodes placed and connected.`,
      })
    },
    [dispatch]
  )

  const isSaving = isCreating || isUpdating || isLoadingWorkflow

  const handleRun = async () => {
    if (!workflowId) {
      toast.error("Save workflow before running")
      return
    }

    try {
      if (selectedWorkflow && selectedWorkflow.status !== "active") {
        await dispatch(
          updateWorkflow({
            id: workflowId,
            data: {
              isActive: true,
            },
          })
        ).unwrap()
      }

      await dispatch(
        triggerWorkflow({
          id: workflowId,
          data: { immediate: true },
        })
      ).unwrap()

      toast.success("Workflow execution started", {
        description: "Check the Execution Monitor for progress.",
      })
    } catch (error: any) {
      toast.error("Failed to start workflow", {
        description: error.message || "An unexpected error occurred",
      })
    }
  }

  // Build palette nodes from backend data only - no mock data
  const enrichedPaletteNodes = useMemo(() => {
    // Source nodes from installed aggregators, mini connectors, and SDKs
    const sourceNodes: PaletteNode[] = [
      // Mini Connectors as source nodes
      ...miniConnectors.map(mc => ({
        id: `mc-source-${mc.id}`,
        type: "source" as NodeType,
        label: mc.name,
        description: `${mc.status} - ${mc.ipAddress || 'No IP'}`,
        icon: "Server",
        connectionMethod: "mini_connector" as ConnectionMethod,
        connectorId: mc.id
      })),
      // Installed aggregators as source nodes
      ...installedAggregators.map(agg => ({
        id: `agg-source-${agg.id}`,
        type: "source" as NodeType,
        label: agg.name,
        description: agg.description || agg.category,
        icon: "Store",
        connectionMethod: "aggregator" as ConnectionMethod,
        aggregatorId: agg.id
      })),
      // Generated SDKs as source nodes
      ...(sdks || []).map((sdk: any) => ({
        id: `sdk-source-${sdk.id}`,
        type: "source" as NodeType,
        label: sdk.className || sdk.name || "Generated SDK",
        description: "AI-generated TypeScript SDK",
        icon: "Code",
        connectionMethod: "generated_sdk" as ConnectionMethod,
        sdkId: sdk.id
      }))
    ]

    // Transform nodes from sub-workflows and SDKs
    const transformNodes: PaletteNode[] = [
      // AI Transform node
      {
        id: "node-ai-transform",
        type: "transform" as NodeType,
        label: "AI Transform",
        description: "AI-assisted data mapping & conversion",
        icon: "Sparkles"
      },
      // Field Mapper
      {
        id: "node-map",
        type: "transform" as NodeType,
        label: "Field Mapper",
        description: "Map fields between schemas",
        icon: "ArrowLeftRight"
      },
      // Filter
      {
        id: "node-filter",
        type: "transform" as NodeType,
        label: "Filter",
        description: "Filter records by condition",
        icon: "Filter"
      },
      // Aggregate
      {
        id: "node-aggregate",
        type: "transform" as NodeType,
        label: "Aggregate",
        description: "Group and aggregate data",
        icon: "Layers"
      },
      // Custom Script
      {
        id: "node-script",
        type: "transform" as NodeType,
        label: "Custom Script",
        description: "Run custom TypeScript logic",
        icon: "Code"
      },
      // Sub-workflows
      ...allWorkflows
        .filter(wf => wf.id !== workflowId)
        .map(wf => ({
          id: `wf-${wf.id}`,
          type: "transform" as NodeType,
          label: wf.name,
          description: wf.description || "Sub-workflow",
          icon: "Workflow" as any,
          workflowId: wf.id
        })),
      // Generated SDKs as transform nodes
      ...(sdks || []).map((sdk: any) => ({
        id: `sdk-transform-${sdk.id}`,
        type: "transform" as NodeType,
        label: sdk.className || sdk.name || "Generated SDK",
        description: "AI-generated TypeScript SDK",
        icon: "Code",
        connectionMethod: "generated_sdk" as ConnectionMethod,
        sdkId: sdk.id
      }))
    ]

    // Destination nodes from installed aggregators, mini connectors, and SDKs
    const destinationNodes: PaletteNode[] = [
      // Mini Connectors as destination nodes
      ...miniConnectors.map(mc => ({
        id: `mc-dest-${mc.id}`,
        type: "destination" as NodeType,
        label: mc.name,
        description: `${mc.status} - ${mc.ipAddress || 'No IP'}`,
        icon: "Server",
        connectionMethod: "mini_connector" as ConnectionMethod,
        connectorId: mc.id
      })),
      // Installed aggregators as destination nodes
      ...installedAggregators.map(agg => ({
        id: `agg-dest-${agg.id}`,
        type: "destination" as NodeType,
        label: agg.name,
        description: agg.description || agg.category,
        icon: "Store",
        connectionMethod: "aggregator" as ConnectionMethod,
        aggregatorId: agg.id
      })),
      // Generated SDKs as destination nodes
      ...(sdks || []).map((sdk: any) => ({
        id: `sdk-dest-${sdk.id}`,
        type: "destination" as NodeType,
        label: sdk.className || sdk.name || "Generated SDK",
        description: "AI-generated TypeScript SDK",
        icon: "Code",
        connectionMethod: "generated_sdk" as ConnectionMethod,
        sdkId: sdk.id
      }))
    ]

    // Marketplace category - installed aggregators
    const marketplaceNodes: PaletteNode[] = installedAggregators.map(agg => ({
      id: `agg-${agg.id}`,
      type: "source" as NodeType,
      label: agg.name,
      description: agg.category,
      icon: "Store",
      connectionMethod: "aggregator" as ConnectionMethod,
      aggregatorId: agg.id
    }))

    // SDKs category
    const sdkNodes: PaletteNode[] = (sdks || []).map((sdk: any) => ({
      id: `sdk-${sdk.id}`,
      type: "source" as NodeType,
      label: sdk.className || sdk.name || "Generated SDK",
      description: "AI-generated TypeScript SDK",
      icon: "Code",
      connectionMethod: "generated_sdk" as ConnectionMethod,
      sdkId: sdk.id
    }))

    // Workflows category - sub-workflows
    const workflowNodes: PaletteNode[] = allWorkflows
      .filter(wf => wf.id !== workflowId)
      .map(wf => ({
        id: `wf-${wf.id}`,
        type: "transform" as NodeType,
        label: wf.name,
        description: "Sub-workflow",
        icon: "Workflow",
        workflowId: wf.id
      }))

    return {
      source: sourceNodes,
      transform: transformNodes,
      destination: destinationNodes,
      marketplace: marketplaceNodes,
      sdks: sdkNodes,
      workflows: workflowNodes
    }
  }, [installedAggregators, miniConnectors, allWorkflows, sdks, workflowId])

  return (
    <div className="-m-6 lg:-m-8 flex h-[calc(100vh-4rem)] flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2.5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/workflows/list")}
            className="inline-flex items-center gap-1 rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors"
            title="Back to workflows"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-sm font-semibold text-foreground">
            {workflowId ? "Editing" : "Creating"} Workflow
          </h1>
          <input
            className="rounded border-none bg-transparent px-2 py-0.5 text-[10px] font-medium text-muted-foreground outline-none hover:bg-muted focus:bg-muted"
            value={workflowName}
            onChange={(e) => dispatch(setWorkflowName(e.target.value))}
            placeholder="Untitled Workflow"
          />
          {/* <span className="hidden sm:inline-flex text-[10px] text-muted-foreground">
            Source {"->"} Transform {"->"} Destination
          </span> */}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
            onClick={() => dispatch(undo())}
          >
            <Undo className="h-3 w-3" />
            <span className="hidden sm:inline">Undo</span>
          </button>
          <button
            className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${aiPanelOpen
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-foreground hover:bg-accent"
              }`}
            onClick={() => setAiPanelOpen(!aiPanelOpen)}
          >
            <Sparkles className="h-3 w-3" />
            <span className="hidden sm:inline">AI Assist</span>
          </button>
          <button
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50"
            onClick={handleValidate}
            disabled={isValidating || nodes.length === 0}
          >
            {isValidating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
            <span className="hidden sm:inline">Validate</span>
          </button>
          <button
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50"
            onClick={handleSave}
            disabled={isSaving || nodes.length === 0}
          >
            {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
            <span className="hidden sm:inline">Save</span>
          </button>
          <button
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50"
            onClick={handleRun}
            disabled={isExecuting || nodes.length === 0}
          >
            {isExecuting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
            <span className="hidden sm:inline">Run</span>
          </button>
        </div>
      </div>

      {/* 3/4-Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        <NodePalette nodes={enrichedPaletteNodes} />
        <WorkflowCanvas
          nodes={nodes}
          connections={connections}
          onNodesChange={(newNodes) => dispatch(setNodes(newNodes))}
          onConnectionsChange={(newConns) => dispatch(setConnections(newConns))}
          onNodeSelect={(node) => dispatch(selectNode(node?.id || null))}
        />
        {!aiPanelOpen && <PropertiesPanel node={selectedNode} />}
        {aiPanelOpen && (
          <AIChatPanel
            open={aiPanelOpen}
            onClose={() => setAiPanelOpen(false)}
            onAddNodes={handleAddNodesFromAI}
          />
        )}
      </div>
    </div>
  )
}
