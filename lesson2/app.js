function preparePage () {
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

function initRouter () {
    Path.map('#/events').to(eventsPage.onPageLoad).enter(preparePage);
    Path.map('#/presentations').to(presentationsPage.onPageLoad).enter(preparePage);
    Path.map('#/chat').to(chatPage.onPageLoad).enter(preparePage);

    Path.listen();
}

window.onload = function () {
    console.log('h')
    initRouter();
}