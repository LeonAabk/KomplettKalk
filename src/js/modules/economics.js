/**
 * Modul for Økonomi
 */

/**
 * Beregner rentesrente (Compound Interest)
 * S = B * (1 + r/100)^t
 * @param {number} principal - Startbeløp (B)
 * @param {number} rate - Rente i prosent (r)
 * @param {number} years - Antall år (t)
 * @returns {Object} Resultat og steps
 */
export function analyzeCompoundInterest(principal, rate, years) {
    const steps = [];

    steps.push({
        description: 'Formelen for rentesrente er:',
        math: 'S = B \\cdot \\left(1 + \\frac{r}{100}\\right)^t'
    });

    steps.push({
        description: `Hvor:\n$B = ${principal}$ (startbeløp)\n$r = ${rate}\\%$ (rente)\n$t = ${years}$ (antall år)`,
        math: ''
    });

    const vekstfaktor = 1 + (rate / 100);

    steps.push({
        description: 'Først regner vi ut vekstfaktoren:',
        math: `1 + \\frac{${rate}}{100} = 1 + ${rate/100} = ${vekstfaktor}`
    });

    const power = Math.pow(vekstfaktor, years);

    steps.push({
        description: `Deretter opphøyer vi vekstfaktoren i antall år ($t = ${years}$):`,
        math: `${vekstfaktor}^{${years}} \\approx ${power.toFixed(4)}`
    });

    const result = principal * power;

    steps.push({
        description: 'Til slutt ganger vi med startbeløpet for å finne sluttbeløpet (S):',
        math: `S = ${principal} \\cdot ${power.toFixed(4)} \\approx ${result.toFixed(2)}`
    });

    return {
        result,
        steps
    };
}

/**
 * Beregner varekalkyle
 * @param {number} inntakskost - Inntakskost
 * @param {number} frakt - Frakt og toll
 * @param {number} avanseProsent - Avansetillegg i prosent
 * @returns {Object} Resultat og steps
 */
export function analyzeMarkup(inntakskost, frakt, avanseProsent) {
    const steps = [];

    steps.push({
        description: `Varekalkylen bygges opp trinnvis. Først beregner vi selvkost.`,
        math: `\\text{Selvkost} = \\text{Inntakskost} + \\text{Frakt/Toll}`
    });

    const selvkost = inntakskost + frakt;

    steps.push({
        description: `Vi setter inn verdiene for inntakskost (${inntakskost} kr) og frakt (${frakt} kr):`,
        math: `\\text{Selvkost} = ${inntakskost} + ${frakt} = ${selvkost} \\text{ kr}`
    });

    steps.push({
        description: `Deretter beregner vi avansen, som er ${avanseProsent}% av selvkost:`,
        math: `\\text{Avanse} = ${selvkost} \\cdot \\frac{${avanseProsent}}{100}`
    });

    const avanseKroner = selvkost * (avanseProsent / 100);

    steps.push({
        description: `Avansen i kroner blir:`,
        math: `\\text{Avanse} = ${avanseKroner.toFixed(2)} \\text{ kr}`
    });

    const utsalgspris = selvkost + avanseKroner;

    steps.push({
        description: `Til slutt finner vi salgsprisen eksklusiv merverdiavgift ved å legge avansen til selvkost:`,
        math: `\\text{Utsalgspris} = ${selvkost} + ${avanseKroner.toFixed(2)} = ${utsalgspris.toFixed(2)} \\text{ kr}`
    });

    return {
        selvkost,
        avanseKroner,
        utsalgspris,
        steps
    };
}

/**
 * Beregner MVA (Merverdiavgift)
 * @param {number} price - Pris
 * @param {boolean} isAdd - Legg til (true) eller trekk fra (false)
 * @param {number} vatRate - MVA-sats (standard 25)
 * @returns {Object} Resultat og steps
 */
export function analyzeVAT(price, isAdd, vatRate = 25) {
    const steps = [];
    let result = 0;
    let vatAmount = 0;

    if (isAdd) {
        steps.push({
            description: `Vi skal legge til ${vatRate}% MVA på prisen ${price} kr.`,
            math: ''
        });

        vatAmount = price * (vatRate / 100);

        steps.push({
            description: 'Først regner vi ut hvor mye MVA utgjør i kroner:',
            math: `\\text{MVA} = ${price} \\cdot \\frac{${vatRate}}{100} = ${vatAmount.toFixed(2)} \\text{ kr}`
        });

        result = price + vatAmount;

        steps.push({
            description: 'Så legger vi dette til den opprinnelige prisen:',
            math: `\\text{Ny pris} = ${price} + ${vatAmount.toFixed(2)} = ${result.toFixed(2)} \\text{ kr}`
        });

        // Alternativ metode
        const vekstfaktor = 1 + (vatRate / 100);
        steps.push({
            description: 'Alternativt kan man gange direkte med vekstfaktoren:',
            math: `${price} \\cdot ${vekstfaktor} = ${result.toFixed(2)} \\text{ kr}`
        });
    } else {
        steps.push({
            description: `Vi skal trekke fra ${vatRate}% MVA fra prisen ${price} kr. Husk at den gitte prisen tilsvarer ${100 + vatRate}%.`,
            math: ''
        });

        const vekstfaktor = 1 + (vatRate / 100);

        result = price / vekstfaktor;

        steps.push({
            description: `For å finne prisen uten MVA, deler vi på vekstfaktoren (${vekstfaktor}):`,
            math: `\\text{Pris uten MVA} = \\frac{${price}}{${vekstfaktor}} \\approx ${result.toFixed(2)} \\text{ kr}`
        });

        vatAmount = price - result;

        steps.push({
            description: 'MVA-beløpet i kroner blir dermed differansen:',
            math: `\\text{MVA} = ${price} - ${result.toFixed(2)} = ${vatAmount.toFixed(2)} \\text{ kr}`
        });
    }

    return {
        result,
        vatAmount,
        steps
    };
}
