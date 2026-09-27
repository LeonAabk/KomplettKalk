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

/**
 * Validerer input for en lineær funksjon (a, b)
 *
 * @param {string} aStr - Input for a
 * @param {string} bStr - Input for b
 * @returns {Object} Valideringsresultat
 */
export function validateLinearInput(aStr, bStr) {
    const a = parseFloat(aStr);
    const b = parseFloat(bStr);

    if (isNaN(a) || isNaN(b)) {
        let missing = [];
        if (isNaN(a)) missing.push('a (stigningstall)');
        if (isNaN(b)) missing.push('b (konstantledd)');

        return {
            isValid: false,
            hint: `Mangler verdi for: ${missing.join(', ')}.`
        };
    }

    return {
        isValid: true,
        values: { a, b },
        hint: null
    };
}

/**
 * Validerer input for Pytagoras (a, b, c).
 * Akkurat to av tre felt må være fylt ut.
 *
 * @param {string} aStr - Katet a
 * @param {string} bStr - Katet b
 * @param {string} cStr - Hypotenus c
 * @returns {Object} Valideringsresultat
 */
export function validatePythagorasInput(aStr, bStr, cStr) {
    let filledCount = 0;
    let a = null, b = null, c = null;

    if (aStr.trim() !== '') {
        a = parseFloat(aStr);
        if (!isNaN(a) && a > 0) filledCount++;
    }
    if (bStr.trim() !== '') {
        b = parseFloat(bStr);
        if (!isNaN(b) && b > 0) filledCount++;
    }
    if (cStr.trim() !== '') {
        c = parseFloat(cStr);
        if (!isNaN(c) && c > 0) filledCount++;
    }

    if (filledCount !== 2) {
        return {
            isValid: false,
            hint: 'Du må fylle inn nøyaktig to av sidene for å kunne regne ut den tredje. Lengdene må være positive tall.'
        };
    }

    if (a !== null && c !== null && a >= c) {
        return {
             isValid: false,
             hint: 'Hypotenusen (c) må alltid være lengre enn katetene (a og b).'
        };
    }

    if (b !== null && c !== null && b >= c) {
        return {
             isValid: false,
             hint: 'Hypotenusen (c) må alltid være lengre enn katetene (a og b).'
        };
    }

    return {
        isValid: true,
        values: { a, b, c },
        hint: null
    };
}

/**
 * Validerer input for prosentregning
 *
 * @param {string} xStr - Verdi 1
 * @param {string} yStr - Verdi 2
 * @returns {Object} Valideringsresultat
 */
export function validatePercentInput(xStr, yStr) {
    const x = parseFloat(xStr);
    const y = parseFloat(yStr);

    if (isNaN(x) || isNaN(y)) {
        return {
            isValid: false,
            hint: 'Vennligst fyll inn begge feltene med gyldige tall.'
        };
    }

    if (y === 0) {
        return {
             isValid: false,
             hint: 'Man kan ikke dele på 0. Det hele tallet kan ikke være 0.'
        };
    }

    return {
        isValid: true,
        values: { x, y },
        hint: null
    };
}
