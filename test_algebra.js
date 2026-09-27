import { analyzeQuadratic, generateQuadraticDataPoints } from './src/js/modules/algebra.js';

console.log("Testing analyzeQuadratic with a=1, b=0, c=-4");
const result = analyzeQuadratic(1, 0, -4);
console.log(JSON.stringify(result, null, 2));

console.log("\nTesting generateQuadraticDataPoints with a=1, b=0, c=-4, xMin=-5, xMax=5");
const points = generateQuadraticDataPoints(1, 0, -4, -5, 5);
console.log(`Generated ${points.length} points.`);
console.log("Sample point:", points[0]);
