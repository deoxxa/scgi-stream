var net = require("net"),
    bun = require("bun"),
    url = require("url");

var SCGIRequest = require("./lib/request"),
    SCGIResponse = require("./lib/response");

module.exports.SCGIRequest = SCGIRequest;
module.exports.SCGIResponse = SCGIResponse;

function socket_options(options) {
  var socket_options = {};
  
  if ("fd" in options)
    socket_options.fd = options.fd;

  if ("type" in options)
    socket_options.type = options.type;

  if ("allowHalfOpen" in options)
    socket_options.allowHalfOpen = options.allowHalfOpen;

  if ("port" in options)
    socket_options.port = options.port;

  if ("host" in options)
    socket_options.host = options.host;

  if ("socket" in options)
    socket_options.path = options.socket;

  if (options.url) {
    var parsed = url.parse(options.url);
    
    if (parsed.protocol)
      socket_options.type = parsed.protocol.substr(0, parsed.protocol.length - 1);

    if (parsed.hostname)
      socket_options.host = parsed.hostname;

    if (parsed.protocol && parsed.protocol.toLowerCase() == 'unix:')
      socket_options.path = parsed.path;
    else
      options.path = parsed.path;

    if (parsed.port)
      socket_options.port = parsed.port;

    if (parsed.auth) {
      options.headers = options.headers || {};
      options.headers['Authorization'] = 'Basic ' + new Buffer(parsed.auth).toString('base64');
    }
  }

  return socket_options;
}

var request = function request(options) {
  var socket = new net.createConnection(socket_options(options)),
      req = new SCGIRequest(options),
      res = new SCGIResponse(options);

  req.pipe(socket);

  socket.on("error", function(e) {
    req.emit("error", e);
  });

  req.on("end", function() {
    req.emit("response", res);
    socket.pipe(res);
  });

  return req;
};

var duplex = function duplex(options) {
  var socket = net.createConnection(socket_options(options)),
      req = new SCGIRequest(options),
      res = new SCGIResponse(options);

  var s = bun([req, socket, res]);

  socket.on("error", function(e) {
    s.emit("error", e);
  });

  res.on("headers", function(headers) {
    s.emit("headers", headers);
  });

  return s;
};

module.exports.request = request;
module.exports.duplex = duplex;
