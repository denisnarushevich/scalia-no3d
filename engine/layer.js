define(function(){
    function Layer(index, width, height){
        this.index = index;
        this.canvas = document.createElement("canvas");
        this.canvas.width =  width;
        this.canvas.height = height;
        this.context = this.canvas.getContext("2d");
    }

    Layer.prototype.index = 0;
    Layer.prototype.canvas = null;
    Layer.prototype.context = null;
    Layer.prototype.depthSortingEnabled = true;
    Layer.prototype.doClean = true;

    return Layer;
});
