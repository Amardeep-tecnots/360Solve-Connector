# AIApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**aIControllerDownloadSDK**](#aicontrollerdownloadsdk) | **GET** /ai/sdk/{id}/download | Download SDK source code|
|[**aIControllerGenerateMapping**](#aicontrollergeneratemapping) | **POST** /ai/generate-mapping | Generate schema mapping between source and destination|
|[**aIControllerGenerateSDK**](#aicontrollergeneratesdk) | **POST** /ai/generate-sdk | Generate TypeScript SDK from OpenAPI specification|
|[**aIControllerGenerateWorkflow**](#aicontrollergenerateworkflow) | **POST** /ai/generate-workflow | Generate workflow from natural language description|
|[**aIControllerGetModels**](#aicontrollergetmodels) | **GET** /ai/models/{provider} | Get models for a specific provider|
|[**aIControllerGetProviders**](#aicontrollergetproviders) | **GET** /ai/providers | Get available AI providers and models|
|[**aIControllerGetSDK**](#aicontrollergetsdk) | **GET** /ai/sdk/{id} | Get generated SDK by ID|
|[**aIControllerListSDKs**](#aicontrollerlistsdks) | **GET** /ai/sdks | List all generated SDKs|
|[**aIControllerTestAI**](#aicontrollertestai) | **POST** /ai/test | Test AI completion|

# **aIControllerDownloadSDK**
> aIControllerDownloadSDK()


### Example

```typescript
import {
    AIApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new AIApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.aIControllerDownloadSDK(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | SDK code file |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **aIControllerGenerateMapping**
> aIControllerGenerateMapping()


### Example

```typescript
import {
    AIApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new AIApi(configuration);

const { status, data } = await apiInstance.aIControllerGenerateMapping();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Mapping generated successfully |  -  |
|**400** | Invalid request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **aIControllerGenerateSDK**
> aIControllerGenerateSDK()


### Example

```typescript
import {
    AIApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new AIApi(configuration);

const { status, data } = await apiInstance.aIControllerGenerateSDK();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | SDK generated successfully |  -  |
|**400** | Invalid request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **aIControllerGenerateWorkflow**
> aIControllerGenerateWorkflow()


### Example

```typescript
import {
    AIApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new AIApi(configuration);

const { status, data } = await apiInstance.aIControllerGenerateWorkflow();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Workflow generated successfully |  -  |
|**400** | Invalid request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **aIControllerGetModels**
> aIControllerGetModels()


### Example

```typescript
import {
    AIApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new AIApi(configuration);

let provider: string; // (default to undefined)

const { status, data } = await apiInstance.aIControllerGetModels(
    provider
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **provider** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of models |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **aIControllerGetProviders**
> aIControllerGetProviders()


### Example

```typescript
import {
    AIApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new AIApi(configuration);

const { status, data } = await apiInstance.aIControllerGetProviders();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of available providers |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **aIControllerGetSDK**
> aIControllerGetSDK()


### Example

```typescript
import {
    AIApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new AIApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.aIControllerGetSDK(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | SDK details |  -  |
|**404** | SDK not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **aIControllerListSDKs**
> aIControllerListSDKs()


### Example

```typescript
import {
    AIApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new AIApi(configuration);

const { status, data } = await apiInstance.aIControllerListSDKs();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of SDKs |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **aIControllerTestAI**
> aIControllerTestAI()


### Example

```typescript
import {
    AIApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new AIApi(configuration);

const { status, data } = await apiInstance.aIControllerTestAI();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | AI response |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

