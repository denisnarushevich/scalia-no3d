define([
    '../engine/engine',
    '../gameObjects/Tile',
    '../lib/operation_codes',
    '../lib/response_codes'
], function (engine, Tile, operationCodes, responseCodes) {
    function Tiles() {
        this.chunks = [];
    }

    var vec3Buffer1 = new Float32Array(3);

    Tiles.prototype = Object.create(engine.Component.prototype);
    Tiles.prototype.constructor = Tiles;

    Tiles.prototype.mainCamera = null;
    Tiles.prototype.chunkSize = 24;
    Tiles.prototype.currentChunkX = 0;
    Tiles.prototype.currentChunkY = 0;

    Tiles.prototype.start = function () {
        //engine.Component.prototype.start.call(this); //calls parent start, which does nothing
        var self = this;

        var onTileData = function (data) {
            var t0 = Date.now();
            //console.profile("Tiles.onTileData proccessing");

            for (var i = 0; i < data.length; i++) {
                var item = data[i],
                    x = item.x,
                    y = item.y,
                    cX = (x / self.chunkSize) | 0,
                    cY = (y / self.chunkSize) | 0,
                    chunk = self.getChunk(cX, cY),
                    tile;

                if (chunk === false) {
                    self.makeChunk(cX, cY)
                    chunk = self.getChunk(cX, cY);
                }

                tile = new Tile(x, y);

                chunk.transform.addChild(tile.transform);

                var t = tile.tileComponent;
                t.tiles = self;
                t.setData(item);

                self.cleanChunks();
            }

            //console.profileEnd();
            var t1 = Date.now();

            console.log("Tiles.onTileData proccessing time:", t1 - t0, "msec for", data.length, "tiles");
        }


        var onCameraMove = function (transform) {
            var position = transform.getPosition(vec3Buffer1),
                cx = ((position[0] / engine.config.tileSize / self.chunkSize) | 0),
                cy = ((position[2] / engine.config.tileSize / self.chunkSize) | 0);

            if (self.currentChunkX !== cx || self.currentChunkY !== cy) {
                self.currentChunkX = cx;
                self.currentChunkY = cy;
                self.loadChunks(cx, cy);
            }
        };

        this.mainCamera.transform.addEventListener(this.mainCamera.transform.events.update, onCameraMove);
        this.main.server.on(responseCodes.tileData, onTileData);

        onCameraMove(this.mainCamera.transform);
    }

    /**
     * Load 8 chunks around chunk where camera is focused. Skip already loaded.
     * @param centerX
     * @param centerY
     */
    Tiles.prototype.loadChunks = function (centerX, centerY) {
        var param = [];

        for (var i = 0; i < 9; i++) {
            var x = (i / 3) | 0,
                y = i - x * 3,
                cx = centerX + x - 1,
                cy = centerY + y - 1;

            if (this.getChunk(cx, cy) === false && cx >= 0 && cy >= 0) {
                param.push({
                    x0: cx,
                    y0: cy,
                    w: this.chunkSize,
                    h: this.chunkSize
                });
            }
        }

        if (param.length)
            this.main.server.emit(operationCodes.getChunks, param);
    }

    Tiles.prototype.makeChunk = function (cX, cY) {
        if (!this.getChunk(cX, cY) && cX >= 0 && cY >= 0) {
            var chunk;

            if (this.chunks[cX] == undefined)
                this.chunks[cX] = [];

            chunk = this.chunks[cX][cY] = new engine.GameObject();

            this.gameObject.world.addGameObject(chunk);

            return chunk;
        }
        return false;
    }

    Tiles.prototype.getChunk = function (cX, cY) {
        if (cX >= 0 && cY >= 0 && this.chunks[cX] !== undefined && this.chunks[cX][cY] !== undefined) {
            return this.chunks[cX][cY];
        }
        return false;
    }

    /**
     * Remove old chunks around current position, remove those that are outside of 3x3 area of current chunks.
     */
    Tiles.prototype.cleanChunks = function () {
        var chunks = this.chunks,
            cx, cy;

        for (cx = 0; cx < chunks.length; cx++) {
            if (chunks[cx] === undefined)
                continue;

            for (cy = 0; cy < chunks[cx].length; cy++) {
                if (chunks[cx][cy] !== undefined && (Math.abs(cx - this.currentChunkX) > 1 || Math.abs(cy - this.currentChunkY) > 1)) {
                    chunks[cx][cy].destroy();
                    delete chunks[cx][cy];
                }
            }
        }
    }

    return Tiles;
});
