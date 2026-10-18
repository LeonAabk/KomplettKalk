# KomplettKalk (Matematikk-Assistent)

Norsk matematikkassistent som kjører helt i nettleseren. Ingen backend og ingen byggesteg:
ren HTML, CSS og ES-moduler. All brukertekst er på norsk (bokmål).

## Kjøre lokalt
ES-moduler fungerer ikke fra `file://`, så serv mappen over HTTP:

```
python3 -m http.server 8123
# åpne http://localhost:8123/index.html
```

`index.html` i roten er selve siden. KaTeX lastes fra CDN (`cdn.jsdelivr.net`).

## Struktur
- `index.html` – all markup: dashboard, 49 håndskrevne `<section id="module-…">` (pluss emnene i `modules/catalog.js`, som bygges av JS) og assistent-panelet.
- `src/js/main.js` – inngangspunkt (`initTheme`, `initUI`).
- `src/js/ui/ui.js` – kobler skjemaer, dashboard, søk, faner, bunnark og graf.
- `src/js/modules/*.js` – ren regnelogikk per tema. Hver `analyzeXxx(...)` returnerer
  resultat + `steps`.
- `src/js/utils/validation.js` – én `validateXxx` per emne.
- `src/js/utils/functionData.js` – listen over emner (id, tittel, kategori, beskrivelse, ikon).
- `src/js/components/graph.js` – SVG-graf (ingen Chart.js). `renderGraph`, `renderEmptyGraph`, `clearGraph`.
- `src/js/modules/catalog.js` og `catalog2.js` – emner definert som data (felt, `check`, `run` → `{html, steps}`). `src/js/ui/catalog-ui.js` bygger skjema/resultat/utregning og legger dem i `functionData`.
- `src/js/ui/extras.js` – favoriter (stjerne, localStorage `kk-favoritter`), «Sist brukt» (`kk-nylig`) og «Kopier resultat» på alle `.result-box`.
- `src/js/components/step-by-step.js` – `renderSteps(steps, container)`.
- `src/css/theme.css` – variabler for lys/mørk modus. `src/css/style.css` – resten.

## Legge til et nytt emne
Enklest: legg en oppføring i `modules/catalog2.js` (eller `catalog.js`) (se de andre der). Ingen HTML eller `ui.js` trengs.
Eldre fremgangsmåte, for emner som trenger egen UI (graf, figur):
1. Legg en oppføring i `functionData.js` (id må være `module-<navn>`).
2. Legg en `<section id="module-<navn>" class="educational-module">` i `index.html`
   (kopier en eksisterende, f.eks. `module-compound-interest`).
3. Skriv `analyze…` i riktig fil under `modules/` og `validate…` i `validation.js`.
4. Koble det i `ui.js` med `setupAdvancedModuleUI('<navn>', validate, analyze, formatResultat)`.

## Steg-format
`steps` er en liste med `{ description, math?, title?, note? }`.
- `description`: forklaring. Støtter inline matte med `$…$`, og `\n` gir linjeskift.
- `math`: LaTeX som vises som egen formel (KaTeX display).
- `note`: «hvorfor»-forklaring/tips, vises som blå margnotat under formelen.
- Siste steg vises automatisk som «Resultat». Bruk avrundede tall (se `r()` i `algebra.js`).

## Graf
`renderGraph(el, punkter, vertex, røtter, { yIntercept, symmetry, fn, name })`.
Fargene styres av `--graph-*`-variabler i `theme.css`, så grafen følger tema uten ny tegning.
På mobil (≤ 900 px) er assistent-panelet et bunnark; `openSheet('tab-graph')` åpner det.

## Design
Lys modus = rutepapir, mørk modus = tavle. Alle farger og mål ligger som tokens i `theme.css`
(gamle navn som `--bg-primary` peker på de nye). Roller: kulepenn-blå (`--pen`) for handling,
markeringstusj-gul (`--marker`) for svaret, rettepenn-rød (`--red-pen`) for feil.
- Fonter (Google Fonts): Atkinson Hyperlegible (grensesnitt) og Literata (overskrifter).
- Emnekort viser formelen som ikon: hvert emne i `functionData.js` har `formula` (KaTeX).
  `icon` (emoji) er bare reserve hvis KaTeX ikke lastes. Valider nye formler med `katex.renderToString(..., {strict:'error'})`.
- Kategorier har navn i `CATEGORY_NAMES` og farge via `--cat-<kategori>`.
- `body[data-view]` er `dashboard` eller `module`; hero-seksjonen skjules i `module`.
- Svaret (`.result-box`, siste steg) er alltid gult. Ikke bruk gult til andre ting.

## Mobil
Mål på 320, 360, 390 og 768 px. Ingen horisontal scrolling (sjekk `document.documentElement.scrollWidth`).
Inputfelt har 16 px skrift (hindrer zoom på iOS), trykkflater er minst 44–48 px.
Moduler åpnes via `history.pushState`, så Tilbake-knappen går til oversikten.

## Testing
Playwright ligger i `devDependencies`, men det er ingen sjekkede inn tester ennå.
Se etter konsollfeil og overflow på alle emner etter endringer i CSS eller `index.html`.
