# Aggregators API Integration Guide

## Overview
Integration between the Marketplace/Connectors UI and backend APIs for managing aggregators (pre-built connectors).

---

## API Endpoints

### 1. List Marketplace Aggregators
**For**: Browse available connectors in `/marketplace`

```typescript
// Request
GET /api/aggregators/marketplace?category=CRM&search=salesforce

// Response 200
interface ListMarketplaceResponse {
  aggregators: MarketplaceAggregator[];
}

interface MarketplaceAggregator {
  id: string;
  name: string;
  description: string;
  category: "ERP" | "CRM" | "Database" | "Cloud" | "Analytics" | "Communication";
  version: string;
  installs: number;
  rating: number;
  isInstalled: boolean;  // Already installed by this tenant?
  author: string;
  tags: string[];
  requiresMiniConnector: boolean;  // Cloud vs on-premise
  logoUrl: string;
}
```

**UI Mapping**: `marketplace/page.tsx` - Search, filter tabs, grid display

---

### 2. Install Aggregator
**For**: "Install" button click on card

```typescript
// Request
POST /api/aggregators
{
  "marketplaceId": "agg-003",
  "name": "Salesforce Production"  // User-defined instance name
}

// Response 201 - Cloud aggregator (ready immediately)
{
  "id": "inst-salesforce-001",
  "marketplaceId": "agg-003",
  "name": "Salesforce Production",
  "status": "unconfigured",  // Needs credentials
  "requiresMiniConnector": false,
  "createdAt": "2026-02-07T10:00:00Z"
}

// Response 201 - On-premise aggregator (needs mini connector)
{
  "id": "inst-sap-001",
  "marketplaceId": "agg-001",
  "name": "SAP Business One",
  "status": "waiting_for_connector",
  "requiresMiniConnector": true,
  "connectorSetupUrl": "/connectors/setup?aggregator=inst-sap-001"
}
```

**UI Mapping**: `aggregator-card.tsx` - `onInstall` handler, shows toast on success

---

### 3. List Installed Aggregators
**For**: "Installed" tab filter, connectors management page

```typescript
// Request
GET /api/aggregators

// Response 200
interface ListInstalledResponse {
  aggregators: InstalledAggregator[];
}

interface InstalledAggregator {
  id: string;                    // Instance ID (inst-xxx)
  marketplaceId: string;         // Reference to marketplace item
  name: string;                  // User-defined name
  description: string;
  category: AggregatorCategory;
  version: string;
  logoUrl: string;
  
  // Instance state
  status: "active" | "error" | "unconfigured" | "waiting_for_connector";
  lastSyncAt?: string;           // ISO 8601
  errorMessage?: string;         // If status=error
  
  // Configuration state
  configuration?: {
    hasCredentials: boolean;
    connectionMethod: "oauth" | "api_key" | "username_password" | "connection_string";
    testStatus?: "passed" | "failed";
  };
  
  // Type flags
  requiresMiniConnector: boolean;
  miniConnectorId?: string;      // Linked mini connector (if on-premise)
}
```

**UI Mapping**: Marketplace "Installed" tab filter, future connectors management view

---

### 4. Get Aggregator Configuration
**For**: Setup/configuration modal after install

```typescript
// Request
GET /api/aggregators/:id

// Response 200
interface AggregatorDetailResponse {
  id: string;
  marketplaceId: string;
  name: string;
  description: string;
  category: AggregatorCategory;
  version: string;
  
  // Configuration schema (for dynamic form generation)
  configSchema: {
    fields: ConfigField[];
    authType: "oauth" | "api_key" | "basic" | "connection_string";
    oauthUrl?: string;  // If OAuth flow needed
  };
  
  // Current configuration (if any)
  currentConfig?: {
    values: Record<string, string>;  // Masked credentials
    testStatus: "passed" | "failed" | "untested";
  };
  
  // Status
  status: string;
  lastSyncAt?: string;
  errorMessage?: string;
}

interface ConfigField {
  name: string;
  label: string;
  type: "text" | "password" | "number" | "url" | "select";
  required: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];  // For select
  helpText?: string;
}
```

---

### 5. Save Credentials / Configure
**For**: Submit configuration form

```typescript
// Request
PUT /api/aggregators/:id/credentials
{
  "name": "Salesforce Production",  // Can rename
  "credentials": {
    // Varies by authType
    // api_key:
    "apiKey": "sk-...",
    "apiSecret": "...",
    
    // basic:
    "username": "admin",
    "password": "...",
    
    // connection_string:
    "connectionString": "postgresql://..."
  }
}

// Response 200
{
  "id": "inst-salesforce-001",
  "status": "unconfigured",  // Until test passes
  "testStatus": "untested"
}
```

