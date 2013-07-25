define(['./engine/engine', './Tiles', './components/CameraScript', './gameObjects/Ball', './components/CameraScript'], function (Scalia, Tiles, CC, Ball, CameraScript) {
    function Isometrica() {
        // Isometrica is not trully isometric, it's dimetric with 2:1 ratio (Transport Tycoon used this).
        // It means, that when point goes about 1px by X, it moves 1/2 pixel by Y.
        // We can calculate camera angle around X axis like this: Math.asin(1/2)*180/Math.PI = 30deg, where 1/2 is our
        // x to y ratio.
        // Distance between tiles in 3D space can be calculated like this:
        // 1/cos(45)*TILE_WIDTH/2 = 45.255 , where 45deg angle is rotation about Y axis.

        //configure
        scaliaEngine.Layers.AddLayer();
        scaliaEngine.Layers.layers[0].depthSortingEnabled = false;

        //init engine
        this.game = new Scalia.Game();



        var isometrica = this;
        Scalia.Assets.loadBatch(['./tile.png', './tile2.png', './green-ball-small.png'], function () {
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


        this.tiles = new Tiles(this);
        //TODO actually, camera should be initialized in gameView.
        cameraObject = this.camera = new scaliaEngine.gameObjects.Camera(document.width, document.height, 100);
        cameraObject.addComponent(new CC());
        cameraObject.transform.rotate(30, 45, 0, "self");
        cameraObject.transform.translate(2000,0,2000,'world');
        this.game.logic.world.addGameObject(cameraObject);


        for(var i = 0; i<5000; i++){
            var ball = new Ball();
            ball.transform.translate(Math.random()*4000, 0,Math.random()*4000, "world");
            this.game.logic.world.addGameObject(ball);
        }

        this.game.Run();

        var viewport = this.game.graphics.CreateViewport();
        viewport.setCamera(cameraObject);
        document.body.appendChild(viewport.canvas);
        viewport.setSize(viewport.canvas.offsetWidth, viewport.canvas.offsetHeight);

        cameraObject.getComponent(CameraScript).setTarget(ball.transform);

    }

    /**
     * Scalia.Game instance
     * @type {Game}
     */
    Isometrica.prototype.game = null;

    return Isometrica;
});
