# WorkflowDefinitionResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**version** | **string** |  | [default to undefined]
**activities** | [**Array&lt;WorkflowActivityResponseDto&gt;**](WorkflowActivityResponseDto.md) |  | [default to undefined]
**steps** | [**Array&lt;WorkflowStepResponseDto&gt;**](WorkflowStepResponseDto.md) |  | [default to undefined]
**schedule** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { WorkflowDefinitionResponseDto } from '360solve-api-client';

const instance: WorkflowDefinitionResponseDto = {
    version,
    activities,
    steps,
    schedule,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
