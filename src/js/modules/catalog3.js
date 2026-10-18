/**
 * Katalog del 3: geometri, algebra, økonomi, fysikk, statistikk og konvertering.
 * Samme format som catalog.js.
 */
const r = (n, d = 4) => { const v = Number(n.toFixed(d)); return Object.is(v, -0) ? 0 : v; };
const PI = Math.PI;
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const posAll = (v, names, msg = 'Alle verdier må være større enn 0.') =>
    names.some(n => !(v[n] > 0)) ? msg : null;
const kr = (n) => n.toFixed(2);
const isInt = Number.isInteger;
const sg = (n) => (n >= 0 ? '+' : '-') + ` ${r(Math.abs(n))}`;

/** Standard normalfordeling, kumulativ (Abramowitz–Stegun 7.1.26, feil < 1,5·10⁻⁷). */
function phi(z) {
    const t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2);
    const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z / 2);
    return z >= 0 ? 0.5 * (1 + y) : 0.5 * (1 - y);
}

export const catalog3 = [
    // ------------------------------------------------------------ Geometri
    {
        id: 'module-rectangle', title: 'Rektangel', category: 'geometri',
        description: 'Areal, omkrets og diagonal.',
        icon: '▭', formula: 'A=l\\cdot b',
        intro: 'Oppgi lengde og bredde.', button: 'Beregn rektangel',
        fields: [{ name: 'l', label: 'Lengde (l)', min: 0 }, { name: 'b', label: 'Bredde (b)', min: 0 }],
        check: (v) => posAll(v, ['l', 'b']),
        run: ({ l, b }) => {
            const A = l * b, O = 2 * (l + b), d = Math.hypot(l, b);
            return {
                html: `<strong>Areal:</strong> ${r(A)}<br><strong>Omkrets:</strong> ${r(O)}<br><strong>Diagonal:</strong> ${r(d)}`,
                steps: [
                    { description: 'Arealet er lengde ganger bredde.', math: `A = l\\cdot b = ${r(l)}\\cdot ${r(b)} = ${r(A)}` },
                    { description: 'Omkretsen er summen av alle fire sider.', math: `O = 2(l+b) = 2(${r(l)}+${r(b)}) = ${r(O)}` },
                    { description: 'Diagonalen er hypotenusen i en rettvinklet trekant.', math: `d = \\sqrt{l^2+b^2} = \\sqrt{${r(l)}^2+${r(b)}^2} \\approx ${r(d)}`, note: 'Et kvadrat med side s har diagonal s·√2.' },
                    { description: `Areal $${r(A)}$, omkrets $${r(O)}$ og diagonal $\\approx ${r(d)}$.` },
                ],
            };
        },
    },
    {
        id: 'module-rhombus', title: 'Rombe', category: 'geometri',
        description: 'Areal, side og omkrets ut fra de to diagonalene.',
        icon: '◇', formula: 'A=\\frac{d_1\\cdot d_2}{2}',
        intro: 'Oppgi lengden på de to diagonalene.', button: 'Beregn rombe',
        fields: [{ name: 'd1', label: 'Diagonal d₁', min: 0 }, { name: 'd2', label: 'Diagonal d₂', min: 0 }],
        check: (v) => posAll(v, ['d1', 'd2']),
        run: ({ d1, d2 }) => {
            const A = d1 * d2 / 2, s = Math.hypot(d1 / 2, d2 / 2), O = 4 * s;
            return {
                html: `<strong>Areal:</strong> ${r(A)}<br><strong>Side:</strong> ${r(s)}<br><strong>Omkrets:</strong> ${r(O)}`,
                steps: [
                    { description: 'Arealet er halve produktet av diagonalene.', math: `A = \\frac{d_1 d_2}{2} = \\frac{${r(d1)}\\cdot ${r(d2)}}{2} = ${r(A)}` },
                    { description: 'Diagonalene står vinkelrett og halverer hverandre. Én side er hypotenusen i en trekant med de halve diagonalene som kateter.', math: `s = \\sqrt{\\left(\\tfrac{d_1}{2}\\right)^2+\\left(\\tfrac{d_2}{2}\\right)^2} = \\sqrt{${r(d1 / 2)}^2+${r(d2 / 2)}^2} \\approx ${r(s)}`, note: 'Alle fire sidene i en rombe er like lange.' },
                    { description: 'Omkretsen er fire ganger siden.', math: `O = 4s \\approx ${r(O)}` },
                    { description: `Areal $${r(A)}$, side $\\approx ${r(s)}$ og omkrets $\\approx ${r(O)}$.` },
                ],
            };
        },
    },
    {
        id: 'module-regular-polygon', title: 'Regulær mangekant (areal)', category: 'geometri',
        description: 'Areal og omkrets av en mangekant med like sider.',
        icon: '⬡', formula: 'A=\\frac{n s^2}{4\\tan(\\pi/n)}',
        intro: 'Oppgi antall sider og lengden på én side.', button: 'Beregn areal',
        fields: [{ name: 'n', label: 'Antall sider (n)', min: 3 }, { name: 's', label: 'Sidelengde (s)', min: 0 }],
        check: (v) => (!isInt(v.n) || v.n < 3 ? 'Antall sider må være et helt tall på minst 3.' : posAll(v, ['s'], 'Sidelengden må være større enn 0.')),
        run: ({ n, s }) => {
            const ap = s / (2 * Math.tan(PI / n)), O = n * s, A = O * ap / 2;
            return {
                html: `<strong>Areal:</strong> ${r(A)}<br><strong>Omkrets:</strong> ${r(O)}<br><strong>Apotem:</strong> ${r(ap)}`,
                steps: [
                    { description: 'Apotemet er avstanden fra midten til midten av en side. Vi finner det med tangens i en halv sentralvinkel.', math: `a = \\frac{s}{2\\tan(\\pi/n)} = \\frac{${r(s)}}{2\\tan(\\pi/${n})} \\approx ${r(ap)}`, note: 'Mangekanten kan deles i n like trekanter med grunnlinje s og høyde a.' },
                    { description: 'Omkretsen er antall sider ganger sidelengden.', math: `O = n\\cdot s = ${r(O)}` },
                    { description: 'Arealet er halve omkretsen ganger apotemet.', math: `A = \\frac{O\\cdot a}{2} = \\frac{${r(O)}\\cdot ${r(ap)}}{2} \\approx ${r(A)}` },
                    { description: `Areal $\\approx ${r(A)}$ og omkrets $${r(O)}$.` },
                ],
            };
        },
    },
    {
        id: 'module-pyramid', title: 'Pyramide', category: 'geometri',
        description: 'Volum og overflate av en pyramide med kvadratisk grunnflate.',
        icon: '🔺', formula: 'V=\\frac{1}{3}Gh',
        intro: 'Oppgi sidelengden på kvadratet i bunnen og pyramidens høyde.', button: 'Beregn pyramide',
        fields: [{ name: 'a', label: 'Sidelengde i bunnen (a)', min: 0 }, { name: 'h', label: 'Høyde (h)', min: 0 }],
        check: (v) => posAll(v, ['a', 'h']),
        run: ({ a, h }) => {
            const G = a * a, V = G * h / 3, sl = Math.hypot(h, a / 2), O = G + 2 * a * sl;
            return {
                html: `<strong>Volum:</strong> ${r(V)}<br><strong>Overflate:</strong> ${r(O)}<br><strong>Sidehøyde:</strong> ${r(sl)}`,
                steps: [
                    { description: 'Grunnflaten er et kvadrat.', math: `G = a^2 = ${r(a)}^2 = ${r(G)}` },
                    { description: 'Volumet er en tredjedel av grunnflate ganger høyde.', math: `V = \\frac{1}{3}Gh = \\frac{1}{3}\\cdot ${r(G)}\\cdot ${r(h)} = ${r(V)}`, note: 'Det går akkurat tre like pyramider i en kube med samme grunnflate og høyde.' },
                    { description: 'Sidehøyden i en sideflate finner vi med Pytagoras.', math: `s = \\sqrt{h^2+\\left(\\tfrac{a}{2}\\right)^2} = \\sqrt{${r(h)}^2+${r(a / 2)}^2} \\approx ${r(sl)}` },
                    { description: 'Overflaten er grunnflaten pluss fire trekanter.', math: `O = a^2 + 4\\cdot\\frac{a\\cdot s}{2} = ${r(G)} + 2\\cdot ${r(a)}\\cdot ${r(sl)} \\approx ${r(O)}` },
                    { description: `Volum $${r(V)}$ og overflate $\\approx ${r(O)}$.` },
                ],
            };
        },
    },
    {
        id: 'module-box', title: 'Rett prisme (eske)', category: 'geometri',
        description: 'Volum, overflate og romdiagonal.',
        icon: '📦', formula: 'V=l\\cdot b\\cdot h',
        intro: 'Oppgi lengde, bredde og høyde.', button: 'Beregn eske',
        fields: [{ name: 'l', label: 'Lengde (l)', min: 0 }, { name: 'b', label: 'Bredde (b)', min: 0 }, { name: 'h', label: 'Høyde (h)', min: 0 }],
        check: (v) => posAll(v, ['l', 'b', 'h']),
        run: ({ l, b, h }) => {
            const V = l * b * h, O = 2 * (l * b + l * h + b * h), d = Math.sqrt(l * l + b * b + h * h);
            return {
                html: `<strong>Volum:</strong> ${r(V)}<br><strong>Overflate:</strong> ${r(O)}<br><strong>Romdiagonal:</strong> ${r(d)}`,
                steps: [
                    { description: 'Volumet er lengde ganger bredde ganger høyde.', math: `V = l\\cdot b\\cdot h = ${r(l)}\\cdot ${r(b)}\\cdot ${r(h)} = ${r(V)}` },
                    { description: 'Overflaten består av tre par like sideflater.', math: `O = 2(lb + lh + bh) = 2(${r(l * b)} + ${r(l * h)} + ${r(b * h)}) = ${r(O)}` },
                    { description: 'Romdiagonalen går fra hjørne til motsatt hjørne. Pytagoras brukes i tre dimensjoner.', math: `d = \\sqrt{l^2+b^2+h^2} \\approx ${r(d)}`, note: 'Den lengste pinnen som får plass i esken er like lang som romdiagonalen.' },
                    { description: `Volum $${r(V)}$, overflate $${r(O)}$ og romdiagonal $\\approx ${r(d)}$.` },
                ],
            };
        },
    },
    {
        id: 'module-triangle-sas', title: 'Trekant (to sider og vinkel)', category: 'geometri',
        description: 'Areal og tredje side når du kjenner to sider og vinkelen mellom dem.',
        icon: '📐', formula: 'A=\\frac{1}{2}ab\\sin C',
        intro: 'Oppgi to sider og vinkelen mellom dem (i grader).', button: 'Beregn trekant',
        fields: [{ name: 'a', label: 'Side a', min: 0 }, { name: 'b', label: 'Side b', min: 0 }, { name: 'C', label: 'Vinkel C mellom a og b (grader)', min: 0 }],
        check: (v) => posAll(v, ['a', 'b']) || (v.C <= 0 || v.C >= 180 ? 'Vinkelen må være mellom 0 og 180 grader.' : null),
        run: ({ a, b, C }) => {
            const rad = C * PI / 180, A = 0.5 * a * b * Math.sin(rad), c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(rad));
            return {
                html: `<strong>Areal:</strong> ${r(A)}<br><strong>Tredje side c:</strong> ${r(c)}`,
                steps: [
                    { description: 'Arealet er halve produktet av to sider ganger sinus til vinkelen mellom dem.', math: `A = \\frac{1}{2}ab\\sin C = \\frac{1}{2}\\cdot ${r(a)}\\cdot ${r(b)}\\cdot\\sin ${r(C)}^\\circ \\approx ${r(A)}`, note: 'Når C = 90° er sin C = 1, og formelen blir den vanlige ½ · grunnlinje · høyde.' },
                    { description: 'Den tredje siden finner vi med cosinussetningen.', math: `c = \\sqrt{a^2+b^2-2ab\\cos C} = \\sqrt{${r(a * a)}+${r(b * b)}-${r(2 * a * b)}\\cdot\\cos ${r(C)}^\\circ} \\approx ${r(c)}` },
                    { description: `Areal $\\approx ${r(A)}$ og $c \\approx ${r(c)}$.` },
                ],
            };
        },
    },

    // ------------------------------------------------------------ Algebra
    {
        id: 'module-abs-equation', title: 'Likning med tallverdi', category: 'algebra',
        description: 'Løs |ax + b| = c.',
        icon: '|x|', formula: '|ax+b|=c',
        intro: 'Oppgi a, b og c i likningen |ax + b| = c.', button: 'Løs likning',
        fields: [{ name: 'a', label: 'a' }, { name: 'b', label: 'b' }, { name: 'c', label: 'c' }],
        check: (v) => (v.a === 0 ? 'a kan ikke være 0.' : null),
        run: ({ a, b, c }) => {
            if (c < 0) return { html: '<strong>Ingen løsning</strong>', steps: [{ description: 'En tallverdi er aldri negativ, så $|ax+b| = c$ har ingen løsning når $c < 0$.' }, { description: 'Likningen har ingen løsning.' }] };
            const x1 = (c - b) / a, x2 = (-c - b) / a;
            if (c === 0) return { html: `<strong>x =</strong> ${r(x1)}`, steps: [{ description: 'Tallverdien er 0 bare når det inni er 0.', math: `${r(a)}x ${sg(b)} = 0 \\Rightarrow x = ${r(x1)}` }, { description: `$x = ${r(x1)}$` }] };
            return {
                html: `<strong>x =</strong> ${r(x1)} eller x = ${r(x2)}`,
                steps: [
                    { description: 'Tallverdien er $c$ når uttrykket inni er enten $c$ eller $-c$. Vi får to likninger.', math: `${r(a)}x ${sg(b)} = ${r(c)}\\quad\\text{eller}\\quad ${r(a)}x ${sg(b)} = ${r(-c)}`, note: 'Tallverdien er avstanden fra 0. To tall har avstand c fra 0: c og −c.' },
                    { description: 'Løser begge.', math: `x = \\frac{${r(c)} - (${r(b)})}{${r(a)}} = ${r(x1)}\\quad\\text{eller}\\quad x = \\frac{${r(-c)} - (${r(b)})}{${r(a)}} = ${r(x2)}` },
                    { description: `$x = ${r(x1)}$ eller $x = ${r(x2)}$` },
                ],
            };
        },
    },
    {
        id: 'module-quad-from-roots', title: 'Andregradsfunksjon fra nullpunkter', category: 'algebra',
        description: 'Finn funksjonen når du kjenner de to nullpunktene.',
        icon: '🧩', formula: 'f(x)=(x-x_1)(x-x_2)',
        intro: 'Oppgi de to nullpunktene (røttene).', button: 'Finn funksjon',
        fields: [{ name: 'x1', label: 'Nullpunkt x₁' }, { name: 'x2', label: 'Nullpunkt x₂' }],
        run: ({ x1, x2 }) => {
            const s = x1 + x2, p = x1 * x2;
            return {
                html: `<strong>f(x) =</strong> x² ${s === 0 ? '' : (-s >= 0 ? '+ ' : '− ') + (Math.abs(s) === 1 ? '' : r(Math.abs(s))) + 'x '}${p === 0 ? '' : (p >= 0 ? '+ ' : '− ') + r(Math.abs(p))}`,
                steps: [
                    { description: 'Funksjonen på faktorisert form har nullpunktene som faktorer.', math: `f(x) = (x - ${r(x1)})(x - ${r(x2)})`, note: 'Hvert nullpunkt gir en faktor som blir 0 akkurat der. Du kan gange med en vilkårlig a ≠ 0 uten å endre nullpunktene.' },
                    { description: 'Ganger ut parentesene.', math: `f(x) = x^2 - (${r(x1)} + ${r(x2)})x + ${r(x1)}\\cdot ${r(x2)} = x^2 ${sg(-s)}x ${sg(p)}` },
                    { description: `$f(x) = x^2 ${sg(-s)}x ${sg(p)}$` },
                ],
            };
        },
    },
    {
        id: 'module-complete-square', title: 'Fullstendig kvadrat', category: 'algebra',
        description: 'Skriv ax² + bx + c som a(x + p)² + q.',
        icon: '🟦', formula: 'ax^2+bx+c=a(x+p)^2+q',
        intro: 'Oppgi a, b og c.', button: 'Fullfør kvadratet',
        fields: [{ name: 'a', label: 'a' }, { name: 'b', label: 'b' }, { name: 'c', label: 'c' }],
        check: (v) => (v.a === 0 ? 'a kan ikke være 0.' : null),
        run: ({ a, b, c }) => {
            const p = b / (2 * a), q = c - b * b / (4 * a);
            return {
                html: `<strong>${a === 1 ? '' : a === -1 ? '−' : r(a)}(x ${sg(p)})²${q === 0 ? '' : ' ' + sg(q)}</strong><br>${a > 0 ? 'Bunnpunkt' : 'Toppunkt'}: (${r(-p)}, ${r(q)})`,
                steps: [
                    { description: 'Vi setter $a$ utenfor de to første leddene.', math: `${r(a)}x^2 ${sg(b)}x ${sg(c)} = ${r(a)}\\left(x^2 ${sg(b / a)}x\\right) ${sg(c)}` },
                    { description: 'Halvparten av tallet foran $x$ er $p$. Vi legger til og trekker fra $p^2$.', math: `p = \\frac{b}{2a} = ${r(p)}`, note: 'Dette er ideen bak kvadratsetningen: (x + p)² = x² + 2px + p².' },
                    { description: 'Kvadratet kan nå skrives kompakt.', math: `${r(a)}(x ${sg(p)})^2 ${sg(q)},\\quad q = c - \\frac{b^2}{4a} = ${r(q)}` },
                    { description: `Funksjonen har ${a > 0 ? 'bunnpunkt' : 'toppunkt'} i $(${r(-p)},\; ${r(q)})$.` },
                ],
            };
        },
    },

    // ------------------------------------------------------------ Økonomi
    {
        id: 'module-serial-loan', title: 'Serielån', category: 'okonomi',
        description: 'Lån med lik avdrag og synkende renter. Første og siste termin, samt totale renter.',
        icon: '🏠', formula: 'T_k=\\frac{L}{n}+i\\cdot L_{k-1}',
        intro: 'Oppgi lånebeløp, årlig rente og antall år. Vi regner med månedlige terminer.', button: 'Beregn serielån',
        fields: [{ name: 'L', label: 'Lånebeløp (kr)', min: 0 }, { name: 'p', label: 'Årlig rente (%)', min: 0 }, { name: 'y', label: 'Antall år', min: 0 }],
        check: (v) => (v.L <= 0 || v.y <= 0 ? 'Lånebeløp og antall år må være større enn 0.' : (v.p < 0 ? 'Renten kan ikke være negativ.' : (!isInt(v.y * 12) ? 'Antall år må gi et helt antall måneder.' : null))),
        run: ({ L, p, y }) => {
            const n = Math.round(y * 12), i = p / 100 / 12, avdrag = L / n;
            const first = avdrag + i * L, last = avdrag + i * avdrag;
            const totalInt = i * L * (n + 1) / 2;
            return {
                html: `<strong>Avdrag per måned:</strong> ${kr(avdrag)} kr<br><strong>Første termin:</strong> ${kr(first)} kr<br><strong>Siste termin:</strong> ${kr(last)} kr<br><strong>Sum renter:</strong> ${kr(totalInt)} kr`,
                steps: [
                    { description: 'Avdraget er likt hver måned.', math: `\\text{avdrag} = \\frac{L}{n} = \\frac{${r(L)}}{${n}} = ${r(avdrag, 2)}\\text{ kr}`, note: 'Et serielån er dyrest i starten og blir billigere for hver termin. Annuitetslån har lik termin hele veien.' },
                    { description: 'Månedlig rente er årsrenten delt på 12.', math: `i = \\frac{${r(p)}\\%}{12} = ${r(i * 100, 4)}\\%` },
                    { description: 'Første termin har rente av hele lånet. Siste termin har rente av bare ett avdrag.', math: `T_1 = ${r(avdrag, 2)} + ${r(i, 6)}\\cdot ${r(L)} = ${r(first, 2)}\\text{ kr},\\quad T_n = ${r(avdrag, 2)} + ${r(i, 6)}\\cdot ${r(avdrag, 2)} = ${r(last, 2)}\\text{ kr}` },
                    { description: 'Summen av rentene danner en aritmetisk rekke.', math: `\\text{renter} = i\\cdot L\\cdot\\frac{n+1}{2} = ${r(totalInt, 2)}\\text{ kr}` },
                    { description: `Totale renter er $${r(totalInt, 2)}$ kr.` },
                ],
            };
        },
    },
    {
        id: 'module-roi', title: 'Avkastning (ROI)', category: 'okonomi',
        description: 'Hvor mye har en investering gitt, i kroner og prosent?',
        icon: '💹', formula: 'ROI=\\frac{V_{slutt}-V_{start}}{V_{start}}\\cdot 100\\%',
        intro: 'Oppgi hva du investerte og hva det er verdt nå.', button: 'Beregn avkastning',
        fields: [{ name: 's', label: 'Investert (kr)', min: 0 }, { name: 'e', label: 'Verdi nå (kr)', min: 0 }],
        check: (v) => (v.s <= 0 ? 'Investert beløp må være større enn 0.' : (v.e < 0 ? 'Verdien kan ikke være negativ.' : null)),
        run: ({ s, e }) => {
            const g = e - s, roi = g / s * 100;
            return {
                html: `<strong>${g >= 0 ? 'Gevinst' : 'Tap'}:</strong> ${kr(Math.abs(g))} kr<br><strong>Avkastning:</strong> ${r(roi, 2)} %`,
                steps: [
                    { description: 'Gevinsten er verdien nå minus det du la inn.', math: `${r(e)} - ${r(s)} = ${r(g, 2)}\\text{ kr}` },
                    { description: 'Avkastningen er gevinsten i prosent av det du investerte.', math: `ROI = \\frac{${r(g, 2)}}{${r(s)}}\\cdot 100\\% = ${r(roi, 2)}\\%`, note: 'Et tap på 50 % krever en gevinst på 100 % for å komme tilbake til start.' },
                    { description: `Avkastningen er $${r(roi, 2)}\\,\\%$.` },
                ],
            };
        },
    },
    {
        id: 'module-cagr', title: 'Gjennomsnittlig årlig vekst', category: 'okonomi',
        description: 'Hvilken fast årlig vekst gir samme utvikling? (CAGR)',
        icon: '📈', formula: 'g=\\left(\\frac{V_{slutt}}{V_{start}}\\right)^{1/n}-1',
        intro: 'Oppgi startverdi, sluttverdi og antall år.', button: 'Beregn vekst',
        fields: [{ name: 's', label: 'Startverdi', min: 0 }, { name: 'e', label: 'Sluttverdi', min: 0 }, { name: 'n', label: 'Antall år', min: 0 }],
        check: (v) => posAll(v, ['s', 'e', 'n'], 'Alle verdier må være større enn 0.'),
        run: ({ s, e, n }) => {
            const f = e / s, g = f ** (1 / n) - 1;
            return {
                html: `<strong>Årlig vekst:</strong> ${r(g * 100, 3)} %<br>Totalt: ${r((f - 1) * 100, 2)} %`,
                steps: [
                    { description: 'Samlet vekstfaktor er sluttverdi delt på startverdi.', math: `\\frac{${r(e)}}{${r(s)}} = ${r(f, 5)}` },
                    { description: `Vi tar ${r(n)}. rot for å finne den årlige vekstfaktoren.`, math: `${r(f, 5)}^{1/${r(n)}} = ${r(g + 1, 6)}`, note: 'Det er ikke det samme som å dele totalveksten på antall år, fordi vekst bygger på forrige års verdi.' },
                    { description: 'Vekstfaktor minus 1 er veksten per år.', math: `g = ${r(g + 1, 6)} - 1 = ${r(g * 100, 3)}\\%` },
                    { description: `Årlig vekst er $${r(g * 100, 3)}\\,\\%$.` },
                ],
            };
        },
    },

    // ------------------------------------------------------------ Fysikk
    {
        id: 'module-kinematics', title: 'Bevegelse med konstant akselerasjon', category: 'fysikk',
        description: 'Sluttfart og strekning ut fra startfart, akselerasjon og tid.',
        icon: '🚗', formula: 's=v_0t+\\frac{1}{2}at^2',
        intro: 'Oppgi startfart, akselerasjon og tid.', button: 'Beregn bevegelse',
        fields: [{ name: 'v0', label: 'Startfart v₀ (m/s)' }, { name: 'a', label: 'Akselerasjon a (m/s²)' }, { name: 't', label: 'Tid t (s)', min: 0 }],
        check: (v) => (v.t < 0 ? 'Tiden kan ikke være negativ.' : null),
        run: ({ v0, a, t }) => {
            const v = v0 + a * t, s = v0 * t + 0.5 * a * t * t;
            return {
                html: `<strong>Sluttfart:</strong> ${r(v)} m/s (${r(v * 3.6, 1)} km/t)<br><strong>Strekning:</strong> ${r(s)} m`,
                steps: [
                    { description: 'Farten endrer seg like mye hvert sekund.', math: `v = v_0 + a t = ${r(v0)} + ${r(a)}\\cdot ${r(t)} = ${r(v)}\\text{ m/s}` },
                    { description: 'Strekningen er startfart ganger tid pluss bidraget fra akselerasjonen.', math: `s = v_0 t + \\frac{1}{2}at^2 = ${r(v0)}\\cdot ${r(t)} + \\frac{1}{2}\\cdot ${r(a)}\\cdot ${r(t)}^2 = ${r(s)}\\text{ m}`, note: 'Strekningen er arealet under fart–tid-grafen.' },
                    { description: `Sluttfart $${r(v)}$ m/s og strekning $${r(s)}$ m.` },
                ],
            };
        },
    },
    {
        id: 'module-momentum', title: 'Bevegelsesmengde', category: 'fysikk',
        description: 'Bevegelsesmengde og kinetisk energi.',
        icon: '🎳', formula: 'p=m\\cdot v',
        intro: 'Oppgi masse og fart.', button: 'Beregn',
        fields: [{ name: 'm', label: 'Masse m (kg)', min: 0 }, { name: 'v', label: 'Fart v (m/s)' }],
        check: (v) => posAll(v, ['m'], 'Massen må være større enn 0.'),
        run: ({ m, v }) => {
            const p = m * v, E = 0.5 * m * v * v;
            return {
                html: `<strong>Bevegelsesmengde:</strong> ${r(p)} kg·m/s<br><strong>Kinetisk energi:</strong> ${r(E)} J`,
                steps: [
                    { description: 'Bevegelsesmengde er masse ganger fart.', math: `p = m v = ${r(m)}\\cdot ${r(v)} = ${r(p)}\\text{ kg}\\cdot\\text{m/s}`, note: 'Ved en kollisjon er den samlede bevegelsesmengden den samme før og etter.' },
                    { description: 'Kinetisk energi.', math: `E_k = \\frac{1}{2}mv^2 = \\frac{1}{2}\\cdot ${r(m)}\\cdot ${r(v)}^2 = ${r(E)}\\text{ J}` },
                    { description: `$p = ${r(p)}$ kg·m/s og $E_k = ${r(E)}$ J.` },
                ],
            };
        },
    },
    {
        id: 'module-kwh-cost', title: 'Strømkostnad', category: 'fysikk',
        description: 'Hva koster det å bruke en elektrisk enhet?',
        icon: '💡', formula: 'E=P\\cdot t',
        intro: 'Oppgi effekt, brukstid og strømpris.', button: 'Beregn kostnad',
        fields: [{ name: 'P', label: 'Effekt (watt)', min: 0 }, { name: 't', label: 'Brukstid (timer)', min: 0 }, { name: 'price', label: 'Pris (kr per kWh)', min: 0 }],
        check: (v) => (v.P < 0 || v.t < 0 || v.price < 0 ? 'Verdiene kan ikke være negative.' : null),
        run: ({ P, t, price }) => {
            const kWh = P / 1000 * t, cost = kWh * price;
            return {
                html: `<strong>Energi:</strong> ${r(kWh, 3)} kWh<br><strong>Kostnad:</strong> ${kr(cost)} kr`,
                steps: [
                    { description: 'Vi gjør om watt til kilowatt og ganger med tiden.', math: `E = \\frac{${r(P)}}{1000}\\cdot ${r(t)} = ${r(kWh, 3)}\\text{ kWh}`, note: '1 kWh er energien en enhet på 1000 W bruker på én time.' },
                    { description: 'Kostnaden er energi ganger pris.', math: `${r(kWh, 3)}\\cdot ${r(price)} = ${r(cost, 2)}\\text{ kr}` },
                    { description: `Kostnaden er $${r(cost, 2)}$ kr.` },
                ],
            };
        },
    },
    {
        id: 'module-pendulum', title: 'Pendel', category: 'fysikk',
        description: 'Svingetid og frekvens for en pendel.',
        icon: '🕰️', formula: 'T=2\\pi\\sqrt{\\frac{L}{g}}',
        intro: 'Oppgi lengden på pendelen. Vi bruker g = 9,81 m/s² og små utslag.', button: 'Beregn pendel',
        fields: [{ name: 'L', label: 'Lengde L (m)', min: 0 }],
        check: (v) => posAll(v, ['L'], 'Lengden må være større enn 0.'),
        run: ({ L }) => {
            const T = 2 * PI * Math.sqrt(L / 9.81);
            return {
                html: `<strong>Svingetid:</strong> ${r(T, 3)} s<br><strong>Frekvens:</strong> ${r(1 / T, 3)} Hz`,
                steps: [
                    { description: 'Svingetiden avhenger bare av lengden, ikke av massen.', math: `T = 2\\pi\\sqrt{\\frac{L}{g}} = 2\\pi\\sqrt{\\frac{${r(L)}}{9{,}81}} \\approx ${r(T, 3)}\\text{ s}`, note: 'For å doble svingetiden må pendelen bli fire ganger så lang.' },
                    { description: 'Frekvensen er antall svingninger per sekund.', math: `f = \\frac{1}{T} \\approx ${r(1 / T, 3)}\\text{ Hz}` },
                    { description: `Svingetiden er $${r(T, 3)}$ s.` },
                ],
            };
        },
    },

    // ------------------------------------------------------------ Sannsynlighet / statistikk
    {
        id: 'module-expected-value', title: 'Forventningsverdi', category: 'sannsynlighet',
        description: 'Forventningsverdi og standardavvik for en sannsynlighetsfordeling.',
        icon: '🎯', formula: 'E(X)=\\sum x_i\\cdot P(x_i)',
        intro: 'Oppgi verdiene og sannsynlighetene i prosent (summen må bli 100).', button: 'Beregn forventning',
        fields: [{ name: 'xs', label: 'Verdier', type: 'text', placeholder: 'f.eks. 0, 10, 100' }, { name: 'ps', label: 'Sannsynligheter (%)', type: 'text', placeholder: 'f.eks. 70, 25, 5' }],
        parse: 'list',
        check: (v) => (v.xs.length !== v.ps.length ? 'Du må ha like mange verdier som sannsynligheter.' : (v.ps.some(p => p < 0) ? 'Sannsynligheter kan ikke være negative.' : (Math.abs(v.ps.reduce((a, b) => a + b, 0) - 100) > 0.01 ? 'Sannsynlighetene må summere seg til 100 %.' : null))),
        run: ({ xs, ps }) => {
            const pr = ps.map(p => p / 100), E = xs.reduce((a, x, i) => a + x * pr[i], 0);
            const V = xs.reduce((a, x, i) => a + (x - E) ** 2 * pr[i], 0), sd = Math.sqrt(V);
            const terms = xs.slice(0, 8).map((x, i) => `${r(x)}\\cdot ${r(pr[i], 4)}`).join(' + ') + (xs.length > 8 ? ' + \\dots' : '');
            return {
                html: `<strong>E(X):</strong> ${r(E)}<br><strong>Standardavvik:</strong> ${r(sd)}`,
                steps: [
                    { description: 'Hver verdi ganges med sin sannsynlighet, og så legger vi sammen.', math: `E(X) = ${terms} = ${r(E)}`, note: 'Forventningsverdien er gjennomsnittet du får om du gjentar forsøket mange, mange ganger.' },
                    { description: 'Variansen er forventet kvadrert avvik fra forventningsverdien.', math: `\\mathrm{Var}(X) = \\sum (x_i - E)^2\\,P(x_i) = ${r(V)}` },
                    { description: 'Standardavviket er kvadratroten av variansen.', math: `\\sigma = \\sqrt{${r(V)}} = ${r(sd)}` },
                    { description: `Forventningsverdien er $${r(E)}$ og standardavviket er $${r(sd)}$.` },
                ],
            };
        },
    },
    {
        id: 'module-normal-cdf', title: 'Normalfordeling', category: 'sannsynlighet',
        description: 'Sannsynlighet for at en normalfordelt verdi er under eller over x.',
        icon: '🔔', formula: 'P(X\\le x)=\\Phi\\!\\left(\\frac{x-\\mu}{\\sigma}\\right)',
        intro: 'Oppgi gjennomsnitt, standardavvik og verdien x.', button: 'Beregn sannsynlighet',
        fields: [{ name: 'mu', label: 'Gjennomsnitt (μ)' }, { name: 'sd', label: 'Standardavvik (σ)', min: 0 }, { name: 'x', label: 'Verdi (x)' }],
        check: (v) => posAll(v, ['sd'], 'Standardavviket må være større enn 0.'),
        run: ({ mu, sd, x }) => {
            const z = (x - mu) / sd, p = phi(z);
            return {
                html: `<strong>P(X ≤ ${r(x)}):</strong> ${r(p * 100, 2)} %<br><strong>P(X > ${r(x)}):</strong> ${r((1 - p) * 100, 2)} %`,
                steps: [
                    { description: 'Vi gjør først om til standard normalfordeling med z-score.', math: `z = \\frac{x-\\mu}{\\sigma} = \\frac{${r(x)}-${r(mu)}}{${r(sd)}} = ${r(z, 3)}` },
                    { description: 'Arealet under klokkekurven til venstre for $z$ er sannsynligheten.', math: `P(X \\le x) = \\Phi(${r(z, 3)}) \\approx ${r(p, 4)}`, note: 'Omtrent 68 % ligger innenfor ±1σ, 95 % innenfor ±2σ og 99,7 % innenfor ±3σ.' },
                    { description: 'Sannsynligheten for å ligge over er det motsatte.', math: `P(X > x) = 1 - ${r(p, 4)} = ${r(1 - p, 4)}` },
                    { description: `$P(X \\le ${r(x)}) \\approx ${r(p * 100, 2)}\\,\\%$ og $P(X > ${r(x)}) \\approx ${r((1 - p) * 100, 2)}\\,\\%$.` },
                ],
            };
        },
    },
    {
        id: 'module-outliers', title: 'Ekstremverdier (IQR)', category: 'statistikk',
        description: 'Finn verdier som ligger uvanlig langt unna resten.',
        icon: '🚩', formula: 'Q_1-1{,}5\\,IQR,\; Q_3+1{,}5\\,IQR',
        intro: 'Skriv inn tall adskilt med komma eller mellomrom (minst 4).', button: 'Finn ekstremverdier',
        fields: [{ name: 'list', label: 'Tall', type: 'text', placeholder: 'f.eks. 4, 5, 5, 6, 7, 7, 8, 30' }],
        parse: 'list',
        check: (v) => (v.list.length < 4 ? 'Skriv inn minst fire tall.' : null),
        run: ({ list }) => {
            const xs = [...list].sort((p, q) => p - q), n = xs.length;
            const med = (a) => (a.length % 2 ? a[(a.length - 1) / 2] : (a[a.length / 2 - 1] + a[a.length / 2]) / 2);
            const q1 = med(xs.slice(0, Math.floor(n / 2))), q3 = med(xs.slice(Math.ceil(n / 2)));
            const iqr = q3 - q1, lo = q1 - 1.5 * iqr, hi = q3 + 1.5 * iqr;
            const out = xs.filter(x => x < lo || x > hi);
            return {
                html: `<strong>Grenser:</strong> ${r(lo)} til ${r(hi)}<br><strong>Ekstremverdier:</strong> ${out.length ? out.map(x => r(x)).join(', ') : 'ingen'}`,
                steps: [
                    { description: 'Vi finner kvartilene og kvartilbredden.', math: `Q_1 = ${r(q1)},\\quad Q_3 = ${r(q3)},\\quad IQR = ${r(iqr)}` },
                    { description: 'Verdier lenger enn 1,5 kvartilbredder utenfor kvartilene regnes som ekstremverdier.', math: `\\text{nedre} = ${r(q1)} - 1{,}5\\cdot ${r(iqr)} = ${r(lo)},\\quad \\text{øvre} = ${r(q3)} + 1{,}5\\cdot ${r(iqr)} = ${r(hi)}`, note: 'Dette er samme regel som brukes til å tegne prikker utenfor «værhårene» i et boksplott.' },
                    { description: out.length ? `Ekstremverdier: ${out.map(x => `$${r(x)}$`).join(', ')}.` : 'Ingen verdier ligger utenfor grensene.' },
                ],
            };
        },
    },

    // ------------------------------------------------------------ Konvertering
    {
        id: 'module-degrees-radians', title: 'Grader og radianer', category: 'konvertering',
        description: 'Gjør om mellom grader og radianer.',
        icon: '🧭', formula: '180^\\circ=\\pi\\text{ rad}',
        intro: 'Oppgi en vinkel og velg enhet.', button: 'Gjør om',
        fields: [{ name: 'v', label: 'Vinkel' }, { name: 'u', label: 'Enhet', type: 'select', options: [['deg', 'Grader (°)'], ['rad', 'Radianer (rad)']] }],
        run: ({ v, u }) => {
            const deg = u === 'deg' ? v : v * 180 / PI, rad = u === 'deg' ? v * PI / 180 : v;
            let exact = '';
            if (isInt(deg) && deg !== 0) { const g = gcd(Math.abs(deg), 180), nn = deg / g, dd = 180 / g; exact = dd === 1 ? `${nn === 1 ? '' : nn}\\pi` : `\\frac{${nn === 1 ? '' : nn}\\pi}{${dd}}`; }
            const steps = [
                { description: 'En halv omdreining er $180^\\circ$ og samtidig $\\pi$ radianer.', math: '1^\\circ = \\frac{\\pi}{180}\\text{ rad}\\quad\\text{og}\\quad 1\\text{ rad} = \\frac{180^\\circ}{\\pi} \\approx 57{,}3^\\circ', note: 'Radianer måler vinkelen som lengden på buen på enhetssirkelen.' },
                u === 'deg'
                    ? { description: 'Fra grader til radianer.', math: `${r(deg)}^\\circ\\cdot\\frac{\\pi}{180} = ${r(rad, 5)}\\text{ rad}` }
                    : { description: 'Fra radianer til grader.', math: `${r(rad, 5)}\\cdot\\frac{180^\\circ}{\\pi} = ${r(deg, 4)}^\\circ` },
            ];
            if (exact) steps.push({ description: 'Eksakt verdi:', math: `${r(deg)}^\\circ = ${exact}\\text{ rad}` });
            steps.push({ description: `$${r(deg, 4)}^\\circ = ${r(rad, 5)}$ rad.` });
            return { html: `<strong>Grader:</strong> ${r(deg, 4)}°<br><strong>Radianer:</strong> ${r(rad, 5)} rad`, steps };
        },
    },
    {
        id: 'module-roman', title: 'Romertall', category: 'konvertering',
        description: 'Skriv et tall som romertall.',
        icon: 'Ⅻ', formula: 'M\\,D\\,C\\,L\\,X\\,V\\,I',
        intro: 'Oppgi et helt tall fra 1 til 3999.', button: 'Skriv som romertall',
        fields: [{ name: 'n', label: 'Tall', min: 1 }],
        check: (v) => (!isInt(v.n) || v.n < 1 || v.n > 3999 ? 'Oppgi et helt tall mellom 1 og 3999.' : null),
        run: ({ n }) => {
            const T = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
            let m = n, out = '';
            const parts = [];
            for (const [val, sym] of T) { while (m >= val) { out += sym; m -= val; parts.push([val, sym]); } }
            return {
                html: `<strong>${n}</strong> = ${out}`,
                steps: [
                    { description: 'Vi tar alltid det største romertallet som får plass, og trekker det fra.', math: parts.map(([v, s]) => `${v}\\to\\text{${s}}`).join(',\; '), note: 'Når et lite tall står foran et større, trekkes det fra: IV = 5 − 1 = 4, og IX = 10 − 1 = 9.' },
                    { description: `$${n} = \\text{${out}}$` },
                ],
            };
        },
    },
    {
        id: 'module-time-units', title: 'Tidsenheter', category: 'konvertering',
        description: 'Gjør om mellom sekunder, minutter, timer og døgn.',
        icon: '⏱️', formula: '1\\text{ t}=3600\\text{ s}',
        intro: 'Oppgi en tid og velg enhet.', button: 'Gjør om',
        fields: [{ name: 'v', label: 'Tid', min: 0 }, { name: 'u', label: 'Enhet', type: 'select', options: [['s', 'Sekunder'], ['min', 'Minutter'], ['t', 'Timer'], ['d', 'Døgn']] }],
        check: (v) => (v.v < 0 ? 'Tiden kan ikke være negativ.' : null),
        run: ({ v, u }) => {
            const F = { s: 1, min: 60, t: 3600, d: 86400 }, sec = v * F[u];
            let rest = Math.round(sec);
            const d = Math.floor(rest / 86400); rest -= d * 86400;
            const t = Math.floor(rest / 3600); rest -= t * 3600;
            const mi = Math.floor(rest / 60), s = rest - mi * 60;
            return {
                html: `<strong>Sekunder:</strong> ${r(sec, 3)}<br><strong>Minutter:</strong> ${r(sec / 60, 4)}<br><strong>Timer:</strong> ${r(sec / 3600, 4)}<br><strong>Døgn:</strong> ${r(sec / 86400, 5)}<br><strong>Delt opp:</strong> ${d} d ${t} t ${mi} min ${s} s`,
                steps: [
                    { description: 'Vi gjør først om til sekunder.', math: `${r(v)}\\text{ ${u}} = ${r(v)}\\cdot ${F[u]} = ${r(sec, 3)}\\text{ s}`, note: 'Tiden regnes i 60-systemet: 60 s = 1 min, 60 min = 1 t, og 24 t = 1 døgn.' },
                    { description: 'Så deler vi på tallet for hver enhet.', math: `\\frac{${r(sec, 3)}}{60} = ${r(sec / 60, 4)}\\text{ min},\\quad \\frac{${r(sec, 3)}}{3600} = ${r(sec / 3600, 4)}\\text{ t}` },
                    { description: `Delt opp: $${d}$ d $${t}$ t $${mi}$ min $${s}$ s.` },
                ],
            };
        },
    },

    // ------------------------------------------------------------ Grunnleggende
    {
        id: 'module-rounding', title: 'Avrunding', category: 'grunnleggende',
        description: 'Rund av til et antall desimaler eller gjeldende siffer.',
        icon: '🎯', formula: '3{,}14159\\approx 3{,}14',
        intro: 'Oppgi tallet, antall desimaler og antall gjeldende siffer.', button: 'Rund av',
        fields: [{ name: 'x', label: 'Tall' }, { name: 'd', label: 'Antall desimaler', min: 0, value: '2' }, { name: 'sf', label: 'Antall gjeldende siffer', min: 1, value: '3' }],
        check: (v) => (!isInt(v.d) || v.d < 0 || v.d > 12 ? 'Antall desimaler må være et helt tall mellom 0 og 12.' : (!isInt(v.sf) || v.sf < 1 || v.sf > 15 ? 'Antall gjeldende siffer må være et helt tall mellom 1 og 15.' : null)),
        run: ({ x, d, sf }) => {
            const a = Number(x.toFixed(d)), b = Number(x.toPrecision(sf));
            const next = String(Math.abs(x).toFixed(d + 1)).slice(-1);
            return {
                html: `<strong>${d} desimaler:</strong> ${a}<br><strong>${sf} gjeldende siffer:</strong> ${b}`,
                steps: [
                    { description: `Vi ser på sifferet rett etter siste desimal (${d + 1}. desimal). Det er ${next}, så vi ${Number(next) >= 5 ? 'runder opp' : 'runder ned'}.`, math: `${r(x, 10)} \\approx ${a}`, note: '5 eller mer rundes opp, 4 eller mindre rundes ned.' },
                    { description: 'Gjeldende siffer telles fra det første sifferet som ikke er 0.', math: `${r(x, 10)} \\approx ${b}\\quad(${sf}\\text{ gjeldende siffer})` },
                    { description: `$${a}$ med ${d} desimaler og $${b}$ med ${sf} gjeldende siffer.` },
                ],
            };
        },
    },
    {
        id: 'module-fibonacci', title: 'Fibonacci-tall', category: 'grunnleggende',
        description: 'Finn ledd nummer n og se rekken.',
        icon: '🐚', formula: 'F_n=F_{n-1}+F_{n-2}',
        intro: 'Oppgi hvilket ledd du vil finne (1–70).', button: 'Finn Fibonacci-tall',
        fields: [{ name: 'n', label: 'Ledd nummer (n)', min: 1 }],
        check: (v) => (!isInt(v.n) || v.n < 1 || v.n > 70 ? 'Oppgi et helt tall mellom 1 og 70.' : null),
        run: ({ n }) => {
            const F = [0, 1];
            for (let i = 2; i <= n; i++) F.push(F[i - 1] + F[i - 2]);
            const shown = F.slice(1, Math.min(n, 15) + 1);
            const phiG = (1 + Math.sqrt(5)) / 2;
            return {
                html: `<strong>F<sub>${n}</sub> =</strong> ${F[n].toLocaleString('nb-NO')}`,
                steps: [
                    { description: 'Hvert tall er summen av de to foregående, og rekken starter med 1 og 1.', math: shown.join(',\; ') + (n > 15 ? ',\; \\dots' : ''), note: 'Forholdet mellom to nabotall nærmer seg det gylne snitt, ca. 1,618.' },
                    { description: 'Forholdet mellom ledd n og ledd n − 1.', math: n > 1 ? `\\frac{F_{${n}}}{F_{${n - 1}}} = ${r(F[n] / F[n - 1], 6)} \\approx \\varphi = ${r(phiG, 6)}` : '\\varphi \\approx 1{,}618034' },
                    { description: `$F_{${n}} = ${F[n]}$` },
                ],
            };
        },
    },
];
