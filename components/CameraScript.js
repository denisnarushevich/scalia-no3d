define(['../engine/engine'], function (scalia) {
    function CameraScript() {
        var pos, cc = this;

        document.onmousedown = function (e) {
            pos = [e.pageX, e.pageY];
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

    CameraScript.prototype.onTargetUpdate = function(transform){
        console.log(this);
        this.moveTo(transform);
    }

    /**
     * @type {Transform}
     */
    CameraScript.prototype.target = null;

    /**
     * @param {Transform} target
     */
    CameraScript.prototype.setTarget = function(target){
        var targetTransform = target.gameObject.transform;

        this.target = target;

        this.onTargetUpdate = this.onTargetUpdate.bind(this);

        targetTransform.addEventListener(targetTransform.events.Update, this.onTargetUpdate);
    }

    CameraScript.prototype.removeTarget = function(){
        var targetTransform = this.target.gameObject.transform;

        this.target = null;

        targetTransform.removeEventListener(targetTransform.events.update, this.onTargetUpdate);
    }

    CameraScript.prototype.moveTo = function(transform){
        var pos = transform.getPosition();
        this.gameObject.transform.setPosition(pos[0], pos[1], pos[2]);
    }
    
    return CameraScript;
});
