// renderer.js
import { sharedState } from './sharedState.js';
import { gameState, initializeGameState, updateGameState, handleInput } from './gameState.js';

let initPromise = null;
let initResolve = null;

document.addEventListener('DOMContentLoaded', async () => {
  const canvas = document.getElementById('renderCanvas');
  if (!canvas) {
    console.error('renderer: Canvas not found in index.html');
    return;
  }
  console.log('renderer: Canvas found in index.html');

  // Resize canvas to match window
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  console.log('renderer: canvas.width:', canvas.width);
  console.log('renderer: canvas.height:', canvas.height);

  console.log('renderer: window.electronAPI:', window.electronAPI);
  if (window.electronAPI && typeof window.electronAPI.onSetDisplayInfo === 'function') {
    console.log('renderer: onSetDisplayInfo is a function');
    window.electronAPI.onSetDisplayInfo(async (event, { index, bounds }) => {
      console.log(`renderer: Display ${index} bounds:`, bounds);

      let sharedState = await window.electronAPI.getSharedState();
      console.log('renderer: sharedState:', sharedState);

      if (index === 0) {
        console.log('renderer: index === 0');
        initPromise = new Promise((resolve) => {
          initResolve = resolve;
          sharedState.init(canvas);
          console.log('renderer: sharedState.init called');
          sharedState.setDisplayCount(4);
          console.log('renderer: Display count set to 4');
          resolve();
        });
      } else {
        if (!initPromise) {
          initPromise = new Promise((resolve) => {
            initResolve = resolve;
          });
        }
      }
      
      const checkInitialization = () => {
        console.log('renderer: checkInitialization');
        if (sharedState.initialized) {
          console.log('renderer: sharedState.initialized');
          initPromise.then(() => {
            sharedState.addView(index, canvas, bounds);
            console.log('renderer: sharedState.addView called');
    
            console.log('renderer: sharedState.views.length:', sharedState.views.length);
            console.log('renderer: sharedState.displayCount:', sharedState.displayCount);
            
            // Start the render loop only after the last expected view is added.
            if (sharedState.views.length === sharedState.displayCount && sharedState.displayCount != 0) {
              console.log('renderer: sharedState.views.length === sharedState.displayCount');
              sharedState.startRenderLoop();
              console.log('renderer: sharedState.startRenderLoop called');
            }
          });
        } else {
          console.log('renderer: sharedState.initialized is false');
          setTimeout(checkInitialization, 100); // Check again after 100ms
        }
      }

      checkInitialization();
    });
  } else {
    console.error('window.electronAPI.onSetDisplayInfo is not defined or not a function');
  }

  if (sharedState.finishedInitialization === true) {
    // Game loop (assuming 60 FPS)
    let lastTime = performance.now();
    console.log('renderer: lastTime:', lastTime);
    function gameLoop() {
      console.log('renderer: BEGIN gameLoop');
      const currentTime = performance.now();
      console.log('renderer: currentTime: ', currentTime);
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      console.log('renderer: deltaTime: ', deltaTime);
      updateGameState(deltaTime);
      console.log('renderer: updateGameState called');
      lastTime = currentTime;
      console.log('renderer: lastTime updated to currentTime');
      requestAnimationFrame(gameLoop);
      console.log('renderer: END gameLoop');
    }
    console.log('renderer: About to call gameLoop');
    gameLoop();
    console.log('renderer: gameLoop called');
  }

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

window.electronAPI.on('shared-state-updated', (event, newState) => {
  sharedState.updateState(newState);
  console.log('renderer: sharedState updated', sharedState);
});