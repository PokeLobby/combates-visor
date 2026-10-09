# Avisos de licencia y atribución

**combates-visor** es el visor de combate de PokeLobby. Se distribuye bajo la
**GNU Affero General Public License v3** (texto completo en [LICENSE](LICENSE)).

Está hecho a partir del **cliente de Pokémon Showdown**, de **Guangcong Luo (Zarel) y los
colaboradores de Smogon / Pokémon Showdown** (<https://github.com/smogon/pokemon-showdown-client>,
commit `218cc779512d67961e8aea0ae666d319e8ccf398`), cuyo repositorio se distribuye en conjunto
bajo AGPLv3. Gracias a Smogon por el motor de combate, las animaciones y los sprites.

Pokémon Showdown no respalda ni patrocina este proyecto. «Pokémon Showdown» es de sus autores.

## Licencia de cada parte

| Parte | Origen | Licencia |
|---|---|---|
| `index.html`, `visor.js`, `visor-pre.js`, `visor-config.js`, `visor.css`, `visor-es.js`, `tools/` | PokeLobby | AGPLv3 |
| `fuentes/manrope-latin-wght-normal.woff2` | Manrope (The Manrope Project Authors), vía Fontsource | **OFL-1.1** (`fuentes/OFL-Manrope.txt`) |
| `fuentes/space-grotesk-latin-wght-normal.woff2` | Space Grotesk (The Space Grotesk Project Authors), vía Fontsource | **OFL-1.1** (`fuentes/OFL-SpaceGrotesk.txt`) |
| `ps/js/battle.js`, `ps/js/battle-tooltips.js` | `battle.ts`, `battle-tooltips.ts` (Guangcong Luo) | MIT (cabecera `@license MIT`) |
| `ps/js/battledata.js` | `battle-dex.ts`, `battle-dex-data.ts`, `battle-log.ts`, `battle-log-misc.js`, `battle-text-parser.ts` (MIT); `battle-teams.ts` (sin cabecera: AGPLv3); `server/chat-formatter.ts` del servidor de Pokémon Showdown (MIT, commit `ca3cba8f4fa0db8f441d798c670ca04b7170344f`); textos `data/text.js` (generado de los datos del servidor, MIT) y `data/text-afd.js` (sin cabecera: AGPLv3) | MIT + AGPLv3 |
| `ps/data/graphics.js` | `battle-animations.ts` (MIT) + `battle-animations-moves.ts` (CC0) | MIT + CC0 |
| `ps/js/battle-sound.js` | `battle-sound.ts` (sin cabecera) | AGPLv3 |
| `ps/js/lib/ps-polyfill.js` | cliente de Pokémon Showdown (sin cabecera) | AGPLv3 |
| `ps/data/*.js` (pokedex, moves, items, abilities, pokedex-mini*) | generados por Pokémon Showdown a partir de los datos del servidor | MIT |
| `ps/style/battle.css` | cliente de Pokémon Showdown | **GPLv2** (indicado en el propio fichero) |
| `ps/style/battle-log.css`, `ps/style/utilichart.css` | cliente de Pokémon Showdown (sin cabecera) | AGPLv3 |
| `ps/fx/*` | cliente de Pokémon Showdown | **CC0**, salvo: `icicle.png` y `lightning.png` de Clint Bellanger (GPLv2/GPLv3/CC-BY-SA-3.0, <http://opengameart.org/content/icicle-spell>, <http://opengameart.org/content/lightning-shock-spell>) y `rocks.png`, `rock1.png`, `rock2.png` del usuario de PO «Gilad» (GPLv3) |
| `ps/js/lib/jquery-1.11.0.min.js` | jQuery Foundation | MIT |
| `ps/js/lib/html-sanitizer-minified.js` | Google Caja | Apache-2.0 |

Los avisos de copyright originales se conservan dentro de cada fichero. Los textos de las
licencias MIT, CC0, GPLv2, GPLv3 y Apache-2.0 están en <https://spdx.org/licenses/>.

## Sprites y nombres

Los sprites, fondos, entrenadores e iconos (carpeta `sprites/` de Showdown, que por defecto
se cargan de `play.pokemonshowdown.com`) **no** tienen licencia libre: Pokémon y sus nombres
son © Nintendo, Creatures Inc., GAME FREAK inc. y The Pokémon Company, y parte de los sprites
son obra de artistas de la comunidad de Smogon. Este proyecto es de fans y sin ánimo de lucro.

## Código fuente

La versión que se sirve en el iframe enlaza a este repositorio desde su pie («Código fuente»),
como pide la sección 13 de la AGPLv3. `ps/VERSION.json` indica de qué commits y datos se ha
generado `ps/`, y `tools/build.mjs` lo regenera.
