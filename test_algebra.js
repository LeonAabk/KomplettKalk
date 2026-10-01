import { analyzeAsymptotes, analyzeRationalEq } from './src/js/modules/algebra.js';

console.log('--- Testing analyzeAsymptotes ---');
let res1 = analyzeAsymptotes(2, 3, 4, 5);
console.log('Result:', res1.result);
console.log('Steps:', res1.steps);

console.log('\n--- Testing analyzeRationalEq ---');
let res2 = analyzeRationalEq(10, 5, 2);
console.log('Result:', res2.result);
console.log('Steps:', res2.steps);
