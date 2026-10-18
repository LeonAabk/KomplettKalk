/**
 * Graf-komponent (ren SVG – ingen eksterne biblioteker).
 *
 * Fordeler framfor et canvas-bibliotek:
 *  - skarp på alle skjermer, og tegner seg på nytt når containeren endrer størrelse
 *  - farger styres av CSS-variabler, så lys/mørk modus virker uten ny tegning
 *  - punkter (topp/bunn, nullpunkt, skjæring med y-aksen) merkes direkte i grafen,
 *    slik at man ikke trenger å "hovre" for å finne dem på mobil
 *  - berøring/mus: dra over grafen for å lese av (x, y) på kurven
 */

const SVG_NS = 'http://www.w3.org/2000/svg';
const MINUS = '−';

/** Tilstand per container, så vi kan tegne på nytt ved resize. */
const states = new WeakMap();
const observers = new WeakMap();
let uid = 0;

/* ------------------------------------------------------------------ */
/* Offentlig API                                                       */
/* ------------------------------------------------------------------ */

/**
 * Tegner et tomt koordinatsystem (rutenett og akser).
 * @param {HTMLElement} container - Elementet grafen skal tegnes i
 */
export function renderEmptyGraph(container) {
    if (!container) return;
    setState(container, { empty: true });
}

/**
 * Tegner en graf.
 *
 * @param {HTMLElement} container - Elementet grafen skal tegnes i
 * @param {Array<{x:number,y:number}>} dataPoints - Punkter på kurven (sortert på x)
 * @param {{x:number,y:number,type:string}|null} vertex - Topp-/bunnpunkt
 * @param {number[]|null} roots - Nullpunkter (x-verdier)
 * @param {Object} [extras]
 * @param {number} [extras.yIntercept] - y-verdi der grafen skjærer y-aksen
 * @param {boolean} [extras.symmetry] - tegn symmetrilinje gjennom toppunktet
 * @param {(x:number)=>number} [extras.fn] - eksakt funksjon, brukes ved avlesning
 * @param {string} [extras.name] - navn på funksjonen, brukes i tilgjengelighetsteksten
 */
export function renderGraph(container, dataPoints, vertex, roots, extras = {}) {
    if (!container) return;
    setState(container, {
        empty: false,
        points: (dataPoints || []).filter(p => Number.isFinite(p.x) && Number.isFinite(p.y)),
        vertex: vertex || null,
        roots: (roots || []).filter(Number.isFinite),
        extras: extras || {}
    });
}

/** Fjerner grafen og viser tomt koordinatsystem. */
export function clearGraph(container) {
    renderEmptyGraph(container);
}

/* ------------------------------------------------------------------ */
/* Tilstand og resize                                                  */
/* ------------------------------------------------------------------ */

function setState(container, state) {
    states.set(container, state);

    if (!observers.has(container) && typeof ResizeObserver !== 'undefined') {
        let frame = 0;
        const ro = new ResizeObserver(() => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => draw(container));
        });
        ro.observe(container);
        observers.set(container, ro);
    }

    draw(container);
}

/* ------------------------------------------------------------------ */
/* Hjelpefunksjoner                                                    */
/* ------------------------------------------------------------------ */

function svgEl(name, attrs = {}, text) {
    const node = document.createElementNS(SVG_NS, name);
    for (const [key, value] of Object.entries(attrs)) {
        node.setAttribute(key, value);
    }
    if (text !== undefined) node.textContent = text;
    return node;
}

/** Formaterer et tall kort og lesbart (maks `digits` desimaler, ekte minustegn). */
function fmt(n, digits = 2) {
    if (!Number.isFinite(n)) return '–';
    const factor = 10 ** digits;
    let rounded = Math.round(n * factor) / factor;
    if (Object.is(rounded, -0) || Math.abs(rounded) < 1e-12) rounded = 0;
    let s = Math.abs(rounded) >= 1e6 || (rounded !== 0 && Math.abs(rounded) < 1e-4)
        ? rounded.toExponential(2)
        : String(rounded);
    return s.replace('-', MINUS);
}

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/** Pene tick-verdier (1, 2, 5 × 10^k) innenfor [min, max]. */
function niceTicks(min, max, target = 6) {
    const span = max - min;
    if (!(span > 0)) return { ticks: [min], step: 1 };

    const raw = span / target;
    const pow = 10 ** Math.floor(Math.log10(raw));
    const f = raw / pow;
    const step = (f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10) * pow;

    const ticks = [];
    const first = Math.ceil(min / step - 1e-9) * step;
    for (let v = first; v <= max + step * 1e-9; v += step) {
        ticks.push(Math.abs(v) < step * 1e-9 ? 0 : Number(v.toFixed(10)));
    }
    return { ticks, step };
}

