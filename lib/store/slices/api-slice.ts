import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { Configuration } from '@/src/generated/api/configuration'
import { AuthApi, WorkflowsApi } from '@/src/generated/api/api'
import type {
  SignInDto,
  SignUpDto,
  RefreshTokenDto,
  CreateWorkflowDto,
  UpdateWorkflowDto,
  WorkflowDefinitionDto
} from '@/src/generated/api/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const getApiConfig = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
  const tenantId = typeof window !== 'undefined' ? localStorage.getItem('tenantId') : null

  return new Configuration({
    basePath: `${API_BASE_URL}/api/v1`,
    accessToken: token || undefined,
    baseOptions: {
      headers: {
        'X-Tenant-ID': tenantId || '',
      },
    },
  })
}

const getAuthApi = () => new AuthApi(getApiConfig())
const getWorkflowsApi = () => new WorkflowsApi(getApiConfig())

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Auth', 'Workflows', 'Executions', 'Connectors', 'Aggregators'],
  endpoints: (builder) => ({
    // Auth endpoints
    signIn: builder.mutation({
      queryFn: async (credentials: SignInDto) => {
        try {
          const api = getAuthApi()
          const response = await api.authControllerSignIn(credentials)
          const responseData = response.data as any
          const { user, tokens } = responseData.data || responseData

          localStorage.setItem('accessToken', tokens.accessToken)
          localStorage.setItem('refreshToken', tokens.refreshToken)
          localStorage.setItem('tenantId', user.tenantId)

          return { data: { user, tokens } }
        } catch (error: any) {
          return { error: error.response?.data?.error?.message || 'Sign in failed' }
        }
      },
      invalidatesTags: ['Auth'],
    }),

    signUp: builder.mutation({
      queryFn: async (data: SignUpDto) => {
        try {
          const api = getAuthApi()
          const response = await api.authControllerSignUp(data)
          const responseData = response.data as any
          const { user, tokens } = responseData.data || responseData

          localStorage.setItem('accessToken', tokens.accessToken)
          localStorage.setItem('refreshToken', tokens.refreshToken)
          localStorage.setItem('tenantId', user.tenantId)

          return { data: { user, tokens } }
        } catch (error: any) {
          return { error: error.response?.data?.error?.message || 'Sign up failed' }
        }
      },
      invalidatesTags: ['Auth'],
    }),

    signOut: builder.mutation({
      queryFn: async () => {
        try {
          const api = getAuthApi()
          await api.authControllerSignOut()
        } finally {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('tenantId')
        }
        return { data: null }
      },
      invalidatesTags: ['Auth'],
    }),

    refreshToken: builder.mutation({
      queryFn: async () => {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) return { error: 'No refresh token' }

        try {
          const api = getAuthApi()
          const response = await api.authControllerRefresh({ refreshToken })
          const responseData = response.data as any
          const { accessToken } = responseData.data || responseData

          localStorage.setItem('accessToken', accessToken)
          return { data: { accessToken } }
        } catch (error: any) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          return { error: 'Token refresh failed' }
        }
      },
    }),

    // Workflow endpoints
    getWorkflows: builder.query({
      queryFn: async (status: string = 'all') => {
        try {
          const api = getWorkflowsApi()
          const response = await api.workflowsControllerFindAll(status)
          return { data: response.data }
        } catch (error: any) {
          return { error: error.response?.data?.message || 'Failed to fetch workflows' }
        }
      },
      providesTags: ['Workflows'],
    }),

    getWorkflow: builder.query({
      queryFn: async (id: string) => {
        try {
          const api = getWorkflowsApi()
          const response = await api.workflowsControllerFindOne(id)
          return { data: response.data }
        } catch (error: any) {
          return { error: error.response?.data?.message || 'Failed to fetch workflow' }
        }
      },
      providesTags: (result: any, error: any, id: string) => [{ type: 'Workflows', id }],
    }),

    createWorkflow: builder.mutation({
      queryFn: async (data: CreateWorkflowDto) => {
        try {
          const api = getWorkflowsApi()
          const response = await api.workflowsControllerCreate(data)
          return { data: response.data }
        } catch (error: any) {
          return { error: error.response?.data?.message || 'Failed to create workflow' }
        }
      },
      invalidatesTags: ['Workflows'],
    }),

    updateWorkflow: builder.mutation({
      queryFn: async ({ id, data }: { id: string; data: UpdateWorkflowDto }) => {
        try {
          const api = getWorkflowsApi()
          const response = await api.workflowsControllerUpdate(id, data)
          return { data: response.data }
        } catch (error: any) {
          return { error: error.response?.data?.message || 'Failed to update workflow' }
        }
      },
      invalidatesTags: (result: any, error: any, { id }: { id: string }) => [{ type: 'Workflows', id }, 'Workflows'],
    }),

    deleteWorkflow: builder.mutation({
      queryFn: async (id: string) => {
        try {
          const api = getWorkflowsApi()
          await api.workflowsControllerDelete(id)
          return { data: null }
        } catch (error: any) {
          return { error: error.response?.data?.message || 'Failed to delete workflow' }
        }
      },
      invalidatesTags: ['Workflows'],
    }),

    validateWorkflow: builder.mutation({
      queryFn: async (data: WorkflowDefinitionDto) => {
        try {
          const api = getWorkflowsApi()
          const response = await api.workflowsControllerValidate(data)
          return { data: response.data }
        } catch (error: any) {
          return { error: error.response?.data?.message || 'Validation failed' }
        }
      },
    }),
  }),
})

export const {
  useSignInMutation,
  useSignUpMutation,
  useSignOutMutation,
  useRefreshTokenMutation,
  useGetWorkflowsQuery,
  useGetWorkflowQuery,
  useCreateWorkflowMutation,
  useUpdateWorkflowMutation,
  useDeleteWorkflowMutation,
  useValidateWorkflowMutation,
} = apiSlice
