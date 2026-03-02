# MappingRuleDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**sourceField** | **string** | Source field path (supports nested paths like \&quot;user.address.city\&quot;) | [default to undefined]
**destinationField** | **string** | Destination field path | [default to undefined]
**transform** | **string** | Transformation type: direct, uppercase, lowercase, date-format, number-format, custom | [optional] [default to undefined]
**transformConfig** | **object** | Transformation configuration (e.g., format string for dates) | [optional] [default to undefined]
**nullable** | **boolean** | Whether the source field can be null | [optional] [default to undefined]
**dataType** | **string** | Data type of the field | [optional] [default to undefined]
**defaultValue** | **object** | Default value if source is null | [optional] [default to undefined]

## Example

```typescript
import { MappingRuleDto } from '360solve-api-client';

const instance: MappingRuleDto = {
    sourceField,
    destinationField,
    transform,
    transformConfig,
    nullable,
    dataType,
    defaultValue,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
