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
 * Validerer input for areal
 */
export function validateAreaInput(shape, val1Str, val2Str) {
    const val1 = parseFloat(val1Str);

    if (isNaN(val1) || val1 <= 0) {
        return {
            isValid: false,
            hint: 'Du må oppgi en gyldig positiv verdi for det første målet.'
        };
    }

    if (shape !== 'circle') {
        const val2 = parseFloat(val2Str);
        if (isNaN(val2) || val2 <= 0) {
            return {
                isValid: false,
                hint: 'Du må oppgi en gyldig positiv verdi for det andre målet (f.eks høyde eller bredde).'
            };
        }
        return { isValid: true, values: { shape, val1, val2 }, hint: null };
    }

    return { isValid: true, values: { shape, val1, val2: null }, hint: null };
}

/**
 * Validerer input for trigonometri
 */
export function validateTrigonometryInput(angleStr, givenValueStr) {
    const angle = parseFloat(angleStr);
    const givenValue = parseFloat(givenValueStr);

    if (isNaN(angle) || angle <= 0 || angle >= 90) {
        return {
            isValid: false,
            hint: 'Vinkelen må være mellom 0 og 90 grader (i en rettvinklet trekant, ekskludert selve den rette vinkelen).'
        };
    }

    if (isNaN(givenValue) || givenValue <= 0) {
        return {
            isValid: false,
            hint: 'Du må oppgi en gyldig, positiv lengde for den kjente siden.'
        };
    }

    return {
        isValid: true,
        values: { angle, givenValue },
        hint: null
    };
}

/**
 * Validerer input for ABC-formelen og Vertex (samme format, a,b,c)
 * Siden vi allerede har validateQuadraticInput, kan vi bare eksportere eller gjenbruke den,
 * men vi lager et alias for tydelighet.
 */
export const validateABCInput = validateQuadraticInput;
export const validateVertexInput = validateQuadraticInput;

/**
 * Validerer input for potensregning
 */
export function validatePowerInput(baseStr, expStr) {
    const base = parseFloat(baseStr);
    const exponent = parseFloat(expStr);

    if (isNaN(base) || isNaN(exponent)) {
        return {
            isValid: false,
            hint: 'Du må oppgi både et grunntall og en eksponent.'
        };
    }

    return { isValid: true, values: { base, exponent }, hint: null };
}

/**
 * Validerer input for kvadratrot
 */
export function validateSquareRootInput(numStr) {
    const number = parseFloat(numStr);

    if (isNaN(number)) {
        return {
            isValid: false,
            hint: 'Du må oppgi et tall.'
        };
    }

    // Vi lar matematikk-modulen håndtere feilen for negative tall, eller vi kan gjøre det her.
    // Oppgaven ba om gode pedagogiske meldinger, så kanskje la basic.js ta seg av den matematiske forklaringen.

    return { isValid: true, values: { number }, hint: null };
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
            hint: 'Fyll inn nøyaktig to verdier for å regne ut den tredje.'
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

/**
 * Validerer input for statistikk (kommadelt liste med tall).
 * @param {string} inputStr - Input-streng
 * @returns {Object} Valideringsresultat
 */
export function validateStatisticsInput(inputStr) {
    if (!inputStr || inputStr.trim() === '') {
        return {
            isValid: false,
            hint: 'Vennligst skriv inn noen tall separert med komma (f.eks. "2, 5, 8, 3").'
        };
    }

    const numbers = inputStr.split(',').map(s => s.trim());
    const parsedNumbers = numbers.map(s => parseFloat(s));

    if (parsedNumbers.some(isNaN)) {
        return {
            isValid: false,
            hint: 'Listen din inneholder ugyldige verdier. Pass på at du kun bruker tall og at de er separert med komma (bruk punktum for desimaltall).'
        };
    }

    if (parsedNumbers.length === 0) {
         return {
             isValid: false,
             hint: 'Vi fant ingen tall. Vennligst skriv inn noen tall separert med komma.'
         };
    }

    return {
        isValid: true,
        values: { inputStr },
        hint: null
    };
}

/**
 * Validerer input for likningssett med to ukjente (a1, b1, c1, a2, b2, c2).
 */
export function validateEquationSystemInput(a1Str, b1Str, c1Str, a2Str, b2Str, c2Str) {
    const a1 = parseFloat(a1Str);
    const b1 = parseFloat(b1Str);
    const c1 = parseFloat(c1Str);
    const a2 = parseFloat(a2Str);
    const b2 = parseFloat(b2Str);
    const c2 = parseFloat(c2Str);

    if (isNaN(a1) || isNaN(b1) || isNaN(c1) || isNaN(a2) || isNaN(b2) || isNaN(c2)) {
        return {
            isValid: false,
            hint: 'Vennligst fyll inn alle seks feltene med gyldige tall.'
        };
    }

    if (a1 === 0 && a2 === 0) {
        return {
            isValid: false,
            hint: 'Både a1 og a2 kan ikke være null samtidig (da har vi ikke noen x å løse for).'
        };
    }

    return {
        isValid: true,
        values: { a1, b1, c1, a2, b2, c2 },
        hint: null
    };
}

/**
 * Validerer input for volum (3D-figurer).
 */
export function validateVolumeInput(shape, val1Str, val2Str) {
    const val1 = parseFloat(val1Str);

    if (isNaN(val1) || val1 <= 0) {
        return {
            isValid: false,
            hint: 'Du må oppgi en gyldig positiv verdi for radius eller sidekant.'
        };
    }

    if (shape === 'cylinder') {
        const val2 = parseFloat(val2Str);
        if (isNaN(val2) || val2 <= 0) {
            return {
                isValid: false,
                hint: 'Du må oppgi en gyldig positiv verdi for høyde.'
            };
        }
        return { isValid: true, values: { shape, val1, val2 }, hint: null };
    }

    return { isValid: true, values: { shape, val1, val2: null }, hint: null };
}

/**
 * Validerer input for brøkregning.
 */
export function validateFractionInput(n1Str, d1Str, n2Str, d2Str) {
    const n1 = parseInt(n1Str, 10);
    const d1 = parseInt(d1Str, 10);
    const n2 = parseInt(n2Str, 10);
    const d2 = parseInt(d2Str, 10);

    if (isNaN(n1) || isNaN(d1) || isNaN(n2) || isNaN(d2)) {
        return {
            isValid: false,
            hint: 'Vennligst fyll inn alle feltene for brøkene (kun heltall).'
        };
    }

    if (d1 === 0 || d2 === 0) {
        return {
            isValid: false,
            hint: 'En nevner kan aldri være null.'
        };
    }

    return {
        isValid: true,
        values: { n1, d1, n2, d2 },
        hint: null
    };
}