function decimalsForStep(step) {
    return clamp(-Math.floor(Math.log10(step) + 1e-9), 0, 6);
}

function quantile(sorted, q) {
    const pos = (sorted.length - 1) * q;
    const lo = Math.floor(pos);
    const hi = Math.ceil(pos);
    return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

/** Finner passende x- og y-område for grafen. */
function computeDomain(state) {
    if (state.empty) {
        return { xMin: -10, xMax: 10, yMin: -10, yMax: 10, dataXMin: -10, dataXMax: 10 };
    }

    const { points, vertex, roots, extras } = state;
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);

    let xMin = xs.length ? Math.min(...xs) : -10;
    let xMax = xs.length ? Math.max(...xs) : 10;
    const dataXMin = xMin;
    const dataXMax = xMax;

    let yMin = ys.length ? Math.min(...ys) : -10;
    let yMax = ys.length ? Math.max(...ys) : 10;

    // Funksjoner som skyter i været (f.eks. 1/x): bruk et robust utsnitt av y
    if (ys.length > 10) {
        const sorted = [...ys].sort((a, b) => a - b);
        const lo = quantile(sorted, 0.02);
        const hi = quantile(sorted, 0.98);
        if (yMax - yMin > 30 * Math.max(hi - lo, 1e-9)) {
            yMin = lo;
            yMax = hi;
        }
    }

    // Ta alltid med de interessante punktene
    const keyPoints = [];
    if (vertex) keyPoints.push({ x: vertex.x, y: vertex.y });
    roots.forEach(r => keyPoints.push({ x: r, y: 0 }));
    if (Number.isFinite(extras.yIntercept)) keyPoints.push({ x: 0, y: extras.yIntercept });
    keyPoints.forEach(p => {
        xMin = Math.min(xMin, p.x);
        xMax = Math.max(xMax, p.x);
        yMin = Math.min(yMin, p.y);
        yMax = Math.max(yMax, p.y);
    });

    // Ta med origo hvis den ligger nær nok til at det hjelper orienteringen
    const includeZero = (min, max) => {
        const span = max - min || 1;
        if (min > 0 && min < span) min = 0;
        if (max < 0 && -max < span) max = 0;
        return [min, max];
    };
    [xMin, xMax] = includeZero(xMin, xMax);
    [yMin, yMax] = includeZero(yMin, yMax);

    const pad = (min, max) => {
        let span = max - min;
        if (!(span > 0)) {
            span = Math.abs(min) || 2;
            return [min - span / 2, max + span / 2];
        }
        return [min - span * 0.08, max + span * 0.08];
    };
    [xMin, xMax] = pad(xMin, xMax);
    [yMin, yMax] = pad(yMin, yMax);

    return { xMin, xMax, yMin, yMax, dataXMin, dataXMax };
}

/** Lager en kort beskrivelse for skjermlesere. */
function describe(state) {
    if (state.empty) return 'Tomt koordinatsystem. Skriv inn en funksjon for å tegne en graf.';
    const parts = [`Graf av ${state.extras.name || 'funksjonen'}.`];
    if (state.vertex) parts.push(`${state.vertex.type} i (${fmt(state.vertex.x)}, ${fmt(state.vertex.y)}).`);
    if (state.roots.length) parts.push(`Nullpunkt: ${state.roots.map(r => 'x = ' + fmt(r)).join(', ')}.`);
    else if (state.vertex) parts.push('Ingen nullpunkter.');
    if (Number.isFinite(state.extras.yIntercept)) parts.push(`Skjærer y-aksen i (0, ${fmt(state.extras.yIntercept)}).`);
    return parts.join(' ');
}

/* ------------------------------------------------------------------ */
/* Tegning                                                             */
/* ------------------------------------------------------------------ */

