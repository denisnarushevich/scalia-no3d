define(["../GameObject", "../components/CameraComponent"], function (GameObject, CameraComponent) {
    function CameraObject(width, height, length) {
        GameObject.call(this);
        this.AddComponent(new CameraComponent(this, width, height, length));
    }

    var p = CameraObject.prototype = Object.create(GameObject.prototype);

    p.Tick = function(){
        GameObject.prototype.Tick.call(this);
    }

    return CameraObject;
});
