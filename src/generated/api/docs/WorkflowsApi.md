# WorkflowsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**workflowsControllerCreate**](#workflowscontrollercreate) | **POST** /api/workflows | |
|[**workflowsControllerDelete**](#workflowscontrollerdelete) | **DELETE** /api/workflows/{id} | |
|[**workflowsControllerFindAll**](#workflowscontrollerfindall) | **GET** /api/workflows | |
|[**workflowsControllerFindOne**](#workflowscontrollerfindone) | **GET** /api/workflows/{id} | |
|[**workflowsControllerUpdate**](#workflowscontrollerupdate) | **PUT** /api/workflows/{id} | |
|[**workflowsControllerValidate**](#workflowscontrollervalidate) | **POST** /api/workflows/validate | |

# **workflowsControllerCreate**
> WorkflowDetailResponseDto workflowsControllerCreate(createWorkflowDto)


### Example

```typescript
import {
    WorkflowsApi,
    Configuration,
    CreateWorkflowDto
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new WorkflowsApi(configuration);

let createWorkflowDto: CreateWorkflowDto; //

const { status, data } = await apiInstance.workflowsControllerCreate(
    createWorkflowDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createWorkflowDto** | **CreateWorkflowDto**|  | |


### Return type

**WorkflowDetailResponseDto**

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

# **workflowsControllerDelete**
> workflowsControllerDelete()


### Example

```typescript
import {
    WorkflowsApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new WorkflowsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.workflowsControllerDelete(
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

# **workflowsControllerFindAll**
> WorkflowListResponseDto workflowsControllerFindAll()


### Example

```typescript
import {
    WorkflowsApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new WorkflowsApi(configuration);

let status: string; // (default to undefined)

const { status, data } = await apiInstance.workflowsControllerFindAll(
    status
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **status** | [**string**] |  | defaults to undefined|


### Return type

**WorkflowListResponseDto**

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

# **workflowsControllerFindOne**
> WorkflowDetailResponseDto workflowsControllerFindOne()


### Example

```typescript
import {
    WorkflowsApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new WorkflowsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.workflowsControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**WorkflowDetailResponseDto**

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

# **workflowsControllerUpdate**
> WorkflowDetailResponseDto workflowsControllerUpdate(updateWorkflowDto)


### Example

```typescript
import {
    WorkflowsApi,
    Configuration,
    UpdateWorkflowDto
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new WorkflowsApi(configuration);

let id: string; // (default to undefined)
let updateWorkflowDto: UpdateWorkflowDto; //

const { status, data } = await apiInstance.workflowsControllerUpdate(
    id,
    updateWorkflowDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateWorkflowDto** | **UpdateWorkflowDto**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**WorkflowDetailResponseDto**

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

# **workflowsControllerValidate**
> WorkflowValidationResponseDto workflowsControllerValidate(workflowDefinitionDto)


### Example

```typescript
import {
    WorkflowsApi,
    Configuration,
    WorkflowDefinitionDto
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new WorkflowsApi(configuration);

let workflowDefinitionDto: WorkflowDefinitionDto; //

const { status, data } = await apiInstance.workflowsControllerValidate(
    workflowDefinitionDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **workflowDefinitionDto** | **WorkflowDefinitionDto**|  | |


### Return type

**WorkflowValidationResponseDto**

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

