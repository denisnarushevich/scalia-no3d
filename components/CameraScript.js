define(['../engine/engine'], function (scalia) {
    function CameraScript() {
    }

    var cameraScript = CameraScript.prototype = Object.create(scalia.Component.prototype);

    /**
     * @type {Transform}
     */
    CameraScript.prototype.target = null;

    cameraScript.onTargetUpdate;
    cameraScript.onPointerMove;
    cameraScript.onPointerDown;
    cameraScript.onPointerUp;
    cameraScript.pointerPos = null;

    /**
     * Executes when component is added to gameObject
     */
    CameraScript.prototype.awake = function(){
        this.gameObject.transform.rotate(30, 45, 0, "self");
        this.gameObject.transform.translate(2000,0,2000,'world');

        var camera = this.gameObject.getComponent(scalia.components.CameraComponent),
            script = this;

        camera.addEventListener(camera.events.viewportSet, function(camera){
            var viewport = camera.viewport;

            script.onPointerDown = function(e){
                script.pointerPos = [e.pageX, e.pageY];
                script.removeTarget();
            }

            script.onPointerUp = function(e){
                script.pointerPos = null;
            }

            script.onPointerMove = function(e){
                if (script.pointerPos !== null) {
                    var x = e.pageX - script.pointerPos[0],
                        y = e.pageY - script.pointerPos[1];

                    script.pointerPos[0] = e.pageX;
                    script.pointerPos[1] = e.pageY;

                    script.gameObject.transform.translate(
                        -x * Math.cos(45 * Math.PI / 180) + y / Math.cos(45 * Math.PI / 180),
                        0,
                        x * Math.cos(45 * Math.PI / 180) + y / Math.cos(45 * Math.PI / 180),
                        'world'
                    );
                }
            }

            viewport.addEventListener(viewport.events.pointerdown, script.onPointerDown);

            viewport.addEventListener(viewport.events.pointerup, script.onPointerUp);

            viewport.addEventListener(viewport.events.pointermove, script.onPointerMove);
        });

        camera.addEventListener(camera.events.viewportRemoved, function(camera){
            var viewport = camera.viewport;

            viewport.removeEventListener(viewport.events.pointerdown, script.onPointerDown);
            viewport.removeEventListener(viewport.events.pointerup, script.onPointerUp);
            viewport.removeEventListener(viewport.events.pointermove, script.onPointerMove);
        });
    }

    /**
     * @param {Transform} target
     */
    CameraScript.prototype.setTarget = function (target) {
        if (this.target !== null) {
            this.removeTarget();
        } else {
            var targetTransform = target.gameObject.transform;

            this.target = target;

            var cameraScript = this;
            this.onTargetUpdate = function (transform) {
                cameraScript.moveTo(transform);
            }

            targetTransform.addEventListener(targetTransform.events.Update, this.onTargetUpdate);
        }
    }

    CameraScript.prototype.removeTarget = function () {
        if (this.target !== null) {
            var targetTransform = this.target.gameObject.transform;

            this.target = null;

            targetTransform.removeEventListener(targetTransform.events.Update, this.onTargetUpdate);
        }
    }

    CameraScript.prototype.moveTo = function (transform) {
        var pos = transform.getPosition();
        this.gameObject.transform.setPosition(pos[0], pos[1], pos[2]);
    }

    return CameraScript;
});
