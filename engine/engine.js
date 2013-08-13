define([
    './config',
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
], function (config, Game, GameObject, Component, Layers, Camera, CameraComponent, TransformComponent, SpriteComponent, glMatrix, AssetManager) {
    return window.scaliaEngine = {
        config: config,
        Game: Game,
        GameObject: GameObject,
        Component: Component,
        Layers: Layers,
        Camera: Camera,
        CameraComponent: CameraComponent,
        TransformComponent: TransformComponent,
        SpriteComponent: SpriteComponent,
        glMatrix: glMatrix,
        Assets: AssetManager
    };
});