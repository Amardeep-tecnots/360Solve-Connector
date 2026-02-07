## 360solve-api-client@1.0.0

This generator creates TypeScript/JavaScript client that utilizes [axios](https://github.com/axios/axios). The generated Node module can be used in the following environments:

Environment
* Node.js
* Webpack
* Browserify

Language level
* ES5 - you must have a Promises/A+ library installed
* ES6

Module system
* CommonJS
* ES6 module system

It can be used in both TypeScript and JavaScript. In TypeScript, the definition will be automatically resolved via `package.json`. ([Reference](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html))

### Building

To build and compile the typescript sources to javascript use:
```
npm install
npm run build
```

### Publishing

First build the package then run `npm publish`

### Consuming

navigate to the folder of your consuming project and run one of the following commands.

_published:_

```
npm install 360solve-api-client@1.0.0 --save
```

_unPublished (not recommended):_

```
npm install PATH_TO_GENERATED_PACKAGE --save
```

### Documentation for API Endpoints

All URIs are relative to *http://localhost*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*AuthApi* | [**authControllerRefresh**](docs/AuthApi.md#authcontrollerrefresh) | **POST** /auth/refresh | Refresh access token
*AuthApi* | [**authControllerSignIn**](docs/AuthApi.md#authcontrollersignin) | **POST** /auth/sign-in | Authenticate user
*AuthApi* | [**authControllerSignOut**](docs/AuthApi.md#authcontrollersignout) | **POST** /auth/sign-out | Sign out
*AuthApi* | [**authControllerSignUp**](docs/AuthApi.md#authcontrollersignup) | **POST** /auth/sign-up | Create new tenant and user


### Documentation For Models

 - [RefreshTokenDto](docs/RefreshTokenDto.md)
 - [SignInDto](docs/SignInDto.md)
 - [SignUpDto](docs/SignUpDto.md)


<a id="documentation-for-authorization"></a>
## Documentation For Authorization


Authentication schemes defined for the API:
<a id="bearer"></a>
### bearer

- **Type**: Bearer authentication (JWT)

<a id="tenantId"></a>
### tenantId

- **Type**: API key
- **API key parameter name**: X-Tenant-ID
- **Location**: HTTP header

