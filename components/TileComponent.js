define(['../engine/engine'], function(scalia){
    function TileComponent(){

    }

    TileComponent.prototype = Object.create(scalia.Component.prototype);

    TileComponent.prototype.x = 0;
    TileComponent.prototype.y = 0;

    return TileComponent;
});
