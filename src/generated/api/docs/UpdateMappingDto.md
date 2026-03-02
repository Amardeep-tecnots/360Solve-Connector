# UpdateMappingDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Mapping name | [optional] [default to undefined]
**description** | **string** | Mapping description | [optional] [default to undefined]
**type** | **string** | Mapping type | [optional] [default to undefined]
**sourceInstanceId** | **string** | Source aggregator instance ID | [optional] [default to undefined]
**sourceType** | **string** | Source type | [optional] [default to undefined]
**sourceConnectorId** | **string** | Source connector ID | [optional] [default to undefined]
**sourceName** | **string** | Source name | [optional] [default to undefined]
**sourceSchema** | **object** | Source schema | [optional] [default to undefined]
**destinationInstanceId** | **string** | Destination aggregator instance ID | [optional] [default to undefined]
**destinationType** | **string** | Destination type | [optional] [default to undefined]
**destinationConnectorId** | **string** | Destination connector ID | [optional] [default to undefined]
**destinationName** | **string** | Destination name | [optional] [default to undefined]
**destinationSchema** | **object** | Destination schema | [optional] [default to undefined]
**mappingRules** | [**Array&lt;MappingRuleDto&gt;**](MappingRuleDto.md) | Mapping rules | [optional] [default to undefined]
**transformCode** | **string** | Transformation code | [optional] [default to undefined]
**isActive** | **boolean** | Whether the mapping is active | [optional] [default to undefined]

## Example

```typescript
import { UpdateMappingDto } from '360solve-api-client';

const instance: UpdateMappingDto = {
    name,
    description,
    type,
    sourceInstanceId,
    sourceType,
    sourceConnectorId,
    sourceName,
    sourceSchema,
    destinationInstanceId,
    destinationType,
    destinationConnectorId,
    destinationName,
    destinationSchema,
    mappingRules,
    transformCode,
    isActive,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
