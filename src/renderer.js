// renderer.js
import { sharedState } from './sharedState.js';
import { gameState, initializeGameState, updateGameState, handleInput } from './gameState.js';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('renderCanvas');
  if (!canvas) {
    console.error('Canvas not found in index.html');
    return;
  }

  // Initialize game and shared state
  initializeGameState();
  sharedState.initialize(canvas);
  sharedState.startRenderLoop();

  // Game loop (assuming 60 FPS)
  let lastTime = performance.now();
  function gameLoop() {
    const currentTime = performance.now();
    const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
    updateGameState(deltaTime);
    lastTime = currentTime;
    requestAnimationFrame(gameLoop);
  }
  gameLoop();

  // Example input handling (adjust based on your input system)
  document.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowUp':
        handleInput('move', { x: 0, y: 1 }); // Thrust forward
        break;
      case 'ArrowLeft':
        handleInput('rotate', -0.1); // Rotate left
        break;
      case 'ArrowRight':
        handleInput('rotate', 0.1); // Rotate right
        break;
      case ' ':
        handleInput('shoot', true); // Fire bullet
        break;
    }
  });
});