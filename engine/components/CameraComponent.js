define(["../lib/gl-matrix","../Component", "../lib/BoundingBox"], function(glMatrix, Component, BoundingBox){

    /**
     * @constructor
     */

    function CameraComponent(gameObject, width, height, length){
        Component.call(this, gameObject);
        this.projectionMatrix = [];
        this.size = [width, height,length];
        this.frustum = [[-width/2,-height/2,0],[width/2,height/2,length]];
        this.bounds = BoundingBox.Create();
        
        glMatrix.mat4.ortho(this.projectionMatrix, -width/2,width/2,height/2,-height/2,0,length);
        
        this.frustumUpdate();
        this.calculateBounds();
        
        var that = this;
        gameObject.transform.AddListener(gameObject.transform.events.Update, function(){
            that.frustumUpdate();
            that.calculateBounds();
            that.DispatchEvent(that.events.Update);
        });
    }

    var p = CameraComponent.prototype = Object.create(Component.prototype);

    p.size = null;
    p.bounds = null;
    p.frustum = null;
    p.projectionMatrix = null;

    p.frustumUpdate = function(){
        var localToWorld = this.gameObject.transform.getLocalToWorld();
       glMatrix.vec3.transformMat4(this.frustum[0], this.frustum[0], localToWorld); 
       glMatrix.vec3.transformMat4(this.frustum[1], this.frustum[1], localToWorld); 
    }
    
    p.calculateBounds = function(){
        BoundingBox.Calculate(this.bounds, this.frustum);
    }

    return CameraComponent;
});

