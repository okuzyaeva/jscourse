var world = {
    cnv: null,
    ctx: null,

    particleEmitter: null,

    init: function () {
        this.cnv = document.querySelector('canvas');
        this.ctx = this.cnv.getContext('2d');

        this.cnv.width = 800;
        this.cnv.height = 600;

        this.ctx.fillStyle = '#0011ff';

        this.particleEmitter = new ParticleEmitter();
        this.particleEmitter.x = 100;
        this.particleEmitter.y = 100;

        this.bindUIActions();
    },

    clearCanvas: function () {
        this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);
    },

    _onMouseMove: function (e) {
        this.particleEmitter.x = e.clientX;
        this.particleEmitter.y = e.clientY;
    },

    bindUIActions: function () {
        this.cnv.addEventListener('mousemove', this._onMouseMove.bind(this));
    },
};

function Particle () {
    this.x = 0;
    this.y = 0;
    this.r = 10;
    this.vx = 0;
    this.vy = 0;
    this.lifeTime = 0;
    this.inUse = false;
};

Particle.prototype.update = function () {
    this.x += this.vx * game.dt;
    this.y += this.vy * game.dt;

    this.lifeTime -= game.dt;
};

Particle.prototype.render = function (ctx) {
    ctx.moveTo(this.x - this.r, this.y);
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
};


function ParticleEmitter () {
    this.spawnedParticles = [];

    this.spawnTime = 0;

    this._spawnInterval = .016;
    this._lifeTime = 1;
    this.maxvx = 100;
    this.minvx = -100;
    this.pr = 10;

    this.particlesPerTime = 5;

    this.particlesPool = [];

    this.x = 0;
    this.y = 0;

    this.fillPool(1000);
};

ParticleEmitter.prototype.fillPool = function (n) {
    for(var i = n; --i >= 0;) {
        var p = new Particle();
        this.particlesPool.push(p);
    }
};

ParticleEmitter.prototype.update = function () {
    for(var i = this.spawnedParticles.length; --i >= 0;) {
        if(this.spawnedParticles[i] === undefined) { continue; }
        if(this.spawnedParticles[i].lifeTime <= 0) {
            this.particlesPool[i].inUse = false;
            this.spawnedParticles[i] = undefined;

            // this.spawnedParticles.splice(i, 1);
        } else {
            this.spawnedParticles[i].r = (this.spawnedParticles[i].lifeTime/this._lifeTime) * this.pr;
            this.spawnedParticles[i].update();
        }
    }

    if(this.spawnTime <= 0) {
        this.spawnParticle(this.particlesPerTime);
        this.spawnTime = this._spawnInterval;
    } else {
        this.spawnTime -= game.dt;
    }
};

ParticleEmitter.prototype.render = function () {
    world.ctx.beginPath();
    for(var i = this.spawnedParticles.length; --i >= 0;) {
        if(this.spawnedParticles[i] === undefined) { continue; }
        this.spawnedParticles[i].render(world.ctx);
    }
    world.ctx.fill();
};

ParticleEmitter.prototype.spawnParticle = function (n) {
    var p = undefined;

    for(var i = this.particlesPool.length; n > 0 && --i >= 0;) {
        if(!this.particlesPool[i].inUse) {
            p = this.particlesPool[i];
            p.vx = Math.random() * (this.maxvx - this.minvx) + this.minvx;
            p.vy = Math.random() * (this.maxvx - this.minvx) + this.minvx;;
            p.x = this.x;
            p.y = this.y;
            p.lifeTime = this._lifeTime;
            p.inUse = true;
            this.spawnedParticles[i] = p;
            n--;
        }
    }


    // for(var i = n; --i >= 0;) {
    //     p = new Particle();
    //     p.vx = Math.random() * (this.maxvx - this.minvx) + this.minvx;
    //     p.vy = Math.random() * (this.maxvx - this.minvx) + this.minvx;;
    //     p.x = this.x;
    //     p.y = this.y;
    //     p.lifeTime = this._lifeTime;
    //     this.spawnedParticles.push(p);
    // }
};

var game = (function () {

    function Game () {
        this.lastTime = 0;
        this.dt = 0;
        this.loopWrapper = this.loop.bind(this);
    };

    Game.prototype.update = function () {
        world.particleEmitter.update();
    };

    Game.prototype.render = function () {
        world.clearCanvas();
        world.particleEmitter.render();
        
    };

    Game.prototype.start = function () {
        requestAnimationFrame(this.loopWrapper);
        this.lastTime = new Date().getTime();
    };

    Game.prototype.loop = function () {
        requestAnimationFrame(this.loopWrapper);
        var now = new Date().getTime();
        this.dt = (now - this.lastTime) / 1000;
        this.lastTime = now;
        this.update();
        this.render();
    };

    return new Game();
})();

window.onload = function () {
    world.init();
    game.start();
};