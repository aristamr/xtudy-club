import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const fixtures = join(here, '..', 'fixtures');
const generated = join(here, '..', 'generated');

export function fixture(name) {
  return readFileSync(join(fixtures, name), 'utf8');
}

// Abre un navegador sin red: todas las URLs se responden con páginas de prueba locales.
// `pages` es una función (url) => nombre de fixture.
export async function openPage(variant, pages) {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
  });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await context.addInitScript({ content: readFileSync(join(generated, variant + '.js'), 'utf8') });
  await context.route('**/*', (route) => {
    const url = new URL(route.request().url());
    const name = pages(url);
    if (!name) { return route.fulfill({ status: 404, body: 'not found' }); }
    return route.fulfill({ status: 200, contentType: 'text/html', body: fixture(name) });
  });
  const page = await context.newPage();
  return { browser, page };
}

export async function isHidden(page, selector) {
  return page.$eval(selector, (el) => {
    for (let n = el; n; n = n.parentElement) {
      if (getComputedStyle(n).display === 'none') { return true; }
    }
    return false;
  });
}

export async function settle(page, ms = 400) {
  await page.waitForTimeout(ms);
}
