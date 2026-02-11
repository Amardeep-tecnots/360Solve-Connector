# WorkflowValidationDataDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**valid** | **boolean** |  | [default to undefined]
**errors** | [**Array&lt;ValidationErrorDto&gt;**](ValidationErrorDto.md) |  | [default to undefined]
**warnings** | **Array&lt;string&gt;** |  | [default to undefined]
**activitiesChecked** | **number** |  | [default to undefined]
**aggregatorsVerified** | **Array&lt;string&gt;** |  | [default to undefined]

## Example

```typescript
import { WorkflowValidationDataDto } from '360solve-api-client';

const instance: WorkflowValidationDataDto = {
    valid,
    errors,
    warnings,
    activitiesChecked,
    aggregatorsVerified,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
