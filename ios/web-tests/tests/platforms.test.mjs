import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openPage, isHidden, settle } from './helpers.mjs';

test('X: elige "Following", oculta "For you", tendencias y "Who to follow"; nunca toca botones de seguir', async () => {
  const { browser, page } = await openPage('x', (u) => u.hostname === 'x.com' ? 'x-home.html' : null);
  try {
    await page.goto('https://x.com/home');
    await settle(page, 600);
    const clicks = await page.evaluate(() => window.clicks);
    assert.deepEqual(clicks, ['following-tab']);
    assert.equal(await isHidden(page, '#tab-foryou'), true);
    assert.equal(await isHidden(page, '#trend-1'), true);
    assert.equal(await isHidden(page, '#wtf'), true);
    assert.equal(await isHidden(page, '#dm'), false, 'mensajes visibles');
    assert.equal(await isHidden(page, '#follow-button'), false);
  } finally { await browser.close(); }
});

test('X: el feed se detiene después de 40 publicaciones con un cierre tranquilo', async () => {
  const { browser, page } = await openPage('x', (u) => u.hostname === 'x.com' ? 'x-home.html' : null);
  try {
    await page.goto('https://x.com/home');
    await settle(page, 600);
    assert.equal(await isHidden(page, '#tweet-0'), false);
    assert.equal(await isHidden(page, '#tweet-39'), false);
    assert.equal(await isHidden(page, '#tweet-40'), true);
    assert.equal(await isHidden(page, '#tweet-44'), true);
    assert.ok(await page.$('#presente-feed-end'));
    // Las que llegan después (scroll infinito) también quedan fuera.
    await page.evaluate(() => {
      const a = document.createElement('article'); a.setAttribute('data-testid','tweet'); a.id = 'late';
      document.getElementById('timeline').appendChild(a);
    });
    await settle(page);
    assert.equal(await isHidden(page, '#late'), true);
  } finally { await browser.close(); }
});

test('Instagram DM: el chat sigue usable y los enlaces compartidos no abren Reels ni Explore', async () => {
  const { browser, page } = await openPage('instagram', (u) => {
    if (u.hostname !== 'www.instagram.com') { return null; }
    return u.pathname.startsWith('/direct/t/') ? 'instagram-dm.html' : 'generic.html';
  });
  try {
    await page.goto('https://www.instagram.com/direct/t/123/');
    await settle(page);
    assert.equal(page.url(), 'https://www.instagram.com/direct/t/123/');
    await page.fill('#composer', 'Respuesta');
    assert.equal(await page.inputValue('#composer'), 'Respuesta');
    assert.equal(await page.evaluate(() => { const m = document.getElementById('thread'); m.scrollTop = 500; return m.scrollTop; }), 500);
    await page.click('#shared-reel');
    await page.waitForURL('https://www.instagram.com/p/XYZ789/');
    await page.goto('https://www.instagram.com/direct/t/123/');
    await page.click('#shared-explore');
    await page.waitForURL('https://www.instagram.com/explore/search/');
    await page.goto('https://www.instagram.com/direct/t/123/');
    await page.click('#back-inbox');
    await page.waitForURL('https://www.instagram.com/direct/inbox/');
  } finally { await browser.close(); }
});

test('TikTok: "Para ti" lleva a "Siguiendo"', async () => {
  const { browser, page } = await openPage('tiktok', (u) => u.hostname === 'www.tiktok.com' ? 'generic.html' : null);
  try {
    await page.goto('https://www.tiktok.com/foryou');
    await page.waitForURL('https://www.tiktok.com/following');
  } finally { await browser.close(); }
});

test('Reddit: Popular y All regresan al inicio también dentro de la SPA', async () => {
  const { browser, page } = await openPage('reddit', (u) => u.hostname === 'www.reddit.com' ? 'generic.html' : null);
  try {
    await page.goto('https://www.reddit.com/r/swift/');
    await settle(page);
    await page.evaluate(() => history.pushState({}, '', '/r/popular/'));
    await page.waitForURL('https://www.reddit.com/');
  } finally { await browser.close(); }
});

test('Pinterest: el inicio se vuelve un buscador; tableros visibles', async () => {
  const { browser, page } = await openPage('pinterest', (u) => u.hostname === 'www.pinterest.com' && u.pathname === '/' ? 'pinterest-home.html' : (u.hostname === 'www.pinterest.com' ? 'generic.html' : null));
  try {
    await page.goto('https://www.pinterest.com/');
    await settle(page);
    assert.equal(await isHidden(page, '#homefeed'), true);
    assert.equal(await isHidden(page, '#today'), true);
    assert.equal(await isHidden(page, '#boards'), false);
    await page.fill('#presente-calm input', 'sala nórdica');
    await page.click('#presente-calm button');
    await page.waitForURL('https://www.pinterest.com/search/pins/?q=sala%20n%C3%B3rdica');
  } finally { await browser.close(); }
});

test('Facebook: Reels y Watch regresan a "Más recientes"', async () => {
  const { browser, page } = await openPage('facebook', (u) => u.hostname === 'm.facebook.com' ? 'generic.html' : null);
  try {
    await page.goto('https://m.facebook.com/reels/');
    await page.waitForURL('https://m.facebook.com/?sk=h_chr');
    await page.goto('https://m.facebook.com/watch/');
    await page.waitForURL('https://m.facebook.com/?sk=h_chr');
  } finally { await browser.close(); }
});
