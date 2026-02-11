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
*AggregatorsApi* | [**aggregatorsControllerFindAll**](docs/AggregatorsApi.md#aggregatorscontrollerfindall) | **GET** /api/aggregators | 
*AggregatorsApi* | [**aggregatorsControllerFindOne**](docs/AggregatorsApi.md#aggregatorscontrollerfindone) | **GET** /api/aggregators/{id} | 
*AuthApi* | [**authControllerRefresh**](docs/AuthApi.md#authcontrollerrefresh) | **POST** /auth/refresh | Refresh access token
*AuthApi* | [**authControllerSignIn**](docs/AuthApi.md#authcontrollersignin) | **POST** /auth/sign-in | Authenticate user
*AuthApi* | [**authControllerSignOut**](docs/AuthApi.md#authcontrollersignout) | **POST** /auth/sign-out | Sign out
*AuthApi* | [**authControllerSignUp**](docs/AuthApi.md#authcontrollersignup) | **POST** /auth/sign-up | Create new tenant and user
*SchemaDiscoveryApi* | [**schemaDiscoveryControllerDiscover**](docs/SchemaDiscoveryApi.md#schemadiscoverycontrollerdiscover) | **POST** /api/tenant-aggregators/{id}/discover | 
*SchemaDiscoveryApi* | [**schemaDiscoveryControllerGetRelationships**](docs/SchemaDiscoveryApi.md#schemadiscoverycontrollergetrelationships) | **GET** /api/tenant-aggregators/{id}/schema/relationships | 
*SchemaDiscoveryApi* | [**schemaDiscoveryControllerGetSchema**](docs/SchemaDiscoveryApi.md#schemadiscoverycontrollergetschema) | **GET** /api/tenant-aggregators/{id}/schema | 
*SchemaDiscoveryApi* | [**schemaDiscoveryControllerGetTable**](docs/SchemaDiscoveryApi.md#schemadiscoverycontrollergettable) | **GET** /api/tenant-aggregators/{id}/schema/tables/{tableName} | 
*SchemaDiscoveryApi* | [**schemaDiscoveryControllerGetTables**](docs/SchemaDiscoveryApi.md#schemadiscoverycontrollergettables) | **GET** /api/tenant-aggregators/{id}/schema/tables | 
*SchemaDiscoveryApi* | [**schemaDiscoveryControllerPreviewTable**](docs/SchemaDiscoveryApi.md#schemadiscoverycontrollerpreviewtable) | **POST** /api/tenant-aggregators/{id}/schema/preview | 
*TenantAggregatorsApi* | [**tenantAggregatorsControllerDelete**](docs/TenantAggregatorsApi.md#tenantaggregatorscontrollerdelete) | **DELETE** /api/tenant-aggregators/{id} | 
*TenantAggregatorsApi* | [**tenantAggregatorsControllerFindAll**](docs/TenantAggregatorsApi.md#tenantaggregatorscontrollerfindall) | **GET** /api/tenant-aggregators | 
*TenantAggregatorsApi* | [**tenantAggregatorsControllerFindOne**](docs/TenantAggregatorsApi.md#tenantaggregatorscontrollerfindone) | **GET** /api/tenant-aggregators/{id} | 
*TenantAggregatorsApi* | [**tenantAggregatorsControllerInstall**](docs/TenantAggregatorsApi.md#tenantaggregatorscontrollerinstall) | **POST** /api/tenant-aggregators/install | 
*TenantAggregatorsApi* | [**tenantAggregatorsControllerSaveCredentials**](docs/TenantAggregatorsApi.md#tenantaggregatorscontrollersavecredentials) | **PUT** /api/tenant-aggregators/{id}/credentials | 
*TenantAggregatorsApi* | [**tenantAggregatorsControllerTestConnection**](docs/TenantAggregatorsApi.md#tenantaggregatorscontrollertestconnection) | **POST** /api/tenant-aggregators/{id}/test | 


### Documentation For Models

 - [InstallTenantAggregatorDto](docs/InstallTenantAggregatorDto.md)
 - [PreviewTableDto](docs/PreviewTableDto.md)
 - [RefreshTokenDto](docs/RefreshTokenDto.md)
 - [SaveTenantAggregatorCredentialsDto](docs/SaveTenantAggregatorCredentialsDto.md)
 - [SchemaDiscoveryResponseDto](docs/SchemaDiscoveryResponseDto.md)
 - [SignInDto](docs/SignInDto.md)
 - [SignUpDto](docs/SignUpDto.md)
 - [TenantAggregatorDetailResponseDto](docs/TenantAggregatorDetailResponseDto.md)
 - [TenantAggregatorListResponseDto](docs/TenantAggregatorListResponseDto.md)
 - [TenantAggregatorResponseDto](docs/TenantAggregatorResponseDto.md)


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

