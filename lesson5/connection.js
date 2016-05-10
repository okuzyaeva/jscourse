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
        }
    },

    onClose: function () {
        this.socket = null;
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
        })
    },

    init: function () {
        var self = this;
        this.socket = new WebSocket('ws://192.168.254.30:8083');
        this.socket.onopen = function (e) {
            e.currentTarget.onmessage = self.onMessage.bind(self);
            e.currentTarget.onclose = self.onClose.bind(self);
        };
    },
};