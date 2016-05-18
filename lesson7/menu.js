var menu = {
    mainDOM: null,

    init: function () {
        this.mainDOM = document.querySelector('.main');
        this.bindUIActions();
    },

    _onMenuClick: function () {
        this.mainDOM.classList.toggle('opened');
    },

    _onMenuItemClick: function (e) {
        var path = e.currentTarget.dataset.path;
        if(path === 'presentation') {
            path += '/' + user.getCurrentEventId();
        }
        router.navigate(path);
        this.closeMenu();
    },

    closeMenu: function () {
        this.mainDOM.classList.remove('opened');
    },

    bindUIActions: function () {
        var menuBtn = document.querySelector('.menu-btn');
        var menuItems = document.querySelectorAll('.menu-item');
        /*
         * @desc: NOTE the .bind method of the function.
         *        First thing you should think of is how come the function has it's own method?
         *        Mtehod .bind() is used to anchor function to the specified context.
         *        Here if we pass "this._onMenuClick" as a second parameter of addEventListener we'll effectively
         *        pass the body of the function. Therefore it will be called from the perspective
         *        of the element which caused the event (menu button in this case).
         *        But because we want to reference menu object from inside of the _onMenuClick()
         *        we're binding it to the menu explicitly. Method .bind() will return us a function
         *        which upon invocation will also call _onMenuClick() with "this" set to "menu".
         */
        menuBtn.addEventListener(system.touchEvent, this._onMenuClick.bind(this));
        for(var i = menuItems.length; --i >= 0;) {
            menuItems[i].addEventListener(system.touchEvent, this._onMenuItemClick.bind(this));
        }
    }
};