import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openPage, isHidden, settle } from './helpers.mjs';

function youtubePages(url) {
  if (url.hostname !== 'm.youtube.com') { return null; }
  if (url.pathname === '/') { return 'youtube-home.html'; }
  if (url.pathname === '/watch') { return 'youtube-watch.html'; }
  return 'generic.html';
}

test('el inicio no muestra recomendaciones y ofrece un buscador', async () => {
  const { browser, page } = await openPage('youtube', youtubePages);
  try {
    await page.goto('https://m.youtube.com/');
    await settle(page);
    assert.equal(await isHidden(page, '#grid'), true);
    assert.equal(await isHidden(page, '#chips'), true);
    assert.equal(await isHidden(page, '#presente-calm'), false);
    assert.equal(await isHidden(page, '#pivot-subs'), false);
    await page.fill('#presente-calm input', 'recetas de mole');
    await page.click('#presente-calm button');
    await page.waitForURL('https://m.youtube.com/results?search_query=recetas%20de%20mole');
  } finally { await browser.close(); }
});

test('Shorts desaparece de la barra y de las listas', async () => {
  const { browser, page } = await openPage('youtube', youtubePages);
  try {
    await page.goto('https://m.youtube.com/');
    await settle(page);
    assert.equal(await isHidden(page, '#pivot-shorts'), true);
    assert.equal(await isHidden(page, '#shorts-shelf'), true);
    assert.equal(await isHidden(page, '#pivot-home'), false);
  } finally { await browser.close(); }
});

test('un enlace a un Short abre el video normal (sin el carrusel infinito)', async () => {
  const { browser, page } = await openPage('youtube', youtubePages);
  try {
    await page.goto('https://m.youtube.com/shorts/abc123');
    await page.waitForURL('https://m.youtube.com/watch?v=abc123');
  } finally { await browser.close(); }
});

test('la página del video oculta relacionados y pantalla final, conserva comentarios', async () => {
  const { browser, page } = await openPage('youtube', youtubePages);
  try {
    await page.goto('https://m.youtube.com/watch?v=first');
    await settle(page);
    assert.equal(await isHidden(page, '#related'), true);
    assert.equal(await isHidden(page, '#endscreen'), true);
    assert.equal(await isHidden(page, '#metadata'), false);
    assert.equal(await isHidden(page, '#comments'), false);
  } finally { await browser.close(); }
});

test('se apaga el interruptor de reproducción automática', async () => {
  const { browser, page } = await openPage('youtube', youtubePages);
  try {
    let clicked = false;
    await page.exposeFunction('markClicked', () => { clicked = true; });
    await page.goto('https://m.youtube.com/watch?v=first');
    await page.evaluate(() => document.getElementById('autoplay-toggle').addEventListener('click', () => window.markClicked()));
    await page.evaluate(() => document.body.appendChild(document.createElement('div')));
    await settle(page);
    assert.equal(clicked, true);
  } finally { await browser.close(); }
});

test('un video que empieza solo (sin toque) se revierte', async () => {
  const { browser, page } = await openPage('youtube', youtubePages);
  try {
    await page.goto('https://m.youtube.com/watch?v=first');
    await page.waitForTimeout(2700); // sin interacción
    await page.evaluate(() => history.pushState({}, '', '/watch?v=autoplayed'));
    await page.waitForURL('https://m.youtube.com/watch?v=first');
  } finally { await browser.close(); }
});

test('un video elegido con un toque sí se abre', async () => {
  const { browser, page } = await openPage('youtube', youtubePages);
  try {
    await page.goto('https://m.youtube.com/watch?v=first');
    await page.waitForTimeout(2700);
    await page.click('#user-link');
    await settle(page, 900);
    assert.equal(page.url(), 'https://m.youtube.com/watch?v=chosen');
  } finally { await browser.close(); }
});

test('con recomendaciones permitidas, el inicio se muestra normal', async () => {
  const { browser, page } = await openPage('youtube-no-recommendations', youtubePages);
  try {
    await page.goto('https://m.youtube.com/');
    await settle(page);
    assert.equal(await isHidden(page, '#grid'), false);
    assert.equal(await page.$('#presente-calm'), null);
    assert.equal(await isHidden(page, '#shorts-shelf'), true, 'Shorts sigue bloqueado');
  } finally { await browser.close(); }
});
