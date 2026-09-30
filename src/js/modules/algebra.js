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

/**
 * Løser et likningssett med to ukjente:
 * a1*x + b1*y = c1
 * a2*x + b2*y = c2
 * Bruker innsettingsmetoden for å vise trinn.
 */
export function analyzeEquationSystem(a1, b1, c1, a2, b2, c2) {
    const steps = [];

    steps.push({
        description: 'Vi skal løse et likningssett med to ukjente (x og y). De to likningene er:',
        math: `\\begin{cases} ${a1}x ${b1 >= 0 ? '+' : ''}${b1}y = ${c1} \\\\ ${a2}x ${b2 >= 0 ? '+' : ''}${b2}y = ${c2} \\end{cases}`
    });

    // Sørg for at a1 ikke er 0 hvis mulig, ved å bytte likningene
    if (a1 === 0 && a2 !== 0) {
        steps.push({
            description: 'Siden a₁ = 0, bytter vi rekkefølge på likningene for å gjøre innsettingsmetoden enklere:',
            math: `\\begin{cases} ${a2}x ${b2 >= 0 ? '+' : ''}${b2}y = ${c2} \\\\ ${a1}x ${b1 >= 0 ? '+' : ''}${b1}y = ${c1} \\end{cases}`
        });
        const tempA = a1, tempB = b1, tempC = c1;
        a1 = a2; b1 = b2; c1 = c2;
        a2 = tempA; b2 = tempB; c2 = tempC;
    } else if (a1 === 0 && a2 === 0) {
        return { result: null, steps: [{description: 'Både a₁ og a₂ er 0. Vi har ingen x.', math: ''}] };
    }

    const det = a1 * b2 - a2 * b1;
    if (det === 0) {
        if (a1 * c2 - a2 * c1 === 0) {
            steps.push({
                description: 'Likningssettet har uendelig mange løsninger (de to linjene er sammenfallende).',
                math: `\\det = 0`
            });
        } else {
            steps.push({
                description: 'Likningssettet har ingen løsning (de to linjene er parallelle).',
                math: `\\det = 0`
            });
        }
        return { result: null, steps };
    }

    steps.push({
        description: 'Vi bruker innsettingsmetoden. Først løser vi den første likningen med hensyn på x:',
        math: `${a1}x = ${c1} ${-b1 >= 0 ? '+' : ''}${-b1}y`
    });

    steps.push({
        description: `Deler på ${a1} for å få x alene:`,
        math: `x = \\frac{${c1} ${-b1 >= 0 ? '+' : ''}${-b1}y}{${a1}}`
    });

    const xExprC = c1 / a1;
    const xExprY = -b1 / a1;

    steps.push({
        description: `Forenkler uttrykket for x:`,
        math: `x = ${xExprC.toFixed(4)} ${xExprY >= 0 ? '+' : ''}${xExprY.toFixed(4)}y`
    });

    steps.push({
        description: `Nå setter vi dette uttrykket for x inn i den andre likningen:`,
        math: `${a2}(${xExprC.toFixed(4)} ${xExprY >= 0 ? '+' : ''}${xExprY.toFixed(4)}y) ${b2 >= 0 ? '+' : ''}${b2}y = ${c2}`
    });

    const constTerm = a2 * xExprC;
    const yTerm = a2 * xExprY;

    steps.push({
        description: `Vi ganger ut parentesen:`,
        math: `${constTerm.toFixed(4)} ${yTerm >= 0 ? '+' : ''}${yTerm.toFixed(4)}y ${b2 >= 0 ? '+' : ''}${b2}y = ${c2}`
    });

    const combinedYTerm = yTerm + b2;
    const rightSideConst = c2 - constTerm;

    steps.push({
        description: `Vi samler y-leddene på venstre side og tallene på høyre side:`,
        math: `${combinedYTerm.toFixed(4)}y = ${c2} ${-constTerm >= 0 ? '+' : ''}${-constTerm.toFixed(4)}`
    });

    steps.push({
        description: `Regner ut:`,
        math: `${combinedYTerm.toFixed(4)}y = ${rightSideConst.toFixed(4)}`
    });

    const yResult = rightSideConst / combinedYTerm;

    steps.push({
        description: `Vi deler på ${combinedYTerm.toFixed(4)} for å finne y:`,
        math: `y = \\frac{${rightSideConst.toFixed(4)}}{${combinedYTerm.toFixed(4)}} = ${yResult.toFixed(4)}`
    });

    const xResult = xExprC + xExprY * yResult;

    steps.push({
        description: `Nå som vi har y, setter vi den inn i uttrykket for x:`,
        math: `x = ${xExprC.toFixed(4)} ${xExprY >= 0 ? '+' : ''}${xExprY.toFixed(4)}(${yResult.toFixed(4)})`
    });

    steps.push({
        description: `Regner ut:`,
        math: `x = ${xResult.toFixed(4)}`
    });

    steps.push({
        description: `Løsningen på likningssettet er:`,
        math: `x = ${Number.isInteger(xResult) ? xResult : xResult.toFixed(2)}, \\quad y = ${Number.isInteger(yResult) ? yResult : yResult.toFixed(2)}`
    });

    return {
        result: { x: xResult, y: yResult },
        steps
    };
}

