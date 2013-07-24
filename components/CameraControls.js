define(['../engine/engine'], function (scalia) {
    function CameraControls() {
        var pos, cc = this;

        document.onmousedown = function (e) {
            pos = [e.pageX, e.pageY];
            //pos = scalia.gl.vec3.transformMat4([], [e.pageX-cc.gameObject.camera.size[0]/2, e.pageY-cc.gameObject.camera.size[1]/2, 0], scalia.gl.mat4.invert([],cc.gameObject.transform.getLocalToWorld()));
        }

        document.onmouseup = function (e) {
            pos = null;
        }


        document.onmousemove = function (e) {
            //console.log(scalia.gl.vec3.transformMat4([], [e.pageX-cc.gameObject.camera.size[0]/2, e.pageY-cc.gameObject.camera.size[1]/2, 0], scalia.gl.mat4.invert([],cc.gameObject.transform.getLocalToWorld())));

            if (pos) {
                var x = e.pageX - pos[0];
                var y = e.pageY - pos[1];
                pos[0] = e.pageX;
                pos[1] = e.pageY;

                //var a = [];
                //scalia.gl.vec2.transformMat4(a, [x,y],cc.gameObject.transform.localToWorld);

                //cc.gameObject.transform.translate(-x,0,0); //look fine, but it raises camera(by Y axris), instead of moving it by Z axis.
                //cc.gameObject.transform.translate(y*1/Math.cos(45*Math.PI/180),0,y*1/Math.cos(45*Math.PI/180),'world');
                //cc.gameObject.transform.translate(-x+y,0,x+y, 'world');
                cc.gameObject.transform.translate(
                    -x * Math.cos(45 * Math.PI / 180) + y / Math.cos(45 * Math.PI / 180),
                    0,
                    x * Math.cos(45 * Math.PI / 180) + y / Math.cos(45 * Math.PI / 180),
                    'world'
                );
            }
        }

        /*
         document.onmousemove = function(e){
         if(pos){
         var pos1 = scalia.gl.vec3.transformMat4([], [e.pageX-cc.gameObject.camera.size[0]/2, 0, e.pageY-cc.gameObject.camera.size[1]/2], scalia.gl.mat4.invert([],cc.gameObject.transform.getLocalToWorld()));
         var x = pos1[0] - pos[0];
         var y = pos1[0] - pos[0];
         var z = pos1[0] - pos[0];
         pos = pos1;

         var a = [];
         //scalia.gl.vec2.transformMat4(a, [x,y],cc.gameObject.transform.localToWorld);

         cc.gameObject.transform.translate(x,y,z); //look fine, but it raises camera(by Y axris), instead of moving it by Z axis.
         //cc.gameObject.transform.translate(-x+y,0,x+y, 'world');
         }
         }    */
    }

    CameraControls.prototype = Object.create(scalia.Component.prototype);

    return CameraControls;
});
