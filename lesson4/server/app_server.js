var http = require('http');
var url = require('url');
var port = 8084;

var server = http.createServer(function (req, resp) {
    var parsedReq = url.parse(req.url, true);
    console.log('requrest:', parsedReq, '\n========================');

    /*
     * NOTE the "Access-Control-Allow-Origin" header
     * it's value "*" means that every origin can send a request to this server.
     * For instance you can open a google page, then open a console, compose XMLHttpRequest to
     * your server and send it. Because of this very header the request will be valid and response will
     * reach you anyways.
     * You can start this server in parallel with any other HTTP server that is already running. The main
     * condition is to listen on a free port.
     */
    resp.writeHead(200, {
        'Content-Type': 'text/plain',
        'Cache-control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
    });

    resp.end('I hear you!');
});

server.listen(port, '0.0.0.0');
console.log('listening at', port);