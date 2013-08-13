define(["../engine/engine", "../components/ChunkComponent"],function(engine, ChunkComponent){
    function Chunk(x, y){
        engine.GameObject.call(this);

        this.addComponent(new ChunkComponent(x, y));
    }

    Chunk.prototype = Object.create(engine.GameObject.prototype);

    return Chunk;
});

