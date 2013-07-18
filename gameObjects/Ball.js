define(["../engine/engine", '../components/SampleBehavior'], function (scalia, script) {
    function Ball() {
        scalia.GameObject.call(this);

        var sprite = new scalia.components.SpriteComponent(this);

        scalia.Assets.getAsset('./green-ball-small.png', function(image){
            sprite.image = image;
            sprite.width = 32;
            sprite.height = 32;
            sprite.pivot = [16,32];
        });

        this.addComponent(sprite);
        this.addComponent(new script());

        this.layer = 1;
    }

    Ball.prototype = Object.create(scalia.GameObject.prototype);

    return Ball;
});
