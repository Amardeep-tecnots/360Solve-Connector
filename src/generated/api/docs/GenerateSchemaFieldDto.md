# GenerateSchemaFieldDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Field name | [default to undefined]
**type** | **string** | Field data type | [default to undefined]
**nullable** | **boolean** | Whether the field can be null | [optional] [default to undefined]
**sampleValue** | **object** | Sample value for AI context | [optional] [default to undefined]
**description** | **string** | Field description | [optional] [default to undefined]
**nested** | [**Array&lt;GenerateSchemaFieldDto&gt;**](GenerateSchemaFieldDto.md) | Nested fields for object/array types | [optional] [default to undefined]

## Example

```typescript
import { GenerateSchemaFieldDto } from '360solve-api-client';

const instance: GenerateSchemaFieldDto = {
    name,
    type,
    nullable,
    sampleValue,
    description,
    nested,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
