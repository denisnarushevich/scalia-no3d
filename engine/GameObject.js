define(['./components/TransformComponent', './components/CameraComponent', "./components/SpriteComponent"], function (Transform, Camera, Sprite) {
    /**
     * Base object
     * @constructor
     */
    function GameObject() {
        this.instanceId = GameObject.prototype.instanceId++;
        this.components = [];
        this.addComponent(new Transform(this));
    }

    var p = GameObject.prototype;

    /**
     * @type {Number}
     */
    p.instanceId = 0;

    /**
     * Layer index
     * @type {int}
     */
    p.layer = 0;

    /**
     * Reference to world object
     * @private
     * @type {World}
     */
    p.world = null;

    /**
     * Transform component attached to this game object.
     * @type {Transform}
     */
    p.transform = null;

    /**
     * Camera component attached to this game object.
     * @type {Camera}
     */
    p.camera = null;

    /**
     * @type {Component[]}
     */
    p.components = null;

    /**
     * @type {number}
     */
    p.componentsCount = 0;

    /**
     * @param {World} world
     */
    p.setWorld = function(world){
        this.world = world;



        for(var i = 0; i < this.componentsCount; i++){
            this.components[i].start();
        }
    }

    /**
     * @public
     * @param {Component} component
     * @return {*}
     */
    p.addComponent = function(component){
        if(component instanceof Transform){
            this.transform = component;
        }else if(component instanceof Camera){
            this.camera = component;
        }else if(component instanceof Sprite){
            this.sprite = component;
        }

        this.components[this.componentsCount++] = component;

        component.gameObject = this;
    }

    p.getComponent = function(Type){
        for(var i = 0; i < this.components.length; i++){
            var component = this.components[i];
            if(component instanceof Type)
                return component;
        }
    }

    p.tick = function(){
        //console.log(this)
        for(var i = 0; i < this.componentsCount; i++){
            this.components[i].tick();
        }
    }

    return GameObject;
});