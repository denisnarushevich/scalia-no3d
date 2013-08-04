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

    p.started = false;

    /**
     * Array with gameObjects
     * @param {GameObject} gameObject
     */
    p.addGameObject = function(gameObject){
        this.gameObjects[this.gameObjectsCount++] = gameObject;
        gameObject.setWorld(this);
        if(this.started)
            gameObject.start();

        if(gameObject.transform.children.length !== 0){
            for(var i = 0; i < gameObject.transform.children.length; i++){
                var child = gameObject.transform.children[i].gameObject;
                this.addGameObject(child);
            }
        }
    }

    p.removeGameObject = function(gameObject){
        this.gameObjects.splice(this.gameObjects.indexOf(gameObject), 1);
        this.gameObjectsCount--;

        if(gameObject.transform.children.length !== 0){
            for(var i = 0; i < gameObject.transform.children.length; i++){
                var child = gameObject.transform.children[i].gameObject;
                this.removeGameObject(child);
            }
        }
    }

    p.retrieve = function(gameObject){
        return this.gameObjects.slice(0);
    }

    p.start = function(){
        this.started = true;
        for(var i = 0; i < this.gameObjectsCount; i++)
            this.gameObjects[i].start();
    }

    p.tick = function(){
        for(var i = 0; i < this.gameObjectsCount; i++){
            this.gameObjects[i].tick();
        }
    }

    return World;
});