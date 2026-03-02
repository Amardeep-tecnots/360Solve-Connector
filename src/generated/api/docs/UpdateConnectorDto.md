# UpdateConnectorDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | Name of the connector | [optional] [default to undefined]
**type** | **string** | Type of connector (CLOUD or MINI) | [optional] [default to undefined]
**networkAccess** | **string** |  | [optional] [default to NetworkAccessEnum_Local]
**supportedAggregators** | **Array&lt;string&gt;** | Supported aggregator types | [optional] [default to undefined]

## Example

```typescript
import { UpdateConnectorDto } from '360solve-api-client';

const instance: UpdateConnectorDto = {
    name,
    type,
    networkAccess,
    supportedAggregators,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
