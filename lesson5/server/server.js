/*
 * Each node js application starts with modules that are about to be used.
 * Module is obtained via require function. The only module we use here
 * is "ws" server module (https://github.com/websockets/ws)
 */
var WsServer = require('ws').Server;
var globalConfig = {
    PORT: 8083
};

/*
 * I like to think about describing the way client and server interacts with each other
 * as of protocol description.
 * Below we have objects that contains codes of requests that both client and server can send.
 * Each client that would like to work with our server should implement this protocol and send these
 * very codes to the server.
 * Describing communication using codes is much more flexible and faster than, for example, using strings.
 */

// what client can sand
var clientReqs = {
    whoIsOnline: 0,
    resend:      1
};

// what server can send
var serverReqs = {
    online:    0,
    arbitrary: 1,
    undefinedReq: 2
};

var wsServer = {
    instance: null,

    /*
     * everthing we send to the client is also a JSON
     */
    _send: function (socket, msg) {
        socket.send(JSON.stringify(msg));
    },

    _onMessage: function (socket, msg) {
        console.log(msg);

        // we expect that incoming message weill be a JSON
        // therefore we use try-catch block below.
        // If it turns out it's not a JSON we simply don't do anything.
        var parsed = null;
        try {
            parsed = JSON.parse(msg);
        } catch (e) {
            console.log(e);
            return;
        }

        switch (parsed.req) {
            case clientReqs.whoIsOnline:
                var online = [];
                for(var i = this.instance.clients.length; --i >= 0;) {
                    online.push(this.instance.clients[i].upgradeReq.connection.remoteAddress);
                }
                this._send(socket, {
                    about: serverReqs.online,
                    itself: online
                });
            break;

            case clientReqs.resend:
                console.log('looking up recipient...');
                for(var i = this.instance.clients.length; --i >= 0;) {
                    if(this.instance.clients[i].upgradeReq.connection.remoteAddress === parsed.data.address) {
                        console.log('match found! Sending data')
                        this._send(this.instance.clients[i], {
                            about: serverReqs.arbitrary,
                            itself: parsed.data.msg
                        });
                        return;
                    }
                }
                console.log('nothing found');
            break;

            default:
                this._send(socket, {
                    about: serverReqs.undefinedReq
                });
            break;
        }
    },

    _onClose: function () {
        console.log('connection closed, %s active left', this.instance.clients.length);
    },

    /*
     * In order to use socket server we simply need to instantiate one.
     * Next it is required to specify what it should do upon new connection.
     * Each new connection creates a dedicated socket that is connected with one client.
     * As an analogy, imagine you have a wire that connects your computer and the server.
     * Nobody else can use that wire except you.
     * Both client and server has their own sockets that this wire is connected to.
     * So you send messages back and forth using that wire.
     * Next it is necessary to say what server should do upon receiving new messages from that wire
     * and what to do if it's being unplugged or when socket is being closed.
     */
    init: function () {
        var self = this;
        this.instance = new WsServer({port: globalConfig.PORT});
        this.instance.on('connection', function (socket) {
            console.log('incoming connection');
            socket.on('message', self._onMessage.bind(self, socket));
            socket.on('close', self._onClose.bind(self, socket));
        });
        console.log('server started at', globalConfig.PORT);
    },
};

wsServer.init();