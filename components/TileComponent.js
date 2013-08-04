define(['../engine/engine', '../gameObjects/Ball'], function (scalia, Ball) {
    function TileComponent() {
        scalia.Component.call(this);
        this.events = {
            dataSet: 0
        }
    }

    TileComponent.prototype = Object.create(scalia.Component.prototype);

    TileComponent.prototype.x = 0;
    TileComponent.prototype.y = 0;

    TileComponent.prototype.start = function () {
        var transform = this.gameObject.transform;
        this.lifting = true
        transform.translate(0,-(Math.random()*400+100),0);
    }

    TileComponent.prototype.setData = function(data){
        this.data = data;

        /*
        if (Math.random() > 0.75) {
            var ball = new Ball();
            var pos = this.gameObject.transform.getPosition();
            ball.transform.translate(pos[0], 0, pos[2], "world");
            this.gameObject.world.addGameObject(ball);


        }   */

        if(data.ownerId === 1){
            this.gameObject.sprite.image = this.gameObject.sprite.image2;
        }

        this.dispatchEvent(this.events.dataSet, this);
    }

    TileComponent.prototype.tick = function(){
        if(this.lifting)
            this.gameObject.transform.translate(0,Math.abs(this.gameObject.transform.getLocalPosition()[1]/3),0);
        else
            this.lifting = false
    }

    return TileComponent;
});
