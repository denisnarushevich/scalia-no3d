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
    p.AddGameObject = function(gameObject){
        this.gameObjects[this.gameObjectsCount++] = gameObject;
        gameObject.world = this;
    }

    p.Retrieve = function(gameObject){
        return this.gameObjects.slice(0);
    }

    p.Tick = function(){
        for(var i = 0; i < this.gameObjectsCount; i++){
            this.gameObjects[i].Tick();
        }
    }

    return World;
});