/**
 * Komponent for å rendre trinnvise matematiske utregninger.
 *
 * Hvert trinn er et objekt:
 *   {
 *     description: string,   // forklaring (kan inneholde $inline matte$)
 *     math?: string,         // LaTeX som vises som egen formel
 *     title?: string,        // valgfri kort overskrift
 *     note?: string          // valgfri "hvorfor"-forklaring / tips
 *   }
 */

const KATEX_OPTIONS = {
    delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false },
        { left: '$', right: '$', display: false }
    ],
    throwOnError: false
};

/**
 * Tar et array av 'steps' og rendrer dem i DOM-elementet med KaTeX.
 *
 * @param {Array} steps - Array av { description, math, title?, note? }
 * @param {HTMLElement} containerElement - DOM-elementet der trinnene skal plasseres
 */
export function renderSteps(steps, containerElement) {
    containerElement.innerHTML = '';

    const list = document.createElement('ol');
    list.className = 'steps-list';

    steps.forEach((step, index) => {
        const isLast = index === steps.length - 1 && steps.length > 1;

        const item = document.createElement('li');
        item.className = 'step-item' + (isLast ? ' step-final' : '');

        const num = document.createElement('span');
        num.className = 'step-num';
        num.setAttribute('aria-hidden', 'true');
        num.textContent = isLast ? '✓' : String(index + 1);
        item.appendChild(num);

        const body = document.createElement('div');
        body.className = 'step-body';

        if (isLast) {
            const tag = document.createElement('span');
            tag.className = 'step-tag';
            tag.textContent = 'Resultat';
            body.appendChild(tag);
        }

        if (step.title) {
            const title = document.createElement('h4');
            title.className = 'step-title';
            title.textContent = step.title;
            body.appendChild(title);
        }

        if (step.description) {
            const desc = document.createElement('p');
            desc.className = 'step-description';
            desc.textContent = step.description;
            body.appendChild(desc);
        }

        if (step.math) {
            const mathDiv = document.createElement('div');
            mathDiv.className = 'step-math';
            mathDiv.textContent = `\\[ ${step.math} \\]`; // Wrap i display delimiters
            body.appendChild(mathDiv);
        }

        if (step.note) {
            const note = document.createElement('p');
            note.className = 'step-note';
            note.textContent = step.note;
            body.appendChild(note);
        }

        item.appendChild(body);
        list.appendChild(item);
    });

    containerElement.appendChild(list);

    if (typeof window.renderMathInElement !== 'undefined') {
        window.renderMathInElement(containerElement, KATEX_OPTIONS);
    } else {
        console.warn('KaTeX auto-render er ikke lastet inn ennå. Viser rå LaTeX.');
    }
}
