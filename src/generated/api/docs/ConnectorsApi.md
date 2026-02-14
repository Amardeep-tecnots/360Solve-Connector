# ConnectorsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**connectorsControllerCreate**](#connectorscontrollercreate) | **POST** /api/connectors | |
|[**connectorsControllerFindAll**](#connectorscontrollerfindall) | **GET** /api/connectors | |
|[**connectorsControllerFindOne**](#connectorscontrollerfindone) | **GET** /api/connectors/{id} | |
|[**connectorsControllerHeartbeat**](#connectorscontrollerheartbeat) | **POST** /api/connectors/{id}/heartbeat | |
|[**connectorsControllerRemove**](#connectorscontrollerremove) | **DELETE** /api/connectors/{id} | |
|[**connectorsControllerUpdate**](#connectorscontrollerupdate) | **PUT** /api/connectors/{id} | |

# **connectorsControllerCreate**
> ConnectorResponseDto connectorsControllerCreate(createConnectorDto)


### Example

```typescript
import {
    ConnectorsApi,
    Configuration,
    CreateConnectorDto
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new ConnectorsApi(configuration);

let createConnectorDto: CreateConnectorDto; //

const { status, data } = await apiInstance.connectorsControllerCreate(
    createConnectorDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createConnectorDto** | **CreateConnectorDto**|  | |


### Return type

**ConnectorResponseDto**

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

# **connectorsControllerFindAll**
> ConnectorListResponseDto connectorsControllerFindAll()


### Example

```typescript
import {
    ConnectorsApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new ConnectorsApi(configuration);

let status: 'ONLINE' | 'OFFLINE' | 'CONNECTING' | 'ERROR' | 'BUSY'; // (optional) (default to undefined)
let type: 'CLOUD' | 'MINI'; // (optional) (default to undefined)
let search: string; //Search by name (optional) (default to undefined)

const { status, data } = await apiInstance.connectorsControllerFindAll(
    status,
    type,
    search
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **status** | [**&#39;ONLINE&#39; | &#39;OFFLINE&#39; | &#39;CONNECTING&#39; | &#39;ERROR&#39; | &#39;BUSY&#39;**]**Array<&#39;ONLINE&#39; &#124; &#39;OFFLINE&#39; &#124; &#39;CONNECTING&#39; &#124; &#39;ERROR&#39; &#124; &#39;BUSY&#39;>** |  | (optional) defaults to undefined|
| **type** | [**&#39;CLOUD&#39; | &#39;MINI&#39;**]**Array<&#39;CLOUD&#39; &#124; &#39;MINI&#39;>** |  | (optional) defaults to undefined|
| **search** | [**string**] | Search by name | (optional) defaults to undefined|


### Return type

**ConnectorListResponseDto**

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

# **connectorsControllerFindOne**
> ConnectorResponseDto connectorsControllerFindOne()


### Example

```typescript
import {
    ConnectorsApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new ConnectorsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.connectorsControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ConnectorResponseDto**

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

# **connectorsControllerHeartbeat**
> ConnectorResponseDto connectorsControllerHeartbeat(heartbeatDto)


### Example

```typescript
import {
    ConnectorsApi,
    Configuration,
    HeartbeatDto
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new ConnectorsApi(configuration);

let id: string; // (default to undefined)
let heartbeatDto: HeartbeatDto; //

const { status, data } = await apiInstance.connectorsControllerHeartbeat(
    id,
    heartbeatDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **heartbeatDto** | **HeartbeatDto**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ConnectorResponseDto**

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

# **connectorsControllerRemove**
> connectorsControllerRemove()


### Example

```typescript
import {
    ConnectorsApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new ConnectorsApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.connectorsControllerRemove(
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

# **connectorsControllerUpdate**
> ConnectorResponseDto connectorsControllerUpdate(updateConnectorDto)


### Example

```typescript
import {
    ConnectorsApi,
    Configuration,
    UpdateConnectorDto
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new ConnectorsApi(configuration);

let id: string; // (default to undefined)
let updateConnectorDto: UpdateConnectorDto; //

const { status, data } = await apiInstance.connectorsControllerUpdate(
    id,
    updateConnectorDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateConnectorDto** | **UpdateConnectorDto**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**ConnectorResponseDto**

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

