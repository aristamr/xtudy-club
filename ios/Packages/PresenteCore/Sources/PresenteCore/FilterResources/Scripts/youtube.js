// Comportamientos específicos de YouTube (m.youtube.com).
const PRESENTE_BEHAVIORS = Object.assign({}, PRESENTE_COMMON, {
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
});
