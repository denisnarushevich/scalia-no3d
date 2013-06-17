define(["../GameObject", "../components/SpriteComponent"], function (GameObject, SpriteComponent) {
    function Plane() {
        GameObject.call(this);

    var sprite = new SpriteComponent(this);

        sprite.image = new Image();
        sprite.image.src = "green-ball-small.png";
        sprite.width = 32;
        sprite.height = 32;
        sprite.pivot = [16,16];

        this.AddComponent(sprite);
    }

    var p = Plane.prototype = Object.create(GameObject.prototype);

    p.Tick = function () {
        GameObject.prototype.Tick.call(this);
    }

    return Plane;
});
