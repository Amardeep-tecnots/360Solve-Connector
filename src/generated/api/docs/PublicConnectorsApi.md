# PublicConnectorsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**publicConnectorsControllerValidateApiKey**](#publicconnectorscontrollervalidateapikey) | **POST** /api/public/connectors/validate-api-key | |

# **publicConnectorsControllerValidateApiKey**
> publicConnectorsControllerValidateApiKey(body)


### Example

```typescript
import {
    PublicConnectorsApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new PublicConnectorsApi(configuration);

let body: object; //

const { status, data } = await apiInstance.publicConnectorsControllerValidateApiKey(
    body
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **body** | **object**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Validates API key and returns tenant info |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

