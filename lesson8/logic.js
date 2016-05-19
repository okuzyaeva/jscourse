function generateBoxes () {
    var html = '';
    for(var i = 10; --i >= 0;) {
        html += '<div class="box"></div>';
    }
    document.querySelector('body').insertAdjacentHTML('beforeend', html);
}

var dnd = {
    dragging: false,
    dragElement: null,
    offset: {x: 0, y: 0},
    prevMouse: {x: 0, y: 0},
    pushForce: {x: 0, y: 0},
    animationId: null,

    init: function () {
        var boxes = document.querySelectorAll('.box');
        for(var i = boxes.length; --i >= 0;) {
            boxes[i].addEventListener('mousedown', this._onMouseDown.bind(this));
        }
        window.addEventListener('mousemove', this._onMouseMove.bind(this));
        window.addEventListener('mouseup', this._onMouseUp.bind(this));
    },

    _onMouseDown: function (e) {
        this.dragging = true;
        var bcr = e.currentTarget.getBoundingClientRect();
        this.dragElement = e.currentTarget;
        this.offset.x = e.clientX - bcr.left;
        this.offset.y = e.clientY - bcr.top;
        this.prevMouse.x = e.clientX;
        this.prevMouse.y = e.clientY;
    },

    _onMouseMove: function (e) {
        if(!this.dragging) { return; }
        this.pushForce.x = e.clientX - this.prevMouse.x;
        this.pushForce.y = e.clientY - this.prevMouse.y;
        this.prevMouse.x = e.clientX;
        this.prevMouse.y = e.clientY;
        this.dragElement.style.left = (e.clientX - this.offset.x) + 'px';
        this.dragElement.style.top = (e.clientY - this.offset.y) + 'px';
    },

    _onMouseUp: function (e) {
        this.animationId = requestAnimationFrame(this._loop);
        this.dragging = false;
        this.pushForce.x *= 2;
        this.pushForce.y *= 2;
        console.log(this.pushForce);
    },

    _loop: function () {
        if(Math.abs(dnd.pushForce.x) <= .1 && Math.abs(dnd.pushForce.y) <= .1) {
            dnd.dragElement = null;
            return;
        }
        dnd.animationId = requestAnimationFrame(dnd._loop);
        var bcr = dnd.dragElement.getBoundingClientRect();
        var newx = bcr.left + dnd.pushForce.x;
        var newy = bcr.top + dnd.pushForce.y;
        dnd.dragElement.style.left = newx + 'px';
        dnd.dragElement.style.top = newy + 'px';

        dnd.pushForce.x -= dnd.pushForce.x * .1;
        dnd.pushForce.y -= dnd.pushForce.y * .1;
    }
};

window.onload = function () {
    generateBoxes();
    dnd.init();
};

var logging = true;

function log () {
    if(!logging) { return; }
    // console.log.apply(console, arguments);
    console.log(arguments);
}