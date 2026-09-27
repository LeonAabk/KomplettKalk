import { validateQuadraticInput } from '../utils/validation.js';
import { analyzeQuadratic, generateQuadraticDataPoints } from '../modules/algebra.js';
import { renderSteps } from '../components/step-by-step.js';
import { renderGraph } from '../components/graph.js';

/**
 * Modul for å binde sammen UI, state og forretningslogikk.
 */

// Tilstand for applikasjonen
const state = {
    currentResult: null // Lagrer siste utregning (steps, vertex, roots)
};

export function initUI() {
    const form = document.getElementById('quadratic-form');
    const hintBox = document.getElementById('validation-hint');
    const showStepsBtn = document.getElementById('btn-show-steps');
    const stepsContainer = document.getElementById('step-by-step-container');
    const stepsContent = document.getElementById('steps-content');
    const canvas = document.getElementById('quick-graph-canvas');
    const graphDetails = document.getElementById('graph-details');

    // Håndter skjemainnsending
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const aStr = formData.get('a');
        const bStr = formData.get('b');
        const cStr = formData.get('c');

        // 1. Valider input
        const validation = validateQuadraticInput(aStr, bStr, cStr);

        if (!validation.isValid) {
            showHint(hintBox, validation.hint);
            resetUI(showStepsBtn, stepsContainer, canvas, graphDetails);
            return;
        }

        // Skjul evt. feil/hint
        hideHint(hintBox);

        // 2. Utfør beregning
        const { a, b, c } = validation.values;
        const result = analyzeQuadratic(a, b, c);

        // Lagre resultat i state
        state.currentResult = result;

        // 3. Oppdater UI
        // Gjør "Vis utregning"-knappen aktiv
        showStepsBtn.disabled = false;

        // Hvis utregning allerede er synlig, oppdater den
        if (!stepsContainer.hidden) {
            renderSteps(result.steps, stepsContent);
        }

        // 4. Tegn graf
        // Finn passende x-område basert på ekstremalpunkt og røtter
        const xCenter = result.vertex.x;
        let spread = 5; // standard spredning
        if (result.roots.length > 0) {
            const maxRootDist = Math.max(...result.roots.map(r => Math.abs(r - xCenter)));
            spread = Math.max(5, maxRootDist * 1.5);
        }

        const dataPoints = generateQuadraticDataPoints(a, b, c, xCenter - spread, xCenter + spread, spread / 20);
        renderGraph(canvas, dataPoints, result.vertex, result.roots);

        // Oppdater tekstdetaljer under grafen
        updateGraphDetails(graphDetails, result);
    });

    // Håndter "Vis utregning" knappen
    showStepsBtn.addEventListener('click', () => {
        const isHidden = stepsContainer.hidden;

        if (isHidden) {
            stepsContainer.hidden = false;
            showStepsBtn.textContent = 'Skjul utregning';
            showStepsBtn.setAttribute('aria-expanded', 'true');
            if (state.currentResult) {
                renderSteps(state.currentResult.steps, stepsContent);
            }
        } else {
            stepsContainer.hidden = true;
            showStepsBtn.textContent = 'Vis utregning';
            showStepsBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // Oppdater graf på tema-bytte
    window.addEventListener('themeChanged', () => {
        if (state.currentResult) {
             const formData = new FormData(form);
             const a = parseFloat(formData.get('a'));
             const b = parseFloat(formData.get('b'));
             const c = parseFloat(formData.get('c'));

             if(!isNaN(a) && !isNaN(b) && !isNaN(c)) {
                 const xCenter = state.currentResult.vertex.x;
                 let spread = 5;
                 if (state.currentResult.roots.length > 0) {
                     const maxDist = Math.max(...state.currentResult.roots.map(r => Math.abs(r - xCenter)));
                     spread = Math.max(5, maxDist * 1.5);
                 }
                 const dataPoints = generateQuadraticDataPoints(a, b, c, xCenter - spread, xCenter + spread, spread / 20);
                 renderGraph(canvas, dataPoints, state.currentResult.vertex, state.currentResult.roots);
             }
        }
    });
}

function showHint(element, message) {
    element.textContent = message;
    element.hidden = false;
}

function hideHint(element) {
    element.textContent = '';
    element.hidden = true;
}

function resetUI(btn, stepsContainer, canvas, details) {
    btn.disabled = true;
    stepsContainer.hidden = true;
    details.innerHTML = '';
    state.currentResult = null;

    // Fjern evt chart
    if (window.Chart) {
       const chart = Chart.getChart(canvas);
       if (chart) chart.destroy();
    }
}

function updateGraphDetails(container, result) {
    let html = `<p><strong>${result.vertex.type}:</strong> (${result.vertex.x.toFixed(2)}, ${result.vertex.y.toFixed(2)})</p>`;

    if (result.roots.length === 2) {
        html += `<p><strong>Nullpunkter:</strong> x₁ = ${result.roots[0].toFixed(2)}, x₂ = ${result.roots[1].toFixed(2)}</p>`;
    } else if (result.roots.length === 1) {
        html += `<p><strong>Nullpunkt:</strong> x = ${result.roots[0].toFixed(2)}</p>`;
    } else {
        html += `<p><strong>Nullpunkter:</strong> Ingen reelle</p>`;
    }

    container.innerHTML = html;
}
