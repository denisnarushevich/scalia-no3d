define(["../Component", "../lib/gl-matrix"], function (Component, glMatrix) {
    /**
     * Create Transform component.
     * Every component has a game object.
     * @param {GameObject} gameObject
     * @constructor
     */
    function Transform(gameObject) {
        Component.call(this, gameObject);

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

    var p = Transform.prototype = Object.create(Component.prototype),
        bufferVec3 = new Float32Array([0, 0, 0]),
        bufferMat4 = new Float32Array(16);

    p.local = null;

    p.localToWorld = null;

    p.worldToLocal = null;

    p.children = null;

    p.parent = null;

    /**
     * @param {Transform} children
     */
    p.AddChildren = function (children) {
        children.parent = this;
        this.children[this.children.length] = children;
        this.CalculateLocalMatrix();
    }

    p.translate = function (x, y, z, relativeTo) {
        var inputVec = bufferVec3,
            tmpMat = bufferMat4;

        inputVec[0] = x;
        inputVec[1] = y;
        inputVec[2] = z;

        if (relativeTo === "world") {
            glMatrix.mat4.identity(tmpMat);
            glMatrix.mat4.translate(tmpMat, tmpMat, inputVec);
            glMatrix.mat4.multiply(this.local, tmpMat, this.local);
        } else
            glMatrix.mat4.translate(this.local, this.local, inputVec);

        this.dispatchEvent(this.events.Update, this);
    }

    p.rotate = function (x, y, z, relativeTo) {
        var degreeToRad = Math.PI / 180;

        if (relativeTo === "world") {
            var tmp = glMatrix.mat4.create();

            glMatrix.mat4.rotateZ(tmp, tmp, z * degreeToRad);
            glMatrix.mat4.rotateY(tmp, tmp, y * degreeToRad);
            glMatrix.mat4.rotateX(tmp, tmp, x * degreeToRad);

            glMatrix.mat4.multiply(this.local, tmp, this.local);
        } else {
            glMatrix.mat4.rotateZ(this.local, this.local, z * degreeToRad);
            glMatrix.mat4.rotateY(this.local, this.local, y * degreeToRad);
            glMatrix.mat4.rotateX(this.local, this.local, x * degreeToRad);
        }

        this.dispatchEvent(this.events.Update, this);
    }

    p.getLocalToWorld = function () {
        if (this.parent === null) {
            glMatrix.mat4.copy(this.localToWorld, this.local);
        } else {
            glMatrix.mat4.multiply(this.localToWorld, this.parent.getLocalToWorld(), this.local)

        }

        glMatrix.mat4.invert(this.worldToLocal, this.localToWorld);

        return this.localToWorld;
    }

    p.getWorldToLocal = function () {
        return this.worldToLocal;      //if you made changes to transform, then this one should be updated.
    }

    p.getPosition = function (out) {
        if (out === undefined)
            out = [];

        var m = this.getLocalToWorld();

        out[0] = m[12];
        out[1] = m[13];
        out[2] = m[14];

        return out;
    }

    p.getLocalPosition = function (out) {
        if (out === undefined)
            out = [];

        var m = this.local;

        out[0] = m[12];
        out[1] = m[13];
        out[2] = m[14];

        return out;
    }

    p.getRotation = function () {
        throw "TransformComponent.getRotation not implemented yet";
    }

    p.getLocalRotation = function () {
        throw "TransformComponent.getLocalRotation not implemented yet";
    }

    p.setPosition = function (x, y, z) {
        console.log(this.local);

        bufferVec3[0] = x;
        bufferVec3[1] = y;
        bufferVec3[2] = z;

        //transform given world position into local position
        if(this.parent !== null)
            glMatrix.vec3.transformMat4(bufferVec3, bufferVec3, this.getWorldToLocal());

        //set local position for local transform
        this.local[12] = bufferVec3[0];
        this.local[13] = bufferVec3[1];
        this.local[14] = bufferVec3[2];

        console.log(this.local);

        this.dispatchEvent(this.events.Update, this);
    }

    return Transform;
});
