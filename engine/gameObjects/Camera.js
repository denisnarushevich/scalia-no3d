define(["../GameObject", "../components/CameraComponent"], function (GameObject, CameraComponent) {
    function CameraObject(width, height, length) {
        GameObject.call(this);
        this.addComponent(new CameraComponent(this, width, height, length));
    }

    CameraObject.prototype = Object.create(GameObject.prototype);

    return CameraObject;
});
