var router = {
    loader: null,
    main: null,
    header: null,

    initRouter: function () {
        this.loader = document.querySelector('.loader');
        this.main = document.querySelector('.main');
        this.header = document.querySelector('.header');
        /*
         * @desc: to reference the properties of the object from the inside keyword "this" is used.
         *        "this" is a reference to the object relatively which a function was called.
         *        For example calling router.initRouter() will have this = router inside of the
         *        initRouter() function because we called it from router object.
         *        BUT if we call the very same function directly (saving it in variable for example)
         *        "this" will be referencing global object (window).
         */
        Path.map('#/login').to(loginPage.onPageLoad.bind(loginPage)).enter(this.preparePage.bind(this));
        Path.map('#/events').to(eventsPage.onPageLoad.bind(eventsPage)).enter(this.preparePage.bind(this));
        Path.map('#/presentation/:eventid').to(function () {
            presentationPage.onPageLoad(this.params);
        }).enter(this.preparePage.bind(this));
        Path.map('#/chat').to(chatPage.onPageLoad.bind(chatPage)).enter(this.preparePage.bind(this));

        Path.root('#/events');

        Path.listen();
    },

    navigate: function (path) {
        location.hash = '#/' + path;
    },

    preparePage: function () {
        var routeMatch = Path.routes.current.match(/\w+/);
        var rootPath = '';
        var pages = undefined;
        
        if(routeMatch) {
            rootPath = routeMatch[0];
        }

        pages = document.querySelectorAll('.page');

        if(rootPath === 'login') {
            this.header.classList.add('hidden');
            this.main.classList.add('no-content-margin');
        } else {
            this.header.classList.remove('hidden');
            this.main.classList.remove('no-content-margin');
        }

        for(var i = pages.length; --i>=0;) {
            if(pages[i].id === rootPath) {
                pages[i].classList.remove('hidden');
            } else {
                pages[i].classList.add('hidden');
            }
        }

        this.loader.classList.add('hidden');
    }
};