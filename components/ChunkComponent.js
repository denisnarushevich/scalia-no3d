define(["../engine/engine"],function(engine){
    function ChunkComponent(x, y){
        this.x = x;
        this.y = y;
        this.tiles = [];
    }

    ChunkComponent.prototype = Object.create(engine.Component.prototype);
    ChunkComponent.prototype.x = null;
    ChunkComponent.prototype.y = null;
    ChunkComponent.prototype.tiles = null;

    ChunkComponent.prototype.setTile = function(tile){
        this.gameObject.world.addGameObject(tile);
        this.gameObject.transform.addChild(tile.transform);
    }

    return ChunkComponent;
})
