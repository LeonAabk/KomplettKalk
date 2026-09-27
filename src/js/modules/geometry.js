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
        steps.push({
            description: `Vi kjenner begge katetene (a = ${a}, b = ${b}) og skal finne hypotenusen (c). Vi setter tallene inn i formelen:`,
            math: `${a}^2 + ${b}^2 = c^2`
        });
        const a2 = a ** 2;
        const b2 = b ** 2;
        steps.push({
            description: `Regner ut potensene:`,
            math: `${a2} + ${b2} = c^2`
        });
        const sum = a2 + b2;
        steps.push({
            description: `Legger sammen:`,
            math: `${sum} = c^2`
        });
        result = Math.sqrt(sum);
        steps.push({
            description: `Tar kvadratroten for å finne c:`,
            math: `c = \\sqrt{${sum}} = ${Number.isInteger(result) ? result : result.toFixed(2)}`
        });
    } else if (a !== null && c !== null) {
        missing = 'b';
        steps.push({
            description: `Vi kjenner én katet (a = ${a}) og hypotenusen (c = ${c}), og skal finne den andre kateten (b). Vi setter inn:`,
            math: `${a}^2 + b^2 = ${c}^2`
        });
        const a2 = a ** 2;
        const c2 = c ** 2;
        steps.push({
            description: `Regner ut potensene:`,
            math: `${a2} + b^2 = ${c2}`
        });
        const diff = c2 - a2;
        steps.push({
            description: `Isolerer b² ved å trekke fra ${a2} på begge sider:`,
            math: `b^2 = ${c2} - ${a2} = ${diff}`
        });
        result = Math.sqrt(diff);
        steps.push({
            description: `Tar kvadratroten for å finne b:`,
            math: `b = \\sqrt{${diff}} = ${Number.isInteger(result) ? result : result.toFixed(2)}`
        });
    } else if (b !== null && c !== null) {
        missing = 'a';
        steps.push({
            description: `Vi kjenner én katet (b = ${b}) og hypotenusen (c = ${c}), og skal finne den andre kateten (a). Vi setter inn:`,
            math: `a^2 + ${b}^2 = ${c}^2`
        });
        const b2 = b ** 2;
        const c2 = c ** 2;
        steps.push({
            description: `Regner ut potensene:`,
            math: `a^2 + ${b2} = ${c2}`
        });
        const diff = c2 - b2;
        steps.push({
            description: `Isolerer a² ved å trekke fra ${b2} på begge sider:`,
            math: `a^2 = ${c2} - ${b2} = ${diff}`
        });
        result = Math.sqrt(diff);
        steps.push({
            description: `Tar kvadratroten for å finne a:`,
            math: `a = \\sqrt{${diff}} = ${Number.isInteger(result) ? result : result.toFixed(2)}`
        });
    }

    return {
        missing,
        result,
        steps
    };
}
