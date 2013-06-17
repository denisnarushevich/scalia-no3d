define(["./lib/BoundingBox"], function(BoundingBox){
   var GameObjectBoundingBox = Object.create(BoundingBox);

    GameObjectBoundingBox.Create = function(min, max, gameObject){
        var boundingBox = BoundingBox.Create(min, max);
        boundingBox.gameObject = gameObject;
        return boundingBox;
    }

    return GameObjectBoundingBox;
});