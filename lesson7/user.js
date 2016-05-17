var user = {
    _myOpenData: null,
    _currentEvent: null,
    _systemSettings: null,
    _usersOpenData: null,
    _loggedIn: false,

    setMyOpenData: function (settings) {
        this._myOpenData = settings;
    },

    getMyOpenData: function () {
        return this._myOpenData;
    },

    getSystemSettings: function () {
        return this._systemSettings;
    },

    setSystemSettings: function (settings) {
        this._systemSettings = settings;
    },

    setCurrentEventId: function (eventId) {
        this._currentEvent = eventId;
    },

    getCurrentEventId: function () {
        return this._currentEvent;
    },

    setUsersOpenData: function (od) {
        this._usersOpenData = od;
    },

    getUsersOpenData: function () {
        return this._usersOpenData;
    },

    getOpenDataForUser: function (login) {
        if(login === this._myOpenData.login) {
            return this._myOpenData;
        }
        return this._usersOpenData[login];
    },

    setOpenDataForUser: function (openData) {
        if(openData.login === this._myOpenData.login) {
            this._myOpenData = openData;
            return;
        }
        this._usersOpenData[openData.login] = openData;
    },

    setLoggedInStatus: function (status) {
        this._loggedIn = status || false;
    },

    getLoggedInStatus: function () {
        return this._loggedIn;
    },

    applyVitalData: function (vitalData) {
        this.setLoggedInStatus(vitalData.success);
        this.setMyOpenData(vitalData.myOpenData);
        this.setSystemSettings(vitalData.system);
        this.setCurrentEventId(vitalData.eventId);
        this.setUsersOpenData(vitalData.othersOpenData);
    }
};