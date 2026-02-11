# UpdateWorkflowDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**definition** | [**WorkflowDefinitionDto**](WorkflowDefinitionDto.md) |  | [optional] [default to undefined]
**isActive** | **boolean** |  | [optional] [default to undefined]
**schedule** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { UpdateWorkflowDto } from '360solve-api-client';

const instance: UpdateWorkflowDto = {
    name,
    description,
    definition,
    isActive,
    schedule,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
