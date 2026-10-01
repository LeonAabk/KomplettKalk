/**
 * Modul for Sannsynlighet / Kombinatorikk
 */

/**
 * Hjelpefunksjon for å regne ut fakultet (n!)
 */
function factorial(num) {
    if (num === 0 || num === 1) return 1;
    let res = 1;
    for (let i = 2; i <= num; i++) {
        res *= i;
    }
    return res;
}

/**
 * Beregner antall ordnede utvalg (nPr)
 * P(n, r) = n! / (n-r)!
 * @param {number} n - Totalt antall
 * @param {number} r - Antall som trekkes
 * @returns {Object} Resultat og steps
 */
export function analyzeNPR(n, r) {
    const steps = [];

    steps.push({
        description: `Formelen for ordnet utvalg uten tilbakelegging ($nPr$) er:`,
        math: `nPr = \\frac{n!}{(n-r)!}`
    });

    const diff = n - r;
    const nFact = factorial(n);
    const diffFact = factorial(diff);
    const result = nFact / diffFact;

    steps.push({
        description: `Vi setter inn verdiene for totalt antall ($n = ${n}$) og antall som trekkes ($r = ${r}$):`,
        math: `\\frac{${n}!}{(${n} - ${r})!} = \\frac{${n}!}{${diff}!}`
    });

    steps.push({
        description: `Regner ut fakultetene:`,
        math: `\\frac{${nFact}}{${diffFact}} = ${result}`
    });

    return {
        result,
        steps
    };
}

/**
 * Beregner antall uordnede utvalg (nCr)
 * C(n, r) = n! / (r!(n-r)!)
 * @param {number} n - Totalt antall
 * @param {number} r - Antall som trekkes
 * @returns {Object} Resultat og steps
 */
export function analyzeNCR(n, r) {
    const steps = [];

    steps.push({
        description: `Formelen for uordnet utvalg uten tilbakelegging ($nCr$) er:`,
        math: `nCr = \\binom{n}{r} = \\frac{n!}{r!(n-r)!}`
    });

    const diff = n - r;
    const nFact = factorial(n);
    const rFact = factorial(r);
    const diffFact = factorial(diff);
    const result = nFact / (rFact * diffFact);

    steps.push({
        description: `Vi setter inn verdiene for totalt antall ($n = ${n}$) og antall som trekkes ($r = ${r}$):`,
        math: `\\frac{${n}!}{${r}!(${n} - ${r})!} = \\frac{${n}!}{${r}! \\cdot ${diff}!}`
    });

    steps.push({
        description: `Regner ut fakultetene:`,
        math: `\\frac{${nFact}}{${rFact} \\cdot ${diffFact}} = \\frac{${nFact}}{${rFact * diffFact}} = ${result}`
    });

    return {
        result,
        steps
    };
}
