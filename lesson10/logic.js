// five primitives
var n = 5;
var str = 'str';
var b = true;
var obj = null;
var idontknow = undefined;
// variables above passed to functions by value (copied) not by reference
// they also immutable which means when you type n = 10 a new memory is allocated
// and old value (5) is thrown away.

// number string and boolean have so called "object wrappers" which means
// they wrap around a primitive and provide various methods.
n = new Number(5); // contains primitive 5 and functions like .toFixed()
// without new keyword they can be used as type converters e.g:
n = Number(''); // n = 0;
// you can read in depth about Primitives here https://developer.mozilla.org/ru/docs/Glossary/Primitive

// null vs undefined
obj = null; // is variable who's value is set to a null (object)
idontknow = undefined; // is a variable who's value is not defined

// typeof, instanceof
typeof obj;       // object
typeof idontknow; // undefined
n = new Number();
n instanceof Number; // true
// in other words typeof is for evaluating type of variable
// instanceof for ensuring if variable has specific dataType in it's prototype chain

typeof NaN; // returns 'number' :)
n / 0; // returns Infinity

// Arithmetics of strings
'asdf' + 10; // '1010'
'asdf' - 10; // NaN
'10' - 10;   // 0
'80' < 9;    // false

// arrays
var arr = [];        // array is defined like this
arr = new Array();   // or like this
arr = new Array(10); // creates array with 10 undefined cells;

arr.push(1);  // adds 1 to tail
arr.pop();    // extracts tail value
arr[10] = 11; // sets 10th element to 11

// iterate arrays like this:
arr.forEach(function (item, index) { /* do something */ });
for(var i in arr) { /* do something */ };
for(var i = arr.length; --i >= 0;) { /* do something */ }; // handy if you want remove i element

arr.splice(3, 1); // removes 1 element at index 3;
arr.shift();      // extracts element from beginning;
arr.unshift(3);   // inserts 3 in the beginning of array;
// in depth: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/array

// object literal
obj = {};
obj.a = 10; // it's possible to add fields on the fly
// for tricky stuff:
Object.defineProperty(obj, 'propertyname', {
    writable: false,
    value: 'hey this is not writable!'
});
// by accessing obj.propertyNameGetter we'll receive value above
Object.defineProperty(obj, 'propertyNameGetter', {
    get: function () {
        return this.propertyname;
    }
});
// more about defineProperty and defineProperties syntax here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty

// iterate objects like this:
for(var i in obj) {
    /* where i is the property name, access like array obj[i] */
}
// note that iterator above also will access the whole prototype chain
// prototype of the object can be set like this:
obj.__proto__ = {b: 7};

// to check if object itself has a property or it's actually on the prototype use:
obj.hasOwnProperty('b');

// inheritance ES5 way -----------------------------------
// step 1: define User (parent) constructor function

function User () {
    this.name = 'u1';
}

// step 2: extend it's prototype with required functions

User.prototype.getName = function () {
    return this.name;
};

// step 3: define descendant constructor function

function Administrator () {
    'use strict';

    User.call(this); // call parent function to create parent's properties
    this.admin = true;
}

// step 4: set descendant's prototype to be object whos prototype is the prototype
//         of User. This will allow for prototype chain to appear.
Administrator.prototype = Object.create(User.prototype);

// step 5: set prototype's constructor field to appropriate function constructor.
//         have no idea what it affects, but it's important to preserver consistensy.
//         In other words by referencing .constructor field of the instance I want
//         to get its constructor function, not its parent's.
Administrator.prototype.constructor = Administrator;

// inheritance ES6 way -----------------------------------

class User_1 {
    // constructor acts just like ES5 constructor function
    constructor () {
        this._name = 'u1';
    }

    // all functions below defined on a prototype of User_1
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

// extends allows to create prototypal inheritance
class Administrator_1 extends User_1 {
    constructor () {
        super(); // invokes User_1 constructor
        this.admin = true;
        this.arr = [1,2,3,4];
    }

    iterate () {
        for(let i = this.arr.length; --i >= 0;) {
            console.log(this.arr[i]);
        }
        
        console.log('index', i);
    }

    set name (n) {
        // it's also possible to overload parent's functions
        super.name = name; // use super to reference original functions
        console.log('new administrator name is', this._name);
    }
}

// more ES6 features are here: https://github.com/lukehoban/es6features
