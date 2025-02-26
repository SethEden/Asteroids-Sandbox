// gameState.js
export const gameState = {
    isInitialized: false,
    player: { position: { x: 0, y: 0 }, rotation: 0, velocity: { x: 0, y: 0 } },
    asteroids: [],
    bullets: [],
    world: { width: 10, height: 10 }, // Define your game world size
  };
  
  export function initializeGameState() {
    // Set up initial state
    gameState.player.position = { x: 0, y: 0 };
    gameState.player.velocity = { x: 0, y: 0 };
    gameState.player.rotation = 0;
    gameState.asteroids = []; // Add initial asteroids if desired
    gameState.bullets = [];
    gameState.isInitialized = true;
  }
  
  export function updateGameState(deltaTime) {
    if (!gameState.isInitialized) return;
  
    // Update player position based on velocity
    gameState.player.position.x += gameState.player.velocity.x * deltaTime;
    gameState.player.position.y += gameState.player.velocity.y * deltaTime;
  
    // Wrap player around world edges (example logic)
    if (gameState.player.position.x > gameState.world.width / 2) {
      gameState.player.position.x = -gameState.world.width / 2;
    } else if (gameState.player.position.x < -gameState.world.width / 2) {
      gameState.player.position.x = gameState.world.width / 2;
    }
    if (gameState.player.position.y > gameState.world.height / 2) {
      gameState.player.position.y = -gameState.world.height / 2;
    } else if (gameState.player.position.y < -gameState.world.height / 2) {
      gameState.player.position.y = gameState.world.height / 2;
    }
  
    // Update asteroids, bullets, and check collisions (add your logic here)
    // Example: gameState.asteroids.forEach(asteroid => { ... });
  }
  
  export function handleInput(inputType, value) {
    // Handle player controls
    if (inputType === 'move') {
      gameState.player.velocity.x = value.x; // Example: value.x could be 1, -1, or 0
      gameState.player.velocity.y = value.y;
    } else if (inputType === 'rotate') {
      gameState.player.rotation += value; // Example: value could be rotation speed
    } else if (inputType === 'shoot') {
      gameState.bullets.push({
        position: { ...gameState.player.position },
        direction: gameState.player.rotation,
        velocity: { x: Math.cos(gameState.player.rotation), y: Math.sin(gameState.player.rotation) }
      });
    }
  }