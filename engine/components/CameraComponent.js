define(["../lib/gl-matrix","../Component", "../lib/BoundingBox"], function(glMatrix, Component, BoundingBox){

    /**
     * @constructor
     */
    function CameraComponent(){
        Component.call(this);
        this.projectionMatrix = new Float32Array(16);
        this.size = [0,0,0];
        this.frustumSize = [[0,0,0],[0,0,0]];
        this.frustumBox = [[0,0,0],[0,0,0]];
        this.bounds = new BoundingBox();
        this.worldToScreenMatrix = new Float32Array(16);
        this.worldToViewportMatrix = new Float32Array(16);

        this.events = {
            update: 0,
            viewportSet: 1,
            viewportRemoved: 2
        }


    }

    var p = CameraComponent.prototype = Object.create(Component.prototype);

    p.size = null;
    p.bounds = null;
    p.frustumSize = null;
    p.frustumBox = null;
    p.projectionMatrix = null;

    p.worldToScreenMatrix = null;
    p.worldToViewportMatrix = null;

    //p.backgroundPattern = null;

    p.start = function(){
        var cam = this;
        //glMatrix.mat4.mul(cam.worldToViewportMatrix, cam.projectionMatrix, cam.gameObject.transform.getWorldToLocal());
    }

    p.setup = function(width, height, length){
        //update sizes
        this.size = [width, height, length];

        //update frustum size
        this.frustumSize = [[-width/2,-height/2,0],[width/2,height/2,length]];

        //update frustumbox
        var localToWorld = this.gameObject.transform.getLocalToWorld();
        glMatrix.vec3.transformMat4(this.frustumBox[0], this.frustumSize[0], localToWorld);
        glMatrix.vec3.transformMat4(this.frustumBox[1], this.frustumSize[1], localToWorld);

        //update projection matrix
        glMatrix.mat4.ortho(this.projectionMatrix, -width/2,width/2,-height/2,height/2,0,length);

        //update obbox
        this.bounds.Calculate(this.frustumBox);
    }

    p.setViewport = function(viewport){
        this.viewport = viewport;

        this.setup(viewport.size[0], viewport.size[1], 100);

        var cam = this;
        this.viewport.addEventListener(this.viewport.events.resize, function(viewport){
            cam.setup(viewport.size[0], viewport.size[1], 100);

            glMatrix.mat4.mul(cam.worldToViewportMatrix, cam.projectionMatrix, cam.gameObject.transform.getWorldToLocal());
        });

        this.dispatchEvent(this.events.viewportSet, this);
    }

    p.removeViewport = function(){
        this.dispatchEvent(this.events.viewportRemoved, this);
        this.viewport = null;
    }

    p.setGameObject = function(gameObject){
        Component.prototype.setGameObject.call(this, gameObject);

        var cam = this;

        gameObject.transform.addEventListener(gameObject.transform.events.Update, function(){

            //update frustumbox
            var localToWorld = cam.gameObject.transform.getLocalToWorld();
            glMatrix.vec3.transformMat4(cam.frustumBox[0], cam.frustumSize[0], localToWorld);
            glMatrix.vec3.transformMat4(cam.frustumBox[1], cam.frustumSize[1], localToWorld);

            //update wTv mat
            glMatrix.mat4.mul(cam.worldToViewportMatrix, cam.projectionMatrix, cam.gameObject.transform.getWorldToLocal());

            //update obbox
            cam.bounds.Calculate(cam.frustumBox);


            cam.dispatchEvent(cam.events.Update);
        });
    }

    p.getWorldToScreen = function(){
        return glMatrix.mat4.mul(this.worldToScreenMatrix, this.viewport.viewportMatrix, this.worldToViewportMatrix);
    }

    p.getWorldToViewport = function(){
        return this.worldToViewportMatrix;
    }

    p.getScreenToWorld = function(){
        var a = [];

        console.log(glMatrix.mat4.invert(a, this.getWorldToViewport()));
        return a;
    }

    return CameraComponent;
});

