define(['../engine/engine', './CameraScript', './Tiles'], function(scalia, CameraScript, WorldStreamer){
    function MainScript(){

    }

    MainScript.prototype = Object.create(scalia.Component.prototype);

    MainScript.prototype.mainCamera = null;

    MainScript.prototype.start = function(){
        scalia.Component.prototype.start.call(this); //calls parent start, but does nothing

        this.mainCamera = new scaliaEngine.gameObjects.Camera();
        this.mainCamera.addComponent(new CameraScript());
        this.gameObject.world.addGameObject(this.mainCamera);


        var worldStreamer = new WorldStreamer();
        this.gameObject.addComponent(worldStreamer);
        worldStreamer.mainCamera = this.mainCamera;
    }

    MainScript.prototype.createCamera = function(){
        var camera = new scaliaEngine.gameObjects.Camera();
        camera.addComponent(new CameraScript());
        this.gameObject.world.addGameObject(camera);

        return camera;
    }

    return MainScript;
});
