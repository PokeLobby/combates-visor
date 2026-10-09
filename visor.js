/* Puente entre la web de PokeLobby (ventana padre, otro origen) y el motor de
 * combate de Showdown. El visor solo PINTA: no conoce el WebSocket, ni el pase,
 * ni las órdenes. La web le manda líneas del protocolo y él las anima.
 *
 * Padre -> visor (postMessage, objeto con campo t):
 *   {t:'iniciar', lado:'p1'|'p2', registro?:bool, oscuro?:bool, velocidad?:'normal'|'rapida'|'instantanea'}
 *   {t:'lineas', lineas:string[]}        // en vivo: se añaden a la cola y se animan
 *   {t:'repeticion', lineas:string[]}    // combate entero, empieza a reproducir
 *   {t:'control', accion:'pausa'|'seguir'|'turno', n?:int}
 *   {t:'sonido', activo:bool}
 * Visor -> padre:
 *   {t:'listo', cargaMs, recursos}        // motor cargado
 *   {t:'estado', estado, turno, alDia}    // alDia = ya ha pintado todo lo recibido
 *   {t:'alto', px}                        // para ajustar la altura del iframe
 */
(function () {
  'use strict';
  var padre = null;            // origen del padre aceptado
  var battle = null;

  // Efectos (fx/) siempre desde este sitio: son MIT y pesan poco.
  // Dex.fxPrefix se fija en visor-pre.js (antes de graphics.js).
  BattleSound.setMute(true);

  function enviar(msg) {
    if (padre && window.parent !== window) window.parent.postMessage(msg, padre);
  }
  function estado(e) {
    if (!battle) return;
    enviar({ t: 'estado', estado: e, turno: battle.turn, alDia: battle.atQueueEnd, fin: battle.ended });
  }
  function velocidad(v) {
    if (!battle) return;
    var tabla = { normal: [300, 1], rapida: [50, 1], instantanea: [1, 1] };
    var x = tabla[v] || tabla.normal;
    battle.messageFadeTime = x[0];
    battle.messageShownTime = x[1];
    battle.scene.updateAcceleration();
  }
  function nuevo(opciones, log) {
    if (battle) { battle.destroy ? battle.destroy() : null; }
    $('.battle').empty(); $('.battle-log').empty();
    battle = new Battle({
      $frame: $('.battle'), $logFrame: $('.battle-log'),
      id: 'pokelobby', log: log || [], paused: true, autoresize: true,
      isReplay: !!log,
    });
    battle.subscribe(estado);
    if (opciones.lado === 'p2') battle.setViewpoint('p2');
    $(document.body).toggleClass('con-registro', !!opciones.registro);
    $(document.body).toggleClass('dark', !!opciones.oscuro);
    velocidad(opciones.velocidad);
    alto();
    return battle;
  }
  function alto() { enviar({ t: 'alto', px: document.documentElement.scrollHeight }); }

  var opciones = {};
  window.addEventListener('message', function (ev) {
    if (VISOR.padres.indexOf(ev.origin) < 0 || ev.source !== window.parent) return;
    padre = ev.origin;
    var m = ev.data || {};
    switch (m.t) {
    case 'iniciar':
      opciones = m; nuevo(m);
      break;
    case 'lineas':
      if (!battle) nuevo(opciones);
      for (var i = 0; i < m.lineas.length; i++) battle.add(m.lineas[i]);
      if (battle.paused) battle.play();
      break;
    case 'repeticion':
      nuevo(opciones, m.lineas.slice());
      battle.play();
      break;
    case 'control':
      if (!battle) break;
      if (m.accion === 'pausa') battle.pause();
      else if (m.accion === 'seguir') battle.play();
      else if (m.accion === 'turno') battle.seekTurn(m.n | 0);
      break;
    case 'velocidad':
      velocidad(m.v); break;
    case 'sonido':
      if (battle) battle.setMute(!m.activo); break;
    }
  });

  // Anuncia que está listo a cualquier origen permitido (aún no sabemos cuál es).
  var carga = Math.round(performance.now() - (window.__t0 || 0));
  if (window.parent !== window) {
    VISOR.padres.forEach(function (o) {
      try { window.parent.postMessage({ t: 'listo', cargaMs: carga, recursos: VISOR.recursos }, o); } catch (e) {}
    });
  }
  window.__visor = { get battle() { return battle; }, cargaMs: carga };
})();
