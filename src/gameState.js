// gameState.js
export const gameState = {
    isInitialized: false, // Semaphore for bootstrap completion
    player: { position: { x: 0, y: 0 }, rotation: 0, velocity: { x: 0, y: 0 } },
    asteroids: [],
    bullets: [],
    world: { width: 10, height: 10 }, // Game space dimensions
  };