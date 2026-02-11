# ExecuteWorkflowDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**triggerContext** | **object** | Optional execution trigger context | [optional] [default to undefined]
**scheduledFor** | **string** | Override workflow schedule for this run | [optional] [default to undefined]
**immediate** | **boolean** | Execute immediately vs queue | [optional] [default to true]

## Example

```typescript
import { ExecuteWorkflowDto } from '360solve-api-client';

const instance: ExecuteWorkflowDto = {
    triggerContext,
    scheduledFor,
    immediate,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
