define(function () {
    /**
     * @param {Logic} logic
     * @constructor
     */
    function World(logic) {
        this.logic = logic;
        this.gameObjects = [];
    }

    var p = World.prototype;

    /**
     * @type {Logic}
     */
    p.logic = null;

    /**
     * @type {GameObject[]}
     */
    p.gameObjects = null;

    /**
     * @type {number}
     */
    p.gameObjectsCount = 0;

    /**
     * Array with gameObjects
     * @param {GameObject} gameObject
     */
    p.addGameObject = function(gameObject){
        this.gameObjects[this.gameObjectsCount++] = gameObject;
        gameObject.setWorld(this);
    }

    p.retrieve = function(gameObject){
        return this.gameObjects.slice(0);
    }

    p.tick = function(){
        for(var i = 0; i < this.gameObjectsCount; i++){
            this.gameObjects[i].tick();
        }
    }

    return World;
});