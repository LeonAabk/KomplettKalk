export const functionData = [
    {
        id: 'module-quadratic',
        title: 'Andregradsfunksjon',
        category: 'algebra',
        description: 'Beregn topp/bunnpunkt, røtter og se trinnvis utregning.',
        icon: '📈',
        formula: 'f(x)=ax^2+bx+c'
    },
    {
        id: 'module-linear',
        title: 'Lineær funksjon',
        category: 'algebra',
        description: 'Analyser og tegn lineære funksjoner y = ax + b.',
        icon: '📏',
        formula: 'y=ax+b'
    },
    {
        id: 'module-percent',
        title: 'Prosent',
        category: 'grunnleggende',
        description: 'Hvor mange prosent er X av Y?',
        icon: '％',
        formula: '\\frac{x}{y}\\cdot 100\\%'
    },
    {
        id: 'module-percent-change',
        title: 'Prosentendring',
        category: 'grunnleggende',
        description: 'Beregn den prosentvise økningen eller nedgangen.',
        icon: '📉',
        formula: '\\frac{N-G}{G}\\cdot 100\\%'
    },
    {
        id: 'module-pythagoras',
        title: 'Pytagoras',
        category: 'geometri',
        description: 'Finn hypotenus eller katet i en rettvinklet trekant.',
        icon: '📐',
        formula: 'a^2+b^2=c^2'
    },
    {
        id: 'module-area',
        title: 'Areal (2D-figurer)',
        category: 'geometri',
        description: 'Beregn arealet av sirkler, rektangler og trekanter.',
        icon: '🟢',
        formula: 'A=\\pi r^2'
    },
    {
        id: 'module-trig',
        title: 'Trigonometri (Rettvinklet)',
        category: 'geometri',
        description: 'Finn ukjente sider ved hjelp av Sinus, Cosinus og Tangens.',
        icon: '🔺',
        formula: '\\sin v=\\frac{k}{h}'
    },
    {
        id: 'module-abc',
        title: 'ABC-formelen',
        category: 'algebra',
        description: 'Finn røttene (nullpunktene) trinnvis med formelen.',
        icon: '🧮',
        formula: 'x=\\frac{-b\\pm\\sqrt{\\Delta}}{2a}'
    },
    {
        id: 'module-vertex',
        title: 'Topp/Bunnpunkt',
        category: 'algebra',
        description: 'Finn x- og y-koordinaten til ekstremalpunktet.',
        icon: '🏔️',
        formula: 'x_T=\\frac{-b}{2a}'
    },
    {
        id: 'module-power',
        title: 'Potensregning',
        category: 'grunnleggende',
        description: 'Beregn potenser med grunntall og eksponent.',
        icon: '🚀',
        formula: 'a^m\\cdot a^n=a^{m+n}'
    },
    {
        id: 'module-sqrt',
        title: 'Kvadratrot',
        category: 'grunnleggende',
        description: 'Regn ut og forenkle kvadratrøtter.',
        icon: '√',
        formula: '\\sqrt{x}'
    },
    {
        id: 'module-mean',
        title: 'Gjennomsnitt',
        category: 'statistikk',
        description: 'Regn ut summen delt på antall for en liste med tall.',
        icon: '📊',
        formula: '\\bar{x}=\\frac{\\sum x}{n}'
    },
    {
        id: 'module-median',
        title: 'Median',
        category: 'statistikk',
        description: 'Finn det midterste tallet i en sortert liste.',
        icon: '⚖️',
        formula: '2,\\ 4,\\ \\mathbf{7},\\ 9,\\ 12'
    },
    {
        id: 'module-mode-range',
        title: 'Typetall & Variasjonsbredde',
        category: 'statistikk',
        description: 'Finn tallet som forekommer oftest og bredden i dataene.',
        icon: '🎯',
        formula: '\\max-\\min'
    },
    {
        id: 'module-eq-system',
        title: 'To Ukjente',
        category: 'algebra',
        description: 'Løs et likningssett med x og y trinnvis.',
        icon: '✖️',
        formula: '\\begin{cases}x+y=5\\\\x-y=1\\end{cases}'
    },
    {
        id: 'module-factoring',
        title: 'Faktorisering',
        category: 'algebra',
        description: 'Faktoriser andregradsuttrykk med nullpunkter.',
        icon: '🧩',
        formula: '(x-p)(x-q)'
    },
    {
        id: 'module-volume',
        title: 'Volum (3D-figurer)',
        category: 'geometri',
        description: 'Beregn volumet av sylinder, kube eller kule.',
        icon: '🧊',
        formula: 'V=\\pi r^2h'
    },
    {
        id: 'module-surface-area',
        title: 'Overflateareal',
        category: 'geometri',
        description: 'Beregn overflateareal av kule, sylinder eller kjegle.',
        icon: '🌐',
        formula: 'O=4\\pi r^2'
    },
    {
        id: 'module-fractions',
        title: 'Brøkregning',
        category: 'grunnleggende',
        description: 'Pluss, minus, gange eller dele brøker med fellesnevner.',
        icon: '➗',
        formula: '\\frac{a}{b}+\\frac{c}{d}'
    },
    {
        id: 'module-compound-interest',
        title: 'Rentesrente',
        category: 'okonomi',
        description: 'Beregn sluttbeløp over tid med renters rente.',
        icon: '📈',
        formula: 'B\\cdot(1+r)^t'
    },
    {
        id: 'module-vat',
        title: 'MVA-kalkulator',
        category: 'okonomi',
        description: 'Legg til eller trekk fra merverdiavgift.',
        icon: '💰',
        formula: 'p\\cdot 1{,}25'
    },
    {
        id: 'module-unit-conversion',
        title: 'Enhetskonvertering',
        category: 'konvertering',
        description: 'Konverter mellom lengde, areal og volum.',
        icon: '🔄',
        formula: '1\\,\\text{km}=1000\\,\\text{m}'
    },
    {
        id: 'module-symmetry-line',
        title: 'Symmetrilinje',
        category: 'algebra',
        description: 'Finn symmetrilinjen til en parabel x = -b/2a.',
        icon: '📉',
        formula: 'x=\\frac{x_1+x_2}{2}'
    },
    {
        id: 'module-linear-root',
        title: 'Nullpunkt (Lineær)',
        category: 'algebra',
        description: 'Løs ax + b = 0 trinnvis.',
        icon: '📏',
        formula: 'x=\\frac{-b}{a}'
    },
    {
        id: 'module-average-rate',
        title: 'Gjennomsnittlig Vekstfart',
        category: 'algebra',
        description: 'Finn stigningstallet mellom to punkter på en graf.',
        icon: '📈',
        formula: '\\frac{f(b)-f(a)}{b-a}'
    },
    {
        id: 'module-similarity',
        title: 'Formlikhet',
        category: 'geometri',
        description: 'Finn manglende sider i formlike trekanter.',
        icon: '📐',
        formula: '\\frac{a}{A}=\\frac{b}{B}'
    },
    {
        id: 'module-physics-speed',
        title: 'Fart, Strekning, Tid',
        category: 'fysikk',
        description: 'Regn ut fart, strekning eller tid når to av tre er kjent.',
        icon: '⚡',
        formula: 'v=\\frac{s}{t}'
    },
    {
        id: 'module-physics-density',
        title: 'Massetetthet',
        category: 'fysikk',
        description: 'Regn ut massetetthet gitt masse og volum.',
        icon: '⚖️',
        formula: '\\rho=\\frac{m}{V}'
    },
    {
        id: 'module-prob-npr',
        title: 'Kombinatorikk (Ordnet)',
        category: 'sannsynlighet',
        description: 'nPr: Ordnet utvalg uten tilbakelegging.',
        icon: '🎲',
        formula: '{}_nP_r=\\frac{n!}{(n-r)!}'
    },
    {
        id: 'module-prob-ncr',
        title: 'Kombinatorikk (Uordnet)',
        category: 'sannsynlighet',
        description: 'nCr: Uordnet utvalg uten tilbakelegging.',
        icon: '🎱',
        formula: '\\binom{n}{r}'
    },
    {
        id: 'module-binomial',
        title: 'Binomisk Sannsynlighet',
        category: 'sannsynlighet',
        description: 'Beregn sannsynligheten P(X=k) for binomiske forsøk.',
        icon: '🎯',
        formula: '\\binom{n}{k}p^kq^{n-k}'
    },
    {
        id: 'module-econ-markup',
        title: 'Varekalkyle',
        category: 'okonomi',
        description: 'Regn ut selvkost og utsalgspris fra inntakskost, frakt og avanse.',
        icon: '📈',
        formula: 'S=K\\cdot(1+m)'
    },
    {
        id: 'module-depreciation',
        title: 'Avskrivning (Saldoskjema)',
        category: 'okonomi',
        description: 'Beregn verditapet for første år med saldoskjema.',
        icon: '📉',
        formula: 'V_t=V_0(1-r)^t'
    },
    {
        id: 'module-annuity-loan',
        title: 'Annuitetslån',
        category: 'okonomi',
        description: 'Finn terminbeløpet trinnvis med formelen for annuitetslån.',
        icon: '💳',
        formula: 'T=L\\cdot\\frac{r}{1-(1+r)^{-n}}'
    },
    {
        id: 'module-geom-sector',
        title: 'Sirkelsektor',
        category: 'geometri',
        description: 'Areal og buelengde av en sirkelsektor.',
        icon: '🍕',
        formula: 'A=\\frac{v}{360}\\pi r^2'
    },
    {
        id: 'module-alg-log10',
        title: 'Tierlogaritme',
        category: 'algebra',
        description: 'Løs log10(x) og vis potenssammenheng.',
        icon: '🔢',
        formula: '\\lg 1000=3'
    }
,
    {
        id: 'module-asymptotes',
        title: 'Asymptoter (Rasjonell)',
        category: 'algebra',
        description: 'Finn loddrett og vannrett asymptote for (ax+b)/(cx+d).',
        icon: '📈',
        formula: 'f(x)=\\frac{1}{x-2}'
    },
    {
        id: 'module-rational-eq',
        title: 'Rasjonal Ligning',
        category: 'algebra',
        description: 'Løs a/x = b/c med kryssmultiplikasjon.',
        icon: '✖️',
        formula: '\\frac{x}{2}=\\frac{3}{x+1}'
    },
    {
        id: 'module-congruence',
        title: 'Kongruens (Trekant)',
        category: 'geometri',
        description: 'Sjekk om to trekanter er kongruente (SSS, SAS, ASA).',
        icon: '📐',
        formula: '\\triangle ABC\\cong\\triangle DEF'
    },
    {
        id: 'module-triangle-solver',
        title: 'Trekantløseren',
        category: 'geometri',
        description: 'Finn ukjente sider eller vinkler med sinus- og cosinussetningen.',
        icon: '🔺',
        formula: '\\frac{a}{\\sin A}=\\frac{b}{\\sin B}'
    },
    {
        id: 'module-currency',
        title: 'Valutakalkulator',
        category: 'okonomi',
        description: 'Gjør om mellom valutaer med en gitt kurs.',
        icon: '💱',
        formula: 'B\\cdot k'
    },
    {
        id: 'module-salary-tax',
        title: 'Lønn og Skatt',
        category: 'okonomi',
        description: 'Regn ut nettolønn fra bruttolønn og skattetrekk.',
        icon: '💸',
        formula: 'L_{\\text{netto}}=L-S'
    },
    {
        id: 'module-mech-energy',
        title: 'Mekanisk Energi',
        category: 'fysikk',
        description: 'Beregn kinetisk og potensiell energi.',
        icon: '⚡',
        formula: 'E=\\tfrac12mv^2+mgh'
    },
    {
        id: 'module-exponential',
        title: 'Eksponentiell funksjon',
        category: 'algebra',
        description: 'Bruk formelen f(x) = a * b^x.',
        icon: '📈',
        formula: 'f(x)=a\\cdot b^x'
    },
    {
        id: 'module-proportionality',
        title: 'Proporsjonalitet',
        category: 'algebra',
        description: 'Finn proporsjonalitetskonstanten k.',
        icon: '📏',
        formula: 'y=k\\cdot x'
    },
    {
        id: 'module-stddev',
        title: 'Standardavvik og Varians',
        category: 'statistikk',
        description: 'Beregn standardavvik og varians for en rekke tall.',
        icon: '📊',
        formula: '\\sigma=\\sqrt{\\frac{\\sum(x-\\bar{x})^2}{n}}'
    },
    {
        id: 'module-newton2',
        title: 'Newtons 2. lov',
        category: 'fysikk',
        description: 'F = ma. Beregn kraft, masse eller akselerasjon.',
        icon: '⚡',
        formula: 'F=m\\cdot a'
    },
    {
        id: 'module-work-power',
        title: 'Arbeid og Effekt',
        category: 'fysikk',
        description: 'Beregn arbeid (W) og effekt (P).',
        icon: '⚡',
        formula: 'W=F\\cdot s'
    },
    {
        id: 'module-speed-conversion',
        title: 'Fartskonvertering',
        category: 'konvertering',
        description: 'Konverter mellom km/h og m/s.',
        icon: '🔄',
        formula: '\\text{m/s}\\cdot 3{,}6=\\text{km/h}'
    }
];

/** Visningsnavn for kategorier (brukes i sidemeny og på emnekort). */
export const CATEGORY_NAMES = {
    algebra: 'Algebra',
    geometri: 'Geometri',
    grunnleggende: 'Grunnleggende',
    okonomi: 'Økonomi',
    konvertering: 'Konvertering',
    statistikk: 'Statistikk',
    fysikk: 'Fysikk',
    sannsynlighet: 'Sannsynlighet'
};
