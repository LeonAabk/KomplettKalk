/**
 * Modul for statistikk
 */

/**
 * Hjelpefunksjon for å parse kommadelt liste med tall
 * (Validering gjøres primært i validation.js, men vi sørger for at vi har et array av tall her)
 */
function parseNumberList(listStr) {
    return listStr.split(',')
        .map(s => parseFloat(s.trim()))
        .filter(n => !isNaN(n));
}

/**
 * Beregner gjennomsnittet av en liste med tall
 * @param {string} inputStr - Kommadelt liste med tall
 * @returns {Object} Resultat og steps
 */
export function analyzeMean(inputStr) {
    const steps = [];
    const numbers = parseNumberList(inputStr);

    if (numbers.length === 0) {
        return { result: NaN, steps: [] };
    }

    steps.push({
        description: `Vi skal finne gjennomsnittet av tallene: ${numbers.join(', ')}.`,
        math: `\\text{Gjennomsnitt} = \\frac{\\text{Sum av alle tallene}}{\\text{Antall tall}}`
    });

    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    const count = numbers.length;

    steps.push({
        description: `Først legger vi sammen alle tallene:`,
        math: `\\text{Sum} = ${numbers.join(' + ')} = ${sum}`
    });

    steps.push({
        description: `Vi har totalt ${count} tall. Vi deler summen på antall tall:`,
        math: `\\text{Gjennomsnitt} = \\frac{${sum}}{${count}}`
    });

    const mean = sum / count;

    steps.push({
        description: `Svaret blir:`,
        math: `\\text{Gjennomsnitt} = ${mean % 1 === 0 ? mean : mean.toFixed(2)}`
    });

    return {
        result: mean,
        steps
    };
}

/**
 * Beregner median av en liste med tall
 * @param {string} inputStr - Kommadelt liste med tall
 * @returns {Object} Resultat og steps
 */
export function analyzeMedian(inputStr) {
    const steps = [];
    const numbers = parseNumberList(inputStr);

    if (numbers.length === 0) {
        return { result: NaN, steps: [] };
    }

    steps.push({
        description: `Vi skal finne medianen av tallene: ${numbers.join(', ')}.`,
        math: `\\text{Median er det midterste tallet når tallene er sortert i stigende rekkefølge.}`
    });

    const sorted = [...numbers].sort((a, b) => a - b);

    steps.push({
        description: `Først sorterer vi tallene fra minst til størst:`,
        math: `\\text{Sortert liste: } ${sorted.join(', ')}`
    });

    const count = sorted.length;
    let median;

    if (count % 2 === 1) {
        // Oddetall
        const midIndex = Math.floor(count / 2);
        median = sorted[midIndex];
        steps.push({
            description: `Siden vi har et oddetall antall tall (${count}), er medianen det midterste tallet:`,
            math: `\\text{Median} = ${median}`
        });
    } else {
        // Partall
        const midIndex1 = count / 2 - 1;
        const midIndex2 = count / 2;
        const val1 = sorted[midIndex1];
        const val2 = sorted[midIndex2];
        median = (val1 + val2) / 2;

        steps.push({
            description: `Siden vi har et partall antall tall (${count}), må vi finne gjennomsnittet av de to midterste tallene (${val1} og ${val2}):`,
            math: `\\text{Median} = \\frac{${val1} + ${val2}}{2} = \\frac{${val1 + val2}}{2} = ${median}`
        });
    }

    return {
        result: median,
        steps
    };
}

/**
 * Finner typetall av en liste med tall
 * @param {string} inputStr - Kommadelt liste med tall
 * @returns {Object} Resultat og steps
 */
export function analyzeMode(inputStr) {
    const steps = [];
    const numbers = parseNumberList(inputStr);

    if (numbers.length === 0) {
        return { result: null, steps: [] };
    }

    steps.push({
        description: `Vi skal finne typetallet (tallet som forekommer oftest) blant: ${numbers.join(', ')}.`,
        math: ``
    });

    const counts = {};
    numbers.forEach(num => {
        counts[num] = (counts[num] || 0) + 1;
    });

    let maxCount = 0;
    for (const num in counts) {
        if (counts[num] > maxCount) {
            maxCount = counts[num];
        }
    }

    const modes = [];
    for (const num in counts) {
        if (counts[num] === maxCount) {
            modes.push(Number(num));
        }
    }

    if (maxCount === 1) {
         steps.push({
             description: `Hvert tall forekommer nøyaktig én gang. Da har vi ikke noe typetall.`,
             math: `\\text{Ingen typetall}`
         });
         return {
             result: null,
             steps
         };
    }

    steps.push({
        description: `Vi teller opp hvor mange ganger hvert tall forekommer. Det høyeste antallet er ${maxCount}.`,
        math: ``
    });

    if (modes.length === 1) {
         steps.push({
             description: `Tallet ${modes[0]} forekommer flest ganger (${maxCount} ganger). Det er typetallet.`,
             math: `\\text{Typetall} = ${modes[0]}`
         });
    } else {
         steps.push({
             description: `Vi har flere tall som deler førsteplassen ved å forekomme ${maxCount} ganger. Typetallene er: ${modes.join(', ')}.`,
             math: `\\text{Typetall} = \\{${modes.join(', ')}\\}`
         });
    }

    return {
        result: modes,
        steps
    };
}

/**
 * Finner variasjonsbredde av en liste med tall
 * @param {string} inputStr - Kommadelt liste med tall
 * @returns {Object} Resultat og steps
 */
export function analyzeRange(inputStr) {
    const steps = [];
    const numbers = parseNumberList(inputStr);

    if (numbers.length === 0) {
        return { result: NaN, steps: [] };
    }

    steps.push({
        description: `Vi skal finne variasjonsbredden i listen: ${numbers.join(', ')}.`,
        math: `\\text{Variasjonsbredde} = \\text{Største verdi} - \\text{Minste verdi}`
    });

    const max = Math.max(...numbers);
    const min = Math.min(...numbers);
    const range = max - min;

    steps.push({
        description: `Den største verdien er ${max} og den minste verdien er ${min}.`,
        math: `\\text{Variasjonsbredde} = ${max} - ${min}`
    });

    steps.push({
        description: `Vi regner ut differansen:`,
        math: `\\text{Variasjonsbredde} = ${range}`
    });

    return {
        result: range,
        steps
    };
}
