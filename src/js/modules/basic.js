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
 * Regner ut og viser utregning for potens.
 * @param {number} base - Grunntall
 * @param {number} exponent - Eksponent
 * @returns {Object} Resultat og steps
 */
export function analyzePower(base, exponent) {
    const steps = [];

    steps.push({
        description: `Vi skal regne ut potens med grunntall ${base} og eksponent ${exponent}:`,
        math: `${base}^{${exponent}}`
    });

    let result = 1;

    if (exponent === 0) {
        result = 1;
        steps.push({
            description: `Enhver potens (unntatt $0^0$) med eksponent 0 er lik 1.`,
            math: `${base}^0 = 1`
        });
    } else if (exponent > 0 && Number.isInteger(exponent) && exponent <= 10) {
        // Vis detaljert multiplikasjon for små positive heltallseksponenter
        let multStr = Array(exponent).fill(base).join(' \\cdot ');
        result = Math.pow(base, exponent);
        steps.push({
            description: `Eksponenten forteller oss hvor mange ganger grunntallet skal ganges med seg selv:`,
            math: `${base}^{${exponent}} = ${multStr} = ${result}`
        });
    } else if (exponent < 0 && Number.isInteger(exponent) && exponent >= -10) {
        const posExp = Math.abs(exponent);
        let multStr = Array(posExp).fill(base).join(' \\cdot ');
        result = Math.pow(base, exponent);
        steps.push({
            description: `En negativ eksponent betyr at vi deler 1 på potensen med positiv eksponent:`,
            math: `${base}^{${exponent}} = \\frac{1}{${base}^{${posExp}}}`
        });
        steps.push({
            description: `Regner ut nevneren:`,
            math: `\\frac{1}{${multStr}} = \\frac{1}{${Math.pow(base, posExp)}} = ${result}`
        });
    } else {
        result = Math.pow(base, exponent);
        steps.push({
            description: `Vi bruker kalkulator/formel for å regne ut resultatet direkte:`,
            math: `${base}^{${exponent}} \\approx ${result.toFixed(4)}`
        });
    }

    return {
        result,
        steps
    };
}

/**
 * Regner ut kvadratrot og prøver å forenkle om nødvendig.
 * @param {number} number - Tallet vi skal finne roten av
 * @returns {Object} Resultat og steps
 */
