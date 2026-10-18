/**
 * Katalog del 2: økonomi, fysikk, sannsynlighet, statistikk og grunnleggende.
 * Samme format som catalog.js.
 */
const r = (n, d = 4) => { const v = Number(n.toFixed(d)); return Object.is(v, -0) ? 0 : v; };
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const posAll = (v, names, msg = 'Alle verdier må være større enn 0.') =>
    names.some(n => !(v[n] > 0)) ? msg : null;
const kr = (n) => n.toFixed(2);

export const catalog2 = [
    // ------------------------------------------------------------ Økonomi
    {
        id: 'module-discount', title: 'Rabatt', category: 'okonomi',
        description: 'Ny pris og hvor mye du sparer med en prosentvis rabatt.',
        icon: '🏷️', formula: 'P_{ny}=P\\cdot\\left(1-\\frac{p}{100}\\right)',
        intro: 'Oppgi opprinnelig pris og rabatt i prosent.', button: 'Beregn rabatt',
        fields: [{ name: 'price', label: 'Pris (kr)', min: 0 }, { name: 'pct', label: 'Rabatt (%)', min: 0 }],
        check: (v) => (v.price < 0 ? 'Prisen kan ikke være negativ.' : (v.pct < 0 || v.pct > 100 ? 'Rabatten må være mellom 0 og 100 %.' : null)),
        run: ({ price, pct }) => {
            const saved = price * pct / 100, now = price - saved, f = 1 - pct / 100;
            return {
                html: `<strong>Ny pris:</strong> ${kr(now)} kr<br><strong>Du sparer:</strong> ${kr(saved)} kr`,
                steps: [
                    { description: 'Rabatten i kroner er prosenten av prisen.', math: `\\text{rabatt} = ${r(price)}\\cdot\\frac{${r(pct)}}{100} = ${r(saved, 2)}\\text{ kr}` },
                    { description: 'Ny pris er opprinnelig pris minus rabatten.', math: `${r(price)} - ${r(saved, 2)} = ${r(now, 2)}\\text{ kr}`,
                      note: `Snarvei: ${r(pct)} % rabatt betyr at du betaler ${r(100 - pct)} % av prisen. Gang med vekstfaktoren ${r(f, 4)}.` },
                    { description: `Ny pris er $${r(now, 2)}$ kr, og du sparer $${r(saved, 2)}$ kr.` },
                ],
            };
        },
    },
    {
        id: 'module-simple-interest', title: 'Enkel rente', category: 'okonomi',
        description: 'Renter og sluttbeløp uten rentes rente.',
        icon: '🏦', formula: 'R=K\\cdot\\frac{p}{100}\\cdot t',
        intro: 'Oppgi startbeløp, rente per år og antall år.', button: 'Beregn renter',
        fields: [{ name: 'k', label: 'Startbeløp (kr)', min: 0 }, { name: 'p', label: 'Rente (% per år)' }, { name: 't', label: 'Antall år', min: 0 }],
        check: (v) => (v.k < 0 || v.t < 0 ? 'Startbeløp og antall år kan ikke være negative.' : null),
        run: ({ k, p, t }) => {
            const R = k * p / 100 * t;
            return {
                html: `<strong>Renter:</strong> ${kr(R)} kr<br><strong>Sluttbeløp:</strong> ${kr(k + R)} kr`,
                steps: [
                    { description: 'Med enkel rente får du like mye rente hvert år, regnet av startbeløpet.', math: `R = K\\cdot\\frac{p}{100}\\cdot t = ${r(k)}\\cdot\\frac{${r(p)}}{100}\\cdot ${r(t)} = ${r(R, 2)}\\text{ kr}`,
                      note: 'Med rentes rente (sparekalkulatoren) vokser beløpet raskere, fordi du også får rente på rentene.' },
                    { description: 'Sluttbeløpet er startbeløp pluss renter.', math: `${r(k)} + ${r(R, 2)} = ${r(k + R, 2)}\\text{ kr}` },
                    { description: `Renter $${r(R, 2)}$ kr og sluttbeløp $${r(k + R, 2)}$ kr.` },
                ],
            };
        },
    },
    {
        id: 'module-doubling-time', title: 'Tid til dobling', category: 'okonomi',
        description: 'Hvor mange år tar det før et beløp dobler seg?',
        icon: '✌️', formula: 't=\\frac{\\ln 2}{\\ln(1+r)}',
        intro: 'Oppgi renten per år. Vi regner med rentes rente.', button: 'Beregn tid',
        fields: [{ name: 'p', label: 'Rente (% per år)', min: 0 }],
        check: (v) => (v.p <= 0 ? 'Renten må være større enn 0 for at beløpet skal doble seg.' : null),
        run: ({ p }) => {
            const t = Math.log(2) / Math.log(1 + p / 100), rule = 72 / p;
            return {
                html: `<strong>Dobling etter:</strong> ${r(t, 2)} år<br>Tommelfingerregel (72-regelen): ${r(rule, 2)} år`,
                steps: [
                    { description: 'Vi vil finne $t$ slik at $(1+r)^t = 2$. Tar logaritmen på begge sider.', math: `t = \\frac{\\ln 2}{\\ln(1+r)} = \\frac{\\ln 2}{\\ln(1+${r(p / 100, 5)})} \\approx ${r(t, 2)}\\text{ år}` },
                    { description: '72-regelen gir et raskt overslag.', math: `t \\approx \\frac{72}{p} = \\frac{72}{${r(p)}} \\approx ${r(rule, 2)}\\text{ år}`,
                      note: '72 deles av veldig mange tall, og regelen er best for renter mellom 5 og 10 %.' },
                    { description: `Beløpet dobler seg etter ca. $${r(t, 1)}$ år.` },
                ],
            };
        },
    },
    {
        id: 'module-break-even', title: 'Break-even', category: 'okonomi',
        description: 'Hvor mange enheter må du selge for å gå i null?',
        icon: '⚖️', formula: 'n=\\frac{F}{p-v}',
        intro: 'Oppgi faste kostnader, salgspris og variabel kostnad per enhet.', button: 'Beregn break-even',
        fields: [{ name: 'F', label: 'Faste kostnader (kr)', min: 0 }, { name: 'p', label: 'Salgspris per enhet (kr)', min: 0 }, { name: 'v', label: 'Variabel kostnad per enhet (kr)', min: 0 }],
        check: (v) => (v.F < 0 || v.v < 0 ? 'Kostnader kan ikke være negative.' : (v.p <= v.v ? 'Salgsprisen må være høyere enn den variable kostnaden, ellers går du aldri i null.' : null)),
        run: ({ F, p, v }) => {
            const dekning = p - v, n = F / dekning, units = Math.ceil(n - 1e-9);
            return {
                html: `<strong>Break-even:</strong> ${units} enheter<br><strong>Omsetning da:</strong> ${kr(units * p)} kr`,
                steps: [
                    { description: 'Hver solgte enhet gir et dekningsbidrag: salgspris minus variabel kostnad.', math: `p - v = ${r(p)} - ${r(v)} = ${r(dekning)}\\text{ kr}` },
                    { description: 'Vi trenger nok enheter til at dekningsbidragene dekker de faste kostnadene.', math: `n = \\frac{F}{p-v} = \\frac{${r(F)}}{${r(dekning)}} = ${r(n, 2)}`,
                      note: 'Vi runder alltid opp, siden du ikke kan selge en halv enhet.' },
                    { description: `Du må selge $${units}$ enheter for å gå i null.` },
                ],
            };
        },
    },
    {
        id: 'module-inflation', title: 'Inflasjon', category: 'okonomi',
        description: 'Prisen etter flere år med prisvekst, og hva pengene er verdt.',
        icon: '🎈', formula: 'P_n=P\\cdot(1+i)^n',
        intro: 'Oppgi dagens pris, årlig inflasjon og antall år.', button: 'Beregn inflasjon',
        fields: [{ name: 'P', label: 'Pris i dag (kr)', min: 0 }, { name: 'i', label: 'Inflasjon (% per år)' }, { name: 'n', label: 'Antall år', min: 0 }],
        check: (v) => (v.P < 0 || v.n < 0 ? 'Pris og antall år kan ikke være negative.' : (v.i <= -100 ? 'Inflasjonen må være over −100 %.' : null)),
        run: ({ P, i, n }) => {
            const f = (1 + i / 100) ** n, Pn = P * f, power = P / f;
            return {
                html: `<strong>Pris om ${r(n)} år:</strong> ${kr(Pn)} kr<br><strong>${kr(P)} kr er da verdt:</strong> ${kr(power)} kr i dagens penger`,
                steps: [
                    { description: 'Prisen vokser med vekstfaktoren hvert år.', math: `P_n = P\\cdot(1+i)^n = ${r(P)}\\cdot(1+${r(i / 100, 5)})^{${r(n)}} = ${r(Pn, 2)}\\text{ kr}` },
                    { description: 'Kjøpekraften til samme beløp faller tilsvarende.', math: `\\frac{${r(P)}}{(1+i)^n} = ${r(power, 2)}\\text{ kr}`,
                      note: 'Det du kan kjøpe for 100 kr i dag, koster mer og mer i årene som kommer.' },
                    { description: `Prisen blir $${r(Pn, 2)}$ kr. Beløpet ${kr(P)} kr er da verdt $${r(power, 2)}$ kr i dagens penger.` },
                ],
            };
        },
    },

    // ------------------------------------------------------------ Fysikk
    {
        id: 'module-hooke', title: 'Fjærkraft (Hookes lov)', category: 'fysikk',
        description: 'Kraft og lagret energi i en fjær.',
        icon: '🌀', formula: 'F=k\\cdot x',
        intro: 'Oppgi fjærstivhet og hvor mye fjæren er strukket eller trykket sammen.', button: 'Beregn kraft',
        fields: [{ name: 'k', label: 'Fjærkonstant k (N/m)', min: 0 }, { name: 'x', label: 'Utslag x (m)' }],
        check: (v) => posAll(v, ['k'], 'Fjærkonstanten må være større enn 0.'),
        run: ({ k, x }) => {
            const F = k * Math.abs(x), E = 0.5 * k * x * x;
            return {
                html: `<strong>Kraft:</strong> ${r(F)} N<br><strong>Energi:</strong> ${r(E)} J`,
                steps: [
                    { description: 'Kraften i fjæra er proporsjonal med utslaget.', math: `F = k\\cdot x = ${r(k)}\\cdot ${r(Math.abs(x))} = ${r(F)}\\text{ N}`, note: 'Dobbelt så langt utslag gir dobbelt så stor kraft.' },
                    { description: 'Energien som er lagret i fjæra.', math: `E = \\frac{1}{2}kx^2 = \\frac{1}{2}\\cdot ${r(k)}\\cdot ${r(x)}^2 = ${r(E)}\\text{ J}` },
                    { description: `Kraften er $${r(F)}$ N og energien er $${r(E)}$ J.` },
                ],
            };
        },
    },
    {
        id: 'module-pressure', title: 'Trykk', category: 'fysikk',
        description: 'Trykk fra kraft og areal.',
        icon: '🫧', formula: 'p=\\frac{F}{A}',
        intro: 'Oppgi kraften og arealet kraften virker på.', button: 'Beregn trykk',
        fields: [{ name: 'F', label: 'Kraft F (N)', min: 0 }, { name: 'A', label: 'Areal A (m²)', min: 0 }],
        check: (v) => (v.F < 0 ? 'Kraften kan ikke være negativ.' : posAll(v, ['A'], 'Arealet må være større enn 0.')),
        run: ({ F, A }) => {
            const p = F / A;
            return {
                html: `<strong>Trykk:</strong> ${r(p)} Pa (${r(p / 1000)} kPa)`,
                steps: [
                    { description: 'Trykk er kraft delt på areal. Enheten er pascal (1 Pa = 1 N/m²).', math: `p = \\frac{F}{A} = \\frac{${r(F)}}{${r(A)}} = ${r(p)}\\text{ Pa}`,
                      note: 'Derfor er en spiss nål så skarp: samme kraft på et lite areal gir stort trykk.' },
                    { description: `Trykket er $${r(p)}$ Pa, altså $${r(p / 1000)}$ kPa.` },
                ],
            };
        },
    },
    {
        id: 'module-wave', title: 'Bølger', category: 'fysikk',
        description: 'Bølgefart, frekvens og periode.',
        icon: '🌊', formula: 'v=f\\cdot\\lambda',
        intro: 'Oppgi frekvens og bølgelengde.', button: 'Beregn bølge',
        fields: [{ name: 'f', label: 'Frekvens f (Hz)', min: 0 }, { name: 'l', label: 'Bølgelengde λ (m)', min: 0 }],
        check: (v) => posAll(v, ['f', 'l']),
        run: ({ f, l }) => {
            const v = f * l, T = 1 / f;
            return {
                html: `<strong>Bølgefart:</strong> ${r(v)} m/s<br><strong>Periode:</strong> ${r(T, 6)} s`,
                steps: [
                    { description: 'Farten er frekvens ganger bølgelengde.', math: `v = f\\cdot\\lambda = ${r(f)}\\cdot ${r(l)} = ${r(v)}\\text{ m/s}`, note: 'Frekvensen er hvor mange bølgetopper som passerer per sekund.' },
                    { description: 'Perioden er tiden for én hel svingning.', math: `T = \\frac{1}{f} = \\frac{1}{${r(f)}} = ${r(T, 6)}\\text{ s}` },
                    { description: `Bølgefarten er $${r(v)}$ m/s og perioden er $${r(T, 6)}$ s.` },
                ],
            };
        },
    },
    {
        id: 'module-heat', title: 'Varmeenergi', category: 'fysikk',
        description: 'Energien som trengs for å varme opp eller kjøle ned et stoff.',
        icon: '🔥', formula: 'Q=m\\cdot c\\cdot\\Delta T',
        intro: 'Oppgi masse, spesifikk varmekapasitet (vann: 4186) og temperaturendring.', button: 'Beregn energi',
        fields: [{ name: 'm', label: 'Masse m (kg)', min: 0 }, { name: 'c', label: 'Varmekapasitet c (J/kg·K)', min: 0, value: '4186' }, { name: 'dT', label: 'Temperaturendring ΔT (K)' }],
        check: (v) => posAll(v, ['m', 'c'], 'Masse og varmekapasitet må være større enn 0.'),
        run: ({ m, c, dT }) => {
            const Q = m * c * dT;
            return {
                html: `<strong>Energi:</strong> ${r(Q)} J (${r(Q / 1000)} kJ)<br>= ${r(Q / 3.6e6, 4)} kWh`,
                steps: [
                    { description: 'Energien er masse ganger varmekapasitet ganger temperaturendring.', math: `Q = m\\cdot c\\cdot\\Delta T = ${r(m)}\\cdot ${r(c)}\\cdot ${r(dT)} = ${r(Q)}\\text{ J}`,
                      note: 'Vann har uvanlig høy varmekapasitet, så det trengs mye energi for å varme det opp.' },
                    { description: 'Gjør om til kWh (1 kWh = 3 600 000 J).', math: `\\frac{${r(Q)}}{3\\,600\\,000} = ${r(Q / 3.6e6, 4)}\\text{ kWh}` },
                    { description: `Energien er $${r(Q)}$ J${Q < 0 ? ' (negativ betyr at energi avgis)' : ''}.` },
                ],
            };
        },
    },
    {
        id: 'module-projectile', title: 'Kast (skrått kast)', category: 'fysikk',
        description: 'Rekkevidde, høyde og tid for et kast uten luftmotstand.',
        icon: '🏹', formula: 'R=\\frac{v_0^2\\sin 2\\theta}{g}',
        intro: 'Oppgi startfart og kastvinkel. Vi ser bort fra luftmotstand og bruker g = 9,81 m/s².', button: 'Beregn kast',
        fields: [{ name: 'v0', label: 'Startfart v₀ (m/s)', min: 0 }, { name: 'deg', label: 'Vinkel θ (grader, 0–90)', min: 0 }],
        check: (v) => (v.v0 <= 0 ? 'Startfarten må være større enn 0.' : (v.deg < 0 || v.deg > 90 ? 'Vinkelen må være mellom 0 og 90 grader.' : null)),
        run: ({ v0, deg }) => {
            const g = 9.81, th = deg * Math.PI / 180;
            const vx = v0 * Math.cos(th), vy = v0 * Math.sin(th);
            const T = 2 * vy / g, R = vx * T, H = vy * vy / (2 * g);
            return {
                html: `<strong>Rekkevidde:</strong> ${r(R, 2)} m<br><strong>Største høyde:</strong> ${r(H, 2)} m<br><strong>Flytid:</strong> ${r(T, 2)} s`,
                steps: [
                    { description: 'Vi deler farten i en vannrett og en loddrett del.', math: `v_x = v_0\\cos\\theta = ${r(vx, 3)}\\text{ m/s},\\quad v_y = v_0\\sin\\theta = ${r(vy, 3)}\\text{ m/s}`,
                      note: 'Vannrett fart er konstant. Loddrett fart påvirkes av tyngdekraften.' },
                    { description: 'Flytiden er tiden opp og ned igjen.', math: `T = \\frac{2v_y}{g} = \\frac{2\\cdot ${r(vy, 3)}}{9{,}81} = ${r(T, 3)}\\text{ s}` },
                    { description: 'Rekkevidden er vannrett fart ganger flytid.', math: `R = v_x\\cdot T = ${r(vx, 3)}\\cdot ${r(T, 3)} = ${r(R, 2)}\\text{ m}` },
                    { description: 'Største høyde nås når loddrett fart er 0.', math: `H = \\frac{v_y^2}{2g} = ${r(H, 2)}\\text{ m}`, note: 'Rekkevidden er størst ved 45 grader.' },
                    { description: `Rekkevidde $${r(R, 2)}$ m, høyde $${r(H, 2)}$ m og flytid $${r(T, 2)}$ s.` },
                ],
            };
        },
    },

    // ------------------------------------------------------------ Sannsynlighet
    {
        id: 'module-bayes', title: 'Betinget sannsynlighet (Bayes)', category: 'sannsynlighet',
        description: 'Hvor sannsynlig er A når du vet at B har skjedd?',
        icon: '🎲', formula: 'P(A|B)=\\frac{P(A)\\,P(B|A)}{P(B)}',
        intro: 'Oppgi sannsynlighetene i prosent. Eksempel: A = har sykdommen, B = tester positivt.', button: 'Beregn P(A|B)',
        fields: [{ name: 'pa', label: 'P(A) (%)', min: 0 }, { name: 'pba', label: 'P(B | A) (%)', min: 0 }, { name: 'pbn', label: 'P(B | ikke A) (%)', min: 0 }],
        check: (v) => {
            if ([v.pa, v.pba, v.pbn].some(x => x < 0 || x > 100)) return 'Alle sannsynligheter må være mellom 0 og 100 %.';
            const pb = v.pa / 100 * v.pba / 100 + (1 - v.pa / 100) * v.pbn / 100;
            return pb === 0 ? 'P(B) blir 0, så P(A | B) er ikke definert.' : null;
        },
        run: ({ pa, pba, pbn }) => {
            const a = pa / 100, b1 = pba / 100, b2 = pbn / 100;
            const pb = a * b1 + (1 - a) * b2, res = a * b1 / pb;
            return {
                html: `<strong>P(A | B):</strong> ${r(res * 100, 2)} %<br>P(B) = ${r(pb * 100, 2)} %`,
                steps: [
                    { description: 'Først finner vi den totale sannsynligheten for B, med loven om total sannsynlighet.', math: `P(B) = P(A)P(B|A) + P(\\bar A)P(B|\\bar A) = ${r(a, 4)}\\cdot ${r(b1, 4)} + ${r(1 - a, 4)}\\cdot ${r(b2, 4)} = ${r(pb, 5)}` },
                    { description: 'Så bruker vi Bayes\' setning.', math: `P(A|B) = \\frac{P(A)P(B|A)}{P(B)} = \\frac{${r(a * b1, 5)}}{${r(pb, 5)}} = ${r(res, 4)}`,
                      note: 'Når A er sjelden, kan P(A|B) bli overraskende lav selv om testen virker treffsikker.' },
                    { description: `Sannsynligheten for A når B har skjedd er $${r(res * 100, 2)}\\,\\%$.` },
                ],
            };
        },
    },
    {
        id: 'module-birthday', title: 'Bursdagsparadokset', category: 'sannsynlighet',
        description: 'Sjansen for at to i en gruppe har bursdag samme dag.',
        icon: '🎂', formula: 'P=1-\\frac{365!}{(365-n)!\\,365^n}',
        intro: 'Oppgi antall personer i gruppen (1–365). Vi ser bort fra skuddår.', button: 'Beregn sjanse',
        fields: [{ name: 'n', label: 'Antall personer (n)', min: 1 }],
        check: (v) => (!Number.isInteger(v.n) || v.n < 1 || v.n > 365 ? 'Oppgi et helt tall mellom 1 og 365.' : null),
        run: ({ n }) => {
            let q = 1;
            for (let k = 0; k < n; k++) q *= (365 - k) / 365;
            const p = 1 - q;
            return {
                html: `<strong>Sjanse for felles bursdag:</strong> ${r(p * 100, 2)} %`,
                steps: [
                    { description: 'Det er lettere å regne ut sjansen for at alle har ulike bursdager, og så trekke fra 1.', math: `P(\\text{alle ulike}) = \\frac{365}{365}\\cdot\\frac{364}{365}\\cdots\\frac{${365 - n + 1}}{365} = ${r(q, 6)}`,
                      note: 'Hver ny person må «unngå» alle bursdagene som allerede er tatt.' },
                    { description: 'Sjansen for minst ett felles par er det motsatte.', math: `P = 1 - ${r(q, 6)} = ${r(p, 6)}` },
                    { description: `Sjansen er $${r(p * 100, 2)}\\,\\%$.${n === 23 ? ' Med 23 personer er den allerede over 50 %.' : ''}` },
                ],
            };
        },
    },

    // ------------------------------------------------------------ Statistikk
    {
        id: 'module-weighted-avg', title: 'Vektet gjennomsnitt', category: 'statistikk',
        description: 'Gjennomsnitt der noen tall teller mer enn andre.',
        icon: '⚖️', formula: '\\bar{x}=\\frac{\\sum x_i w_i}{\\sum w_i}',
        intro: 'Skriv inn verdiene og vektene (like mange av hver), adskilt med komma eller mellomrom.', button: 'Beregn snitt',
        fields: [{ name: 'xs', label: 'Verdier', type: 'text', placeholder: 'f.eks. 4, 5, 3' }, { name: 'ws', label: 'Vekter', type: 'text', placeholder: 'f.eks. 50, 30, 20' }],
        parse: 'list',
        check: (v) => (v.xs.length !== v.ws.length ? 'Du må ha like mange verdier som vekter.' : (v.ws.some(w => w < 0) || v.ws.reduce((a, b) => a + b, 0) <= 0 ? 'Vektene kan ikke være negative, og summen må være større enn 0.' : null)),
        run: ({ xs, ws }) => {
            const sw = ws.reduce((a, b) => a + b, 0), sp = xs.reduce((a, x, i) => a + x * ws[i], 0), avg = sp / sw;
            const terms = xs.slice(0, 10).map((x, i) => `${r(x)}\\cdot ${r(ws[i])}`).join(' + ') + (xs.length > 10 ? ' + \\dots' : '');
            return {
                html: `<strong>Vektet gjennomsnitt:</strong> ${r(avg)}`,
                steps: [
                    { description: 'Vi ganger hver verdi med sin vekt og legger sammen.', math: `\\sum x_i w_i = ${terms} = ${r(sp)}` },
                    { description: 'Så legger vi sammen vektene.', math: `\\sum w_i = ${r(sw)}` },
                    { description: 'Delingen gir det vektede gjennomsnittet.', math: `\\bar{x} = \\frac{${r(sp)}}{${r(sw)}} = ${r(avg)}`, note: 'Brukes bl.a. til karakterer der eksamen teller mer enn en prøve.' },
                    { description: `Det vektede gjennomsnittet er $${r(avg)}$.` },
                ],
            };
        },
    },
    {
        id: 'module-regression', title: 'Lineær regresjon', category: 'statistikk',
        description: 'Finn den rette linjen som passer best til punktene dine, og korrelasjonen.',
        icon: '📈', formula: 'y=ax+b',
        intro: 'Skriv inn x-verdier og y-verdier (like mange, minst 2), adskilt med komma eller mellomrom.', button: 'Finn linje',
        fields: [{ name: 'xs', label: 'x-verdier', type: 'text', placeholder: 'f.eks. 1, 2, 3, 4, 5' }, { name: 'ys', label: 'y-verdier', type: 'text', placeholder: 'f.eks. 2, 4, 5, 4, 6' }],
        parse: 'list',
        check: (v) => {
            if (v.xs.length !== v.ys.length) return 'Du må ha like mange x- som y-verdier.';
            if (v.xs.length < 2) return 'Du trenger minst to punkter.';
            const mx = v.xs.reduce((a, b) => a + b, 0) / v.xs.length;
            return v.xs.every(x => x === mx) ? 'Alle x-verdiene er like. Linjen blir loddrett.' : null;
        },
        run: ({ xs, ys }) => {
            const n = xs.length, mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
            let sxx = 0, sxy = 0, syy = 0;
            xs.forEach((x, i) => { sxx += (x - mx) ** 2; sxy += (x - mx) * (ys[i] - my); syy += (ys[i] - my) ** 2; });
            const a = sxy / sxx, b = my - a * mx, rr = syy === 0 ? null : sxy / Math.sqrt(sxx * syy);
            const eq = `y = ${r(a)}x ${b >= 0 ? '+' : '-'} ${r(Math.abs(b))}`;
            const strength = rr === null ? '' : (Math.abs(rr) > 0.8 ? 'sterk' : Math.abs(rr) > 0.5 ? 'moderat' : 'svak') + (rr >= 0 ? ' positiv' : ' negativ') + ' sammenheng';
            return {
                html: `<strong>Linje:</strong> ${eq}<br><strong>Korrelasjon r:</strong> ${rr === null ? 'ikke definert' : r(rr, 4)}${strength ? ` (${strength})` : ''}`,
                steps: [
                    { description: 'Vi finner gjennomsnittet av x og y.', math: `\\bar{x} = ${r(mx)},\\quad \\bar{y} = ${r(my)}` },
                    { description: 'Stigningstallet bygger på hvor mye x og y varierer sammen, i forhold til hvor mye x varierer.', math: `a = \\frac{\\sum(x_i-\\bar{x})(y_i-\\bar{y})}{\\sum(x_i-\\bar{x})^2} = \\frac{${r(sxy)}}{${r(sxx)}} = ${r(a)}`,
                      note: 'Dette er minste kvadraters metode: linjen som gjør summen av kvadrerte avvik minst mulig.' },
                    { description: 'Linjen går alltid gjennom gjennomsnittspunktet.', math: `b = \\bar{y} - a\\bar{x} = ${r(my)} - ${r(a)}\\cdot ${r(mx)} = ${r(b)}` },
                    ...(rr === null ? [] : [{ description: 'Korrelasjonen sier hvor godt punktene følger en rett linje (mellom −1 og 1).', math: `r = \\frac{\\sum(x_i-\\bar{x})(y_i-\\bar{y})}{\\sqrt{\\sum(x_i-\\bar{x})^2\\cdot\\sum(y_i-\\bar{y})^2}} = ${r(rr, 4)}` }]),
                    { description: `Linjen er $${eq}$.` },
                ],
            };
        },
    },

    // ------------------------------------------------------------ Grunnleggende
    {
        id: 'module-standard-form', title: 'Standardform', category: 'grunnleggende',
        description: 'Skriv store og små tall som a · 10ⁿ.',
        icon: '🔬', formula: 'a\\cdot 10^{n}',
        intro: 'Oppgi et tall (ikke 0).', button: 'Skriv i standardform',
        fields: [{ name: 'x', label: 'Tall' }],
        check: (v) => (v.x === 0 ? 'Tallet 0 kan ikke skrives i standardform.' : (!Number.isFinite(v.x) ? 'Ugyldig tall.' : null)),
        run: ({ x }) => {
            const [m, e] = x.toExponential(10).split('e');
            const a = r(parseFloat(m), 10), n = parseInt(e, 10);
            return {
                html: `<strong>Standardform:</strong> ${a} · 10<sup>${n}</sup>`,
                steps: [
                    { description: 'I standardform er første faktor mellom 1 og 10 (uten fortegn). Vi flytter komma til det står ett siffer foran.', math: `${r(x, 10)} = ${a}\\cdot 10^{${n}}`,
                      note: n >= 0 ? `Kommaet flyttes ${n} plasser til venstre, så eksponenten er positiv.` : `Kommaet flyttes ${-n} plasser til høyre, så eksponenten er negativ.` },
                    { description: `$${r(x, 10)} = ${a}\\cdot 10^{${n}}$` },
                ],
            };
        },
    },
    {
        id: 'module-ratio-split', title: 'Del i forholdet', category: 'grunnleggende',
        description: 'Del en sum eller mengde etter et gitt forhold, f.eks. 2 : 3 : 5.',
        icon: '🍰', formula: 'a:b:c',
        intro: 'Oppgi totalen og forholdet, f.eks. 2:3:5 eller «2 3 5».', button: 'Del opp',
        fields: [{ name: 'total', label: 'Total', min: 0 }, { name: 'ratio', label: 'Forhold', type: 'text', placeholder: 'f.eks. 2:3:5' }],
        parse: 'list',
        check: (v) => (v.total < 0 ? 'Totalen kan ikke være negativ.' : (v.ratio.length < 2 || v.ratio.some(x => !(x > 0)) ? 'Oppgi minst to positive tall i forholdet.' : null)),
        run: ({ total, ratio }) => {
            const sum = ratio.reduce((a, b) => a + b, 0), one = total / sum, parts = ratio.map(x => x * one);
            return {
                html: ratio.map((x, i) => `<strong>Del ${i + 1}</strong> (${r(x)}): ${r(parts[i], 4)}`).join('<br>'),
                steps: [
                    { description: 'Vi finner hvor mange like deler det er til sammen.', math: `${ratio.map(x => r(x)).join(' + ')} = ${r(sum)}\\text{ deler}` },
                    { description: 'Så finner vi hvor mye én del er.', math: `\\frac{${r(total)}}{${r(sum)}} = ${r(one, 6)}`, note: 'Når du kjenner én del, er resten bare multiplikasjon.' },
                    { description: 'Hver del er antall deler ganger verdien av én del.', math: ratio.map((x, i) => `${r(x)}\\cdot ${r(one, 6)} = ${r(parts[i], 4)}`).join(',\\quad ') },
                    { description: `Delene er ${parts.map(p => `$${r(p, 4)}$`).join(', ')}.` },
                ],
            };
        },
    },
    {
        id: 'module-decimal-fraction', title: 'Desimaltall til brøk', category: 'grunnleggende',
        description: 'Gjør om et desimaltall til forkortet brøk og prosent.',
        icon: '🔢', formula: '0{,}375=\\frac{3}{8}',
        intro: 'Oppgi et desimaltall med opptil 6 desimaler.', button: 'Gjør om',
        fields: [{ name: 'x', label: 'Desimaltall' }],
        check: (v) => {
            const s = String(v.x);
            if (s.includes('e') || Math.abs(v.x) >= 1e6) return 'Oppgi et tall mindre enn 1 000 000 med opptil 6 desimaler.';
            return (s.split('.')[1] || '').length > 6 ? 'Oppgi høyst 6 desimaler.' : null;
        },
        run: ({ x }) => {
            const s = String(Math.abs(x)), d = (s.split('.')[1] || '').length;
            const den = 10 ** d, num = Math.round(Math.abs(x) * den), g = gcd(num, den) || 1;
            const sign = x < 0 ? '-' : '';
            const n2 = num / g, d2 = den / g;
            const whole = Math.floor(n2 / d2), rest = n2 % d2;
            const mixed = d2 > 1 && whole > 0 && rest > 0 ? ` = ${sign}${whole}\\frac{${rest}}{${d2}}` : '';
            return {
                html: `<strong>Brøk:</strong> ${sign}${n2}${d2 === 1 ? '' : '/' + d2}<br><strong>Prosent:</strong> ${r(x * 100, 4)} %`,
                steps: [
                    { description: `Tallet har ${d} desimal${d === 1 ? '' : 'er'}, så vi skriver det over ${den}.`, math: `${r(x, 6)} = ${sign}\\frac{${num}}{${den}}` },
                    { description: `Vi forkorter med største felles faktor, ${g}.`, math: `\\frac{${num}}{${den}} = \\frac{${num} \\div ${g}}{${den} \\div ${g}} = \\frac{${n2}}{${d2}}${mixed}`,
                      note: 'Største felles faktor finner du med SFF-kalkulatoren.' },
                    { description: 'Prosent får vi ved å gange med 100.', math: `${r(x, 6)}\\cdot 100 = ${r(x * 100, 4)}\\,\\%` },
                    { description: `$${r(x, 6)} = ${sign}\\frac{${n2}}{${d2}} = ${r(x * 100, 4)}\\,\\%$` },
                ],
            };
        },
    },

    // ------------------------------------------------------------ Algebra
    {
        id: 'module-log-base', title: 'Logaritme med vilkårlig grunntall', category: 'algebra',
        description: 'Regn ut log med grunntall b, ved hjelp av naturlig logaritme.',
        icon: '🪵', formula: '\\log_b x=\\frac{\\ln x}{\\ln b}',
        intro: 'Oppgi grunntallet b og tallet x.', button: 'Beregn logaritme',
        fields: [{ name: 'b', label: 'Grunntall (b)', min: 0 }, { name: 'x', label: 'Tall (x)', min: 0 }],
        check: (v) => (v.b <= 0 || v.b === 1 ? 'Grunntallet må være større enn 0 og ulikt 1.' : (v.x <= 0 ? 'Tallet må være større enn 0.' : null)),
        run: ({ b, x }) => {
            const res = Math.log(x) / Math.log(b);
            return {
                html: `<strong>log<sub>${r(b)}</sub>(${r(x)}):</strong> ${r(res, 6)}`,
                steps: [
                    { description: `$\\log_b x$ er svaret på spørsmålet: «hva må ${r(b)} opphøyes i for å få ${r(x)}?»` },
                    { description: 'Kalkulatorer har ofte bare ln og log₁₀, så vi bruker skiftet av grunntall.', math: `\\log_{${r(b)}} ${r(x)} = \\frac{\\ln ${r(x)}}{\\ln ${r(b)}} = \\frac{${r(Math.log(x), 5)}}{${r(Math.log(b), 5)}} = ${r(res, 6)}`,
                      note: 'Det virker med hvilken som helst logaritme i teller og nevner, f.eks. log₁₀.' },
                    { description: `Kontroll: $${r(b)}^{${r(res, 6)}} \\approx ${r(b ** res, 4)}$.` },
                    { description: `$\\log_{${r(b)}} ${r(x)} \\approx ${r(res, 6)}$` },
                ],
            };
        },
    },
    {
        id: 'module-linear-inequality', title: 'Lineær ulikhet', category: 'algebra',
        description: 'Løs ulikheter som ax + b < c.',
        icon: '↔️', formula: 'ax+b<c',
        intro: 'Oppgi a, b og c, og velg ulikhetstegn.', button: 'Løs ulikhet',
        fields: [{ name: 'a', label: 'a' }, { name: 'b', label: 'b' }, { name: 'op', label: 'Ulikhetstegn', type: 'select', options: [['<', 'ax + b < c'], ['<=', 'ax + b ≤ c'], ['>', 'ax + b > c'], ['>=', 'ax + b ≥ c']] }, { name: 'c', label: 'c' }],
        check: (v) => (v.a === 0 ? 'a kan ikke være 0. Da er det ingen x i ulikheten.' : null),
        run: ({ a, b, op, c }) => {
            const tex = { '<': '<', '<=': '\\leq', '>': '>', '>=': '\\geq' }, flip = { '<': '>', '<=': '>=', '>': '<', '>=': '<=' };
            const ch = { '<': '<', '<=': '≤', '>': '>', '>=': '≥' };
            const rhs = c - b, x = rhs / a, op2 = a < 0 ? flip[op] : op;
            const steps = [
                { description: 'Vi flytter $b$ over på høyre side.', math: `${r(a)}x ${tex[op]} ${r(c)} - ${r(b)} = ${r(rhs)}` },
                a < 0
                    ? { description: 'Vi deler på $a$. Siden $a$ er negativ, snur vi ulikhetstegnet.', math: `x ${tex[op2]} \\frac{${r(rhs)}}{${r(a)}} = ${r(x)}`, note: 'Å gange eller dele med et negativt tall snur rekkefølgen: 2 < 3, men −2 > −3.' }
                    : { description: 'Vi deler på $a$. Siden $a$ er positiv, beholder vi ulikhetstegnet.', math: `x ${tex[op2]} \\frac{${r(rhs)}}{${r(a)}} = ${r(x)}` },
                { description: `Løsningen er $x ${tex[op2]} ${r(x)}$.` },
            ];
            return { html: `<strong>Løsning:</strong> x ${ch[op2]} ${r(x)}`, steps };
        },
    },
];
