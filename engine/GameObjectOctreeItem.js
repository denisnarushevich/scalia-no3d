define(["./lib/Octree"], function(Octree){
    function GameObjectOctreeItem(data, gameObject){
        Octree.Item.call(this, data);
        this.gameObject = gameObject;
    }
    
    var p = GameObjectOctreeItem.prototype = Object.create(Octree.Item.prototype);
    
    p.gameObject = null;
    
    return GameObjectOctreeItem;
});