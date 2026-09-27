import { evaluateMath } from './src/js/utils/mathParser.js';

console.log("Testing 2*x with x=5");
console.log(evaluateMath("2*x", 5));

console.log("Testing sin(x) with x=0");
console.log(evaluateMath("sin(x)", 0));

console.log("Testing malicious input this.M");
try {
    evaluateMath("this.M", 5);
} catch (e) {
    console.log("Caught malicious input:", e.message);
}

console.log("Testing malicious input alert(1)");
try {
    evaluateMath("alert(1)", 5);
} catch (e) {
    console.log("Caught malicious input:", e.message);
}
