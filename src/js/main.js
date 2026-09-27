import { initTheme } from './ui/theme.js';
import { initUI } from './ui/ui.js';

/**
 * Hovedinngangspunkt for applikasjonen.
 * Setter opp tema, UI-events og initialiserer tilstand når DOM er lastet.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser temahåndtering
    initTheme();

    // Initialiser UI og bind event listeners
    initUI();

    // Eventuelle fremtidige globale initialiseringer kan legges her
    console.log("Matematikk-Assistent initialisert.");
});
