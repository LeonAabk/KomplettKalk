/**
 * Valideringsverktøy for smarte, pedagogiske feilmeldinger
 */

/**
 * Validerer input for en andregradsfunksjon (a, b, c)
 *
 * @param {string} aStr - Input for a som streng
 * @param {string} bStr - Input for b som streng
 * @param {string} cStr - Input for c som streng
 * @returns {Object} Objekt med is_valid (boolean) og en eventuell hint-melding
 */
export function validateQuadraticInput(aStr, bStr, cStr) {
    const a = parseFloat(aStr);
    const b = parseFloat(bStr);
    const c = parseFloat(cStr);

    // Sjekk om noen felt er tomme eller ikke tall
    if (isNaN(a) || isNaN(b) || isNaN(c)) {
        let missing = [];
        if (isNaN(a)) missing.push('a');
        if (isNaN(b)) missing.push('b');
        if (isNaN(c)) missing.push('c');

        return {
            isValid: false,
            hint: `Det ser ut til at du mangler en verdi for: ${missing.join(', ')}. Husk at en andregradsfunksjon trenger alle tre koeffisienter (skriv 0 hvis en led mangler, f.eks. b=0).`
        };
    }

    // Spesialtilfelle: a kan ikke være 0 i en andregradsfunksjon
    if (a === 0) {
        return {
            isValid: false,
            hint: `Viktig! Koeffisienten 'a' kan ikke være 0. Hvis a=0, forsvinner x²-leddet, og vi sitter igjen med en lineær funksjon (rett linje), ikke en parabel.`
        };
    }

    return {
        isValid: true,
        values: { a, b, c },
        hint: null
    };
}
