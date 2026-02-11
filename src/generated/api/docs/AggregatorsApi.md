# AggregatorsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**aggregatorsControllerFindAll**](#aggregatorscontrollerfindall) | **GET** /api/aggregators | |
|[**aggregatorsControllerFindOne**](#aggregatorscontrollerfindone) | **GET** /api/aggregators/{id} | |

# **aggregatorsControllerFindAll**
> aggregatorsControllerFindAll()


### Example

```typescript
import {
    AggregatorsApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new AggregatorsApi(configuration);

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

[bearer](../README.md#bearer)

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
    AggregatorsApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new AggregatorsApi(configuration);

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

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

