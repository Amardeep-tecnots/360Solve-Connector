# CreateMappingDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Mapping name | [default to undefined]
**description** | **string** | Mapping description | [optional] [default to undefined]
**type** | **string** | Mapping type | [optional] [default to TypeEnum_Column]
**sourceInstanceId** | **string** | Source aggregator instance ID | [optional] [default to undefined]
**sourceType** | **string** | Source type | [default to undefined]
**sourceConnectorId** | **string** | Source connector ID (for mini-connector sources) | [optional] [default to undefined]
**sourceName** | **string** | Source table, endpoint, or object name | [default to undefined]
**sourceSchema** | **object** | Source schema definition | [default to undefined]
**destinationInstanceId** | **string** | Destination aggregator instance ID | [optional] [default to undefined]
**destinationType** | **string** | Destination type | [default to undefined]
**destinationConnectorId** | **string** | Destination connector ID (for mini-connector destinations) | [optional] [default to undefined]
**destinationName** | **string** | Destination table, endpoint, or object name | [default to undefined]
**destinationSchema** | **object** | Destination schema definition | [default to undefined]
**mappingRules** | [**Array&lt;MappingRuleDto&gt;**](MappingRuleDto.md) | Mapping rules | [default to undefined]
**transformCode** | **string** | Custom transformation code (JavaScript function) | [optional] [default to undefined]
**isActive** | **boolean** | Whether the mapping is active | [optional] [default to true]

## Example

```typescript
import { CreateMappingDto } from '360solve-api-client';

const instance: CreateMappingDto = {
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
