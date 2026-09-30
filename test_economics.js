import { analyzeMarkup } from './src/js/modules/economics.js';

console.log("Testing analyzeMarkup with cost=100, freight=20, markup=50%");
const resultMarkup = analyzeMarkup(100, 20, 50);
console.log(`Expected selvkost=120, avanse=60, utsalgspris=180.`);
console.log(`Got selvkost=${resultMarkup.selvkost}, avanse=${resultMarkup.avanseKroner}, utsalgspris=${resultMarkup.utsalgspris}`);
