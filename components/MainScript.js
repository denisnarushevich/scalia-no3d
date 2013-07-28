define(['../engine/engine', './CameraScript'], function(scalia, CameraScript){
    function MainScript(){

    }

    MainScript.prototype = Object.create(scalia.Component.prototype);

    MainScript.prototype.mainCamera = null;

    MainScript.prototype.start = function(){
        scalia.Component.prototype.start.call(this); //call parent start, but does nothing

        this.mainCamera = new scaliaEngine.gameObjects.Camera();
        this.mainCamera.addComponent(new CameraScript());
        this.gameObject.world.addGameObject(this.mainCamera);


    }

    MainScript.prototype.createCamera = function(){
        var camera = new scaliaEngine.gameObjects.Camera();
        camera.addComponent(new CameraScript());
        this.gameObject.world.addGameObject(camera);

        return camera;
    }

    return MainScript;
});
