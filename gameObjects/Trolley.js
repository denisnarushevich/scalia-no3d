define(["../engine", "../components/TrolleyScript"], function (engine, TrolleyScript) {
    function Trolley() {
        engine.GameObject.call(this);

        var sprite = this.sprite = this.addComponent(new engine.SpriteComponent(this));
        sprite.layer = 1;

        engine.Assets.getAsset('./trolley.png', function (image) {
            sprite.image = image;
            sprite.width = 24;
            sprite.height = 24;
            sprite.pivotX = 11;
            sprite.pivotY = 18;
        });

        this.addComponent(new TrolleyScript);




    }

    Trolley.prototype = Object.create(engine.GameObject.prototype);

    return Trolley;
});
