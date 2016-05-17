var connection = {
    _listeners: {
        'openDataUpdate': []
    },

    ws: null,

    init: function (cb) {
        this.ws = new WebSocket('ws://192.168.254.77:8083');
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

    getEvents: function () {
        this._send({
            req: 'events'
        });
    },

    getChat: function (eventId) {
        if(eventId === undefined) { return; }
        this._send({
            req: 'chat',
            event: eventId
        })
    },

    requestPresentation: function (id) {
        this._send({
            req: 'presentation',
            id:  id
        });
    },

    sendCredentials: function (login, password) {
        this._send({
            req: 'credentials',
            login: login.toLowerCase(),
            password: password
        });
    },

    sendLookUp: function (login) {
        this._send({
            req: 'lookup',
            login: login
        })
    },

    sendChatMessage: function (msg) {
        this._send({
            req: 'chatmessage',
            message: msg
        });
    },

    preserveOpenedEventId: function (id) {
        this._send({
            req: 'preserveEventId',
            eventId: id
        });
    },

    updateOpenData: function (myOpenData) {
        this._send({
            req: 'openDataUpdate',
            openData: myOpenData
        });
    },

    sendLogout: function (login) {
        this._send({
            req: 'logout',
            login: login
        });
    },

    sendCurrentSlide: function (slideNumber, eventId) {
        this._send({
            req: 'slide',
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
            case 'events':
                eventsPage.onIncomingEvents(data.itself);
            break;
            case 'loginResult':
                loginPage.onLoginResultRecv(data.itself);
            break;
            case 'reroute':
                location.hash = '#/' + data.itself;
            break;
            case 'lookupResult':
                onLookUpResult(data.itself);
            break;
            case 'chat':
                chatPage.onChatReceived(data.itself);
            break;
            case 'handledChatMessage':
                chatPage.onIncomingMessage(data.itself);
            break;
            case 'presentationData':
                presentationPage.onPresentationDataReceived(data.itself);
            break;
            case 'openDataUpdate':
                user.setOpenDataForUser(data.itself);
                this._trigger('openDataUpdate');
            break;
            case 'slide':
                presentationPage.handleRemoteSlide(data.itself);
            break;
        }
    }
};