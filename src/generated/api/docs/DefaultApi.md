# DefaultApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**aggregatorsControllerFindAll**](#aggregatorscontrollerfindall) | **GET** /api/aggregators | |
|[**aggregatorsControllerFindOne**](#aggregatorscontrollerfindone) | **GET** /api/aggregators/{id} | |
|[**tenantAggregatorsControllerDelete**](#tenantaggregatorscontrollerdelete) | **DELETE** /api/tenant-aggregators/{id} | |
|[**tenantAggregatorsControllerFindAll**](#tenantaggregatorscontrollerfindall) | **GET** /api/tenant-aggregators | |
|[**tenantAggregatorsControllerFindOne**](#tenantaggregatorscontrollerfindone) | **GET** /api/tenant-aggregators/{id} | |
|[**tenantAggregatorsControllerInstall**](#tenantaggregatorscontrollerinstall) | **POST** /api/tenant-aggregators/install | |
|[**tenantAggregatorsControllerSaveCredentials**](#tenantaggregatorscontrollersavecredentials) | **PUT** /api/tenant-aggregators/{id}/credentials | |
|[**tenantAggregatorsControllerTestConnection**](#tenantaggregatorscontrollertestconnection) | **POST** /api/tenant-aggregators/{id}/test | |

# **aggregatorsControllerFindAll**
> aggregatorsControllerFindAll()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: string; // (default to undefined)
let limit: string; // (default to undefined)
let category: string; // (default to undefined)
let search: string; // (default to undefined)

const { status, data } = await apiInstance.aggregatorsControllerFindAll(
    page,
    limit,
    category,
    search
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**string**] |  | defaults to undefined|
| **limit** | [**string**] |  | defaults to undefined|
| **category** | [**string**] |  | defaults to undefined|
| **search** | [**string**] |  | defaults to undefined|


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
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **aggregatorsControllerFindOne**
> aggregatorsControllerFindOne()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.aggregatorsControllerFindOne(
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
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tenantAggregatorsControllerDelete**
> tenantAggregatorsControllerDelete()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

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

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tenantAggregatorsControllerFindAll**
> tenantAggregatorsControllerFindAll()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

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

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tenantAggregatorsControllerFindOne**
> tenantAggregatorsControllerFindOne()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

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

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tenantAggregatorsControllerInstall**
> tenantAggregatorsControllerInstall()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.tenantAggregatorsControllerInstall();
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
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tenantAggregatorsControllerSaveCredentials**
> tenantAggregatorsControllerSaveCredentials()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.tenantAggregatorsControllerSaveCredentials(
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
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **tenantAggregatorsControllerTestConnection**
> tenantAggregatorsControllerTestConnection()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

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

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

