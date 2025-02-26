// sharedState.js
const sharedState = {
    engine: null,
    scene: null,
  
    initialize(canvas) {
      if (!window.BABYLON) {
        console.error('BABYLON is not loaded. Check script in index.html.');
        return;
      }
      this.engine = new window.BABYLON.Engine(canvas, true); // Antialiasing enabled
      this.scene = new window.BABYLON.Scene(this.engine);
      
      // Add a basic test object (e.g., a box) to confirm rendering
      const box = window.BABYLON.MeshBuilder.CreateBox('box', { size: 2 }, this.scene);
      box.position.y = 0;
      
      // Add a camera
      const camera = new window.BABYLON.FreeCamera('camera', new window.BABYLON.Vector3(0, 5, -10), this.scene);
      camera.setTarget(window.BABYLON.Vector3.Zero());
      camera.attachControl(canvas, true);
      
      // Add lighting
      new window.BABYLON.HemisphericLight('light', new window.BABYLON.Vector3(0, 1, 0), this.scene);
  
      console.log('Babylon.js initialized:', this.engine, this.scene);
    },
  
    startRenderLoop() {
      if (!this.engine || !this.scene) {
        console.error('Engine or scene not initialized. Cannot start render loop.');
        return;
      }
      this.engine.runRenderLoop(() => {
        this.scene.render();
      });
    }
  };
  
  export { sharedState };