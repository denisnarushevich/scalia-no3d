define([
    './engine/engine',
    './components/MainScript',
    "./gameObjects/Tree1"
], function (engine, MainScript, Tree1) {
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
        engine.config["tileSize"] = 45.255;
        engine.config["tileZStep"] = 9.238;

        //configure
        engine.Layers.AddLayer();
        engine.Layers.layers[0].depthSortingEnabled = false;

        //init engine
        this.game = new engine.Game();



        var isometrica = this;
        engine.Assets.loadBatch(['./grass.png', './water.png', './tree.png'], function () {
                console.log('starting');
                isometrica.start();
            },
            function (progress) {
                console.log(progress * 100 + "%");
            }
        );
    }

    Isometrica.prototype.start = function () {
        var gameSystem = new engine.GameObject();
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

      /*  t1 = new Tree1();
        this.game.logic.world.addGameObject(t1);
        t2 = new Tree1();
        t2.transform.translate(100,0,100);
        t1.transform.addChild(t2.transform);*/
    }

    /**
     * engine.Game instance
     * @type {Game}
     */
    Isometrica.prototype.game = null;

    return Isometrica;
});
