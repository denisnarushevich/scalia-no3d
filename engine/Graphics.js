define(["./Viewport"], function (Viewport) {
    /**
     * @constructor
     */
    function Graphics(game) {
        this.game = game;
        this.viewports = [];
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

    /**
     * Count of canvas layers. Each renderable component(e.g. sprite) can have assigned layer index.
     * @type {int}
     */
    p.layersCount = 2;

    /**
     * @param {CameraComponent} camera
     * @return {Viewport}
     */
    p.CreateViewport = function(camera, size){
        var viewport = new Viewport(camera, size, this);
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
            viewports[i].Render();
        }
    }

    return Graphics;
});
