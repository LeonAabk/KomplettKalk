/**
 * Modul for Geometri
 */

/**
 * Løser Pytagoras' setning. A^2 + B^2 = C^2.
 * @param {number|null} a - Katet a
 * @param {number|null} b - Katet b
 * @param {number|null} c - Hypotenus c
 * @returns {Object} Resultat med beregnet verdi og steps
 */
export function analyzePythagoras(a, b, c) {
    const steps = [];
    let result = null;
    let missing = '';

    steps.push({
        description: `Pytagoras' setning sier at kvadratet av hypotenusen er lik summen av kvadratene av katetene i en rettvinklet trekant:`,
        math: `a^2 + b^2 = c^2`
    });

    if (a !== null && b !== null) {
        missing = 'c';
        const a2 = a ** 2;
        const b2 = b ** 2;
        const sum = a2 + b2;
        result = Math.sqrt(sum);

        steps.push({
            description: `Vi kjenner begge katetene (a = ${a}, b = ${b}) og skal finne hypotenusen (c). Utregningen blir:`,
            math: `a^2 + b^2 = c^2 \\rightarrow ${a}^2 + ${b}^2 = c^2 \\rightarrow ${a2} + ${b2} = ${sum} \\rightarrow c = \\sqrt{${sum}} = ${Number.isInteger(result) ? result : result.toFixed(2)}`
        });
    } else if (a !== null && c !== null) {
        missing = 'b';
        const a2 = a ** 2;
        const c2 = c ** 2;
        const diff = c2 - a2;
        result = Math.sqrt(diff);

        steps.push({
            description: `Vi kjenner én katet (a = ${a}) og hypotenusen (c = ${c}), og skal finne den andre kateten (b). Utregningen blir:`,
            math: `a^2 + b^2 = c^2 \\rightarrow ${a}^2 + b^2 = ${c}^2 \\rightarrow ${a2} + b^2 = ${c2} \\rightarrow b^2 = ${c2} - ${a2} = ${diff} \\rightarrow b = \\sqrt{${diff}} = ${Number.isInteger(result) ? result : result.toFixed(2)}`
        });
    } else if (b !== null && c !== null) {
        missing = 'a';
        const b2 = b ** 2;
        const c2 = c ** 2;
        const diff = c2 - b2;
        result = Math.sqrt(diff);

        steps.push({
            description: `Vi kjenner én katet (b = ${b}) og hypotenusen (c = ${c}), og skal finne den andre kateten (a). Utregningen blir:`,
            math: `a^2 + b^2 = c^2 \\rightarrow a^2 + ${b}^2 = ${c}^2 \\rightarrow a^2 + ${b2} = ${c2} \\rightarrow a^2 = ${c2} - ${b2} = ${diff} \\rightarrow a = \\sqrt{${diff}} = ${Number.isInteger(result) ? result : result.toFixed(2)}`
        });
    }

    return {
        missing,
        result,
        steps
    };
}

/**
 * Beregner areal og buelengde av en sirkelsektor.
 * @param {number} r - Radius
 * @param {number} v - Vinkel i grader
 * @returns {Object} Resultat og steps
 */
export function analyzeSector(r, v) {
    const steps = [];

    steps.push({
        description: `En sirkelsektor er en del av en sirkel begrenset av to radier og en sirkelbue. Vinkelen $v$ er ${v}^{\\circ}.`,
        math: ''
    });

    const area = (Math.PI * r * r * v) / 360;

    steps.push({
        description: `Arealet av en sirkelsektor regnes ut ved å ta andelen av hele sirkelens areal:`,
        math: `A = \\frac{\\pi \\cdot r^2 \\cdot v}{360}`
    });

    steps.push({
        description: `Vi setter inn $r = ${r}$ og $v = ${v}$:`,
        math: `A = \\frac{\\pi \\cdot ${r}^2 \\cdot ${v}}{360} \\approx ${area.toFixed(2)}`
    });

    const arcLength = (2 * Math.PI * r * v) / 360;

    steps.push({
        description: `Buelengden ($b$) regnes ut ved å ta andelen av hele sirkelens omkrets:`,
        math: `b = \\frac{2 \\cdot \\pi \\cdot r \\cdot v}{360}`
    });

    steps.push({
        description: `Vi setter inn verdiene for $r$ og $v$:`,
        math: `b = \\frac{2 \\cdot \\pi \\cdot ${r} \\cdot ${v}}{360} \\approx ${arcLength.toFixed(2)}`
    });

    return {
        area,
        arcLength,
        steps
    };
}

