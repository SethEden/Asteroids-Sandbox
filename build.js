import nwbuild from 'nw-builder';

nwbuild({
  mode: 'build',
  glob: false,  // Disable globbing to avoid pattern confusion
  flavor: 'normal',  // Use 'sdk' if you need dev tools
  arch: 'x64',
  cacheDir: './node_modules/nw',
  srcDir: 'C:/Proj/Asteroids-Sandbox',
  outDir: 'C:/Proj/Asteroids-out',
  platform: 'win',
  logLevel: 'debug'  // Keep this for detailed output
})
.then(() => {
  console.log('Build completed successfully!');
})
.catch((error) => {
  console.error('Build failed:', error);
});