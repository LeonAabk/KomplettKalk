import { validateQuadraticInput, validateLinearInput, validatePercentInput, validatePythagorasInput, validateAreaInput, validateTrigonometryInput, validateABCInput, validateVertexInput, validatePowerInput, validateSquareRootInput, validateStatisticsInput, validateEquationSystemInput, validateVolumeInput, validateFractionInput, validateCompoundInterest, validateVAT, validateUnitConversion, validateSymmetryLine, validateLinearRoot, validateAverageRateOfChange, validateSimilarity, validatePhysicsSpeed, validatePhysicsDensity, validateProbPermComb, validateEconMarkup,     validateGeomSector,
    validateAlgLog10,
    validateAsymptotes,
    validateRationalEq,
    validateCongruence,
    validateTriangleSolver,
    validateCurrency,
    validateSalaryTax,
    validateMechEnergy,
    validateExponentialInput,
    validateProportionalityInput,
    validateStdDevInput,
    validateNewton2Input,
    validateWorkPowerInput,
    validateSpeedConversionInput,
    validateSurfaceAreaInput,
    validateDepreciationInput,
    validateAnnuityLoanInput,
    validateBinomialInput
} from '../utils/validation.js';
import { analyzeQuadratic, analyzeLinear, analyzeABC, analyzeVertex, analyzeEquationSystem, analyzeFactoring, analyzeSymmetryLine, analyzeLinearRoot, analyzeAverageRateOfChange, analyzeLog10, analyzeAsymptotes, analyzeRationalEq, analyzeExponential, analyzeProportionality } from '../modules/algebra.js';
import { analyzePercent, analyzePercentChange, analyzePower, analyzeSquareRoot, analyzeFractions } from '../modules/basic.js';
import { analyzePythagoras, analyzeArea, analyzeTrigonometry, analyzeVolume, analyzeSimilarity, analyzeSector, analyzeCongruence, analyzeTriangleSolver, analyzeSurfaceArea } from '../modules/geometry.js';
import { analyzeMean, analyzeMedian, analyzeMode, analyzeRange, analyzeStdDevAndVariance } from '../modules/statistics.js';
import { analyzeCompoundInterest, analyzeVAT, analyzeMarkup, analyzeCurrency, analyzeSalaryTax, analyzeDepreciation, analyzeAnnuityLoan } from '../modules/economics.js';
import { analyzeSpeed, analyzeDensity, analyzeMechEnergy, analyzeNewton2, analyzeWorkPower } from '../modules/physics.js';
import { analyzeNPR, analyzeNCR, analyzeBinomial } from '../modules/probability.js';
import { analyzeUnitConversion, analyzeSpeedConversion } from '../modules/conversion.js';
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
    const appContainer = document.querySelector('.app-container');
    const navUl = document.querySelector('.sidebar-nav ul');

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
                } else {
                    alert('Denne modulen mangler HTML-struktur!');
                    dashboardGrid.style.display = 'grid';
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

    // Dynamisk generering av Sidemeny
    if (navUl) {
        navUl.innerHTML = '';

        // Finn unike kategorier
        const uniqueCategories = [...new Set(functionData.map(item => item.category))];

        // Alle emner øverst
        const alleLi = document.createElement('li');
        alleLi.innerHTML = '<a href="#alle" class="active">Alle Emner</a>';
        navUl.appendChild(alleLi);

        // Kategori-navn oversettelse
        const categoryNames = {
            'okonomi': 'Økonomi',
            'grunnleggende': 'Grunnleggende'
        };

        // Legg til de andre kategoriene
        uniqueCategories.forEach(cat => {
            const li = document.createElement('li');
            let displayName = categoryNames[cat] || (cat.charAt(0).toUpperCase() + cat.slice(1));
            li.innerHTML = `<a href="#${cat}">${displayName}</a>`;
            navUl.appendChild(li);
        });

        // Filtreringslogikk for nye lenker
        const newSidebarLinks = navUl.querySelectorAll('a');
        newSidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // Update active state
                newSidebarLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                const category = link.getAttribute('href').substring(1); // remove '#'

                // Filtrer kort
                const moduleCards = document.querySelectorAll('.module-card');
                moduleCards.forEach(card => {
                    if (category === 'alle' || card.getAttribute('data-category') === category) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });

                // Sørg for at dashboardet vises og moduler skjules
                document.querySelectorAll('.educational-module').forEach(mod => {
                    mod.style.display = 'none';
                });
                dashboardGrid.style.display = 'grid';
            });
        });
    }

    // Tab Switching for Assistant Sidebar
    const tabBtns = document.querySelectorAll('.assistant-tabs .tab-btn');
    const tabPanes = document.querySelectorAll('.assistant-tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Add active to clicked
            btn.classList.add('active');
            const targetPaneId = btn.getAttribute('data-tab');
            const targetPane = document.getElementById(targetPaneId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    // Scratchpad Auto-save
    const scratchpadInput = document.getElementById('scratchpad-input');
    if (scratchpadInput) {
        const savedNotes = localStorage.getItem('scratchpadContent');
        if (savedNotes) {
            scratchpadInput.value = savedNotes;
        }
        scratchpadInput.addEventListener('input', (e) => {
            localStorage.setItem('scratchpadContent', e.target.value);
        });
    }

    // Unit Circle Drawing
    const unitCircleCanvas = document.getElementById('unit-circle-canvas');
    if (unitCircleCanvas) {
        drawUnitCircle(unitCircleCanvas);
    }

    // Render KaTeX for Reference Tab
    const referenceTab = document.getElementById('tab-reference');
    if (referenceTab && typeof window.renderMathInElement !== 'undefined') {
        window.renderMathInElement(referenceTab, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '\\[', right: '\\]', display: true},
                {left: '\\(', right: '\\)', display: false}
            ],
            throwOnError: false
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


    // Helper function for new modules
    function setupAdvancedModuleUI(id, validateFn, analyzeFn, formatResFn) {
        const form = document.getElementById(`${id}-form`);
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const val = validateFn(formData);

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

                const res = analyzeFn(val.values, formData);
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

    setupAdvancedModuleUI('compound-interest',
        (fd) => validateCompoundInterest(fd.get('principal'), fd.get('rate'), fd.get('years')),
        (vals, fd) => analyzeCompoundInterest(vals.principal, vals.rate, vals.years),
        (res) => `<strong>Sluttbeløp:</strong> ${res.result.toFixed(2)} kr`
    );

    setupAdvancedModuleUI('vat',
        (fd) => validateVAT(fd.get('price'), fd.get('vatRate')),
        (vals, fd) => analyzeVAT(vals.price, fd.get('operation') === 'add', vals.vatRate),
        (res) => `<strong>Ny pris:</strong> ${res.result.toFixed(2)} kr <br> <strong>MVA-beløp:</strong> ${res.vatAmount.toFixed(2)} kr`
    );

    setupAdvancedModuleUI('unit-conversion',
        (fd) => validateUnitConversion(fd.get('value')),
        (vals, fd) => analyzeUnitConversion(fd.get('dimension'), vals.value, fd.get('fromUnit'), fd.get('toUnit')),
        (res) => res.result !== null ? `<strong>Resultat:</strong> ${res.displayResult}` : `<strong>Feil:</strong> Ugyldig enhet.`
    );

    setupAdvancedModuleUI('symmetry-line',
        (fd) => validateSymmetryLine(fd.get('a'), fd.get('b')),
        (vals, fd) => analyzeSymmetryLine(vals.a, vals.b),
        (res) => `<strong>Symmetrilinje:</strong> x = ${res.result.toFixed(2)}`
    );

    setupAdvancedModuleUI('linear-root',
        (fd) => validateLinearRoot(fd.get('a'), fd.get('b')),
        (vals, fd) => analyzeLinearRoot(vals.a, vals.b),
        (res) => `<strong>Nullpunkt:</strong> ${typeof res.result === 'number' ? 'x = ' + res.result.toFixed(2) : res.result}`
    );

    setupAdvancedModuleUI('average-rate',
        (fd) => validateAverageRateOfChange(fd.get('x1'), fd.get('y1'), fd.get('x2'), fd.get('y2')),
        (vals, fd) => analyzeAverageRateOfChange(vals.x1, vals.y1, vals.x2, vals.y2),
        (res) => `<strong>Gjennomsnittlig vekstfart:</strong> ${typeof res.result === 'number' ? res.result.toFixed(2) : res.result}`
    );

    setupAdvancedModuleUI('similarity',
        (fd) => validateSimilarity(fd.get('s1'), fd.get('l1'), fd.get('s2'), fd.get('l2')),
        (vals, fd) => analyzeSimilarity(vals.s1, vals.l1, vals.s2, vals.l2),
        (res) => `<strong>Ukjent side:</strong> ${res.result.toFixed(2)}`
    );

    setupAdvancedModuleUI('physics-speed',
        (fd) => validatePhysicsSpeed(fd.get('s'), fd.get('v'), fd.get('t')),
        (vals, fd) => analyzeSpeed(isNaN(vals.s) ? null : vals.s, isNaN(vals.v) ? null : vals.v, isNaN(vals.t) ? null : vals.t),
        (res) => {
            const labelMap = { s: 'Strekning (s)', v: 'Fart (v)', t: 'Tid (t)' };
            return `<strong>${labelMap[res.missing]}:</strong> ${res.result.toFixed(2)}`;
        }
    );

    setupAdvancedModuleUI('physics-density',
        (fd) => validatePhysicsDensity(fd.get('m'), fd.get('v')),
        (vals, fd) => analyzeDensity(vals.m, vals.v),
        (res) => `<strong>Massetetthet (&rho;):</strong> ${res.result.toFixed(2)}`
    );

    setupAdvancedModuleUI('prob-npr',
        (fd) => validateProbPermComb(fd.get('n'), fd.get('r')),
        (vals, fd) => analyzeNPR(vals.n, vals.r),
        (res) => `<strong>nPr:</strong> ${res.result}`
    );

    setupAdvancedModuleUI('prob-ncr',
        (fd) => validateProbPermComb(fd.get('n'), fd.get('r')),
        (vals, fd) => analyzeNCR(vals.n, vals.r),
        (res) => `<strong>nCr:</strong> ${res.result}`
    );

    setupAdvancedModuleUI('binomial',
        (fd) => validateBinomialInput(fd.get('n'), fd.get('p'), fd.get('k')),
        (vals, fd) => analyzeBinomial(vals.n, vals.p, vals.k),
        (res) => `<strong>P(X=${document.getElementById('binom-k') ? document.getElementById('binom-k').value : 'k'}):</strong> ${res.result.toFixed(4)}`
    );

    setupAdvancedModuleUI('econ-markup',
        (fd) => validateEconMarkup(fd.get('cost'), fd.get('freight'), fd.get('markup')),
        (vals, fd) => analyzeMarkup(vals.cost, vals.freight, vals.markup),
        (res) => `<strong>Selvkost:</strong> ${res.selvkost.toFixed(2)} kr<br><strong>Utsalgspris eks. MVA:</strong> ${res.utsalgspris.toFixed(2)} kr`
    );

    setupAdvancedModuleUI('depreciation',
        (fd) => validateDepreciationInput(fd.get('value'), fd.get('rate')),
        (vals, fd) => analyzeDepreciation(vals.value, vals.rate),
        (res) => `<strong>Verditap:</strong> ${res.result.toFixed(2)} kr<br><strong>Bokført verdi etter år 1:</strong> ${res.newValue.toFixed(2)} kr`
    );

    setupAdvancedModuleUI('annuity-loan',
        (fd) => validateAnnuityLoanInput(fd.get('loan'), fd.get('rate'), fd.get('terms')),
        (vals, fd) => analyzeAnnuityLoan(vals.loan, vals.rate, vals.terms),
        (res) => `<strong>Terminbeløp:</strong> ${res.result.toFixed(2)} kr`
    );

    setupAdvancedModuleUI('geom-sector',
        (fd) => validateGeomSector(fd.get('r'), fd.get('v')),
        (vals, fd) => analyzeSector(vals.r, vals.v),
        (res) => `<strong>Areal:</strong> ${res.area.toFixed(2)}<br><strong>Buelengde:</strong> ${res.arcLength.toFixed(2)}`
    );

    setupAdvancedModuleUI('alg-log10',
        (fd) => validateAlgLog10(fd.get('x')),
        (vals, fd) => analyzeLog10(vals.x),
        (res) => `<strong>Svar:</strong> ${res.result.toFixed(4)}`
    );



    setupAdvancedModuleUI('asymptotes',
        (fd) => validateAsymptotes(fd.get('a'), fd.get('b'), fd.get('c'), fd.get('d')),
        (vals, fd) => analyzeAsymptotes(vals.a, vals.b, vals.c, vals.d),
        (res) => `<strong>Resultat:</strong> ${res.result}`
    );

    setupAdvancedModuleUI('rational-eq',
        (fd) => validateRationalEq(fd.get('a'), fd.get('b'), fd.get('c')),
        (vals, fd) => analyzeRationalEq(vals.a, vals.b, vals.c),
        (res) => `<strong>x =</strong> ${typeof res.result === 'number' ? res.result.toFixed(2) : res.result}`
    );

    setupAdvancedModuleUI('congruence',
        (fd) => validateCongruence(fd.get('t1_1'), fd.get('t1_2'), fd.get('t1_3'), fd.get('t2_1'), fd.get('t2_2'), fd.get('t2_3')),
        (vals, fd) => analyzeCongruence(fd.get('method'), vals.t1, vals.t2),
        (res) => `<strong>Svar:</strong> ${res.result}`
    );

    setupAdvancedModuleUI('triangle-solver',
        (fd) => validateTriangleSolver(fd.get('val1'), fd.get('val2'), fd.get('val3')),
        (vals, fd) => analyzeTriangleSolver(fd.get('method'), vals.val1, vals.val2, vals.val3),
        (res) => `<strong>Ukjent ${res.type}:</strong> ${typeof res.result === 'number' ? res.result.toFixed(2) + (res.type === 'vinkel' ? '°' : '') : res.result}`
    );

    setupAdvancedModuleUI('currency',
        (fd) => validateCurrency(fd.get('amount'), fd.get('rate'), fd.get('fromCurr'), fd.get('toCurr')),
        (vals, fd) => analyzeCurrency(vals.amount, vals.rate, vals.fromCurr, vals.toCurr),
        (res) => `<strong>Resultat:</strong> ${res.result.toFixed(2)}`
    );

    setupAdvancedModuleUI('salary-tax',
        (fd) => validateSalaryTax(fd.get('gross'), fd.get('taxRate'), fd.get('deduction')),
        (vals, fd) => analyzeSalaryTax(vals.gross, vals.taxRate, vals.deduction),
        (res) => `<strong>Nettolønn:</strong> ${res.result.toFixed(2)} kr`
    );

    setupAdvancedModuleUI('mech-energy',
        (fd) => validateMechEnergy(fd.get('m'), fd.get('v'), fd.get('h')),
        (vals, fd) => analyzeMechEnergy(vals.m, vals.v, vals.h),
        (res) => `<strong>Total Mekanisk Energi:</strong> ${res.result.toFixed(2)} J`
    );


    setupAdvancedModuleUI('exponential',
        (fd) => validateExponentialInput(fd.get('a'), fd.get('b'), fd.get('x')),
        (vals, fd) => analyzeExponential(vals.a, vals.b, vals.x),
        (res) => `<strong>Resultat:</strong> ${res.result}`
    );

    setupAdvancedModuleUI('proportionality',
        (fd) => validateProportionalityInput(fd.get('x'), fd.get('y')),
        (vals, fd) => analyzeProportionality(vals.x, vals.y),
        (res) => `<strong>Resultat:</strong> ${res.result}`
    );

    setupAdvancedModuleUI('stddev',
        (fd) => validateStdDevInput(fd.get('data')),
        (vals, fd) => analyzeStdDevAndVariance(vals.dataArray),
        (res) => `<strong>Resultat:</strong> ${res.result}`
    );

    setupAdvancedModuleUI('newton2',
        (fd) => validateNewton2Input(fd.get('f'), fd.get('m'), fd.get('a')),
        (vals, fd) => analyzeNewton2(vals.f, vals.m, vals.a),
        (res) => `<strong>Resultat:</strong> ${res.result}`
    );

    setupAdvancedModuleUI('work-power',
        (fd) => validateWorkPowerInput(fd.get('f'), fd.get('s'), fd.get('t')),
        (vals, fd) => analyzeWorkPower(vals.f, vals.s, vals.t),
        (res) => `<strong>Resultat:</strong> ${res.result}`
    );

    setupAdvancedModuleUI('speed-conversion',
        (fd) => validateSpeedConversionInput(fd.get('val'), fd.get('dir')),
        (vals, fd) => analyzeSpeedConversion(vals.val, vals.dir),
        (res) => `<strong>Resultat:</strong> ${res.result}`
    );

    // Dynamic UI updates for Surface Area
    const surfaceAreaShape = document.getElementById('surface-area-shape');
    if (surfaceAreaShape) {
        const input2Group = document.getElementById('surf-input2-group');
        const label2 = document.getElementById('surf-label-2');
        const val2Input = document.getElementById('surf-val2');

        surfaceAreaShape.addEventListener('change', (e) => {
            const shape = e.target.value;
            if (shape === 'sphere') {
                input2Group.style.display = 'none';
                val2Input.required = false;
            } else if (shape === 'cylinder') {
                input2Group.style.display = 'block';
                label2.textContent = 'Høyde (h)';
                val2Input.required = true;
            } else if (shape === 'cone') {
                input2Group.style.display = 'block';
                label2.textContent = 'Sidekant (s)';
                val2Input.required = true;
            }
        });
    }

    setupAdvancedModuleUI('surface-area',
        (fd) => validateSurfaceAreaInput(fd.get('shape'), fd.get('val1'), fd.get('val2')),
        (vals, fd) => analyzeSurfaceArea(vals.shape, vals.val1, vals.val2),
        (res) => `<strong>Overflateareal:</strong> ${res.result.toFixed(2)}`
    );

    // Dynamic UI updates for Congruence and Triangle Solver
    const triSolverMethod = document.getElementById('tri-method');
    if (triSolverMethod) {
        triSolverMethod.addEventListener('change', (e) => {
            const method = e.target.value;
            const l1 = document.getElementById('label-tri-1');
            const l2 = document.getElementById('label-tri-2');
            const l3 = document.getElementById('label-tri-3');
            if (method === 'SAS') {
                l1.innerText = 'Side b:';
                l2.innerText = 'Side c:';
                l3.innerText = 'Vinkel A (°):';
            } else if (method === 'SSS') {
                l1.innerText = 'Side a:';
                l2.innerText = 'Side b:';
                l3.innerText = 'Side c:';
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

function drawUnitCircle(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const r = Math.min(cx, cy) * 0.7; // Radius is 70% of half-width to leave room for text

    // Get styles from CSS variables if possible, fallback to hardcoded
    const style = getComputedStyle(document.body);
    const textPrimary = style.getPropertyValue('--text-primary').trim() || '#ededed';
    const borderCol = style.getPropertyValue('--border-color').trim() || '#52525b';
    const accentCol = style.getPropertyValue('--accent-primary').trim() || '#3b82f6';
    const textSecondary = style.getPropertyValue('--text-secondary').trim() || '#a1a1aa';

    ctx.clearRect(0, 0, width, height);

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = borderCol;
    ctx.lineWidth = 1;
    // X axis
    ctx.moveTo(0, cy);
    ctx.lineTo(width, cy);
    // Y axis
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, height);
    ctx.stroke();

    // Draw circle
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.strokeStyle = textPrimary;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = '12px var(--font-family, sans-serif)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const angles = [
        // 1st quadrant
        { deg: 0, rad: '0', xLabel: '(1, 0)' },
        { deg: 30, rad: 'π/6', xLabel: '(√3/2, 1/2)' },
        { deg: 45, rad: 'π/4', xLabel: '(√2/2, √2/2)' },
        { deg: 60, rad: 'π/3', xLabel: '(1/2, √3/2)' },
        { deg: 90, rad: 'π/2', xLabel: '(0, 1)' },
        // 2nd quadrant
        { deg: 120, rad: '2π/3', xLabel: '(-1/2, √3/2)' },
        { deg: 135, rad: '3π/4', xLabel: '(-√2/2, √2/2)' },
        { deg: 150, rad: '5π/6', xLabel: '(-√3/2, 1/2)' },
        { deg: 180, rad: 'π', xLabel: '(-1, 0)' },
        // 3rd quadrant
        { deg: 210, rad: '7π/6', xLabel: '(-√3/2, -1/2)' },
        { deg: 225, rad: '5π/4', xLabel: '(-√2/2, -√2/2)' },
        { deg: 240, rad: '4π/3', xLabel: '(-1/2, -√3/2)' },
        { deg: 270, rad: '3π/2', xLabel: '(0, -1)' },
        // 4th quadrant
        { deg: 300, rad: '5π/3', xLabel: '(1/2, -√3/2)' },
        { deg: 315, rad: '7π/4', xLabel: '(√2/2, -√2/2)' },
        { deg: 330, rad: '11π/6', xLabel: '(√3/2, -1/2)' }
    ];

    // Using smaller font for coordinates if needed
    ctx.font = '10px var(--font-family, sans-serif)';

    angles.forEach(a => {
        const rad = -a.deg * (Math.PI / 180); // Negative because canvas Y goes down
        const px = cx + r * Math.cos(rad);
        const py = cy + r * Math.sin(rad);

        // Draw line from center to point (only for non-axis points to avoid redrawing axes)
        if (a.deg % 90 !== 0) {
            ctx.beginPath();
            ctx.setLineDash([2, 3]);
            ctx.moveTo(cx, cy);
            ctx.lineTo(px, py);
            ctx.strokeStyle = textSecondary;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Draw dot
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, 2 * Math.PI);
        ctx.fillStyle = accentCol;
        ctx.fill();

        // Position text based on angle
        let textDist = r + 20;
        if (a.deg === 0 || a.deg === 180) {
            textDist = r + 25;
        } else if (a.deg === 90 || a.deg === 270) {
            textDist = r + 15;
        } else {
            textDist = r + 30; // More space for complex non-axis labels
        }

        const tx = cx + textDist * Math.cos(rad);
        const ty = cy + textDist * Math.sin(rad);

        ctx.fillStyle = textPrimary;

        if (a.deg % 90 === 0) {
            ctx.fillText(`${a.deg}° / ${a.rad}`, tx, ty - 6);
            ctx.fillStyle = textSecondary;
            ctx.fillText(`${a.xLabel}`, tx, ty + 6);
        } else {
            ctx.fillText(`${a.deg}° / ${a.rad}`, tx, ty - 6);
            ctx.fillStyle = textSecondary;
            ctx.fillText(`${a.xLabel}`, tx, ty + 6);
        }
    });
}
