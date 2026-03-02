# GenerateSchemaConfigDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**instanceId** | **string** | Aggregator instance ID (if using existing instance) | [optional] [default to undefined]
**type** | **string** | Type of data source | [default to undefined]
**connectorId** | **string** | Connector ID (for mini-connector sources) | [optional] [default to undefined]
**name** | **string** | Table name, endpoint name, or object name | [default to undefined]
**fields** | [**Array&lt;GenerateSchemaFieldDto&gt;**](GenerateSchemaFieldDto.md) | Fields in the schema | [optional] [default to undefined]
**schema** | **object** | Full schema object (alternative to fields array) | [optional] [default to undefined]
**description** | **string** | Description of the data source for AI context | [optional] [default to undefined]

## Example

```typescript
import { GenerateSchemaConfigDto } from '360solve-api-client';

const instance: GenerateSchemaConfigDto = {
    instanceId,
    type,
    connectorId,
    name,
    fields,
    schema,
    description,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
