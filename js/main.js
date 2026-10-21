/* Dra. Marina Albuquerque · interações leves (sem bibliotecas) */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* Header muda ao rolar */
  var header = document.querySelector('.site-header');
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Menu mobile */
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('menu-mobile');
  var closeBtn = menu.querySelector('.menu-close');
  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
    if (open) { closeBtn.focus(); } else { toggle.focus({ preventScroll: true }); }
  }
  toggle.addEventListener('click', function () { setMenu(true); });
  closeBtn.addEventListener('click', function () { setMenu(false); });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) { setMenu(false); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); }
  });

  /* Revelar ao rolar (cascata via --d no HTML) */
  var revealEls = document.querySelectorAll('.reveal, .steps');
  if (!hasIO || reduce) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* Botão flutuante: aparece após o hero (ou 2 s), some quando o CTA final está na tela */
  var fab = document.querySelector('.wa-float');
  var hero = document.querySelector('.hero');
  var ctaFinal = document.querySelector('.cta-final');
  var pastHero = false, timeUp = false, finalVisible = false;
  function updateFab() {
    fab.classList.toggle('is-visible', (pastHero || timeUp) && !finalVisible);
  }
  setTimeout(function () { timeUp = true; updateFab(); }, 2000);
  if (hasIO) {
    new IntersectionObserver(function (e) { pastHero = !e[0].isIntersecting; updateFab(); }, { threshold: 0.35 }).observe(hero);
    new IntersectionObserver(function (e) { finalVisible = e[0].isIntersecting; updateFab(); }, { threshold: 0.4 }).observe(ctaFinal);
  } else {
    timeUp = true; updateFab();
  }

  /* Mapa: carrega o Google Maps só quando a pessoa pede */
  var mapFrame = document.querySelector('.map-frame');
  var mapBtn = mapFrame && mapFrame.querySelector('button.map-load');
  if (mapBtn) {
    mapBtn.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      iframe.src = mapFrame.getAttribute('data-map-src');
      iframe.title = 'Mapa do consultório no Centro de Barra do Garças';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      mapFrame.appendChild(iframe);
      mapFrame.classList.add('is-live');
    });
  }

  /* FAQ: um aberto por vez */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      faqItems.forEach(function (other) { if (other !== item) other.open = false; });
    });
  });

  /* Indicadores do carrossel de depoimentos (mobile) */
  var track = document.querySelector('.testimonials');
  var dots = document.querySelectorAll('.carousel-dots span');
  if (track && dots.length) {
    track.addEventListener('scroll', function () {
      var cards = track.children;
      var center = track.scrollLeft + track.clientWidth / 2;
      var idx = 0, best = Infinity;
      for (var i = 0; i < cards.length; i++) {
        var c = cards[i].offsetLeft + cards[i].offsetWidth / 2;
        var dist = Math.abs(c - center);
        if (dist < best) { best = dist; idx = i; }
      }
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === idx); });
    }, { passive: true });
  }

  /* Ano no rodapé */
  var year = document.getElementById('ano');
  if (year) year.textContent = new Date().getFullYear();

  /* Medição de cliques nos CTAs (Google Analytics 4 / Meta Pixel, se instalados) */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href*="wa.me"]');
    if (!link) return;
    var id = link.id || 'cta-sem-id';
    if (typeof window.gtag === 'function') window.gtag('event', 'clique_whatsapp', { cta_id: id });
    if (typeof window.fbq === 'function') window.fbq('track', 'Contact', { cta_id: id });
  });
})();
