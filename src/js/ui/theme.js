/**
 * Håndterer tema (lys = rutepapir, mørk = tavle).
 * Første valg settes av et lite skript i <head> for å unngå flimmer.
 */

const ICON_SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const ICON_MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z"/></svg>';
const THEME_COLORS = { light: '#fbfcfe', dark: '#131d1a' };

export function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    // Sjekk lagret tema eller system-preferanse
    let savedTheme = null;
    try { savedTheme = localStorage.getItem('theme'); } catch (e) { /* lagring ikke tilgjengelig */ }

    if (savedTheme) {
        htmlEl.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        htmlEl.setAttribute('data-theme', 'dark');
    } else {
        htmlEl.setAttribute('data-theme', 'light');
    }

    applyTheme(themeToggleBtn, htmlEl.getAttribute('data-theme'));

    themeToggleBtn.addEventListener('click', () => {
        const newTheme = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', newTheme);
        try { localStorage.setItem('theme', newTheme); } catch (e) { /* ignorer */ }
        applyTheme(themeToggleBtn, newTheme);

        // Utløs event slik at f.eks. enhetssirkelen kan tegnes på nytt
        window.dispatchEvent(new Event('themeChanged'));
    });
}

function applyTheme(btn, theme) {
    // Ikonet viser hva knappen bytter TIL
    btn.innerHTML = theme === 'dark' ? ICON_SUN : ICON_MOON;
    btn.setAttribute('aria-label', theme === 'dark' ? 'Bytt til lyst tema' : 'Bytt til mørkt tema');
    document.querySelectorAll('meta[name="theme-color"]').forEach(m => {
        m.setAttribute('content', THEME_COLORS[theme] || THEME_COLORS.light);
    });
}
