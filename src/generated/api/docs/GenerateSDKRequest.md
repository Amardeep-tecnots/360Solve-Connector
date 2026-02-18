# GenerateSDKRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**openApiSpec** | **string** | OpenAPI spec URL or raw JSON content | [default to undefined]
**model** | **string** | Custom model to use for generation | [optional] [default to undefined]
**className** | **string** | SDK class name - used as the TypeScript class name in generated SDK | [optional] [default to undefined]
**aggregatorId** | **string** | Existing aggregator ID to link the SDK to (preserves aggregator name) | [optional] [default to undefined]

## Example

```typescript
import { GenerateSDKRequest } from '360solve-api-client';

const instance: GenerateSDKRequest = {
    openApiSpec,
    model,
    className,
    aggregatorId,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
