/* Aviso de site modelo
   Abre ao entrar no site e em qualquer clique nos botões de WhatsApp da personagem.
   O botão do aviso leva ao WhatsApp de quem criou o site. */
(function () {
  'use strict';

  var CONTATO = 'https://wa.me/5564993282549?text=' +
    encodeURIComponent('Olá! Vi o site modelo de fisioterapia e quero criar um site.');
  var WA_ICON = '<svg class="icon icon-fill" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>';

  var dialog, lastFocus;

  function build() {
    dialog = document.createElement('div');
    dialog.className = 'modelo-dialog';
    dialog.hidden = true;
    dialog.innerHTML =
      '<div class="modelo-panel" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="modelo-title" aria-describedby="modelo-desc">' +
      '<button type="button" class="modelo-close" data-modelo="close" aria-label="Fechar aviso">' +
      '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>' +
      '<span class="modelo-tag">Site de demonstração</span>' +
      '<h2 id="modelo-title">Este é um site modelo</h2>' +
      '<p id="modelo-desc">A Dra. Marina Albuquerque, os telefones, endereços, depoimentos e demais informações deste site são <strong>fictícios</strong>. ' +
      'Ele foi criado para mostrar como pode ficar o site de um profissional da saúde.</p>' +
      '<p class="modelo-cta-text">Gostou? Eu crio um site como este para você.</p>' +
      '<div class="modelo-actions">' +
      '<a class="btn btn-whatsapp" data-modelo="contato" href="' + CONTATO + '" target="_blank" rel="noopener">' + WA_ICON + 'Quero um site assim</a>' +
      '<button type="button" class="btn btn-ghost" data-modelo="close">Continuar vendo o modelo</button>' +
      '</div></div>';
    document.body.appendChild(dialog);

    dialog.addEventListener('click', function (e) {
      if (e.target === dialog || e.target.closest('[data-modelo="close"]')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (dialog.hidden) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') {
        var f = dialog.querySelectorAll('a, button');
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    /* Todo botão de WhatsApp da personagem abre o aviso no lugar da conversa */
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href*="wa.me"]');
      if (!link || link.hasAttribute('data-modelo')) return;
      e.preventDefault();
      open();
    }, true);
  }

  function open() {
    if (!dialog.hidden) return;
    lastFocus = document.activeElement;
    dialog.hidden = false;
    document.body.classList.add('modelo-open');
    dialog.querySelector('.modelo-panel').focus({ preventScroll: true });
  }
  function close() {
    if (dialog.hidden) return;
    dialog.hidden = true;
    document.body.classList.remove('modelo-open');
    if (lastFocus && lastFocus.focus && lastFocus !== document.body) lastFocus.focus({ preventScroll: true });
  }

  function init() { build(); open(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
