/**
 * Modul for Fysikk
 */

/**
 * Beregner fart, strekning eller tid.
 * Gitt to av tre, regnes den tredje ut.
 * s = v * t, v = s / t, t = s / v
 * @param {number|null} s - Strekning
 * @param {number|null} v - Fart
 * @param {number|null} t - Tid
 * @returns {Object} Resultat med beregnet verdi og steps
 */
export function analyzeSpeed(s, v, t) {
    const steps = [];
    let result = null;
    let missing = '';

    steps.push({
        description: `Formelen for sammenhengen mellom strekning ($s$), fart ($v$) og tid ($t$) er:`,
        math: `s = v \\cdot t`
    });

    if (s === null) {
        missing = 's';
        result = v * t;
        steps.push({
            description: `Vi skal finne strekningen ($s$). Vi setter inn $v = ${v}$ og $t = ${t}$:`,
            math: `s = ${v} \\cdot ${t} = ${result}`
        });
    } else if (v === null) {
        missing = 'v';
        result = s / t;
        steps.push({
            description: `Vi skal finne farten ($v$). Vi snur formelen og setter inn $s = ${s}$ og $t = ${t}$:`,
            math: `v = \\frac{s}{t} = \\frac{${s}}{${t}} = ${result.toFixed(2)}`
        });
    } else if (t === null) {
        missing = 't';
        result = s / v;
        steps.push({
            description: `Vi skal finne tiden ($t$). Vi snur formelen og setter inn $s = ${s}$ og $v = ${v}$:`,
            math: `t = \\frac{s}{v} = \\frac{${s}}{${v}} = ${result.toFixed(2)}`
        });
    }

    return {
        result,
        missing,
        steps
    };
}

/**
 * Beregner massetetthet, rho = m / V.
 * @param {number} m - Masse
 * @param {number} V - Volum
 * @returns {Object} Resultat med beregnet tetthet og steps
 */
export function analyzeDensity(m, V) {
    const steps = [];
    let result = m / V;

    steps.push({
        description: `Formelen for massetetthet ($\\rho$) er masse ($m$) delt på volum ($V$):`,
        math: `\\rho = \\frac{m}{V}`
    });

    steps.push({
        description: `Vi setter inn de oppgitte verdiene ($m = ${m}$ og $V = ${V}$):`,
        math: `\\rho = \\frac{${m}}{${V}} = ${result.toFixed(2)}`
    });

    return {
        result,
        steps
    };
}

/**
 * Mekanisk energi (Kinetisk + Potensiell energi)
 */
export function analyzeMechEnergy(m, v, h) {
    const steps = [];

    // G = 9.81 for tyngdeakselerasjon på jorden
    const g = 9.81;

    steps.push({
        description: 'Vi kjenner følgende variabler:',
        math: `m = ${m}\\text{ kg}, \\quad v = ${v}\\text{ m/s}, \\quad h = ${h}\\text{ m}`
    });

    // Kinetisk energi = 1/2 * m * v^2
    const e_k = 0.5 * m * (v * v);
    steps.push({
        description: 'Kinetisk energi ($E_k$) regnes ut med formelen $E_k = \\frac{1}{2}mv^2$:',
        math: `E_k = \\frac{1}{2} \\cdot ${m} \\cdot ${v}^2 = ${e_k.toFixed(2)} \\text{ J}`
    });

    // Potensiell energi = m * g * h
    const e_p = m * g * h;
    steps.push({
        description: `Potensiell energi ($E_p$) regnes ut med formelen $E_p = mgh$ (hvor $g \\approx 9.81\\text{ m/s}^2$):`,
        math: `E_p = ${m} \\cdot 9.81 \\cdot ${h} = ${e_p.toFixed(2)} \\text{ J}`
    });

    const totalEnergy = e_k + e_p;
    steps.push({
        description: 'Den totale mekaniske energien ($E$) er summen av kinetisk og potensiell energi:',
        math: `E = E_k + E_p = ${e_k.toFixed(2)} + ${e_p.toFixed(2)} = ${totalEnergy.toFixed(2)} \\text{ J}`
    });

    return {
        result: totalEnergy,
        e_k,
        e_p,
        steps
    };
}
