define(['../engine/engine'], function (scalia) {
    function CameraScript() {
        var pos, cc = this;

        document.onmousedown = function (e) {
            pos = [e.pageX, e.pageY];
            cc.removeTarget();
        }

        document.onmouseup = function (e) {
            pos = null;
        }


        document.onmousemove = function (e) {
            if (pos) {
                var x = e.pageX - pos[0],
                    y = e.pageY - pos[1];

                pos[0] = e.pageX;
                pos[1] = e.pageY;

                cc.gameObject.transform.translate(
                    -x * Math.cos(45 * Math.PI / 180) + y / Math.cos(45 * Math.PI / 180),
                    0,
                    x * Math.cos(45 * Math.PI / 180) + y / Math.cos(45 * Math.PI / 180),
                    'world'
                );
            }
        }


    }

    CameraScript.prototype = Object.create(scalia.Component.prototype);

    /**
     * @type {Transform}
     */
    CameraScript.prototype.target = null;

    CameraScript.prototype.awake = function(){

        this.gameObject.transform.rotate(30, 45, 0, "self");
        this.gameObject.transform.translate(2000,0,2000,'world');
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
