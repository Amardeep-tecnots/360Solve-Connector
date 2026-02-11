# SchemaDiscoveryApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**schemaDiscoveryControllerDiscover**](#schemadiscoverycontrollerdiscover) | **POST** /api/tenant-aggregators/{id}/discover | |
|[**schemaDiscoveryControllerGetRelationships**](#schemadiscoverycontrollergetrelationships) | **GET** /api/tenant-aggregators/{id}/schema/relationships | |
|[**schemaDiscoveryControllerGetSchema**](#schemadiscoverycontrollergetschema) | **GET** /api/tenant-aggregators/{id}/schema | |
|[**schemaDiscoveryControllerGetTable**](#schemadiscoverycontrollergettable) | **GET** /api/tenant-aggregators/{id}/schema/tables/{tableName} | |
|[**schemaDiscoveryControllerGetTables**](#schemadiscoverycontrollergettables) | **GET** /api/tenant-aggregators/{id}/schema/tables | |
|[**schemaDiscoveryControllerPreviewTable**](#schemadiscoverycontrollerpreviewtable) | **POST** /api/tenant-aggregators/{id}/schema/preview | |

# **schemaDiscoveryControllerDiscover**
> SchemaDiscoveryResponseDto schemaDiscoveryControllerDiscover()


### Example

```typescript
import {
    SchemaDiscoveryApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new SchemaDiscoveryApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.schemaDiscoveryControllerDiscover(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**SchemaDiscoveryResponseDto**

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

# **schemaDiscoveryControllerGetRelationships**
> SchemaDiscoveryResponseDto schemaDiscoveryControllerGetRelationships()


### Example

```typescript
import {
    SchemaDiscoveryApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new SchemaDiscoveryApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.schemaDiscoveryControllerGetRelationships(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**SchemaDiscoveryResponseDto**

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

# **schemaDiscoveryControllerGetSchema**
> SchemaDiscoveryResponseDto schemaDiscoveryControllerGetSchema()


### Example

```typescript
import {
    SchemaDiscoveryApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new SchemaDiscoveryApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.schemaDiscoveryControllerGetSchema(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**SchemaDiscoveryResponseDto**

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

# **schemaDiscoveryControllerGetTable**
> SchemaDiscoveryResponseDto schemaDiscoveryControllerGetTable()


### Example

```typescript
import {
    SchemaDiscoveryApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new SchemaDiscoveryApi(configuration);

let id: string; // (default to undefined)
let tableName: string; // (default to undefined)

const { status, data } = await apiInstance.schemaDiscoveryControllerGetTable(
    id,
    tableName
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|
| **tableName** | [**string**] |  | defaults to undefined|


### Return type

**SchemaDiscoveryResponseDto**

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

# **schemaDiscoveryControllerGetTables**
> SchemaDiscoveryResponseDto schemaDiscoveryControllerGetTables()


### Example

```typescript
import {
    SchemaDiscoveryApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new SchemaDiscoveryApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.schemaDiscoveryControllerGetTables(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**SchemaDiscoveryResponseDto**

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

# **schemaDiscoveryControllerPreviewTable**
> SchemaDiscoveryResponseDto schemaDiscoveryControllerPreviewTable(previewTableDto)


### Example

```typescript
import {
    SchemaDiscoveryApi,
    Configuration,
    PreviewTableDto
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new SchemaDiscoveryApi(configuration);

let id: string; // (default to undefined)
let tableName: string; // (default to undefined)
let previewTableDto: PreviewTableDto; //

const { status, data } = await apiInstance.schemaDiscoveryControllerPreviewTable(
    id,
    tableName,
    previewTableDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **previewTableDto** | **PreviewTableDto**|  | |
| **id** | [**string**] |  | defaults to undefined|
| **tableName** | [**string**] |  | defaults to undefined|


### Return type

**SchemaDiscoveryResponseDto**

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

