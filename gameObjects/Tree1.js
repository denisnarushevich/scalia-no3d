define(["../engine"], function (engine) {
    function Tree() {
        engine.GameObject.call(this);

        var sprite = this.sprite = new engine.SpriteComponent(this);
        sprite.layer = 1;

        engine.Assets.getAsset('./tree.png', function (image) {
            sprite.image = image;
            sprite.width = 64;
            sprite.height = 64;
            sprite.pivotX = 34;
            sprite.pivotY = 53;
        });

        this.addComponent(sprite);

    }

    Tree.prototype = Object.create(engine.GameObject.prototype);

    return Tree;
});
