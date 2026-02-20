# FieldMappingsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**mappingsControllerApplyMapping**](#mappingscontrollerapplymapping) | **POST** /mappings/apply | Apply a mapping to data|
|[**mappingsControllerCreate**](#mappingscontrollercreate) | **POST** /mappings | Create a new field mapping|
|[**mappingsControllerDelete**](#mappingscontrollerdelete) | **DELETE** /mappings/{id} | Delete a field mapping|
|[**mappingsControllerFindAll**](#mappingscontrollerfindall) | **GET** /mappings | List all field mappings|
|[**mappingsControllerFindOne**](#mappingscontrollerfindone) | **GET** /mappings/{id} | Get a field mapping by ID|
|[**mappingsControllerGenerateMapping**](#mappingscontrollergeneratemapping) | **POST** /mappings/generate | Generate field mapping using AI|
|[**mappingsControllerGetAvailableMappings**](#mappingscontrollergetavailablemappings) | **GET** /mappings/instance/{instanceId}/available | Get available mappings for an instance|
|[**mappingsControllerQuickGenerateMapping**](#mappingscontrollerquickgeneratemapping) | **POST** /mappings/generate/quick | Quick generate mapping from existing instances|
|[**mappingsControllerUpdate**](#mappingscontrollerupdate) | **PUT** /mappings/{id} | Update a field mapping|
|[**mappingsControllerValidateMapping**](#mappingscontrollervalidatemapping) | **POST** /mappings/validate | Validate a mapping|

# **mappingsControllerApplyMapping**
> mappingsControllerApplyMapping(applyMappingDto)


### Example

```typescript
import {
    FieldMappingsApi,
    Configuration,
    ApplyMappingDto
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new FieldMappingsApi(configuration);

let applyMappingDto: ApplyMappingDto; //

const { status, data } = await apiInstance.mappingsControllerApplyMapping(
    applyMappingDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **applyMappingDto** | **ApplyMappingDto**|  | |


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
|**200** | Mapping applied successfully |  -  |
|**404** | Mapping not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **mappingsControllerCreate**
> mappingsControllerCreate(createMappingDto)


### Example

```typescript
import {
    FieldMappingsApi,
    Configuration,
    CreateMappingDto
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new FieldMappingsApi(configuration);

let createMappingDto: CreateMappingDto; //

const { status, data } = await apiInstance.mappingsControllerCreate(
    createMappingDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createMappingDto** | **CreateMappingDto**|  | |


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
|**201** | Mapping created successfully |  -  |
|**400** | Invalid input |  -  |
|**409** | Mapping with this name already exists |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **mappingsControllerDelete**
> mappingsControllerDelete()


### Example

```typescript
import {
    FieldMappingsApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new FieldMappingsApi(configuration);

let id: string; //Mapping ID (default to undefined)

const { status, data } = await apiInstance.mappingsControllerDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Mapping ID | defaults to undefined|


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
|**204** | Mapping deleted successfully |  -  |
|**404** | Mapping not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **mappingsControllerFindAll**
> mappingsControllerFindAll()


### Example

```typescript
import {
    FieldMappingsApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new FieldMappingsApi(configuration);

let sourceInstanceId: string; //Filter by source instance ID (optional) (default to undefined)
let destinationInstanceId: string; //Filter by destination instance ID (optional) (default to undefined)
let type: 'COLUMN' | 'FIELD' | 'TRANSFORM' | 'AGGREGATOR' | 'MINI_CONNECTOR' | 'HYBRID'; //Filter by mapping type (optional) (default to undefined)
let sourceType: 'database' | 'sdk' | 'aggregator' | 'mini-connector'; //Filter by source type (optional) (default to undefined)
let destinationType: 'database' | 'sdk' | 'aggregator' | 'mini-connector'; //Filter by destination type (optional) (default to undefined)
let isActive: boolean; //Filter by active status (optional) (default to undefined)
let search: string; //Search by name (optional) (default to undefined)
let page: number; //Page number (optional) (default to 1)
let limit: number; //Items per page (optional) (default to 20)

const { status, data } = await apiInstance.mappingsControllerFindAll(
    sourceInstanceId,
    destinationInstanceId,
    type,
    sourceType,
    destinationType,
    isActive,
    search,
    page,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sourceInstanceId** | [**string**] | Filter by source instance ID | (optional) defaults to undefined|
| **destinationInstanceId** | [**string**] | Filter by destination instance ID | (optional) defaults to undefined|
| **type** | [**&#39;COLUMN&#39; | &#39;FIELD&#39; | &#39;TRANSFORM&#39; | &#39;AGGREGATOR&#39; | &#39;MINI_CONNECTOR&#39; | &#39;HYBRID&#39;**]**Array<&#39;COLUMN&#39; &#124; &#39;FIELD&#39; &#124; &#39;TRANSFORM&#39; &#124; &#39;AGGREGATOR&#39; &#124; &#39;MINI_CONNECTOR&#39; &#124; &#39;HYBRID&#39;>** | Filter by mapping type | (optional) defaults to undefined|
| **sourceType** | [**&#39;database&#39; | &#39;sdk&#39; | &#39;aggregator&#39; | &#39;mini-connector&#39;**]**Array<&#39;database&#39; &#124; &#39;sdk&#39; &#124; &#39;aggregator&#39; &#124; &#39;mini-connector&#39;>** | Filter by source type | (optional) defaults to undefined|
| **destinationType** | [**&#39;database&#39; | &#39;sdk&#39; | &#39;aggregator&#39; | &#39;mini-connector&#39;**]**Array<&#39;database&#39; &#124; &#39;sdk&#39; &#124; &#39;aggregator&#39; &#124; &#39;mini-connector&#39;>** | Filter by destination type | (optional) defaults to undefined|
| **isActive** | [**boolean**] | Filter by active status | (optional) defaults to undefined|
| **search** | [**string**] | Search by name | (optional) defaults to undefined|
| **page** | [**number**] | Page number | (optional) defaults to 1|
| **limit** | [**number**] | Items per page | (optional) defaults to 20|


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
|**200** | List of mappings |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **mappingsControllerFindOne**
> mappingsControllerFindOne()


### Example

```typescript
import {
    FieldMappingsApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new FieldMappingsApi(configuration);

let id: string; //Mapping ID (default to undefined)

const { status, data } = await apiInstance.mappingsControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Mapping ID | defaults to undefined|


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
|**200** | Mapping details |  -  |
|**404** | Mapping not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **mappingsControllerGenerateMapping**
> mappingsControllerGenerateMapping(generateMappingDto)


### Example

```typescript
import {
    FieldMappingsApi,
    Configuration,
    GenerateMappingDto
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new FieldMappingsApi(configuration);

let generateMappingDto: GenerateMappingDto; //

const { status, data } = await apiInstance.mappingsControllerGenerateMapping(
    generateMappingDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **generateMappingDto** | **GenerateMappingDto**|  | |


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
|**200** | Mapping generated successfully |  -  |
|**400** | Invalid input |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **mappingsControllerGetAvailableMappings**
> mappingsControllerGetAvailableMappings()


### Example

```typescript
import {
    FieldMappingsApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new FieldMappingsApi(configuration);

let instanceId: string; //Aggregator instance ID (default to undefined)

const { status, data } = await apiInstance.mappingsControllerGetAvailableMappings(
    instanceId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **instanceId** | [**string**] | Aggregator instance ID | defaults to undefined|


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
|**200** | List of available mappings |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **mappingsControllerQuickGenerateMapping**
> mappingsControllerQuickGenerateMapping(quickGenerateMappingDto)


### Example

```typescript
import {
    FieldMappingsApi,
    Configuration,
    QuickGenerateMappingDto
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new FieldMappingsApi(configuration);

let quickGenerateMappingDto: QuickGenerateMappingDto; //

const { status, data } = await apiInstance.mappingsControllerQuickGenerateMapping(
    quickGenerateMappingDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **quickGenerateMappingDto** | **QuickGenerateMappingDto**|  | |


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
|**200** | Mapping generated successfully |  -  |
|**404** | Source or destination instance not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **mappingsControllerUpdate**
> mappingsControllerUpdate(updateMappingDto)


### Example

```typescript
import {
    FieldMappingsApi,
    Configuration,
    UpdateMappingDto
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new FieldMappingsApi(configuration);

let id: string; //Mapping ID (default to undefined)
let updateMappingDto: UpdateMappingDto; //

const { status, data } = await apiInstance.mappingsControllerUpdate(
    id,
    updateMappingDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateMappingDto** | **UpdateMappingDto**|  | |
| **id** | [**string**] | Mapping ID | defaults to undefined|


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
|**200** | Mapping updated successfully |  -  |
|**404** | Mapping not found |  -  |
|**409** | Mapping name already exists |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **mappingsControllerValidateMapping**
> mappingsControllerValidateMapping(validateMappingDto)


### Example

```typescript
import {
    FieldMappingsApi,
    Configuration,
    ValidateMappingDto
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new FieldMappingsApi(configuration);

let validateMappingDto: ValidateMappingDto; //

const { status, data } = await apiInstance.mappingsControllerValidateMapping(
    validateMappingDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **validateMappingDto** | **ValidateMappingDto**|  | |


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
|**200** | Validation result |  -  |
|**404** | Mapping not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

