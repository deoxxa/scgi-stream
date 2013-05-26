#!/usr/bin/env node

var scgi = require("./scgi");

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
