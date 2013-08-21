define(["../engine/engine", "../components/TrolleyScript"], function (engine, TrolleyScript) {
    function Trolley(x, y) {
        engine.GameObject.call(this);

        var sprite = this.sprite = this.addComponent(new engine.SpriteComponent(this));

        engine.Assets.getAsset('./trolley.png', function (image) {
            sprite.image = image;
            sprite.width = 24;
            sprite.height = 24;
            sprite.pivotX = 11;
            sprite.pivotY = 18;
        });

        this.addComponent(new TrolleyScript);



        this.layer = 1;
    }

    Trolley.prototype = Object.create(engine.GameObject.prototype);

    return Trolley;
});
