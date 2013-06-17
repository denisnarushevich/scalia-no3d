define(["../Component", "../lib/gl-matrix"], function(Component, glMatrix) {
    /**
     * Create Transform component.
     * Every component has a game object.
     * @param {GameObject} gameObject
     * @constructor
     */
    function Transform(gameObject) {
        Component.call(this, gameObject);

        this.bufferVec3 = [0,0,0];
        this.bufferMat4 = [];
        
        this.position = [0, 0, 0];
        this.localPosition = [0,0,0];

        this.children = [];

        this.local = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];

        this.localToWorld = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];

        this.worldToLocal = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    }

    var p = Transform.prototype = Object.create(Component.prototype);

    p.dirty = true;

    p.position = null;

    p.localPosition = null;

    p.rotation = null;

    p.localRotation = null;

    p.local = null;

    p.worldMatrix = null;

    p.worldToLocal = null;
 
    p.children = null;

    p.parent = null;

    /**
     * @param {Transform} children
     */
    p.AddChildren = function(children) {
        children.parent = this;
        this.children[this.children.length] = children;
        this.CalculateLocalMatrix();
    }

    p.UpdateMatrices = function() {
        this.UpdateLocalMatrix();
        this.UpdateWorldMatrix();

        for (var i = 0; i < this.children.length; i++) {
            this.children[i].UpdateMatrices();
        }

        this.DispatchEvent(this.events.Update, this);
    }

    /*  p.UpdateLocalMatrix = function() {
     
     glMatrix.mat4.fromRotationTranslation(this.localMatrix, this.quatRotation, this.position);
     glMatrix.mat4.scale(this.localMatrix, this.localMatrix, this.scale);
     }
     */


    p.translate = function(x, y, z, relativeTo) {
        var inputVec = this.bufferVec3,
                tmpMat = this.bufferMat4;
        
        inputVec[0] = x;
        inputVec[1] = y;
        inputVec[2] = z;
        
        if (relativeTo === "world") {
            glMatrix.mat4.identity(tmpMat);
            glMatrix.mat4.translate(tmpMat, tmpMat, inputVec);
            glMatrix.mat4.multiply(this.local, tmpMat, this.local);
        }else
            glMatrix.mat4.translate(this.local, this.local, inputVec);

        this.dirty = true;

        this.DispatchEvent(this.events.Update, this);
    }

    p.rotate = function(x, y, z, relativeTo) {
        var degreeToRad = Math.PI / 180;

        if (relativeTo === "world") {
            var tmp = glMatrix.mat4.create();

            glMatrix.mat4.rotateZ(tmp, tmp, z * degreeToRad);
            glMatrix.mat4.rotateY(tmp, tmp, y * degreeToRad);
            glMatrix.mat4.rotateX(tmp, tmp, x * degreeToRad);

            glMatrix.mat4.multiply(this.local, tmp, this.local);
        }else{
            glMatrix.mat4.rotateZ(this.local, this.local, z * degreeToRad);
            glMatrix.mat4.rotateY(this.local, this.local, y * degreeToRad);
            glMatrix.mat4.rotateX(this.local, this.local, x * degreeToRad);
        }

        this.dirty = true;

        this.DispatchEvent(this.events.Update, this);
    }

    p.getLocalToWorld = function() { //FIX: transformation operations doesn't apply if getLocalToWorld isn't called first.
        if (this.dirty === true) {
            if (this.parent === null) {
                glMatrix.mat4.copy(this.localToWorld, this.local);
            } else {
                glMatrix.mat4.multiply(this.localToWorld, this.parent.getLocalToWorld(), this.local)
                glMatrix.mat4.invert(this.worldToLocal, this.localToWorld);
            }

            this.dirty = false;
        }

        return this.localToWorld;
    }

    p.getWorldToLocal = function() {
        return this.worldToLocal;
    }

    p.getPosition = function() {
        var m = this.getLocalToWorld();
        this.position[0] = m[12];
        this.position[1] = m[13];
        this.position[2] = m[14];
        return this.position;
    }

    p.getLocalPosition = function() {
        var m = this.local;
        this.localPosition[0] = m[12];
        this.localPosition[1] = m[13];
        this.localPosition[2] = m[14];
        return this.localPosition;
    }

    p.getRotation = function() {
        throw "TransformComponent.getRotation not implemented yet";
    }

    p.getLocalRotation = function() {
        throw "TransformComponent.getLocalRotation not implemented yet";
    }
    /*
     p.Rotate = function(x, y, z, relativeTo) {
     var degreeToRad = Math.PI / 180;
     
     if (relativeTo === "world") {
     var quat = [0, 0, 0, 1];
     
     scaliaEngine.utils.glMatrix.quat.rotateZ(quat, quat, z * degreeToRad);
     scaliaEngine.utils.glMatrix.quat.rotateY(quat, quat, y * degreeToRad);
     scaliaEngine.utils.glMatrix.quat.rotateX(quat, quat, x * degreeToRad);
     
     scaliaEngine.utils.glMatrix.quat.multiply(this.quatRotation, quat, this.quatRotation);
     } else {
     scaliaEngine.utils.glMatrix.quat.rotateZ(this.quatRotation, this.quatRotation, z * degreeToRad);
     scaliaEngine.utils.glMatrix.quat.rotateY(this.quatRotation, this.quatRotation, y * degreeToRad);
     scaliaEngine.utils.glMatrix.quat.rotateX(this.quatRotation, this.quatRotation, x * degreeToRad);
     }
     
     this.UpdateMatrices();
     }
     
     p.Translate = function(x, y, z, relativeTo) {
     r = [x, y, z];
     
     if (relativeTo == "world") {
     var tmp = glMatrix.mat4.Create();
     glMatrix.mat4.translate(tmp, tmp, r);
     glMatrix.mat4.multiply(this.position, tmp, this.position);
     } else
     glMatrix.mat4.translate(this.position, this.position, r);
     
     this.UpdateMatrices();
     }
     
     p.Scale = function(x, y, z) {
     glMatrix.mat4.scale(this.localMatrix, this.localMatrix, [x, y, z]);
     
     this.UpdateMatrices();
     }
     */
    return Transform;
});
