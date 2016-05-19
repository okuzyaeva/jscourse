function initAll () {
    system.init();
    loginPage.init();
    eventsPage.init();
    chatPage.init();
    presentationPage.init();
    // settingsPage.init();
    menu.init();
    window.addEventListener('resize', resizeHandler);
};

function resizeHandler () {
    presentationPage.resizeHandler();
};

function onLookUpResult (result) {
    if(result.success) {
        user.applyVitalData(result);
    }
    router.initRouter();
};

window.onload = function () {
    console.log('hello');
    connection.init(function () {
        initAll();
        console.log('all inited')
        var login = utils.getCookie('login');
        if(login) {
            connection.sendLookUp(login);
        } else {
            router.initRouter();
        }
    });
};