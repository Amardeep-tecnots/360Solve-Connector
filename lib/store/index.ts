import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { apiSlice } from './slices/api-slice'
import { authSlice } from './slices/auth-slice'
import { workflowSlice } from './slices/workflow-slice'
import { uiSlice } from './slices/ui-slice'
import { connectorSlice } from './slices/connector-slice'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice.reducer,
    workflow: workflowSlice.reducer,
    ui: uiSlice.reducer,
    connector: connectorSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['workflow/setNodes', 'workflow/setEdges'],
        ignoredPaths: ['workflow.nodes', 'workflow.edges'],
      },
    }).concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
