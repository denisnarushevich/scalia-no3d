define(['../engine/engine', './CameraScript', '../gameObjects/Tile', './TileComponent'], function (scalia, CameraScript, Tile, TileComponent) {
    function WorldStreamer() {

    }

    WorldStreamer.prototype = Object.create(scalia.Component.prototype);

    var server = function(params, callback){
        setTimeout(function(){
            var data = [];

            var x0 = params.x0,
                y0 = params.y0,
                w = params.w,
                h = params.h;

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
        })
    }

    WorldStreamer.prototype.loadTiles = function (x0, y0, w, h, callback) {
        server({
            x0: x0,
            y0: y0,
            w: w,
            h: h
        }, callback);
    }

    return WorldStreamer;
});
