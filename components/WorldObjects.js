define([
    "../engine",
    "../gameObjects/Tree1",
    "../gameObjects/Tree2"
], function(engine, Tree1, Tree2){
    function WorldObjects(){
        engine.Component.call(this);
    }

    WorldObjects.prototype = Object.create(engine.Component.prototype);

    WorldObjects.prototype.idToObject = {
        0: Tree1,
        1: Tree2
    }

    WorldObjects.prototype.getObjectById = function(objectId){
        return this.idToObject[objectId];
    }

    return WorldObjects;
});
