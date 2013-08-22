define(['../engine', './CameraScript', './Tiles', './WorldObjects','../socket.io.min'], function (scalia, CameraScript, Tiles, WorldObjects, io) {
    function MainScript() {

    }

    MainScript.prototype = Object.create(scalia.Component.prototype);
    MainScript.prototype.constructor = MainScript;

    MainScript.prototype.mainCamera = null;
    MainScript.prototype.server = null;

    MainScript.prototype.start = function () {
        scalia.Component.prototype.start.call(this); //calls parent start, but does nothing

        this.server = io.connect("127.0.0.1:1337");

        this.mainCamera = new scaliaEngine.Camera();
        this.mainCamera.addComponent(new CameraScript());
        /*var cam = this.mainCamera;
        scalia.Assets.getAsset('./dirt.jpg', function (image) {
            cam.backgroundPattern = image;
        });*/
        this.gameObject.world.addGameObject(this.mainCamera);


        var tiles = new Tiles();
        this.tiles = this.gameObject.addComponent(tiles);
        tiles.main = this;
        tiles.mainCamera = this.mainCamera;

        var objects = new WorldObjects();
        this.worldObjects = this.gameObject.addComponent(objects);
        objects.main = this;
    }

    MainScript.prototype.createCamera = function () {
        var camera = new scaliaEngine.Camera();
        camera.addComponent(new CameraScript());
        this.gameObject.world.addGameObject(camera);

        return camera;
    }

    return MainScript;
});
