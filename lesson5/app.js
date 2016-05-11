function bindUIActions () {
    document.querySelector('#send.btn').addEventListener('click', function () {
        var toWhom = document.querySelector('input[placeholder="to whom"]');
        var what = document.querySelector('input[placeholder="what"]');
        connection.sendTo(toWhom.value, what.value);
    });
}

window.onload = function () {
    connection.init();
    bindUIActions();
};