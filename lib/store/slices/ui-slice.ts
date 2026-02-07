import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  // Sidebar
  sidebarCollapsed: boolean
  sidebarWidth: number
  
  // Modals
  activeModal: string | null
  modalData: Record<string, unknown> | null
  
  // Notifications
  toasts: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    duration?: number
  }>
  
  // Theme
  theme: 'light' | 'dark' | 'system'
  
  // Loading states
  globalLoading: boolean
  loadingMessage: string | null
  
  // Search
  searchQuery: string
  searchResults: unknown[]
  isSearching: boolean
}

const initialState: UIState = {
  sidebarCollapsed: false,
  sidebarWidth: 256,
  activeModal: null,
  modalData: null,
  toasts: [],
  theme: 'system',
  globalLoading: false,
  loadingMessage: null,
  searchQuery: '',
  searchResults: [],
  isSearching: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Sidebar
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload
    },
    setSidebarWidth: (state, action: PayloadAction<number>) => {
      state.sidebarWidth = action.payload
    },
    
    // Modals
    openModal: (state, action: PayloadAction<{ modal: string; data?: Record<string, unknown> }>) => {
      state.activeModal = action.payload.modal
      state.modalData = action.payload.data || null
    },
    closeModal: (state) => {
      state.activeModal = null
      state.modalData = null
    },
    
    // Notifications
    addToast: (state, action: PayloadAction<Omit<UIState['toasts'][0], 'id'>>) => {
      const id = Math.random().toString(36).substring(7)
      state.toasts.push({ ...action.payload, id })
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload)
    },
    clearToasts: (state) => {
      state.toasts = []
    },
    
    // Theme
    setTheme: (state, action: PayloadAction<UIState['theme']>) => {
      state.theme = action.payload
    },
    
    // Loading
    setGlobalLoading: (state, action: PayloadAction<{ loading: boolean; message?: string }>) => {
      state.globalLoading = action.payload.loading
      state.loadingMessage = action.payload.message || null
    },
    
    // Search
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setSearchResults: (state, action: PayloadAction<unknown[]>) => {
      state.searchResults = action.payload
      state.isSearching = false
    },
    setIsSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload
    },
    clearSearch: (state) => {
      state.searchQuery = ''
      state.searchResults = []
      state.isSearching = false
    },
  },
})

export const {
  toggleSidebar,
  setSidebarCollapsed,
  setSidebarWidth,
  openModal,
  closeModal,
  addToast,
  removeToast,
  clearToasts,
  setTheme,
  setGlobalLoading,
  setSearchQuery,
  setSearchResults,
  setIsSearching,
  clearSearch,
} = uiSlice.actions

export { uiSlice }
