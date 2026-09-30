1. **Create Economics Module (`src/js/modules/economics.js`)**
   - Implement `analyzeCompoundInterest(principal, rate, years)` for compound interest calculation: $S = B \cdot (1 + \frac{r}{100})^t$. Include step-by-step KaTeX logic.
   - Implement `analyzeVAT(price, isAdd, vatRate = 25)` for VAT addition/subtraction. Include step-by-step logic showing exactly the VAT amount in NOK.

2. **Verify Economics Module**
   - Use `read_file` or `list_files` to verify the creation and correct content of `src/js/modules/economics.js`.

3. **Create Conversion Module (`src/js/modules/conversion.js`)**
   - Implement `analyzeUnitConversion(dimension, value, fromUnit, toUnit)` for Length/Area/Volume. Include detailed logic for step-by-step output explaining the factors of 10, 100, 1000 etc.

4. **Verify Conversion Module**
   - Use `read_file` or `list_files` to verify the creation and content of `src/js/modules/conversion.js`.

5. **Update Algebra Module (`src/js/modules/algebra.js`)**
   - Add `analyzeSymmetryLine(a, b)` for symmetry line: $x = \frac{-b}{2a}$.
   - Add `analyzeLinearRoot(a, b)` for zero point: $ax + b = 0$.
   - Add `analyzeAverageRateOfChange(x1, y1, x2, y2)` for the secant: $a = \frac{y2 - y1}{x2 - x1}$.

6. **Update Geometry Module (`src/js/modules/geometry.js`)**
   - Add `analyzeSimilarity(smallSide1, largeSide1, smallSide2, largeSide2)` for similar triangles. Calculate missing side based on the ratio.

7. **Update Theme (`src/css/theme.css`)**
   - Add distinct colors for Economics (purple) and Conversion (orange) categories: `--cat-okonomi`, `--cat-konvertering`.

8. **Update Validation (`src/js/utils/validation.js`)**
   - Add new validation functions matching the existing signature `export function validateX(...) { return { isValid: boolean, values: {}, hint: string|null }; }`:
     - `validateCompoundInterest`
     - `validateVAT`
     - `validateUnitConversion`
     - `validateSymmetryLine`
     - `validateLinearRoot`
     - `validateAverageRateOfChange`
     - `validateSimilarity`

9. **Update Function Data (`src/js/utils/functionData.js`)**
   - Register the new tools: Compound Interest, VAT, Unit Conversion, Symmetry Line, Linear Root, Average Rate of Change, Similar Triangles. Ensure category values map to the CSS variables (`okonomi`, `konvertering`).

10. **Update HTML structure (`index.html`)**
   - Add forms and UI elements for modules: `#module-compound-interest`, `#module-vat`, `#module-unit-conversion`, `#module-symmetry-line`, `#module-linear-root`, `#module-average-rate`, `#module-similarity`. Use the `<section id="..." class="educational-module" aria-labelledby="..." style="display: none;">` structure, matching the existing modules like `#module-area`. Do not manually add sidebar links as they are handled dynamically.

11. **Update UI Logic (`src/js/ui/ui.js`)**
   - Import the new validation and analysis functions.
   - Use the `setupModuleUI` function for simple tools that only need a single input: none of the new tools fall strictly under single input so we will manually wire up event listeners for all new forms: `compound-interest-form`, `vat-form`, `unit-conversion-form`, `symmetry-line-form`, `linear-root-form`, `average-rate-form`, `similarity-form`.
   - Locate the exact conditional logic controlling `quickGraphSidebar` visibility (`if (item.category === 'geometri' || item.category === 'grunnleggende' || item.category === 'statistikk')`) and expand it to include `okonomi` and `konvertering`.

12. **Verify changes locally**
    - Start the server using `run_in_bash_session` (`python3 -m http.server 8080 &`), then use the `view_text_website` tool on `http://localhost:8080` to verify the page loads and check for any console errors.

13. **Run Unit Tests**
    - Run the specific test command using `run_in_bash_session`: `node test_algebra.js && node test_eval.js && node test_parser.js`.

14. **Pre-commit Checks**
    - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.

15. **Submit**
    - Submit the new changes.
