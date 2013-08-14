define(['../engine/engine'], function (engine) {
    function TileComponent(x, y) {
        engine.Component.call(this);
        this.events = {
            dataSet: 0
        }

        if (x !== undefined && y !== undefined) {
            this.x = x;
            this.y = y;
        }

        this.gridPoints = [];
    }

    TileComponent.prototype = Object.create(engine.Component.prototype);
    TileComponent.prototype.constructor = TileComponent;

    TileComponent.prototype.x = null;
    TileComponent.prototype.y = null;
    TileComponent.prototype.gridPoints = null;

    TileComponent.prototype.start = function () {
        //var transform = this.gameObject.transform;
        //transform.translate(0,-(Math.random()*400+100),0);
        if (this.x !== null && this.y !== null)
            this.gameObject.transform.translate(this.x * engine.config.tileSize, 0, this.y * engine.config.tileSize, "world");

        /*
         var sprite = this.gameObject.sprite;
         engine.Assets.getAsset('./grass.png', function (image) {
         sprite.image = image;
         sprite.width = 64;
         sprite.height = 47;
         sprite.pivotX = 32;
         sprite.pivotY = 24;
         });        */
    }

    var clips = {
        '2222': [0, 0],
        '2111': [81, 0],
        '2223': [161, 0],
        '2112': [241, 0],
        '2232': [321, 0],
        '2121': [399, 0],
        '2233': [479, 0],
        '2122': [559, 0],
        '2322': [639, 0],
        '2211': [719, 0],
        '2323': [799, 0],
        '2212': [879, 0],
        '2332': [959, 0],
        '2221': [1039, 0],
        '2333': [1119, 0],
        '2321': [1197, 0],
        '2123': [1277, 0],
        '2101': [1358, 0],
        '2343': [1437, 0]
    };

    /**
     * data format is like:
     * {
     *  int x,
     *  int y,
     *  int ownerId,
     *  vec3[] gridPoints,
     *  worldObject[] objects,
     *  int type
     * }
     * @param {object} data
     */
    TileComponent.prototype.setData = function (data) {
        var self = this,
            gameObject = this.gameObject,
            sprite = gameObject.sprite,
            transform = gameObject.transform;

        this.data = data;

        this.gridPoints[0] = data.gridPoints[2][2];
        this.gridPoints[1] = data.gridPoints[3][2];
        this.gridPoints[2] = data.gridPoints[1][2];
        this.gridPoints[3] = data.gridPoints[0][2];

        //if not water
        if (data.type !== 0) {
            if (data.objects.length > 0) {
                var objects = data.objects,
                    len = objects.length,
                    objData, obj, Obj;

                for (var i = 0; i < len; i++) {
                    objData = objects[i];
                    Obj = this.tiles.main.worldObjects.getObjectById(objData.id);

                    obj = new Obj();
                    transform.addChild(obj.transform);
                    obj.transform.translate(objData.subX * engine.config.tileSize, 0, objData.subY * engine.config.tileSize);
                }
            }

            transform.translate(0, data.gridPoints[2][2] * engine.config.tileZStep, 0, "world");

            engine.Assets.getAsset('./grass.png', function (image) {
                sprite.image = image;
                sprite.width = 64;
                sprite.height = 47;
                sprite.pivotX = 32;
                sprite.pivotY = 24;
                sprite.offsetX = clips[self.getSlopeId().toString()][0];
                sprite.offsetY = clips[self.getSlopeId().toString()][1];
            });
        } else {
            engine.Assets.getAsset("./water.png", function (image) {
                sprite.image = image;
                sprite.pivotX = 32;
                sprite.pivotY = 24;
                sprite.width = 64;
                sprite.height = 47;
            });
        }


        this.dispatchEvent(this.events.dataSet, this);
    }

    TileComponent.prototype.getSlopeId = function () {
        if (this.tileType === 0)return 2222;
        var gridPoints = this.gridPoints,
            z0 = gridPoints[0];
        return 2000 + (gridPoints[1] - z0 + 2) * 100 + (gridPoints[2] - z0 + 2) * 10 + (gridPoints[3] - z0 + 2);
    }

    TileComponent.prototype.tick = function () {
        //this.gameObject.transform.translate(0,Math.abs(this.gameObject.transform.getLocalPosition()[1]/3),0);
    }

    return TileComponent;
})
;
