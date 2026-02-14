import { Configuration } from '@/src/generated/api/configuration'
import { AuthApi, AggregatorsApi, TenantAggregatorsApi, SchemaDiscoveryApi, WorkflowsApi, ExecutionsApi, ConnectorsApi, TenantsApi, UsersApi } from '@/src/generated/api/api'
import type {
  SignInDto,
  SignUpDto,
  RefreshTokenDto,
  PreviewTableDto,
  CreateWorkflowDto,
  UpdateWorkflowDto,
  WorkflowDefinitionDto,
  CancelExecutionDto,
  PauseExecutionDto,
  ResumeExecutionDto,

  ExecuteWorkflowDto,
  CreateConnectorDto,
  UpdateConnectorDto,
  HeartbeatDto,
  UpdateTenantDto,
  UpdateUserDto
} from '@/src/generated/api/api'

// Cookie utilities for auth tokens
export const authCookies = {
  getAccessToken(): string | null {
    return this.getCookie('accessToken')
  },

  getRefreshToken(): string | null {
    return this.getCookie('refreshToken')
  },

  getTenantId(): string | null {
    return this.getCookie('tenantId')
  },

  setTokens(accessToken: string, refreshToken: string, tenantId: string) {
    // 7 days for access token, 30 days for refresh
    this.setCookie('accessToken', accessToken, 7)
    this.setCookie('refreshToken', refreshToken, 30)
    this.setCookie('tenantId', tenantId, 7)
  },

  clearTokens() {
    this.deleteCookie('accessToken')
    this.deleteCookie('refreshToken')
    this.deleteCookie('tenantId')
  },

  // Helper methods
  getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null
    return null
  },

  setCookie(name: string, value: string, days: number) {
    if (typeof document === 'undefined') return
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Strict`
  },

  deleteCookie(name: string) {
    if (typeof document === 'undefined') return
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
  },
}



// API Client wrapper that handles authentication
export class ApiClient {
  private authApi!: AuthApi
  private aggregatorsApi!: AggregatorsApi
  private tenantAggregatorsApi!: TenantAggregatorsApi
  private schemaDiscoveryApi!: SchemaDiscoveryApi
  private workflowsApi!: WorkflowsApi
  private executionsApi!: ExecutionsApi
  private connectorsApi!: ConnectorsApi
  private tenantsApi!: TenantsApi
  private usersApi!: UsersApi
  private configuration: Configuration

  constructor() {
    this.configuration = this.getConfig()
    this.initializeApis()
  }

  private getApiUrl(): string {
    const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    return raw.replace(/\/+$/, '')
  }

  private getConfig(): Configuration {
    const apiUrl = this.getApiUrl()
    const jwt = authCookies.getAccessToken()
    const tenantId = authCookies.getTenantId()

    const config = new Configuration({
      basePath: apiUrl,
      accessToken: jwt || undefined,
    })

    if (jwt) {
      config.baseOptions = {
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
          ...(tenantId && { 'X-Tenant-ID': tenantId }),
        },
      }
    }

    return config
  }

  private initializeApis() {
    this.authApi = new AuthApi(this.configuration)
    this.aggregatorsApi = new AggregatorsApi(this.configuration)
    this.tenantAggregatorsApi = new TenantAggregatorsApi(this.configuration)
    this.schemaDiscoveryApi = new SchemaDiscoveryApi(this.configuration)
    this.workflowsApi = new WorkflowsApi(this.configuration)
    this.executionsApi = new ExecutionsApi(this.configuration)
    this.connectorsApi = new ConnectorsApi(this.configuration)
    this.tenantsApi = new TenantsApi(this.configuration)
    this.usersApi = new UsersApi(this.configuration)
  }

  // Call this after login/logout to refresh API instances with new token
  refreshConfiguration() {
    this.configuration = this.getConfig()
    this.initializeApis()
  }

  // Get API instances
  get auth() {
    return this.authApi
  }

  get aggregators() {
    return this.aggregatorsApi
  }

  get tenantAggregators() {
    return this.tenantAggregatorsApi
  }

  get schemaDiscovery() {
    return this.schemaDiscoveryApi
  }

  get workflows() {
    return this.workflowsApi
  }

  get executions() {
    return this.executionsApi
  }

  get connectors() {
    return this.connectorsApi
  }

  get tenants() {
    return this.tenantsApi
  }

  get users() {
    return this.usersApi
  }

  // Workflow helpers
  async listWorkflows(status: string = 'all') {
    const response = await this.workflows.workflowsControllerFindAll(status)
    return (response.data as any)?.data || response.data
  }

  async getWorkflow(id: string) {
    const response = await this.workflows.workflowsControllerFindOne(id)
    return (response.data as any)?.data || response.data
  }

  async createWorkflow(data: CreateWorkflowDto) {
    const response = await this.workflows.workflowsControllerCreate(data)
    return (response.data as any)?.data || response.data
  }

  async updateWorkflow(id: string, data: UpdateWorkflowDto) {
    const response = await this.workflows.workflowsControllerUpdate(id, data)
    return (response.data as any)?.data || response.data
  }

  async deleteWorkflow(id: string) {
    await this.workflows.workflowsControllerDelete(id)
  }

  async validateWorkflow(data: WorkflowDefinitionDto) {
    const response = await this.workflows.workflowsControllerValidate(data)
    return (response.data as any)?.data || response.data
  }

  // Execution helpers
  async listExecutions(workflowId?: string, status?: any, startDate?: string, endDate?: string, limit?: number, offset?: number) {
    const response = await this.executions.executionsControllerFindAll(workflowId, status, startDate, endDate, limit, offset)
    return (response.data as any)?.data || response.data
  }

  async getExecution(id: string) {
    const response = await this.executions.executionsControllerFindOne(id)
    return (response.data as any)?.data || response.data
  }

  async cancelExecution(id: string, data: CancelExecutionDto) {
    const response = await this.executions.executionsControllerCancel(id, data)
    return (response.data as any)?.data || response.data
  }

  async pauseExecution(id: string, data: PauseExecutionDto) {
    const response = await this.executions.executionsControllerPause(id, data)
    return (response.data as any)?.data || response.data
  }

  async resumeExecution(id: string, data: ResumeExecutionDto) {
    const response = await this.executions.executionsControllerResume(id, data)
    return (response.data as any)?.data || response.data
  }

  async triggerWorkflow(id: string, data: ExecuteWorkflowDto) {
    const response = await this.executions.executionsControllerTriggerWorkflow(id, data)
    return (response.data as any)?.data || response.data
  }

  // Auth helpers
  async signIn(data: SignInDto) {
    const response = await this.auth.authControllerSignIn(data)
    const responseData = response.data as any
    const { user, tokens } = responseData.data || responseData

    // Store in cookies
    authCookies.setTokens(tokens.accessToken, tokens.refreshToken, user.tenantId)

    // Refresh config with new token
    this.refreshConfiguration()

    return { user, tokens }
  }

  async signUp(data: SignUpDto) {
    const response = await this.auth.authControllerSignUp(data)
    const responseData = response.data as any
    const { user, tokens } = responseData.data || responseData

    // Store in cookies
    authCookies.setTokens(tokens.accessToken, tokens.refreshToken, user.tenantId)

    // Refresh config with new token
    this.refreshConfiguration()

    return { user, tokens }
  }

  async signOut() {
    try {
      await this.auth.authControllerSignOut()
    } finally {
      authCookies.clearTokens()
      this.refreshConfiguration()
    }
  }

  async refreshToken() {
    const refreshToken = authCookies.getRefreshToken()
    if (!refreshToken) throw new Error('No refresh token')

    const response = await this.auth.authControllerRefresh({ refreshToken })
    const responseData = response.data as any
    const { accessToken } = responseData.data || responseData

    const tenantId = authCookies.getTenantId() || ''
    const currentRefresh = authCookies.getRefreshToken() || ''

    // Update access token cookie only
    authCookies.setTokens(accessToken, currentRefresh, tenantId)

    // Refresh config
    this.refreshConfiguration()

    return { accessToken }
  }

  // Aggregator helpers
  async listMarketplaceAggregators(params: { page?: string; limit?: string; category?: string; search?: string }) {
    const response = await this.aggregators.aggregatorsControllerFindAll(
      params.page || '1',
      params.limit || '50',
      params.category || '',
      params.search || ''
    )
    return (response.data as any)?.data || response.data
  }

  async getAggregator(id: string) {
    const response = await this.aggregators.aggregatorsControllerFindOne(id)
    return (response.data as any)?.data || response.data
  }

  async listInstalledAggregators() {
    const response = await this.tenantAggregators.tenantAggregatorsControllerFindAll('')
    return (response.data as any)?.data || response.data
  }

  async getInstalledAggregator(id: string) {
    const response = await this.tenantAggregators.tenantAggregatorsControllerFindOne(id)
    return (response.data as any)?.data || response.data
  }

  async installAggregator(
    marketplaceId: string,
    name: string,
    config?: Record<string, any>,
    credentials?: Record<string, string>,
    testConnection?: boolean
  ) {
    const response = await this.tenantAggregators.tenantAggregatorsControllerInstall({
      marketplaceId,
      name,
      config,
      credentials,
      testConnection
    })
    return (response.data as any)?.data || response.data
  }

  async configureAggregator(id: string, name: string, credentials: Record<string, string>) {
    // TODO: Update to use tenantAggregatorsControllerUpdate once DTO is confirmed
    /*
    const response = await this.tenantAggregators.tenantAggregatorsControllerSaveCredentials(id, {
      name,
      credentials
    })
    return (response.data as any)?.data || response.data
    */
    return null
  }

  async testAggregatorConnection(id: string) {
    const response = await this.tenantAggregators.tenantAggregatorsControllerTestConnection(id)
    return (response.data as any)?.data || response.data
  }

  async deleteAggregator(id: string) {
    await this.tenantAggregators.tenantAggregatorsControllerDelete(id)
  }

  // Schema Discovery helpers
  async triggerSchemaDiscovery(id: string) {
    const response = await this.schemaDiscovery.schemaDiscoveryControllerDiscover(id)
    return (response.data as any)?.data || response.data
  }

  async getSchema(id: string) {
    const response = await this.schemaDiscovery.schemaDiscoveryControllerGetSchema(id)
    return (response.data as any)?.data || response.data
  }

  async getTables(id: string) {
    const response = await this.schemaDiscovery.schemaDiscoveryControllerGetTables(id)
    return (response.data as any)?.data || response.data
  }

  async getTableDetails(id: string, tableName: string) {
    const response = await this.schemaDiscovery.schemaDiscoveryControllerGetTable(id, tableName)
    return (response.data as any)?.data || response.data
  }

  async previewTable(id: string, tableName: string, limit: number = 20) {
    const response = await this.schemaDiscovery.schemaDiscoveryControllerPreviewTable(id, tableName, { limit })
    const responseData = (response.data as any)?.data || response.data
    return responseData
  }

  async getRelationships(id: string) {
    const response = await this.schemaDiscovery.schemaDiscoveryControllerGetRelationships(id)
    return (response.data as any)?.data || response.data
  }

  // Connector helpers
  async createConnector(data: CreateConnectorDto) {
    const response = await this.connectors.connectorsControllerCreate(data)
    return (response.data as any)?.data || response.data
  }

  async getConnectors(status?: string, type?: string, search?: string) {
    const response = await this.connectors.connectorsControllerFindAll(status as any, type as any, search)
    return (response.data as any)?.data || response.data
  }

  async getConnector(id: string) {
    const response = await this.connectors.connectorsControllerFindOne(id)
    return (response.data as any)?.data || response.data
  }

  async updateConnector(id: string, data: UpdateConnectorDto) {
    const response = await this.connectors.connectorsControllerUpdate(id, data)
    return (response.data as any)?.data || response.data
  }

  async deleteConnector(id: string) {
    await this.connectors.connectorsControllerRemove(id)
  }

  async connectorHeartbeat(id: string, heartbeat: HeartbeatDto) {
    const response = await this.connectors.connectorsControllerHeartbeat(id, heartbeat)
    return (response.data as any)?.data || response.data
  }

  // Tenant helpers
  async getCurrentTenant() {
    const response = await this.tenants.tenantsControllerGetCurrent()
    return (response.data as any)?.data || response.data
  }

  async updateCurrentTenant(data: UpdateTenantDto) {
    const response = await this.tenants.tenantsControllerUpdateCurrent(data)
    return (response.data as any)?.data || response.data
  }

  // User helpers
  async getUsers() {
    const response = await this.users.usersControllerFindAll()
    return (response.data as any)?.data || response.data
  }

  async getUser(id: string) {
    const response = await this.users.usersControllerFindOne(id)
    return (response.data as any)?.data || response.data
  }

  async updateUser(id: string, data: UpdateUserDto) {
    const response = await this.users.usersControllerUpdate(id, data)
    return (response.data as any)?.data || response.data
  }

  async deleteUser(id: string) {
    await this.users.usersControllerRemove(id)
  }

  isAuthenticated(): boolean {
    return !!authCookies.getAccessToken()
  }

  // Get current token info
  getTokenInfo() {
    return {
      accessToken: authCookies.getAccessToken(),
      refreshToken: authCookies.getRefreshToken(),
      tenantId: authCookies.getTenantId(),
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Re-export types
export type { SignInDto, SignUpDto, RefreshTokenDto }
