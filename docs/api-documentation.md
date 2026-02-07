# 360Solve Connector API Documentation

Complete API reference for frontend integration.

## Base URL
```
Production: https://api.360solve.com/api/v1
Development: http://localhost:3001/api/v1
```

## Authentication

All protected endpoints require:
- Header: `Authorization: Bearer {accessToken}`
- Header: `X-Tenant-ID: {tenantId}`

---

## Authentication Endpoints

### POST /auth/sign-up
Create a new account.

**Request:**
```json
{
  "email": "user@company.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "companyName": "Acme Corp",
  "tier": "standard"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_abc123",
      "email": "user@company.com",
      "name": "John Doe",
      "tenantId": "ten_xyz789",
      "role": "admin"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 3600
    }
  }
}
```

**Errors:**
- `400` EMAIL_EXISTS - Account already exists
- `400` INVALID_PASSWORD - Password doesn't meet requirements

### POST /auth/sign-in
Sign in to existing account.

**Request:**
```json
{
  "email": "user@company.com",
  "password": "SecurePass123!",
  "rememberMe": false
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_abc123",
      "email": "user@company.com",
      "name": "John Doe",
      "tenantId": "ten_xyz789",
      "role": "admin"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 3600
    }
  }
}
```

**Errors:**
- `401` INVALID_CREDENTIALS - Email or password incorrect
- `403` ACCOUNT_SUSPENDED - Account is suspended

### POST /auth/refresh
Refresh access token.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  }
}
```

### POST /auth/sign-out
Sign out (revokes tokens).

**Headers:** `Authorization: Bearer {accessToken}`

**Response:** `204 No Content`

### POST /auth/forgot-password
Request password reset.

**Request:**
```json
{
  "email": "user@company.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Reset email sent"
}
```

---

## Workflow Endpoints

### GET /workflows
List all workflows for tenant.

**Query Parameters:**
- `page` (optional): Page number, default 1
- `limit` (optional): Items per page, default 20
- `status` (optional): Filter by status (active, inactive, draft)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "wf_001",
      "name": "SAP Orders → Salesforce",
      "description": "Sync orders every 15 minutes",
      "status": "active",
      "lastRun": "2026-02-07T08:30:00Z",
      "nextRun": "2026-02-07T08:45:00Z",
      "successRate": 98.7,
      "totalRuns": 1456,
      "createdAt": "2025-01-15T00:00:00Z",
      "updatedAt": "2025-02-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "total": 12,
    "perPage": 20
  }
}
```

### POST /workflows
Create a new workflow.

**Request:**
```json
{
  "name": "Tally to BigQuery",
  "description": "Daily invoice sync",
  "definition": {
    "nodes": [
      {
        "id": "source-1",
        "type": "source",
        "label": "Tally ERP",
        "connectionConfig": {
          "method": "aggregator",
          "aggregatorId": "agg-tally"
        }
      },
      {
        "id": "transform-1",
        "type": "transform",
        "label": "Field Mapper",
        "transformConfig": {
          "fieldMappings": [
            { "from": "voucher_no", "to": "invoice_id" },
            { "from": "amount", "to": "total_amount" }
          ]
        }
      },
      {
        "id": "dest-1",
        "type": "destination",
        "label": "BigQuery",
        "connectionConfig": {
          "method": "aggregator",
          "aggregatorId": "agg-bigquery"
        }
      }
    ],
    "connections": [
      { "from": "source-1", "to": "transform-1" },
      { "from": "transform-1", "to": "dest-1" }
    ],
    "schedule": {
      "type": "cron",
      "expression": "0 2 * * *"
    }
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "wf_new123",
    "version": 1,
    "hash": "sha256:abc123...",
    "status": "draft",
    "createdAt": "2026-02-07T10:00:00Z"
  }
}
```

### GET /workflows/{id}
Get workflow details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "wf_001",
    "name": "SAP Orders → Salesforce",
    "description": "Sync orders every 15 minutes",
    "status": "active",
    "definition": { /* full workflow definition */ },
    "version": 3,
    "hash": "sha256:def456...",
    "lastRun": "2026-02-07T08:30:00Z",
    "nextRun": "2026-02-07T08:45:00Z",
    "successRate": 98.7,
    "totalRuns": 1456,
    "createdAt": "2025-01-15T00:00:00Z",
    "updatedAt": "2025-02-01T00:00:00Z"
  }
}
```

### PUT /workflows/{id}
Update workflow.

**Request:** Same as POST, but includes version check

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "wf_001",
    "version": 4,
    "hash": "sha256:ghi789...",
    "status": "draft",
    "updatedAt": "2026-02-07T11:00:00Z"
  }
}
```

**Error:** `409` VERSION_CONFLICT - Workflow was modified by another user

### DELETE /workflows/{id}
Delete workflow.

**Response:** `204 No Content`

### POST /workflows/{id}/activate
Activate workflow.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "wf_001",
    "status": "active",
    "activatedAt": "2026-02-07T12:00:00Z"
  }
}
```

### POST /workflows/{id}/deactivate
Deactivate workflow.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "wf_001",
    "status": "inactive",
    "deactivatedAt": "2026-02-07T12:00:00Z"
  }
}
```

