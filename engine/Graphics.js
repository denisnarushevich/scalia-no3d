define(["./Viewport", "./CanvasRenderer"], function (Viewport, CanvasRenderer) {
    /**
     * @constructor
     */
    function Graphics(game) {
        this.game = game;
        this.viewports = [];
        this.renderer = new CanvasRenderer();
    }

    var p = Graphics.prototype;

    /**
     * @type {Game}
     */
    p.game = null;

    /**
     * @type {Viewport[]}
     */
    p.viewports = null;

    p.start = function(){
        var viewports = this.viewports,
            viewportsCount = viewports.length;
        for(var i = 0; i < viewportsCount; i++){
            viewports[i].start();
        }
    }

    /**
     * @param {CameraComponent} camera
     * @return {Viewport}
     */
    p.CreateViewport = function(){
        var viewport = new Viewport(this);
        this.viewports.push(viewport);
        return viewport;
    }

    /**
     * @return {void}
     */
    p.Render = function(){
        var viewports = this.viewports,
            viewportsCount = viewports.length;
        for(var i = 0; i < viewportsCount; i++){
            viewports[i].render();
        }
    }

    return Graphics;
});
