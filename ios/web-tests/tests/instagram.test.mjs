import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openPage, isHidden, settle } from './helpers.mjs';

function instagramPages(url) {
  if (url.hostname === 'www.instagram.com') {
    if (url.pathname === '/') { return 'instagram-home.html'; }
    return 'generic.html';
  }
  if (url.hostname.endsWith('facebook.com')) { return 'instagram-home.html'; }
  return null;
}

test('el inicio se abre en "Siguiendo" (sin feed algorítmico)', async () => {
  const { browser, page } = await openPage('instagram', instagramPages);
  try {
    await page.goto('https://www.instagram.com/');
    await page.waitForURL('https://www.instagram.com/?variant=following');
    await settle(page);
    assert.equal(new URL(page.url()).search, '?variant=following');
  } finally { await browser.close(); }
});

test('Reels desaparece de la navegación; mensajes, perfil y búsqueda se conservan', async () => {
  const { browser, page } = await openPage('instagram', instagramPages);
  try {
    await page.goto('https://www.instagram.com/?variant=following');
    await settle(page);
    assert.equal(await isHidden(page, '#nav-reels'), true);
    for (const id of ['#nav-home', '#nav-explore', '#nav-direct', '#nav-profile']) {
      assert.equal(await isHidden(page, id), false, id);
    }
    assert.equal(await isHidden(page, '#explore-tag'), true);
  } finally { await browser.close(); }
});

test('las publicaciones sugeridas se ocultan; las de cuentas seguidas no', async () => {
  const { browser, page } = await openPage('instagram', instagramPages);
  try {
    await page.goto('https://www.instagram.com/?variant=following');
    await settle(page);
    assert.equal(await isHidden(page, '#post-suggested'), true);
    assert.equal(await isHidden(page, '#people-block'), true);
    assert.equal(await isHidden(page, '#post-friend'), false);
    assert.equal(await isHidden(page, '#post-friend-2'), false);
    assert.equal(await isHidden(page, '#feed'), false, 'nunca se oculta el feed completo');
  } finally { await browser.close(); }
});

test('las sugerencias que aparecen después (scroll infinito) también se ocultan', async () => {
  const { browser, page } = await openPage('instagram', instagramPages);
  try {
    await page.goto('https://www.instagram.com/?variant=following');
    await settle(page);
    await page.evaluate(() => {
      const a = document.createElement('article');
      a.id = 'late-suggested';
      a.innerHTML = '<div><span>Suggested posts</span></div>';
      document.getElementById('feed').appendChild(a);
    });
    await settle(page);
    assert.equal(await isHidden(page, '#late-suggested'), true);
  } finally { await browser.close(); }
});

test('navegar a Reels dentro de la SPA regresa al inicio', async () => {
  const { browser, page } = await openPage('instagram', instagramPages);
  try {
    await page.goto('https://www.instagram.com/?variant=following');
    await settle(page);
    await page.evaluate(() => history.pushState({}, '', '/reels/'));
    await page.waitForURL('https://www.instagram.com/?variant=following');
  } finally { await browser.close(); }
});

test('Explore se convierte en búsqueda de perfiles', async () => {
  const { browser, page } = await openPage('instagram', instagramPages);
  try {
    await page.goto('https://www.instagram.com/?variant=following');
    await settle(page);
    await page.click('#nav-explore');
    await page.waitForURL('https://www.instagram.com/explore/search/');
  } finally { await browser.close(); }
});

test('el reel de una amiga se abre como publicación individual', async () => {
  const { browser, page } = await openPage('instagram', instagramPages);
  try {
    await page.goto('https://www.instagram.com/?variant=following');
    await settle(page);
    await page.click('#friend-reel');
    await page.waitForURL('https://www.instagram.com/p/ABC123/');
  } finally { await browser.close(); }
});

test('mensajes directos cargan sin redirección', async () => {
  const { browser, page } = await openPage('instagram', instagramPages);
  try {
    await page.goto('https://www.instagram.com/direct/inbox/');
    await settle(page);
    assert.equal(page.url(), 'https://www.instagram.com/direct/inbox/');
  } finally { await browser.close(); }
});

test('con "Ocultar recomendaciones" apagado, no se tocan el inicio ni las sugerencias', async () => {
  const { browser, page } = await openPage('instagram-no-recommendations', instagramPages);
  try {
    await page.goto('https://www.instagram.com/');
    await settle(page);
    assert.equal(page.url(), 'https://www.instagram.com/');
    assert.equal(await isHidden(page, '#post-suggested'), false);
    assert.equal(await isHidden(page, '#nav-reels'), true, 'Reels sigue bloqueado');
  } finally { await browser.close(); }
});

test('el script no se ejecuta en páginas de inicio de sesión de terceros', async () => {
  const { browser, page } = await openPage('instagram', instagramPages);
  try {
    await page.goto('https://www.facebook.com/login.php');
    await settle(page);
    assert.equal(await page.evaluate(() => document.documentElement.getAttribute('data-presente')), null);
    assert.equal(await isHidden(page, '#nav-reels'), false);
  } finally { await browser.close(); }
});

test('si el sitio reescribe la URL, no hay bucle infinito de recargas', async () => {
  let loads = 0;
  const { browser, page } = await openPage('instagram', (url) => {
    if (url.hostname !== 'www.instagram.com') { return null; }
    loads++;
    return 'instagram-rewrites-url.html';
  });
  try {
    await page.goto('https://www.instagram.com/?variant=following');
    await settle(page, 2500);
    assert.ok(loads <= 5, 'cargas: ' + loads);
    assert.equal(await page.textContent('#post'), 'ok');
  } finally { await browser.close(); }
});
