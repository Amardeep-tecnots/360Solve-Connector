# CreateWorkflowDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Workflow name | [default to undefined]
**description** | **string** | Workflow description | [optional] [default to undefined]
**definition** | [**WorkflowDefinitionDto**](WorkflowDefinitionDto.md) | Workflow definition with activities and DAG | [default to undefined]
**isActive** | **boolean** | Activate workflow immediately | [optional] [default to false]
**schedule** | **string** | Cron expression for scheduling | [optional] [default to undefined]

## Example

```typescript
import { CreateWorkflowDto } from '360solve-api-client';

const instance: CreateWorkflowDto = {
    name,
    description,
    definition,
    isActive,
    schedule,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