/**
 * Beregner areal for 2D-figurer
 * @param {string} shape - Type figur ('circle', 'rectangle', 'triangle')
 * @param {number} val1 - Første verdi (f.eks radius, grunnlinje eller lengde)
 * @param {number|null} val2 - Andre verdi (f.eks høyde eller bredde), ikke brukt for sirkel
 * @returns {Object} Resultat og steps
 */
export function analyzeArea(shape, val1, val2) {
    const steps = [];
    let result = 0;

    if (shape === 'circle') {
        steps.push({
            description: `Arealet av en sirkel regnes ut med formelen:`,
            math: `A = \\pi \\cdot r^2`
        });

        const r2 = val1 ** 2;
        result = Math.PI * r2;

        steps.push({
            description: `Vi setter inn radius (r = ${val1}):`,
            math: `A = \\pi \\cdot ${val1}^2 = \\pi \\cdot ${r2} \\approx ${result.toFixed(2)}`
        });
    } else if (shape === 'rectangle') {
        steps.push({
            description: `Arealet av et rektangel regnes ut ved å gange lengde med bredde:`,
            math: `A = l \\cdot b`
        });

        result = val1 * val2;

        steps.push({
            description: `Vi setter inn lengde (${val1}) og bredde (${val2}):`,
            math: `A = ${val1} \\cdot ${val2} = ${result}`
        });
    } else if (shape === 'triangle') {
        steps.push({
            description: `Arealet av en trekant regnes ut ved å gange grunnlinjen med høyden og dele på to:`,
            math: `A = \\frac{g \\cdot h}{2}`
        });

        const product = val1 * val2;
        result = product / 2;

        steps.push({
            description: `Vi setter inn grunnlinje (g = ${val1}) og høyde (h = ${val2}):`,
            math: `A = \\frac{${val1} \\cdot ${val2}}{2} = \\frac{${product}}{2} = ${result}`
        });
    }

    return {
        result,
        steps
    };
}

/**
 * Bruker trigonometri (rettvinklet trekant) for å finne en ukjent side.
 * @param {number} angle - Vinkelen i grader
 * @param {string} givenType - Hvilken side som er gitt ('opp', 'adj', 'hyp')
 * @param {number} givenValue - Lengden av den gitte siden
 * @param {string} findType - Hvilken side som skal finnes ('opp', 'adj', 'hyp')
 * @returns {Object} Resultat og steps
 */
