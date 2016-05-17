var loginPage = {
    dom: null,
    loginField: null,
    passwordField: null,
    actionsBinded: false,

    init: function () {
        this.dom = document.querySelector('#login.page');
        this.loginField = this.dom.querySelector('#login-field');
        this.passwordField = this.dom.querySelector('#password-field');
    },

    onPageLoad: function () {
        if(user.getLoggedInStatus()) {
            connection.sendLogout(user.getMyOpenData().login);
        }
        if(!this.actionsBinded) {
            this.bindUIActions();
            this.actionsBinded = true;
        }
    },

    _onLoginClick: function () {
        var login = this.loginField.value;
        var password = this.passwordField.value;
        //perform some validation if needed
        connection.sendCredentials(login, password);
    },

    onLoginResultRecv: function (result) {
        console.log('login result', result);
        if(result.success) {
            this.loginField.value = '';
            this.passwordField.value = '';
            this.loginField.classList.remove('failed');
            this.passwordField.classList.remove('failed');
            user.applyVitalData(result);
            utils.setCookie('login', result.myOpenData.login);
            router.navigate('events');
        } else {
            this.loginField.classList.add('failed');
            this.passwordField.classList.add('failed');
            utils.setCookie('login', '');
        }
    },

    _onFieldInput: function () {
        this.loginField.classList.remove('failed');
        this.passwordField.classList.remove('failed');
    },

    bindUIActions: function () {
        this.dom.querySelector('.login-btn').addEventListener(defineTouchEvent(), this._onLoginClick.bind(this));
        this.loginField.addEventListener('input', this._onFieldInput.bind(this));
        this.passwordField.addEventListener('input', this._onFieldInput.bind(this));
        this.dom.querySelector('.testing').addEventListener(defineTouchEvent(), function () {
            sendAjax();
        });
    }
};