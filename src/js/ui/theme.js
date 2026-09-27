/**
 * Håndterer tema (dark/light mode)
 */

export function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    // Sjekk lagret tema eller system-preferanse
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlEl.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        htmlEl.setAttribute('data-theme', 'dark');
    }

    // Oppdater ikon
    updateThemeIcon(themeToggleBtn, htmlEl.getAttribute('data-theme'));

    // Lytt på klikk
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(themeToggleBtn, newTheme);

        // Utløs event slik at f.eks Chart.js kan oppdatere farger
        window.dispatchEvent(new Event('themeChanged'));
    });
}

function updateThemeIcon(btn, theme) {
    btn.textContent = theme === 'dark' ? '☀️' : '🌓';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Bytt til lyst tema' : 'Bytt til mørkt tema');
}
