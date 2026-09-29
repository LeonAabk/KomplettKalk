/**
 * Modul for Algebra - inneholder ren forretningslogikk for matematiske operasjoner.
 */

/**
 * Løser en andregradsligning og finner topp/bunnpunkt.
 * Returnerer et objekt med resultater og trinnvis utregning.
 *
 * @param {number} a - Koeffisient a
 * @param {number} b - Koeffisient b
 * @param {number} c - Koeffisient c
 * @returns {Object} Resultatobjekt med røtter, topp/bunnpunkt, og steps
 */
export function analyzeQuadratic(a, b, c) {
    const steps = [];

    // 1. Definer funksjonen
    steps.push({
        description: 'Vi starter med andregradsfunksjonen på standardform:',
        math: `f(x) = ${a}x^2 ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c}`
    });

    // 2. Sjekk om det er et topp- eller bunnpunkt
    const isTopPoint = a < 0;
    steps.push({
        description: `Siden a = ${a}, er a ${isTopPoint ? '<' : '>'} 0. Grafen smiler ${isTopPoint ? 'surt (∩)' : 'blidt (∪)'}, så vi har et ${isTopPoint ? 'toppunkt' : 'bunnpunkt'}.`,
        math: `a = ${a}`
    });

    // 3. Finn x-koordinaten til topp/bunnpunktet
    const xVertex = -b / (2 * a);
    steps.push({
        description: 'Vi finner x-koordinaten til symmetriaksen (og ekstremalpunktet) med formelen x = \\frac{-b}{2a}:',
        math: `x_T = \\frac{-(${b})}{2 \\cdot ${a}} = ${xVertex}`
    });

    // 4. Finn y-koordinaten
    const yVertex = a * (xVertex ** 2) + b * xVertex + c;
    steps.push({
        description: `Vi setter inn x = ${xVertex} i funksjonen for å finne y-koordinaten:`,
        math: `y_T = f(${xVertex}) = ${a}(${xVertex})^2 ${b >= 0 ? '+' : ''}${b}(${xVertex}) ${c >= 0 ? '+' : ''}${c} = ${yVertex}`
    });

    const vertex = { x: xVertex, y: yVertex, type: isTopPoint ? 'Toppunkt' : 'Bunnpunkt' };

    // 5. Finn røttene (ABC-formelen)
    const discriminant = (b ** 2) - (4 * a * c);
    steps.push({
        description: 'For å finne nullpunktene (røttene) bruker vi abc-formelen. Først regner vi ut diskriminanten (Δ):',
        math: `\\Delta = b^2 - 4ac = (${b})^2 - 4 \\cdot ${a} \\cdot ${c} = ${discriminant}`
    });

    let roots = [];
    if (discriminant > 0) {
        const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        // Sorterer røttene
        roots = [Math.min(root1, root2), Math.max(root1, root2)];

        steps.push({
            description: `Siden diskriminanten (Δ > 0) er positiv, har vi to nullpunkter:`,
            math: `x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a} = \\frac{-(${b}) \\pm \\sqrt{${discriminant}}}{2 \\cdot ${a}}`
        });
        steps.push({
            description: `De to nullpunktene er:`,
            math: `x_1 = ${roots[0].toFixed(2)}, \\quad x_2 = ${roots[1].toFixed(2)}`
        });
    } else if (discriminant === 0) {
        const root = -b / (2 * a);
        roots = [root];
        steps.push({
            description: `Siden diskriminanten (Δ = 0) er null, tangerer grafen x-aksen, og vi har ett nullpunkt:`,
            math: `x = \\frac{-b}{2a} = ${root}`
        });
    } else {
        steps.push({
            description: `Siden diskriminanten (Δ < 0) er negativ, har funksjonen ingen reelle nullpunkter. Grafen krysser ikke x-aksen.`,
            math: `\\Delta < 0 \\implies x \\notin \\mathbb{R}`
        });
    }

    return {
        vertex,
        roots,
        steps
    };
}

/**
 * Hjelpefunksjon for å generere datapunkter for grafen.
 */
