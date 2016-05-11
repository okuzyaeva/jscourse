var chatPage = {
    dom: null,
    template: null,
    chatContainer: null,
    messageContainer: null,

    init: function () {
        this.dom = document.querySelector('#chat.page');
        this.chatContainer = this.dom.querySelector('.messages');
        this.messageContainer = this.dom.querySelector('#chat-text');
        this.template = Handlebars.compile(document.querySelector('#chat-message-template').innerHTML);
    },

    _onSendClick: function (e) {
        var text = this.dom.querySelector('#chat-text').value;
        if(!text) { return; }
        connection.sendChatMessage({
            event: user.getCurrentEventId(),
            time: new Date().getTime(),
            from: user.getMyOpenData().login,
            text: text
        });
    },

    _constructTimeString: function (t) {
        var minutes = t.getMinutes().toString();
        minutes = minutes.length === 1 ? ('0' + minutes) : minutes;
        return t.getHours() + ':' + minutes;
    },

    onIncomingMessage: function (message) {
        var time = new Date(parseInt(message.time));
        var msg = {
            my:   message.from === user.getMyOpenData().login,
            time: this._constructTimeString(time),
            from: user.getOpenDataForUser(message.from).name,
            text: message.text,
        };
        this.chatContainer.insertAdjacentHTML('beforeEnd', this.template(msg));
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
        this.messageContainer.value = '';
    },

    onChatReceived: function (messages) {
        if(!messages) { return; }
        var html = '';
        var myOpenData = user.getMyOpenData();
        for(var i = 0; i < messages.length; i++) {
            var time = new Date(parseInt(messages[i].time));
            var msg = {
                my:   messages[i].from === myOpenData.login,
                time: this._constructTimeString(time),
                from: user.getOpenDataForUser(messages[i].from).name,
                text: messages[i].text,
            };
            html += this.template(msg);
        }
        var messagesDOM = this.dom.querySelector('.messages');
        messagesDOM.innerHTML = '';
        messagesDOM.insertAdjacentHTML('afterbegin', html);
    },

    onPageLoad: function () {
        // setHeader('Chat');
        // connection.getChat(user.getCurrentEventId());
        // this.bindUIActions();
    },

    _onOpenDataUpdate: function () {
        connection.getChat(use.getCurrentEventId());
    },

    bindMessageListeners: function () {
        connection.on('openDataUpdate', this._onOpenDataUpdate);
    },

    bindUIActions: function (){
        this.dom.querySelector('.send-chat-btn').addEventListener(defineTouchEvent(), this._onSendClick.bind(this));
    }
};