/**
 * Faktoriserer et andregradsuttrykk: ax^2 + bx + c
 */
export function analyzeFactoring(a, b, c) {
    const steps = [];

    steps.push({
        description: `Vi skal faktorisere andregradsuttrykket:`,
        math: `${a}x^2 ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c}`
    });

    steps.push({
        description: `En generell regel er at hvis uttrykket har nullpunktene $x_1$ og $x_2$, kan vi faktorisere det som:`,
        math: `a(x - x_1)(x - x_2)`
    });

    steps.push({
        description: `Først må vi finne nullpunktene ved hjelp av abc-formelen. Diskriminanten (Δ) er:`,
        math: `\\Delta = b^2 - 4ac = (${b})^2 - 4 \\cdot ${a} \\cdot ${c}`
    });

    const discriminant = b ** 2 - 4 * a * c;

    steps.push({
        description: `Vi regner ut:`,
        math: `\\Delta = ${discriminant}`
    });

    if (discriminant < 0) {
        steps.push({
            description: `Siden diskriminanten er negativ, har uttrykket ingen reelle nullpunkter, og kan ikke faktoriseres med reelle tall.`,
            math: `\\Delta < 0 \\implies \\text{Kan ikke faktoriseres}`
        });
        return { result: null, steps };
    }

    const sqrtDesc = Math.sqrt(discriminant);

    if (discriminant === 0) {
        const root = -b / (2 * a);
        steps.push({
            description: `Siden diskriminanten er 0, har vi ett nullpunkt (to sammenfallende røtter):`,
            math: `x = \\frac{-b}{2a} = \\frac{-(${b})}{2 \\cdot ${a}} = ${root}`
        });
        steps.push({
            description: `Da blir faktoriseringen:`,
            math: `${a}(x - ${root})^2`
        });
        return { result: { a, root1: root, root2: root }, steps };
    }

    const root1 = (-b + sqrtDesc) / (2 * a);
    const root2 = (-b - sqrtDesc) / (2 * a);

    steps.push({
        description: `Siden diskriminanten er positiv, har vi to nullpunkter:`,
        math: `x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a} = \\frac{-(${b}) \\pm ${Number.isInteger(sqrtDesc) ? sqrtDesc : sqrtDesc.toFixed(2)}}{2 \\cdot ${a}}`
    });

    steps.push({
        description: `Nullpunktene er:`,
        math: `x_1 = ${root1}, \\quad x_2 = ${root2}`
    });

    steps.push({
        description: `Vi setter $a = ${a}$ og nullpunktene inn i formelen $a(x - x_1)(x - x_2)$ og får den faktoriserte formen:`,
        math: `${a}(x ${root1 < 0 ? '+' : '-' } ${Math.abs(root1)})(x ${root2 < 0 ? '+' : '-' } ${Math.abs(root2)})`
    });

    return {
        result: { a, root1, root2 },
        steps
    };
}

/**
 * Finner symmetrilinjen for en andregradsfunksjon
 * @param {number} a - Koeffisient a
 * @param {number} b - Koeffisient b
 * @returns {Object} Resultat og steps
 */
