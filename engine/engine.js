define([
    './utils/base',
    './Game',
    './GameObject',
    './Component',
    './gameObjects/Camera',
    './gameObjects/Plane',
    './components/CameraComponent',
    './components/TransformComponent',
    './components/SpriteComponent',
], function (utils, Game, GameObject, Component, Camera, Plane, CameraComponent, TransformComponent, SpriteComponent) {
    return window.scaliaEngine = {
        utils: utils,
        Game: Game,
        GameObject: GameObject,
        Component: Component,
        gameObjects: {
            Camera: Camera,
            Plane: Plane
        },
        components: {
            CameraComponent: CameraComponent,
            TransformComponent: TransformComponent,
            SpriteComponent: SpriteComponent
        }
    };
});