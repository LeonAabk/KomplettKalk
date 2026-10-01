import re

with open('index.html', 'r') as f:
    html = f.read()

html = html.replace(r'\( f(x) = \frac{ax+b}{cx+d} \)', r'<em>f(x) = (ax+b)/(cx+d)</em>')
html = html.replace(r'\( \frac{a}{x} = \frac{b}{c} \)', r'<em>a/x = b/c</em>')

with open('index.html', 'w') as f:
    f.write(html)
