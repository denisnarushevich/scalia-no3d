define(['../engine/engine'], function(scalia){
    function CameraControls(){
        var pos, cc = this;

        document.onmousedown = function(e){
            pos = [e.pageX, e.pageY];
        }

        document.onmouseup = function(e){
            pos = null;
        }

        document.onmousemove = function(e){
            if(pos){
                var x = e.pageX - pos[0];
                var y = e.pageY - pos[1];
                pos[0] = e.pageX;
                pos[1] = e.pageY;

                var a = [];
                //scalia.gl.vec2.transformMat4(a, [x,y],cc.gameObject.transform.localToWorld);

                cc.gameObject.transform.translate(-x,y,0); //look fine, but it raises camera(by Y axris), instead of moving it by Z axis.
                //cc.gameObject.transform.translate(-x+y,0,x+y, 'world');
            }
        }
    }

    CameraControls.prototype = Object.create(scalia.Component.prototype);

    return CameraControls;
});
