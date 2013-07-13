require(["./engine/engine", "./gameObjects/Ball", "./gameObjects/Tile"], function (scaliaEngine, Ball, Tile) {
    scaliaEngine.Layers.AddLayer();
    scaliaEngine.Layers.layers[0].depthSortingEnabled = false;

    myGame = new scaliaEngine.Game();

    for (var i = -20; i < 20; i++) {
        for (var j = -20; j < 20; j++) {
            var tile = new Tile();
            tile.transform.translate(i*45.255, 0, j*45.255);
            myGame.logic.world.AddGameObject(tile);
        }
    }

    for(var j = 0; j<1000;j++){
        var ball = new Ball();
        myGame.logic.world.AddGameObject(ball);
        ball.transform.translate(Math.random()*2000-1000, 0,Math.random()*2000-1000, "world");
    }



    var ball = new Ball();
    ball.transform.translate(10, 0,0, "world");
    myGame.logic.world.AddGameObject(ball);
    window.b = ball;

    var size = [document.width, document.height];

    var cameraObject = window.camera = new scaliaEngine.gameObjects.Camera(document.width, document.height, 100);


    // Game is not trully isometric, it's dimetric with 2:1 ratio (Transport Tycoon used this).
    // It means, that when point goes about 1px by X, it moves 1/2 pixel by Y.
    // We can calculate camera angle around X axis like this: Math.asin(1/2)*180/Math.PI = 30deg, where 1/2 is our
    // x to y ratio.
    // Distance between tiles in 3D space can be calculated like this:
    // 1/cos(45)*TILE_WIDTH/2 = 45.255 , where 45deg angle is rotation about Y axis.

    cameraObject.transform.rotate(30, 45, 0, "self");
    cameraObject.transform.translate(0,0,0);

    myGame.logic.world.AddGameObject(cameraObject);



    var viewport = myGame.graphics.CreateViewport(cameraObject, size);
    document.body.appendChild(viewport.canvas);

    myGame.Run();
});