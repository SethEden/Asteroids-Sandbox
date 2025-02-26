console.log('Renderer loaded, BABYLON:', BABYLON); // Debug

const canvas = document.getElementById('renderCanvas');
if (!canvas) console.error('Canvas not found');
const engine = new BABYLON.Engine(canvas, true); // 'true' enables antialiasing
console.log('Engine created:', engine);
const scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color4(0, 0, 0, 1); // Black background with full opacity

// Add a light source
const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

// Create a simple box to confirm rendering
const box = BABYLON.MeshBuilder.CreateBox("box", { size: 1 }, scene);
box.position = new BABYLON.Vector3(0, 0, 0);

// Set up the camera
const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 4, 10, BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas, true); // Allows mouse interaction

// Render loop
engine.runRenderLoop(() => {
  console.log('rendering');
  scene.render();
});

// Handle window resizing
window.addEventListener('resize', () => {
  engine.resize();
});