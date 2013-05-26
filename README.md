scgi-stream
===========

Simple SCGI client.

Overview
--------

scgi-stream lets you talk to scgi-speaking services without having to go through
an intermediate HTTP server.

Installation
------------

Available via [npm](http://npmjs.org/):

> $ npm install scgi-stream

Or via git:

> $ git clone git://github.com/deoxxa/scgi-stream.git node_modules/scgi-stream

API
---

**request**

Makes an SCGI request. Returns an `SCGIResponse` object.

```javascript
scgi.request(options, [data]);
```

```javascript
var scgi = require("scgi-stream");

scgi.request(options);
```

Arguments

* _options_ - an object specifying options for the request and response.
  Available options are `host`, `port`, `path`, `method`, and `headers`. `host`,
  `port`, `path`, and `method` are strings, while `headers` is an object with a
  predictable structure.
* _data_ - the payload of the request. Optional. If not supplied, will be
  replaced with an empty body.

**SCGIRequest**

A readable stream representing a request.

```javascript
new SCGIRequest(options, [data]);
```

```javascript
var req = new scgi.SCGIRequest({
  path: "/",
  headers: {
    "content-type": "text/plain",
  },
}, "hi there");

req.pipe(process.stdout);
```

Arguments

* _options_ - an object specifying options for the request. Available options
  are `path`, `method`, and `headers`.
* _data_ - payload for the request. Optional.

**SCGIResponse**

A duplex stream that parses and represents a response. Emits a `headers` event
when the headers for the stream have been parsed, then passes through all
following data.

```javascript
new SCGIResponse(options);
```

```javascript
var res = new scgi.SCGIResponse();

socket.pipe(res).pipe(process.stdout);

res.on("headers", function(headers) {
  console.log(headers);
});
```

Arguments

* _options_ - an object with the typical `stream.Transform` options such as
  `highWaterMark`, `objectMode`, etc.

Example
-------

Also see [example.js](https://github.com/deoxxa/scgi-stream/blob/master/example.js).

```javascript
var scgi = require("scgi-stream");

var options = {
  host: "127.0.0.1",
  port: 17199,
  path: "/",
};

var res = scgi.request(options, "<methodCall><methodName>system.listMethods</methodName></methodCall>");

res.on("headers", function(headers) {
  console.log(headers);
});

res.pipe(process.stdout);
```

License
-------

3-clause BSD. A copy is included with the source.

Contact
-------

* GitHub ([deoxxa](http://github.com/deoxxa))
* Twitter ([@deoxxa](http://twitter.com/deoxxa))
* ADN ([@deoxxa](https://alpha.app.net/deoxxa))
* Email ([deoxxa@fknsrs.biz](mailto:deoxxa@fknsrs.biz))
