var menu = {
    mainDOM: null,

    init: function () {
        this.mainDOM = document.querySelector('.main');
        this.bindUIActions();
    },

    _onMenuClick: function () {
        this.mainDOM.classList.toggle('opened');
    },

    bindUIActions: function () {
        var menuBtn = document.querySelector('.menu-btn');
        menuBtn.addEventListener('click', this._onMenuClick.bind(this));
    }
};