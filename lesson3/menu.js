var menu = {
    mainContent: null,

    init: function () {
        this.mainContent = document.querySelector('.main');
        this.bindUIActions();
    },

    _onMenuBtnClick: function (e) {
        this.mainContent.classList.toggle('opened');
    },

    _onMenuItemClick: function (e) {
        console.log(e.currentTarget);
        var path = e.currentTarget.dataset.path;
        this._onMenuBtnClick();
        router.navigate(path);
    },

    bindUIActions: function () {
        var menuBtn = document.querySelector('.menu-btn');
        var menuItems = document.querySelectorAll('.menu-item');
        menuBtn.addEventListener('click', this._onMenuBtnClick.bind(this));
        for(var i = menuItems.length; --i >= 0;) {
            menuItems[i].addEventListener('click', this._onMenuItemClick.bind(this));
        }
    }
};