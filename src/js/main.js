import { initTheme } from './ui/theme.js';
import { initUI } from './ui/ui.js';
import { initExtras } from './ui/extras.js';

/**
 * Hovedinngangspunkt for applikasjonen.
 * Setter opp tema, UI-events og initialiserer tilstand når DOM er lastet.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser temahåndtering
    initTheme();

    // Initialiser UI og bind event listeners
    initUI();

    // Favoritter, nylig brukt og kopier resultat
    initExtras();

    // Eventuelle fremtidige globale initialiseringer kan legges her
    console.log("Matematikk-Assistent initialisert.");
});
