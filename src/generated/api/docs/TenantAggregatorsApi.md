# TenantAggregatorsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**tenantAggregatorsControllerDelete**](#tenantaggregatorscontrollerdelete) | **DELETE** /api/tenant-aggregators/{id} | |
|[**tenantAggregatorsControllerFindAll**](#tenantaggregatorscontrollerfindall) | **GET** /api/tenant-aggregators | |
|[**tenantAggregatorsControllerFindOne**](#tenantaggregatorscontrollerfindone) | **GET** /api/tenant-aggregators/{id} | |
|[**tenantAggregatorsControllerInstall**](#tenantaggregatorscontrollerinstall) | **POST** /api/tenant-aggregators/install | |
|[**tenantAggregatorsControllerSaveCredentials**](#tenantaggregatorscontrollersavecredentials) | **PUT** /api/tenant-aggregators/{id}/credentials | |
|[**tenantAggregatorsControllerTestConnection**](#tenantaggregatorscontrollertestconnection) | **POST** /api/tenant-aggregators/{id}/test | |

# **tenantAggregatorsControllerDelete**
> tenantAggregatorsControllerDelete()


### Example

```typescript
import {
    TenantAggregatorsApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new TenantAggregatorsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.tenantAggregatorsControllerDelete(
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

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tenantAggregatorsControllerFindAll**
> TenantAggregatorListResponseDto tenantAggregatorsControllerFindAll()


### Example

```typescript
import {
    TenantAggregatorsApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new TenantAggregatorsApi(configuration);

let aggregatorId: string; // (default to undefined)

const { status, data } = await apiInstance.tenantAggregatorsControllerFindAll(
    aggregatorId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **aggregatorId** | [**string**] |  | defaults to undefined|


### Return type

**TenantAggregatorListResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tenantAggregatorsControllerFindOne**
> TenantAggregatorDetailResponseDto tenantAggregatorsControllerFindOne()


### Example

```typescript
import {
    TenantAggregatorsApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new TenantAggregatorsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.tenantAggregatorsControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**TenantAggregatorDetailResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tenantAggregatorsControllerInstall**
> tenantAggregatorsControllerInstall(installTenantAggregatorDto)


### Example

```typescript
import {
    TenantAggregatorsApi,
    Configuration,
    InstallTenantAggregatorDto
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new TenantAggregatorsApi(configuration);

let installTenantAggregatorDto: InstallTenantAggregatorDto; //

const { status, data } = await apiInstance.tenantAggregatorsControllerInstall(
    installTenantAggregatorDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **installTenantAggregatorDto** | **InstallTenantAggregatorDto**|  | |


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tenantAggregatorsControllerSaveCredentials**
> tenantAggregatorsControllerSaveCredentials(saveTenantAggregatorCredentialsDto)


### Example

```typescript
import {
    TenantAggregatorsApi,
    Configuration,
    SaveTenantAggregatorCredentialsDto
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new TenantAggregatorsApi(configuration);

let id: string; // (default to undefined)
let saveTenantAggregatorCredentialsDto: SaveTenantAggregatorCredentialsDto; //

const { status, data } = await apiInstance.tenantAggregatorsControllerSaveCredentials(
    id,
    saveTenantAggregatorCredentialsDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **saveTenantAggregatorCredentialsDto** | **SaveTenantAggregatorCredentialsDto**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tenantAggregatorsControllerTestConnection**
> tenantAggregatorsControllerTestConnection()


### Example

```typescript
import {
    TenantAggregatorsApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new TenantAggregatorsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.tenantAggregatorsControllerTestConnection(
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

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

