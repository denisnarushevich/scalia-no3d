define(["./CanvasRenderer"], function (CanvasRenderer) {
    /**
     * @param {CameraObject} camera
     * @constructor
     */
    function Viewport(camera, width, height, graphics) {
        this.graphics = graphics;
        this.camera = camera;

        this.viewportMatrix = new Float32Array([
            (width / 2) | 0, 0, 0, 0,
            0, -(height / 2) | 0, 0, 0,
            0, 0, 1, 0,
            (width / 2) | 0, (height / 2) | 0, 0, 1
        ]);;

        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");

        this.SetSize([width, height]);

        this.renderer = new CanvasRenderer(this);
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
     * @return {*}
     */
    p.Render = function () {
        this.renderer.Render();
    }

    /**
     * @param {int[]} size Vector2. Size of the viewport
     * @constructor
     */
    p.SetSize = function (size) {
        this.size = size;

        this.canvas.width = size[0];
        this.canvas.height = size[1];

        //update viewport matrix
        this.viewportMatrix[0] = (size[0]/2)|0;
        this.viewportMatrix[5] = -(size[1]/2)|0;
        this.viewportMatrix[12] = (size[0]/2)|0;
        this.viewportMatrix[13] = (size[1]/2)|0;
    }

    return Viewport;
});