### POST /workflows/{id}/execute
Trigger manual execution.

**Response (202):**
```json
{
  "success": true,
  "data": {
    "executionId": "exec_abc123",
    "status": "pending",
    "queuedAt": "2026-02-07T12:00:00Z"
  }
}
```

---

## Execution Endpoints

### GET /executions
List executions.

**Query Parameters:**
- `workflowId` (optional): Filter by workflow
- `status` (optional): success, failed, running, pending
- `page`, `limit` (optional): Pagination

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "exec-001",
      "workflowId": "wf-001",
      "workflowName": "SAP Orders → Salesforce",
      "status": "success",
      "startedAt": "2026-02-07T08:30:00Z",
      "completedAt": "2026-02-07T08:30:03Z",
      "duration": 3200,
      "recordsProcessed": 156,
      "recordsFailed": 0,
      "triggeredBy": "schedule"
    }
  ],
  "meta": {
    "page": 1,
    "total": 47
  }
}
```

### GET /executions/{id}
Get execution details with logs.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "exec-001",
    "workflowId": "wf-001",
    "workflowName": "SAP Orders → Salesforce",
    "status": "success",
    "startedAt": "2026-02-07T08:30:00Z",
    "completedAt": "2026-02-07T08:30:03Z",
    "duration": 3200,
    "recordsProcessed": 156,
    "recordsFailed": 0,
    "triggeredBy": "schedule",
    "logs": [
      {
        "id": "log-1",
        "timestamp": "2026-02-07T08:30:00Z",
        "level": "info",
        "message": "Workflow execution started"
      },
      {
        "id": "log-2",
        "timestamp": "2026-02-07T08:30:01Z",
        "level": "info",
        "message": "Connected to source database"
      }
    ]
  }
}
```

### POST /executions/{id}/cancel
Cancel running execution.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "exec-001",
    "status": "cancelled",
    "cancelledAt": "2026-02-07T08:31:00Z"
  }
}
```

---

## Aggregator Endpoints

### GET /aggregators
List available aggregators.

**Query Parameters:**
- `category` (optional): ERP, CRM, Database, Cloud, etc.
- `installed` (optional): true/false

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "agg-sap",
      "name": "SAP Business One",
      "description": "Full bidirectional sync with SAP B1",
      "category": "ERP",
      "logoUrl": "/logos/sap.svg",
      "version": "2.1.0",
      "installs": 1240,
      "rating": 4.8,
      "isInstalled": true,
      "author": "360Solve",
      "tags": ["erp", "sap", "orders"],
      "capabilities": ["read", "write", "bulk"]
    }
  ]
}
```

### GET /aggregators/{id}
Get aggregator details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "agg-sap",
    "name": "SAP Business One",
    "description": "Full bidirectional sync",
    "category": "ERP",
    "version": "2.1.0",
    "isInstalled": true,
    "config": {
      "supportsCredentials": true,
      "supportsCustomApi": true,
      "defaultPort": 3306,
      "supportedAuth": ["basic", "oauth"]
    },
    "schema": {
      "tables": ["orders", "customers", "inventory"],
      "detectedAt": "2026-02-07T10:00:00Z"
    }
  }
}
```

### POST /aggregators/{id}/install
Install aggregator.

**Request (Credentials Mode):**
```json
{
  "config": {
    "method": "credentials",
    "host": "localhost",
    "port": 3306,
    "username": "readonly_user",
    "password": "encrypted:...",
    "database": "sap_db"
  }
}
```

**Request (Custom API Mode):**
```json
{
  "config": {
    "method": "custom_api",
    "endpoint": "https://api.company.com/v1",
    "authType": "bearer",
    "authToken": "encrypted:...",
    "openApiSpecUrl": "https://api.company.com/spec.json"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "inst_abc123",
    "aggregatorId": "agg-sap",
    "status": "active",
    "installedAt": "2026-02-07T12:00:00Z",
    "schemaDiscoveryScheduled": true
  }
}
```

### POST /aggregators/{id}/test
Test connection.

**Request:** Same config as install

**Response (200):**
```json
{
  "success": true,
  "data": {
    "connected": true,
    "latency": 45,
    "version": "SAP B1 10.0",
    "tablesFound": 15
  }
}
```

---

## Mini Connector Endpoints

### GET /connectors
List mini connectors.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "mc-001",
      "name": "Mumbai Office - Primary",
      "status": "online",
      "ipAddress": "192.168.1.100",
      "version": "1.2.4",
      "lastSeen": "2026-02-07T09:59:30Z",
      "os": "linux",
      "cpuUsage": 23,
      "memoryUsage": 45,
      "activeWorkflows": 5,
      "apiKeyPrefix": "vmc_abc123"
    }
  ]
}
```

### POST /connectors
Register new connector.

**Request:**
```json
{
  "name": "Delhi Warehouse",
  "os": "windows"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "mc-new789",
    "apiKey": "vmc_ten_xyz_abc123def456",
    "downloadUrl": "/downloads/mini-connector-windows.exe",
    "setupInstructions": "Run the installer and enter the API key when prompted"
  }
}
```

