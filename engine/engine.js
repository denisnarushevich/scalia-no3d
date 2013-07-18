define([
    './Game',
    './GameObject',
    './Component',
    './Layers',
    './gameObjects/Camera',
    './components/CameraComponent',
    './components/TransformComponent',
    './components/SpriteComponent',
    './lib/gl-matrix',
    './AssetManager'
], function (Game, GameObject, Component, Layers, Camera, CameraComponent, TransformComponent, SpriteComponent, glMatrix, AssetManager) {
    return window.scaliaEngine = {
        Game: Game,
        GameObject: GameObject,
        Component: Component,
        Layers: Layers,
        gameObjects: {
            Camera: Camera
        },
        components: {
            CameraComponent: CameraComponent,
            TransformComponent: TransformComponent,
            SpriteComponent: SpriteComponent
        },
        gl: glMatrix,
        Assets: AssetManager
    };
});