function draw(container) {
    const state = states.get(container);
    if (!state) return;

    const w = Math.round(container.clientWidth);
    const h = Math.round(container.clientHeight);
    if (w < 60 || h < 60) return; // skjult (f.eks. lukket bunnark) – tegnes på nytt når den vises

    const dom = computeDomain(state);
    const { xMin, xMax, yMin, yMax } = dom;

    const xTicks = niceTicks(xMin, xMax, w < 360 ? 5 : 7);
    const yTicks = niceTicks(yMin, yMax, h < 260 ? 4 : 6);
    const yDecimals = decimalsForStep(yTicks.step);
    const xDecimals = decimalsForStep(xTicks.step);
    const yLabels = yTicks.ticks.map(v => fmt(v, yDecimals));
    const longest = yLabels.reduce((m, s) => Math.max(m, s.length), 2);

    const m = { l: clamp(12 + longest * 6.6, 32, 70), r: 14, t: 16, b: 26 };
    const pw = w - m.l - m.r;
    const ph = h - m.t - m.b;
    const sx = x => m.l + ((x - xMin) / (xMax - xMin)) * pw;
    const sy = y => m.t + (1 - (y - yMin) / (yMax - yMin)) * ph;

    const axisY = clamp(sy(0), m.t, m.t + ph); // x-aksens vertikale posisjon
    const axisX = clamp(sx(0), m.l, m.l + pw); // y-aksens horisontale posisjon
    const originVisible = xMin <= 0 && xMax >= 0 && yMin <= 0 && yMax >= 0;

    const svg = svgEl('svg', {
        viewBox: `0 0 ${w} ${h}`,
        width: w,
        height: h,
        role: 'img',
        'aria-label': describe(state)
    });
    svg.appendChild(svgEl('title', {}, describe(state)));

    const clipId = `graph-clip-${++uid}`;
    const defs = svgEl('defs');
    defs.appendChild(svgEl('clipPath', { id: clipId }))
        .appendChild(svgEl('rect', { x: m.l, y: m.t, width: pw, height: ph }));
    svg.appendChild(defs);

    // Rutenett
    const grid = svgEl('g');
    xTicks.ticks.forEach(v => {
        const x = sx(v);
        grid.appendChild(svgEl('line', { class: 'g-grid', x1: x, y1: m.t, x2: x, y2: m.t + ph }));
    });
    yTicks.ticks.forEach(v => {
        const y = sy(v);
        grid.appendChild(svgEl('line', { class: 'g-grid', x1: m.l, y1: y, x2: m.l + pw, y2: y }));
    });
    svg.appendChild(grid);

    // Akser med piler
    const axes = svgEl('g');
    axes.appendChild(svgEl('line', { class: 'g-axis', x1: m.l, y1: axisY, x2: m.l + pw, y2: axisY }));
    axes.appendChild(svgEl('line', { class: 'g-axis', x1: axisX, y1: m.t + ph, x2: axisX, y2: m.t }));
    axes.appendChild(svgEl('path', {
        class: 'g-arrow',
        d: `M ${m.l + pw + 4} ${axisY} l -8 -4 l 0 8 Z`
    }));
    axes.appendChild(svgEl('path', {
        class: 'g-arrow',
        d: `M ${axisX} ${m.t - 4} l -4 8 l 8 0 Z`
    }));
    svg.appendChild(axes);

    // Tallene langs aksene. Rektanglene huskes slik at punktetiketter unngår dem.
    const taken = [];
    const ticksG = svgEl('g');
    const tickY = Math.min(axisY + 14, h - 6);
    xTicks.ticks.forEach(v => {
        if (v === 0 && originVisible) return;
        const label = fmt(v, xDecimals);
        const x = sx(v);
        const half = label.length * 3.6;
        taken.push({ x1: x - half, y1: tickY - 11, x2: x + half, y2: tickY + 3 });
        ticksG.appendChild(svgEl('text', {
            class: 'g-tick', x, y: tickY, 'text-anchor': 'middle'
        }, label));
    });
    yTicks.ticks.forEach((v, i) => {
        if (v === 0 && originVisible) return;
        const y = sy(v);
        taken.push({ x1: axisX - 8 - yLabels[i].length * 6.6, y1: y - 8, x2: axisX - 4, y2: y + 7 });
        ticksG.appendChild(svgEl('text', {
            class: 'g-tick', x: axisX - 6, y: y + 4, 'text-anchor': 'end'
        }, yLabels[i]));
    });
    if (originVisible) {
        taken.push({ x1: axisX - 18, y1: axisY + 2, x2: axisX - 4, y2: axisY + 17 });
        ticksG.appendChild(svgEl('text', {
            class: 'g-tick', x: axisX - 6, y: axisY + 14, 'text-anchor': 'end'
        }, '0'));
    }
    taken.push({ x1: m.l + pw - 14, y1: axisY - 20, x2: m.l + pw, y2: axisY - 2 });
    taken.push({ x1: axisX + 4, y1: m.t, x2: axisX + 18, y2: m.t + 14 });
    ticksG.appendChild(svgEl('text', {
        class: 'g-axis-title', x: m.l + pw - 4, y: axisY - 8, 'text-anchor': 'end'
    }, 'x'));
    ticksG.appendChild(svgEl('text', {
        class: 'g-axis-title', x: axisX + 8, y: m.t + 10, 'text-anchor': 'start'
    }, 'y'));
    svg.appendChild(ticksG);

    if (state.empty) {
        mount(container, svg, describe(state));
        return;
    }

    // Kurve og symmetrilinje (klippes til tegneområdet)
    const plot = svgEl('g', { 'clip-path': `url(#${clipId})` });

    if (state.vertex && state.extras.symmetry) {
        const x = sx(state.vertex.x);
        plot.appendChild(svgEl('line', { class: 'g-sym', x1: x, y1: m.t, x2: x, y2: m.t + ph }));
    }

    const path = buildPath(state.points, sx, sy, ph);
    if (path) plot.appendChild(svgEl('path', { class: 'g-curve', d: path }));
    svg.appendChild(plot);

    // Markerte punkter
    const marked = [];
    if (state.vertex) {
        marked.push({
            kind: 'vertex', x: state.vertex.x, y: state.vertex.y,
            label: `${state.vertex.type} (${fmt(state.vertex.x)}, ${fmt(state.vertex.y)})`
        });
    }
    state.roots.forEach(r => marked.push({ kind: 'root', x: r, y: 0, label: `x = ${fmt(r)}` }));
    if (Number.isFinite(state.extras.yIntercept)) {
        const y0 = state.extras.yIntercept;
        const duplicate = marked.some(p => Math.abs(p.x) < 1e-9 && Math.abs(p.y - y0) < 1e-9);
        if (!duplicate) marked.push({ kind: 'yint', x: 0, y: y0, label: `(0, ${fmt(y0)})` });
    }

    const markers = svgEl('g');
    const labelsG = svgEl('g');
    const visible = marked.filter(p => p.x >= xMin && p.x <= xMax && p.y >= yMin && p.y <= yMax);
    visible.forEach(p => {
        const cx = sx(p.x);
        const cy = sy(p.y);
        taken.push({ x1: cx - 9, y1: cy - 9, x2: cx + 9, y2: cy + 9 });

        if (p.kind === 'vertex') {
            markers.appendChild(svgEl('path', {
                class: 'g-pt g-pt-vertex', d: `M ${cx} ${cy - 8} L ${cx + 8} ${cy} L ${cx} ${cy + 8} L ${cx - 8} ${cy} Z`
            }));
        } else if (p.kind === 'yint') {
            markers.appendChild(svgEl('rect', {
                class: 'g-pt g-pt-yint', x: cx - 5.5, y: cy - 5.5, width: 11, height: 11, rx: 2
            }));
        } else {
            markers.appendChild(svgEl('circle', { class: 'g-pt g-pt-root', cx, cy, r: 6 }));
        }
    });

    visible.forEach(p => {
        const cx = sx(p.x);
        const cy = sy(p.y);
        const spot = placeLabel(cx, cy, p.label, taken, m, w, h);
        labelsG.appendChild(svgEl('text', {
            class: 'g-label', x: spot.x, y: spot.y, 'text-anchor': spot.anchor
        }, p.label));
    });

    svg.appendChild(markers);
    svg.appendChild(labelsG);

    attachInspector(svg, state, { sx, sy, m, pw, ph, w, h, dom });
    mount(container, svg, describe(state));
}

