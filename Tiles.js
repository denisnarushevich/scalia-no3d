define(['./gameObjects/Tile', './components/TileComponent'], function (Tile, TileComponent) {
        function Tiles(isometrica) {
            this.tiles = [];

            var tile;
            var n = 16;
            for (var i = 0; i < n * n; i++) {
                tile = new Tile();
                this.tiles.push(tile);
                var x = (i / n) | 0;
                var y = i - x * n;
                tile.transform.translate(x * 45.255, 0, y * 45.255);
                isometrica.game.logic.world.addGameObject(tile);

                var t = tile.getComponent(TileComponent);
                t.x = x;
                t.y = y;
                t.tiles = this;
            }
        }


        Tiles.prototype.loadChunk = function (position) {
            var chunkX0 = (position[0] / 45.255)|0,
                chunkY0 = (position[1] / 45.255)|0;

            console.log(chunkX0, chunkY0);
        }

        return Tiles;
    }
)
