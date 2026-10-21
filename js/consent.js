/* Consentimento de cookies (LGPD)
   Nada de análise ou marketing é carregado antes de a pessoa aceitar.
   Para ativar, preencha os IDs abaixo; vazios = a ferramenta nunca carrega. */
(function () {
  'use strict';

  var CONFIG = {
    GA_ID: '',          // ex.: 'G-XXXXXXXXXX' (Google Analytics 4)
    META_PIXEL_ID: ''   // ex.: '000000000000000' (Meta Pixel)
  };
  var KEY = 'mf-consentimento-v1';
  var POLICY_URL = 'politica-de-privacidade.html';

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; }
  }
  function save(c) {
    c.data = new Date().toISOString();
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) { /* navegação privada */ }
    return c;
  }

  /* Google Consent Mode v2: começa tudo negado */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied', wait_for_update: 500
  });

  var loaded = { ga: false, meta: false };
  function apply(c) {
    gtag('consent', 'update', {
      analytics_storage: c.analytics ? 'granted' : 'denied',
      ad_storage: c.marketing ? 'granted' : 'denied',
      ad_user_data: c.marketing ? 'granted' : 'denied',
      ad_personalization: c.marketing ? 'granted' : 'denied'
    });
    if (c.analytics && CONFIG.GA_ID && !loaded.ga) {
      loaded.ga = true;
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + CONFIG.GA_ID;
      document.head.appendChild(s);
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', CONFIG.GA_ID, { anonymize_ip: true });
    }
    if (c.marketing && CONFIG.META_PIXEL_ID && !loaded.meta) {
      loaded.meta = true;
      /* Código padrão do Meta Pixel */
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', CONFIG.META_PIXEL_ID);
      window.fbq('track', 'PageView');
    }
  }

  /* ---------- Interface ---------- */
  var banner, dialog, lastFocus;

  function build() {
    banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Aviso de cookies');
    banner.innerHTML =
      '<p class="cookie-text"><strong>Sua privacidade importa.</strong> Usamos apenas o essencial para o site funcionar. ' +
      'Com a sua permissão, também usamos cookies de análise para entender como o site é usado. ' +
      '<a href="' + POLICY_URL + '#cookies">Saiba mais</a>.</p>' +
      '<div class="cookie-actions">' +
      '<button type="button" class="btn btn-ghost btn-sm" data-c="prefs">Personalizar</button>' +
      '<button type="button" class="btn btn-ghost btn-sm" data-c="reject">Recusar</button>' +
      '<button type="button" class="btn btn-primary btn-sm" data-c="accept">Aceitar todos</button>' +
      '</div>';
    document.body.appendChild(banner);

    dialog = document.createElement('div');
    dialog.className = 'cookie-dialog';
    dialog.hidden = true;
    dialog.innerHTML =
      '<div class="cookie-panel" role="dialog" aria-modal="true" aria-labelledby="cookie-title">' +
      '<h2 id="cookie-title">Preferências de cookies</h2>' +
      '<p class="small">Escolha o que podemos usar. Você pode mudar isso quando quiser pelo link "Preferências de cookies" no rodapé.</p>' +
      '<div class="cookie-opt"><div><strong>Essenciais</strong><span>Guardam a sua escolha sobre cookies. Não identificam você.</span></div>' +
      '<span class="cookie-always">Sempre ativos</span></div>' +
      '<label class="cookie-opt" for="ck-analytics"><div><strong>Análise</strong><span>Contam visitas e cliques de forma agregada (Google Analytics).</span></div>' +
      '<input type="checkbox" id="ck-analytics" class="switch"></label>' +
      '<label class="cookie-opt" for="ck-marketing"><div><strong>Marketing</strong><span>Medem anúncios nas redes sociais (Meta Pixel).</span></div>' +
      '<input type="checkbox" id="ck-marketing" class="switch"></label>' +
      '<div class="cookie-actions">' +
      '<button type="button" class="btn btn-ghost btn-sm" data-c="reject">Recusar todos</button>' +
      '<button type="button" class="btn btn-primary btn-sm" data-c="save">Salvar escolhas</button>' +
      '</div></div>';
    document.body.appendChild(dialog);

    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-c], [data-cookie-prefs]');
      if (!t) {
        if (e.target === dialog) closePrefs();
        return;
      }
      if (t.hasAttribute('data-cookie-prefs')) { e.preventDefault(); openPrefs(); return; }
      var a = t.getAttribute('data-c');
      if (a === 'accept') decide({ analytics: true, marketing: true });
      else if (a === 'reject') decide({ analytics: false, marketing: false });
      else if (a === 'prefs') openPrefs();
      else if (a === 'save') decide({
        analytics: document.getElementById('ck-analytics').checked,
        marketing: document.getElementById('ck-marketing').checked
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !dialog.hidden) closePrefs();
    });
  }

  function decide(c) {
    apply(save(c));
    banner.classList.remove('is-visible');
    closePrefs();
  }
  function openPrefs() {
    var c = read() || {};
    document.getElementById('ck-analytics').checked = !!c.analytics;
    document.getElementById('ck-marketing').checked = !!c.marketing;
    lastFocus = document.activeElement;
    dialog.hidden = false;
    document.body.classList.add('menu-open');
    dialog.querySelector('input').focus();
  }
  function closePrefs() {
    if (dialog.hidden) return;
    dialog.hidden = true;
    document.body.classList.remove('menu-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function init() {
    build();
    var c = read();
    if (c) { apply(c); } else { banner.classList.add('is-visible'); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
