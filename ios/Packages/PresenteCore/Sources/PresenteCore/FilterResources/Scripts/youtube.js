// Comportamientos específicos de YouTube (m.youtube.com).
const PRESENTE_BEHAVIORS = {
  // Sustituye la página de inicio (recomendaciones) por un buscador tranquilo.
  calmHome: function (ctx) {
    ctx.addStyle(
      'html[data-presente-route="home"] ytm-browse ytm-rich-grid-renderer,' +
      'html[data-presente-route="home"] ytm-browse ytm-section-list-renderer,' +
      'html[data-presente-route="home"] ytm-browse ytm-feed-filter-chip-bar-renderer,' +
      'html[data-presente-route="home"] ytm-browse ytm-chip-cloud-renderer' +
      '{display:none!important}' +
      '#presente-calm{display:none;box-sizing:border-box;padding:48px 24px;max-width:560px;margin:0 auto;' +
      'font-family:-apple-system,system-ui,sans-serif;text-align:center}' +
      'html[data-presente-route="home"] #presente-calm{display:block}' +
      '#presente-calm h2{font-size:22px;font-weight:600;margin:0 0 8px}' +
      '#presente-calm p{font-size:15px;opacity:.7;margin:0 0 24px}' +
      '#presente-calm form{display:flex;gap:8px}' +
      '#presente-calm input{flex:1;font-size:17px;padding:12px 14px;border-radius:12px;border:1px solid rgba(128,128,128,.4);' +
      'background:transparent;color:inherit}' +
      '#presente-calm button{font-size:17px;padding:12px 16px;border-radius:12px;border:0;background:#111;color:#fff}' +
      '@media (prefers-color-scheme: dark){#presente-calm button{background:#f2f2f2;color:#111}}'
    );

    function isHome(path) {
      return path === '/' || path.indexOf('/?') === 0;
    }

    function ensureCalm() {
      if (!document.body || document.getElementById('presente-calm')) { return; }
      const box = document.createElement('div');
      box.id = 'presente-calm';
      const title = document.createElement('h2');
      title.textContent = ctx.labels.calmTitle || 'Busca lo que quieres ver.';
      const subtitle = document.createElement('p');
      subtitle.textContent = ctx.labels.calmSubtitle || 'Sin recomendaciones. Solo lo que tú elijas.';
      const form = document.createElement('form');
      const input = document.createElement('input');
      input.type = 'search';
      input.name = 'search_query';
      input.placeholder = ctx.labels.searchPlaceholder || 'Buscar en YouTube';
      input.setAttribute('aria-label', input.placeholder);
      const button = document.createElement('button');
      button.type = 'submit';
      button.textContent = ctx.labels.searchButton || 'Buscar';
      form.appendChild(input);
      form.appendChild(button);
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        const q = input.value.trim();
        if (q) { location.assign('/results?search_query=' + encodeURIComponent(q)); }
      });
      box.appendChild(title);
      box.appendChild(subtitle);
      box.appendChild(form);
      const anchor = document.querySelector('ytm-app, #app') || document.body;
      anchor.insertBefore(box, anchor.firstChild ? anchor.firstChild.nextSibling : null);
    }

    function update() {
      if (!document.documentElement) { return; }
      const home = isHome(ctx.currentPath());
      if (home) {
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

  // Evita que termine un video y empiece otro sin que la persona lo haya elegido.
  autoplayGuard: function (ctx) {
    let lastGesture = 0;
    ['touchstart', 'pointerdown', 'keydown', 'click'].forEach(function (type) {
      document.addEventListener(type, function () { lastGesture = Date.now(); }, true);
    });

    function videoId(path) {
      const m = /^\/watch\?(?:.*&)?v=([A-Za-z0-9_-]+)/.exec(path);
      return m ? m[1] : null;
    }

    ctx.onRoute(function (from, to, source) {
      if (source === 'popstate') { return; }
      const a = videoId(from);
      const b = videoId(to);
      if (a && b && a !== b && Date.now() - lastGesture > 2500) {
        ctx.post({ type: 'autoplayBlocked' });
        history.back();
      }
    });

    // Apaga el interruptor de reproducción automática si la página lo muestra encendido.
    ctx.onTick(function () {
      const on = document.querySelector(
        'button[aria-label*="Autoplay is on"], button[aria-label*="reproducción automática está activada"]'
      );
      if (on && !on.hasAttribute('data-presente-clicked')) {
        on.setAttribute('data-presente-clicked', '');
        on.click();
      }
    });
  }
};
