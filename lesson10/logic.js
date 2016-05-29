var obj;

// function User () {
//     this.name = 'u1';
// }

// User.prototype.getName = function () {
//     return this.name;
// };

// function Administrator () {
//     'use strict';

//     User.call(this);
//     this.admin = true;
// }

// Administrator.prototype = Object.create(User.prototype);

class User {
    constructor () {
        this._name = 'u1';
    }

    getName () {
        return this._name;
    }

    get name () {
        return this._name;
    }

    set name (n) {
        this._name = n;
    }
}

class Administrator extends User {
    constructor () {
        super();
        this.admin = true;
        this.arr = [1,2,3,4];
    }

    iterate () {
        for(let i = this.arr.length; --i >= 0;) {
            console.log(this.arr[i]);
        }
        
        console.log('index', i);
    }
}

window.onload = function () {

}