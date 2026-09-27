/**
 * Komponent for å rendre trinnvise matematiske utregninger.
 */

/**
 * Tar et array av 'steps' og rendrer dem i DOM-elementet med KaTeX.
 *
 * @param {Array} steps - Array av objekt { description, math }
 * @param {HTMLElement} containerElement - DOM-elementet der trinnene skal plasseres
 */
export function renderSteps(steps, containerElement) {
    const hasKatex = typeof window.katex !== 'undefined';

    if (!hasKatex) {
        console.warn("KaTeX biblioteket er ikke lastet inn ennå. Bruker fallback-formatering.");
    }

    containerElement.innerHTML = '';

    steps.forEach(step => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step-item';

        const descP = document.createElement('p');
        descP.className = 'step-description';
        descP.textContent = step.description;
        stepDiv.appendChild(descP);

        if (step.math) {
            const mathDiv = document.createElement('div');
            mathDiv.className = 'step-math';

            if (hasKatex) {
                try {
                    window.katex.render(step.math, mathDiv, {
                        displayMode: true,
                        throwOnError: false
                    });
                } catch (e) {
                    console.error("KaTeX feil:", e);
                    mathDiv.textContent = step.math; // Fallback
                }
            } else {
                mathDiv.textContent = step.math; // Fallback for when KaTeX is missing
            }

            stepDiv.appendChild(mathDiv);
        }

        containerElement.appendChild(stepDiv);
    });
}
