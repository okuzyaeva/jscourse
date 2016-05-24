function Particle () {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.r = 10;
    this.lifeTime = 0;
    this.inUse = false;
}

Particle.prototype.update = function () {
    this.x += this.vx * game.dt;
    this.y += this.vy * game.dt;
    this.lifeTime -= game.dt;
};

Particle.prototype.render = function (ctx) {
    ctx.moveTo(this.x - this.r, this.y);
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
};

var world = {
    cnv: null,
    ctx: null,

    particleEmitter: null,

    init: function () {
        this.cnv = document.querySelector('canvas');
        this.ctx = this.cnv.getContext('2d');
        this.cnv.width = 800;
        this.cnv.height = 600;

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
    }
};

function ParticleEmitter () {
    this._MIN_VX = -100;
    this._MAX_VX = 100;

    this._MIN_VY = -100;
    this._MAX_VY = 100;

    this._MAX_RADIUS = 10;

    this._LIFETIME = 1;
    this._PARTICLESPERTIME = 5;

    this.particlePool = [];
    this.spawnedParticles = [];
    this.spawnInterval = .016;
    this.spawnTime = 0;

    this.x = 0;
    this.y = 0;

    world.ctx.fillStyle = '#0099ff';

    this.fillThePool(300);
};

ParticleEmitter.prototype.fillThePool = function (n) {
    var p = undefined;
    for(var i = n; --i >= 0;) {
        p = new Particle();
        this.particlePool.push(p);
    }
};

ParticleEmitter.prototype.update = function () {
    for(var i = this.spawnedParticles.length; --i >= 0;) {
        if(this.spawnedParticles[i] === undefined) { continue; }
        if(this.spawnedParticles[i].lifeTime <= 0) {
            this.particlePool[i].inUse = false;
            this.spawnedParticles[i] = undefined;

            // this.spawnedParticles.splice(i, 1);
        } else {
            this.spawnedParticles[i].update();
            this.spawnedParticles[i].r = Math.max(0, this._MAX_RADIUS * (this.spawnedParticles[i].lifeTime / this._LIFETIME));
        }
    }

    if(this.spawnTime > 0) {
        this.spawnTime -= game.dt;
    } else {
        this.spawnParticle(this._PARTICLESPERTIME);
        this.spawnTime = this.spawnInterval;
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
    var i = 0;

    for(i = this.particlePool.length; n > 0 && --i >= 0;) {
        if(this.particlePool[i].inUse) { continue; }
        p = this.particlePool[i];
        p.x = this.x;
        p.y = this.y;
        p.vx = Math.random() * (this._MAX_VX - this._MIN_VX) + this._MIN_VX;
        p.vy = Math.random() * (this._MAX_VY - this._MIN_VY) + this._MIN_VY;
        p.lifeTime = this._LIFETIME;
        this.spawnedParticles[i] = p;
        p.inUse = true;
        n--;
    }

    // for(i = n; --i >= 0;) {
    //     p = new Particle();
    //     p.vx = Math.random() * (this._MAX_VX - this._MIN_VX) + this._MIN_VX;
    //     p.vy = Math.random() * (this._MAX_VY - this._MIN_VY) + this._MIN_VY;
    //     p.x = this.x;
    //     p.y = this.y;
    //     p.lifeTime = this._LIFETIME;
    //     this.spawnedParticles.push(p);
    // }
};

var game = (function () {

    function Game () {
        this.dt = 0;
        this.lastUpdatetime = 0;
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
        world.init();
        this.lastUpdatetime = new Date();
        requestAnimationFrame(this.loopWrapper);
    };

    Game.prototype.loop = function () {
        requestAnimationFrame(this.loopWrapper);
        var now = new Date().getTime();
        this.dt = (now - this.lastUpdatetime) / 1000;
        this.lastUpdatetime = now;
        this.update();
        this.render();
    };

    return new Game();
})();

window.onload = function () {
    game.start();
};