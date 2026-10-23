// Motor de filtrado genérico de Presente.
// Se inyecta al inicio del documento (WKUserScript .atDocumentStart, solo marco principal).
// Nunca lee formularios, contraseñas, cookies ni contenido de mensajes: solo oculta
// elementos y reencamina rutas según PRESENTE_CONFIG (generado por PresenteCore).
function presenteStart(config, behaviors) {
  if (window.__presenteStarted) { return; }
  window.__presenteStarted = true;

  const HIDDEN_ATTR = 'data-presente-hidden';
  const routeListeners = [];
  const routes = config.routes.map(function (r) {
    return { id: r.id, re: new RegExp(r.pattern), redirect: r.redirect };
  });

  function post(message) {
    try {
      if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.presente) {
        window.webkit.messageHandlers.presente.postMessage(message);
      }
    } catch (e) { /* sin puente nativo (p. ej. pruebas) */ }
  }

  function currentPath() {
    return location.pathname + location.search;
  }

  // Devuelve la ruta destino si alguna regla aplica, o null.
  function redirectFor(pathAndQuery) {
    for (let i = 0; i < routes.length; i++) {
      const r = routes[i];
      if (r.re.test(pathAndQuery)) {
        const target = pathAndQuery.replace(r.re, r.redirect);
        if (target !== pathAndQuery) { return { id: r.id, target: target }; }
        return null;
      }
    }
    return null;
  }

  // Protección contra bucles: si el sitio nos devuelve una y otra vez a la misma ruta,
  // dejamos de redirigir con esa regla (el resto del filtrado sigue activo).
  const LOOP_KEY = 'presente-redirects';
  function allowRedirect(ruleId) {
    let log = {};
    try { log = JSON.parse(sessionStorage.getItem(LOOP_KEY) || '{}'); } catch (e) { log = {}; }
    const now = Date.now();
    const recent = (log[ruleId] || []).filter(function (t) { return now - t < 10000; });
    if (recent.length >= 3) {
      post({ type: 'loopPrevented', rule: ruleId });
      return false;
    }
    recent.push(now);
    log[ruleId] = recent;
    try { sessionStorage.setItem(LOOP_KEY, JSON.stringify(log)); } catch (e) { /* sin almacenamiento */ }
    return true;
  }

  function enforceRoute() {
    const hit = redirectFor(currentPath());
    if (hit && allowRedirect(hit.id)) {
      post({ type: 'redirected', rule: hit.id });
      location.replace(location.origin + hit.target);
      return true;
    }
    return false;
  }

  // ---- Estilos ----
  // Al inicio del documento puede que aún no exista <html>; esperamos lo mínimo necesario.
  function whenRoot(cb) {
    if (document.documentElement) { cb(); return; }
    const mo = new MutationObserver(function () {
      if (document.documentElement) { mo.disconnect(); cb(); }
    });
    mo.observe(document, { childList: true });
  }

  function addStyle(css) {
    const style = document.createElement('style');
    style.setAttribute('data-presente', '');
    style.textContent = css;
    whenRoot(function () { (document.head || document.documentElement).appendChild(style); });
    return style;
  }

  // Una regla por selector: si un selector no es válido en este WebKit, no invalida los demás.
  addStyle(
    config.hide.map(function (s) { return s + '{display:none!important}'; }).join('\n') +
    '\n[' + HIDDEN_ATTR + ']{display:none!important}'
  );

  function hide(el, reason) {
    if (el && !el.hasAttribute(HIDDEN_ATTR)) {
      el.setAttribute(HIDDEN_ATTR, reason || '');
    }
  }

  // ---- Ocultar por texto (p. ej. "Sugerencias para ti") ----
  const textRules = config.textRules.map(function (rule) {
    return {
      phrases: rule.phrases.map(function (p) { return p.toLowerCase(); }),
      containers: rule.containers.join(','),
      maxDepth: rule.maxDepth
    };
  });

  // Nunca ocultamos un contenedor que incluya el feed completo u otras publicaciones.
  function isSafeFallback(el) {
    if (!el || el === document.body || el === document.documentElement) { return false; }
    if (el.matches('main, nav, header, [role="main"]')) { return false; }
    return el.querySelector('article, main, nav, [role="main"]') === null;
  }

  function containerFor(textNode, rule) {
    const start = textNode.parentElement;
    if (!start) { return null; }
    if (rule.containers) {
      const c = start.closest(rule.containers);
      if (c) { return c; }
    }
    let best = null;
    let el = start;
    for (let depth = 0; depth < rule.maxDepth && el; depth++) {
      if (!isSafeFallback(el)) { break; }
      best = el;
      el = el.parentElement;
    }
    return best;
  }

  function scanText() {
    if (!textRules.length || !document.body) { return; }
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const text = node.nodeValue.trim().toLowerCase();
      if (!text || text.length > 40) { continue; }
      for (let i = 0; i < textRules.length; i++) {
        if (textRules[i].phrases.indexOf(text) !== -1) {
          const target = containerFor(node, textRules[i]);
          if (target) { hide(target, 'text'); }
          break;
        }
      }
    }
  }

  // ---- Cambios de ruta en aplicaciones de una sola página ----
  let lastPath = currentPath();
  function notifyRoute(source) {
    const path = currentPath();
    if (path === lastPath) { return; }
    const from = lastPath;
    lastPath = path;
    if (enforceRoute()) { return; }
    routeListeners.forEach(function (cb) { cb(from, path, source); });
  }

  ['pushState', 'replaceState'].forEach(function (name) {
    const original = history[name];
    history[name] = function () {
      const result = original.apply(this, arguments);
      notifyRoute(name);
      return result;
    };
  });
  window.addEventListener('popstate', function () { notifyRoute('popstate'); });
  setInterval(function () { notifyRoute('poll'); }, 700);

  // Intercepta toques en enlaces bloqueados antes de que la SPA los procese.
  document.addEventListener('click', function (event) {
    const a = event.target && event.target.closest ? event.target.closest('a[href]') : null;
    if (!a) { return; }
    let url;
    try { url = new URL(a.getAttribute('href'), location.href); } catch (e) { return; }
    if (url.origin !== location.origin) { return; }
    const hit = redirectFor(url.pathname + url.search);
    if (hit) {
      event.preventDefault();
      event.stopPropagation();
      post({ type: 'redirected', rule: hit.id });
      location.assign(location.origin + hit.target);
    }
  }, true);

  // ---- Observador del DOM (con agrupación para no gastar batería) ----
  const tickListeners = [];
  let scheduled = false;
  function schedule() {
    if (scheduled) { return; }
    scheduled = true;
    setTimeout(function () {
      scheduled = false;
      scanText();
      tickListeners.forEach(function (cb) { cb(); });
    }, 120);
  }

  const ctx = {
    config: config,
    labels: config.labels || {},
    addStyle: addStyle,
    hide: hide,
    post: post,
    currentPath: currentPath,
    // true si la ruta actual coincide con alguna de las expresiones (o si no hay ninguna).
    pathMatches: function (patterns) {
      if (!patterns || !patterns.length) { return true; }
      const path = currentPath();
      return patterns.some(function (p) { return new RegExp(p).test(path); });
    },
    onRoute: function (cb) { routeListeners.push(cb); },
    onTick: function (cb) { tickListeners.push(cb); }
  };

  config.behaviors.forEach(function (b) {
    if (behaviors && typeof behaviors[b.name] === 'function') { behaviors[b.name](ctx, b.params || {}); }
  });

  if (enforceRoute()) { return; }

  whenRoot(function () {
    document.documentElement.setAttribute('data-presente', config.platform);
    new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
    schedule();
  });
}
