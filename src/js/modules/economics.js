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

/**
 * Valutakalkulator: Ganger et beløp med gitt kurs.
 */
export function analyzeCurrency(amount, rate, fromCurr, toCurr) {
    const steps = [];

    steps.push({
        description: `Vi skal omgjøre ${amount} ${fromCurr.toUpperCase()} til ${toCurr.toUpperCase()}.`,
        math: `\\text{Kurs: } ${rate}`
    });

    const result = amount * rate;

    steps.push({
        description: 'For å finne beløpet i ny valuta ganger vi opprinnelig beløp med kursen:',
        math: `${amount} \\text{ ${fromCurr.toUpperCase()}} \\cdot ${rate} = ${result.toFixed(2)} \\text{ ${toCurr.toUpperCase()}}`
    });

    return { result, steps };
}

/**
 * Lønn og Skatt: Beregner nettolønn fra brutto, fradrag og skatteprosent.
 */
export function analyzeSalaryTax(gross, taxRate, deduction) {
    const steps = [];

    steps.push({
        description: 'Vi starter med bruttolønn (lønn før skatt):',
        math: `\\text{Bruttolønn} = ${gross} \\text{ kr}`
    });

    let taxableAmount = gross;

    if (deduction > 0) {
        taxableAmount = gross - deduction;
        steps.push({
            description: 'Vi trekker fra fradraget for å finne det skattbare beløpet (grunnlaget):',
            math: `${gross} - ${deduction} = ${taxableAmount} \\text{ kr}`
        });
    }

    const taxAmount = taxableAmount * (taxRate / 100);
    steps.push({
        description: `Vi regner ut skatten, som er ${taxRate}% av det skattbare beløpet:`,
        math: `\\text{Skatt} = ${taxableAmount} \\cdot \\frac{${taxRate}}{100} = ${taxAmount.toFixed(2)} \\text{ kr}`
    });

    const netSalary = gross - taxAmount;
    steps.push({
        description: 'Nettolønn (det du får utbetalt) er bruttolønn minus skatten:',
        math: `\\text{Nettolønn} = ${gross} - ${taxAmount.toFixed(2)} = ${netSalary.toFixed(2)} \\text{ kr}`
    });

    return { result: netSalary, taxAmount, taxableAmount, steps };
}

/**
 * Avskrivning (Saldoskjema) for første år.
 * @param {number} value - Anskaffelsesverdi
 * @param {number} rate - Avskrivningssats (%)
 * @returns {Object} Resultat (verditap) og steps
 */
export function analyzeDepreciation(value, rate) {
    const steps = [];

    steps.push({
        description: `Vi skal regne ut verditapet for det første året med saldoskjema. Formelen er:`,
        math: `\\text{Verditap} = \\text{Anskaffelsesverdi} \\cdot \\frac{\\text{Avskrivningssats}}{100}`
    });

    const loss = value * (rate / 100);

    steps.push({
        description: `Vi setter inn verdiene:`,
        math: `\\text{Verditap} = ${value} \\cdot \\frac{${rate}}{100} = ${loss.toFixed(2)}`
    });

    const newValue = value - loss;

    steps.push({
        description: `Bokført verdi etter år 1 er da:`,
        math: `${value} - ${loss.toFixed(2)} = ${newValue.toFixed(2)}`
    });

    return {
        result: loss,
        newValue,
        steps
    };
}

/**
 * Annuitetslån (Terminbeløp).
 * T = K * r / (1 - (1+r)^-n)
 * @param {number} loan - Lånebeløp (K)
 * @param {number} ratePercent - Rente per termin (%)
 * @param {number} terms - Antall terminer (n)
 * @returns {Object} Resultat (terminbeløp) og steps
 */
export function analyzeAnnuityLoan(loan, ratePercent, terms) {
    const steps = [];

    const r = ratePercent / 100;

    steps.push({
        description: `Formelen for å finne terminbeløpet ($T$) for et annuitetslån er:`,
        math: `T = K \\cdot \\frac{r}{1 - (1+r)^{-n}}`
    });

    steps.push({
        description: `Hvor:\n$K = ${loan}$ (Lånebeløp)\n$r = ${ratePercent}\\% = ${r}$ (rente per termin)\n$n = ${terms}$ (antall terminer)`,
        math: ''
    });

    // Hvis renten er 0
    if (r === 0) {
        const result = loan / terms;
        steps.push({
            description: `Siden renten er 0%, deler vi bare lånebeløpet på antall terminer:`,
            math: `T = \\frac{${loan}}{${terms}} = ${result.toFixed(2)}`
        });
        return { result, steps };
    }

    const denominator = 1 - Math.pow(1 + r, -terms);
    const result = loan * (r / denominator);

    steps.push({
        description: `Vi setter inn tallene i formelen:`,
        math: `T = ${loan} \\cdot \\frac{${r}}{1 - (1 + ${r})^{-${terms}}}`
    });

    steps.push({
        description: `Vi regner ut nevneren:`,
        math: `1 - (1.0${ratePercent})^{-${terms}} \\approx ${denominator.toFixed(4)}`
    });

    steps.push({
        description: `Til slutt regner vi ut terminbeløpet:`,
        math: `T = ${loan} \\cdot \\frac{${r}}{${denominator.toFixed(4)}} \\approx ${result.toFixed(2)}`
    });

    return {
        result,
        steps
    };
}
