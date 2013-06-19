require(["./engine/engine"], function (scaliaEngine) {
    var myGame = new scaliaEngine.Game();

    for (var i = -80; i < 80; i++) {
        for (var j = -80; j < 80; j++) {
            var tile = new scaliaEngine.gameObjects.Plane();
            tile.transform.translate(i*40, j*40, 100);
            myGame.logic.world.AddGameObject(tile);
        }
    }
       
                /*var tile = window.tile = new scaliaEngine.gameObjects.Plane();
            tile.transform.translate(200, 200, 2000);
            myGame.logic.world.AddGameObject(tile);*/
    
    var size = [document.width, document.height];

    var cameraObject = window.camera = new scaliaEngine.gameObjects.Camera(document.width, document.height, 100);

    //cameraObject.transform.Rotate(32, 45, 0, "self");
    camera.transform.translate(1000,1000,0);

    myGame.logic.world.AddGameObject(cameraObject);

    myGame.Run();

    var viewport = myGame.graphics.CreateViewport(cameraObject, size);

    document.body.appendChild(viewport.canvas);
    
    //camera.transform.translate(1000,1000,0);
    //camera.transform.rotate(-32,0, 0, "self");//fix shit with signes
    //camera.transform.rotate(0,-45, 0, "self");
    
    
    /*
    window.myGame = myGame;
     var a = setInterval(function(){
     camera.transform.rotate(0,2,0, "self");
     },40);          */
});