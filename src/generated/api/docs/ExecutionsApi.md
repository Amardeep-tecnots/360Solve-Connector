# ExecutionsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**executionsControllerCancel**](#executionscontrollercancel) | **POST** /api/executions/{id}/cancel | |
|[**executionsControllerFindAll**](#executionscontrollerfindall) | **GET** /api/executions | |
|[**executionsControllerFindOne**](#executionscontrollerfindone) | **GET** /api/executions/{id} | |
|[**executionsControllerPause**](#executionscontrollerpause) | **POST** /api/executions/{id}/pause | |
|[**executionsControllerResume**](#executionscontrollerresume) | **POST** /api/executions/{id}/resume | |
|[**executionsControllerTriggerWorkflow**](#executionscontrollertriggerworkflow) | **POST** /api/workflows/{id}/execute | |

# **executionsControllerCancel**
> ExecutionControlResponseDto executionsControllerCancel(cancelExecutionDto)


### Example

```typescript
import {
    ExecutionsApi,
    Configuration,
    CancelExecutionDto
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new ExecutionsApi(configuration);

let id: string; // (default to undefined)
let cancelExecutionDto: CancelExecutionDto; //

const { status, data } = await apiInstance.executionsControllerCancel(
    id,
    cancelExecutionDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **cancelExecutionDto** | **CancelExecutionDto**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ExecutionControlResponseDto**

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

# **executionsControllerFindAll**
> ExecutionListResponseDto executionsControllerFindAll()


### Example

```typescript
import {
    ExecutionsApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new ExecutionsApi(configuration);

let workflowId: string; //Filter by workflow ID (optional) (default to undefined)
let status: 'PENDING' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'FAILED' | 'CANCELLED'; // (optional) (default to undefined)
let startDate: string; //Filter by date range start (optional) (default to undefined)
let endDate: string; //Filter by date range end (optional) (default to undefined)
let limit: number; // (optional) (default to 20)
let offset: number; // (optional) (default to 0)

const { status, data } = await apiInstance.executionsControllerFindAll(
    workflowId,
    status,
    startDate,
    endDate,
    limit,
    offset
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **workflowId** | [**string**] | Filter by workflow ID | (optional) defaults to undefined|
| **status** | [**&#39;PENDING&#39; | &#39;RUNNING&#39; | &#39;PAUSED&#39; | &#39;COMPLETED&#39; | &#39;FAILED&#39; | &#39;CANCELLED&#39;**]**Array<&#39;PENDING&#39; &#124; &#39;RUNNING&#39; &#124; &#39;PAUSED&#39; &#124; &#39;COMPLETED&#39; &#124; &#39;FAILED&#39; &#124; &#39;CANCELLED&#39;>** |  | (optional) defaults to undefined|
| **startDate** | [**string**] | Filter by date range start | (optional) defaults to undefined|
| **endDate** | [**string**] | Filter by date range end | (optional) defaults to undefined|
| **limit** | [**number**] |  | (optional) defaults to 20|
| **offset** | [**number**] |  | (optional) defaults to 0|


### Return type

**ExecutionListResponseDto**

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

# **executionsControllerFindOne**
> ExecutionDetailResponseDto executionsControllerFindOne()


### Example

```typescript
import {
    ExecutionsApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new ExecutionsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.executionsControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ExecutionDetailResponseDto**

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

# **executionsControllerPause**
> ExecutionControlResponseDto executionsControllerPause(pauseExecutionDto)


### Example

```typescript
import {
    ExecutionsApi,
    Configuration,
    PauseExecutionDto
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new ExecutionsApi(configuration);

let id: string; // (default to undefined)
let pauseExecutionDto: PauseExecutionDto; //

const { status, data } = await apiInstance.executionsControllerPause(
    id,
    pauseExecutionDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pauseExecutionDto** | **PauseExecutionDto**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ExecutionControlResponseDto**

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

# **executionsControllerResume**
> ExecutionControlResponseDto executionsControllerResume(resumeExecutionDto)


### Example

```typescript
import {
    ExecutionsApi,
    Configuration,
    ResumeExecutionDto
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new ExecutionsApi(configuration);

let id: string; // (default to undefined)
let resumeExecutionDto: ResumeExecutionDto; //

const { status, data } = await apiInstance.executionsControllerResume(
    id,
    resumeExecutionDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **resumeExecutionDto** | **ResumeExecutionDto**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ExecutionControlResponseDto**

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

# **executionsControllerTriggerWorkflow**
> ExecutionTriggerResponseDto executionsControllerTriggerWorkflow(executeWorkflowDto)


### Example

```typescript
import {
    ExecutionsApi,
    Configuration,
    ExecuteWorkflowDto
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new ExecutionsApi(configuration);

let id: string; // (default to undefined)
let executeWorkflowDto: ExecuteWorkflowDto; //

const { status, data } = await apiInstance.executionsControllerTriggerWorkflow(
    id,
    executeWorkflowDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **executeWorkflowDto** | **ExecuteWorkflowDto**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ExecutionTriggerResponseDto**

### Authorization

[bearer](../README.md#bearer)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