export function generateQuadraticDataPoints(a, b, c, xMin, xMax, step = 0.5) {
    const data = [];
    for (let x = xMin; x <= xMax; x += step) {
        data.push({
            x: x,
            y: a * (x ** 2) + b * x + c
        });
    }
    return data;
}

/**
 * Løser abc-formelen eksplisitt for nullpunkter
 * @param {number} a - Koeffisient a
 * @param {number} b - Koeffisient b
 * @param {number} c - Koeffisient c
 * @returns {Object} Røtter og steps
 */
export function analyzeABC(a, b, c) {
    const steps = [];

    steps.push({
        description: 'Vi skal finne nullpunktene ved hjelp av abc-formelen:',
        math: `x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}`
    });

    steps.push({
        description: `Våre verdier er: $a = ${a}$, $b = ${b}$, og $c = ${c}$. Vi setter dette inn i formelen:`,
        math: `x = \\frac{-(${b}) \\pm \\sqrt{(${b})^2 - 4 \\cdot ${a} \\cdot ${c}}}{2 \\cdot ${a}}`
    });

    const b2 = b ** 2;
    const ac4 = 4 * a * c;

    steps.push({
        description: 'Vi regner ut det som står under rottegnet (diskriminanten) og nevneren:',
        math: `x = \\frac{${-b} \\pm \\sqrt{${b2} - ${ac4}}}{${2 * a}}`
    });

    const discriminant = b2 - ac4;

    steps.push({
        description: 'Forenkler under rottegnet:',
        math: `x = \\frac{${-b} \\pm \\sqrt{${discriminant}}}{${2 * a}}`
    });

    let roots = [];
    if (discriminant > 0) {
        const sqrtDesc = Math.sqrt(discriminant);
        steps.push({
            description: `Siden ${discriminant} > 0, har ligningen to løsninger. Kvadratroten er:`,
            math: `\\sqrt{${discriminant}} = ${Number.isInteger(sqrtDesc) ? sqrtDesc : sqrtDesc.toFixed(2)}`
        });

        const root1 = (-b + sqrtDesc) / (2 * a);
        const root2 = (-b - sqrtDesc) / (2 * a);
        roots = [Math.min(root1, root2), Math.max(root1, root2)];

        steps.push({
            description: `Da får vi to løsninger:`,
            math: `x_1 = \\frac{${-b} - ${Number.isInteger(sqrtDesc) ? sqrtDesc : sqrtDesc.toFixed(2)}}{${2 * a}} = ${roots[0].toFixed(2)}, \\quad x_2 = \\frac{${-b} + ${Number.isInteger(sqrtDesc) ? sqrtDesc : sqrtDesc.toFixed(2)}}{${2 * a}} = ${roots[1].toFixed(2)}`
        });
    } else if (discriminant === 0) {
        const root = -b / (2 * a);
        roots = [root];
        steps.push({
            description: `Siden det står 0 under roten, får vi én løsning:`,
            math: `x = \\frac{${-b}}{${2 * a}} = ${root.toFixed(2)}`
        });
    } else {
        steps.push({
            description: `Vi kan ikke ta kvadratroten av et negativt tall (${discriminant}). Derfor har ligningen ingen løsning.`,
            math: `\\Delta < 0 \\implies \\text{Ingen løsning}`
        });
    }

    return {
        roots,
        steps
    };
}

/**
 * Finner topp- eller bunnpunkt for en andregradsfunksjon
 * @param {number} a - Koeffisient a
 * @param {number} b - Koeffisient b
 * @param {number} c - Koeffisient c
 * @returns {Object} Punktet og steps
 */