### GET /connectors/{id}/logs
Get connector logs.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "connectorId": "mc-001",
    "logs": [
      {
        "timestamp": "2026-02-07T10:00:00Z",
        "level": "info",
        "message": "Connected to cloud"
      }
    ]
  }
}
```

---

## AI Assistant Endpoints

### POST /ai/generate-workflow
Generate workflow from natural language.

**Request:**
```json
{
  "prompt": "Transfer all orders from my PostgreSQL to Snowflake daily",
  "context": {
    "availableAggregators": ["agg-postgres", "agg-snowflake"],
    "tenantSchema": {
      "tables": ["orders", "customers", "products"]
    }
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "suggestedWorkflow": {
      "name": "PostgreSQL Orders to Snowflake",
      "description": "Daily sync of orders table",
      "nodes": [
        {
          "id": "ai-source-1",
          "type": "source",
          "label": "PostgreSQL",
          "reasoning": "Detected 'orders' in your schema"
        },
        {
          "id": "ai-transform-1",
          "type": "transform",
          "label": "Standardize Dates",
          "reasoning": "Converting timestamp formats"
        },
        {
          "id": "ai-dest-1",
          "type": "destination",
          "label": "Snowflake",
          "reasoning": "Target specified in request"
        }
      ],
      "connections": [
        { "from": "ai-source-1", "to": "ai-transform-1" },
        { "from": "ai-transform-1", "to": "ai-dest-1" }
      ],
      "confidence": 0.92
    },
    "explanation": "I identified your PostgreSQL database as the source and created a daily sync workflow to Snowflake."
  }
}
```

### POST /ai/chat
Chat with AI assistant.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "How do I connect SAP to Salesforce?" }
  ],
  "context": {
    "currentPage": "workflows",
    "selectedNode": null
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "To connect SAP to Salesforce, you'll need to...",
    "actions": [
      {
        "type": "suggest_workflow",
        "payload": { /* workflow suggestion */ }
      }
    ]
  }
}
```

---

## Dashboard Endpoints

### GET /dashboard/stats
Get dashboard statistics.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "activeWorkflows": 12,
    "successRate": 98.7,
    "failedLast24h": 3,
    "totalExecutions": 1247,
    "recordsProcessed": 2340000,
    "avgDuration": 4200,
    "trends": {
      "activeWorkflows": { "direction": "up", "value": "12%" },
      "successRate": { "direction": "up", "value": "0.3%" },
      "failedLast24h": { "direction": "down", "value": "2" },
      "avgDuration": { "direction": "up", "value": "8%" }
    }
  }
}
```

### GET /dashboard/activity
Get recent activity feed.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "act-001",
      "workflowName": "SAP Orders → Salesforce",
      "status": "success",
      "startedAt": "2026-02-07T08:30:00Z",
      "duration": 3200,
      "recordsProcessed": 156,
      "source": "SAP B1",
      "destination": "Salesforce"
    }
  ]
}
```

---

## Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // Optional additional context
  }
}
```

### Common Error Codes

- `400` BAD_REQUEST - Invalid request data
- `401` UNAUTHORIZED - Missing or invalid token
- `403` FORBIDDEN - Insufficient permissions
- `404` NOT_FOUND - Resource doesn't exist
- `409` CONFLICT - Resource conflict (e.g., version mismatch)
- `422` VALIDATION_ERROR - Validation failed
- `429` RATE_LIMITED - Too many requests
- `500` INTERNAL_ERROR - Server error

---

## WebSocket Events

Real-time updates via WebSocket connection:

**Connection:** `wss://api.360solve.com/ws`

**Authentication:** Send token in connection query: `?token={accessToken}`

### Events

**execution_started**
```json
{
  "type": "execution_started",
  "data": {
    "executionId": "exec-001",
    "workflowId": "wf-001",
    "workflowName": "SAP Orders → Salesforce"
  }
}
```

**execution_completed**
```json
{
  "type": "execution_completed",
  "data": {
    "executionId": "exec-001",
    "status": "success",
    "recordsProcessed": 156
  }
}
```

**connector_status_changed**
```json
{
  "type": "connector_status_changed",
  "data": {
    "connectorId": "mc-001",
    "status": "offline",
    "lastSeen": "2026-02-07T10:00:00Z"
  }
}
```

---

## Rate Limiting

- 100 requests per minute for authenticated users
- 10 requests per minute for unauthenticated endpoints
- Headers returned:
  - `X-RateLimit-Limit`: Maximum requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

---

## SDK Generation

For client SDK generation, use OpenAPI spec:

```bash
# Download OpenAPI spec
curl https://api.360solve.com/api/v1/openapi.json

# Generate TypeScript client
npx openapi-generator-cli generate \
  -i openapi.json \
  -g typescript-axios \
  -o ./generated-sdk
```

---

## Changelog

**v1.0.0** - Initial API release
- Authentication endpoints
- Workflow CRUD
- Execution monitoring
- Aggregator marketplace
- AI assistant integration
