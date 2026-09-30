/**
 * Modul for Konvertering
 */

const unitData = {
    length: {
        units: ['mm', 'cm', 'dm', 'm', 'km'],
        factors: {
            'mm': 0.001,
            'cm': 0.01,
            'dm': 0.1,
            'm': 1,
            'km': 1000
        },
        stepFactor: 10,
        exponent: 1
    },
    area: {
        units: ['mm²', 'cm²', 'dm²', 'm²', 'km²'],
        factors: {
            'mm²': 0.000001,
            'cm²': 0.0001,
            'dm²': 0.01,
            'm²': 1,
            'km²': 1000000
        },
        stepFactor: 100,
        exponent: 2
    },
    volume: {
        units: ['mm³', 'cm³', 'dm³', 'm³', 'km³'],
        factors: {
            'mm³': 0.000000001,
            'cm³': 0.000001,
            'dm³': 0.001,
            'm³': 1,
            'km³': 1000000000
        },
        stepFactor: 1000,
        exponent: 3
    }
};

/**
 * Konverterer mellom ulike enheter og viser trinnvis utregning
 * @param {string} dimension - 'length', 'area', eller 'volume'
 * @param {number} value - Verdien som skal konverteres
 * @param {string} fromUnit - Fra enhet
 * @param {string} toUnit - Til enhet
 * @returns {Object} Resultat og steps
 */

export function analyzeUnitConversion(dimension, value, fromUnit, toUnit) {
    const steps = [];

    // Normalize units from UI (UI only sends base units like 'm', 'cm')
    if (dimension === 'area') {
        if (!fromUnit.includes('²')) fromUnit += '²';
        if (!toUnit.includes('²')) toUnit += '²';
    } else if (dimension === 'volume') {
        if (!fromUnit.includes('³')) fromUnit += '³';
        if (!toUnit.includes('³')) toUnit += '³';
    }

    const data = unitData[dimension];
    const fromIndex = data.units.indexOf(fromUnit);
    const toIndex = data.units.indexOf(toUnit);

    if (fromIndex === -1 || toIndex === -1) {
        return { result: null, steps: [{ description: 'Ugyldig enhet.', math: '' }] };
    }

    if (fromIndex === toIndex) {
        steps.push({
            description: `Du har valgt samme enhet, så verdien er uendret.`,
            math: `${value} \text{ ${fromUnit}} = ${value} \text{ ${toUnit}}`
        });
        return { result: value, steps };
    }

    const isGoingLarger = fromIndex < toIndex;
    const stepsBetween = Math.abs(fromIndex - toIndex);
    const dimName = dimension === 'length' ? 'lengde' : (dimension === 'area' ? 'areal' : 'volum');

    let kmIndex = data.units.indexOf(dimension === 'length' ? 'km' : (dimension === 'area' ? 'km²' : 'km³'));
    let mIndex = data.units.indexOf(dimension === 'length' ? 'm' : (dimension === 'area' ? 'm²' : 'm³'));

    let hasKmJump = (fromIndex <= mIndex && toIndex === kmIndex) || (fromIndex === kmIndex && toIndex <= mIndex);

    if (hasKmJump) {
         steps.push({
            description: `Merk: Hoppet mellom meter og kilometer er 1000, ikke 10 (slik som mellom mm, cm, dm og m). I ${dimName} betyr dette en faktor på $1000^{${data.exponent}} = ${Math.pow(1000, data.exponent)}$.`,
            math: ''
         });
    }

    steps.push({
        description: `Vi skal konvertere ${value} ${fromUnit} til ${toUnit}. For hver plass vi flytter oss i ${dimName}ssystemet, må vi gange eller dele med ${data.stepFactor} (som er $10^{${data.exponent}}$).`,
        math: ''
    });

    // Regn ut omregningsfaktoren via basisenheten (meter)
    const factorFrom = data.factors[fromUnit];
    const factorTo = data.factors[toUnit];
    const totalRatio = factorFrom / factorTo;

    let result = value * totalRatio;

    // Bygg opp den repeterte faktoren
    let repeatedFactorStr = [];

    // Simpler way: build from units array
    let currentIdx = fromIndex;
    while(currentIdx !== toIndex) {
        let nextIdx = isGoingLarger ? currentIdx + 1 : currentIdx - 1;
        let ratio = isGoingLarger
            ? data.factors[data.units[currentIdx]] / data.factors[data.units[nextIdx]]
            : data.factors[data.units[currentIdx]] / data.factors[data.units[nextIdx]];

        // The ratio is always > 1 for multiplier representation
        let stepFactor = Math.round(isGoingLarger ? 1/ratio : ratio);
        repeatedFactorStr.push(stepFactor);
        currentIdx = nextIdx;
    }

    let calculationString = repeatedFactorStr.join(' \cdot ');

    if (isGoingLarger) {
        steps.push({
            description: `Vi går til en større enhet (${stepsBetween} trinn), derfor må vi **dele** (flytte komma til venstre).`,
            math: ''
        });

        steps.push({
            description: `Vi deler trinnvis:`,
            math: `${value} \text{ ${fromUnit}} = \frac{${value}}{${calculationString}} \text{ ${toUnit}}`
        });

    } else {
        steps.push({
            description: `Vi går til en mindre enhet (${stepsBetween} trinn), derfor må vi **gange** (legge til nuller / flytte komma til høyre).`,
            math: ''
        });

        steps.push({
            description: `Vi ganger trinnvis:`,
            math: `${value} \text{ ${fromUnit}} = ${value} \cdot ${calculationString} \text{ ${toUnit}}`
        });
    }

    let displayResult = result;
    if (result < 0.000001 || result > 1000000000) {
        displayResult = result.toExponential(4);
    } else {
        displayResult = parseFloat(result.toFixed(6));
    }

    steps.push({
        description: `Resultatet blir:`,
        math: `${value} \text{ ${fromUnit}} = ${displayResult} \text{ ${toUnit}}`
    });

    return {
        result,
        displayResult,
        steps
    };
}
