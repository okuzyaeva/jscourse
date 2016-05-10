var WsServer = require('ws').Server;
var globalConfig = {
    PORT: 8083
};

var clientReqs = {
    whoIsOnline: 0,
    resend:      1
};

var serverReqs = {
    online:    0,
    arbitrary: 1
};

var wsServer = {
    instance: null,

    _send: function (socket, msg) {
        socket.send(JSON.stringify(msg));
    },

    _onMessage: function (socket, msg) {
        console.log(msg);
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
                })
            break;
            case clientReqs.resend:
                for(var i = this.instance.clients.length; --i >= 0;) {
                    if(this.instance.clients[i].upgradeReq.connection.remoteAddress === parsed.data.address) {
                        this._send(this.instance.clients[i], {
                            about: serverReqs.arbitrary,
                            itself: parsed.data.msg
                        });
                    }
                    return;
                }
            break;
            default:

            break;
        }
    },

    _onClose: function () {
        console.log('connection closed', this.instance.clients.length);
    },

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