export function analyzeSquareRoot(number) {
    const steps = [];

    if (number < 0) {
         steps.push({
             description: `Vi kan ikke ta kvadratroten av et negativt tall i de reelle tallene.`,
             math: `\\sqrt{${number}} \\notin \\mathbb{R}`
         });
         return {
             result: NaN,
             steps
         };
    }

    steps.push({
        description: `Vi skal finne kvadratroten av ${number}:`,
        math: `\\sqrt{${number}}`
    });

    const result = Math.sqrt(number);

    if (Number.isInteger(result)) {
        steps.push({
            description: `Siden ${result} ganget med seg selv er ${number}, er ${number} et perfekt kvadrat:`,
            math: `${result} \\cdot ${result} = ${number} \\implies \\sqrt{${number}} = ${result}`
        });
    } else {
        // Forsøk på å forenkle kvadratroten: sqrt(number) = a * sqrt(b)
        let maxSquareFactor = 1;
        for (let i = Math.floor(Math.sqrt(number)); i > 1; i--) {
            if (number % (i * i) === 0) {
                maxSquareFactor = i * i;
                break;
            }
        }

        if (maxSquareFactor > 1 && Number.isInteger(number)) {
            const remainder = number / maxSquareFactor;
            const a = Math.sqrt(maxSquareFactor);
            steps.push({
                description: `Tallet ${number} er ikke et perfekt kvadrat, men vi kan trekke ut en faktor som er et perfekt kvadrat. Den største kvadratiske faktoren er ${maxSquareFactor} ($${a}^2$):`,
                math: `\\sqrt{${number}} = \\sqrt{${maxSquareFactor} \\cdot ${remainder}}`
            });
            steps.push({
                description: `Vi kan nå skille faktorene og ta kvadratroten av ${maxSquareFactor}:`,
                math: `\\sqrt{${maxSquareFactor}} \\cdot \\sqrt{${remainder}} = ${a}\\sqrt{${remainder}}`
            });
            steps.push({
                description: `Dette gir oss en eksakt forenklet verdi, som er omtrent lik:`,
                math: `${a}\\sqrt{${remainder}} \\approx ${result.toFixed(3)}`
            });
        } else {
            steps.push({
                description: `Tallet kan ikke forenkles eksakt, så vi regner ut en tilnærmet verdi:`,
                math: `\\sqrt{${number}} \\approx ${result.toFixed(3)}`
            });
        }
    }

    return {
        result,
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

/**
 * Hjelpefunksjon: Finner største felles divisor (GCD)
 */
function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

/**
 * Hjelpefunksjon: Finner minste felles multiplum (LCM)
 */
function lcm(a, b) {
    return (a * b) / gcd(a, b);
}

/**
 * Utfører brøkregning og viser trinnvis utregning
 * @param {number} n1 - Teller 1
 * @param {number} d1 - Nevner 1
 * @param {number} n2 - Teller 2
 * @param {number} d2 - Nevner 2
 * @param {string} op - Operasjon ('add', 'sub', 'mul', 'div')
 * @returns {Object} Resultat og steps
 */
export function analyzeFractions(n1, d1, n2, d2, op) {
    const steps = [];
    let resultN, resultD;

    // Tegn for operasjonen
    const opChar = op === 'add' ? '+' : op === 'sub' ? '-' : op === 'mul' ? '\\cdot' : ':';

    steps.push({
        description: `Vi skal regne ut:`,
        math: `\\frac{${n1}}{${d1}} ${opChar} \\frac{${n2}}{${d2}}`
    });

    if (op === 'add' || op === 'sub') {
        if (d1 === d2) {
            steps.push({
                description: `Nevnerne er allerede like (${d1}). Vi kan derfor ${op === 'add' ? 'legge sammen' : 'trekke fra'} tellerne direkte:`,
                math: `\\frac{${n1} ${opChar} ${n2}}{${d1}}`
            });
            resultN = op === 'add' ? n1 + n2 : n1 - n2;
            resultD = d1;
            steps.push({
                description: `Resultatet blir:`,
                math: `\\frac{${resultN}}{${resultD}}`
            });
        } else {
            const fellesNevner = lcm(d1, d2);
            steps.push({
                description: `Brøkene har ikke felles nevner. Vi finner minste felles multiplum (LCM) for nevnerne ${d1} og ${d2}, som er ${fellesNevner}.`,
                math: `\\text{Fellesnevner} = ${fellesNevner}`
            });

            const mult1 = fellesNevner / d1;
            const mult2 = fellesNevner / d2;

            steps.push({
                description: `Vi utvider brøkene slik at begge får ${fellesNevner} som nevner. Vi ganger første brøk oppe og nede med ${mult1}, og andre med ${mult2}:`,
                math: `\\frac{${n1} \\cdot ${mult1}}{${d1} \\cdot ${mult1}} ${opChar} \\frac{${n2} \\cdot ${mult2}}{${d2} \\cdot ${mult2}}`
            });

            const newN1 = n1 * mult1;
            const newN2 = n2 * mult2;

            steps.push({
                description: `Nå har brøkene felles nevner:`,
                math: `\\frac{${newN1}}{${fellesNevner}} ${opChar} \\frac{${newN2}}{${fellesNevner}}`
            });

            resultN = op === 'add' ? newN1 + newN2 : newN1 - newN2;
            resultD = fellesNevner;

            steps.push({
                description: `Vi kan nå utføre operasjonen på tellerne:`,
                math: `\\frac{${newN1} ${opChar} ${newN2}}{${fellesNevner}} = \\frac{${resultN}}{${resultD}}`
            });
        }
    } else if (op === 'mul') {
        steps.push({
            description: `Når vi ganger to brøker, ganger vi teller med teller og nevner med nevner:`,
            math: `\\frac{${n1} \\cdot ${n2}}{${d1} \\cdot ${d2}}`
        });

        resultN = n1 * n2;
        resultD = d1 * d2;

        steps.push({
            description: `Vi regner ut:`,
            math: `\\frac{${resultN}}{${resultD}}`
        });
    } else if (op === 'div') {
        steps.push({
            description: `Når vi deler på en brøk, er det samme som å gange med den omvendte brøken. Vi snur den andre brøken opp-ned og bytter operasjon til multiplikasjon:`,
            math: `\\frac{${n1}}{${d1}} \\cdot \\frac{${d2}}{${n2}}`
        });

        steps.push({
            description: `Vi ganger så teller med teller og nevner med nevner:`,
            math: `\\frac{${n1} \\cdot ${d2}}{${d1} \\cdot ${n2}}`
        });

        resultN = n1 * d2;
        resultD = d1 * n2;

        steps.push({
            description: `Vi regner ut:`,
            math: `\\frac{${resultN}}{${resultD}}`
        });
    }

    // Forkorting
    if (resultN === 0) {
        steps.push({
            description: `Siden telleren er 0, er brøken lik 0.`,
            math: `0`
        });
        return { resultN: 0, resultD: 1, isSimplified: false, steps };
    }

    const divisor = gcd(Math.abs(resultN), Math.abs(resultD));
    let finalN = resultN / divisor;
    let finalD = resultD / divisor;

    // Hvis nevner er negativ, flytt fortegnet opp
    if (finalD < 0) {
        finalN = -finalN;
        finalD = -finalD;
    }

    if (divisor > 1) {
        steps.push({
            description: `Brøken kan forkortes. Største felles divisor for ${Math.abs(resultN)} og ${Math.abs(resultD)} er ${divisor}. Vi deler teller og nevner på ${divisor}:`,
            math: `\\frac{${resultN} : ${divisor}}{${resultD} : ${divisor}} = \\frac{${finalN}}{${finalD}}`
        });
    } else {
        steps.push({
            description: `Brøken kan ikke forkortes mer.`,
            math: ``
        });
    }

    if (finalD === 1) {
        steps.push({
            description: `Siden nevneren er 1, kan vi skrive resultatet som et heltall:`,
            math: `${finalN}`
        });
    }

    return {
        resultN: finalN,
        resultD: finalD,
        isSimplified: divisor > 1,
        steps
    };
}
