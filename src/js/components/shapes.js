/**
 * Statiske geometriske figurer (SVG) for geometri-modulene.
 * Samme prinsipp som graph.js: ingen bibliotek, farger via CSS-variabler.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

function svgEl(name, attrs = {}, text) {
    const node = document.createElementNS(SVG_NS, name);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
    if (text !== undefined) node.textContent = text;
    return node;
}

function fmt(n) {
    if (!Number.isFinite(n)) return '?';
    const v = Math.round(n * 100) / 100;
    return (Object.is(v, -0) ? 0 : v).toString().replace('-', '−');
}

function mount(container, svg, label) {
    container.setAttribute('role', 'img');
    container.setAttribute('aria-label', label);
    container.replaceChildren(svg);
}

function newSvg(container) {
    const w = Math.max(Math.round(container.clientWidth) || 280, 160);
    const h = Math.max(Math.round(container.clientHeight) || 220, 140);
    const svg = svgEl('svg', { viewBox: `0 0 ${w} ${h}`, width: w, height: h });
    return { svg, w, h };
}

/**
 * Rettvinklet trekant for Pytagoras.
 * @param {HTMLElement} container
 * @param {{a:number,b:number,c:number,missing:'a'|'b'|'c'}} data - lengder (c er alltid hypotenusen)
 */
export function renderRightTriangle(container, { a, b, c, missing }) {
    if (!container || !(a > 0) || !(b > 0) || !(c > 0)) return;
    const { svg, w, h } = newSvg(container);

    const pad = 44;
    const scale = Math.min((w - pad * 2.2) / b, (h - pad * 1.6) / a);
    const bx = b * scale;
    const ay = a * scale;

    const x0 = Math.max((w - bx) / 2, 58); // plass til a-etiketten til venstre
    const y0 = (h - ay) / 2 + ay; // bunn (rett vinkel-hjørnet)
    const P = { x: x0, y: y0 };           // rett vinkel
    const Pb = { x: x0 + bx, y: y0 };     // ende av katet b (bunn, høyre)
    const Pa = { x: x0, y: y0 - ay };     // ende av katet a (topp, venstre)

    const cls = (side) => 'shape-side' + (side === missing ? ' shape-side-result' : '');

    svg.appendChild(svgEl('path', {
        class: 'shape-fill',
        d: `M ${P.x} ${P.y} L ${Pb.x} ${Pb.y} L ${Pa.x} ${Pa.y} Z`
    }));

    // Rett vinkel-markør
    const rs = 14;
    svg.appendChild(svgEl('path', {
        class: 'shape-right-angle',
        d: `M ${P.x} ${P.y - rs} L ${P.x + rs} ${P.y - rs} L ${P.x + rs} ${P.y}`
    }));

    svg.appendChild(svgEl('line', { class: cls('b'), x1: P.x, y1: P.y, x2: Pb.x, y2: Pb.y }));
    svg.appendChild(svgEl('line', { class: cls('a'), x1: P.x, y1: P.y, x2: Pa.x, y2: Pa.y }));
    svg.appendChild(svgEl('line', { class: cls('c'), x1: Pa.x, y1: Pa.y, x2: Pb.x, y2: Pb.y }));

    svg.appendChild(svgEl('text', {
        class: 'shape-label' + (missing === 'b' ? ' shape-label-result' : ''),
        x: (P.x + Pb.x) / 2, y: P.y + 20, 'text-anchor': 'middle'
    }, `b = ${fmt(b)}`));
    svg.appendChild(svgEl('text', {
        class: 'shape-label' + (missing === 'a' ? ' shape-label-result' : ''),
        x: P.x - 10, y: (P.y + Pa.y) / 2, 'text-anchor': 'end'
    }, `a = ${fmt(a)}`));
    svg.appendChild(svgEl('text', {
        class: 'shape-label' + (missing === 'c' ? ' shape-label-result' : ''),
        x: (Pa.x + Pb.x) / 2 + 10, y: (Pa.y + Pb.y) / 2 - 6, 'text-anchor': 'start'
    }, `c = ${fmt(c)}`));

    mount(container, svg, `Rettvinklet trekant. Katet a = ${fmt(a)}, katet b = ${fmt(b)}, hypotenus c = ${fmt(c)}.`);
}
