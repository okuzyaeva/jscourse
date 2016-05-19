var connection = {

    serverReqs: {
        events:             0,
        loginResult:        1,
        reroute:            2,
        lookupResult:       3,
        chat:               4,
        handledChatMessage: 5,
        presentationData:   6,
        openDataUpdate:     7,
        slide:              8
    },

    clientReqs: {
        events:         0,
        chat:           1,
        presentation:   2,
        credentials:    3,
        lookup:         4,
        chatmessage:    5,
        markMyEvent:    6,
        openDataUpdate: 7,
        logout:         8,
        slide:          9
    },

    _listeners: {
        'openDataUpdate': []
    },

    ws: null,

    init: function (cb) {
        this.ws = new WebSocket('ws://' + location.host + ':8083');
        this.ws.onopen = function () {
            connection.ws.onmessage = function (msg) {
                connection.handleIncomingMsg(msg);
            };
            if(typeof cb === 'function') {
                cb();
            }
        };
    },

    _trigger: function (event, data) {
        if(this._listeners[event] === undefined) { return; }
        for(var i = this._listeners.length; --i >= 0;) {
            this._listeners[i](data);
        }
    },

    on: function (event, handler) {
        if(this._listeners[event] === undefined) { return; }
        if(typeof handler !== 'function') { return; }
        this._listeners[event].push(handler);
    },

    off: function (event, handler) {
        for(var i = this._listeners[event].length; --i >= 0;) {
            if(this._listeners[event] === handler) {
                this._listeners.splice(i, 1);
                return;
            }
        }
    },

    _send: function (data) {
        this.ws.send(JSON.stringify(data));
    },

    requestEvents: function () {
        this._send({
            req: this.clientReqs.events
        });
    },

    requestChat: function (eventId) {
        if(eventId === undefined) { return; }
        this._send({
            req: this.clientReqs.chat,
            event: eventId
        })
    },

    requestPresentation: function (id) {
        this._send({
            req: this.clientReqs.presentation,
            id:  id
        });
    },

    sendCredentials: function (login, password) {
        this._send({
            req: this.clientReqs.credentials,
            login: login.toLowerCase(),
            password: password
        });
    },

    sendLookUp: function (login) {
        this._send({
            req: this.clientReqs.lookup,
            login: login
        })
    },

    sendChatMessage: function (msg) {
        this._send({
            req: this.clientReqs.chatmessage,
            message: msg
        });
    },

    markMyEvent: function (id) {
        this._send({
            req: this.clientReqs.markMyEvent,
            eventId: id
        });
    },

    updateOpenData: function (myOpenData) {
        this._send({
            req: this.clientReqs.openDataUpdate,
            openData: myOpenData
        });
    },

    sendLogout: function (login) {
        this._send({
            req: this.clientReqs.logout,
            login: login
        });
    },

    sendCurrentSlide: function (slideNumber, eventId) {
        this._send({
            req: this.clientReqs.slide,
            eventId: eventId,
            slideNumber: slideNumber
        });
    },

    handleIncomingMsg: function (msg) {
        if(!msg.data) { return; }
        console.log(msg);
        var data = null;
        try {
            data = JSON.parse(msg.data);
        } catch (e) {
            console.error(e);
            return;
        }
        switch(data.about) {
            case this.serverReqs.events:
                eventsPage.onIncomingEvents(data.itself);
            break;
            case this.serverReqs.loginResult:
                loginPage.onLoginResultRecv(data.itself);
            break;
            case this.serverReqs.reroute:
                location.hash = '#/' + data.itself;
            break;
            case this.serverReqs.lookupResult:
                onLookUpResult(data.itself);
            break;
            case this.serverReqs.chat:
                chatPage.onChatReceived(data.itself);
            break;
            case this.serverReqs.handledChatMessage:
                chatPage.onIncomingMessage(data.itself);
            break;
            case this.serverReqs.presentationData:
                presentationPage.onPresentationDataReceived(data.itself);
            break;
            case this.serverReqs.openDataUpdate:
                user.setOpenDataForUser(data.itself);
                this._trigger('openDataUpdate');
            break;
            case this.serverReqs.slide:
                presentationPage.handleRemoteSlide(data.itself);
            break;
        }
    }
};