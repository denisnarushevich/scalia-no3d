define(["./lib/gl-matrix", "./Layers"], function (glMatrix, Layers) {
    function CanvasRenderer(viewport) {
        this.viewport = viewport;
        this.context = viewport.context;
        this.camera = viewport.camera;
        this.resolution = viewport.size;
        this.layersCount = Layers.layers.length;

        this.layerCanvases = [];
        this.layerBuffers = [];

        //generate canvases for each layer
        for (var i = 0; i < this.layersCount; i++) {
            var cnv = document.createElement("canvas");
            cnv.width = this.resolution[0];
            cnv.height = this.resolution[1];
            this.layerCanvases[i] = cnv.getContext("2d");
        }

        //viewport matrix
        var vP = [
            (this.resolution[0] / 2) | 0, 0, 0, 0,
            0, -(this.resolution[1] / 2) | 0, 0, 0,
            0, 0, 1, 0,
            (this.resolution[0] / 2) | 0, (this.resolution[1] / 2) | 0, 0, 1
        ];

        //matrix multiplication is associative, it means that we can precalculate camera matrix...
        this.M = glMatrix.mat4.multiply([], this.camera.camera.projectionMatrix, this.camera.transform.getWorldToLocal());
        glMatrix.mat4.multiply(this.M, vP, this.M);
        var that = this;
        //...and keep it updated each time, when camera's worldTolocal matrix changes.
        this.camera.transform.AddListener(this.camera.transform.events.Update, function (transform) {
            glMatrix.mat4.multiply(that.M, transform.gameObject.camera.projectionMatrix, transform.getWorldToLocal());
            glMatrix.mat4.multiply(that.M, vP, that.M);
        });
    }

    var p = CanvasRenderer.prototype,
        bufferVec3 = new Float32Array([0, 0, 0]);

    p.Render = function () {
        this.context.clearRect(0, 0, this.resolution[0], this.resolution[1]);

        var camera = this.camera,
            gameObjects = camera.world.Retrieve(camera),
            gameObjectsCount = gameObjects.length,
            gameObject, i, j;

        for (i = 0; i < this.layersCount; i++) {
            this.layerBuffers[i] = [];
        }

        for (i = 0; i < gameObjectsCount; i++) {
            gameObject = gameObjects[i];
            this.layerBuffers[gameObject.layer].push(gameObject);
        }

        for (i = 0; i < this.layersCount; i++) {
            var ctx = this.layerCanvases[i],
                layer = Layers.layers[i];
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            gameObjects = this.layerBuffers[i];
            gameObjectsCount = gameObjects.length;


            if (layer.depthSortingEnabled === true) {
                gameObjects.sort(function (a, b) {
                    a.transform.getPosition(bufferVec3);
                    a = bufferVec3[0] + bufferVec3[1] + bufferVec3[2];
                    b.transform.getPosition(bufferVec3);
                    b = bufferVec3[0] + bufferVec3[1] + bufferVec3[2];
                    return b - a;
                });
            }

            for (j = 0; j < gameObjectsCount; j++) {
                gameObject = gameObjects[j];

                if (gameObject === this.camera)continue;

                if (gameObject.sprite !== undefined) {
                    this.RenderSprite(gameObject.sprite, ctx);
                }

                //this.RenderAxis(gameObject);
            }

            this.context.drawImage(ctx.canvas, 0, 0);
        }
    }

    //Rounding coordinates with Math.round is slow, but looks better
    //Rounding to lowest with pipe operator is faster, but looks worse
    p.RenderSprite = function (sprite, layer) {
        glMatrix.vec3.transformMat4(bufferVec3, sprite.gameObject.transform.getPosition(bufferVec3), this.M);

        layer.drawImage(sprite.image, 0, 0, sprite.width, sprite.height, Math.round(bufferVec3[0] - sprite.pivot[0]), Math.round(bufferVec3[1] - sprite.pivot[1]), sprite.width, sprite.height);
    }

    p.RenderAxis = function (gameObject) {
        var W = gameObject.transform.getLocalToWorld(),
            pos0 = gameObject.transform.getPosition();

        glMatrix.vec3.transformMat4(pos0, pos0, this.M);

        var pos = bufferVec3;

        //draw X
        pos[0] = 100;
        pos[1] = 0;
        pos[2] = 0;

        glMatrix.vec3.transformMat4(pos, pos, W);
        glMatrix.vec3.transformMat4(pos, pos, this.M);

        this.context.beginPath();
        this.context.moveTo(pos0[0], pos0[1]);
        this.context.lineTo(pos[0], pos[1]);
        this.context.closePath();
        this.context.strokeStyle = '#ff0000';
        this.context.stroke();

        //draw Y
        pos[0] = 0;
        pos[1] = 100;
        pos[2] = 0;

        glMatrix.vec3.transformMat4(pos, pos, W);
        glMatrix.vec3.transformMat4(pos, pos, this.M);

        this.context.beginPath();
        this.context.moveTo(pos0[0], pos0[1]);
        this.context.lineTo(pos[0], pos[1]);
        this.context.closePath();
        this.context.strokeStyle = '#00ff00';
        this.context.stroke();

        //draw Z
        pos[0] = 0;
        pos[1] = 0;
        pos[2] = 100;

        glMatrix.vec3.transformMat4(pos, pos, W);
        glMatrix.vec3.transformMat4(pos, pos, this.M);

        this.context.beginPath();
        this.context.moveTo(pos0[0], pos0[1]);
        this.context.lineTo(pos[0], pos[1]);
        this.context.closePath();
        this.context.strokeStyle = '#0000ff';
        this.context.stroke();
    }

    return CanvasRenderer;
});