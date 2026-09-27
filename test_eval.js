let funcStr = "x*x";
let safeFuncStr = funcStr
    .replace(/\^/g, '**')
    .replace(/sin/g, 'Math.sin')
    .replace(/cos/g, 'Math.cos')
    .replace(/tan/g, 'Math.tan');

console.log(safeFuncStr);

const evaluator = new Function('x', `return ${safeFuncStr};`);
console.log(evaluator(2));
