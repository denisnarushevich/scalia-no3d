define(['../engine/engine', './CameraScript', '../gameObjects/Tile', './TileComponent', '../gameObjects/Chunk', '../components/ChunkComponent'], function (engine, CameraScript, Tile, TileComponent, Chunk, ChunkComponent) {
    function Tiles() {
        this.chunks = [];
    }

    var vec3Buffer1 = new Float32Array(3);

    Tiles.prototype = Object.create(engine.Component.prototype);
    Tiles.prototype.constructor = Tiles;

    Tiles.prototype.mainCamera = null;
    Tiles.prototype.chunkSize = 32;

    Tiles.prototype.start = function () {
        //engine.Component.prototype.start.call(this); //calls parent start, which does nothing
        var self = this;
        isometrica.server.on("tiledata", function (data) {
            for (var i = 0; i < data.length; i++) {
                var item = data[i],
                    x = item.x,
                    y = item.y,
                    cX = (x / self.chunkSize) | 0,
                    cY = (y / self.chunkSize) | 0,
                    chunk = self.getChunk(cX, cY);

                var tile = new Tile(x, y);
                chunk.setTile(tile);

                var t = tile.getComponent(TileComponent);
                t.tiles = self;
                t.setData(item);
            }
        });


        var onCameraMove = function (transform) {
            var position = transform.getPosition(vec3Buffer1),
                cx = ((position[0] / engine.config.tileSize / self.chunkSize) | 0),
                cy = ((position[2] / engine.config.tileSize / self.chunkSize) | 0);

            var chunks = [];
            for (var i = 0; i < 9; i++) {
                var x = (i / 3) | 0,
                    y = i - x * 3;
                chunks.push([cx + x - 1, cy + y - 1])
            }

            self.loadChunks(chunks);
        };

        this.mainCamera.transform.addEventListener(this.mainCamera.transform.events.update, onCameraMove);

        onCameraMove(this.mainCamera.transform);
    }

    Tiles.prototype.loadChunks = function (chunkXYs) {
        var param = [];
        for (var i = 0; i < chunkXYs.length; i++) {

            var cx = chunkXYs[i][0],
                cy = chunkXYs[i][1];

            if (!this.getChunk(cx, cy)) {
                if (this.makeChunk(cx, cy)) {
                    param.push({
                        x0: cx,
                        y0: cy,
                        w: this.chunkSize,
                        h: this.chunkSize
                    });
                }
            }


        }

        for (var x = 0; x < this.chunks.length; x++) {
            if (this.chunks[x])
                for (var y = 0; y < this.chunks[x].length; y++) {
                    if (this.chunks[x][y]) {
                        var skip = false;
                        for (var i = 0; i < chunkXYs.length; i++) {
                            if (x == chunkXYs[i][0] && y == chunkXYs[i][1]) {
                                skip = true;
                                break;
                            }
                        }
                        if (skip)
                            continue;

                        this.chunks[x][y].destroy();
                        delete this.chunks[x][y];
                    }
                }
        }

        if (param.length)
            isometrica.server.emit("getchunks", param);
    }

    Tiles.prototype.makeChunk = function (cX, cY) {
        if (!this.getChunk(cX, cY) && cX >= 0 && cY >= 0) {
            var chunk;

            if (this.chunks[cX] == undefined)
                this.chunks[cX] = [];

            chunk = this.chunks[cX][cY] = new Chunk(cX, cY);

            this.gameObject.world.addGameObject(chunk);

            return chunk;
        }
        return false;
    }

    Tiles.prototype.getChunk = function (cX, cY) {
        if (cX >= 0 && cY >= 0 && this.chunks[cX] !== undefined && this.chunks[cX][cY] !== undefined) {
            return this.chunks[cX][cY].getComponent(ChunkComponent);
        }
        return false;
    }

    return Tiles;
});
