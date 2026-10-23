// Comportamientos genéricos, configurables desde Rules/<plataforma>.json ("behaviors" → "params").
// Ninguno lee formularios, mensajes ni datos de la cuenta: solo ocultan, hacen clic en pestañas
// visibles o insertan avisos propios.
const PRESENTE_COMMON = {
  // Sustituye una página de inicio algorítmica por un aviso tranquilo y, si se indica, un buscador.
  // params: paths (regex), hide (selectores), searchPath (prefijo de búsqueda, p. ej. "/results?search_query=")
  calmHome: function (ctx, params) {
    const hide = params.hide || [];
    const searchPath = (params.searchPath || [])[0];
    if (hide.length) {
      ctx.addStyle(hide.map(function (s) {
        return 'html[data-presente-route="home"] ' + s + '{display:none!important}';
      }).join('\n'));
    }
    ctx.addStyle(
      '#presente-calm{display:none;box-sizing:border-box;padding:48px 24px;max-width:560px;margin:0 auto;' +
      'font-family:-apple-system,system-ui,sans-serif;text-align:center}' +
      'html[data-presente-route="home"] #presente-calm{display:block}' +
      '#presente-calm h2{font-size:22px;font-weight:600;margin:0 0 8px}' +
      '#presente-calm p{font-size:15px;opacity:.7;margin:0 0 24px}' +
      '#presente-calm form{display:flex;gap:8px}' +
      '#presente-calm input{flex:1;min-width:0;font-size:17px;padding:12px 14px;border-radius:12px;' +
      'border:1px solid rgba(128,128,128,.4);background:transparent;color:inherit}' +
      '#presente-calm button{font-size:17px;padding:12px 16px;border-radius:12px;border:0;background:#1d1d1b;color:#faf8f5}' +
      '@media (prefers-color-scheme: dark){#presente-calm button{background:#f2efe9;color:#1d1d1b}}'
    );

    function ensureCalm() {
      if (!document.body || document.getElementById('presente-calm')) { return; }
      const box = document.createElement('div');
      box.id = 'presente-calm';
      const title = document.createElement('h2');
      title.textContent = ctx.labels.calmTitle || 'Search for what you came for.';
      const subtitle = document.createElement('p');
      subtitle.textContent = ctx.labels.calmSubtitle || 'No recommendations. Only what you choose.';
      box.appendChild(title);
      box.appendChild(subtitle);
      if (searchPath) {
        const form = document.createElement('form');
        const input = document.createElement('input');
        input.type = 'search';
        input.placeholder = ctx.labels.searchPlaceholder || 'Search';
        input.setAttribute('aria-label', input.placeholder);
        const button = document.createElement('button');
        button.type = 'submit';
        button.textContent = ctx.labels.searchButton || 'Search';
        form.appendChild(input);
        form.appendChild(button);
        form.addEventListener('submit', function (event) {
          event.preventDefault();
          const q = input.value.trim();
          if (q) { location.assign(searchPath + encodeURIComponent(q)); }
        });
        box.appendChild(form);
      }
      const anchor = document.querySelector(params.anchor ? params.anchor[0] : 'ytm-app, #app') || document.body;
      anchor.insertBefore(box, anchor.firstChild ? anchor.firstChild.nextSibling : null);
    }

    function update() {
      if (!document.documentElement) { return; }
      if (ctx.pathMatches(params.paths)) {
        document.documentElement.setAttribute('data-presente-route', 'home');
        ensureCalm();
      } else {
        document.documentElement.removeAttribute('data-presente-route');
      }
    }

    ctx.onRoute(update);
    ctx.onTick(update);
    update();
  },

  // Elige la pestaña "Siguiendo" y oculta la pestaña algorítmica ("Para ti").
  // params: paths, tabs (selectores de pestaña), prefer (textos a elegir), avoid (textos a ocultar)
  preferTab: function (ctx, params) {
    const tabSelector = (params.tabs || ['[role="tab"]']).join(',');
    const prefer = (params.prefer || []).map(function (t) { return t.toLowerCase(); });
    const avoid = (params.avoid || []).map(function (t) { return t.toLowerCase(); });
    let clickedFor = null;

    function label(el) { return (el.textContent || '').trim().toLowerCase(); }

    function update() {
      if (!document.body || !ctx.pathMatches(params.paths)) { return; }
      const tabs = Array.prototype.slice.call(document.querySelectorAll(tabSelector));
      tabs.forEach(function (tab) {
        if (avoid.indexOf(label(tab)) !== -1) { ctx.hide(tab, 'tab'); }
      });
      const path = ctx.currentPath();
      if (clickedFor === path) { return; }
      // Solo pestañas reales: un botón "Siguiendo" en un perfil significaría dejar de seguir.
      const target = tabs.find(function (tab) {
        return tab.getAttribute('role') === 'tab' && prefer.indexOf(label(tab)) !== -1;
      });
      if (target) {
        clickedFor = path;
        const selected = target.getAttribute('aria-selected') === 'true' ||
          target.getAttribute('aria-current') === 'page';
        if (!selected) { target.click(); }
      }
    }

    ctx.onRoute(function () { clickedFor = null; update(); });
    ctx.onTick(update);
  },

  // Pone fin a los feeds infinitos: después de N publicaciones vistas, muestra un cierre tranquilo.
  // params: paths, items (selector de publicación), max (número)
  feedCap: function (ctx, params) {
    const itemSelector = (params.items || []).join(',');
    const max = parseInt((params.max || ['40'])[0], 10);
    if (!itemSelector || !(max > 0)) { return; }
    let seen = new WeakSet();
    let count = 0;
    let endCard = null;

    ctx.addStyle(
      '#presente-feed-end{box-sizing:border-box;padding:40px 24px 64px;text-align:center;' +
      'font-family:-apple-system,system-ui,sans-serif}' +
      '#presente-feed-end h3{font-size:20px;font-weight:600;margin:0 0 6px}' +
      '#presente-feed-end p{font-size:15px;opacity:.7;margin:0}'
    );

    function showEnd(after) {
      if (endCard && document.body.contains(endCard)) { return; }
      endCard = document.createElement('div');
      endCard.id = 'presente-feed-end';
      const h = document.createElement('h3');
      h.textContent = ctx.labels.feedEndTitle || "You're all caught up.";
      const p = document.createElement('p');
      p.textContent = ctx.labels.feedEndSubtitle || 'The rest can wait. Enjoy your day.';
      endCard.appendChild(h);
      endCard.appendChild(p);
      if (after && after.parentNode) {
        after.parentNode.insertBefore(endCard, after.nextSibling);
      } else {
        document.body.appendChild(endCard);
      }
    }

    function update() {
      if (!document.body || !ctx.pathMatches(params.paths)) { return; }
      const items = document.querySelectorAll(itemSelector);
      let lastVisible = null;
      for (let i = 0; i < items.length; i++) {
        const el = items[i];
        if (!seen.has(el)) {
          seen.add(el);
          count++;
          if (count > max) { ctx.hide(el, 'feedCap'); }
        }
        if (!el.hasAttribute('data-presente-hidden')) { lastVisible = el; }
      }
      if (count > max) { showEnd(lastVisible); }
    }

    ctx.onRoute(function () { seen = new WeakSet(); count = 0; endCard = null; update(); });
    ctx.onTick(update);
  }
};