function mount(container, svg, label) {
    container.setAttribute('role', 'img');
    container.setAttribute('aria-label', label);
    container.replaceChildren(svg);
}

/** Bygger en SVG-sti, og bryter den ved hull og asymptoter. */
function buildPath(points, sx, sy, ph) {
    const LIMIT = 5000;
    let d = '';
    let pen = false;
    let prev = null;

    for (const p of points) {
        const px = sx(p.x);
        const py = clamp(sy(p.y), -LIMIT, LIMIT);
        const jump = prev && prev.y * p.y < 0 && Math.abs(py - prev.py) > ph * 0.8;

        if (!pen || jump) {
            d += `M ${px.toFixed(2)} ${py.toFixed(2)} `;
            pen = true;
        } else {
            d += `L ${px.toFixed(2)} ${py.toFixed(2)} `;
        }
        prev = { y: p.y, py };
    }
    return d.trim();
}

/** Velger plassering for en etikett slik at den ikke kolliderer med andre. */
function placeLabel(cx, cy, text, taken, m, w, h) {
    const tw = text.length * 6.9;
    const candidates = [
        { dx: 12, dy: -10, anchor: 'start' },
        { dx: 12, dy: 18, anchor: 'start' },
        { dx: -12, dy: -10, anchor: 'end' },
        { dx: -12, dy: 18, anchor: 'end' },
        { dx: 0, dy: -16, anchor: 'middle' },
        { dx: 0, dy: 26, anchor: 'middle' }
    ];

    const box = (c) => {
        const x = cx + c.dx;
        const y = cy + c.dy;
        const x1 = c.anchor === 'start' ? x : c.anchor === 'end' ? x - tw : x - tw / 2;
        return { x1, y1: y - 12, x2: x1 + tw, y2: y + 4 };
    };
    const overlaps = (a, b) => a.x1 < b.x2 && a.x2 > b.x1 && a.y1 < b.y2 && a.y2 > b.y1;
    const inside = (b) => b.x1 >= m.l - 4 && b.x2 <= w - 4 && b.y1 >= m.t - 8 && b.y2 <= h - m.b + 14;

    let chosen = candidates.find(c => {
        const b = box(c);
        return inside(b) && !taken.some(t => overlaps(b, t));
    });
    if (!chosen) chosen = candidates.find(c => inside(box(c))) || candidates[0];

    const b = box(chosen);
    taken.push(b);

    // Hold etiketten innenfor bildet selv om ingen plassering passet perfekt
    let x = cx + chosen.dx;
    if (b.x1 < 4) x += 4 - b.x1;
    if (b.x2 > w - 4) x -= b.x2 - (w - 4);
    return { x, y: cy + chosen.dy, anchor: chosen.anchor };
}

