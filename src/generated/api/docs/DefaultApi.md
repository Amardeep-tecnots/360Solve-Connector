# DefaultApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**activitiesControllerExecuteActivity**](#activitiescontrollerexecuteactivity) | **POST** /activities/execute | |
|[**activitiesControllerHealthCheck**](#activitiescontrollerhealthcheck) | **GET** /activities/health | |
|[**activitiesControllerValidateActivity**](#activitiescontrollervalidateactivity) | **POST** /activities/validate | |

# **activitiesControllerExecuteActivity**
> activitiesControllerExecuteActivity()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.activitiesControllerExecuteActivity();
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

# **activitiesControllerHealthCheck**
> activitiesControllerHealthCheck()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.activitiesControllerHealthCheck();
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
|**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **activitiesControllerValidateActivity**
> activitiesControllerValidateActivity()


### Example

```typescript
import {
    DefaultApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.activitiesControllerValidateActivity();
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

