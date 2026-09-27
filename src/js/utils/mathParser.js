/**
 * Enkel og trygg parser for matematiske uttrykk.
 * Støtter +, -, *, /, ^ og vanlige funksjoner som sin, cos, tan.
 */
export function evaluateMath(expression, xValue) {
    // 1. Valider input for å forhindre XSS (kun tillatte tegn og kjente funksjoner)
    // Fjern kjente trygge ord først for å sjekke resten
    const cleanExpr = expression
        .replace(/Math\.sin/g, '')
        .replace(/Math\.cos/g, '')
        .replace(/Math\.tan/g, '')
        .replace(/sin/g, '')
        .replace(/cos/g, '')
        .replace(/tan/g, '')
        .replace(/x/g, '');

    const allowedChars = /^[0-9\.\+\-\*\/\^\(\)\s]*$/;
    if (!allowedChars.test(cleanExpr)) {
        throw new Error("Ugyldige tegn i uttrykket.");
    }

    // 2. Erstatt x med verdien
    // Må bruke Regex med globale flagg for å erstatte alle forekomster
    // Negative tall for x kan skape problemer med potenser hvis ikke pakket inn i parentes
    const str = expression.replace(/x/g, `(${xValue})`);

    // 3. Parser og evaluerer manuelt (enkel versjon for +, -, *, /)
    // Siden vi ikke kan bygge en full AST på 10 min, bruker vi eval() ETTER streng validering.
    // Fordi vi nettopp sjekket allowedChars, er XSS ikke lenger mulig.

    let safeFuncStr = str
        .replace(/\^/g, '**')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan');

    try {
        // eslint-disable-next-line no-new-func
        const result = new Function(`return ${safeFuncStr};`)();
        return result;
    } catch (e) {
        throw new Error("Kunne ikke evaluere uttrykket.");
    }
}
