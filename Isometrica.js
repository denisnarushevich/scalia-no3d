define([
    './engine/engine',
    './components/MainScript',
    './socket.io.min',
    './gameObjects/Ball'
], function (Scalia, MainScript, io, Ball) {
    function Isometrica() {
        // Isometrica is not trully isometric, it's dimetric with 2:1 ratio (Transport Tycoon used this).
        // It means, that when point goes about 1px by X, it moves 1/2 pixel by Y.
        // We can calculate camera angle around X axis like this: Math.asin(1/2)*180/Math.PI = 30deg, where 1/2 is our
        // x to y ratio.
        // Distance between tiles in 3D space can be calculated like this:
        // 1/cos(45)*TILE_WIDTH/2 = 45.255 , where 45deg angle is rotation about Y axis.

        //Tile Z is amount of how much units tile should be elevated in one step by z axis.
        //it's calculated: tileZStep = x/cos(30deg); where x is height of elevation step on image, in pixels,
        //and 30deg angle - is pitch angle of camera

        //config entries
        Scalia.config["tileSize"] = 45.255;
        Scalia.config["tileZStep"] = 9.238;

        //configure
        scaliaEngine.Layers.AddLayer();
        scaliaEngine.Layers.layers[0].depthSortingEnabled = false;

        //init engine
        this.game = new Scalia.Game();



        var isometrica = this;
        Scalia.Assets.loadBatch(['./grass.png', './water.png', './tree.png'], function () {
                console.log('starting');
                isometrica.start();
            },
            function (progress) {
                console.log(progress * 100 + "%");
            }
        );
    }

    Isometrica.prototype.start = function () {
        //Game's bootstrap is following:
        //1.position camera on right coordinates
        //2.initialize & show generated terrain
        //3.fill terrain with generated trees
        //4.load terrain data for tiles around camera position
        //5.fill terrain with that data (buildings)
        //*onmousemove start over from #1

        this.server = io.connect("127.0.0.1:91");

        var gameSystem = new scaliaEngine.GameObject();
        var mainScript = new MainScript();
        gameSystem.addComponent(mainScript);
        this.game.logic.world.addGameObject(gameSystem);



        this.game.Run();



        var viewport = this.game.graphics.createViewport(document.getElementById("mainCanvas"));
        viewport.setCamera(mainScript.mainCamera).setSize(viewport.canvas.offsetWidth, viewport.canvas.offsetHeight);

        /*
        var viewport2 = this.game.graphics.createViewport(document.getElementById("vpcnv"));
        viewport2.setCamera(mainScript.createCamera()).setSize(viewport2.canvas.offsetWidth, viewport2.canvas.offsetHeight);
        */
    }

    /**
     * Scalia.Game instance
     * @type {Game}
     */
    Isometrica.prototype.game = null;

    return Isometrica;
});
