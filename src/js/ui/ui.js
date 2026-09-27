import { validateQuadraticInput } from '../utils/validation.js';
import { analyzeQuadratic, generateQuadraticDataPoints } from '../modules/algebra.js';
import { renderSteps } from '../components/step-by-step.js';
import { renderGraph, renderEmptyGraph } from '../components/graph.js';
import { evaluateMath } from '../utils/mathParser.js';

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
    const quickInput = document.getElementById('quick-function-input');
    const btnDrawQuick = document.getElementById('btn-draw-quick');

    // Render empty graph on startup
    if (window.Chart) {
        renderEmptyGraph(canvas);
    } else {
        // Retry if Chart.js is not fully loaded (since it's loaded via defer)
        setTimeout(() => renderEmptyGraph(canvas), 500);
    }

    // Dashboard Elements
    const dashboardGrid = document.getElementById('dashboard-grid');
    const moduleCards = document.querySelectorAll('.module-card');
    const moduleQuadratic = document.getElementById('module-quadratic');
    const btnBackDashboard = document.getElementById('btn-back-dashboard');
    const globalSearch = document.getElementById('global-search');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');

    // Dashboard Logic
    moduleCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetId = card.getAttribute('data-target');
            if (targetId === 'module-quadratic') {
                dashboardGrid.style.display = 'none';
                moduleQuadratic.style.display = 'block';
            } else {
                alert('Denne modulen er under utvikling!');
            }
        });
    });

    if (btnBackDashboard) {
        btnBackDashboard.addEventListener('click', () => {
            moduleQuadratic.style.display = 'none';
            dashboardGrid.style.display = 'grid';
        });
    }

    if (globalSearch) {
        globalSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            moduleCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Update active state
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const category = link.getAttribute('href').substring(1); // remove '#'

            moduleCards.forEach(card => {
                if (category === 'alle' || card.getAttribute('data-category') === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });

            // Ensure dashboard is visible when clicking sidebar
            if (dashboardGrid.style.display === 'none') {
                 moduleQuadratic.style.display = 'none';
                 dashboardGrid.style.display = 'grid';
            }
        });
    });

    // Legg til en 'Alle' lenke dynamisk hvis den mangler, eller bare la de eksisterende virke
    const navUl = document.querySelector('.sidebar-nav ul');
    if (navUl && !navUl.querySelector('a[href="#alle"]')) {
        const li = document.createElement('li');
        li.innerHTML = '<a href="#alle">Alle Emner</a>';
        navUl.insertBefore(li, navUl.firstChild);

        li.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            sidebarLinks.forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
            moduleCards.forEach(card => card.style.display = 'flex');
            moduleQuadratic.style.display = 'none';
            dashboardGrid.style.display = 'grid';
        });
    }

    // Hurtig-Graf logikk
    if (btnDrawQuick && quickInput) {
        btnDrawQuick.addEventListener('click', () => {
            const funcStr = quickInput.value.trim();
            if (!funcStr) return;

            try {
                const dataPoints = [];
                for (let x = -10; x <= 10; x += 0.5) {
                    const y = evaluateMath(funcStr, x);
                    if (isFinite(y)) {
                        dataPoints.push({ x, y });
                    }
                }

                renderGraph(canvas, dataPoints, null, null);
                graphDetails.innerHTML = `<p>Viser graf for: <strong>f(x) = ${funcStr}</strong></p>`;
            } catch (e) {
                graphDetails.innerHTML = `<p style="color: var(--error-color);">Ugyldig funksjon. Prøv f.eks 'x*x', 'x^2' eller '2*x+1'</p>`;
            }
        });
    }

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