export function analyzeTrigonometry(angle, givenType, givenValue, findType) {
    const steps = [];
    let result = 0;

    // Konverter vinkel til radianer for Math.sin/cos/tan
    const rad = angle * (Math.PI / 180);

    // Hjelpefunksjoner for norske navn
    const getName = (type) => {
        if (type === 'opp') return 'motstående katet';
        if (type === 'adj') return 'hosliggende katet';
        if (type === 'hyp') return 'hypotenus';
        return type;
    };

    const givenName = getName(givenType);
    const findName = getName(findType);

    steps.push({
        description: `Vi vet at vinkelen er $v = ${angle}^\\circ$, og vi kjenner ${givenName} ($${givenValue}$). Vi skal finne ${findName}.`,
        math: ``
    });

    if ((givenType === 'opp' && findType === 'hyp') || (givenType === 'hyp' && findType === 'opp')) {
        // Sinus: sin(v) = opp / hyp
        steps.push({
            description: `Siden vi jobber med motstående katet og hypotenus, bruker vi sinus:`,
            math: `\\sin(v) = \\frac{\\text{motstående}}{\\text{hypotenus}}`
        });

        const sinVal = Math.sin(rad);
        steps.push({
            description: `Vi regner ut $\\sin(${angle}^\\circ)$:`,
            math: `\\sin(${angle}^\\circ) \\approx ${sinVal.toFixed(4)}`
        });

        if (givenType === 'hyp') {
            result = sinVal * givenValue;
            steps.push({
                description: `Vi vil finne motstående katet (som vi kaller $x$). Vi setter inn i formelen:`,
                math: `\\sin(${angle}^\\circ) = \\frac{x}{${givenValue}}`
            });
            steps.push({
                description: `Ganger med ${givenValue} på begge sider:`,
                math: `x = ${givenValue} \\cdot \\sin(${angle}^\\circ) \\approx ${result.toFixed(2)}`
            });
        } else {
            // givenType === 'opp'
            result = givenValue / sinVal;
            steps.push({
                description: `Vi vil finne hypotenusen (som vi kaller $x$). Vi setter inn i formelen:`,
                math: `\\sin(${angle}^\\circ) = \\frac{${givenValue}}{x}`
            });
            steps.push({
                description: `Vi løser for $x$:`,
                math: `x = \\frac{${givenValue}}{\\sin(${angle}^\\circ)} \\approx ${result.toFixed(2)}`
            });
        }
    } else if ((givenType === 'adj' && findType === 'hyp') || (givenType === 'hyp' && findType === 'adj')) {
        // Cosinus: cos(v) = adj / hyp
        steps.push({
            description: `Siden vi jobber med hosliggende katet og hypotenus, bruker vi cosinus:`,
            math: `\\cos(v) = \\frac{\\text{hosliggende}}{\\text{hypotenus}}`
        });

        const cosVal = Math.cos(rad);
        steps.push({
            description: `Vi regner ut $\\cos(${angle}^\\circ)$:`,
            math: `\\cos(${angle}^\\circ) \\approx ${cosVal.toFixed(4)}`
        });

        if (givenType === 'hyp') {
            result = cosVal * givenValue;
            steps.push({
                description: `Vi vil finne hosliggende katet ($x$). Vi setter inn:`,
                math: `\\cos(${angle}^\\circ) = \\frac{x}{${givenValue}}`
            });
            steps.push({
                description: `Ganger med ${givenValue} på begge sider:`,
                math: `x = ${givenValue} \\cdot \\cos(${angle}^\\circ) \\approx ${result.toFixed(2)}`
            });
        } else {
            result = givenValue / cosVal;
            steps.push({
                description: `Vi vil finne hypotenusen ($x$). Vi setter inn:`,
                math: `\\cos(${angle}^\\circ) = \\frac{${givenValue}}{x}`
            });
            steps.push({
                description: `Løser for $x$:`,
                math: `x = \\frac{${givenValue}}{\\cos(${angle}^\\circ)} \\approx ${result.toFixed(2)}`
            });
        }
    } else if ((givenType === 'opp' && findType === 'adj') || (givenType === 'adj' && findType === 'opp')) {
        // Tangens: tan(v) = opp / adj
        steps.push({
            description: `Siden vi jobber med motstående og hosliggende katet, bruker vi tangens:`,
            math: `\\tan(v) = \\frac{\\text{motstående}}{\\text{hosliggende}}`
        });

        const tanVal = Math.tan(rad);
        steps.push({
            description: `Vi regner ut $\\tan(${angle}^\\circ)$:`,
            math: `\\tan(${angle}^\\circ) \\approx ${tanVal.toFixed(4)}`
        });

        if (givenType === 'adj') {
            result = tanVal * givenValue;
            steps.push({
                description: `Vi skal finne motstående katet ($x$). Vi setter inn:`,
                math: `\\tan(${angle}^\\circ) = \\frac{x}{${givenValue}}`
            });
            steps.push({
                description: `Ganger med ${givenValue}:`,
                math: `x = ${givenValue} \\cdot \\tan(${angle}^\\circ) \\approx ${result.toFixed(2)}`
            });
        } else {
            result = givenValue / tanVal;
            steps.push({
                description: `Vi skal finne hosliggende katet ($x$). Vi setter inn:`,
                math: `\\tan(${angle}^\\circ) = \\frac{${givenValue}}{x}`
            });
            steps.push({
                description: `Løser for $x$:`,
                math: `x = \\frac{${givenValue}}{\\tan(${angle}^\\circ)} \\approx ${result.toFixed(2)}`
            });
        }
    }

    return {
        result,
        steps
    };
}

/**
 * Beregner volum for 3D-figurer
 * @param {string} shape - Type figur ('cylinder', 'cube', 'sphere')
 * @param {number} val1 - Første verdi (radius eller sidekant)
 * @param {number|null} val2 - Andre verdi (høyde, kun for sylinder)
 * @returns {Object} Resultat og steps
 */
