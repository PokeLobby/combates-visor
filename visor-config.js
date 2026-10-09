// Configuración del visor (se cambia sin tocar el motor).
window.VISOR = {
  // Orígenes que pueden mandar mensajes al visor (la web de PokeLobby).
  // Deben coincidir con la cabecera frame-ancestors de render.yaml.
  padres: [
    'https://pokelocke.com',
    'https://www.pokelocke.com',
    'https://ui-web-7hxo.onrender.com',
    'http://localhost:3000',
  ],
  // De dónde salen sprites, fondos de combate, entrenadores e iconos:
  //   'cdn'   = play.pokemonshowdown.com (por defecto, no hay que alojar nada)
  //   'local' = la carpeta ps/sprites/ de este mismo sitio (hay que llenarla, ver README)
  // Se puede forzar con ?recursos=cdn|local en la URL del iframe.
  recursos: 'cdn',
};
// Config mínima que espera el motor de Showdown (sin servidor, sin login).
window.Config = {
  version: 'pokelobby-visor',
  routes: { client: 'play.pokemonshowdown.com', root: 'pokemonshowdown.com', replays: 'replay.pokemonshowdown.com' },
  server: { id: 'pokelobby', registered: false },
  customcolors: {}, whitelist: [],
};
(function () {
  var q = new URLSearchParams(location.search);
  var r = q.get('recursos');
  if (r === 'cdn' || r === 'local') VISOR.recursos = r;
  if (VISOR.recursos === 'local') {
    Config.routes.client = location.host + location.pathname.replace(/[^/]*$/, '') + 'ps';
  }
})();
