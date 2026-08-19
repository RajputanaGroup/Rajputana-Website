/* ==========================================================================
   main.js — shared behaviour for all three pages.
   No dependencies, no build step. Every block guards for its own markup,
   so the same file can be loaded everywhere.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* --- 0. Preloader -------------------------------------------------------
     Waits for the window load event (so the hero image/fonts are in), but
     never holds the page hostage: a hard 2.6s ceiling dismisses it either
     way, and a minimum 900ms stops it flashing on a fast connection.     */
  (function () {
    var pre = document.getElementById('preloader');
    if (!pre) return;

    if (reduceMotion) {                      // respect the OS setting
      pre.remove();
      document.body.classList.remove('is-loading');
      return;
    }

    var started = Date.now();
    var dismissed = false;

    function dismiss() {
      if (dismissed) return;
      dismissed = true;
      var waited = Date.now() - started;
      var hold = Math.max(0, 1150 - waited);  // let the emblem finish drawing

      setTimeout(function () {
        pre.classList.add('is-done');
        document.body.classList.remove('is-loading');
        setTimeout(function () {
          pre.classList.add('is-hidden');
          setTimeout(function () { if (pre.parentNode) pre.remove(); }, 400);
        }, 850);
      }, hold);
    }

    if (document.readyState === 'complete') dismiss();
    else window.addEventListener('load', dismiss);

    setTimeout(dismiss, 3000);               // ceiling — never strand anyone
  })();

  /* --- 1. Editorial flags -------------------------------------------------
     Add ?flags=1 to any URL to reveal the "confirm before publishing" markers
     on unverified numbers and claims. Invisible to normal visitors.        */
  if (new URLSearchParams(location.search).get('flags') === '1') {
    document.body.dataset.flags = 'on';
  }

  /* --- 2. Mobile nav ----------------------------------------------------- */
  var navToggle = document.querySelector('.nav-toggle');
  var siteNav = document.querySelector('.site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      siteNav.dataset.open = String(!open);
      document.body.style.overflow = !open ? 'hidden' : '';
    });

    // Close the drawer after tapping a link
    siteNav.addEventListener('click', function (e) {
      if (e.target.closest('a') && window.innerWidth <= 900) {
        navToggle.setAttribute('aria-expanded', 'false');
        siteNav.dataset.open = 'false';
        document.body.style.overflow = '';
      }
    });
  }

  /* --- 3. "Our brands" dropdown ------------------------------------------ */
  document.querySelectorAll('.dropdown').forEach(function (dd) {
    var trigger = dd.querySelector('.dropdown__trigger');
    if (!trigger) return;

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!open));
    });

    dd.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    });
  });

  document.addEventListener('click', function (e) {
    document.querySelectorAll('.dropdown__trigger[aria-expanded="true"]').forEach(function (t) {
      if (!t.closest('.dropdown').contains(e.target)) t.setAttribute('aria-expanded', 'false');
    });
  });

  /* --- 4. Scroll reveal --------------------------------------------------- */
  var revealTargets = document.querySelectorAll('[data-reveal]');
  if (revealTargets.length && 'IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    revealTargets.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 6, 5) * 60 + 'ms';
      revealObserver.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* --- 5. Route rail scroll-spy (home) ------------------------------------ */
  var railLinks = document.querySelectorAll('.route-rail a');
  if (railLinks.length && 'IntersectionObserver' in window) {
    var sections = [];
    railLinks.forEach(function (link) {
      var target = document.querySelector(link.getAttribute('href'));
      if (target) sections.push({ link: link, el: target });
    });

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var match = sections.find(function (s) { return s.el === entry.target; });
        if (!match) return;
        if (entry.isIntersecting) {
          railLinks.forEach(function (l) { l.removeAttribute('aria-current'); });
          match.link.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { spy.observe(s.el); });
  }

  /* --- 6. Animated stat counters ------------------------------------------ */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !reduceMotion) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseFloat(el.dataset.count);
        var suffix = el.dataset.suffix || '';
        var start = performance.now();
        var duration = 1100;

        function tick(now) {
          var p = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + (p === 1 ? suffix : '');
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /* --- 7. Tab panels (brand portfolio, Skwsh collections) ----------------- */
  document.querySelectorAll('[data-tabs]').forEach(function (group) {
    var tabs = Array.prototype.slice.call(group.querySelectorAll('[role="tab"]'));

    function select(tab) {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.setAttribute('aria-selected', String(selected));
        t.tabIndex = selected ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !selected;
      });
    }

    group.addEventListener('click', function (e) {
      var tab = e.target.closest('[role="tab"]');
      if (tab) select(tab);
    });

    group.addEventListener('keydown', function (e) {
      var i = tabs.indexOf(document.activeElement);
      if (i === -1) return;
      var next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (next) { e.preventDefault(); next.focus(); select(next); }
    });
  });

  /* --- 8. Hero video ------------------------------------------------------
     The poster image is always in the DOM underneath. The video only fades
     in once it can actually play, so a missing file, a blocked autoplay or a
     slow connection all degrade to a clean image hero with no broken frame.
     To swap the video: change the data-src on the <video> element.         */
  document.querySelectorAll('[data-hero-video]').forEach(function (video) {
    var src = video.dataset.src;

    if (!src || reduceMotion) return;   // no source supplied yet → image hero

    var source = document.createElement('source');
    source.src = src;
    source.type = video.dataset.type || 'video/mp4';
    video.appendChild(source);

    video.addEventListener('canplay', function () { video.classList.add('is-playing'); }, { once: true });
    video.addEventListener('error', function () { video.remove(); });

    video.load();
    var attempt = video.play();
    if (attempt && attempt.catch) attempt.catch(function () { video.remove(); });
  });

  /* --- 9. Shade rail → product jump (FxStudio) ---------------------------- */
  var swatches = document.querySelectorAll('.swatch');
  if (swatches.length) {
    swatches.forEach(function (sw) {
      sw.addEventListener('click', function () {
        var target = document.getElementById(sw.dataset.target);
        if (!target) return;
        swatches.forEach(function (s) { s.removeAttribute('aria-current'); });
        sw.setAttribute('aria-current', 'true');
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        target.focus({ preventScroll: true });
      });
    });
  }

  /* --- 10. Quote slider --------------------------------------------------- */
  document.querySelectorAll('[data-slider]').forEach(function (slider) {
    var track = slider.querySelector('.quotes__track');
    var prev = slider.querySelector('[data-slide="prev"]');
    var next = slider.querySelector('[data-slide="next"]');
    if (!track || !prev || !next) return;

    function step() {
      var card = track.querySelector(':scope > *');
      return card ? card.offsetWidth + 20 : track.clientWidth * 0.8;
    }

    function sync() {
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
    }

    prev.addEventListener('click', function () {
      track.scrollBy({ left: -step(), behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    next.addEventListener('click', function () {
      track.scrollBy({ left: step(), behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  });

  /* --- 11. Actives droplets (Skwsh) — tap to open on touch ---------------- */
  document.querySelectorAll('.drop').forEach(function (drop) {
    drop.addEventListener('click', function () {
      var open = drop.dataset.open === 'true';
      document.querySelectorAll('.drop[data-open="true"]').forEach(function (d) {
        d.dataset.open = 'false';
      });
      drop.dataset.open = String(!open);
    });
  });

  /* --- 12. Clip gallery (Skwsh) — play one at a time ---------------------- */
  document.querySelectorAll('.clip').forEach(function (clip) {
    var video = clip.querySelector('video');
    if (!video) return;

    clip.addEventListener('click', function () {
      if (video.paused) {
        document.querySelectorAll('.clip[data-playing="true"]').forEach(function (other) {
          other.dataset.playing = 'false';
          var v = other.querySelector('video');
          if (v) v.pause();
        });
        video.play();
        clip.dataset.playing = 'true';
      } else {
        video.pause();
        clip.dataset.playing = 'false';
      }
    });

    video.addEventListener('ended', function () { clip.dataset.playing = 'false'; });
  });

  /* --- 13. Image fallbacks ------------------------------------------------
     Any <img data-fallback="..."> swaps to the fallback if the primary file
     is missing, so a not-yet-supplied asset never shows a broken icon.     */
  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    function swap() {
      // "hide" removes the image entirely. For sub-brand marks, showing a
      // different brand's logo is worse than showing none at all.
      if (img.dataset.fallback === 'hide') { img.style.display = 'none'; return; }
      if (img.src !== img.dataset.fallback) img.src = img.dataset.fallback;
    }
    img.addEventListener('error', swap, { once: true });
    // This script runs at the end of <body>, so an image may have already
    // failed before the listener existed. Catch that case too.
    if (img.complete && img.naturalWidth === 0) swap();
  });
})();
