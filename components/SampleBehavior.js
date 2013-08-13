define(['../engine/engine'], function(scalia){
    function SampleBehavior(){

    }

    SampleBehavior.prototype = Object.create(scalia.Component.prototype);
    SampleBehavior.prototype.constructor = SampleBehavior;

    SampleBehavior.transform = null;

    SampleBehavior.prototype.start = function(){
        this.transform = this.gameObject.getComponent(scalia.TransformComponent);
    }

    SampleBehavior.prototype.tick = function(){
        this.transform.translate(Math.random()*10-5,0,Math.random()*10-5);
    }

    return SampleBehavior;
});
