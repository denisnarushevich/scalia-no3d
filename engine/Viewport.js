define(["./CanvasRenderer", './EventManager', './Layers'], function (CanvasRenderer, EventManager, Layers) {
    /**
     * @param {CameraObject} camera
     * @constructor
     */
    function Viewport(graphics) {
        EventManager.call(this);
        this.events = {
            update: 0,
            resize: 1
        }

        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext("2d");
        this.graphics = graphics;
        this.size = [0,0];

        this.viewportMatrix = new Float32Array(16);

        //generate layers
        this.layers = [];
        for (var i = 0; i < Layers.layers.length; i++) {
            var cnv = document.createElement("canvas");
            this.layers[i] = cnv.getContext("2d");
        }

        var viewport = this;
        window.addEventListener('resize', function(){
            viewport.setSize(viewport.canvas.offsetWidth, viewport.canvas.offsetHeight);
        });
    }

    var p = Viewport.prototype = Object.create(EventManager.prototype);

    /**
     * @type {int[]}
     */
    p.size = null;

    /**
     * 4x4 viewport matrix
     * @type {Array}
     */
    p.viewportMatrix = null;

    /**
     * @type {CameraObject}
     */
    p.camera = null;

    /**
     * @type {HTMLCanvasElement}
     */
    p.canvas = null;

    /**
     * @type {CanvasRenderingContext2D}
     */
    p.context = null;

    p.start = function(){
        this.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
    }

    /**
     * @return {*}
     */
    p.render = function () {
        if(this.camera !== null)
            this.graphics.renderer.Render(this.camera, this);
    }

    /**
     * @param {int[]} size Vector2. Size of the viewport
     * @constructor
     */
    p.setSize = function (width, height) {
        this.size[0] = width;
        this.size[1] = height;

        this.canvas.width = width;
        this.canvas.height = height;

        //update viewport matrix
        this.viewportMatrix[0] = (width/2)|0;
        this.viewportMatrix[5] = -(height/2)|0;
        this.viewportMatrix[12] = (width/2)|0;
        this.viewportMatrix[13] = (height/2)|0;

        //update layer sizes
        for (var i = 0; i < this.layers.length; i++) {
            var ctx = this.layers[i];
            ctx.canvas.width = width;
            ctx.canvas.height = height;
        }

        this.dispatchEvent(this.events.resize, this);
    }

    p.setCamera = function(camera){
        //this.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);//kostql
        this.camera = camera;
        this.camera.camera.setViewport(this);
    }

    return Viewport;
});