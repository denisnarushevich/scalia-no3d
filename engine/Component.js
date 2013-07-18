define(["./EventManager"], function (EventManager) {
    /**
     * Every component has attached game object.
     * @param {GameObject} gameObject
     * @constructor
     */
    function Component(gameObject) {
        EventManager.call(this);
        this.gameObject = gameObject;
    }

    var p = Component.prototype = Object.create(EventManager.prototype);

    /**
     * @type {GameObject}
     * @read-only
     */
    p.gameObject = null;

    p.start = function(){

    }

    p.tick = function(){

    }

    return Component;
});