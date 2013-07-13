define(["../engine/engine"], function (scalia) {
    function Ball() {
        scalia.GameObject.call(this);

        var sprite = new scalia.components.SpriteComponent(this);

        sprite.image = new Image();
        sprite.image.src = "green-ball-small.png";
        sprite.width = 32;
        sprite.height = 32;
        sprite.pivot = [16, 32];
        sprite.layer = 1;

        this.AddComponent(sprite);

        this.layer = 1;
    }

    var p = Ball.prototype = Object.create(scalia.GameObject.prototype);

    p.Tick = function () {
        scalia.GameObject.prototype.Tick.call(this);
    }

    return Ball;
});
