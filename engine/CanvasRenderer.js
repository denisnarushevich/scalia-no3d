define(["./lib/gl-matrix", "./Layers"], function (glMatrix, Layers) {
    function CanvasRenderer() {
        this.layerBuffers = [];
        for (i = 0; i < Layers.layers.length; i++)
            this.layerBuffers[i] = [];
        this.pM = [];
        this.M = [];
    }

    var p = CanvasRenderer.prototype,
        bufferVec3 = new Float32Array([0, 0, 0]),
        bufferMat4 = new Float32Array(16);

    p.Render = function (camera, viewport) {
        var gameObjects = camera.world.retrieve(camera),
            gameObjectsCount = gameObjects.length,
            layersCount = viewport.layers.length,
            gameObject, i, j, layer, ctx;

        //matrix multiplication is associative, it means that we can precalculate camera matrix...
        //glMatrix.mat4.multiply(this.pM, camera.camera.projectionMatrix, camera.transform.getWorldToLocal());
        //glMatrix.mat4.multiply(this.M, viewport.viewportMatrix, this.pM);
        this.pM = camera.camera.getWorldToViewport()
        this.M = camera.camera.getWorldToScreen()



        viewport.context.clearRect(0, 0, viewport.size[0], viewport.size[1]);



        for (i = 0; i < gameObjectsCount; i++) {
            gameObject = gameObjects[i];

           if (gameObject === camera)
               continue;

            //primitive clipspace culling
            gameObject.transform.getPosition(bufferVec3);
            glMatrix.vec3.transformMat4(bufferVec3, bufferVec3, this.pM);
            if (Math.abs(bufferVec3[0]) > 1 || Math.abs(bufferVec3[1]) > 1)
                continue;

            this.layerBuffers[gameObject.layer].push(gameObject);
        }

        for (i = 0; i < layersCount; i++) {
            layer = Layers.layers[i];
            ctx = viewport.layers[i];
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
                gameObject = gameObjects.pop();

                if (gameObject.sprite !== undefined) {
                    this.RenderSprite(gameObject.sprite, ctx);
                }

                //this.RenderAxis(gameObject);
            }

            viewport.context.drawImage(ctx.canvas, 0, 0);
        }
    }

    //Rounding coordinates with Math.round is slow, but looks better
    //Rounding to lowest with pipe operator is faster, but looks worse
    p.RenderSprite = function (sprite, layer) {
        glMatrix.vec3.transformMat4(bufferVec3, sprite.gameObject.transform.getPosition(bufferVec3), this.M);

        layer.drawImage(sprite.image, 0, 0, sprite.width, sprite.height, Math.round(bufferVec3[0] - sprite.pivot[0]), Math.round(bufferVec3[1] - sprite.pivot[1]), sprite.width, sprite.height);
    }

    p.RenderAxis = function (gameObject, ctx) {
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

        ctx.beginPath();
        ctx.moveTo(pos0[0], pos0[1]);
        ctx.lineTo(pos[0], pos[1]);
        ctx.closePath();
        ctx.strokeStyle = '#ff0000';
        ctx.stroke();

        //draw Y
        pos[0] = 0;
        pos[1] = 100;
        pos[2] = 0;

        glMatrix.vec3.transformMat4(pos, pos, W);
        glMatrix.vec3.transformMat4(pos, pos, this.M);

        ctx.beginPath();
        ctx.moveTo(pos0[0], pos0[1]);
        ctx.lineTo(pos[0], pos[1]);
        ctx.closePath();
        ctx.strokeStyle = '#00ff00';
        ctx.stroke();

        //draw Z
        pos[0] = 0;
        pos[1] = 0;
        pos[2] = 100;

        glMatrix.vec3.transformMat4(pos, pos, W);
        glMatrix.vec3.transformMat4(pos, pos, this.M);

        ctx.beginPath();
        ctx.moveTo(pos0[0], pos0[1]);
        ctx.lineTo(pos[0], pos[1]);
        ctx.closePath();
        ctx.strokeStyle = '#0000ff';
        ctx.stroke();
    }

    return CanvasRenderer;
});