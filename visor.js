/* Puente entre la web de PokeLobby (ventana padre, otro origen) y el motor de
 * combate de Showdown. El visor solo PINTA: no conoce el WebSocket, ni el pase,
 * ni las órdenes. La web le manda líneas del protocolo y él las anima.
 *
 * Padre -> visor (postMessage, objeto con campo t):
 *   {t:'iniciar', lado:'p1'|'p2', registro?:bool, oscuro?:bool, velocidad?:'normal'|'rapida'|'instantanea',
 *                 idioma?:'es'|'en', tema?:{fondo,campo,panel,texto,tenue,linea,linea2,acento,fuente,fuenteTitulos},
 *                 avatares?:{p1?:string, p2?:string}, altoRegistro?:int, escalaMax?:number}
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
  var q = new URLSearchParams(location.search);
  var idiomaUrl = q.get('lang') === 'en' ? 'en' : 'es';

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

  // ─── Tema: variables CSS de visor.css ────────────────────────────────
  var CLAVES_TEMA = {
    fondo: '--v-fondo', campo: '--v-campo', panel: '--v-panel', texto: '--v-texto', tenue: '--v-tenue',
    linea: '--v-linea', linea2: '--v-linea2', acento: '--v-acento', fuente: '--v-fuente', fuenteTitulos: '--v-fuente-titulos',
  };
  function tema(t) {
    var st = document.documentElement.style;
    Object.keys(CLAVES_TEMA).forEach(function (k) {
      var v = t && t[k];
      // Solo cadenas cortas sin llaves ni punto y coma (setProperty ya no deja
      // salir de la propiedad, esto es por si acaso).
      if (typeof v === 'string' && v.length < 120 && !/[{};<>]/.test(v)) st.setProperty(CLAVES_TEMA[k], v);
      else st.removeProperty(CLAVES_TEMA[k]);
    });
  }

  // ─── Retratos de entrenador ──────────────────────────────────────────
  // Se aceptan nombres de sprite de Showdown ('red', 'cynthia-gen4') o su URL
  // (https://play.pokemonshowdown.com/sprites/trainers/<nombre>.png). Otra
  // imagen cualquiera no: el motor solo pinta sprites de su carpeta de
  // entrenadores. Sin retrato válido, uno fijo por nombre (no cambia al reconectar).
  var POR_DEFECTO = ['lucas', 'dawn', 'ethan', 'lyra', 'hilbert', 'hilda', 'calem', 'serena'];
  var avatares = {};
  function nombreSprite(a) {
    if (typeof a !== 'string' || !a) return '';
    var m = /pokemonshowdown\.com\/sprites\/trainers\/([a-z0-9-]+)\.(?:png|gif)(?:\?.*)?$/i.exec(a);
    if (m) return m[1].toLowerCase();
    return /^[a-z0-9-]{1,40}$/i.test(a) ? a.toLowerCase() : '';
  }
  function porDefecto(nombre, otro) {
    var h = 0;
    for (var i = 0; i < (nombre || '').length; i++) h = (h * 31 + nombre.charCodeAt(i)) >>> 0;
    var s = POR_DEFECTO[h % POR_DEFECTO.length];
    return s === otro ? POR_DEFECTO[(h + 1) % POR_DEFECTO.length] : s;
  }
  function parchearLados(b) {
    var proto = Object.getPrototypeOf(b.p1);
    if (proto.__visor) return;
    proto.__visor = true;
    var setName = proto.setName;
    proto.setName = function (name, avatar) {
      setName.call(this, name, avatar);
      var propio = avatares[this.sideid];
      if (propio) this.setAvatar(propio);
      else if (!avatar) this.setAvatar(porDefecto(this.name, this.foe && this.foe.avatar));
    };
  }

  // ─── Tamaño: el campo ocupa el ancho del iframe ──────────────────────
  var escalaMax = 2;
  function escalar() {
    if (!battle) return;
    var ancho = document.documentElement.clientWidth || 640;
    var s = Math.min(ancho / 640, escalaMax);
    var $f = battle.scene.$frame;
    if (!$f) return;
    $f.css({
      transform: Math.abs(s - 1) < 0.005 ? 'none' : 'scale(' + s + ')',
      'transform-origin': 'top left',
      'margin-bottom': (360 * s - 360) + 'px',
      'margin-left': Math.max(0, (ancho - 640 * s) / 2) + 'px',
    });
    $('.visor').toggleClass('ampliado', s > 1.1);
    alto();
  }
  var ultimoAlto = 0;
  function alto() {
    var px = Math.ceil(document.body.getBoundingClientRect().height);
    if (px && px !== ultimoAlto) { ultimoAlto = px; enviar({ t: 'alto', px: px }); }
  }
  window.addEventListener('resize', escalar);

  // «Turn N» del campo está escrito a mano en el motor (no sale de BattleText).
  var vigiaTurno = new MutationObserver(function (cambios) {
    if (VisorIdioma.actual !== 'es') return;
    cambios.forEach(function (c) {
      for (var i = 0; i < c.addedNodes.length; i++) {
        var n = c.addedNodes[i];
        if (n.nodeType === 1 && n.classList.contains('turn')) n.textContent = n.textContent.replace(/^Turn /, 'Turno ');
      }
    });
  });

  function nuevo(opciones, log) {
    if (battle) { battle.destroy ? battle.destroy() : null; }
    $('.battle').empty(); $('.battle-log').empty();
    VisorIdioma.aplicar(opciones.idioma === 'en' || opciones.idioma === 'es' ? opciones.idioma : idiomaUrl);
    avatares = {
      p1: nombreSprite(opciones.avatares && opciones.avatares.p1),
      p2: nombreSprite(opciones.avatares && opciones.avatares.p2),
    };
    escalaMax = Math.max(1, Math.min(3, Number(opciones.escalaMax) || 2));
    tema(opciones.tema);
    var ar = opciones.altoRegistro | 0;
    if (ar >= 80 && ar <= 800) document.documentElement.style.setProperty('--v-alto-registro', ar + 'px');
    else document.documentElement.style.removeProperty('--v-alto-registro');
    battle = new Battle({
      $frame: $('.battle'), $logFrame: $('.battle-log'),
      id: 'pokelobby', log: log || [], paused: true, autoresize: true,
      isReplay: !!log,
    });
    // El escalado del motor solo reduce (< 640 px); se cambia por el nuestro.
    window.removeEventListener('resize', battle.onResize);
    parchearLados(battle);
    battle.subscribe(estado);
    if (opciones.lado === 'p2') battle.setViewpoint('p2');
    $(document.body).toggleClass('con-registro', !!opciones.registro);
    $(document.body).toggleClass('dark', !!opciones.oscuro);
    velocidad(opciones.velocidad);
    vigiaTurno.disconnect();
    vigiaTurno.observe($('.battle')[0], { childList: true, subtree: true });
    escalar();
    return battle;
  }

  var opciones = {};
  window.addEventListener('message', function (ev) {
    if (VISOR.padres.indexOf(ev.origin) < 0 || ev.source !== window.parent) return;
    padre = ev.origin;
    var m = ev.data || {};
    switch (m.t) {
    case 'iniciar':
      opciones = m; ultimoAlto = 0; nuevo(m);
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

  // Si cambia el alto por otra cosa (fuentes que llegan tarde, registro), se avisa.
  if (window.ResizeObserver) new ResizeObserver(alto).observe(document.body);

  // Anuncia que está listo a cualquier origen permitido (aún no sabemos cuál es).
  var carga = Math.round(performance.now() - (window.__t0 || 0));
  if (window.parent !== window) {
    VISOR.padres.forEach(function (o) {
      try { window.parent.postMessage({ t: 'listo', cargaMs: carga, recursos: VISOR.recursos }, o); } catch (e) {}
    });
  }
  window.__visor = { get battle() { return battle; }, cargaMs: carga };
})();
