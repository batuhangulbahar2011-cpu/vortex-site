/* Vortex site — language switch, hero demo, feature stage.
   English text lives in index.html. Turkish text lives in js/tr.js.
   The page works without this file: English and the "needs your OK" hero step stay visible. */
(function () {
  'use strict';

  var root = document.documentElement;
  var TR = window.VORTEX_TR || {};
  var EN = {};
  var STORE_KEY = 'vortex-lang';
  var SHOT_BASE = 'assets/shots/';
  var lang = 'en';
  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function each(sel, fn, scope) { Array.prototype.forEach.call((scope || document).querySelectorAll(sel), fn); }

  /* =================================================================
     1. Language: read English from the HTML once, swap in Turkish.
        data-i18n         -> textContent (plain text)
        data-i18n-html    -> innerHTML (only strings with <kbd>, <code>, <strong>, <a>)
        data-i18n-alt / -aria / -content -> alt / aria-label / content attributes
     ================================================================= */
  each('[data-i18n]', function (el) { EN[el.getAttribute('data-i18n')] = el.textContent; });
  each('[data-i18n-html]', function (el) { EN[el.getAttribute('data-i18n-html')] = el.innerHTML; });
  each('[data-i18n-alt]', function (el) { EN[el.getAttribute('data-i18n-alt')] = el.getAttribute('alt'); });
  each('[data-i18n-aria]', function (el) { EN[el.getAttribute('data-i18n-aria')] = el.getAttribute('aria-label'); });
  each('[data-i18n-content]', function (el) { EN[el.getAttribute('data-i18n-content')] = el.getAttribute('content'); });

  function t(key) {
    var dict = lang === 'tr' ? TR : EN;
    return Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : EN[key];
  }
  function locSrc(src) { return src.replace(/-(en|tr)\.webp$/, '-' + lang + '.webp'); }

  function applyLang(next, save) {
    lang = next === 'tr' ? 'tr' : 'en';
    root.setAttribute('lang', lang);
    each('[data-i18n]', function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    each('[data-i18n-html]', function (el) { el.innerHTML = t(el.getAttribute('data-i18n-html')); });
    each('[data-i18n-alt]', function (el) { el.setAttribute('alt', t(el.getAttribute('data-i18n-alt'))); });
    each('[data-i18n-aria]', function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
    each('[data-i18n-content]', function (el) { el.setAttribute('content', t(el.getAttribute('data-i18n-content'))); });
    each('img.loc', function (img) { img.src = locSrc(img.getAttribute('src')); });
    each('.lang button', function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)); });
    if (current) showFeature(current, true, true);
    if (save) {
      try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
      // Keep a ?lang= link in the address bar in step with the choice.
      if (/[?&]lang=/.test(location.search) && window.history && history.replaceState) {
        try { history.replaceState(null, '', location.pathname + location.search.replace(/([?&]lang=)(en|tr)/, '$1' + lang) + location.hash); } catch (e) {}
      }
    }
    root.classList.remove('i18n-wait');
  }

  each('.lang button', function (b) {
    b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang'), true); });
  });

  /* =================================================================
     2. Hero demo: terminal + island loop through working -> needs your OK -> done.
        Pauses on hover/focus, when off-screen or the tab is hidden, and with the
        pause button. With reduced motion it stays on "needs your OK".
     ================================================================= */
  var demo = document.getElementById('demo');
  if (demo) {
    var islands = demo.querySelectorAll('.island');
    var segBtns = demo.querySelectorAll('.seg button');
    var pp = demo.querySelector('.playpause');
    var DUR = [3400, 4600, 3200];
    var step = 1, timer = null, userPaused = false, hovering = false, focusIn = false, visible = true;

    var go = function (n) {
      step = n;
      demo.setAttribute('data-step', String(n));
      Array.prototype.forEach.call(islands, function (img) {
        var on = img.getAttribute('data-step') === String(n);
        img.classList.toggle('is-on', on);
        if (on) img.removeAttribute('aria-hidden'); else img.setAttribute('aria-hidden', 'true');
      });
      Array.prototype.forEach.call(segBtns, function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-go') === String(n)));
      });
    };
    var running = function () { return !reduced && !userPaused && !hovering && !focusIn && visible && !document.hidden; };
    var schedule = function () {
      clearTimeout(timer);
      if (running()) timer = setTimeout(function () { go((step + 1) % 3); schedule(); }, DUR[step]);
    };

    Array.prototype.forEach.call(segBtns, function (b) {
      b.addEventListener('click', function () { go(+b.getAttribute('data-go')); schedule(); });
    });
    demo.addEventListener('mouseenter', function () { hovering = true; schedule(); });
    demo.addEventListener('mouseleave', function () { hovering = false; schedule(); });
    demo.addEventListener('focusin', function () { focusIn = true; schedule(); });
    demo.addEventListener('focusout', function (e) { if (!demo.contains(e.relatedTarget)) { focusIn = false; schedule(); } });
    document.addEventListener('visibilitychange', schedule);

    if (!reduced && pp) {
      pp.hidden = false;
      pp.addEventListener('click', function () {
        userPaused = !userPaused;
        pp.classList.toggle('is-paused', userPaused);
        schedule();
      });
      go(0);
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        schedule();
      }, { threshold: 0.15 }).observe(demo);
    }
    schedule();
  }

  // Pause the hero's background glow while the hero is off-screen.
  var hero = document.querySelector('.hero');
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      hero.classList.toggle('is-offscreen', !entries[0].isIntersecting);
    }).observe(hero);
  }

  /* =================================================================
     3. Features: on wide screens a sticky "stage" shows the picked feature.
        Hover, focus, click or scrolling past a card swaps the picture.
     ================================================================= */
  var stage = document.getElementById('stage');
  var feats = Array.prototype.slice.call(document.querySelectorAll('.feat'));
  var imgs = stage ? stage.querySelectorAll('.stage-img') : [];
  var capNum = stage && stage.querySelector('.stage-num');
  var capTitle = stage && stage.querySelector('.stage-title');
  var current = null;
  var front = 0;

  function showFeature(li, force, instant) {
    if (!stage || !li || (li === current && !force)) return;
    var shot = li.getAttribute('data-shot');
    var btn = li.querySelector('.feat-btn');
    var src = SHOT_BASE + shot + '-' + lang + '.webp';
    var alt = t('alt.' + shot) || '';
    current = li;
    feats.forEach(function (f) {
      var on = f === li;
      f.classList.toggle('is-active', on);
      var b = f.querySelector('.feat-btn');
      if (b) b.setAttribute('aria-pressed', String(on));
    });
    stage.setAttribute('data-tint', li.getAttribute('data-tint') || 'lav');
    if (capNum) capNum.textContent = (li.querySelector('.num') || {}).textContent || '';
    if (capTitle && btn) capTitle.textContent = btn.textContent;

    var cur = imgs[front];
    if (cur.getAttribute('src') === src) { cur.setAttribute('alt', alt); return; }
    if (instant || reduced) { cur.src = src; cur.setAttribute('alt', alt); return; }
    var nxt = imgs[1 - front];
    var swap = function () {
      nxt.setAttribute('alt', alt);
      nxt.removeAttribute('aria-hidden');
      cur.setAttribute('alt', '');
      cur.setAttribute('aria-hidden', 'true');
      nxt.classList.add('is-on');
      cur.classList.remove('is-on');
      front = 1 - front;
    };
    nxt.onload = null;
    if (nxt.getAttribute('src') === src && nxt.complete) { swap(); return; }
    nxt.onload = function () { nxt.onload = null; if (current === li) swap(); };
    nxt.src = src;
  }

  var wide = window.matchMedia ? window.matchMedia('(min-width: 1000px)') : { matches: false };
  var canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  feats.forEach(function (li) {
    var btn = li.querySelector('.feat-btn');
    li.addEventListener('click', function () { showFeature(li); });
    if (btn) btn.addEventListener('focus', function () { showFeature(li); });
    if (canHover) {
      var hoverTimer;
      li.addEventListener('mouseenter', function () {
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(function () { showFeature(li); }, 60);
      });
      li.addEventListener('mouseleave', function () { clearTimeout(hoverTimer); });
    }
  });
  if (feats.length) { current = feats[0]; feats[0].classList.add('is-active'); }

  // Scrolling: the card crossing the middle of the screen becomes the active one.
  if (stage && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      if (!wide.matches) return;
      entries.forEach(function (e) { if (e.isIntersecting) showFeature(e.target); });
    }, { rootMargin: '-48% 0px -48% 0px' });
    feats.forEach(function (li) { io.observe(li); });
  }

  // Warm the cache for the stage pictures once the page has loaded.
  window.addEventListener('load', function () {
    if (!wide.matches) return;
    var run = function () {
      feats.forEach(function (li) { var i = new Image(); i.src = SHOT_BASE + li.getAttribute('data-shot') + '-' + lang + '.webp'; });
    };
    if ('requestIdleCallback' in window) window.requestIdleCallback(run); else setTimeout(run, 800);
  });

  /* =================================================================
     4. Start: ?lang=tr|en in the URL wins, then the saved choice, then English.
     ================================================================= */
  var saved = null;
  try { saved = localStorage.getItem(STORE_KEY); } catch (e) {}
  var m = /[?&]lang=(en|tr)(?:&|$)/.exec(location.search);
  if (m) saved = m[1];
  if (saved === 'tr') applyLang('tr', false);
  else root.classList.remove('i18n-wait');
})();
