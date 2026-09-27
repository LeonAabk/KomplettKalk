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
