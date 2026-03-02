# TenantsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**tenantsControllerGetCurrent**](#tenantscontrollergetcurrent) | **GET** /api/tenants/current | |
|[**tenantsControllerUpdateCurrent**](#tenantscontrollerupdatecurrent) | **PUT** /api/tenants/current | |

# **tenantsControllerGetCurrent**
> TenantResponseDto tenantsControllerGetCurrent()


### Example

```typescript
import {
    TenantsApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new TenantsApi(configuration);

const { status, data } = await apiInstance.tenantsControllerGetCurrent();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**TenantResponseDto**

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

# **tenantsControllerUpdateCurrent**
> TenantResponseDto tenantsControllerUpdateCurrent(updateTenantDto)


### Example

```typescript
import {
    TenantsApi,
    Configuration,
    UpdateTenantDto
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new TenantsApi(configuration);

let updateTenantDto: UpdateTenantDto; //

const { status, data } = await apiInstance.tenantsControllerUpdateCurrent(
    updateTenantDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateTenantDto** | **UpdateTenantDto**|  | |


### Return type

**TenantResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

