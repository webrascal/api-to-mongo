# Hoover

This project provides you with a RESTful API that you can quickly POST data to for later retrieval.
This is intended to be used for measuring our SDLC practices and outputs.

### yarn

#### In development

`yarn dev` will kick off a server with an in memory mongo database. Some data will be pre-loaded in the 'test' resource.
It runs with a file watcher which will restart your server when file changes are detected.

#### In production

`yarn start` will kick off a server which requires a connection to a running mongo database, via the MONGO_DB, MONGO_USER
and MONGO_PASSWORD environment values.

### Testing

`yarn test` will execute a bunch of unit tests. If you intend to make changes to the project make sure these pass and that
you've included your new functionality in the test suite.

## POSTing data

You can POST to the running instance of the server anything you like provided:

1. it has a root resource - e.g. `http://localhost:3000/api/YOURROOTRESOURCE`
2. you include a `Content-Type` header with the value of `application/json`
3. the body is a valid JSON structure

#### Examples

```
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"this":"value","anotherValue":23}' \
  http://localhost:3000/api/valuableData
```

```
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"this":"value","anotherValue":{"a":{"bit":{"more":{"complicated":27}}}}}' \
  http://localhost:3000/api/valuableData
```

## GETing data

Any of the data that you've POSTed to the server can be retrieved via a GET request to the same resource.

#### Examples

```
curl --request GET \
  http://localhost:3000/api/valuableData
```

### Filtering data by period

You can request data by time period, by including `from` and `to` as parameters to your request.
They must follow [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format.
There is only some simple validation.

#### Examples

```
curl --request GET \
  http://localhost:3000/api/valuableData?from=2018-06-01&to=2018-06-02
```

```
curl --request GET \
  http://localhost:3000/api/valuableData?from=2018-08-16T15:00:00Z&to=2018-08-16T16:36:00Z
```

### Filtering data by specific value

If you would like to retrieve records that have a specific value in their `data`, you can do so by providing both the `byField` and the `byValue` parameters.
Use dot-notation to specify the field you would like to match on. It will attempt to match your value exactly, without wildcards.

#### Examples

```
curl --request GET \
  http://localhost:3000/api/valuableData?byField=anotherValue&byValue=23
```

```
curl --request GET \
  http://localhost:3000/api/valuableData?byField=anotherValue.a.bit.more.complicated&byValue=27
```

### Applying limits

There is a default limit on your result set of 100. This can be overridden by providing a `limit` parameter query as an integer.

#### Examples

```
curl --request GET \
  http://localhost:3000/api/valuableData?limit=2
```

### Applying an order

The records are ordered by the created date, descending by default. You can specify the order of `ascending` or `descending` in the `order` query parameter.

#### Examples

```
curl --request GET \
  http://localhost:3000/api/valueableData?limit=2&order=ascending
```
