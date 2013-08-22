define(['../engine'], function (engine) {
    function Script() {
        this.direction = new Int8Array(2);
    }

    Script.prototype = Object.create(engine.Component.prototype);
    Script.prototype.constructor = Script;

    Script.prototype.direction = null;
    Script.prototype.speed = 6;

    var clips = [
        [0, 0],
        [24, 0],
        [48, 0],
        [72, 0]
    ]

    var dmap = [0,2,1,3];
    var ddir = [[-1,0],[0,-1],[1,0],[0,1]];


    Script.prototype.start = function () {
        this.t0 = Date.now();
        this.t1 = Date.now();
        this.r = Math.random()*1000;
        this.speed = Math.random()*6;
    }

    Script.prototype.tick = function () {
        this.gameObject.transform.translate(this.direction[0] * this.speed, 0, this.direction[1] * this.speed);

        if (this.t1 - this.t0 > this.r) {
            var d = Math.round(Math.random() * 3);
            this.direction[0] = ddir[d][0]
            this.direction[1] = ddir[d][1];

            this.r = Math.random()*1000;
            this.speed = Math.random()*6;

            var clip = clips[dmap[d]]
            this.gameObject.sprite.offsetX = clip[0];
            this.gameObject.sprite.offsetY = clip[1];

            this.t0 = this.t1;
        }

        this.t1 = Date.now();
    }

    return Script;
});
