import { analyzeSpeed, analyzeDensity } from './src/js/modules/physics.js';

console.log("Testing analyzeSpeed with s=100, v=null, t=2");
const resultSpeed = analyzeSpeed(100, null, 2);
console.log(`Expected v=50. Got v=${resultSpeed.result}, missing=${resultSpeed.missing}`);

console.log("\nTesting analyzeDensity with m=10, V=2");
const resultDensity = analyzeDensity(10, 2);
console.log(`Expected rho=5. Got rho=${resultDensity.result}`);
