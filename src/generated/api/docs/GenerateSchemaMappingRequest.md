# GenerateSchemaMappingRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**sourceSchema** | [**TableSchemaDto**](TableSchemaDto.md) | Source schema | [default to undefined]
**destinationSchema** | [**TableSchemaDto**](TableSchemaDto.md) | Destination schema | [default to undefined]
**description** | **string** | Optional description of transformation | [optional] [default to undefined]
**model** | **string** | Custom model to use | [optional] [default to undefined]

## Example

```typescript
import { GenerateSchemaMappingRequest } from '360solve-api-client';

const instance: GenerateSchemaMappingRequest = {
    sourceSchema,
    destinationSchema,
    description,
    model,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
