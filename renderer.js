// renderer.js
import * as BABYLON from 'babylonjs';
import { gameState } from './gameState';
import { mainRendererInitialized } from './shared';

const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
const scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color4(0, 0, 0, 1); // Black background

// Camera setup for 2D
const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 0, -10), scene);
camera.setTarget(new BABYLON.Vector3(0, 0, 0));
camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
const aspect = canvas.clientWidth / canvas.clientHeight;
camera.orthoLeft = -gameState.world.width / 2 * aspect;
camera.orthoRight = gameState.world.width / 2 * aspect;
camera.orthoBottom = -gameState.world.height / 2;
camera.orthoTop = gameState.world.height / 2;
scene.activeCamera = camera;

// Game objects
const createPlayerMesh = (sceneObj) => {
  const mesh = BABYLON.MeshBuilder.CreateLines('player', {
    points: [
      new BABYLON.Vector3(0, 0.5, 0),
      new BABYLON.Vector3(-0.3, -0.5, 0),
      new BABYLON.Vector3(0.3, -0.5, 0),
      new BABYLON.Vector3(0, 0.5, 0),
    ],
    updatable: true,
  }, sceneObj);
  mesh.color = new BABYLON.Color3(1, 1, 1); // White
  return mesh;
};

const playerMesh = createPlayerMesh(scene);

// Bootstrap and render loop
if (!mainRendererInitialized) {
  mainRendererInitialized = true;

  // Stage 1: Initial setup
  const initializeGame = () => {
    gameState.player.position = { x: 0, y: 0 };
    gameState.player.velocity = { x: 0, y: 0 };
    gameState.player.rotation = 0;

    // Stage 2: Signal completion
    gameState.isInitialized = true;

    // Basic movement (for testing)
    const updateGame = () => {
      const speed = 0.1;
      gameState.player.position.x += speed;
      if (gameState.player.position.x > gameState.world.width / 2) {
        gameState.player.position.x = -gameState.world.width / 2;
      }
    };

    setInterval(updateGame, 16); // ~60 FPS
  };

  initializeGame();
}

// Rendering function
const renderScene = () => {
  if (gameState.isInitialized) {
    playerMesh.position.x = gameState.player.position.x;
    playerMesh.position.y = gameState.player.position.y;
    // Apply rotation later with input
  }
  scene.render();
};

engine.runRenderLoop(renderScene);

// Resize handling
window.addEventListener('resize', () => {
  engine.resize();
  const newAspect = canvas.clientWidth / canvas.clientHeight;
  camera.orthoLeft = -gameState.world.width / 2 * newAspect;
  camera.orthoRight = gameState.world.width / 2 * newAspect;
});