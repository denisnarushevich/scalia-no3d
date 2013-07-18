define(['./gameObjects/Tile', './components/TileComponent'], function(Tile, TileComponent){
    function Tiles(isometrica){
        this.tiles = [];

        var tile;
        var n = 32;
        for(var i = 0; i < n*n; i++){
            tile = new Tile();
            this.tiles.push(tile);
            var x = (i/n)|0;
            var y = i-x*n;
            tile.transform.translate(x*45.255, 0, y*45.255);
            isometrica.game.logic.world.AddGameObject(tile);

            var t = tile.getComponent(TileComponent);
            t.x = x;
            t.y = y;
            t.tiles = this;
        }
    }



    return Tiles;
})
