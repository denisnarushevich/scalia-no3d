define(["../engine/engine", '../components/TileComponent'], function (scalia, TileComponent) {
    function Tile() {
        scalia.GameObject.call(this);

    var sprite = new scalia.components.SpriteComponent(this);

        scalia.Assets.getAsset('./tile2.png', function(image){
            sprite.image = image;
            sprite.width = 64;
            sprite.height = 47;
            sprite.pivot = [32,24];
        });

        this.AddComponent(sprite);

        this.AddComponent(new TileComponent());
    }

    var p = Tile.prototype = Object.create(scalia.GameObject.prototype);

    p.Tick = function () {
        scalia.GameObject.prototype.Tick.call(this);
    }

    return Tile;
});
