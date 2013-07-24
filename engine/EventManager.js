define(function () {
    function EventManager() {
        this.eventListeners = {};
    }

    var p = EventManager.prototype;

    p.events = {
        Update: "Update"
    };

    p.eventListeners = null;

    p.addEventListener = function (event, callback) {
        var listeners = this.eventListeners[event];

        if (listeners)
            listeners[listeners.length] = callback;
        else
            listeners = [callback];

        this.eventListeners[event] = listeners;
    }

    p.dispatchEvent = function (event, sender) {
        var listeners = this.eventListeners[event],
            listenersCount = listeners === undefined ? 0 : listeners.length;

        if(listenersCount === 0)
            return;

        for (var i = 0; i < listenersCount; i++)
            listeners[i](sender);
    }

    p.removeListener = function(event, callback){
        throw "EventManager.RemoveListener: not implemented";
    }

    return EventManager;
});
