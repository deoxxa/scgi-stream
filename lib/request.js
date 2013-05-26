var stream = require("stream");

var SCGIRequest = module.exports = function SCGIRequest(options, data) {
  stream.Readable.call(this, options);

  var headers = {};

  if (typeof data === "string") {
    data = Buffer(data);
  } else if (!data) {
    data = Buffer(0);
  }

  headers.CONTENT_LENGTH = data.length;
  headers.SCGI = 1;
  headers.REQUEST_METHOD = options.method || "GET";
  headers.REQUEST_URI = options.path;

  if (options.headers) {
    for (var k in options.headers) {
      headers[k.toUpperCase().replace(/-/g, "_")] = options.headers[k];
    }
  }

  var head = [];
  for (var k in headers) {
    head.push(Buffer(k));
    head.push(Buffer([0]));
    head.push(Buffer(headers[k].toString()));
    head.push(Buffer([0]));
  }
  head = Buffer.concat(head);

  this.push(head.length.toString(10));
  this.push(":");
  this.push(head);
  this.push(",");
  this.push(data);
  this.push(null);
};
SCGIRequest.prototype = Object.create(stream.Readable.prototype, {properties: {constructor: SCGIRequest}});

SCGIRequest.prototype._read = function _read(n) {};
