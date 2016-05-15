var CustomObject = (function () {
    var DEFAULT_NAME = 'John';

    function privateStaticFunc (addition) {
        return this.age + addition;
    };

    function CustomObject () {
        this.name = DEFAULT_NAME;
        this.age = 0;
    };

    CustomObject.prototype.setAge = function (newAge) {
        this.age = newAge;

    };

    CustomObject.prototype.checkPrivate = function () {
        return privateStaticFunc.call(this, 10);

    };

    return CustomObject;
})();
