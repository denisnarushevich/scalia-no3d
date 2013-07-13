define(function () {
    /**
     * @param {Logic} logic
     * @constructor
     */
    function World(logic) {
        this.logic = logic;
        this.gameObjects = [];
        this.layers = [];
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
     * World axes is orthogonal
     * @type {boolean}
     */
    p.orthogonal = true;

    p.layers = null;

    /**
     * @param {GameObject} gameObject
     */
    p.AddGameObject = function(gameObject){
        this.gameObjects[this.gameObjectsCount++] = gameObject;
        gameObject.world = this;

        this.layers[gameObject.layer] = this.layers[gameObject.layer] || [];
        this.layers[gameObject.layer].push(gameObject);
    }

    p.Retrieve = function(gameObject){
        return this.gameObjects;
    }

    p.Tick = function(){
        for(var i = 0; i < this.gameObjectsCount; i++){
            this.gameObjects[i].Tick();
        }
    }

    return World;
});