export function analyzeVolume(shape, val1, val2) {
    const steps = [];
    let result = 0;

    if (shape === 'cylinder') {
        steps.push({
            description: `Volumet av en sylinder regnes ut med formelen:`,
            math: `V = \\pi \\cdot r^2 \\cdot h`
        });

        const r2 = val1 ** 2;
        result = Math.PI * r2 * val2;

        steps.push({
            description: `Vi setter inn radius ($r = ${val1}$) og høyde ($h = ${val2}$):`,
            math: `V = \\pi \\cdot ${val1}^2 \\cdot ${val2} = \\pi \\cdot ${r2} \\cdot ${val2} \\approx ${result.toFixed(2)}`
        });
    } else if (shape === 'cube') {
        steps.push({
            description: `Volumet av en kube regnes ut med formelen:`,
            math: `V = s^3`
        });

        result = val1 ** 3;

        steps.push({
            description: `Vi setter inn sidekanten ($s = ${val1}$):`,
            math: `V = ${val1}^3 = ${val1} \\cdot ${val1} \\cdot ${val1} = ${result}`
        });
    } else if (shape === 'sphere') {
        steps.push({
            description: `Volumet av en kule regnes ut med formelen:`,
            math: `V = \\frac{4}{3} \\cdot \\pi \\cdot r^3`
        });

        const r3 = val1 ** 3;
        result = (4 / 3) * Math.PI * r3;

        steps.push({
            description: `Vi setter inn radius ($r = ${val1}$):`,
            math: `V = \\frac{4}{3} \\cdot \\pi \\cdot ${val1}^3 = \\frac{4}{3} \\cdot \\pi \\cdot ${r3} \\approx ${result.toFixed(2)}`
        });
    }

    return {
        result,
        steps
    };
}

/**
 * Beregner formlikhet (ukjent side i formlike trekanter)
 * Forholdstall = largeSide1 / smallSide1
 * largeSide2 = smallSide2 * Forholdstall
 * @param {number} smallSide1
 * @param {number} largeSide1
 * @param {number} smallSide2
 * @param {number|null} largeSide2 - null hvis den skal finnes, ellers finnes smallSide2
 * @returns {Object} Resultat og steps
 */
export function analyzeSimilarity(smallSide1, largeSide1, smallSide2, largeSide2) {
    const steps = [];

    steps.push({
        description: `For formlike trekanter er forholdet mellom samsvarende sider konstant. Vi kaller dette forholdstallet $k$:`,
        math: `k = \\frac{\\text{Stor side}}{\\text{Liten side}}`
    });

    const k = largeSide1 / smallSide1;

    steps.push({
        description: `Vi kjenner et par av samsvarende sider (${smallSide1} og ${largeSide1}). Vi regner ut forholdstallet:`,
        math: `k = \\frac{${largeSide1}}{${smallSide1}} = ${k.toFixed(4)}`
    });

    let result = 0;

    if (largeSide2 === null) {
        result = smallSide2 * k;
        steps.push({
            description: `For å finne den ukjente store siden ($x$), ganger vi den kjente lille siden (${smallSide2}) med forholdstallet $k$:`,
            math: `x = ${smallSide2} \\cdot ${k.toFixed(4)} = ${result.toFixed(2)}`
        });
    } else if (smallSide2 === null) {
        result = largeSide2 / k;
        steps.push({
            description: `For å finne den ukjente lille siden ($x$), deler vi den kjente store siden (${largeSide2}) med forholdstallet $k$:`,
            math: `x = \\frac{${largeSide2}}{${k.toFixed(4)}} = ${result.toFixed(2)}`
        });
    }

    return {
        result,
        steps
    };
}

/**
 * Sjekker om to trekanter er kongruente.
 */