export function analyzeSymmetryLine(a, b) {
    const steps = [];

    steps.push({
        description: `Formelen for symmetrilinjen til en andregradsfunksjon er:`,
        math: `x = \\frac{-b}{2a}`
    });

    steps.push({
        description: `Vi setter inn verdiene for a (${a}) og b (${b}):`,
        math: `x = \\frac{-(${b})}{2 \\cdot ${a}}`
    });

    const teller = -b;
    const nevner = 2 * a;
    const result = teller / nevner;

    steps.push({
        description: `Regner ut teller og nevner:`,
        math: `x = \\frac{${teller}}{${nevner}} = ${result.toFixed(2)}`
    });

    return {
        result,
        steps
    };
}

/**
 * Finner nullpunktet for en lineær funksjon (ax + b = 0)
 * @param {number} a - Koeffisient a
 * @param {number} b - Koeffisient b
 * @returns {Object} Resultat og steps
 */
export function analyzeLinearRoot(a, b) {
    const steps = [];

    steps.push({
        description: `Vi skal finne nullpunktet til den lineære funksjonen $f(x) = ${a}x ${b >= 0 ? '+' : ''}${b}$. Vi setter opp likningen:`,
        math: `${a}x ${b >= 0 ? '+' : ''}${b} = 0`
    });

    if (a === 0) {
        if (b === 0) {
            steps.push({
                description: `Siden $a = 0$ og $b = 0$, er $0 = 0$ sant for alle $x$. Linjen ligger på x-aksen.`,
                math: `0x + 0 = 0`
            });
            return { result: 'Alle reelle tall', steps };
        } else {
            steps.push({
                description: `Siden $a = 0$ og $b = ${b}$, blir likningen $${b} = 0$, som er umulig. Linjen er parallell med x-aksen og har ingen nullpunkter.`,
                math: `${b} \\neq 0`
            });
            return { result: 'Ingen løsning', steps };
        }
    }

    steps.push({
        description: `Flytter konstantleddet (${b}) over til høyre side og bytter fortegn:`,
        math: `${a}x = ${-b}`
    });

    const result = -b / a;

    steps.push({
        description: `Deler på ${a} for å få $x$ alene:`,
        math: `x = \\frac{${-b}}{${a}} = ${result.toFixed(2)}`
    });

    return {
        result,
        steps
    };
}

/**
 * Finner gjennomsnittlig vekstfart (stigningstallet til sekanten)
 * @param {number} x1 - Punkt 1 x
 * @param {number} y1 - Punkt 1 y
 * @param {number} x2 - Punkt 2 x
 * @param {number} y2 - Punkt 2 y
 * @returns {Object} Resultat og steps
 */
export function analyzeAverageRateOfChange(x1, y1, x2, y2) {
    const steps = [];

    steps.push({
        description: `Gjennomsnittlig vekstfart mellom to punkter $(x_1, y_1)$ og $(x_2, y_2)$ er gitt ved formelen:`,
        math: `a = \\frac{\\Delta y}{\\Delta x} = \\frac{y_2 - y_1}{x_2 - x_1}`
    });

    steps.push({
        description: `Våre punkter er $(${x1}, ${y1})$ og $(${x2}, ${y2})$. Vi setter inn i formelen:`,
        math: `a = \\frac{${y2} - ${y1 < 0 ? `(${y1})` : y1}}{${x2} - ${x1 < 0 ? `(${x1})` : x1}}`
    });

    const dy = y2 - y1;
    const dx = x2 - x1;

    if (dx === 0) {
        steps.push({
            description: `Nevneren blir 0. Man kan ikke dele på 0, noe som betyr at linjen er vertikal og vekstfarten er udefinert.`,
            math: `a = \\frac{${dy}}{0}`
        });
        return { result: 'Udefinert', steps };
    }

    const result = dy / dx;

    steps.push({
        description: `Vi regner ut teller og nevner:`,
        math: `a = \\frac{${dy}}{${dx}} = ${result.toFixed(2)}`
    });

    return {
        result,
        steps
    };
}