/* ------------------------------------------------------------------ */
/* Avlesning med mus/berøring                                          */
/* ------------------------------------------------------------------ */

function attachInspector(svg, state, ctx) {
    const { sx, sy, m, pw, w, h, dom } = ctx;
    const { points, extras } = state;
    if (!points.length) return;

    const group = svgEl('g', { visibility: 'hidden', 'pointer-events': 'none' });
    const line = svgEl('line', { class: 'g-cursor-line', y1: m.t, y2: h - m.b });
    const dot = svgEl('circle', { class: 'g-cursor', r: 5 });
    const tipBg = svgEl('rect', { class: 'g-tip-bg', rx: 6, height: 24 });
    const tipText = svgEl('text', { class: 'g-tip-text', 'text-anchor': 'middle' });
    group.append(line, dot, tipBg, tipText);
    svg.appendChild(group);

    const valueAt = (x) => {
        if (typeof extras.fn === 'function') {
            try {
                const y = extras.fn(x);
                if (Number.isFinite(y)) return y;
            } catch (e) { /* faller tilbake til interpolasjon */ }
        }
        // Lineær interpolasjon mellom nærmeste datapunkter
        let lo = 0;
        let hi = points.length - 1;
        while (hi - lo > 1) {
            const mid = (lo + hi) >> 1;
            if (points[mid].x <= x) lo = mid; else hi = mid;
        }
        const a = points[lo];
        const b = points[hi];
        if (b.x === a.x) return a.y;
        return a.y + ((b.y - a.y) * (x - a.x)) / (b.x - a.x);
    };

    const show = (event) => {
        const rect = svg.getBoundingClientRect();
        if (!rect.width) return;
        const px = ((event.clientX - rect.left) / rect.width) * w;
        const dataX = clamp(
            dom.xMin + ((px - m.l) / pw) * (dom.xMax - dom.xMin),
            dom.dataXMin,
            dom.dataXMax
        );
        const y = valueAt(dataX);
        if (!Number.isFinite(y)) {
            group.setAttribute('visibility', 'hidden');
            return;
        }

        const cx = sx(dataX);
        const cy = clamp(sy(y), m.t - 4, h - m.b + 4);
        const text = `(${fmt(dataX)}, ${fmt(y)})`;
        const tw = text.length * 7.2 + 16;
        const tx = clamp(cx, tw / 2 + 4, w - tw / 2 - 4);
        const above = cy - 38 > 0;
        const ty = above ? cy - 38 : cy + 14;

        line.setAttribute('x1', cx);
        line.setAttribute('x2', cx);
        dot.setAttribute('cx', cx);
        dot.setAttribute('cy', cy);
        tipBg.setAttribute('x', tx - tw / 2);
        tipBg.setAttribute('y', ty);
        tipBg.setAttribute('width', tw);
        tipText.setAttribute('x', tx);
        tipText.setAttribute('y', ty + 16);
        tipText.textContent = text;
        group.setAttribute('visibility', 'visible');
    };

    svg.addEventListener('pointerdown', show);
    svg.addEventListener('pointermove', (e) => {
        // Mus: vis ved hovring. Berøring: vis mens fingeren er nede.
        if (e.pointerType === 'mouse' || e.buttons) show(e);
    });
    svg.addEventListener('pointerleave', (e) => {
        if (e.pointerType === 'mouse') group.setAttribute('visibility', 'hidden');
    });
}
