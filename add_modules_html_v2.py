import re

with open('index.html', 'r') as f:
    html = f.read()

new_sections = """
        <!-- Asymptotes Module -->
        <section id="module-asymptotes" class="educational-module" aria-labelledby="asymptotes-title" style="display: none;">
            <button class="btn-secondary btn-back-dashboard" style="margin-bottom: 1rem;">&larr; Tilbake til oversikt</button>
            <h2 id="asymptotes-title">Asymptoter (Rasjonell funksjon)</h2>
            <p>Skriv inn koeffisienter for $f(x) = \\frac{ax+b}{cx+d}$</p>

            <form id="asymptotes-form" class="math-form" novalidate>
                <div class="input-group">
                    <label for="asym-a">a =</label>
                    <input type="number" id="asym-a" name="a" step="any" required aria-label="Koeffisient a">
                </div>
                <div class="input-group">
                    <label for="asym-b">b =</label>
                    <input type="number" id="asym-b" name="b" step="any" required aria-label="Koeffisient b">
                </div>
                <div class="input-group">
                    <label for="asym-c">c =</label>
                    <input type="number" id="asym-c" name="c" step="any" required aria-label="Koeffisient c">
                </div>
                <div class="input-group">
                    <label for="asym-d">d =</label>
                    <input type="number" id="asym-d" name="d" step="any" required aria-label="Koeffisient d">
                </div>

                <button type="submit" class="btn-primary">Beregn asymptoter</button>
                <button type="button" id="btn-show-steps-asymptotes" class="btn-secondary" aria-expanded="false" disabled>Vis utregning</button>
            </form>

            <div id="validation-hint-asymptotes" class="hint-box" aria-live="polite" hidden></div>
            <div id="result-asymptotes" class="result-box" aria-live="polite" hidden></div>

            <div id="step-by-step-container-asymptotes" class="steps-box" aria-live="polite" hidden>
                <h3>Utregning:</h3>
                <div id="steps-content-asymptotes"></div>
            </div>
        </section>

        <!-- Rational Eq Module -->
        <section id="module-rational-eq" class="educational-module" aria-labelledby="rational-eq-title" style="display: none;">
            <button class="btn-secondary btn-back-dashboard" style="margin-bottom: 1rem;">&larr; Tilbake til oversikt</button>
            <h2 id="rational-eq-title">Rasjonal ligning</h2>
            <p>Løs ligningen $\\frac{a}{x} = \\frac{b}{c}$</p>

            <form id="rational-eq-form" class="math-form" novalidate>
                <div class="input-group">
                    <label for="rat-a">a =</label>
                    <input type="number" id="rat-a" name="a" step="any" required aria-label="Teller a">
                </div>
                <div class="input-group">
                    <label for="rat-b">b =</label>
                    <input type="number" id="rat-b" name="b" step="any" required aria-label="Teller b">
                </div>
                <div class="input-group">
                    <label for="rat-c">c =</label>
                    <input type="number" id="rat-c" name="c" step="any" required aria-label="Nevner c">
                </div>

                <button type="submit" class="btn-primary">Løs ligning</button>
                <button type="button" id="btn-show-steps-rational-eq" class="btn-secondary" aria-expanded="false" disabled>Vis utregning</button>
            </form>

            <div id="validation-hint-rational-eq" class="hint-box" aria-live="polite" hidden></div>
            <div id="result-rational-eq" class="result-box" aria-live="polite" hidden></div>

            <div id="step-by-step-container-rational-eq" class="steps-box" aria-live="polite" hidden>
                <h3>Utregning:</h3>
                <div id="steps-content-rational-eq"></div>
            </div>
        </section>

        <!-- Congruence Module -->
        <section id="module-congruence" class="educational-module" aria-labelledby="congruence-title" style="display: none;">
            <button class="btn-secondary btn-back-dashboard" style="margin-bottom: 1rem;">&larr; Tilbake til oversikt</button>
            <h2 id="congruence-title">Kongruens-sjekk (Trekant)</h2>
            <p>Sjekk om to trekanter er kongruente basert på SSS, SAS, eller ASA.</p>

            <form id="congruence-form" class="math-form" novalidate>
                <div class="input-group">
                    <label for="cong-method">Metode:</label>
                    <select id="cong-method" name="method">
                        <option value="SSS">Side-Side-Side (SSS)</option>
                        <option value="SAS">Side-Vinkel-Side (SAS)</option>
                        <option value="ASA">Vinkel-Side-Vinkel (ASA)</option>
                    </select>
                </div>

                <h4>Trekant 1</h4>
                <div class="input-group">
                    <label for="cong-t1-1" id="label-t1-1">Side 1:</label>
                    <input type="number" id="cong-t1-1" name="t1_1" step="any" required aria-label="Verdi 1 for Trekant 1">
                </div>
                <div class="input-group">
                    <label for="cong-t1-2" id="label-t1-2">Side 2:</label>
                    <input type="number" id="cong-t1-2" name="t1_2" step="any" required aria-label="Verdi 2 for Trekant 1">
                </div>
                <div class="input-group">
                    <label for="cong-t1-3" id="label-t1-3">Side 3:</label>
                    <input type="number" id="cong-t1-3" name="t1_3" step="any" required aria-label="Verdi 3 for Trekant 1">
                </div>

                <h4>Trekant 2</h4>
                <div class="input-group">
                    <label for="cong-t2-1" id="label-t2-1">Side 1:</label>
                    <input type="number" id="cong-t2-1" name="t2_1" step="any" required aria-label="Verdi 1 for Trekant 2">
                </div>
                <div class="input-group">
                    <label for="cong-t2-2" id="label-t2-2">Side 2:</label>
                    <input type="number" id="cong-t2-2" name="t2_2" step="any" required aria-label="Verdi 2 for Trekant 2">
                </div>
                <div class="input-group">
                    <label for="cong-t2-3" id="label-t2-3">Side 3:</label>
                    <input type="number" id="cong-t2-3" name="t2_3" step="any" required aria-label="Verdi 3 for Trekant 2">
                </div>

                <button type="submit" class="btn-primary">Sjekk kongruens</button>
                <button type="button" id="btn-show-steps-congruence" class="btn-secondary" aria-expanded="false" disabled>Vis utregning</button>
            </form>

            <div id="validation-hint-congruence" class="hint-box" aria-live="polite" hidden></div>
            <div id="result-congruence" class="result-box" aria-live="polite" hidden></div>

            <div id="step-by-step-container-congruence" class="steps-box" aria-live="polite" hidden>
                <h3>Svar:</h3>
                <div id="steps-content-congruence"></div>
            </div>
        </section>

        <!-- Triangle Solver Module -->
        <section id="module-triangle-solver" class="educational-module" aria-labelledby="triangle-solver-title" style="display: none;">
            <button class="btn-secondary btn-back-dashboard" style="margin-bottom: 1rem;">&larr; Tilbake til oversikt</button>
            <h2 id="triangle-solver-title">Trekantløseren</h2>
            <p>Bruk sinus- eller cosinussetningen. Velg hva som er kjent.</p>

            <form id="triangle-solver-form" class="math-form" novalidate>
                <div class="input-group">
                    <label for="tri-method">Hva vet du?</label>
                    <select id="tri-method" name="method">
                        <option value="SAS">To sider og vinkel mellom (SAS) -> Finn side</option>
                        <option value="SSS">Tre sider (SSS) -> Finn vinkel</option>
                    </select>
                </div>

                <div class="input-group" id="tri-group-1">
                    <label for="tri-val-1" id="label-tri-1">Side b:</label>
                    <input type="number" id="tri-val-1" name="val1" step="any" required aria-label="Verdi 1">
                </div>
                <div class="input-group" id="tri-group-2">
                    <label for="tri-val-2" id="label-tri-2">Side c:</label>
                    <input type="number" id="tri-val-2" name="val2" step="any" required aria-label="Verdi 2">
                </div>
                <div class="input-group" id="tri-group-3">
                    <label for="tri-val-3" id="label-tri-3">Vinkel A (°):</label>
                    <input type="number" id="tri-val-3" name="val3" step="any" required aria-label="Verdi 3">
                </div>

                <button type="submit" class="btn-primary">Beregn</button>
                <button type="button" id="btn-show-steps-triangle-solver" class="btn-secondary" aria-expanded="false" disabled>Vis utregning</button>
            </form>

            <div id="validation-hint-triangle-solver" class="hint-box" aria-live="polite" hidden></div>
            <div id="result-triangle-solver" class="result-box" aria-live="polite" hidden></div>

            <div id="step-by-step-container-triangle-solver" class="steps-box" aria-live="polite" hidden>
                <h3>Utregning:</h3>
                <div id="steps-content-triangle-solver"></div>
            </div>
        </section>

        <!-- Currency Module -->
        <section id="module-currency" class="educational-module" aria-labelledby="currency-title" style="display: none;">
            <button class="btn-secondary btn-back-dashboard" style="margin-bottom: 1rem;">&larr; Tilbake til oversikt</button>
            <h2 id="currency-title">Valutakalkulator</h2>

            <form id="currency-form" class="math-form" novalidate>
                <div class="input-group">
                    <label for="curr-amount">Beløp:</label>
                    <input type="number" id="curr-amount" name="amount" step="any" required aria-label="Beløp">
                </div>
                <div class="input-group">
                    <label for="curr-from">Fra-valuta:</label>
                    <input type="text" id="curr-from" name="fromCurr" required aria-label="Fra valuta (f.eks. EUR)" placeholder="f.eks. EUR">
                </div>
                <div class="input-group">
                    <label for="curr-to">Til-valuta:</label>
                    <input type="text" id="curr-to" name="toCurr" required aria-label="Til valuta (f.eks. NOK)" placeholder="f.eks. NOK">
                </div>
                <div class="input-group">
                    <label for="curr-rate">Kurs:</label>
                    <input type="number" id="curr-rate" name="rate" step="any" required aria-label="Kurs">
                </div>

                <button type="submit" class="btn-primary">Beregn valuta</button>
                <button type="button" id="btn-show-steps-currency" class="btn-secondary" aria-expanded="false" disabled>Vis utregning</button>
            </form>

            <div id="validation-hint-currency" class="hint-box" aria-live="polite" hidden></div>
            <div id="result-currency" class="result-box" aria-live="polite" hidden></div>

            <div id="step-by-step-container-currency" class="steps-box" aria-live="polite" hidden>
                <h3>Utregning:</h3>
                <div id="steps-content-currency"></div>
            </div>
        </section>

        <!-- Salary Tax Module -->
        <section id="module-salary-tax" class="educational-module" aria-labelledby="salary-tax-title" style="display: none;">
            <button class="btn-secondary btn-back-dashboard" style="margin-bottom: 1rem;">&larr; Tilbake til oversikt</button>
            <h2 id="salary-tax-title">Lønn og Skatt</h2>

            <form id="salary-tax-form" class="math-form" novalidate>
                <div class="input-group">
                    <label for="salary-gross">Bruttolønn:</label>
                    <input type="number" id="salary-gross" name="gross" step="any" required aria-label="Bruttolønn">
                </div>
                <div class="input-group">
                    <label for="salary-deduction">Fradrag:</label>
                    <input type="number" id="salary-deduction" name="deduction" step="any" value="0" required aria-label="Fradrag (valgfritt)">
                </div>
                <div class="input-group">
                    <label for="salary-tax-rate">Skattetrekk (%):</label>
                    <input type="number" id="salary-tax-rate" name="taxRate" step="any" required aria-label="Skattetrekk">
                </div>

                <button type="submit" class="btn-primary">Beregn nettolønn</button>
                <button type="button" id="btn-show-steps-salary-tax" class="btn-secondary" aria-expanded="false" disabled>Vis utregning</button>
            </form>

            <div id="validation-hint-salary-tax" class="hint-box" aria-live="polite" hidden></div>
            <div id="result-salary-tax" class="result-box" aria-live="polite" hidden></div>

            <div id="step-by-step-container-salary-tax" class="steps-box" aria-live="polite" hidden>
                <h3>Utregning:</h3>
                <div id="steps-content-salary-tax"></div>
            </div>
        </section>

        <!-- Mechanical Energy Module -->
        <section id="module-mech-energy" class="educational-module" aria-labelledby="mech-energy-title" style="display: none;">
            <button class="btn-secondary btn-back-dashboard" style="margin-bottom: 1rem;">&larr; Tilbake til oversikt</button>
            <h2 id="mech-energy-title">Mekanisk Energi</h2>

            <form id="mech-energy-form" class="math-form" novalidate>
                <div class="input-group">
                    <label for="mech-m">Masse m (kg):</label>
                    <input type="number" id="mech-m" name="m" step="any" required aria-label="Masse i kg">
                </div>
                <div class="input-group">
                    <label for="mech-v">Fart v (m/s):</label>
                    <input type="number" id="mech-v" name="v" step="any" required aria-label="Fart i m/s">
                </div>
                <div class="input-group">
                    <label for="mech-h">Høyde h (m):</label>
                    <input type="number" id="mech-h" name="h" step="any" required aria-label="Høyde i meter">
                </div>

                <button type="submit" class="btn-primary">Beregn energi</button>
                <button type="button" id="btn-show-steps-mech-energy" class="btn-secondary" aria-expanded="false" disabled>Vis utregning</button>
            </form>

            <div id="validation-hint-mech-energy" class="hint-box" aria-live="polite" hidden></div>
            <div id="result-mech-energy" class="result-box" aria-live="polite" hidden></div>

            <div id="step-by-step-container-mech-energy" class="steps-box" aria-live="polite" hidden>
                <h3>Utregning:</h3>
                <div id="steps-content-mech-energy"></div>
            </div>
        </section>
    </main>
"""

new_html = html.replace('    </main>', new_sections)

with open('index.html', 'w') as f:
    f.write(new_html)
