/*
 * @desc:   intro to ajax requests
 * @params: params {object} set of parameters to join the query string
 *          e.g. pass {name: 'asdf', company: 'stark industries'}
 *          and function will automatically create a query string: "name=asdf&company=stark%20industries&"
 *          then it will send it to the server.
 *          Refer to the theory list for more details.
 */
function sendAjax (params) {
    var paramsString = '';
    for(var i in params) {
        paramsString += (i + '=' + encodeURIComponent(params[i])) + '&';
    }
    console.log(paramsString);
    var req = new XMLHttpRequest();
    req.open('GET', location.origin + ':8084/?' + paramsString, true);
    req.onload = function () {
        console.log(this.response);
        if(typeof this.response === 'string') {
            document.querySelector('.resp').textContent = this.response;
        }
    };
    req.send();
}