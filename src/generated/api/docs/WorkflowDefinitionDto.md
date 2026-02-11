# WorkflowDefinitionDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**version** | **string** |  | [default to '1.0']
**activities** | [**Array&lt;ActivityDto&gt;**](ActivityDto.md) |  | [default to undefined]
**steps** | [**Array&lt;WorkflowStepDto&gt;**](WorkflowStepDto.md) |  | [default to undefined]
**schedule** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { WorkflowDefinitionDto } from '360solve-api-client';

const instance: WorkflowDefinitionDto = {
    version,
    activities,
    steps,
    schedule,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
