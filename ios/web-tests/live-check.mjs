// Verificación contra los sitios REALES (sin sesión iniciada) con WebKit, el motor de Safari/iOS.
// No es parte de `npm test`: los sitios cambian y bloquean bots. Genera un reporte honesto de lo observado.
//   node live-check.mjs <carpeta-salida>
import { webkit, devices } from 'playwright';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = process.argv[2] || join(here, 'live-report');
mkdirSync(out, { recursive: true });

const CHECKS = [
  ['youtube', 'https://m.youtube.com/', 'Inicio sustituido por buscador; sin Shorts'],
  ['youtube', 'https://m.youtube.com/results?search_query=guitar+lesson', 'Resultados sin Shorts'],
  ['youtube', 'https://m.youtube.com/watch?v=dQw4w9WgXcQ', 'Sin relacionados ni pantalla final'],
  ['instagram', 'https://www.instagram.com/explore/', 'Explore → búsqueda'],
  ['instagram', 'https://www.instagram.com/instagram/', 'Perfil público visible'],
  ['tiktok', 'https://www.tiktok.com/', 'Para ti → Siguiendo'],
  ['tiktok', 'https://www.tiktok.com/@tiktok', 'Perfil visible'],
  ['reddit', 'https://www.reddit.com/r/popular/', 'Popular → inicio'],
  ['reddit', 'https://www.reddit.com/r/AskReddit/', 'Comunidad visible, con tope de feed'],
  ['x', 'https://x.com/explore', 'Sin tendencias'],
  ['facebook', 'https://m.facebook.com/', 'Inicio "Más recientes"'],
  ['linkedin', 'https://www.linkedin.com/feed/', 'Feed con tope'],
  ['threads', 'https://www.threads.com/', 'Siguiendo / sin sugerencias'],
  ['pinterest', 'https://www.pinterest.com/', 'Inicio sustituido por buscador'],
];

const browser = await webkit.launch();
const report = [];
for (const [platform, url, expectation] of CHECKS) {
  const context = await browser.newContext({ ...devices['iPhone 13'], locale: 'en-US' });
  await context.addInitScript({ content: readFileSync(join(here, 'generated', platform + '.js'), 'utf8') });
  const page = await context.newPage();
  const messages = [];
  page.on('pageerror', (e) => messages.push('pageerror: ' + e.message));
  const entry = { platform, url, expectation };
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(7000);
    entry.finalUrl = page.url();
    entry.title = await page.title();
    entry.result = await page.evaluate(() => {
      const cfg = window.__presenteStarted ? true : false;
      const hidden = document.querySelectorAll('[data-presente-hidden]').length;
      const styled = Array.prototype.slice.call(document.querySelectorAll('[data-presente]'))
        .filter((el) => el.tagName === 'STYLE').length;
      const hiddenByCss = [];
      document.querySelectorAll('style[data-presente]').forEach((s) => {
        (s.sheet ? Array.prototype.slice.call(s.sheet.cssRules) : []).forEach((rule) => {
          if (!rule.selectorText) { return; }
          let n = 0;
          try { n = document.querySelectorAll(rule.selectorText).length; } catch (e) { n = -1; }
          if (n !== 0) { hiddenByCss.push({ selector: rule.selectorText.slice(0, 120), matches: n }); }
        });
      });
      return {
        engineStarted: cfg,
        styleTags: styled,
        hiddenByTextOrCap: hidden,
        selectorsMatching: hiddenByCss,
        calmHome: !!document.getElementById('presente-calm') && getComputedStyle(document.getElementById('presente-calm')).display !== 'none',
        feedEnd: !!document.getElementById('presente-feed-end'),
        loginWall: /log ?in|sign ?in|iniciar sesión/i.test(document.body ? document.body.innerText.slice(0, 3000) : ''),
      };
    });
    const shot = `${platform}-${report.length}.png`;
    await page.screenshot({ path: join(out, shot) });
    entry.screenshot = shot;
  } catch (e) {
    entry.error = String(e.message || e).split('\n')[0];
  }
  entry.pageErrors = messages.slice(0, 5);
  report.push(entry);
  console.log(JSON.stringify(entry));
  await context.close();
}
await browser.close();
writeFileSync(join(out, 'report.json'), JSON.stringify(report, null, 2));

// Resumen legible
const lines = ['# Verificación contra sitios reales (sin sesión, WebKit)', '',
  `Fecha: ${new Date().toISOString()}`, '',
  '| Plataforma | URL | Esperado | URL final | Motor activo | Selectores que coinciden | Ocultos por texto/tope | Muro de login | Error |',
  '|---|---|---|---|---|---|---|---|---|'];
for (const r of report) {
  const res = r.result || {};
  lines.push(`| ${r.platform} | ${r.url} | ${r.expectation} | ${r.finalUrl || ''} | ${res.engineStarted ? 'sí' : 'no'} | ${(res.selectorsMatching || []).length} | ${res.hiddenByTextOrCap ?? ''} | ${res.loginWall ? 'sí' : 'no'} | ${r.error || ''} |`);
}
writeFileSync(join(out, 'README.md'), lines.join('\n') + '\n');
