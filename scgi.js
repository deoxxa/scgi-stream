var net = require("net");

var SCGIRequest = require("./lib/request"),
    SCGIResponse = require("./lib/response");

module.exports.SCGIRequest = SCGIRequest;
module.exports.SCGIResponse = SCGIResponse;

var request = function request(options, data) {
  var socket = net.connect(options.port, options.host);

  var req = new SCGIRequest(options, data),
      res = new SCGIResponse(options);

  req.pipe(socket).pipe(res);

  return res;
};

module.exports.request = request;
