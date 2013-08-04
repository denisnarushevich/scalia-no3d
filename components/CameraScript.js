define(['../engine/engine'], function (scalia) {
    function CameraScript() {
        this.tmpctx = document.createElement("canvas").getContext("2d");
        this.tmpctx.canvas.width = 1000;
        this.tmpctx.canvas.height = 1000;
        this.bufferVec3 = new Float32Array(3);
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
    cameraScript.moveLen;
    cameraScript.tmpctx;
    cameraScript.bufferVec3;

    /**
     * Executes when component is added to gameObject
     */
    CameraScript.prototype.awake = function () {
        this.gameObject.transform.rotate(30, 45, 0, "self");
        this.gameObject.transform.translate(2000, 0, 2000, 'world');

        var camera = this.gameObject.getComponent(scalia.components.CameraComponent),
            script = this;

        camera.addEventListener(camera.events.viewportSet, function (camera) {
            var viewport = camera.viewport;

            script.onPointerDown = function (e) {
                script.pointerPos = [e.pageX, e.pageY];
                script.moveLen = [0, 0];
                script.removeTarget();
            }

            script.onPointerUp = function (e) {
                if (script.pointerPos !== null) {
                    if (Math.sqrt(Math.pow(script.moveLen[0], 2) + Math.pow(script.moveLen[1], 2)) > 10) {
                        //pan
                    } else {
                        //click
                        console.log(e.pageX, e.pageY)
                        script.pickTile(e.pageX, e.pageY);
                    }

                    script.moveLen = null;
                    script.pointerPos = null;
                }
            }

            script.onPointerMove = function (e) {
                if (script.pointerPos !== null) {
                    var x = e.pageX - script.pointerPos[0],
                        y = e.pageY - script.pointerPos[1];

                    script.moveLen[0] += x;
                    script.moveLen[1] += y;

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

            script.onPointerOut = function (e) {
                if (script.pointerPos !== null) {
                    script.moveLen = null;
                    script.pointerPos = null;
                }
            }

            viewport.addEventListener(viewport.events.pointerdown, script.onPointerDown);

            viewport.addEventListener(viewport.events.pointerup, script.onPointerUp);

            viewport.addEventListener(viewport.events.pointermove, script.onPointerMove);

            viewport.addEventListener(viewport.events.pointerout, script.onPointerOut);
        });

        camera.addEventListener(camera.events.viewportRemoved, function (camera) {
            var viewport = camera.viewport;

            viewport.removeEventListener(viewport.events.pointerdown, script.onPointerDown);
            viewport.removeEventListener(viewport.events.pointerup, script.onPointerUp);
            viewport.removeEventListener(viewport.events.pointermove, script.onPointerMove);
            viewport.removeEventListener(viewport.events.pointerout, script.onPointerOut);
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

            targetTransform.addEventListener(targetTransform.events.update, this.onTargetUpdate);
        }
    }

    CameraScript.prototype.removeTarget = function () {
        if (this.target !== null) {
            var targetTransform = this.target.gameObject.transform;

            this.target = null;

            targetTransform.removeEventListener(targetTransform.events.update, this.onTargetUpdate);
        }
    }

    CameraScript.prototype.moveTo = function (transform) {
        var pos = transform.getPosition();
        this.gameObject.transform.setPosition(pos[0], pos[1], pos[2]);
    }

    cameraScript.pickTile = function (x, y) {
        var gameObjects = this.gameObject.world.retrieve(this.gameObject),
            gameObject,
            camera = this.gameObject.getComponent(scalia.components.CameraComponent),
            wTs = camera.getWorldToScreen(),
            wTv = camera.getWorldToViewport(),
            v1 = [], v2 = [];

        for (var i = 0; i < gameObjects.length; i++) {
            gameObject = gameObjects[i];
            if (gameObject.layer !== 0)
                continue;

            gameObject.transform.getPosition(v1);

            //skip objects that lay outside of screen
            scalia.gl.vec3.transformMat4(v2, v1, wTv);
            if (Math.abs(v2[0]) > 1 || Math.abs(v2[1]) > 1)
                continue;

            scalia.gl.vec3.transformMat4(v2, v1, wTs);
            var sprite = gameObject.getComponent(scalia.components.SpriteComponent);
            if (sprite !== null) {
                var x0 = v2[0] - sprite.pivot[0],
                    y0 = v2[1] - sprite.pivot[1],
                    x1 = x0 + sprite.width,
                    y1 = y0 + sprite.height;

                if (x >= x0 && x <= x1) {
                    if (y >= y0 && y <= y1) {
                        this.tmpctx.clearRect(0, 0, sprite.width, sprite.height);
                        this.tmpctx.drawImage(sprite.image, 0, 0);
                        if (this.tmpctx.getImageData(x - x0, y - y0, 1, 1).data[3] > 0) {
                            this.gameObject.getComponent(scalia.components.CameraComponent).viewport.graphics.viewports[1].camera.getComponent(CameraScript).moveTo(gameObject.transform);
                        }
                    }
                }
            }
        }
    }

    return CameraScript;
});
