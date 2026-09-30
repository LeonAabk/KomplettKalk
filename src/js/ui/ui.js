import { validateQuadraticInput, validateLinearInput, validatePercentInput, validatePythagorasInput, validateAreaInput, validateTrigonometryInput, validateABCInput, validateVertexInput, validatePowerInput, validateSquareRootInput, validateStatisticsInput, validateEquationSystemInput, validateVolumeInput, validateFractionInput } from '../utils/validation.js';
import { analyzeQuadratic, generateQuadraticDataPoints, analyzeLinear, generateLinearDataPoints, analyzeABC, analyzeVertex, analyzeEquationSystem, analyzeFactoring } from '../modules/algebra.js';
import { analyzePercent, analyzePercentChange, analyzePower, analyzeSquareRoot, analyzeFractions } from '../modules/basic.js';
import { analyzePythagoras, analyzeArea, analyzeTrigonometry, analyzeVolume } from '../modules/geometry.js';
import { analyzeMean, analyzeMedian, analyzeMode, analyzeRange } from '../modules/statistics.js';
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

                    if (item.category === 'geometri' || item.category === 'grunnleggende' || item.category === 'statistikk') {
                        if (quickGraphSidebar) quickGraphSidebar.style.display = 'none';
                        if (appContainer) appContainer.classList.add('hide-right-sidebar');
                    } else {
                        if (quickGraphSidebar) quickGraphSidebar.style.display = 'flex';
                        if (appContainer) appContainer.classList.remove('hide-right-sidebar');
                    }
                } else {
                    alert('Denne modulen mangler HTML-struktur!');
                    dashboardGrid.style.display = 'grid';
                    if (quickGraphSidebar) quickGraphSidebar.style.display = 'flex';
                    if (appContainer) appContainer.classList.remove('hide-right-sidebar');
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
            if (appContainer) appContainer.classList.remove('hide-right-sidebar');
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

            // Oppdater moduleCards hver gang i tilfelle de har blitt gjenskapt (viktig for filtrering)
            moduleCards = document.querySelectorAll('.module-card');
            moduleCards.forEach(card => {
                if (category === 'alle' || card.getAttribute('data-category') === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });

            // Ensure dashboard is visible when clicking sidebar
            document.querySelectorAll('.educational-module').forEach(mod => {
                mod.style.display = 'none';
            });
            dashboardGrid.style.display = 'grid';
            if (quickGraphSidebar) quickGraphSidebar.style.display = 'flex';
            if (appContainer) appContainer.classList.remove('hide-right-sidebar');
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
            if (appContainer) appContainer.classList.remove('hide-right-sidebar');
        });
    }

    // Hurtig-Graf logikk
    if (btnDrawQuick && quickInput) {
        btnDrawQuick.addEventListener('click', () => {
            const funcStr = quickInput.value.trim();
            if (!funcStr) {
                renderEmptyGraph(canvas);
                graphDetails.innerHTML = '';
                return;
            }

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

    // ---------------- AREA LOGIC ----------------
    const areaForm = document.getElementById('area-form');
    const areaShapeSelect = document.getElementById('area-shape');
    const areaGroup2 = document.getElementById('area-group2');
    const areaLabel1 = document.getElementById('area-label1');
    const areaLabel2 = document.getElementById('area-label2');
    const areaHintBox = document.getElementById('validation-hint-area');
    const areaStepsBtn = document.getElementById('btn-show-steps-area');
    const areaStepsContainer = document.getElementById('step-by-step-container-area');
    const areaStepsContent = document.getElementById('steps-content-area');
    const areaResultBox = document.getElementById('result-area');

    if (areaForm) {
        areaShapeSelect.addEventListener('change', (e) => {
            const shape = e.target.value;
            if (shape === 'circle') {
                areaGroup2.style.display = 'none';
                areaLabel1.textContent = 'Radius (r) =';
            } else if (shape === 'rectangle') {
                areaGroup2.style.display = 'flex';
                areaLabel1.textContent = 'Lengde (l) =';
                areaLabel2.textContent = 'Bredde (b) =';
            } else if (shape === 'triangle') {
                areaGroup2.style.display = 'flex';
                areaLabel1.textContent = 'Grunnlinje (g) =';
                areaLabel2.textContent = 'Høyde (h) =';
            }
        });

        areaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(areaForm);
            const shape = formData.get('shape');
            const val1Str = formData.get('val1');
            const val2Str = formData.get('val2');

            const validation = validateAreaInput(shape, val1Str, val2Str);

            if (!validation.isValid) {
                showHint(areaHintBox, validation.hint);
                areaStepsBtn.disabled = true;
                areaStepsContainer.hidden = true;
                areaResultBox.hidden = true;
                return;
            }
            hideHint(areaHintBox);

            const { val1, val2 } = validation.values;
            const result = analyzeArea(shape, val1, val2);

            state.currentAreaResult = result;
            areaStepsBtn.disabled = false;

            areaResultBox.innerHTML = `<strong>Resultat:</strong> Arealet er ${result.result % 1 === 0 ? result.result : result.result.toFixed(2)}`;
            areaResultBox.hidden = false;

            if (!areaStepsContainer.hidden) {
                renderSteps(result.steps, areaStepsContent);
            }
        });

        areaStepsBtn.addEventListener('click', () => {
            const isHidden = areaStepsContainer.hidden;
            if (isHidden) {
                areaStepsContainer.hidden = false;
                areaStepsBtn.textContent = 'Skjul utregning';
                areaStepsBtn.setAttribute('aria-expanded', 'true');
                if (state.currentAreaResult) {
                    renderSteps(state.currentAreaResult.steps, areaStepsContent);
                }
            } else {
                areaStepsContainer.hidden = true;
                areaStepsBtn.textContent = 'Vis utregning';
                areaStepsBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ---------------- TRIGONOMETRY LOGIC ----------------
    const trigForm = document.getElementById('trig-form');
    const trigHintBox = document.getElementById('validation-hint-trig');
    const trigStepsBtn = document.getElementById('btn-show-steps-trig');
    const trigStepsContainer = document.getElementById('step-by-step-container-trig');
    const trigStepsContent = document.getElementById('steps-content-trig');
    const trigResultBox = document.getElementById('result-trig');

    if (trigForm) {
        trigForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(trigForm);

            const givenType = formData.get('givenType');
            const findType = formData.get('findType');

            if (givenType === findType) {
                showHint(trigHintBox, 'Kjent side og siden du vil finne kan ikke være den samme.');
                return;
            }

            const validation = validateTrigonometryInput(formData.get('angle'), formData.get('givenValue'));

            if (!validation.isValid) {
                showHint(trigHintBox, validation.hint);
                trigStepsBtn.disabled = true;
                trigStepsContainer.hidden = true;
                trigResultBox.hidden = true;
                return;
            }
            hideHint(trigHintBox);

            const { angle, givenValue } = validation.values;
            const result = analyzeTrigonometry(angle, givenType, givenValue, findType);

            state.currentTrigResult = result;
            trigStepsBtn.disabled = false;

            trigResultBox.innerHTML = `<strong>Resultat:</strong> Siden er ${result.result.toFixed(2)}`;
            trigResultBox.hidden = false;

            if (!trigStepsContainer.hidden) {
                renderSteps(result.steps, trigStepsContent);
            }
        });

        trigStepsBtn.addEventListener('click', () => {
            const isHidden = trigStepsContainer.hidden;
            if (isHidden) {
                trigStepsContainer.hidden = false;
                trigStepsBtn.textContent = 'Skjul utregning';
                trigStepsBtn.setAttribute('aria-expanded', 'true');
                if (state.currentTrigResult) {
                    renderSteps(state.currentTrigResult.steps, trigStepsContent);
                }
            } else {
                trigStepsContainer.hidden = true;
                trigStepsBtn.textContent = 'Vis utregning';
                trigStepsBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ---------------- ABC LOGIC ----------------
    const abcForm = document.getElementById('abc-form');
    const abcHintBox = document.getElementById('validation-hint-abc');
    const abcStepsBtn = document.getElementById('btn-show-steps-abc');
    const abcStepsContainer = document.getElementById('step-by-step-container-abc');
    const abcStepsContent = document.getElementById('steps-content-abc');
    const abcResultBox = document.getElementById('result-abc');

    if (abcForm) {
        abcForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(abcForm);
            const validation = validateABCInput(formData.get('a'), formData.get('b'), formData.get('c'));

            if (!validation.isValid) {
                showHint(abcHintBox, validation.hint);
                abcStepsBtn.disabled = true;
                abcStepsContainer.hidden = true;
                abcResultBox.hidden = true;
                return;
            }
            hideHint(abcHintBox);

            const { a, b, c } = validation.values;
            const result = analyzeABC(a, b, c);

            state.currentAbcResult = result;
            abcStepsBtn.disabled = false;

            if (result.roots.length === 2) {
                abcResultBox.innerHTML = `<strong>Røtter:</strong> x₁ = ${result.roots[0].toFixed(2)}, x₂ = ${result.roots[1].toFixed(2)}`;
            } else if (result.roots.length === 1) {
                abcResultBox.innerHTML = `<strong>Røtter:</strong> x = ${result.roots[0].toFixed(2)}`;
            } else {
                abcResultBox.innerHTML = `<strong>Røtter:</strong> Ingen reelle røtter`;
            }
            abcResultBox.hidden = false;

            if (!abcStepsContainer.hidden) {
                renderSteps(result.steps, abcStepsContent);
            }
        });

        abcStepsBtn.addEventListener('click', () => {
            const isHidden = abcStepsContainer.hidden;
            if (isHidden) {
                abcStepsContainer.hidden = false;
                abcStepsBtn.textContent = 'Skjul utregning';
                abcStepsBtn.setAttribute('aria-expanded', 'true');
                if (state.currentAbcResult) {
                    renderSteps(state.currentAbcResult.steps, abcStepsContent);
                }
            } else {
                abcStepsContainer.hidden = true;
                abcStepsBtn.textContent = 'Vis utregning';
                abcStepsBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ---------------- VERTEX LOGIC ----------------
    const vertexForm = document.getElementById('vertex-form');
    const vertexHintBox = document.getElementById('validation-hint-vertex');
    const vertexStepsBtn = document.getElementById('btn-show-steps-vertex');
    const vertexStepsContainer = document.getElementById('step-by-step-container-vertex');
    const vertexStepsContent = document.getElementById('steps-content-vertex');
    const vertexResultBox = document.getElementById('result-vertex');

    if (vertexForm) {
        vertexForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(vertexForm);
            const validation = validateVertexInput(formData.get('a'), formData.get('b'), formData.get('c'));

            if (!validation.isValid) {
                showHint(vertexHintBox, validation.hint);
                vertexStepsBtn.disabled = true;
                vertexStepsContainer.hidden = true;
                vertexResultBox.hidden = true;
                return;
            }
            hideHint(vertexHintBox);

            const { a, b, c } = validation.values;
            const result = analyzeVertex(a, b, c);

            state.currentVertexResult = result;
            vertexStepsBtn.disabled = false;

            vertexResultBox.innerHTML = `<strong>${result.type}:</strong> (${result.x.toFixed(2)}, ${result.y.toFixed(2)})`;
            vertexResultBox.hidden = false;

            if (!vertexStepsContainer.hidden) {
                renderSteps(result.steps, vertexStepsContent);
            }
        });

        vertexStepsBtn.addEventListener('click', () => {
            const isHidden = vertexStepsContainer.hidden;
            if (isHidden) {
                vertexStepsContainer.hidden = false;
                vertexStepsBtn.textContent = 'Skjul utregning';
                vertexStepsBtn.setAttribute('aria-expanded', 'true');
                if (state.currentVertexResult) {
                    renderSteps(state.currentVertexResult.steps, vertexStepsContent);
                }
            } else {
                vertexStepsContainer.hidden = true;
                vertexStepsBtn.textContent = 'Vis utregning';
                vertexStepsBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ---------------- POWER LOGIC ----------------
    const powerForm = document.getElementById('power-form');
    const powerHintBox = document.getElementById('validation-hint-power');
    const powerStepsBtn = document.getElementById('btn-show-steps-power');
    const powerStepsContainer = document.getElementById('step-by-step-container-power');
    const powerStepsContent = document.getElementById('steps-content-power');
    const powerResultBox = document.getElementById('result-power');

    if (powerForm) {
        powerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(powerForm);
            const validation = validatePowerInput(formData.get('base'), formData.get('exp'));

            if (!validation.isValid) {
                showHint(powerHintBox, validation.hint);
                powerStepsBtn.disabled = true;
                powerStepsContainer.hidden = true;
                powerResultBox.hidden = true;
                return;
            }
            hideHint(powerHintBox);

            const { base, exponent } = validation.values;
            const result = analyzePower(base, exponent);

            state.currentPowerResult = result;
            powerStepsBtn.disabled = false;

            powerResultBox.innerHTML = `<strong>Resultat:</strong> ${result.result}`;
            powerResultBox.hidden = false;

            if (!powerStepsContainer.hidden) {
                renderSteps(result.steps, powerStepsContent);
            }
        });

        powerStepsBtn.addEventListener('click', () => {
            const isHidden = powerStepsContainer.hidden;
            if (isHidden) {
                powerStepsContainer.hidden = false;
                powerStepsBtn.textContent = 'Skjul utregning';
                powerStepsBtn.setAttribute('aria-expanded', 'true');
                if (state.currentPowerResult) {
                    renderSteps(state.currentPowerResult.steps, powerStepsContent);
                }
            } else {
                powerStepsContainer.hidden = true;
                powerStepsBtn.textContent = 'Vis utregning';
                powerStepsBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ---------------- SQUARE ROOT LOGIC ----------------
    const sqrtForm = document.getElementById('sqrt-form');
    const sqrtHintBox = document.getElementById('validation-hint-sqrt');
    const sqrtStepsBtn = document.getElementById('btn-show-steps-sqrt');
    const sqrtStepsContainer = document.getElementById('step-by-step-container-sqrt');
    const sqrtStepsContent = document.getElementById('steps-content-sqrt');
    const sqrtResultBox = document.getElementById('result-sqrt');

    if (sqrtForm) {
        sqrtForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(sqrtForm);
            const validation = validateSquareRootInput(formData.get('number'));

            if (!validation.isValid) {
                showHint(sqrtHintBox, validation.hint);
                sqrtStepsBtn.disabled = true;
                sqrtStepsContainer.hidden = true;
                sqrtResultBox.hidden = true;
                return;
            }
            hideHint(sqrtHintBox);

            const { number } = validation.values;
            const result = analyzeSquareRoot(number);

            state.currentSqrtResult = result;
            sqrtStepsBtn.disabled = false;

            if (isNaN(result.result)) {
                sqrtResultBox.innerHTML = `<strong>Resultat:</strong> Ikke et reelt tall`;
            } else {
                sqrtResultBox.innerHTML = `<strong>Resultat:</strong> ${Number.isInteger(result.result) ? result.result : result.result.toFixed(4)}`;
            }
            sqrtResultBox.hidden = false;

            if (!sqrtStepsContainer.hidden) {
                renderSteps(result.steps, sqrtStepsContent);
            }
        });

        sqrtStepsBtn.addEventListener('click', () => {
            const isHidden = sqrtStepsContainer.hidden;
            if (isHidden) {
                sqrtStepsContainer.hidden = false;
                sqrtStepsBtn.textContent = 'Skjul utregning';
                sqrtStepsBtn.setAttribute('aria-expanded', 'true');
                if (state.currentSqrtResult) {
                    renderSteps(state.currentSqrtResult.steps, sqrtStepsContent);
                }
            } else {
                sqrtStepsContainer.hidden = true;
                sqrtStepsBtn.textContent = 'Vis utregning';
                sqrtStepsBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }


    // ---------------- NYE MODULER ----------------

    // GJENNOMSNITT
    setupModuleUI('mean', validateStatisticsInput, analyzeMean, (res) => `<strong>Gjennomsnitt:</strong> ${res.result.toFixed(2)}`);

    // MEDIAN
    setupModuleUI('median', validateStatisticsInput, analyzeMedian, (res) => `<strong>Median:</strong> ${res.result}`);

    // TYPETALL & VARIASJONSBREDDE (Kombinert skjema, to analyser)
    const modeRangeForm = document.getElementById('mode-range-form');
    if (modeRangeForm) {
        modeRangeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(modeRangeForm);
            const val = validateStatisticsInput(formData.get('list'));
            const hintBox = document.getElementById('validation-hint-mode-range');
            const resBox = document.getElementById('result-mode-range');
            const stepsBtn = document.getElementById('btn-show-steps-mode-range');
            const stepsContainer = document.getElementById('step-by-step-container-mode-range');
            const stepsContent = document.getElementById('steps-content-mode-range');

            if (!val.isValid) {
                showHint(hintBox, val.hint);
                stepsBtn.disabled = true;
                stepsContainer.hidden = true;
                resBox.hidden = true;
                return;
            }
            hideHint(hintBox);

            const modeRes = analyzeMode(val.values.inputStr);
            const rangeRes = analyzeRange(val.values.inputStr);

            const combinedSteps = modeRes.steps.concat(rangeRes.steps);
            state.currentModeRangeResult = { steps: combinedSteps };

            resBox.innerHTML = `<strong>Typetall:</strong> ${modeRes.result ? modeRes.result.join(', ') : 'Ingen'} <br> <strong>Variasjonsbredde:</strong> ${rangeRes.result}`;
            resBox.hidden = false;
            stepsBtn.disabled = false;
            if (!stepsContainer.hidden) {
                renderSteps(combinedSteps, stepsContent);
            }
        });

        const stepsBtn = document.getElementById('btn-show-steps-mode-range');
        const stepsContainer = document.getElementById('step-by-step-container-mode-range');
        const stepsContent = document.getElementById('steps-content-mode-range');
        if (stepsBtn) {
            stepsBtn.addEventListener('click', () => {
                if (stepsContainer.hidden) {
                    stepsContainer.hidden = false;
                    stepsBtn.textContent = 'Skjul utregning';
                    stepsBtn.setAttribute('aria-expanded', 'true');
                    if (state.currentModeRangeResult) renderSteps(state.currentModeRangeResult.steps, stepsContent);
                } else {
                    stepsContainer.hidden = true;
                    stepsBtn.textContent = 'Vis utregning';
                    stepsBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    // TO UKJENTE (LIKNINGSSETT)
    const eqForm = document.getElementById('eq-system-form');
    if (eqForm) {
        eqForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(eqForm);
            const val = validateEquationSystemInput(
                formData.get('a1'), formData.get('b1'), formData.get('c1'),
                formData.get('a2'), formData.get('b2'), formData.get('c2')
            );
            const hintBox = document.getElementById('validation-hint-eq-system');
            const resBox = document.getElementById('result-eq-system');
            const stepsBtn = document.getElementById('btn-show-steps-eq-system');
            const stepsContainer = document.getElementById('step-by-step-container-eq-system');
            const stepsContent = document.getElementById('steps-content-eq-system');

            if (!val.isValid) {
                showHint(hintBox, val.hint);
                stepsBtn.disabled = true;
                stepsContainer.hidden = true;
                resBox.hidden = true;
                return;
            }
            hideHint(hintBox);

            const res = analyzeEquationSystem(val.values.a1, val.values.b1, val.values.c1, val.values.a2, val.values.b2, val.values.c2);
            state.currentEqResult = res;

            if (res.result) {
                resBox.innerHTML = `<strong>x =</strong> ${res.result.x.toFixed(2)}, <strong>y =</strong> ${res.result.y.toFixed(2)}`;
            } else {
                resBox.innerHTML = `<strong>Resultat:</strong> Ingen unik løsning.`;
            }
            resBox.hidden = false;
            stepsBtn.disabled = false;
            if (!stepsContainer.hidden) {
                renderSteps(res.steps, stepsContent);
            }
        });

        const stepsBtn = document.getElementById('btn-show-steps-eq-system');
        const stepsContainer = document.getElementById('step-by-step-container-eq-system');
        const stepsContent = document.getElementById('steps-content-eq-system');
        if(stepsBtn) {
            stepsBtn.addEventListener('click', () => {
                if (stepsContainer.hidden) {
                    stepsContainer.hidden = false;
                    stepsBtn.textContent = 'Skjul utregning';
                    stepsBtn.setAttribute('aria-expanded', 'true');
                    if (state.currentEqResult) renderSteps(state.currentEqResult.steps, stepsContent);
                } else {
                    stepsContainer.hidden = true;
                    stepsBtn.textContent = 'Vis utregning';
                    stepsBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    // FAKTORISERING
    const factForm = document.getElementById('factoring-form');
    if (factForm) {
        factForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(factForm);
            const val = validateQuadraticInput(formData.get('a'), formData.get('b'), formData.get('c'));
            const hintBox = document.getElementById('validation-hint-factoring');
            const resBox = document.getElementById('result-factoring');
            const stepsBtn = document.getElementById('btn-show-steps-factoring');
            const stepsContainer = document.getElementById('step-by-step-container-factoring');
            const stepsContent = document.getElementById('steps-content-factoring');

            if (!val.isValid) {
                showHint(hintBox, val.hint);
                stepsBtn.disabled = true;
                stepsContainer.hidden = true;
                resBox.hidden = true;
                return;
            }
            hideHint(hintBox);

            const res = analyzeFactoring(val.values.a, val.values.b, val.values.c);
            state.currentFactResult = res;

            if (res.result) {
                resBox.innerHTML = `<strong>Faktorisert uttrykk:</strong> ${res.result.a}(x - ${res.result.root1.toFixed(2)})(x - ${res.result.root2.toFixed(2)})`;
            } else {
                resBox.innerHTML = `<strong>Kan ikke faktoriseres med reelle tall.</strong>`;
            }
            resBox.hidden = false;
            stepsBtn.disabled = false;
            if (!stepsContainer.hidden) {
                renderSteps(res.steps, stepsContent);
            }
        });

        const stepsBtn = document.getElementById('btn-show-steps-factoring');
        const stepsContainer = document.getElementById('step-by-step-container-factoring');
        const stepsContent = document.getElementById('steps-content-factoring');
        if(stepsBtn) {
            stepsBtn.addEventListener('click', () => {
                if (stepsContainer.hidden) {
                    stepsContainer.hidden = false;
                    stepsBtn.textContent = 'Skjul utregning';
                    stepsBtn.setAttribute('aria-expanded', 'true');
                    if (state.currentFactResult) renderSteps(state.currentFactResult.steps, stepsContent);
                } else {
                    stepsContainer.hidden = true;
                    stepsBtn.textContent = 'Vis utregning';
                    stepsBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    // VOLUM
    const volForm = document.getElementById('volume-form');
    if (volForm) {
        const shapeSelect = document.getElementById('volume-shape');
        const label1 = document.getElementById('vol-label-1');
        const label2 = document.getElementById('vol-label-2');
        const input2Group = document.getElementById('vol-input2-group');
        const val2Input = document.getElementById('vol-val2');

        shapeSelect.addEventListener('change', () => {
            if (shapeSelect.value === 'cylinder') {
                label1.textContent = 'Radius (r)';
                input2Group.style.display = 'block';
                val2Input.required = true;
            } else if (shapeSelect.value === 'cube') {
                label1.textContent = 'Sidekant (s)';
                input2Group.style.display = 'none';
                val2Input.required = false;
            } else if (shapeSelect.value === 'sphere') {
                label1.textContent = 'Radius (r)';
                input2Group.style.display = 'none';
                val2Input.required = false;
            }
        });

        volForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(volForm);
            const val = validateVolumeInput(formData.get('shape'), formData.get('val1'), formData.get('val2'));
            const hintBox = document.getElementById('validation-hint-volume');
            const resBox = document.getElementById('result-volume');
            const stepsBtn = document.getElementById('btn-show-steps-volume');
            const stepsContainer = document.getElementById('step-by-step-container-volume');
            const stepsContent = document.getElementById('steps-content-volume');

            if (!val.isValid) {
                showHint(hintBox, val.hint);
                stepsBtn.disabled = true;
                stepsContainer.hidden = true;
                resBox.hidden = true;
                return;
            }
            hideHint(hintBox);

            const res = analyzeVolume(val.values.shape, val.values.val1, val.values.val2);
            state.currentVolResult = res;

            resBox.innerHTML = `<strong>Volum:</strong> ${res.result.toFixed(2)}`;
            resBox.hidden = false;
            stepsBtn.disabled = false;
            if (!stepsContainer.hidden) {
                renderSteps(res.steps, stepsContent);
            }
        });

        const stepsBtn = document.getElementById('btn-show-steps-volume');
        const stepsContainer = document.getElementById('step-by-step-container-volume');
        const stepsContent = document.getElementById('steps-content-volume');
        if(stepsBtn) {
            stepsBtn.addEventListener('click', () => {
                if (stepsContainer.hidden) {
                    stepsContainer.hidden = false;
                    stepsBtn.textContent = 'Skjul utregning';
                    stepsBtn.setAttribute('aria-expanded', 'true');
                    if (state.currentVolResult) renderSteps(state.currentVolResult.steps, stepsContent);
                } else {
                    stepsContainer.hidden = true;
                    stepsBtn.textContent = 'Vis utregning';
                    stepsBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    // BRØKREGNING
    const fracForm = document.getElementById('fractions-form');
    if (fracForm) {
        fracForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(fracForm);
            const val = validateFractionInput(formData.get('n1'), formData.get('d1'), formData.get('n2'), formData.get('d2'));
            const op = formData.get('operation');

            const hintBox = document.getElementById('validation-hint-fractions');
            const resBox = document.getElementById('result-fractions');
            const stepsBtn = document.getElementById('btn-show-steps-fractions');
            const stepsContainer = document.getElementById('step-by-step-container-fractions');
            const stepsContent = document.getElementById('steps-content-fractions');

            if (!val.isValid) {
                showHint(hintBox, val.hint);
                stepsBtn.disabled = true;
                stepsContainer.hidden = true;
                resBox.hidden = true;
                return;
            }
            hideHint(hintBox);

            const res = analyzeFractions(val.values.n1, val.values.d1, val.values.n2, val.values.d2, op);
            state.currentFracResult = res;

            if (res.resultD === 1) {
                resBox.innerHTML = `<strong>Resultat:</strong> ${res.resultN}`;
            } else {
                resBox.innerHTML = `<strong>Resultat:</strong> ${res.resultN} / ${res.resultD}`;
            }
            resBox.hidden = false;
            stepsBtn.disabled = false;
            if (!stepsContainer.hidden) {
                renderSteps(res.steps, stepsContent);
            }
        });

        const stepsBtn = document.getElementById('btn-show-steps-fractions');
        const stepsContainer = document.getElementById('step-by-step-container-fractions');
        const stepsContent = document.getElementById('steps-content-fractions');
        if(stepsBtn) {
            stepsBtn.addEventListener('click', () => {
                if (stepsContainer.hidden) {
                    stepsContainer.hidden = false;
                    stepsBtn.textContent = 'Skjul utregning';
                    stepsBtn.setAttribute('aria-expanded', 'true');
                    if (state.currentFracResult) renderSteps(state.currentFracResult.steps, stepsContent);
                } else {
                    stepsContainer.hidden = true;
                    stepsBtn.textContent = 'Vis utregning';
                    stepsBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    // Helper function for simple inputs (Mean, Median)
    function setupModuleUI(id, validateFn, analyzeFn, formatResFn) {
        const form = document.getElementById(`${id}-form`);
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const inputVal = formData.get('list') || formData.get('number'); // Handle different single inputs if needed
                const val = validateFn(inputVal);

                const hintBox = document.getElementById(`validation-hint-${id}`);
                const resBox = document.getElementById(`result-${id}`);
                const stepsBtn = document.getElementById(`btn-show-steps-${id}`);
                const stepsContainer = document.getElementById(`step-by-step-container-${id}`);
                const stepsContent = document.getElementById(`steps-content-${id}`);

                if (!val.isValid) {
                    showHint(hintBox, val.hint);
                    stepsBtn.disabled = true;
                    stepsContainer.hidden = true;
                    resBox.hidden = true;
                    return;
                }
                hideHint(hintBox);

                const res = analyzeFn(val.values.inputStr || val.values.number);
                state[`current${id}Result`] = res;

                resBox.innerHTML = formatResFn(res);
                resBox.hidden = false;
                stepsBtn.disabled = false;
                if (!stepsContainer.hidden) {
                    renderSteps(res.steps, stepsContent);
                }
            });

            const stepsBtn = document.getElementById(`btn-show-steps-${id}`);
            const stepsContainer = document.getElementById(`step-by-step-container-${id}`);
            const stepsContent = document.getElementById(`steps-content-${id}`);
            if(stepsBtn) {
                stepsBtn.addEventListener('click', () => {
                    if (stepsContainer.hidden) {
                        stepsContainer.hidden = false;
                        stepsBtn.textContent = 'Skjul utregning';
                        stepsBtn.setAttribute('aria-expanded', 'true');
                        if (state[`current${id}Result`]) renderSteps(state[`current${id}Result`].steps, stepsContent);
                    } else {
                        stepsContainer.hidden = true;
                        stepsBtn.textContent = 'Vis utregning';
                        stepsBtn.setAttribute('aria-expanded', 'false');
                    }
                });
            }
        }
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
