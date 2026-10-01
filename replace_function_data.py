import re

with open('src/js/utils/functionData.js', 'r') as f:
    content = f.read()

new_modules = """    {
        id: 'module-asymptotes',
        title: 'Asymptoter (Rasjonell)',
        category: 'algebra',
        description: 'Finn loddrett og vannrett asymptote for (ax+b)/(cx+d).',
        icon: '📈'
    },
    {
        id: 'module-rational-eq',
        title: 'Rasjonal Ligning',
        category: 'algebra',
        description: 'Løs a/x = b/c med kryssmultiplikasjon.',
        icon: '✖️'
    },
    {
        id: 'module-congruence',
        title: 'Kongruens (Trekant)',
        category: 'geometri',
        description: 'Sjekk om to trekanter er kongruente (SSS, SAS, ASA).',
        icon: '📐'
    },
    {
        id: 'module-triangle-solver',
        title: 'Trekantløseren',
        category: 'geometri',
        description: 'Finn ukjente sider eller vinkler med sinus- og cosinussetningen.',
        icon: '🔺'
    },
    {
        id: 'module-currency',
        title: 'Valutakalkulator',
        category: 'okonomi',
        description: 'Gjør om mellom valutaer med en gitt kurs.',
        icon: '💱'
    },
    {
        id: 'module-salary-tax',
        title: 'Lønn og Skatt',
        category: 'okonomi',
        description: 'Regn ut nettolønn fra bruttolønn og skattetrekk.',
        icon: '💸'
    },
    {
        id: 'module-mech-energy',
        title: 'Mekanisk Energi',
        category: 'fysikk',
        description: 'Beregn kinetisk og potensiell energi.',
        icon: '⚡'
    }
];"""

content = re.sub(r'\];', ',\n' + new_modules, content)

with open('src/js/utils/functionData.js', 'w') as f:
    f.write(content)
