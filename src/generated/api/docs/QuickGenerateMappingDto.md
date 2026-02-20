# QuickGenerateMappingDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**sourceInstanceId** | **string** | Source aggregator instance ID | [default to undefined]
**destinationInstanceId** | **string** | Destination aggregator instance ID | [default to undefined]
**sourceName** | **string** | Source table/object name (auto-discovered if not provided) | [optional] [default to undefined]
**destinationName** | **string** | Destination table/object name (auto-discovered if not provided) | [optional] [default to undefined]
**name** | **string** | Mapping name | [optional] [default to undefined]
**description** | **string** | Mapping description | [optional] [default to undefined]
**mappingHint** | **string** | Natural language hint for mapping generation | [optional] [default to undefined]
**saveMapping** | **boolean** | Save mapping after generation | [optional] [default to true]

## Example

```typescript
import { QuickGenerateMappingDto } from '360solve-api-client';

const instance: QuickGenerateMappingDto = {
    sourceInstanceId,
    destinationInstanceId,
    sourceName,
    destinationName,
    name,
    description,
    mappingHint,
    saveMapping,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
