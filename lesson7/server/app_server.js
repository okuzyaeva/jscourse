var fs = require('fs');
var WebSocketServer = require('ws').Server;

var port = 8083;
var ws_server = undefined;
var db = null;
var clients = [];

function tryReadDb () {
    try {
        db = fs.readFileSync('db.json', 'utf8');
        db = JSON.parse(db);
    } catch (e) {
        console.log(e);
        return false;
    }

    return true;
};

function updateDb () {
    try {
        fs.writeFileSync('db.json', JSON.stringify(db, null, 2), 'utf8');
    } catch (e) {
        return false;
    }

    return true;
};

function checkIfLoggedIn (ws) {
    for(var i = clients.length; --i >= 0;) {
        if(clients[i].socket === ws) {
            var user = null;
            if(clients[i].user) {
                user = db.users[clients[i].user.openData.login];
            } else {
                return false;
            }
            if(user.loggedIn) {
                return true;
            }
        }
    }

    return false;
};

function updateClients (ws, user) {
    for(var i = clients.length; --i >= 0;) {
        if(clients[i].socket === ws) {
            clients[i].user = user;
        }
    }
};

function getInitialDataSetForUser (user) {
    return {
        success: true,
        myOpenData: user.openData,
        system: db.system,
        eventId: user.eventId,
        othersOpenData: getAllUserOpenData(user)
    };
};

function getAllUserOpenData (requestee) {
    var users = db.users;
    var openData = {};
    for(var i  in users) {
        if(requestee === users[i]) { continue; }
        openData[users[i].openData.login] = users[i].openData;
    }
    return openData;
};

function getUserFromConnection (ws) {
    for(var i = clients.length; --i >= 0;) {
        if(clients[i].socket === ws) {
            return clients[i].user;
        }
    }

    return null;
};

function handleIncomingMessage (msg) {
    var msg_obj = JSON.parse(msg);
    console.log('incoming message', msg_obj);
    // if(msg_obj.req !== 'credentials' && msg_obj.req !== 'lookup') {
    //     if(!checkIfLoggedIn(this)) {
    //         send(this, {
    //             about: 'reroute',
    //             itself: 'login'
    //         });
    //         return;
    //     }
    // }

    switch(msg_obj.req) {
        case 'events':
            send(this, {
                about: 'events',
                itself: db.events
            });
        break;
        case 'preserveEventId':
            var user = getUserFromConnection(this);
            user.eventId = msg_obj.eventId;
            updateDb();
        break;
        case 'lookup':
            var user = db.users[msg_obj.login];
            if(user && user.loggedIn) {
                updateClients(this, user);
                send(this, {
                    about: 'lookupResult',
                    itself: getInitialDataSetForUser(user)
                });
            } else {
                send(this, {
                    about: 'lookupResult',
                    itself: {
                        success: false
                    }
                })
            }
        break;
        case 'chat':
            send(this, {
                about: 'chat',
                itself: db.chat[msg_obj.event]
            });
        break;
        case 'chatmessage':
            var chatmsg = msg_obj.message;
            var chat = db.chat[chatmsg.event];
            var lastid = chat[chat.length - 1] ? chat[chat.length - 1].id : 0;
            var finalMessage = {
                id:   lastid,
                time: chatmsg.time,
                from: chatmsg.from,
                text: chatmsg.text
            };
            chat.push(finalMessage);
            updateDb();
            broadcastToEvent(this, {
                about: 'handledChatMessage',
                itself: finalMessage
            }, false, chatmsg.event);
        break;
        case 'presentation':
            var slideNames = db.presentations[msg_obj.id];
            send(this, {
                about: 'presentationData',
                itself: slideNames
            });
        break;
        case 'openDataUpdate':
            db.users[msg_obj.openData.login].openData = msg_obj.openData;
            broadcast(this, {
                about: 'openDataUpdate',
                itself: msg_obj.openData
            });
        break;
        case 'credentials':
            var user = db.users[msg_obj.login];
            if(user) {
                if(user.password === msg_obj.password) {
                    if(!user.loggedIn) {
                        user.loggedIn = true;
                        updateDb();
                    }
                    updateClients(this, user);
                    send(this, {
                        about: 'loginResult',
                        itself: getInitialDataSetForUser(user)
                    });
                } else {
                    send(this, {
                        about: 'loginResult',
                        itself: {
                            success: false
                        }
                    });
                }
            } else {
                send(this, {
                    about: 'loginResult',
                    itself: {
                        success: false
                    }
                });
            }
        break;
        case 'logout':
            var user = db.users[msg_obj.login];
            if(user) {
                user.loggedIn = false;
                updateDb();
            }
        break;
        case 'slide':
            var presentation = db.presentations[msg_obj.eventId];
            presentation.currentSlide = msg_obj.slideNumber;
            broadcastToEvent(this, {
                about: 'slide',
                itself: {
                    eventId: msg_obj.eventId,
                    slideNumber: msg_obj.slideNumber
                }
            }, false, msg_obj.eventId);
            updateDb();
        break;
        default:
            console.log('default case, do nothing. Incoming message request was', msg_obj.req);
        break;
    }
};

function handleClosure () {
    for(var i = clients.length; --i >= 0;) {
        if(clients[i].socket === this) {
            clients.splice(i, 1);
            console.log('connection closed, pool length:', clients.length);
            return;
        }
    }
};

function initWsServer () {
    ws_server = new WebSocketServer({ port: port });
    ws_server.on('connection', function (ws) {
        clients.push({
            socket: ws,
            user: undefined
        });
        console.log('new connection')
        ws.on('message', handleIncomingMessage);
        ws.on('close', handleClosure);
    });
};

function send (ws, msg) {
    if(typeof msg !== 'string') {
        msg = JSON.stringify(msg);
    }
    ws.send(msg);
};

function broadcast (ws, msg, dontSendMyself) {
    for(var i = clients.length; --i >= 0;) {
        if(dontSendMyself && clients[i].socket === ws) { continue; }
        send(clients[i].socket, msg);
    }
};

function broadcastToEvent (ws, msg, dontSendMyself, eventId) {
    console.log('broadcasting to event', eventId);
    for(var i = clients.length; --i >= 0;) {
        if(dontSendMyself && clients[i].socket === ws) { continue; }
        // if(clients[i].user.eventId !== eventId) { continue; }
        send(clients[i].socket, msg);
    }
};

function init () {
    if(!tryReadDb()) {
        return;
    }
    initWsServer();
    return true;
};

if(init()) {
    console.log('listening at:', port);
}
