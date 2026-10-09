/* Textos del registro de combate en español.
 *
 * El cliente de Showdown no tiene traducciones: los textos salen de la tabla
 * global BattleText (battledata.js), con plantillas como "[POKEMON] used **[MOVE]**!".
 * Aquí se sustituyen las plantillas más frecuentes por las de los juegos en
 * español. Lo que no está en esta lista se queda en inglés (no se rompe nada:
 * se usan los mismos marcadores [POKEMON], [MOVE]…).
 * Los nombres de Pokémon, movimientos, habilidades y objetos siguen en inglés
 * (vienen del protocolo y de los datos del motor, que no tienen otra lengua).
 *
 * Se activa con ?lang=es en la URL del iframe o con {t:'iniciar', idioma:'es'}.
 */
(function () {
  'use strict';
  var ES = {
    'default': {
      startBattle: '¡Empieza el combate entre [TRAINER] y [TRAINER]!',
      winBattle: '¡**[TRAINER]** ha ganado el combate!',
      tieBattle: '¡Empate entre [TRAINER] y [TRAINER]!',
      opposingPokemon: 'el [NICKNAME] rival',
      team: 'tu equipo',
      opposingTeam: 'el equipo rival',
      party: 'tus Pokémon aliados',
      opposingParty: 'los Pokémon rivales',
      turn: '== Turno [NUMBER] ==',
      switchIn: '¡[TRAINER] sacó a [FULLNAME]!',
      switchInOwn: '¡Adelante, [FULLNAME]!',
      switchOut: '¡[TRAINER] retiró a [NICKNAME]!',
      switchOutOwn: '¡[NICKNAME], vuelve!',
      drag: '¡[FULLNAME] fue arrastrado al combate!',
      faint: '¡[POKEMON] se debilitó!',
      move: '¡[POKEMON] usó **[MOVE]**!',
      abilityActivation: '[[ABILITY] de [POKEMON]]',
      mega: '  ¡La [ITEM] de [POKEMON] está reaccionando a la Piedra Llave!',
      megaNoItem: '  ¡[POKEMON] está reaccionando a la Piedra Llave de [TRAINER]!',
      megaGen6: '  ¡La [ITEM] de [POKEMON] está reaccionando al Mega-Aro de [TRAINER]!',
      transformMega: '¡[POKEMON] ha megaevolucionado en Mega-[SPECIES]!',
      zPower: '  ¡[POKEMON] se rodeó de su Poder Z!',
      zEffect: '  ¡[POKEMON] desata su movimiento Z a plena potencia!',
      terastallize: '  ¡[POKEMON] se ha teracristalizado en el tipo [TYPE]!',
      cant: '¡[POKEMON] no puede usar [MOVE]!',
      cantNoMove: '¡[POKEMON] no se puede mover!',
      fail: '  ¡Pero falló!',
      transform: '¡[POKEMON] se transformó!',
      typeChange: '  ¡[POKEMON] ahora es de tipo [TYPE]!',
      changeAbility: '  ¡[POKEMON] adquirió [ABILITY]!',
      takeItem: '  ¡[POKEMON] le robó [ITEM] a [SOURCE]!',
      eatItem: '  ([POKEMON] se comió su [ITEM].)',
      removeItem: '  ¡[POKEMON] perdió su [ITEM]!',
      activateItem: '  ([POKEMON] usó su [ITEM].)',
      damage: '  ([POKEMON] resultó herido.)',
      damagePercentage: '  ([POKEMON] perdió un [PERCENTAGE] de sus PS.)',
      damageFromPokemon: '  ¡[POKEMON] se hizo daño con el [ITEM] de [SOURCE]!',
      damageFromItem: '  ¡[POKEMON] se hizo daño con su [ITEM]!',
      damageFromPartialTrapping: '  ¡[POKEMON] sufre los efectos de [MOVE]!',
      heal: '  [POKEMON] recuperó PS.',
      healFromEffect: '  ¡[POKEMON] recuperó PS gracias a [EFFECT]!',
      boost: '  ¡[STAT] de [POKEMON] aumentó!',
      boost2: '  ¡[STAT] de [POKEMON] aumentó mucho!',
      boost3: '  ¡[STAT] de [POKEMON] aumentó muchísimo!',
      boost0: '  ¡[STAT] de [POKEMON] no puede subir más!',
      boostFromItem: '  ¡[ITEM] aumentó [STAT] de [POKEMON]!',
      boost2FromItem: '  ¡[ITEM] aumentó mucho [STAT] de [POKEMON]!',
      boost3FromItem: '  ¡[ITEM] aumentó muchísimo [STAT] de [POKEMON]!',
      unboostFromItem: '  ¡[ITEM] bajó [STAT] de [POKEMON]!',
      unboost2FromItem: '  ¡[ITEM] bajó mucho [STAT] de [POKEMON]!',
      unboost3FromItem: '  ¡[ITEM] bajó muchísimo [STAT] de [POKEMON]!',
      boostFromZEffect: '  ¡[POKEMON] aumentó [STAT] con su Poder Z!',
      boost2FromZEffect: '  ¡[POKEMON] aumentó mucho [STAT] con su Poder Z!',
      boost3FromZEffect: '  ¡[POKEMON] aumentó muchísimo [STAT] con su Poder Z!',
      unboost: '  ¡[STAT] de [POKEMON] bajó!',
      unboost2: '  ¡[STAT] de [POKEMON] bajó mucho!',
      unboost3: '  ¡[STAT] de [POKEMON] bajó muchísimo!',
      unboost0: '  ¡[STAT] de [POKEMON] no puede bajar más!',
      clearAllBoost: '  ¡Se anularon todos los cambios de características!',
      superEffective: '  ¡Es supereficaz!',
      superEffectiveSpread: '  ¡Es supereficaz contra [POKEMON]!',
      resisted: '  No es muy eficaz...',
      resistedSpread: '  No es muy eficaz contra [POKEMON].',
      crit: '  ¡Un golpe crítico!',
      critSpread: '  ¡Un golpe crítico contra [POKEMON]!',
      immune: '  No afecta a [POKEMON]...',
      immuneNoPokemon: '  ¡No ha tenido ningún efecto!',
      immuneOHKO: '  ¡[POKEMON] no se ve afectado!',
      miss: '  ¡[POKEMON] esquivó el ataque!',
      missNoPokemon: '  ¡El ataque de [SOURCE] falló!',
      noTarget: '  Pero no había objetivo...',
      ohko: '  ¡Fulminado de un golpe!',
      hitCount: '  ¡Recibió [NUMBER] golpes!',
      hitCountSingular: '  ¡Recibió 1 golpe!',
    },
    hp: { statName: 'PS', statShortName: 'PS' },
    atk: { statName: 'el Ataque', statShortName: 'Atq' },
    def: { statName: 'la Defensa', statShortName: 'Def' },
    spa: { statName: 'el Ataque Especial', statShortName: 'AtE' },
    spd: { statName: 'la Defensa Especial', statShortName: 'DfE' },
    spe: { statName: 'la Velocidad', statShortName: 'Vel' },
    accuracy: { statName: 'la precisión' },
    evasion: { statName: 'la evasión' },
    brn: { start: '  ¡[POKEMON] sufrió quemaduras!', alreadyStarted: '  ¡[POKEMON] ya está quemado!', end: '  ¡[POKEMON] ya no está quemado!', damage: '  ¡[POKEMON] se resiente de la quemadura!' },
    frz: { start: '  ¡[POKEMON] fue congelado!', alreadyStarted: '  ¡[POKEMON] ya está congelado!', end: '  ¡[POKEMON] se descongeló!', cant: '¡[POKEMON] está congelado!' },
    par: { start: '  ¡[POKEMON] está paralizado! ¡Puede que no se mueva!', alreadyStarted: '  ¡[POKEMON] ya está paralizado!', end: '  ¡[POKEMON] ya no está paralizado!', cant: '¡[POKEMON] está paralizado! ¡No se puede mover!' },
    psn: { start: '  ¡[POKEMON] fue envenenado!', alreadyStarted: '  ¡[POKEMON] ya está envenenado!', end: '  ¡[POKEMON] ya no está envenenado!', damage: '  ¡El veneno resta PS a [POKEMON]!' },
    tox: { start: '  ¡[POKEMON] fue gravemente envenenado!' },
    slp: { start: '  ¡[POKEMON] se durmió!', startFromRest: '  ¡[POKEMON] se echó a dormir y recuperó la salud!', alreadyStarted: '  ¡[POKEMON] ya está dormido!', end: '  ¡[POKEMON] se despertó!', cant: '[POKEMON] está profundamente dormido.' },
    confusion: { start: '  ¡[POKEMON] está confuso!', end: '  ¡[POKEMON] ya no está confuso!', activate: '  ¡[POKEMON] está confuso!', damage: '¡Está tan confuso que se hirió a sí mismo!' },
    flinch: { cant: '¡[POKEMON] retrocedió y no se pudo mover!' },
    recharge: { cant: '¡[POKEMON] necesita recuperarse!' },
    recoil: { damage: '  ¡[POKEMON] también se ha hecho daño!' },
    unboost: { fail: '  ¡No bajaron las características de [POKEMON]!', failSingular: '  ¡No bajó [STAT] de [POKEMON]!' },
    roughskin: { damage: '  ¡[POKEMON] resultó herido!' },
    rockyhelmet: { damage: '  ¡[POKEMON] resultó herido por el Casco Dentado!' },
    lifeorb: { damage: '  ¡[POKEMON] perdió algunos PS!' },
    leftovers: { heal: '  ¡[POKEMON] recuperó unos pocos PS con los Restos!' },
    blacksludge: { heal: '  ¡[POKEMON] recuperó unos pocos PS con el Lodo Negro!' },
    focussash: { end: '  ¡[POKEMON] aguantó gracias a la Banda Focus!' },
    sturdy: { activate: '  ¡[POKEMON] aguantó el golpe!' },
    airballoon: { start: '  ¡[POKEMON] flota en el aire con su Globo Helio!', end: '  ¡El Globo Helio de [POKEMON] explotó!' },
    uturn: { switchOut: '¡[POKEMON] volvió junto a [TRAINER]!' },
    protect: { start: '  ¡[POKEMON] se está protegiendo!', block: '  ¡[POKEMON] se está protegiendo!' },
    substitute: { start: '  ¡[POKEMON] creó un sustituto!', alreadyStarted: '  ¡[POKEMON] ya tiene un sustituto!', end: '  ¡El sustituto de [POKEMON] se debilitó!', activate: '  ¡El sustituto recibió el daño en lugar de [POKEMON]!' },
    stealthrock: { start: '  ¡[TEAM] está rodeado de piedras puntiagudas!', end: '  ¡Han desaparecido las piedras puntiagudas que rodeaban a [TEAM]!', damage: '  ¡Unas piedras puntiagudas dañaron a [POKEMON]!' },
    spikes: { start: '  ¡[TEAM] está rodeado de púas!', end: '  ¡Han desaparecido las púas que rodeaban a [TEAM]!', damage: '  ¡Las púas dañaron a [POKEMON]!' },
    toxicspikes: { start: '  ¡[TEAM] está rodeado de púas tóxicas!', end: '  ¡Han desaparecido las púas tóxicas que rodeaban a [TEAM]!' },
    reflect: { start: '  ¡Reflejo hace que [TEAM] resista mejor los ataques físicos!', end: '  ¡El Reflejo de [TEAM] se ha disipado!' },
    lightscreen: { start: '  ¡Pantalla de Luz hace que [TEAM] resista mejor los ataques especiales!', end: '  ¡La Pantalla de Luz de [TEAM] se ha disipado!' },
    taunt: { start: '  ¡[POKEMON] se dejó engañar por la Mofa!', end: '  ¡[POKEMON] ya no está bajo los efectos de la Mofa!', cant: '¡[POKEMON] no puede usar [MOVE] por la Mofa!' },
    leechseed: { start: '  ¡[POKEMON] fue infectado!', damage: '  ¡Las drenadoras restan salud a [POKEMON]!' },
    raindance: { weatherName: 'Lluvia', start: '  ¡Ha empezado a llover!', end: '  Ha dejado de llover.', upkeep: '  (Sigue lloviendo.)' },
    sunnyday: { weatherName: 'Sol', start: '  ¡El sol pega con fuerza!', end: '  El sol vuelve a brillar como siempre.', upkeep: '  (Hace mucho sol.)' },
    sandstorm: { weatherName: 'Tormenta de arena', start: '  ¡Se ha desatado una tormenta de arena!', end: '  La tormenta de arena amainó.', upkeep: '  (La tormenta de arena arrecia.)', damage: '  ¡La tormenta de arena zarandea a [POKEMON]!' },
    hail: { weatherName: 'Granizo', start: '  ¡Ha empezado a granizar!', end: '  Ha dejado de granizar.', upkeep: '  (Sigue granizando.)', damage: '  ¡El granizo golpea a [POKEMON]!' },
    electricterrain: { start: '  ¡Se ha formado un campo de corriente eléctrica en el terreno de combate!', end: '  El campo de corriente eléctrica ha desaparecido.' },
    grassyterrain: { start: '  ¡El terreno de combate se ha cubierto de hierba!', end: '  La hierba ha desaparecido.' },
    psychicterrain: { start: '  ¡El terreno de combate se ha vuelto muy extraño!', end: '  Ha desaparecido la extraña sensación del terreno de combate.' },
    mistyterrain: { start: '  ¡La niebla ha envuelto el terreno de combate!', end: '  La niebla ha desaparecido.' },
    heal: { fail: '  ¡Los PS de [POKEMON] están al máximo!' },
  };

  var original = null;   // copia de lo que se pisa, para volver al inglés
  var actual = 'en';

  function aplicar(idioma) {
    idioma = idioma === 'es' ? 'es' : 'en';
    if (idioma === actual || !window.BattleText) return;
    if (!original) {
      original = {};
      Object.keys(ES).forEach(function (sec) {
        original[sec] = {};
        Object.keys(ES[sec]).forEach(function (k) { original[sec][k] = (BattleText[sec] || {})[k]; });
      });
    }
    var tabla = idioma === 'es' ? ES : original;
    Object.keys(tabla).forEach(function (sec) {
      if (!BattleText[sec]) BattleText[sec] = {};
      Object.keys(tabla[sec]).forEach(function (k) {
        if (tabla[sec][k] === undefined) delete BattleText[sec][k];
        else BattleText[sec][k] = tabla[sec][k];
      });
    });
    actual = idioma;
  }

  // Retoques de gramática que las plantillas solas no pueden hacer: mayúscula
  // tras «¡», «de el» → «del», «a el» → «al».
  if (window.BattleTextParser && BattleTextParser.prototype.fixLowercase) {
    var fix = BattleTextParser.prototype.fixLowercase;
    BattleTextParser.prototype.fixLowercase = function (input) {
      var s = fix.call(this, input);
      if (actual !== 'es' || !s) return s;
      return s
        .replace(/(^|\n)((?: {2}|\(|\[)*)(¡|¿)?(el|la|los|tus|tu) /g, function (m, a, b, c, d) {
          return a + b + (c || '') + d.charAt(0).toUpperCase() + d.slice(1) + ' ';
        })
        .replace(/ de el /g, ' del ')
        .replace(/ a el /g, ' al ');
    };
  }

  window.VisorIdioma = { aplicar: aplicar, get actual() { return actual; } };
})();
