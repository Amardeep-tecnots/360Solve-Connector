# HeartbeatDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**version** | **string** | Connector version | [default to undefined]
**cpuUsage** | **number** | CPU usage percentage (0-100) | [optional] [default to undefined]
**memoryUsage** | **number** | Memory usage in MB | [optional] [default to undefined]
**maxConcurrentJobs** | **number** | Job capacity | [optional] [default to undefined]
**os** | **string** | OS Information | [optional] [default to undefined]
**ipAddress** | **string** | IP Address | [optional] [default to undefined]
**hostname** | **string** | Hostname | [optional] [default to undefined]

## Example

```typescript
import { HeartbeatDto } from '360solve-api-client';

const instance: HeartbeatDto = {
    version,
    cpuUsage,
    memoryUsage,
    maxConcurrentJobs,
    os,
    ipAddress,
    hostname,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