export function analyzeVertex(a, b, c) {
    const steps = [];
    const isTopPoint = a < 0;

    steps.push({
        description: `Funksjonen er $f(x) = ${a}x^2 ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c}$. Først sjekker vi om det er et topp- eller bunnpunkt. Siden $a = ${a}$ (som er ${isTopPoint ? '<' : '>'} 0), smiler grafen ${isTopPoint ? 'surt (∩)' : 'blidt (∪)'}, og vi har et ${isTopPoint ? 'toppunkt' : 'bunnpunkt'}.`,
        math: ``
    });

    steps.push({
        description: 'For å finne x-koordinaten til ekstremalpunktet, bruker vi formelen for symmetriaksen:',
        math: `x = \\frac{-b}{2a}`
    });

    const xVertex = -b / (2 * a);
    steps.push({
        description: `Vi setter inn $a = ${a}$ og $b = ${b}$:`,
        math: `x = \\frac{-(${b})}{2 \\cdot ${a}} = \\frac{${-b}}{${2 * a}} = ${xVertex}`
    });

    const yVertex = a * (xVertex ** 2) + b * xVertex + c;
    steps.push({
        description: `For å finne y-koordinaten, setter vi $x = ${xVertex}$ inn i funksjonen igjen:`,
        math: `y = f(${xVertex}) = ${a}(${xVertex})^2 ${b >= 0 ? '+' : ''}${b}(${xVertex}) ${c >= 0 ? '+' : ''}${c}`
    });

    steps.push({
        description: `Vi regner ut:`,
        math: `y = ${a}(${xVertex ** 2}) ${b >= 0 ? '+' : ''}${b * xVertex} ${c >= 0 ? '+' : ''}${c} = ${yVertex}`
    });

    const type = isTopPoint ? 'Toppunkt' : 'Bunnpunkt';
    steps.push({
        description: `Svar: ${type}et er:`,
        math: `(${xVertex.toFixed(2)}, ${yVertex.toFixed(2)})`
    });

    return {
        x: xVertex,
        y: yVertex,
        type: type,
        steps
    };
}

/**
 * Løser en lineær funksjon y = ax + b
 * Returnerer et objekt med resultater og trinnvis utregning.
 *
 * @param {number} a - Stigningstall
 * @param {number} b - Konstantledd
 * @returns {Object} Resultatobjekt med skjæringspunkter og steps
 */
export function analyzeLinear(a, b) {
    const steps = [];

    // 1. Definer funksjonen
    steps.push({
        description: 'Vi starter med den lineære funksjonen på standardform:',
        math: `f(x) = ${a}x ${b >= 0 ? '+' : ''}${b}`
    });

    // 2. Forklar stigningstall og konstantledd
    steps.push({
        description: `Stigningstallet er ${a}. Dette betyr at for hver enhet vi går til høyre på x-aksen, går grafen ${Math.abs(a)} enheter ${a >= 0 ? 'opp' : 'ned'}.`,
        math: `a = ${a}`
    });
    steps.push({
        description: `Konstantleddet er ${b}. Dette er der grafen skjærer y-aksen.`,
        math: `b = ${b}`
    });

    // 3. Finn skjæringspunkt med y-aksen
    const yIntercept = { x: 0, y: b };
    steps.push({
        description: `Skjæringspunktet med y-aksen (når x = 0) er:`,
        math: `f(0) = ${a}(0) ${b >= 0 ? '+' : ''}${b} = ${b}`
    });

    // 4. Finn skjæringspunkt med x-aksen (nullpunkt)
    let root = null;
    if (a !== 0) {
        root = -b / a;
        steps.push({
            description: `Vi finner nullpunktet ved å sette f(x) = 0:`,
            math: `${a}x ${b >= 0 ? '+' : ''}${b} = 0`
        });
        steps.push({
            description: `Flytter ${b} over og deler på ${a}:`,
            math: `x = \\frac{-(${b})}{${a}} = ${root}`
        });
    } else {
        if (b === 0) {
            steps.push({
                description: `Siden a = 0 og b = 0, er f(x) = 0 for alle x. Grafen ligger på x-aksen.`,
                math: `0x + 0 = 0`
            });
        } else {
            steps.push({
                description: `Siden a = 0 og b = ${b}, er grafen en horisontal linje som aldri skjærer x-aksen.`,
                math: `${b} \\neq 0`
            });
        }
    }

    return {
        yIntercept,
        root,
        steps
    };
}

/**
 * Hjelpefunksjon for å generere datapunkter for lineær graf.
 */
export function generateLinearDataPoints(a, b, xMin, xMax, step = 0.5) {
    const data = [];
    for (let x = xMin; x <= xMax; x += step) {
        data.push({
            x: x,
            y: a * x + b
        });
    }
    return data;
}
