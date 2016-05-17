var utils = {
    getCookie: function (name) {
        var c = document.cookie;
        c = c.split(';');
        for(var i = c.length; --i >= 0;) {
            var cookie = c[i].split('=');
            if(cookie[0] === name) {
                return cookie[1];
            }
        }
        
        return '';
    },

    setCookie: function (name, val) {
        document.cookie = name + '=' + val;
    }
};