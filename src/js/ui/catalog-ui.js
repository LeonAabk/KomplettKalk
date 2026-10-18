/**
 * Bygger skjema, resultatboks og utregning for emnene i modules/catalog.js
 * og legger dem inn i dashboardet. Må kjøres FØR initUI().
 */
import { catalog } from '../modules/catalog.js';
import { functionData } from '../utils/functionData.js';
import { renderSteps } from '../components/step-by-step.js';

function esc(s) {
    return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

/** "3, 5,7 8;9" og "2,5 4" (komma som desimal) → tall */
function parseList(str) {
    const out = [];
    for (const tok of str.split(/[;\s]+/).filter(Boolean)) {
        const t = tok.replace(/,+$/, '');
        const parts = (t.match(/,/g) || []).length > 1 ? t.split(',') : [t.replace(',', '.')];
        for (const p of parts) out.push(parseFloat(p.replace(',', '.')));
    }
    return out;
}

function fieldHtml(id, f) {
    const fid = `${id}-${f.name}`;
    if (f.type === 'select') {
        const opts = f.options.map(([v, l]) => `<option value="${esc(v)}">${esc(l)}</option>`).join('');
        return `<div class="input-group"><label for="${fid}">${esc(f.label)}</label><select id="${fid}" name="${f.name}">${opts}</select></div>`;
    }
    if (f.type === 'text') {
        return `<div class="input-group"><label for="${fid}">${esc(f.label)}</label><input type="text" id="${fid}" name="${f.name}" placeholder="${esc(f.placeholder || '')}" autocomplete="off" inputmode="decimal" required></div>`;
    }
    const min = f.min !== undefined ? ` min="${f.min}"` : '';
    const req = f.optional ? '' : ' required';
    return `<div class="input-group"><label for="${fid}">${esc(f.label)}</label><input type="number" id="${fid}" name="${f.name}" step="any" inputmode="decimal"${min}${req}></div>`;
}

function buildSection(t) {
    const key = t.id.replace(/^module-/, '');
    const s = document.createElement('section');
    s.id = t.id;
    s.className = 'educational-module';
    s.setAttribute('aria-labelledby', `${key}-title`);
    s.style.display = 'none';
    s.innerHTML = `
        <div class="module-header">
            <button class="btn-back-dashboard" aria-label="Tilbake til oversikt"><span aria-hidden="true">&larr;</span> Tilbake</button>
            <h2 id="${key}-title">${esc(t.title)}</h2>
        </div>
        <p>${esc(t.intro)}</p>
        <form id="${key}-form" class="math-form" aria-label="Skjema for ${esc(t.title)}" novalidate>
            <div class="input-grid">${t.fields.map(f => fieldHtml(key, f)).join('')}</div>
            <div id="validation-hint-${key}" class="validation-hint" aria-live="polite" hidden></div>
            <button type="submit" class="btn-primary">${esc(t.button)}</button>
        </form>
        <div id="result-${key}" class="result-box" aria-live="polite" hidden></div>
        <div class="action-buttons">
            <button id="btn-show-steps-${key}" class="btn-secondary" disabled aria-expanded="false" aria-controls="step-by-step-container-${key}">Vis utregning</button>
        </div>
        <div id="step-by-step-container-${key}" class="step-container" hidden aria-live="polite">
            <h3>Trinnvis Utregning</h3>
            <div id="steps-content-${key}" class="steps-content"></div>
        </div>`;
    return s;
}

function wire(t, section) {
    const key = t.id.replace(/^module-/, '');
    const form = section.querySelector('form');
    const hint = section.querySelector(`#validation-hint-${key}`);
    const box = section.querySelector(`#result-${key}`);
    const btn = section.querySelector(`#btn-show-steps-${key}`);
    const stepsBox = section.querySelector(`#step-by-step-container-${key}`);
    const stepsContent = section.querySelector(`#steps-content-${key}`);
    let last = null;

    const fail = (msg) => {
        hint.textContent = msg;
        hint.hidden = false;
        box.hidden = true;
        btn.disabled = true;
        stepsBox.hidden = true;
        last = null;
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const v = {};
        for (const f of t.fields) {
            const raw = String(fd.get(f.name) ?? '').trim();
            if (f.type === 'select') v[f.name] = raw;
            else if (t.parse === 'list' && f.type === 'text') {
                v[f.name] = parseList(raw);
                if (!v[f.name].length || v[f.name].some(Number.isNaN)) return fail('Skriv inn gyldige tall adskilt med komma eller mellomrom.');
            } else if (raw === '' && f.optional) v[f.name] = null;
            else {
                const n = parseFloat(raw.replace(',', '.'));
                if (raw === '' || Number.isNaN(n)) return fail('Fyll inn alle feltene med gyldige tall.');
                v[f.name] = n;
            }
        }
        const msg = t.check ? t.check(v) : null;
        if (msg) return fail(msg);
        hint.hidden = true;
        last = t.run(v);
        box.innerHTML = last.html;
        box.hidden = false;
        btn.disabled = false;
        if (!stepsBox.hidden) renderSteps(last.steps, stepsContent);
    });

    btn.addEventListener('click', () => {
        const open = stepsBox.hidden;
        stepsBox.hidden = !open;
        btn.textContent = open ? 'Skjul utregning' : 'Vis utregning';
        btn.setAttribute('aria-expanded', String(open));
        if (open && last) renderSteps(last.steps, stepsContent);
    });
}

export function initCatalog() {
    const anchor = document.getElementById('module-compound-interest');
    const parent = anchor ? anchor.parentElement : document.querySelector('main');
    catalog.forEach(t => {
        if (functionData.some(f => f.id === t.id)) return;
        functionData.push({ id: t.id, title: t.title, category: t.category, description: t.description, icon: t.icon, formula: t.formula });
        const section = buildSection(t);
        parent.appendChild(section);
        wire(t, section);
    });
}
