define(["../engine/engine"], function (scalia) {
    function Player() {
        scalia.GameObject.call(this);
    }

    Player.prototype = Object.create(scalia.GameObject.prototype);

    return Player;
});
