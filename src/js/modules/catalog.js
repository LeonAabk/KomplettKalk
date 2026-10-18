/**
 * Katalog med flere kalkulatorer, definert som data.
 * Hvert emne: { id, title, category, description, icon, formula, intro, button, fields, check?, run }
 *  - fields: [{ name, label, type?: 'number'|'text'|'select', min?, options?, value? }]
 *  - check(v): returnerer feilmelding (streng) eller null
 *  - run(v): returnerer { html, steps }  (steps følger vanlig steg-format; siste steg = resultat)
 * UI-et (src/js/ui/catalog-ui.js) bygger skjema, resultat og utregning ut fra denne listen.
 */

/** Runder av og fjerner flyttallsstøy. */
const r = (n, d = 4) => { const v = Number(n.toFixed(d)); return Object.is(v, -0) ? 0 : v; };
const PI = Math.PI;
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const isInt = (n) => Number.isInteger(n);

const posAll = (v, names, msg = 'Alle verdier må være større enn 0.') =>
    names.some(n => !(v[n] > 0)) ? msg : null;

export const catalog = [
    // ------------------------------------------------------------ Geometri
    {
        id: 'module-circle', title: 'Sirkel', category: 'geometri',
        description: 'Omkrets, areal og diameter ut fra radius.',
        icon: '⭕', formula: 'A=\\pi r^2',
        intro: 'Oppgi radius, så regner vi ut diameter, omkrets og areal.',
        button: 'Beregn sirkel',
        fields: [{ name: 'r', label: 'Radius (r)', min: 0 }],
        check: (v) => posAll(v, ['r'], 'Radius må være større enn 0.'),
        run: ({ r: rad }) => {
            const d = 2 * rad, O = 2 * PI * rad, A = PI * rad * rad;
            return {
                html: `<strong>Omkrets:</strong> ${r(O)}<br><strong>Areal:</strong> ${r(A)}<br><strong>Diameter:</strong> ${r(d)}`,
                steps: [
                    { description: 'Diameteren er dobbelt så lang som radius.', math: `d = 2r = 2 \\cdot ${r(rad)} = ${r(d)}` },
                    { description: 'Omkretsen er lengden rundt sirkelen.', math: `O = 2\\pi r = 2 \\cdot \\pi \\cdot ${r(rad)} \\approx ${r(O)}`,
                      note: 'π ≈ 3,14159 er forholdet mellom omkrets og diameter for alle sirkler.' },
                    { description: 'Arealet er flaten inni sirkelen. Radius kvadreres.', math: `A = \\pi r^2 = \\pi \\cdot ${r(rad)}^2 \\approx ${r(A)}`,
                      note: 'Dobler du radiusen, blir arealet fire ganger så stort.' },
                    { description: `Omkrets $\\approx ${r(O)}$, areal $\\approx ${r(A)}$ og diameter $= ${r(d)}$.` },
                ],
            };
        },
    },
    {
        id: 'module-triangle-heron', title: 'Trekantens areal (tre sider)', category: 'geometri',
        description: 'Areal av en trekant når du kjenner alle tre sidene (Herons formel).',
        icon: '🔺', formula: 'A=\\sqrt{s(s-a)(s-b)(s-c)}',
        intro: 'Oppgi de tre sidene. Vi bruker Herons formel.',
        button: 'Beregn areal',
        fields: [{ name: 'a', label: 'Side a', min: 0 }, { name: 'b', label: 'Side b', min: 0 }, { name: 'c', label: 'Side c', min: 0 }],
        check: (v) => posAll(v, ['a', 'b', 'c']) ||
            (v.a + v.b <= v.c || v.a + v.c <= v.b || v.b + v.c <= v.a ? 'Disse sidene kan ikke danne en trekant. Summen av to sider må være større enn den tredje.' : null),
        run: ({ a, b, c }) => {
            const s = (a + b + c) / 2;
            const A = Math.sqrt(s * (s - a) * (s - b) * (s - c));
            return {
                html: `<strong>Areal:</strong> ${r(A)}`,
                steps: [
                    { description: 'Først finner vi halve omkretsen $s$.', math: `s = \\frac{a+b+c}{2} = \\frac{${r(a)}+${r(b)}+${r(c)}}{2} = ${r(s)}` },
                    { description: 'Setter inn i Herons formel.', math: `A = \\sqrt{s(s-a)(s-b)(s-c)} = \\sqrt{${r(s)}\\cdot ${r(s - a)}\\cdot ${r(s - b)}\\cdot ${r(s - c)}}`,
                      note: 'Herons formel passer når du ikke kjenner høyden i trekanten.' },
                    { description: `Arealet er $A \\approx ${r(A)}$.` },
                ],
            };
        },
    },
    {
        id: 'module-cylinder', title: 'Sylinder', category: 'geometri',
        description: 'Volum og overflate av en sylinder.',
        icon: '🥫', formula: 'V=\\pi r^2 h',
        intro: 'Oppgi radius og høyde.', button: 'Beregn sylinder',
        fields: [{ name: 'r', label: 'Radius (r)', min: 0 }, { name: 'h', label: 'Høyde (h)', min: 0 }],
        check: (v) => posAll(v, ['r', 'h']),
        run: ({ r: rad, h }) => {
            const base = PI * rad * rad, V = base * h, mantel = 2 * PI * rad * h, O = 2 * base + mantel;
            return {
                html: `<strong>Volum:</strong> ${r(V)}<br><strong>Overflate:</strong> ${r(O)}`,
                steps: [
                    { description: 'Grunnflaten er en sirkel.', math: `G = \\pi r^2 = \\pi \\cdot ${r(rad)}^2 \\approx ${r(base)}` },
                    { description: 'Volumet er grunnflate ganger høyde.', math: `V = G \\cdot h = ${r(base)} \\cdot ${r(h)} \\approx ${r(V)}`,
                      note: 'Alle prismer og sylindre har volum = grunnflate · høyde.' },
                    { description: 'Mantelflaten er et rektangel som er rullet sammen: omkrets ganger høyde.', math: `M = 2\\pi r h \\approx ${r(mantel)}` },
                    { description: 'Overflaten er to grunnflater pluss mantelen.', math: `O = 2G + M \\approx ${r(O)}` },
                    { description: `Volum $\\approx ${r(V)}$ og overflate $\\approx ${r(O)}$.` },
                ],
            };
        },
    },
    {
        id: 'module-sphere', title: 'Kule', category: 'geometri',
        description: 'Volum og overflate av en kule.',
        icon: '⚽', formula: 'V=\\frac{4}{3}\\pi r^3',
        intro: 'Oppgi radius.', button: 'Beregn kule',
        fields: [{ name: 'r', label: 'Radius (r)', min: 0 }],
        check: (v) => posAll(v, ['r'], 'Radius må være større enn 0.'),
        run: ({ r: rad }) => {
            const V = 4 / 3 * PI * rad ** 3, O = 4 * PI * rad * rad;
            return {
                html: `<strong>Volum:</strong> ${r(V)}<br><strong>Overflate:</strong> ${r(O)}`,
                steps: [
                    { description: 'Volumet av en kule.', math: `V = \\frac{4}{3}\\pi r^3 = \\frac{4}{3}\\pi \\cdot ${r(rad)}^3 \\approx ${r(V)}`,
                      note: 'Radiusen står i tredje potens fordi volum måles i tre dimensjoner.' },
                    { description: 'Overflaten av en kule.', math: `O = 4\\pi r^2 = 4\\pi \\cdot ${r(rad)}^2 \\approx ${r(O)}` },
                    { description: `Volum $\\approx ${r(V)}$ og overflate $\\approx ${r(O)}$.` },
                ],
            };
        },
    },
    {
        id: 'module-cone', title: 'Kjegle', category: 'geometri',
        description: 'Volum, skrå side og overflate av en kjegle.',
        icon: '🍦', formula: 'V=\\frac{1}{3}\\pi r^2 h',
        intro: 'Oppgi radius og høyde.', button: 'Beregn kjegle',
        fields: [{ name: 'r', label: 'Radius (r)', min: 0 }, { name: 'h', label: 'Høyde (h)', min: 0 }],
        check: (v) => posAll(v, ['r', 'h']),
        run: ({ r: rad, h }) => {
            const V = PI * rad * rad * h / 3, s = Math.hypot(rad, h), O = PI * rad * rad + PI * rad * s;
            return {
                html: `<strong>Volum:</strong> ${r(V)}<br><strong>Skrå side:</strong> ${r(s)}<br><strong>Overflate:</strong> ${r(O)}`,
                steps: [
                    { description: 'Volumet er en tredjedel av en sylinder med samme grunnflate og høyde.', math: `V = \\frac{1}{3}\\pi r^2 h \\approx ${r(V)}` },
                    { description: 'Den skrå siden finner vi med Pytagoras.', math: `s = \\sqrt{r^2 + h^2} = \\sqrt{${r(rad)}^2 + ${r(h)}^2} \\approx ${r(s)}`,
                      note: 'Radius, høyde og skrå side danner en rettvinklet trekant.' },
                    { description: 'Overflaten er grunnflaten pluss mantelen.', math: `O = \\pi r^2 + \\pi r s \\approx ${r(O)}` },
                    { description: `Volum $\\approx ${r(V)}$, skrå side $\\approx ${r(s)}$ og overflate $\\approx ${r(O)}$.` },
                ],
            };
        },
    },
    {
        id: 'module-trapezoid', title: 'Trapes', category: 'geometri',
        description: 'Areal av et trapes ut fra to parallelle sider og høyde.',
        icon: '⏢', formula: 'A=\\frac{(a+b)h}{2}',
        intro: 'Oppgi de to parallelle sidene og høyden.', button: 'Beregn areal',
        fields: [{ name: 'a', label: 'Parallell side a', min: 0 }, { name: 'b', label: 'Parallell side b', min: 0 }, { name: 'h', label: 'Høyde (h)', min: 0 }],
        check: (v) => posAll(v, ['a', 'b', 'h']),
        run: ({ a, b, h }) => {
            const A = (a + b) * h / 2;
            return {
                html: `<strong>Areal:</strong> ${r(A)}`,
                steps: [
                    { description: 'Arealet er gjennomsnittet av de parallelle sidene ganger høyden.', math: `A = \\frac{(a+b)\\cdot h}{2} = \\frac{(${r(a)}+${r(b)})\\cdot ${r(h)}}{2}`,
                      note: 'To like trapes satt sammen blir et parallellogram med grunnlinje a + b.' },
                    { description: `Arealet er $A = ${r(A)}$.` },
                ],
            };
        },
    },
    {
        id: 'module-polygon', title: 'Mangekant (vinkler)', category: 'geometri',
        description: 'Vinkelsum, diagonaler og vinkel i en regulær mangekant.',
        icon: '⬠', formula: 'S=(n-2)\\cdot 180^\\circ',
        intro: 'Oppgi antall hjørner (minst 3).', button: 'Beregn vinkler',
        fields: [{ name: 'n', label: 'Antall hjørner (n)', min: 3 }],
        check: (v) => (!isInt(v.n) || v.n < 3 ? 'Antall hjørner må være et helt tall på minst 3.' : null),
        run: ({ n }) => {
            const S = (n - 2) * 180, each = S / n, diag = n * (n - 3) / 2;
            return {
                html: `<strong>Vinkelsum:</strong> ${r(S)}°<br><strong>Hver vinkel (regulær):</strong> ${r(each)}°<br><strong>Diagonaler:</strong> ${diag}`,
                steps: [
                    { description: 'En mangekant kan deles i $n-2$ trekanter, og hver trekant har vinkelsum $180^\\circ$.', math: `S = (n-2)\\cdot 180^\\circ = (${n}-2)\\cdot 180^\\circ = ${r(S)}^\\circ` },
                    { description: 'I en regulær mangekant er alle vinklene like store.', math: `v = \\frac{S}{n} = \\frac{${r(S)}^\\circ}{${n}} = ${r(each)}^\\circ` },
                    { description: 'Antall diagonaler: hvert hjørne har $n-3$ diagonaler, og hver telles to ganger.', math: `D = \\frac{n(n-3)}{2} = ${diag}` },
                    { description: `Vinkelsum $${r(S)}^\\circ$, hver vinkel $${r(each)}^\\circ$ og $${diag}$ diagonaler.` },
                ],
            };
        },
    },
    {
        id: 'module-distance', title: 'Avstand og midtpunkt', category: 'geometri',
        description: 'Avstand, midtpunkt og stigningstall mellom to punkter.',
        icon: '📍', formula: 'd=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}',
        intro: 'Oppgi koordinatene til to punkter.', button: 'Beregn',
        fields: [{ name: 'x1', label: 'x₁' }, { name: 'y1', label: 'y₁' }, { name: 'x2', label: 'x₂' }, { name: 'y2', label: 'y₂' }],
        run: ({ x1, y1, x2, y2 }) => {
            const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy);
            const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
            const steps = [
                { description: 'Avstanden følger av Pytagoras: vannrett og loddrett forskjell er to kateter.', math: `d = \\sqrt{(${r(x2)}-${r(x1)})^2 + (${r(y2)}-${r(y1)})^2} = \\sqrt{${r(dx * dx)} + ${r(dy * dy)}} \\approx ${r(d)}` },
                { description: 'Midtpunktet er gjennomsnittet av koordinatene.', math: `M = \\left(\\frac{${r(x1)}+${r(x2)}}{2},\; \\frac{${r(y1)}+${r(y2)}}{2}\\right) = (${r(mx)},\; ${r(my)})` },
            ];
            let slope = 'loddrett linje (ingen stigning)';
            if (dx !== 0) {
                const a = dy / dx;
                slope = String(r(a));
                steps.push({ description: 'Stigningstallet er endring i $y$ delt på endring i $x$.', math: `a = \\frac{y_2-y_1}{x_2-x_1} = \\frac{${r(dy)}}{${r(dx)}} = ${r(a)}` });
            }
            steps.push({ description: `Avstand $\\approx ${r(d)}$, midtpunkt $(${r(mx)},\; ${r(my)})$.` });
            return { html: `<strong>Avstand:</strong> ${r(d)}<br><strong>Midtpunkt:</strong> (${r(mx)}, ${r(my)})<br><strong>Stigningstall:</strong> ${slope}`, steps };
        },
    },

    // ------------------------------------------------------------ Algebra
    {
        id: 'module-arith-seq', title: 'Aritmetisk rekke', category: 'algebra',
        description: 'Ledd nummer n og summen av de n første leddene.',
        icon: '➕', formula: 'a_n=a_1+(n-1)d',
        intro: 'Oppgi første ledd, differansen og antall ledd.', button: 'Beregn rekke',
        fields: [{ name: 'a1', label: 'Første ledd (a₁)' }, { name: 'd', label: 'Differanse (d)' }, { name: 'n', label: 'Antall ledd (n)', min: 1 }],
        check: (v) => (!isInt(v.n) || v.n < 1 ? 'Antall ledd må være et helt tall på minst 1.' : null),
        run: ({ a1, d, n }) => {
            const an = a1 + (n - 1) * d, S = n * (a1 + an) / 2;
            return {
                html: `<strong>Ledd nr. ${n}:</strong> ${r(an)}<br><strong>Sum:</strong> ${r(S)}`,
                steps: [
                    { description: 'Hvert ledd øker med den samme differansen $d$.', math: `a_n = a_1 + (n-1)d = ${r(a1)} + (${n}-1)\\cdot ${r(d)} = ${r(an)}` },
                    { description: 'Summen er antall ledd ganger gjennomsnittet av første og siste ledd.', math: `S_n = \\frac{n(a_1+a_n)}{2} = \\frac{${n}\\cdot(${r(a1)}+${r(an)})}{2} = ${r(S)}`,
                      note: 'Gauss brukte dette: 1 + 2 + … + 100 = 100 · 101 / 2 = 5050.' },
                    { description: `Ledd nr. $${n}$ er $${r(an)}$ og summen er $${r(S)}$.` },
                ],
            };
        },
    },
    {
        id: 'module-geom-seq', title: 'Geometrisk rekke', category: 'algebra',
        description: 'Ledd nummer n og summen når hvert ledd ganges med k.',
        icon: '✖️', formula: 'a_n=a_1\\cdot k^{n-1}',
        intro: 'Oppgi første ledd, kvotienten og antall ledd.', button: 'Beregn rekke',
        fields: [{ name: 'a1', label: 'Første ledd (a₁)' }, { name: 'k', label: 'Kvotient (k)' }, { name: 'n', label: 'Antall ledd (n)', min: 1 }],
        check: (v) => (!isInt(v.n) || v.n < 1 ? 'Antall ledd må være et helt tall på minst 1.' : null),
        run: ({ a1, k, n }) => {
            const an = a1 * k ** (n - 1);
            const S = k === 1 ? a1 * n : a1 * (k ** n - 1) / (k - 1);
            const steps = [
                { description: 'Hvert ledd er forrige ledd ganget med kvotienten $k$.', math: `a_n = a_1 \\cdot k^{n-1} = ${r(a1)}\\cdot ${r(k)}^{${n - 1}} = ${r(an)}` },
            ];
            steps.push(k === 1
                ? { description: 'Alle leddene er like, så summen er enkel.', math: `S_n = n\\cdot a_1 = ${r(S)}` }
                : { description: 'Summen av en geometrisk rekke.', math: `S_n = a_1\\cdot\\frac{k^n-1}{k-1} = ${r(a1)}\\cdot\\frac{${r(k)}^{${n}}-1}{${r(k)}-1} = ${r(S)}`,
                    note: 'Formelen gjelder alle k ≠ 1, også negative k.' });
            steps.push({ description: `Ledd nr. $${n}$ er $${r(an)}$ og summen er $${r(S)}$.` });
            return { html: `<strong>Ledd nr. ${n}:</strong> ${r(an)}<br><strong>Sum:</strong> ${r(S)}`, steps };
        },
    },
    {
        id: 'module-gcd-lcm', title: 'SFF og MFM', category: 'algebra',
        description: 'Største felles faktor og minste felles multiplum.',
        icon: '🔗', formula: '\\gcd(a,b)\\cdot\\mathrm{lcm}(a,b)=a\\cdot b',
        intro: 'Oppgi to positive heltall.', button: 'Beregn',
        fields: [{ name: 'a', label: 'Tall a', min: 1 }, { name: 'b', label: 'Tall b', min: 1 }],
        check: (v) => (!isInt(v.a) || !isInt(v.b) || v.a < 1 || v.b < 1 ? 'Begge tallene må være positive heltall.' : null),
        run: ({ a, b }) => {
            const steps = [{ description: 'Vi bruker Euklids algoritme: del det største tallet på det minste og ta resten, helt til resten er 0.' }];
            let x = Math.max(a, b), y = Math.min(a, b);
            while (y !== 0) {
                const q = Math.floor(x / y), rest = x % y;
                steps.push({ description: '', math: `${x} = ${q}\\cdot ${y} + ${rest}` });
                [x, y] = [y, rest];
            }
            const g = x, l = a / g * b;
            steps[1].note = 'Den siste resten som ikke er 0, er største felles faktor.';
            steps.push({ description: 'Minste felles multiplum finner vi fra sammenhengen mellom SFF og MFM.', math: `\\mathrm{MFM} = \\frac{a\\cdot b}{\\mathrm{SFF}} = \\frac{${a}\\cdot ${b}}{${g}} = ${l}` });
            steps.push({ description: `SFF$(${a},${b}) = ${g}$ og MFM$(${a},${b}) = ${l}$.` });
            return { html: `<strong>SFF:</strong> ${g}<br><strong>MFM:</strong> ${l}`, steps };
        },
    },
    {
        id: 'module-prime-factors', title: 'Primtallsfaktorisering', category: 'algebra',
        description: 'Skriv et helt tall som et produkt av primtall.',
        icon: '🧮', formula: 'n=p_1^{a}\\cdot p_2^{b}\\cdots',
        intro: 'Oppgi et helt tall på minst 2 (opp til 1 000 000 000).', button: 'Faktoriser',
        fields: [{ name: 'n', label: 'Tall (n)', min: 2 }],
        check: (v) => (!isInt(v.n) || v.n < 2 || v.n > 1e9 ? 'Oppgi et helt tall mellom 2 og 1 000 000 000.' : null),
        run: ({ n }) => {
            let m = n;
            const f = new Map(), steps = [];
            for (let p = 2; p * p <= m; p += p === 2 ? 1 : 2) {
                while (m % p === 0) {
                    steps.push({ description: '', math: `${m} \\div ${p} = ${m / p}` });
                    f.set(p, (f.get(p) || 0) + 1);
                    m /= p;
                }
            }
            if (m > 1) { f.set(m, (f.get(m) || 0) + 1); steps.push({ description: '', math: `${m}\\text{ er et primtall}` }); }
            const prod = [...f].map(([p, e]) => (e > 1 ? `${p}^{${e}}` : `${p}`)).join('\\cdot ');
            const isPrime = f.size === 1 && [...f.values()][0] === 1;
            const intro = { description: 'Vi deler på det minste primtallet som går opp, om og om igjen.' };
            if (steps[0]) steps[0].note = 'Vi trenger bare å prøve primtall opp til kvadratroten av tallet.';
            return {
                html: isPrime ? `<strong>${n}</strong> er et primtall` : `<strong>${n}</strong> = ${[...f].map(([p, e]) => (e > 1 ? `${p}<sup>${e}</sup>` : p)).join(' · ')}`,
                steps: [intro, ...steps, { description: isPrime ? `$${n}$ er et primtall.` : `$${n} = ${prod}$` }],
            };
        },
    },
    {
        id: 'module-line-two-points', title: 'Linje gjennom to punkter', category: 'algebra',
        description: 'Finn likningen y = ax + b når du kjenner to punkter.',
        icon: '↗️', formula: 'a=\\frac{y_2-y_1}{x_2-x_1}',
        intro: 'Oppgi to punkter på linjen.', button: 'Finn likningen',
        fields: [{ name: 'x1', label: 'x₁' }, { name: 'y1', label: 'y₁' }, { name: 'x2', label: 'x₂' }, { name: 'y2', label: 'y₂' }],
        check: (v) => (v.x1 === v.x2 ? (v.y1 === v.y2 ? 'Punktene er like. Oppgi to ulike punkter.' : `Linjen er loddrett: x = ${r(v.x1)}. Den kan ikke skrives som y = ax + b.`) : null),
        run: ({ x1, y1, x2, y2 }) => {
            const a = (y2 - y1) / (x2 - x1), b = y1 - a * x1;
            const eq = `y = ${r(a)}x ${b >= 0 ? '+' : '-'} ${r(Math.abs(b))}`;
            return {
                html: `<strong>Likning:</strong> ${eq}`,
                steps: [
                    { description: 'Stigningstallet er endring i $y$ delt på endring i $x$.', math: `a = \\frac{${r(y2)}-${r(y1)}}{${r(x2)}-${r(x1)}} = ${r(a)}` },
                    { description: 'Setter ett av punktene inn i $y = ax + b$ og løser for $b$.', math: `${r(y1)} = ${r(a)}\\cdot ${r(x1)} + b \;\\Rightarrow\; b = ${r(b)}`,
                      note: 'Du får samme b uansett hvilket av de to punktene du bruker.' },
                    { description: `Likningen er $${eq}$.` },
                ],
            };
        },
    },

    // ------------------------------------------------------------ Økonomi
    {
        id: 'module-savings-monthly', title: 'Månedlig sparing', category: 'okonomi',
        description: 'Hvor mye får du ved å spare et fast beløp hver måned?',
        icon: '🐷', formula: 'S=m\\cdot\\frac{(1+r)^n-1}{r}',
        intro: 'Oppgi månedlig sparebeløp, årlig rente og antall år. Renten legges til hver måned.', button: 'Beregn sparing',
        fields: [{ name: 'm', label: 'Sparebeløp per måned (kr)', min: 0 }, { name: 'rate', label: 'Årlig rente (%)' }, { name: 'years', label: 'Antall år', min: 0 }],
        check: (v) => (v.m < 0 || v.years < 0 ? 'Beløp og antall år kan ikke være negative.' : (v.rate <= -100 ? 'Renten må være over −100 %.' : null)),
        run: ({ m, rate, years }) => {
            const n = Math.round(years * 12), i = rate / 100 / 12;
            const S = i === 0 ? m * n : m * ((1 + i) ** n - 1) / i;
            const paid = m * n;
            return {
                html: `<strong>Sluttbeløp:</strong> ${S.toFixed(2)} kr<br><strong>Innbetalt:</strong> ${paid.toFixed(2)} kr<br><strong>Renter:</strong> ${(S - paid).toFixed(2)} kr`,
                steps: [
                    { description: 'Vi regner med månedlig rente og antall måneder.', math: `r = \\frac{${r(rate)}\\%}{12} = ${r(i * 100, 5)}\\%,\\quad n = ${n}\\text{ måneder}` },
                    { description: 'Summen av alle innskudd med rentes rente.', math: i === 0 ? `S = m\\cdot n = ${r(S, 2)}` : `S = m\\cdot\\frac{(1+r)^n-1}{r} = ${r(m)}\\cdot\\frac{(1+${r(i, 6)})^{${n}}-1}{${r(i, 6)}} = ${r(S, 2)}`,
                      note: 'Hvert innskudd får rente fra den måneden det settes inn. Det tidligste innskuddet vokser mest.' },
                    { description: `Innbetalt: $${r(paid, 2)}$ kr. Renter: $${r(S - paid, 2)}$ kr.` },
                    { description: `Sluttbeløpet er $${r(S, 2)}$ kr.` },
                ],
            };
        },
    },

    // ------------------------------------------------------------ Fysikk
    {
        id: 'module-ohms-law', title: 'Ohms lov', category: 'fysikk',
        description: 'Finn spenning, strøm eller motstand. La ett felt stå tomt.',
        icon: '🔌', formula: 'U=R\\cdot I',
        intro: 'Fyll inn to av tre verdier. La den du vil finne stå tom.', button: 'Beregn',
        fields: [{ name: 'U', label: 'Spenning U (V)', optional: true }, { name: 'I', label: 'Strøm I (A)', optional: true }, { name: 'R', label: 'Motstand R (Ω)', optional: true }],
        check: (v) => {
            const missing = ['U', 'I', 'R'].filter(k => v[k] === null);
            if (missing.length !== 1) return 'Fyll inn nøyaktig to felt og la ett stå tomt.';
            const m = missing[0];
            if (m === 'U') return null;
            const other = m === 'I' ? 'R' : 'I';
            return v[other] === 0 || (m === 'I' && v.R <= 0) ? 'Motstanden må være større enn 0.' : (m === 'R' && v.I === 0 ? 'Strømmen kan ikke være 0.' : null);
        },
        run: ({ U, I, R }) => {
            if (U === null) { const u = I * R; return { html: `<strong>Spenning:</strong> ${r(u)} V`, steps: [{ description: 'Ohms lov gir spenningen direkte.', math: `U = R\\cdot I = ${r(R)}\\cdot ${r(I)} = ${r(u)}\\text{ V}`, note: 'Spenning er det som «dytter» strømmen gjennom motstanden.' }, { description: `Spenningen er $${r(u)}$ V.` }] }; }
            if (I === null) { const i = U / R; return { html: `<strong>Strøm:</strong> ${r(i)} A`, steps: [{ description: 'Løser Ohms lov for strøm.', math: `I = \\frac{U}{R} = \\frac{${r(U)}}{${r(R)}} = ${r(i)}\\text{ A}` }, { description: `Strømmen er $${r(i)}$ A.` }] }; }
            const res = U / I;
            return { html: `<strong>Motstand:</strong> ${r(res)} Ω`, steps: [{ description: 'Løser Ohms lov for motstand.', math: `R = \\frac{U}{I} = \\frac{${r(U)}}{${r(I)}} = ${r(res)}\;\\Omega` }, { description: `Motstanden er $${r(res)}$ Ω.` }] };
        },
    },
    {
        id: 'module-free-fall', title: 'Fritt fall', category: 'fysikk',
        description: 'Falltid og sluttfart når noe slippes fra en høyde.',
        icon: '🪂', formula: 'h=\\frac{1}{2}gt^2',
        intro: 'Oppgi fallhøyde i meter. Vi ser bort fra luftmotstand og bruker g = 9,81 m/s².', button: 'Beregn fall',
        fields: [{ name: 'h', label: 'Høyde (m)', min: 0 }],
        check: (v) => posAll(v, ['h'], 'Høyden må være større enn 0.'),
        run: ({ h }) => {
            const g = 9.81, t = Math.sqrt(2 * h / g), vv = g * t;
            return {
                html: `<strong>Falltid:</strong> ${r(t, 2)} s<br><strong>Sluttfart:</strong> ${r(vv, 2)} m/s (${r(vv * 3.6, 1)} km/t)`,
                steps: [
                    { description: 'Fallet starter i ro, så $h = \\frac{1}{2}gt^2$. Vi løser for tiden.', math: `t = \\sqrt{\\frac{2h}{g}} = \\sqrt{\\frac{2\\cdot ${r(h)}}{9{,}81}} \\approx ${r(t, 3)}\\text{ s}`,
                      note: 'Tyngre ting faller ikke raskere uten luftmotstand. Massen går ut av regnestykket.' },
                    { description: 'Farten øker jevnt med $g$.', math: `v = g\\cdot t = 9{,}81\\cdot ${r(t, 3)} \\approx ${r(vv, 2)}\\text{ m/s}` },
                    { description: `Falltid $\\approx ${r(t, 2)}$ s og sluttfart $\\approx ${r(vv, 2)}$ m/s.` },
                ],
            };
        },
    },

    // ------------------------------------------------------------ Statistikk
    {
        id: 'module-quartiles', title: 'Kvartiler', category: 'statistikk',
        description: 'Nedre og øvre kvartil, kvartilbredde og ytterpunkter.',
        icon: '📦', formula: 'IQR=Q_3-Q_1',
        intro: 'Skriv inn tall adskilt med komma eller mellomrom (minst 4).', button: 'Beregn kvartiler',
        fields: [{ name: 'list', label: 'Tall', type: 'text', placeholder: 'f.eks. 3, 5, 7, 8, 12, 13, 14' }],
        parse: 'list',
        check: (v) => (v.list.length < 4 ? 'Skriv inn minst fire tall.' : null),
        run: ({ list }) => {
            const xs = [...list].sort((p, q) => p - q), n = xs.length;
            const med = (a) => (a.length % 2 ? a[(a.length - 1) / 2] : (a[a.length / 2 - 1] + a[a.length / 2]) / 2);
            const lower = xs.slice(0, Math.floor(n / 2)), upper = xs.slice(Math.ceil(n / 2));
            const q1 = med(lower), q2 = med(xs), q3 = med(upper);
            return {
                html: `<strong>Q₁:</strong> ${r(q1)} &nbsp; <strong>Median:</strong> ${r(q2)} &nbsp; <strong>Q₃:</strong> ${r(q3)}<br><strong>Kvartilbredde:</strong> ${r(q3 - q1)}`,
                steps: [
                    { description: 'Sorterer tallene i stigende rekkefølge.', math: xs.map(x => r(x)).join(',\; ') },
                    { description: 'Medianen deler tallene i to like store halvdeler.', math: `Q_2 = ${r(q2)}`,
                      note: 'Ved et odde antall tall regnes medianen ikke med i noen av halvdelene.' },
                    { description: 'Nedre kvartil er medianen i nedre halvdel, og øvre kvartil er medianen i øvre halvdel.', math: `Q_1 = ${r(q1)},\\quad Q_3 = ${r(q3)}` },
                    { description: 'Kvartilbredden viser hvor langt fra hverandre de midterste 50 % av tallene ligger.', math: `IQR = Q_3 - Q_1 = ${r(q3)} - ${r(q1)} = ${r(q3 - q1)}` },
                    { description: `$Q_1 = ${r(q1)}$, median $= ${r(q2)}$, $Q_3 = ${r(q3)}$ og kvartilbredde $= ${r(q3 - q1)}$.` },
                ],
            };
        },
    },
    {
        id: 'module-zscore', title: 'Z-score', category: 'statistikk',
        description: 'Hvor mange standardavvik en verdi ligger fra gjennomsnittet.',
        icon: '📊', formula: 'z=\\frac{x-\\mu}{\\sigma}',
        intro: 'Oppgi verdien, gjennomsnittet og standardavviket.', button: 'Beregn z',
        fields: [{ name: 'x', label: 'Verdi (x)' }, { name: 'mu', label: 'Gjennomsnitt (μ)' }, { name: 'sigma', label: 'Standardavvik (σ)', min: 0 }],
        check: (v) => posAll(v, ['sigma'], 'Standardavviket må være større enn 0.'),
        run: ({ x, mu, sigma }) => {
            const z = (x - mu) / sigma;
            const txt = Math.abs(z) < 0.05 ? 'omtrent lik gjennomsnittet' : `${r(Math.abs(z), 2)} standardavvik ${z > 0 ? 'over' : 'under'} gjennomsnittet`;
            return {
                html: `<strong>z:</strong> ${r(z, 3)}<br>${txt}`,
                steps: [
                    { description: 'Vi trekker fra gjennomsnittet og deler på standardavviket.', math: `z = \\frac{x-\\mu}{\\sigma} = \\frac{${r(x)}-${r(mu)}}{${r(sigma)}} = ${r(z, 3)}`,
                      note: 'Z-score gjør at du kan sammenligne verdier fra ulike fordelinger.' },
                    { description: `Verdien ligger ${txt}.` },
                ],
            };
        },
    },

    // ------------------------------------------------------------ Konvertering
    {
        id: 'module-temperature', title: 'Temperatur', category: 'konvertering',
        description: 'Gjør om mellom Celsius, Fahrenheit og Kelvin.',
        icon: '🌡️', formula: '^\\circ F=\\frac{9}{5}\\,^\\circ C+32',
        intro: 'Oppgi en temperatur og velg enhet.', button: 'Gjør om',
        fields: [
            { name: 'value', label: 'Temperatur' },
            { name: 'unit', label: 'Fra enhet', type: 'select', options: [['C', 'Celsius (°C)'], ['F', 'Fahrenheit (°F)'], ['K', 'Kelvin (K)']] },
        ],
        check: (v) => {
            const c = v.unit === 'C' ? v.value : v.unit === 'F' ? (v.value - 32) * 5 / 9 : v.value - 273.15;
            return c < -273.15 ? 'Det finnes ingen temperatur under det absolutte nullpunktet (−273,15 °C).' : null;
        },
        run: ({ value, unit }) => {
            const c = unit === 'C' ? value : unit === 'F' ? (value - 32) * 5 / 9 : value - 273.15;
            const f = c * 9 / 5 + 32, k = c + 273.15;
            const steps = [];
            if (unit === 'F') steps.push({ description: 'Først til Celsius.', math: `^\\circ C = (^\\circ F - 32)\\cdot\\frac{5}{9} = (${r(value)}-32)\\cdot\\frac{5}{9} = ${r(c, 2)}` });
            if (unit === 'K') steps.push({ description: 'Først til Celsius.', math: `^\\circ C = K - 273{,}15 = ${r(c, 2)}` });
            if (unit !== 'F') steps.push({ description: 'Til Fahrenheit.', math: `^\\circ F = ^\\circ C\\cdot\\frac{9}{5} + 32 = ${r(c, 2)}\\cdot\\frac{9}{5} + 32 = ${r(f, 2)}`, note: 'Vann fryser ved 0 °C = 32 °F og koker ved 100 °C = 212 °F.' });
            if (unit !== 'K') steps.push({ description: 'Til Kelvin.', math: `K = ^\\circ C + 273{,}15 = ${r(k, 2)}` });
            steps.push({ description: `$${r(c, 2)}\\,^\\circ C = ${r(f, 2)}\\,^\\circ F = ${r(k, 2)}\\,K$` });
            return { html: `<strong>Celsius:</strong> ${r(c, 2)} °C<br><strong>Fahrenheit:</strong> ${r(f, 2)} °F<br><strong>Kelvin:</strong> ${r(k, 2)} K`, steps };
        },
    },
    {
        id: 'module-number-base', title: 'Tallsystemer', category: 'konvertering',
        description: 'Gjør om mellom titallsystemet, totallsystemet og heksadesimalt.',
        icon: '💻', formula: '13_{10}=1101_2',
        intro: 'Oppgi et positivt heltall i titallsystemet.', button: 'Gjør om',
        fields: [{ name: 'n', label: 'Tall (titallsystemet)', min: 0 }],
        check: (v) => (!isInt(v.n) || v.n < 0 || v.n > 1e12 ? 'Oppgi et helt tall mellom 0 og 1 000 000 000 000.' : null),
        run: ({ n }) => {
            const bin = n.toString(2), hex = n.toString(16).toUpperCase(), oct = n.toString(8);
            const steps = [{ description: 'For å gjøre om til totallsystemet deler vi på 2 om og om igjen og leser restene nedenfra og opp.' }];
            let m = n;
            if (m === 0) steps.push({ description: '', math: '0 \\div 2 = 0 \\text{ rest } 0' });
            while (m > 0 && steps.length < 41) { steps.push({ description: '', math: `${m} \\div 2 = ${Math.floor(m / 2)}\\text{ rest }${m % 2}` }); m = Math.floor(m / 2); }
            if (steps[1]) steps[1].note = 'Restene, lest fra bunnen og opp, er sifrene i totallet.';
            steps.push({ description: `Heksadesimalt (16 sifre: 0–9 og A–F) og oktalt får vi på samme måte.`, math: `${n}_{10} = ${bin}_2 = ${oct}_8 = ${hex}_{16}` });
            steps.push({ description: `$${n}_{10} = ${bin}_2$` });
            return { html: `<strong>Binært:</strong> ${bin}<br><strong>Oktalt:</strong> ${oct}<br><strong>Heksadesimalt:</strong> ${hex}`, steps };
        },
    },
];
