# CreateConnectorDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Name of the connector | [default to undefined]
**type** | **string** | Type of connector (CLOUD or MINI) | [default to undefined]
**networkAccess** | **string** |  | [optional] [default to NetworkAccessEnum_Local]
**supportedAggregators** | **Array&lt;string&gt;** | Supported aggregator types | [optional] [default to undefined]

## Example

```typescript
import { CreateConnectorDto } from '360solve-api-client';

const instance: CreateConnectorDto = {
    name,
    type,
    networkAccess,
    supportedAggregators,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
