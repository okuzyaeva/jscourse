/*
 * refer to server/server.js file to get more info on how web sockets work
 * 
 */
var connection = {
    socket: null,

    clientReqs: {
        whoIsOnline: 0,
        resend:      1
    },

    serverReqs: {
        online:    0,
        arbitrary: 1
    },

    _send: function (msg) {
        if(!this.socket) { return; }
        this.socket.send(JSON.stringify(msg));
    },

    onMessage: function (msg) {
        var data = undefined;
        try {
            data = JSON.parse(msg.data);
        } catch (e) {
            console.log(e);
            return;
        }

        switch (data.about) {
            case this.serverReqs.online:
                console.log(data.itself);
            break;
            case this.serverReqs.arbitrary:
                alert(data.itself);
            break;
            case 'chat':
                chatPage.onChatReceived(data.itself);
            break;
            case 'handledChatMessage':
                chatPage.onIncomingMessage(data.itself);
            break;
        }
    },

    onClose: function () {
        // make sure socket is cleaned (nullified)
        this.socket = null;
        console.log('connection closed');
    },

    sendTo: function (address, msg) {
        this._send({
            req: this.clientReqs.resend,
            data: {
                address: address,
                msg: msg
            }
        });
    },

    whoIsOnline: function () {
        this._send({
            req: this.clientReqs.whoIsOnline
        });
    },

    sendChatMessage: function (msg) {
        this._send({
            req: 'chatmessage',
            message: msg
        });
    },

    init: function () {
        var self = this;
        /*
         * If you already read the comments in server/server.js file
         * then just use those principles to understand code below.
         * Here we simply create a socket and connect it to the server.
         * Then we describe what to do upon new message and upon disconnect.
         * Note also that API below is different from those used on the server
         * because code below uses native brower API and the server one uses library (node module).
         */
        this.socket = new WebSocket('ws://192.168.254.52:8083');
        this.socket.onopen = function (e) {
            console.log('connection established');
            e.currentTarget.onmessage = self.onMessage.bind(self);
            e.currentTarget.onclose = self.onClose.bind(self);
        };
    }
};