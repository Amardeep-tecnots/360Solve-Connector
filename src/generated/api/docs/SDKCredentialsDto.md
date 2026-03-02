# SDKCredentialsDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**baseUrl** | **string** | Base URL of the API | [default to undefined]
**apiKey** | **string** | API Key for authentication | [optional] [default to undefined]
**bearerToken** | **string** | Bearer token for OAuth/JWT authentication | [optional] [default to undefined]
**timeout** | **number** | Request timeout in milliseconds | [optional] [default to undefined]

## Example

```typescript
import { SDKCredentialsDto } from '360solve-api-client';

const instance: SDKCredentialsDto = {
    baseUrl,
    apiKey,
    bearerToken,
    timeout,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
