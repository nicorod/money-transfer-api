<p style="text-align: center" align="center">
  <a href="https://tsed.io" target="_blank"><img src="https://tsed.io/tsed-og.png" width="200" alt="Ts.ED logo"/></a>
</p>

<div align="center">
  <h1>Ts.ED - money-transfer-api</h1>
  <br />
  <div align="center">
    <a href="https://cli.tsed.io/">Website</a>
    <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
    <a href="https://cli.tsed.io/getting-started.html">Getting started</a>
    <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
    <a href="https://api.tsed.io/rest/slack/tsedio/tsed">Slack</a>
    <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
    <a href="https://twitter.com/TsED_io">Twitter</a>
  </div>
  <hr />
</div>

> An awesome project based on Ts.ED framework

## Getting started

> **Important!** Ts.ED requires Node >= 14, Express >= 4 and TypeScript >= 4.



```batch

This API uses a local Postgresql database, for simplifications in implementation AUTHENTICATION IS IMPLEMENTED IN CODE, BUT NOT ASKED IN ENDPOINTS (code commented) also connection string must use default user and database.
This connection string is changed in .env file.
Example with default user nicolasrodriguez
DATABASE_URL="postgresql://nicolasrodriguez:123456789@localhost:5432/nicolasrodriguez?schema=public"

# install dependencies
$ yarn install

# install migrations
$ yarn run prisma:migrate 

# serve
$ yarn start

# build for production
$ yarn build
$ yarn start:prod
```
## Swagger

```
# serve
$ yarn start

# swagger doc
http://localhost:8083/doc
```

## Docker

```
# build docker image
docker compose build

# start docker image
docker compose up
```

## Barrelsby

This project uses [barrelsby](https://www.npmjs.com/package/barrelsby) to generate index files to import the controllers.

Edit `.barreslby.json` to customize it:

```json
{
  "directory": [
    "./src/controllers/rest",
    "./src/controllers/pages"
  ],
  "exclude": [
    "__mock__",
    "__mocks__",
    ".spec.ts"
  ],
  "delete": true
}
```
## Use Cases

Users: 

```json
{
  "id": 1,
  "name": "test user 1",
  "role": "USER",
  "email": "email@test.com",
  "password": "123456"
}
```

```json
{
  "id": 2,
  "name": "test admin 1",
  "role": "ADMIN",
  "email": "email@test.com",
  "password": "123456"
}
```

Accounts:
```json
{
  "id": 1,
  "accountType": "SAVINGS",
  "balance": 100,
  "userId": 1
}
```
```json
{
  "id": 2,
  "accountType": "CURRENT",
  "balance": 1000,
  "userId": 2
}
```
```json
{
  "id": 3,
  "accountType": "BASIC_SAVINGS",
  "balance": 1000,
  "userId": 2
}
```

Transactions:
```json
{
  "id": 1,
  "fromAccountId": 1,
  "toAccountId": 2,
  "amount": 10
}
```
```json
{
  "id": 2,
  "fromAccountId": 2,
  "toAccountId": 1,
  "amount": 10
}
```

