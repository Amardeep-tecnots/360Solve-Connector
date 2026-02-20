# ValidateMappingDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**mappingId** | **string** | Mapping ID to validate (if updating existing) | [optional] [default to undefined]
**sourceSchema** | **object** | Source schema to validate against | [optional] [default to undefined]
**destinationSchema** | **object** | Destination schema to validate against | [optional] [default to undefined]
**mappingRules** | **Array&lt;object&gt;** | Mapping rules to validate | [optional] [default to undefined]
**sampleData** | **object** | Sample data to test mapping | [optional] [default to undefined]

## Example

```typescript
import { ValidateMappingDto } from '360solve-api-client';

const instance: ValidateMappingDto = {
    mappingId,
    sourceSchema,
    destinationSchema,
    mappingRules,
    sampleData,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
