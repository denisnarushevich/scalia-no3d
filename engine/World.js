define(["./lib/Octree", "./EventManager", "./GameObjectOctreeItem"], function (Octree, EventManager, OctreeItem) {
    /**
     * @param {Logic} logic
     * @constructor
     */
    function World(logic) {
        EventManager.call(this);
        this.logic = logic;
        this.gameObjects = [];
        this.octree = new Octree(-65535,65535,64, 64);

        this.items = [];
    }

    var p = World.prototype = Object.create(EventManager.prototype);

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
     * @param {GameObject} gameObject
     */
    p.AddGameObject = function(gameObject){
        var octree = this.octree;

        //TODO add bounds. Consider using some logic like if !gameObject.bounds then add poitn.
        if(gameObject.camera !== null){
            var item = new OctreeItem(gameObject.camera.bounds, gameObject);
            this.items[gameObject.instanceId] = item;
            this.octree.Insert(item);    
            
            gameObject.transform.AddListener("update", function(transform){
                //TODO FIX if i want to remove ol bounds from octree, I cant, 
                //because bounds have changed and octree cant find it.
            });
        }else{
            var item = new OctreeItem(gameObject.transform.getPosition(), gameObject);
            this.items[gameObject.instanceId] = item;
            this.octree.Insert(item);    
        }
        
        

        /*gameObject.transform.AddListener("update", function(sender){
            octree.Remove(sender.gameObject.mesh.bounds);
            octree.Insert(sender.gameObject.mesh.bounds);
        }); */

        //this.DispatchEvent(this.events.onNewGameObject, gameObject)

        this.gameObjects[this.gameObjectsCount++] = gameObject;
        gameObject.world = this;
    }

p.items;

    p.Retrieve = function(gameObject){
        var item = this.items[gameObject.instanceId];
        arr = this.octree.Retrieve(item);

        for(var i = 0; i < arr.length; i++){
            arr[i] = arr[i].gameObject;
        }

        return arr;
    }

    p.Tick = function(){
        for(var i = 0; i < this.gameObjectsCount; i++){
            this.gameObjects[i].Tick();
        }
    }

    return World;
});