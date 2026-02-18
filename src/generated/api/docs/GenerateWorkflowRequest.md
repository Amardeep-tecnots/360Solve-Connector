# GenerateWorkflowRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**description** | **string** | Natural language description of the workflow to generate | [default to undefined]
**source** | **object** | Source aggregator details | [default to undefined]
**destination** | **object** | Destination aggregator details | [default to undefined]
**mappings** | **Array&lt;string&gt;** | Field mappings between source and destination | [optional] [default to undefined]
**model** | **string** | Custom AI model to use | [optional] [default to undefined]

## Example

```typescript
import { GenerateWorkflowRequest } from '360solve-api-client';

const instance: GenerateWorkflowRequest = {
    description,
    source,
    destination,
    mappings,
    model,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
