define(['../engine/engine', './CameraScript', '../gameObjects/Tile', './TileComponent'], function (scalia, CameraScript, Tile, TileComponent) {
    function Tiles() {
        this.chunckStatus = [];
        this.tiles = new Array(0xFFFFFFFF);
    }

    Tiles.prototype = Object.create(scalia.Component.prototype);

    Tiles.prototype.mainCamera = null;
    Tiles.prototype.chunckStatus = null;
    Tiles.prototype.chunkSize = 16;

    Tiles.prototype.start = function () {
        //scalia.Component.prototype.start.call(this); //calls parent start, but does nothing
        var self = this;
        isometrica.server.on("tiledata", function (data) {
            console.log("!!!");
            for (var i = 0; i < data.length; i++) {
                var item = data[i];


                if (!self.tiles[item.x * 0x10000 + item.y]) {
                    var tile = new Tile();
                    tile.transform.translate(item.x * 45.255, 0, item.y * 45.255);
                    isometrica.game.logic.world.addGameObject(tile);

                    var t = tile.getComponent(TileComponent);
                    self.tiles[item.x * 0x10000 + item.y] = tile;

                    t.x = item.x;
                    t.y = item.y;
                    t.tiles = self;

                    self.tiles[item.x * 0x10000 + item.y].getComponent(TileComponent).setData(item);
                }
            }
        });


        var strm = this,
            n = this.chunkSize;

        var l = function () {
            var position = strm.mainCamera.transform.getPosition(),
                chunkX0 = ((position[0] / 45.255 / n) | 0),
                chunkY0 = ((position[2] / 45.255 / n) | 0);

            var chunks = [];
            for (var i = 0; i < 9; i++) {
                var x = (i / 3) | 0,
                    y = i - x * 3;
                chunks.push([chunkX0 + x - 1, chunkY0 + y - 1])
            }
            strm.loadChunks(chunks);
        };

        this.mainCamera.camera.addEventListener(this.mainCamera.transform.events.update, l);

        l();
    }

    Tiles.prototype.loadChunks = function(chunkXYs){
        var n = this.chunkSize;
        var param = [];
        for(var i = 0; i < chunkXYs.length; i++){

            var cx = Math.abs(chunkXYs[i][0]),
                cy = Math.abs(chunkXYs[i][1]);

            if (!this.getChunkStatus(cx, cy)) {
                this.setChunkStatus(cx, cy);

                param.push({
                    x0:cx,
                    y0:cy,
                    w:n,
                    h: n
                });
            }
        }

        if(param.length)
            isometrica.server.emit("getchunks", param);
    }

    Tiles.prototype.getChunkStatus = function (x, y) {
        return this.chunckStatus[x] && this.chunckStatus[x][y];
    }

    Tiles.prototype.setChunkStatus = function (x, y) {
        if (this.chunckStatus[x] === undefined) {
            this.chunckStatus[x] = [];
        }

        if (this.chunckStatus[x][y] === undefined) {
            this.chunckStatus[x][y] = true;
        }
    }

    return Tiles;
});
