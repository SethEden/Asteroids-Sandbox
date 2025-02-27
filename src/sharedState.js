// sharedState.js
const sharedState = {
  engine: null,
  scene: null,
  cameras: {},
  views: [],
  initialized: false,
  finishedInitialization: false,
  displayCount: 0,

  /** Initialize the engine and scene with the first canvas */
  init(canvas) {
    console.log('sharedState.init: The first canvas');
    if (!this.initialized) {
      console.log('sharedState.init: window is not initialized, but it is about to be!');
      if (!window.BABYLON) {
        console.error('sharedState.init: BABYLON is not loaded. Check the script in index.html.');
        return;
      }
      console.log('sharedState.init: BABYLON is loaded');
      this.engine = new window.BABYLON.Engine(canvas, true);
      console.log('sharedState.init: engine is created');
      this.scene = new window.BABYLON.Scene(this.engine);
      console.log('sharedState.init: scene is created');
      this.scene.clearColor = new window.BABYLON.Color4(0, 0, 0, 1);
      console.log('sharedState.init: scene color is set');

      // Add a hemispheric light
      const light = new window.BABYLON.HemisphericLight("light", new window.BABYLON.Vector3(0, 1, 0), this.scene);
      console.log('sharedState.init: light is created');

      // Add a test camera and mesh
      // const camera = new BABYLON.FreeCamera("camera0", new BABYLON.Vector3(0, 0, -10), this.scene);
      // console.log('sharedState.init: camera is created');
      // camera.setTarget(BABYLON.Vector3.Zero());
      // console.log('sharedState.init: camera target is set');
      // camera.attachControl(canvas, true);
      // console.log('sharedState.init: camera control is attached');

      const box = BABYLON.MeshBuilder.CreateBox("box", { size: 2 }, this.scene);
      console.log('sharedState.init: box is created');
      box.position = new BABYLON.Vector3(0, 0, 0);
      console.log('sharedState.init: box position is set');

      // this.cameras[0] = camera;
      // console.log('sharedState.init: camera is added to cameras');
      // this.scene.activeCameras.push(camera);
      // console.log('sharedState.init: camera is added to active cameras');

      this.initialized = true;
      // Add entities or other scene setup here if needed later
      console.log('sharedState.init: Babylon.js initialized successfully');
    }
  },

  /** Add a view for a display, creating its camera */
  addView(displayId, canvas, bounds) {
    console.log('sharedState.addView: BEGIN add view');
    if (!this.initialized) {
      console.error('sharedState.addView: Shared state not initialized. Call init first.');
      return;
    }
    console.log('sharedState.addView: Shared state is initialized');
    const camera = this.createCamera(displayId, bounds);
    console.log('sharedState.addView: Camera created');
    this.engine.registerView(canvas, camera);
    console.log('sharedState.addView: Engine registered view');
    this.cameras[displayId] = camera;
    console.log('sharedState.addView: Camera added to cameras');
    this.scene.activeCameras.push(camera); // Ensure camera is active for rendering
    console.log(`sharedState.addView: Added view for display ${displayId} with camera:`, camera);
    this.views.push(displayId);
    console.log('sharedState.addView: DisplayId added to views');
    console.log('sharedState.addView: END add view');
  },

  /** Create and configure a camera based on display bounds */
  createCamera(displayId, bounds) {
    // Note: Electron's screen API isn't directly available in the renderer process.
    // We'll rely on bounds passed from main.js via IPC.
    console.log('sharedState.createCamera: Creating camera for display', displayId);
    const screenWidth = bounds.width;
    const screenHeight = bounds.height;
    console.log('sharedState.createCamera: Screen width:', screenWidth, 'height:', screenHeight);

    // Camera placement and coordinates
    const camera = new window.BABYLON.FreeCamera(`camera_${displayId}`, new window.BABYLON.Vector3(0, 0, -500), this.scene);
    console.log('sharedState.createCamera: Camera created');
    camera.position.x = bounds.x + screenWidth / 2; // Center in this display's bounds
    camera.position.y = 0;
    console.log('sharedState.createCamera: Camera position set to x:', camera.position.x, 'y:', camera.position.y);

    // FOV and frustum calculations
    camera.fov = 1.74; // From your original setup
    console.log('sharedState.createCamera: Camera fov set to', camera.fov);
    const aspectRatio = screenWidth / screenHeight;
    console.log('sharedState.createCamera: Aspect ratio:', aspectRatio);
    const horizontalFov = 2 * Math.atan(Math.tan(camera.fov / 2) * aspectRatio);
    console.log('sharedState.createCamera: Horizontal fov:', horizontalFov);
    const d = screenWidth / (2 * Math.tan(horizontalFov / 2));
    console.log('sharedState.createCamera: Distance from screen:', d);
    camera.position.z = -d;
    console.log('sharedState.createCamera: Camera position z set to', camera.position.z);
    // Near and far planes
    camera.minZ = 0.1;
    camera.maxZ = 1000;
    console.log('sharedState.createCamera: Camera minZ set to', camera.minZ, 'maxZ set to', camera.maxZ);

    // Target position
    const target = new window.BABYLON.Vector3(camera.position.x, camera.position.y, camera.position.z + 200);
    console.log('sharedState.createCamera: Target position set to', target);
    camera.setTarget(target);
    console.log('sharedState.createCamera: Camera target set');

    // Camera locking controls
    camera.lockedTarget = target;
    console.log('sharedState.createCamera: Camera locked target set');
    camera.angularSensibility = 0;
    console.log('sharedState.createCamera: Camera angular sensibility set to', camera.angularSensibility);
    camera.keysUp = [];
    console.log('sharedState.createCamera: Camera keys up set to', camera.keysUp);
    camera.keysDown = [];
    console.log('sharedState.createCamera: Camera keys down set to', camera.keysDown);
    camera.keysLeft = [];
    console.log('sharedState.createCamera: Camera keys left set to', camera.keysLeft);
    camera.keysRight = [];
    console.log('sharedState.createCamera: Camera keys right set to', camera.keysRight);

    return camera;
  },

  /** Start the render loop */
  startRenderLoop() {
    console.log('sharedState: Starting render loop');
    if (!this.engine) {
      console.error('Engine not initialized. Cannot start render loop.');
      return;
    }
    console.log('sharedState: engine initialized, Starting render loop'); // Add this to confirm loop starts
    this.engine.runRenderLoop(() => {
      console.log('sharedState: Rendering frame');
      this.scene.render();
      this.finishedInitialization = true;
      console.log('sharedState: finishedInitialization set to true');
    });
  },

  setDisplayCount(count) {
    this.displayCount = count;
    console.log(`sharedState: Display count set to ${count}`);
  },

  /** Update the shared state while preserving methods */
  updateState(newState) {
    Object.assign(this, newState);
  }
};

export { sharedState };