import { analyzeNPR, analyzeNCR } from './src/js/modules/probability.js';

console.log("Testing analyzeNPR with n=5, r=3");
const resultNPR = analyzeNPR(5, 3);
console.log(`Expected nPr=60. Got nPr=${resultNPR.result}`);

console.log("\nTesting analyzeNCR with n=5, r=3");
const resultNCR = analyzeNCR(5, 3);
console.log(`Expected nCr=10. Got nCr=${resultNCR.result}`);
