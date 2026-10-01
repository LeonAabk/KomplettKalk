import re

with open('index.html', 'r') as f:
    html = f.read()

# Fix unrendered math in asymptotes text
html = html.replace('Skriv inn koeffisienter for $f(x) = \frac{ax+b}{cx+d}$', 'Skriv inn koeffisienter for \\( f(x) = \\frac{ax+b}{cx+d} \\)')

# While we're at it, let's fix other modules' inline math description as well for rational eq
html = html.replace('Løs ligningen $\frac{a}{x} = \frac{b}{c}$', 'Løs ligningen \\( \\frac{a}{x} = \\frac{b}{c} \\)')

with open('index.html', 'w') as f:
    f.write(html)