---

### 6. Test Connection
**For**: "Test Connection" button in config modal

```typescript
// Request
POST /api/aggregators/:id/test
// Body: Same credentials as PUT (optional - tests saved if empty)

// Response 200 - Success
{
  "success": true,
  "message": "Connection successful",
  "metadata": {
    "responseTime": 245,
    "apiVersion": "v58.0",
    "accountInfo": { ... }
  }
}

// Response 200 - Failure (HTTP 200 but success=false)
{
  "success": false,
  "message": "Authentication failed: Invalid API key",
  "errorCode": "AUTH_FAILED",
  "suggestion": "Check your API key in Salesforce Setup > Apps"
}
```

---

### 7. Delete Aggregator
**For**: Uninstall/remove connector

```typescript
// Request
DELETE /api/aggregators/:id

// Response 204 - No content (success)

// Response 409 - Has dependent workflows
{
  "error": "Cannot delete: Used by 3 workflows",
  "workflows": ["wf-001", "wf-002", "wf-003"]
}
```

---

## UI Component → API Mapping

| UI Component | API Calls | Trigger |
|-------------|-----------|---------|
| `/marketplace/page.tsx` | `GET /api/aggregators/marketplace` | Page load, search, tab change |
| `AggregatorCard` (Install) | `POST /api/aggregators` | Click "Install" |
| "Installed" tab filter | `GET /api/aggregators` | Tab selection |
| Config Modal (open) | `GET /api/aggregators/:id` | After install / click "Configure" |
| Config Modal (save) | `PUT /api/aggregators/:id/credentials` | Form submit |
| Config Modal (test) | `POST /api/aggregators/:id/test` | Click "Test Connection" |
| Delete/Remove | `DELETE /api/aggregators/:id` | Click "Remove" |

---

## Updated TypeScript Types

```typescript
// lib/types.ts - Additions

export interface MarketplaceAggregator extends Aggregator {
  requiresMiniConnector: boolean;
}

export interface InstalledAggregator {
  id: string;                    // Instance ID
  marketplaceId: string;
  name: string;
  description: string;
  category: AggregatorCategory;
  version: string;
  logoUrl: string;
  
  status: "active" | "error" | "unconfigured" | "waiting_for_connector";
  lastSyncAt?: Date;
  errorMessage?: string;
  
  configuration?: {
    hasCredentials: boolean;
    connectionMethod: "oauth" | "api_key" | "basic" | "connection_string";
    testStatus?: "passed" | "failed";
  };
  
  requiresMiniConnector: boolean;
  miniConnectorId?: string;
}

export interface AggregatorConfigSchema {
  fields: ConfigField[];
  authType: "oauth" | "api_key" | "basic" | "connection_string";
  oauthUrl?: string;
}

export interface ConfigField {
  name: string;
  label: string;
  type: "text" | "password" | "number" | "url" | "select";
  required: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  helpText?: string;
}

// API Response wrapper
export interface AggregatorApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    suggestion?: string;
  };
}
```

---

## Implementation Example

```typescript
// lib/api/aggregators.ts

import { client } from "./client";

export const aggregatorsApi = {
  // Marketplace
  listMarketplace: (params?: { category?: string; search?: string }) =>
    client.get("/api/aggregators/marketplace", { params }),
  
  // Installed
  listInstalled: () =>
    client.get("/api/aggregators"),
  
  install: (marketplaceId: string, name: string) =>
    client.post("/api/aggregators", { marketplaceId, name }),
  
  get: (id: string) =>
    client.get(`/api/aggregators/${id}`),
  
  configure: (id: string, name: string, credentials: Record<string, string>) =>
    client.put(`/api/aggregators/${id}/credentials`, { name, credentials }),
  
  test: (id: string, credentials?: Record<string, string>) =>
    client.post(`/api/aggregators/${id}/test`, credentials),
  
  remove: (id: string) =>
    client.delete(`/api/aggregators/${id}`),
};
```

---

## Implementation Priority

1. **Phase 1** (Immediate): `GET /api/aggregators/marketplace`, `POST /api/aggregators`
   - Enables browsing and installing
   - Cloud aggregators can work immediately

2. **Phase 2** (Next): `GET /api/aggregators`, `GET /api/aggregators/:id`, `PUT /api/aggregators/:id/credentials`, `POST /api/aggregators/:id/test`
   - Enables configuration and "Installed" tab
   - Needed before workflow creation (workflows need configured aggregators)

3. **Phase 3** (Later): `DELETE /api/aggregators/:id`
   - Cleanup/removal functionality
