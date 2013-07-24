define(["./CanvasRenderer", './EventManager', './Layers'], function (CanvasRenderer, EventManager, Layers) {
    /**
     * @param {CameraObject} camera
     * @constructor
     */
    function Viewport(graphics) {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext("2d");
        this.graphics = graphics;
        this.eventmgr = new EventManager();
        this.size = [];

        this.eventmgr.events = {
            update: 0
        }

        this.viewportMatrix = new Float32Array(16);

        //generate layers
        this.layers = [];
        for (var i = 0; i < Layers.layers.length; i++) {
            var cnv = document.createElement("canvas");
            this.layers[i] = cnv.getContext("2d");
        }



    }

    var p = Viewport.prototype;

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

    /**
     * EventManager instance
     * @type {EventManager}
     */
    p.eventmgr = null;

    /**
     * @return {*}
     */
    p.render = function () {
        if(this.canvas.offsetWidth !== this.size[0] || this.canvas.offsetHeight !== this.size[1])
            this.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);

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

        this.eventmgr.DispatchEvent(this.eventmgr.events.update, this);
    }

    p.setCamera = function(camera){
        this.camera = camera;
        this.camera.camera.setViewport(this);
    }

    return Viewport;
});