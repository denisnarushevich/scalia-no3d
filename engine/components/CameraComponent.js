define(["../lib/gl-matrix","../Component", "../lib/BoundingBox"], function(glMatrix, Component, BoundingBox){

    /**
     * @constructor
     */
    function CameraComponent(){
        Component.call(this);
        this.projectionMatrix = new Float32Array(16);
        this.frustumBox = [[],[]];
        this.bounds = new BoundingBox();
        this.worldToScreenMatrix = new Float32Array(16);
        this.worldToViewportMatrix = new Float32Array(16);
    }

    var p = CameraComponent.prototype = Object.create(Component.prototype);

    p.size = null;
    p.bounds = null;
    p.frustumSize = null;
    p.frustumBox = null;
    p.projectionMatrix = null;

    p.worldToScreenMatrix = null;
    p.worldToViewportMatrix = null;

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

        //update aabbox
        this.bounds.Calculate(this.frustumBox);
    }

    p.frustumUpdate = function(){
        var localToWorld = this.gameObject.transform.getLocalToWorld();
       glMatrix.vec3.transformMat4(this.frustumBox[0], this.frustumBox[0], localToWorld);
       glMatrix.vec3.transformMat4(this.frustumBox[1], this.frustumBox[1], localToWorld);
    }

    p.calculateBounds = function(){
       this.bounds.Calculate(this.frustumBox);
    }

    p.setViewport = function(viewport){
        this.viewport = viewport;

        this.setup(viewport.size[0], viewport.size[1], 100);

        var cam = this;
        this.viewport.eventmgr.AddListener(this.viewport.eventmgr.events.update, function(viewport){
            cam.setup(viewport.size[0], viewport.size[1], 100);

            //glMatrix.mat4.mul(cam.worldToViewportMatrix, cam.projectionMatrix, cam.gameObject.transform.getWorldToLocal());
            //glMatrix.mat4.mul(cam.worldToScreenMatrix, viewport.viewportMatrix, cam.worldToViewportMatrix);
        });
    }

    p.setGameObject = function(gameObject){
        Component.prototype.setGameObject.call(this, gameObject);

        var cam = this;
        gameObject.transform.AddListener(gameObject.transform.events.Update, function(){
            cam.frustumUpdate();
            cam.calculateBounds();
            cam.DispatchEvent(cam.events.Update);

            //glMatrix.mat4.mul(cam.worldToViewportMatrix, cam.projectionMatrix, cam.gameObject.transform.getWorldToLocal());
            //glMatrix.mat4.mul(this.worldToScreenMatrix, this.viewport.viewportMatrix, this.worldToViewportMatrix);
        });
    }

    return CameraComponent;
});

