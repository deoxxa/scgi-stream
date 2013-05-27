var net = require("net"),
    bun = require("bun");

var SCGIRequest = require("./lib/request"),
    SCGIResponse = require("./lib/response");

module.exports.SCGIRequest = SCGIRequest;
module.exports.SCGIResponse = SCGIResponse;

var request = function request(options) {
  var socket = net.connect(options.port, options.host),
      req = new SCGIRequest(options),
      res = new SCGIResponse(options);

  req.pipe(socket);

  req.on("end", function() {
    req.emit("response", res);
    socket.pipe(res);
  });

  return req;
};

var duplex = function duplex(options) {
  var socket = net.connect(options.port, options.host),
      req = new SCGIRequest(options),
      res = new SCGIResponse(options);

  var s = bun([req, socket, res]);

  res.on("headers", function(headers) {
    s.emit("headers", headers);
  });

  return s;
};

module.exports.request = request;
module.exports.duplex = duplex;
