# ExecutionResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [default to undefined]
**tenantId** | **string** |  | [default to undefined]
**workflowId** | **string** |  | [default to undefined]
**workflowVersion** | **number** |  | [default to undefined]
**workflowHash** | **string** |  | [default to undefined]
**status** | **string** |  | [default to undefined]
**currentStepId** | **string** |  | [optional] [default to undefined]
**activities** | **Array&lt;string&gt;** |  | [default to undefined]
**events** | **Array&lt;string&gt;** |  | [default to undefined]
**startedAt** | **string** |  | [default to undefined]
**completedAt** | **string** |  | [optional] [default to undefined]
**errorMessage** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { ExecutionResponseDto } from '360solve-api-client';

const instance: ExecutionResponseDto = {
    id,
    tenantId,
    workflowId,
    workflowVersion,
    workflowHash,
    status,
    currentStepId,
    activities,
    events,
    startedAt,
    completedAt,
    errorMessage,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
