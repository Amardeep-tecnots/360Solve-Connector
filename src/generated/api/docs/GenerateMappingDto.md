# GenerateMappingDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Name for the generated mapping | [optional] [default to undefined]
**description** | **string** | Description for the generated mapping | [optional] [default to undefined]
**source** | [**GenerateSchemaConfigDto**](GenerateSchemaConfigDto.md) | Source schema configuration | [default to undefined]
**destination** | [**GenerateSchemaConfigDto**](GenerateSchemaConfigDto.md) | Destination schema configuration | [default to undefined]
**mappingHint** | **string** | Natural language description of the desired mapping | [optional] [default to undefined]
**model** | **string** | Custom AI model to use | [optional] [default to undefined]
**saveMapping** | **boolean** | Save the generated mapping automatically | [optional] [default to false]

## Example

```typescript
import { GenerateMappingDto } from '360solve-api-client';

const instance: GenerateMappingDto = {
    name,
    description,
    source,
    destination,
    mappingHint,
    model,
    saveMapping,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
