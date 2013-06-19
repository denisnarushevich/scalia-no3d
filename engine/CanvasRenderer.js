define(["./lib/Octree", "./lib/gl-matrix"], function (Quadtree, glMatrix) {
    function CanvasRenderer(canvas, camera) {
        this.context = canvas.getContext("2d");
        this.camera = camera;
        this.resolution = camera.camera.size;

        var vP = [
            this.resolution[0]/2,0,0,0,
            0,-this.resolution[1]/2,0,0,
            0,0,1,0,
            this.resolution[0]/2, this.resolution[1]/2,0,1
        ];

        //matrix multiplication is associative, it means that we can precalculate camera matrix...
        this.M = glMatrix.mat4.multiply([], this.camera.camera.projectionMatrix, this.camera.transform.getWorldToLocal());
        glMatrix.mat4.multiply(this.M, vP, this.M);
        var that = this;
        //...and keep it updated each time, when camera's worldTolocal matrix changes.
        camera.transform.AddListener(camera.transform.events.Update, function(transform){
            glMatrix.mat4.multiply(that.M, transform.gameObject.camera.projectionMatrix, transform.getWorldToLocal());
            glMatrix.mat4.multiply(that.M, vP, that.M);
        });
    }

    var p = CanvasRenderer.prototype;

    p.Render = function () {
        this.context.clearRect(0, 0, this.resolution[0], this.resolution[1]);

        var camera = this.camera,
            gameObjects = camera.world.Retrieve(camera),
            //gameObjects = camera.world.gameObjects;
            gameObjectsCount = gameObjects.length;
            console.log(gameObjectsCount);
        for (var i = 0; i < gameObjectsCount; i++) {
            var gameObject = gameObjects[i];
            
            if(gameObject === this.camera)continue;
            
            //this.RenderAxis(gameObject);
            
            if (gameObject.sprite !== undefined) {
                this.RenderSprite(gameObject.sprite);
            }
        }
    }

    var bufferVec3 = [0,0,0];
    var bufferMat4 = [];

    p.RenderSprite = function (sprite) {
        glMatrix.vec3.transformMat4(bufferVec3, sprite.gameObject.transform.getPosition(bufferVec3), this.M);
        
        this.context.drawImage(sprite.image, 0, 0, sprite.width, sprite.height, (bufferVec3[0] - sprite.pivot[0]) | 0, (bufferVec3[1] - sprite.pivot[1]) | 0, sprite.width, sprite.height);
    }
    
    p.RenderAxis = function(gameObject){
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