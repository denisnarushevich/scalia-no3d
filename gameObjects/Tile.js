define(["../engine/engine", '../components/TileComponent'], function (engine, TileComponent) {
    function Tile(x, y) {
        engine.GameObject.call(this);

        this.addComponent(new engine.SpriteComponent(this));
        this.addComponent(new TileComponent(x, y));
    }

    Tile.prototype = Object.create(engine.GameObject.prototype);

    return Tile;
});
