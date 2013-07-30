define(['../engine/engine', './CameraScript', '../gameObjects/Tile', './TileComponent'], function (scalia, CameraScript, Tile, TileComponent) {
    function Tiles() {
        this.chunckStatus = [];
        this.tiles = new Array(0xFFFFFFFF);
    }

    Tiles.prototype = Object.create(scalia.Component.prototype);

    Tiles.prototype.mainCamera = null;
    Tiles.prototype.chunckStatus = null;
    Tiles.prototype.chunkSize = 8;

    Tiles.prototype.start = function () {
        //scalia.Component.prototype.start.call(this); //calls parent start, but does nothing

        var strm = this,
            n = this.chunkSize;

        var l = function () {
            var position = strm.mainCamera.transform.getPosition(),
                chunkX0 = ((position[0] / 45.255 / n) | 0),
                chunkY0 = ((position[2] / 45.255 / n) | 0);

            for (var i = 0; i < 9; i++) {
                var x = (i / 3) | 0,
                    y = i - x * 3;
                strm.loadChunk(chunkX0 + x - 1, chunkY0 + y - 1);
            }
        };

        this.mainCamera.camera.addEventListener(this.mainCamera.transform.events.update, l);

        l();

    }

    Tiles.prototype.loadChunk = function (cx, cy) {
        var cx = Math.abs(cx);
        var cy = Math.abs(cy);
        var n = this.chunkSize;
        if (!this.getChunckStatus(cx, cy)) {
            this.setChunckStatus(cx, cy);
            for (var i = 0; i < n * n; i++) {
                var tile = new Tile(),
                    x = (i / n) | 0,
                    y = i - x * n;

                x += n * cx;
                y += n * cy;

                tile.transform.translate(x * 45.255, 0, y * 45.255);
                isometrica.game.logic.world.addGameObject(tile);

                var t = tile.getComponent(TileComponent);
                this.tiles[x * 0x10000 + y] = tile;

                t.x = x;
                t.y = y;
                t.tiles = this;


            }

            var self = this;
            this.loadTiles(cx, cy, n, n, function (data) {
                console.log(cx,cy);
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    self.tiles[item.x * 0x10000 + item.y].getComponent(TileComponent).setData(item);
                    //self.tiles[item.x * 0x10000 + item.y].sprite.image = self.tiles[item.x * 0x10000 + item.y].sprite.image2;
                }
            });
        }
    }

    Tiles.prototype.getChunckStatus = function (x, y) {
        return this.chunckStatus[x] && this.chunckStatus[x][y];
    }

    Tiles.prototype.setChunckStatus = function (x, y) {
        if (this.chunckStatus[x] === undefined) {
            this.chunckStatus[x] = [];
        }

        if (this.chunckStatus[x][y] === undefined) {
            this.chunckStatus[x][y] = true;
        }
    }


    var server = function (params, callback) {
        setTimeout(function () {
            var data = [];

            var x0 = params.x0,
                y0 = params.y0,
                w = params.w,
                h = params.h;

            for (var i = 0; i < w * h; i++) {
                var x = (i / w) | 0,
                    y = i - x * w;

                x += w * x0;
                y += h * y0;

                data.push({
                    x: x,
                    y: y,
                    ownerId: 8
                });
            }
            callback(data);
return;
            for (var x = x0; x < x0 + w; x++) {
                for (var y = y0; y < y0 + h; y++) {
                    data.push({
                        x: x,
                        y: y,
                        ownerId: 8
                    });
                }
            }

            callback(data);
        }, 1000*Math.random())
    }

    Tiles.prototype.loadTiles = function (x0, y0, w, h, callback) {
        server({
            x0: x0,
            y0: y0,
            w: w,
            h: h
        }, callback);
    }

    return Tiles;
});
