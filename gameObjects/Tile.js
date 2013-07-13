define(["../engine/engine"], function (scalia) {
    function Tile() {
        scalia.GameObject.call(this);

    var sprite = new scalia.components.SpriteComponent(this);

        sprite.image = new Image();
        sprite.image.src = "tile2.png";
        sprite.width = 64;
        sprite.height = 47;
        sprite.pivot = [0,24];

        this.AddComponent(sprite);

    }

    var p = Tile.prototype = Object.create(scalia.GameObject.prototype);

    p.Tick = function () {
        scalia.GameObject.prototype.Tick.call(this);
    }

    return Tile;
});
