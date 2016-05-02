var router = {
    initRouter: function () {
        Path.map('#/events').to(eventsPage.onPageLoad).enter(this.preparePage);
        Path.map('#/presentations').to(presentationsPage.onPageLoad).enter(this.preparePage);
        Path.map('#/chat').to(chatPage.onPageLoad).enter(this.preparePage);

        Path.listen();
    },

    preparePage: function () {
        var routeMatch = Path.routes.current.match(/\w+/);
        var rootPath = '';
        if(routeMatch) {
            rootPath = routeMatch[0];
        }

        var pages = document.querySelectorAll('.page');

        for(var i = pages.length; --i>=0;) {
            if(pages[i].id === rootPath) {
                pages[i].classList.remove('hidden');
            } else {
                pages[i].classList.add('hidden');
            }
        }
    }
};