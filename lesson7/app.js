function initAll () {
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
    router.init();
};

window.onload = function () {
    console.log('hello');
    connection.init(function () {
        initAll();
        var login = utils.getCookie('login');
        if(login) {
            connection.sendLookUp(login);
        } else {
            router.init();
        }
    });
};