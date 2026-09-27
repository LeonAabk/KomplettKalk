/**
 * Modul for grunnleggende matematikk
 */

/**
 * Beregner hvor mange prosent X er av Y.
 * @param {number} x - Delen
 * @param {number} y - Hele tallet
 * @returns {Object} Resultat og steps
 */
export function analyzePercent(x, y) {
    const steps = [];

    steps.push({
        description: `Vi skal finne hvor mange prosent ${x} er av ${y}. Formelen er:`,
        math: `\\text{Prosent} = \\frac{\\text{Del}}{\\text{Hele}} \\cdot 100\\%`
    });

    steps.push({
        description: `Setter inn tallene våre i formelen:`,
        math: `\\text{Prosent} = \\frac{${x}}{${y}} \\cdot 100\\%`
    });

    const fraction = x / y;
    steps.push({
        description: `Utfører divisjonen:`,
        math: `\\frac{${x}}{${y}} = ${fraction.toFixed(4)}...`
    });

    const percent = fraction * 100;
    steps.push({
        description: `Ganger med 100 for å få det i prosent:`,
        math: `${fraction.toFixed(4)} \\cdot 100\\% = ${percent.toFixed(2)}\\%`
    });

    return {
        result: percent,
        steps
    };
}

/**
 * Beregner prosentvis endring fra en gammel verdi til en ny verdi.
 * @param {number} oldVal - Gammel verdi
 * @param {number} newVal - Ny verdi
 * @returns {Object} Resultat og steps
 */
export function analyzePercentChange(oldVal, newVal) {
    const steps = [];

    steps.push({
        description: `Vi skal finne den prosentvise endringen fra ${oldVal} til ${newVal}. Formelen er:`,
        math: `\\text{Prosentendring} = \\frac{\\text{Ny verdi} - \\text{Gammel verdi}}{\\text{Gammel verdi}} \\cdot 100\\%`
    });

    const diff = newVal - oldVal;
    steps.push({
        description: `Først finner vi endringen ved å ta ny verdi minus gammel verdi:`,
        math: `\\text{Endring} = ${newVal} - ${oldVal} = ${diff}`
    });

    steps.push({
        description: `Så deler vi endringen på den gamle verdien:`,
        math: `\\frac{${diff}}{${oldVal}}`
    });

    const fraction = diff / oldVal;
    steps.push({
        description: `Utfører divisjonen:`,
        math: `\\frac{${diff}}{${oldVal}} = ${fraction.toFixed(4)}...`
    });

    const percent = fraction * 100;
    const direction = percent >= 0 ? 'økning' : 'nedgang';

    steps.push({
        description: `Til slutt ganger vi med 100 for å få prosent:`,
        math: `${fraction.toFixed(4)} \\cdot 100\\% = ${percent.toFixed(2)}\\%`
    });

    steps.push({
        description: `Siden svaret er ${percent >= 0 ? 'positivt' : 'negativt'}, har vi en ${direction}.`,
        math: `\\text{Resultat: } ${Math.abs(percent).toFixed(2)}\\% \\text{ } ${direction}`
    });

    return {
        result: percent,
        direction,
        steps
    };
}
