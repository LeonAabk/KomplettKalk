/**
 * Ekstrafunksjoner: favoritter, nylig brukt og «Kopier resultat».
 * Alt lagres lokalt i nettleseren (localStorage, med try/catch).
 */
import { functionData } from '../utils/functionData.js';

const FAV_KEY = 'kk-favoritter';
const RECENT_KEY = 'kk-nylig';
const RECENT_MAX = 4;
const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z"/></svg>';

function load(key) {
    try {
        const v = JSON.parse(localStorage.getItem(key) || '[]');
        return Array.isArray(v) ? v.filter(id => functionData.some(f => f.id === id)) : [];
    } catch (e) { return []; }
}
function save(key, list) {
    try { localStorage.setItem(key, JSON.stringify(list)); } catch (e) { /* ignorer */ }
}

export function initExtras() {
    let favs = load(FAV_KEY);
    let recent = load(RECENT_KEY);
    const grid = document.getElementById('dashboard-grid');
    const navUl = document.querySelector('.sidebar-nav ul');
    if (!grid) return;

    const titleOf = (id) => (functionData.find(f => f.id === id) || {}).title || id;
    const live = document.createElement('div');
    live.className = 'visually-hidden';
    live.setAttribute('aria-live', 'polite');
    document.body.appendChild(live);

    // ---------- Favoritter ----------
    function starButton(id) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'fav-btn';
        b.dataset.fav = id;
        b.innerHTML = STAR;
        b.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            toggleFav(id);
        });
        b.addEventListener('keydown', (e) => e.stopPropagation());
        return b;
    }

    function syncStars() {
        document.querySelectorAll('.fav-btn').forEach(b => {
            const on = favs.includes(b.dataset.fav);
            b.classList.toggle('on', on);
            b.setAttribute('aria-pressed', String(on));
            b.setAttribute('aria-label', `${on ? 'Fjern fra' : 'Legg til i'} favoritter: ${titleOf(b.dataset.fav)}`);
        });
        const count = navUl && navUl.querySelector('[data-fav-link] .nav-count');
        if (count) count.textContent = favs.length;
        if (favLink) favLink.parentElement.hidden = false;
    }

    function toggleFav(id) {
        favs = favs.includes(id) ? favs.filter(x => x !== id) : [...favs, id];
        save(FAV_KEY, favs);
        syncStars();
        live.textContent = favs.includes(id) ? `${titleOf(id)} lagt til i favoritter` : `${titleOf(id)} fjernet fra favoritter`;
        if (favLink && favLink.classList.contains('active')) showFavs();
    }

    grid.querySelectorAll('.module-card').forEach(card => {
        card.appendChild(starButton(card.dataset.target));
    });
    document.querySelectorAll('.educational-module').forEach(mod => {
        const h = mod.querySelector('h2');
        const id = mod.id;
        if (!h || !functionData.some(f => f.id === id)) return;
        h.classList.add('has-fav');
        h.appendChild(starButton(id));
    });

    // Nav-lenke «Favoritter»
    let favLink = null;
    function showFavs() {
        navUl.querySelectorAll('a').forEach(a => a.classList.toggle('active', a === favLink));
        grid.querySelectorAll('.module-card').forEach(c => {
            c.style.display = favs.includes(c.dataset.target) ? 'flex' : 'none';
        });
        let empty = document.getElementById('fav-empty');
        if (!empty) {
            empty = document.createElement('p');
            empty.id = 'fav-empty';
            empty.className = 'dashboard-empty';
            empty.textContent = 'Ingen favoritter ennå. Trykk på stjernen på et emne for å lagre det her.';
            grid.after(empty);
        }
        empty.hidden = favs.length > 0;
    }
    if (navUl) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#favoritter';
        a.dataset.favLink = '';
        a.innerHTML = '<span class="nav-dot nav-dot-fav" aria-hidden="true"></span><span class="nav-label">Favoritter</span><span class="nav-count">0</span>';
        li.appendChild(a);
        navUl.insertBefore(li, navUl.children[1] || null);
        favLink = a;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            navUl.querySelector('a:not([data-fav-link])').click(); // viser oversikten
            showFavs();
        });
        // Skjul «ingen favoritter»-meldingen når andre filtre brukes
        navUl.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link !== favLink) {
                const empty = document.getElementById('fav-empty');
                if (empty) empty.hidden = true;
            }
        });
    }

    // ---------- Nylig brukt ----------
    const strip = document.createElement('nav');
    strip.className = 'recent-strip';
    strip.setAttribute('aria-label', 'Nylig brukte emner');
    grid.before(strip);

    function renderRecent() {
        strip.replaceChildren();
        strip.hidden = recent.length === 0;
        if (!recent.length) return;
        const label = document.createElement('span');
        label.className = 'recent-label';
        label.textContent = 'Sist brukt';
        strip.appendChild(label);
        recent.forEach(id => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'recent-chip';
            b.textContent = titleOf(id);
            b.addEventListener('click', () => {
                const card = grid.querySelector(`[data-target="${id}"]`);
                if (card) card.click();
            });
            strip.appendChild(b);
        });
    }
    function pushRecent(id) {
        if (!id || !functionData.some(f => f.id === id)) return;
        recent = [id, ...recent.filter(x => x !== id)].slice(0, RECENT_MAX);
        save(RECENT_KEY, recent);
        renderRecent();
    }
    grid.addEventListener('click', (e) => {
        const card = e.target.closest('.module-card');
        if (card && !e.target.closest('.fav-btn')) pushRecent(card.dataset.target);
    });
    window.addEventListener('popstate', (e) => { if (e.state && e.state.module) pushRecent(e.state.module); });
    const hashId = location.hash.slice(1);
    if (hashId.startsWith('module-')) pushRecent(hashId);

    // ---------- Kopier resultat ----------
    async function copyText(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (e) {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            let ok = false;
            try { ok = document.execCommand('copy'); } catch (err) { /* ignorer */ }
            ta.remove();
            return ok;
        }
    }
    document.querySelectorAll('.result-box').forEach(box => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'copy-btn';
        btn.textContent = 'Kopier resultat';
        btn.hidden = box.hidden;
        box.after(btn);
        new MutationObserver(() => { btn.hidden = box.hidden; })
            .observe(box, { attributes: true, attributeFilter: ['hidden'] });
        btn.addEventListener('click', async () => {
            const text = box.innerText.replace(/\s*\n\s*/g, '  ').trim();
            const ok = await copyText(text);
            btn.textContent = ok ? 'Kopiert ✓' : 'Kunne ikke kopiere';
            live.textContent = ok ? 'Resultatet er kopiert' : 'Kopiering mislyktes';
            setTimeout(() => { btn.textContent = 'Kopier resultat'; }, 1800);
        });
    });

    syncStars();
    renderRecent();
}
