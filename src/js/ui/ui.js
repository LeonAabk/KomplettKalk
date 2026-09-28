import { validateQuadraticInput, validateLinearInput, validatePercentInput, validatePythagorasInput } from '../utils/validation.js';
import { analyzeQuadratic, generateQuadraticDataPoints, analyzeLinear, generateLinearDataPoints } from '../modules/algebra.js';
import { analyzePercent, analyzePercentChange } from '../modules/basic.js';
import { analyzePythagoras } from '../modules/geometry.js';
import { renderSteps } from '../components/step-by-step.js';
import { renderGraph, renderEmptyGraph } from '../components/graph.js';
import { evaluateMath } from '../utils/mathParser.js';
import { functionData } from '../utils/functionData.js';

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
    const globalSearch = document.getElementById('global-search');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    const quickGraphSidebar = document.querySelector('.quick-graph-sidebar');
    const appContainer = document.querySelector('.app-container');

    // Dynamisk generering av dashboard-kort
    function renderDashboardCards() {
        dashboardGrid.innerHTML = '';
        functionData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'module-card';
            card.setAttribute('data-category', item.category);
            card.setAttribute('data-target', item.id);

            card.innerHTML = `
                <div class="module-card-icon">${item.icon}</div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            `;

            card.addEventListener('click', () => {
                // Skjul dashboard og vis valgt modul
                dashboardGrid.style.display = 'none';
                // Skjul alle andre moduler
                document.querySelectorAll('.educational-module').forEach(mod => {
                    mod.style.display = 'none';
                });

                const targetModule = document.getElementById(item.id);
                if (targetModule) {
                    targetModule.style.display = 'block';

                    if (item.category === 'geometri' || item.category === 'grunnleggende') {
                        if (quickGraphSidebar) quickGraphSidebar.style.display = 'none';
                        if (appContainer) appContainer.style.gridTemplateColumns = '200px 1fr';
                    } else {
                        if (quickGraphSidebar) quickGraphSidebar.style.display = 'flex';
                        if (appContainer) appContainer.style.gridTemplateColumns = '200px 1fr 300px';
                    }
                } else {
                    alert('Denne modulen mangler HTML-struktur!');
                    dashboardGrid.style.display = 'grid';
                    if (quickGraphSidebar) quickGraphSidebar.style.display = 'flex';
                    if (appContainer) appContainer.style.gridTemplateColumns = '200px 1fr 300px';
                }
            });

            dashboardGrid.appendChild(card);
        });
    }

    renderDashboardCards();
    let moduleCards = document.querySelectorAll('.module-card');

    // Tilbake til oversikt-knapper
    const backButtons = document.querySelectorAll('.btn-back-dashboard, #btn-back-dashboard');
    backButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.educational-module').forEach(mod => {
                mod.style.display = 'none';
            });
            dashboardGrid.style.display = 'grid';
            if (quickGraphSidebar) quickGraphSidebar.style.display = 'flex';
            if (appContainer) appContainer.style.gridTemplateColumns = '200px 1fr 300px';
        });
    });

    if (globalSearch) {
        globalSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            moduleCards = document.querySelectorAll('.module-card');

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
                 document.querySelectorAll('.educational-module').forEach(mod => {
                     mod.style.display = 'none';
                 });
                 dashboardGrid.style.display = 'grid';
                 if (quickGraphSidebar) quickGraphSidebar.style.display = 'flex';
                 if (appContainer) appContainer.style.gridTemplateColumns = '200px 1fr 300px';
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
            document.querySelectorAll('.educational-module').forEach(mod => {
                mod.style.display = 'none';
            });
            dashboardGrid.style.display = 'grid';
            if (quickGraphSidebar) quickGraphSidebar.style.display = 'flex';
            if (appContainer) appContainer.style.gridTemplateColumns = '200px 1fr 300px';
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

    // ---------------- LINEAR LOGIC ----------------
    const linearForm = document.getElementById('linear-form');
    const linearHintBox = document.getElementById('validation-hint-linear');
    const linearStepsBtn = document.getElementById('btn-show-steps-linear');
    const linearStepsContainer = document.getElementById('step-by-step-container-linear');
    const linearStepsContent = document.getElementById('steps-content-linear');

    if (linearForm) {
        linearForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(linearForm);
            const validation = validateLinearInput(formData.get('a'), formData.get('b'));

            if (!validation.isValid) {
                showHint(linearHintBox, validation.hint);
                linearStepsBtn.disabled = true;
                linearStepsContainer.hidden = true;
                return;
            }
            hideHint(linearHintBox);

            const { a, b } = validation.values;
            const result = analyzeLinear(a, b);

            // Save to state for step viewing
            state.currentLinearResult = result;
            linearStepsBtn.disabled = false;

            if (!linearStepsContainer.hidden) {
                renderSteps(result.steps, linearStepsContent);
            }

            // Render graph
            // Find appropriate x range. If root exists, center around it, else center around 0
            const xCenter = result.root !== null ? result.root : 0;
            const spread = 10;
            const dataPoints = generateLinearDataPoints(a, b, xCenter - spread, xCenter + spread);
            const rootsArr = result.root !== null ? [result.root] : [];
            renderGraph(canvas, dataPoints, null, rootsArr);

            let graphHTML = `<p><strong>Skjæring med y-aksen:</strong> (0, ${result.yIntercept.y})</p>`;
            if (result.root !== null) {
                graphHTML += `<p><strong>Nullpunkt (skjæring x-akse):</strong> (${result.root.toFixed(2)}, 0)</p>`;
            } else {
                graphHTML += `<p><strong>Nullpunkt:</strong> Ingen (horisontal linje)</p>`;
            }
            graphDetails.innerHTML = graphHTML;
        });

        linearStepsBtn.addEventListener('click', () => {
            const isHidden = linearStepsContainer.hidden;
            if (isHidden) {
                linearStepsContainer.hidden = false;
                linearStepsBtn.textContent = 'Skjul utregning';
                linearStepsBtn.setAttribute('aria-expanded', 'true');
                if (state.currentLinearResult) {
                    renderSteps(state.currentLinearResult.steps, linearStepsContent);
                }
            } else {
                linearStepsContainer.hidden = true;
                linearStepsBtn.textContent = 'Vis utregning';
                linearStepsBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ---------------- PERCENT LOGIC ----------------
    const percentForm = document.getElementById('percent-form');
    const percentHintBox = document.getElementById('validation-hint-percent');
    const percentStepsBtn = document.getElementById('btn-show-steps-percent');
    const percentStepsContainer = document.getElementById('step-by-step-container-percent');
    const percentStepsContent = document.getElementById('steps-content-percent');
    const percentResultBox = document.getElementById('result-percent');

    if (percentForm) {
        percentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(percentForm);
            const validation = validatePercentInput(formData.get('x'), formData.get('y'));

            if (!validation.isValid) {
                showHint(percentHintBox, validation.hint);
                percentStepsBtn.disabled = true;
                percentStepsContainer.hidden = true;
                percentResultBox.hidden = true;
                return;
            }
            hideHint(percentHintBox);

            const { x, y } = validation.values;
            const result = analyzePercent(x, y);

            state.currentPercentResult = result;
            percentStepsBtn.disabled = false;

            percentResultBox.innerHTML = `<strong>Resultat:</strong> ${x} er ${result.result.toFixed(2)}% av ${y}.`;
            percentResultBox.hidden = false;

            if (!percentStepsContainer.hidden) {
                renderSteps(result.steps, percentStepsContent);
            }
        });

        percentStepsBtn.addEventListener('click', () => {
            const isHidden = percentStepsContainer.hidden;
            if (isHidden) {
                percentStepsContainer.hidden = false;
                percentStepsBtn.textContent = 'Skjul utregning';
                percentStepsBtn.setAttribute('aria-expanded', 'true');
                if (state.currentPercentResult) {
                    renderSteps(state.currentPercentResult.steps, percentStepsContent);
                }
            } else {
                percentStepsContainer.hidden = true;
                percentStepsBtn.textContent = 'Vis utregning';
                percentStepsBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ---------------- PERCENT CHANGE LOGIC ----------------
    const pctChangeForm = document.getElementById('percent-change-form');
    const pctChangeHintBox = document.getElementById('validation-hint-percent-change');
    const pctChangeStepsBtn = document.getElementById('btn-show-steps-percent-change');
    const pctChangeStepsContainer = document.getElementById('step-by-step-container-percent-change');
    const pctChangeStepsContent = document.getElementById('steps-content-percent-change');
    const pctChangeResultBox = document.getElementById('result-percent-change');

    if (pctChangeForm) {
        pctChangeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(pctChangeForm);
            const validation = validatePercentInput(formData.get('oldVal'), formData.get('oldVal')); // Using same validation structure, but need to check if oldVal is 0
            const oldVal = parseFloat(formData.get('oldVal'));
            const newVal = parseFloat(formData.get('newVal'));

            if (isNaN(oldVal) || isNaN(newVal) || oldVal === 0) {
                showHint(pctChangeHintBox, "Gyldige tall kreves, og gammel verdi kan ikke være 0.");
                pctChangeStepsBtn.disabled = true;
                pctChangeStepsContainer.hidden = true;
                pctChangeResultBox.hidden = true;
                return;
            }
            hideHint(pctChangeHintBox);

            const result = analyzePercentChange(oldVal, newVal);
            state.currentPctChangeResult = result;
            pctChangeStepsBtn.disabled = false;

            pctChangeResultBox.innerHTML = `<strong>Resultat:</strong> Det er en ${Math.abs(result.result).toFixed(2)}% ${result.direction}.`;
            pctChangeResultBox.hidden = false;

            if (!pctChangeStepsContainer.hidden) {
                renderSteps(result.steps, pctChangeStepsContent);
            }
        });

        pctChangeStepsBtn.addEventListener('click', () => {
            const isHidden = pctChangeStepsContainer.hidden;
            if (isHidden) {
                pctChangeStepsContainer.hidden = false;
                pctChangeStepsBtn.textContent = 'Skjul utregning';
                pctChangeStepsBtn.setAttribute('aria-expanded', 'true');
                if (state.currentPctChangeResult) {
                    renderSteps(state.currentPctChangeResult.steps, pctChangeStepsContent);
                }
            } else {
                pctChangeStepsContainer.hidden = true;
                pctChangeStepsBtn.textContent = 'Vis utregning';
                pctChangeStepsBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ---------------- PYTHAGORAS LOGIC ----------------
    const pythForm = document.getElementById('pythagoras-form');
    const pythHintBox = document.getElementById('validation-hint-pythagoras');
    const pythStepsBtn = document.getElementById('btn-show-steps-pythagoras');
    const pythStepsContainer = document.getElementById('step-by-step-container-pythagoras');
    const pythStepsContent = document.getElementById('steps-content-pythagoras');
    const pythResultBox = document.getElementById('result-pythagoras');

    if (pythForm) {
        pythForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(pythForm);
            const validation = validatePythagorasInput(formData.get('a'), formData.get('b'), formData.get('c'));

            if (!validation.isValid) {
                showHint(pythHintBox, validation.hint);
                pythStepsBtn.disabled = true;
                pythStepsContainer.hidden = true;
                pythResultBox.hidden = true;
                return;
            }
            hideHint(pythHintBox);

            const { a, b, c } = validation.values;
            const result = analyzePythagoras(a, b, c);

            state.currentPythResult = result;
            pythStepsBtn.disabled = false;

            pythResultBox.innerHTML = `<strong>Resultat:</strong> Den manglende siden (${result.missing}) er ${Number.isInteger(result.result) ? result.result : result.result.toFixed(2)}`;
            pythResultBox.hidden = false;

            if (!pythStepsContainer.hidden) {
                renderSteps(result.steps, pythStepsContent);
            }
        });

        pythStepsBtn.addEventListener('click', () => {
            const isHidden = pythStepsContainer.hidden;
            if (isHidden) {
                pythStepsContainer.hidden = false;
                pythStepsBtn.textContent = 'Skjul utregning';
                pythStepsBtn.setAttribute('aria-expanded', 'true');
                if (state.currentPythResult) {
                    renderSteps(state.currentPythResult.steps, pythStepsContent);
                }
            } else {
                pythStepsContainer.hidden = true;
                pythStepsBtn.textContent = 'Vis utregning';
                pythStepsBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

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
