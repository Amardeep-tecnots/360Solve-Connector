# OpenAPI Generator Integration Guide

Complete guide for generating TypeScript client SDK from your OpenAPI spec.

## Quick Start

### 1. Install OpenAPI Generator CLI

**Option A: Using npm (Recommended)**
```bash
npm install @openapitools/openapi-generator-cli -g
```

**Option B: Using Docker**
```bash
docker pull openapitools/openapi-generator-cli
```

**Option C: Using Homebrew (Mac/Linux)**
```bash
brew install openapi-generator
```

### 2. Generate TypeScript Client

**Basic generation:**
```bash
openapi-generator-cli generate \
  -i docs/openapi.json \
  -g typescript-axios \
  -o src/generated/api \
  --additional-properties=supportsES6=true,npmName=360solve-api-client
```

**With custom configuration:**
```bash
openapi-generator-cli generate \
  -i docs/openapi.json \
  -g typescript-axios \
  -o src/generated/api \
  --config openapi-generator-config.json
```

### 3. Create Configuration File

Create `openapi-generator-config.json`:
```json
{
  "supportsES6": true,
  "npmName": "360solve-api-client",
  "npmVersion": "1.0.0",
  "modelPropertyNaming": "camelCase",
  "enumPropertyNaming": "UPPERCASE",
  "generateAliasAsModel": true,
  "withSeparateModelsAndApi": true,
  "apiPackage": "api",
  "modelPackage": "models",
  "stringEnums": true,
  "nullSafeAdditionalProps": true
}
```

## Generated Structure

After generation, you'll have:
```
src/generated/api/
├── api/
│   └── auth-api.ts          # AuthController endpoints
├── models/
│   ├── index.ts
│   ├── sign-up-dto.ts
│   ├── sign-in-dto.ts
│   └── refresh-token-dto.ts
├── base.ts                  # Axios configuration
├── configuration.ts         # API configuration
└── index.ts                 # Main exports
```

## Integration in Your Frontend

### 1. Add Generation Script to package.json

```json
{
  "scripts": {
    "generate:api": "openapi-generator-cli generate -i docs/openapi.json -g typescript-axios -o src/generated/api --config openapi-generator-config.json",
    "prebuild": "npm run generate:api"
  }
}
```

### 2. Create API Client Wrapper

Create `lib/api/generated-client.ts`:
```typescript
import { AuthApi, Configuration } from '@/generated/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Create configuration with auth headers
const getConfig = () => {
  const token = localStorage.getItem('accessToken')
  const tenantId = localStorage.getItem('tenantId')
  
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

// Export API instances
export const authApi = new AuthApi(getConfig())

// Update config when token changes
export const updateApiConfig = () => {
  Object.assign(authApi, new AuthApi(getConfig()))
}
```

### 3. Update useAuth Hook

Replace your current `lib/hooks/use-auth.ts`:
```typescript
import { useState, useCallback } from 'react'
import { authApi, updateApiConfig } from '@/lib/api/generated-client'
import type { SignInDto, SignUpDto } from '@/generated/api'

interface User {
  id: string
  email: string
  name: string
  tenantId: string
  role: string
}

interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signIn = useCallback(async (credentials: SignInDto) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await authApi.signIn(credentials)
      const { user, tokens } = response.data.data
      
      localStorage.setItem('accessToken', tokens.accessToken)
      localStorage.setItem('refreshToken', tokens.refreshToken)
      localStorage.setItem('tenantId', user.tenantId)
      
      updateApiConfig()
      setUser(user)
      
      return { success: true }
    } catch (err: any) {
      const message = err.response?.data?.error?.message || 'Sign in failed'
      setError(message)
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signUp = useCallback(async (data: SignUpDto) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await authApi.signUp(data)
      const { user, tokens } = response.data.data
      
      localStorage.setItem('accessToken', tokens.accessToken)
      localStorage.setItem('refreshToken', tokens.refreshToken)
      localStorage.setItem('tenantId', user.tenantId)
      
      updateApiConfig()
      setUser(user)
      
      return { success: true }
    } catch (err: any) {
      const message = err.response?.data?.error?.message || 'Sign up failed'
      setError(message)
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      await authApi.signOut()
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('tenantId')
      setUser(null)
    }
  }, [])

  const refreshToken = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) return false
    
    try {
      const response = await authApi.refresh({ refreshToken })
      const { accessToken } = response.data.data
      
      localStorage.setItem('accessToken', accessToken)
      updateApiConfig()
      
      return true
    } catch {
      return false
    }
  }, [])

  return {
    user,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    refreshToken,
    isAuthenticated: !!user,
  }
}
```

### 4. Update Form Components

**SignIn page** - Use generated types:
```typescript
import type { SignInDto } from '@/generated/api'

// Form state
const [formData, setFormData] = useState<SignInDto>({
  email: '',
  password: '',
  rememberMe: false,
})
```

**SignUp page** - Use generated types:
```typescript
import type { SignUpDto } from '@/generated/api'

const [formData, setFormData] = useState<SignUpDto>({
  email: '',
  password: '',
  name: '',
  companyName: '',
  tier: 'free',
})
```

## Advanced Configuration

### Custom Templates

Create custom templates for specific styling:
```bash
openapi-generator-cli author template \
  -g typescript-axios \
  -o templates/typescript-axios
```

### Multiple Generator Types

**For React Query (TanStack Query):**
```bash
# Generate with react-query support
npx @openapi-codegen/cli generate \
  --definition docs/openapi.json \
  --output src/generated \
  --generator typescript-react-query
```

**For SWR:**
```bash
npx openapi-typescript docs/openapi.json \
  --output src/generated/api-types.ts
```

## CI/CD Integration

**GitHub Actions:**
```yaml
name: Generate API Client

on:
  push:
    paths:
      - 'docs/openapi.json'
  workflow_dispatch:

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install OpenAPI Generator
        run: npm install -g @openapitools/openapi-generator-cli
      
      - name: Generate Client
        run: npm run generate:api
      
      - name: Commit Changes
        run: |
          git config user.name 'github-actions'
          git config user.email 'github-actions@github.com'
          git add src/generated/api
          git diff --quiet && git diff --staged --quiet || git commit -m 'chore: regenerate API client'
          git push
```

## Best Practices

1. **Regenerate on API changes:** Always regenerate when backend API changes
2. **Type safety:** Use generated types for all API interactions
3. **Error handling:** Leverage generated error response types
4. **Version control:** Commit generated code or generate in CI
5. **Base URL:** Configure via environment variables

## Troubleshooting

**Issue: Types not found**
```bash
# Rebuild TypeScript
cd src/generated/api && npm run build
```

**Issue: Missing imports**
```bash
# Regenerate with proper config
openapi-generator-cli generate -i docs/openapi.json -g typescript-axios -o src/generated/api --additional-properties=withSeparateModelsAndApi=true
```

**Issue: Axios version conflicts**
```bash
# Install matching axios version
cd src/generated/api && npm install axios@^1.6.0
```

## Next Steps

1. Add remaining endpoints (workflows, executions, aggregators)
2. Set up automated regeneration on backend deploy
3. Consider using RTK Query generator for Redux integration
4. Add request/response interceptors for logging
