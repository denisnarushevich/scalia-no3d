define(["../engine", '../components/TileComponent'], function (engine, TileComponent) {
    function Tile(x, y) {
        engine.GameObject.call(this);

        this.sprite = this.addComponent(new engine.SpriteComponent(this));
        this.tileComponent = this.addComponent(new TileComponent(x, y));
    }

    Tile.prototype = Object.create(engine.GameObject.prototype);

    return Tile;
});
