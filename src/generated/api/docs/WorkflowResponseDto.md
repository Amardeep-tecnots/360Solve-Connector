# WorkflowResponseDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [default to undefined]
**tenantId** | **string** |  | [default to undefined]
**version** | **number** |  | [default to undefined]
**hash** | **string** |  | [default to undefined]
**name** | **string** |  | [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**definition** | [**WorkflowDefinitionResponseDto**](WorkflowDefinitionResponseDto.md) |  | [default to undefined]
**status** | **string** |  | [default to undefined]
**isActive** | **boolean** |  | [default to undefined]
**schedule** | **string** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [default to undefined]
**updatedAt** | **string** |  | [default to undefined]
**deprecatedAfter** | **string** |  | [optional] [default to undefined]
**forceCancelAfter** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { WorkflowResponseDto } from '360solve-api-client';

const instance: WorkflowResponseDto = {
    id,
    tenantId,
    version,
    hash,
    name,
    description,
    definition,
    status,
    isActive,
    schedule,
    createdAt,
    updatedAt,
    deprecatedAfter,
    forceCancelAfter,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
