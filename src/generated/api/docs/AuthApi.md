# AuthApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**authControllerRefresh**](#authcontrollerrefresh) | **POST** /auth/refresh | Refresh access token|
|[**authControllerSignIn**](#authcontrollersignin) | **POST** /auth/sign-in | Authenticate user|
|[**authControllerSignOut**](#authcontrollersignout) | **POST** /auth/sign-out | Sign out|
|[**authControllerSignUp**](#authcontrollersignup) | **POST** /auth/sign-up | Create new tenant and user|

# **authControllerRefresh**
> authControllerRefresh(refreshTokenDto)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    RefreshTokenDto
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let refreshTokenDto: RefreshTokenDto; //

const { status, data } = await apiInstance.authControllerRefresh(
    refreshTokenDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **refreshTokenDto** | **RefreshTokenDto**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Tokens refreshed successfully |  -  |
|**401** | Invalid refresh token |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerSignIn**
> authControllerSignIn(signInDto)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    SignInDto
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let signInDto: SignInDto; //

const { status, data } = await apiInstance.authControllerSignIn(
    signInDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **signInDto** | **SignInDto**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Authentication successful |  -  |
|**401** | Invalid credentials |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerSignOut**
> authControllerSignOut()


### Example

```typescript
import {
    AuthApi,
    Configuration
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

const { status, data } = await apiInstance.authControllerSignOut();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | Signed out successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **authControllerSignUp**
> authControllerSignUp(signUpDto)


### Example

```typescript
import {
    AuthApi,
    Configuration,
    SignUpDto
} from '360solve-api-client';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let signUpDto: SignUpDto; //

const { status, data } = await apiInstance.authControllerSignUp(
    signUpDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **signUpDto** | **SignUpDto**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | User and tenant created successfully |  -  |
|**400** | Validation error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

