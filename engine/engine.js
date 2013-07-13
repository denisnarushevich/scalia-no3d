define([
    './utils/base',
    './Game',
    './GameObject',
    './Component',
    './gameObjects/Camera',
    './components/CameraComponent',
    './components/TransformComponent',
    './components/SpriteComponent',
], function (utils, Game, GameObject, Component, Camera, CameraComponent, TransformComponent, SpriteComponent) {
    return window.scaliaEngine = {
        utils: utils,
        Game: Game,
        GameObject: GameObject,
        Component: Component,
        gameObjects: {
            Camera: Camera
        },
        components: {
            CameraComponent: CameraComponent,
            TransformComponent: TransformComponent,
            SpriteComponent: SpriteComponent
        }
    };
});