export function analyzeCongruence(method, t1, t2) {
    const steps = [];
    let isCongruent = false;

    steps.push({
        description: `Vi sammenligner de to trekantene basert på metoden: ${method}.`,
        math: ''
    });

    // Enkel flyttall-sammenligning
    const approxEqual = (a, b) => Math.abs(a - b) < 0.0001;

    if (method === 'SSS') {
        const sortedT1 = [...t1].sort((a,b)=>a-b);
        const sortedT2 = [...t2].sort((a,b)=>a-b);
        isCongruent = approxEqual(sortedT1[0], sortedT2[0]) &&
                      approxEqual(sortedT1[1], sortedT2[1]) &&
                      approxEqual(sortedT1[2], sortedT2[2]);

        steps.push({
            description: 'Vi sorterer og sammenligner de tre sidene:',
            math: `\\text{Trekant 1: } ${sortedT1.join(', ')} \\quad \\text{Trekant 2: } ${sortedT2.join(', ')}`
        });
    } else if (method === 'SAS') {
        // Vi antar at input er [side1, vinkel_i_mellom, side2]
        // Bytter plass for å tillate speiling
        const matchDirect = approxEqual(t1[0], t2[0]) && approxEqual(t1[1], t2[1]) && approxEqual(t1[2], t2[2]);
        const matchReversed = approxEqual(t1[0], t2[2]) && approxEqual(t1[1], t2[1]) && approxEqual(t1[2], t2[0]);
        isCongruent = matchDirect || matchReversed;

        steps.push({
            description: 'Vi sjekker om to sider og den mellomliggende vinkelen er like (vi sjekker også for speiling):',
            math: `\\text{T1: } ${t1[0]}, ${t1[1]}^\\circ, ${t1[2]} \\quad \\text{T2: } ${t2[0]}, ${t2[1]}^\\circ, ${t2[2]}`
        });
    } else if (method === 'ASA') {
        // Input: [vinkel1, side_i_mellom, vinkel2]
        const matchDirect = approxEqual(t1[0], t2[0]) && approxEqual(t1[1], t2[1]) && approxEqual(t1[2], t2[2]);
        const matchReversed = approxEqual(t1[0], t2[2]) && approxEqual(t1[1], t2[1]) && approxEqual(t1[2], t2[0]);
        isCongruent = matchDirect || matchReversed;

        steps.push({
            description: 'Vi sjekker om to vinkler og den mellomliggende siden er like:',
            math: `\\text{T1: } ${t1[0]}^\\circ, ${t1[1]}, ${t1[2]}^\\circ \\quad \\text{T2: } ${t2[0]}^\\circ, ${t2[1]}, ${t2[2]}^\\circ`
        });
    }

    if (isCongruent) {
        steps.push({
            description: 'Konklusjon: Trekantene oppfyller kravene til kongruens.',
            math: '\\Delta T_1 \\cong \\Delta T_2'
        });
    } else {
        steps.push({
            description: 'Konklusjon: Kravene for kongruens er IKKE oppfylt.',
            math: '\\Delta T_1 \\not\\cong \\Delta T_2'
        });
    }

    return { result: isCongruent ? 'Kongruente' : 'Ikke kongruente', isCongruent, steps };
}

/**
 * Løser trekant (Cosinussetningen for å finne side eller vinkel).
 */
export function analyzeTriangleSolver(method, val1, val2, val3) {
    const steps = [];
    let result = null;

    if (method === 'SAS') {
        // Gitt to sider b, c og vinkel A (i grader). Finn side a.
        // val1=b, val2=c, val3=A
        steps.push({
            description: 'Vi bruker cosinussetningen for å finne den tredje siden ($a$):',
            math: 'a^2 = b^2 + c^2 - 2bc \\cdot \\cos(A)'
        });

        const A_rad = val3 * Math.PI / 180;
        const a_squared = val1*val1 + val2*val2 - 2*val1*val2*Math.cos(A_rad);

        steps.push({
            description: 'Setter inn de kjente verdiene:',
            math: `a^2 = ${val1}^2 + ${val2}^2 - 2(${val1})(${val2}) \\cdot \\cos(${val3}^\\circ)`
        });

        result = Math.sqrt(a_squared);
        steps.push({
            description: 'Regner ut og tar kvadratroten:',
            math: `a = \\sqrt{${a_squared.toFixed(4)}} = ${result.toFixed(2)}`
        });

        return { result, steps, type: 'side' };

    } else if (method === 'SSS') {
        // Gitt tre sider a, b, c (hvor val1=a, val2=b, val3=c). Finn vinkel A motstående side a.
        steps.push({
            description: 'Vi omskriver cosinussetningen for å finne vinkel $A$:',
            math: '\\cos(A) = \\frac{b^2 + c^2 - a^2}{2bc}'
        });

        const cosA = (val2*val2 + val3*val3 - val1*val1) / (2 * val2 * val3);

        steps.push({
            description: 'Setter inn sidene:',
            math: `\\cos(A) = \\frac{${val2}^2 + ${val3}^2 - ${val1}^2}{2(${val2})(${val3})} = ${cosA.toFixed(4)}`
        });

        if (cosA < -1 || cosA > 1) {
            steps.push({
                description: 'Verdien er utenfor gyldig område [-1, 1]. En slik trekant eksisterer ikke.',
                math: ''
            });
            return { result: 'Ugyldig trekant', steps, type: 'error' };
        }

        const A_rad = Math.acos(cosA);
        result = A_rad * 180 / Math.PI;

        steps.push({
            description: 'Finner vinkelen ved hjelp av invers cosinus ($\\arccos$):',
            math: `A = \\arccos(${cosA.toFixed(4)}) = ${result.toFixed(2)}^\\circ`
        });

        return { result, steps, type: 'vinkel' };
    }

    return { result: null, steps, type: 'error' };
}
