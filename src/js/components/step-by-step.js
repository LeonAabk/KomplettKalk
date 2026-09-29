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
            mathDiv.textContent = `\\[ ${step.math} \\]`; // Wrap i display delimiters
            stepDiv.appendChild(mathDiv);
        }

        containerElement.appendChild(stepDiv);
    });

    if (typeof window.renderMathInElement !== 'undefined') {
        window.renderMathInElement(containerElement, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '\\[', right: '\\]', display: true},
                {left: '\\(', right: '\\)', display: false}
            ],
            throwOnError: false
        });
    } else {
        console.warn("KaTeX auto-render er ikke lastet inn ennå. Bruker fallback-formatering.");
    }
}
