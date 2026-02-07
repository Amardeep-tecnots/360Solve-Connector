import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './index'

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// Auth hooks
export const useAuthState = () => {
  const auth = useAppSelector((state) => state.auth)
  return auth
}

export const useIsAuthenticated = () => {
  return useAppSelector((state) => state.auth.isAuthenticated)
}

export const useCurrentUser = () => {
  return useAppSelector((state) => state.auth.user)
}

// Workflow hooks
export const useWorkflowState = () => {
  return useAppSelector((state) => state.workflow)
}

export const useSelectedNode = () => {
  const { nodes, selectedNodeId } = useAppSelector((state) => state.workflow)
  return nodes.find((n) => n.id === selectedNodeId) || null
}

export const useSelectedEdge = () => {
  const { edges, selectedEdgeId } = useAppSelector((state) => state.workflow)
  return edges.find((e) => e.id === selectedEdgeId) || null
}

// UI hooks
export const useUIState = () => {
  return useAppSelector((state) => state.ui)
}

export const useSidebarState = () => {
  const { sidebarCollapsed, sidebarWidth } = useAppSelector((state) => state.ui)
  return { sidebarCollapsed, sidebarWidth }
}

export const useModal = (modalName: string) => {
  const { activeModal, modalData } = useAppSelector((state) => state.ui)
  return {
    isOpen: activeModal === modalName,
    data: modalData,
  }
}

// Connector hooks
export const useConnectors = () => {
  return useAppSelector((state) => state.connector.connectors)
}

export const useSelectedConnector = () => {
  const { connectors, selectedConnectorId } = useAppSelector((state) => state.connector)
  return connectors.find((c) => c.id === selectedConnectorId) || null
}

export const useConnectorStats = () => {
  const { totalConnectors, onlineCount, offlineCount } = useAppSelector((state) => state.connector)
  return { totalConnectors, onlineCount, offlineCount }
}
