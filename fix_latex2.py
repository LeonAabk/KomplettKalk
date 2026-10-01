import re

with open('index.html', 'r') as f:
    html = f.read()

# I see KaTeX needs rendering after dynamic text changes, or maybe it needs backslash escaping
html = html.replace('Skriv inn koeffisienter for $f(x) = \\frac{ax+b}{cx+d}$', 'Skriv inn koeffisienter for \\( f(x) = \\frac{ax+b}{cx+d} \\)')
html = html.replace('Løs ligningen $\\frac{a}{x} = \\frac{b}{c}$', 'Løs ligningen \\( \\frac{a}{x} = \\frac{b}{c} \\)')

with open('index.html', 'w') as f:
    f.write(html)
