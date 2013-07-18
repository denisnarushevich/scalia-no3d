define(["../Component"], function (Component) {
    function Sprite(gameObject) {
        Component.call(this, gameObject);
    }

    var p = Sprite.prototype = Object.create(Component.prototype);

    p.image = new Image();

    p.width = 0;
    p.height = 0;

    p.pivot = [0, 0];

    return Sprite;
});