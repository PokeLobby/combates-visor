# combates-visor

Visor de combate de **PokeLobby**: el motor de combate del cliente de **Pokémon Showdown**
(animaciones, sprites, registro de texto) en una página estática que la web de PokeLobby
mete en un `<iframe>`. El visor **solo pinta**: recibe por `postMessage` las líneas del
protocolo de Showdown y las anima. No se conecta a nada, no tiene login y no manda órdenes:
la conexión con la arena, los botones, el teclado y el reloj son de la web.

Licencia **AGPLv3** (ver [LICENSE](LICENSE) y [AVISOS.md](AVISOS.md)). Basado en
[smogon/pokemon-showdown-client](https://github.com/smogon/pokemon-showdown-client).

```
Arena ──WebSocket {t:"lineas"}──▶ Web PokeLobby ──postMessage {t:"lineas"}──▶ iframe combates-visor
Arena ◀─WebSocket {t:"orden"}─── Web PokeLobby ◀─postMessage {t:"estado"}─── iframe combates-visor
```

## Contenido

| Ruta | Qué es |
|---|---|
| `index.html` | La página que se embebe. Carga el motor y el puente. |
| `visor.js` | Puente `postMessage` ↔ motor (`Battle` de Showdown). |
| `visor-pre.js` | Fija la ruta de los efectos `fx/` antes de cargar las animaciones. |
| `visor-config.js` | Orígenes permitidos y modo de sprites. |
| `visor.css` | Piel y maquetación (flujo normal, escala en móvil). |
| `ps/` | Ficheros del cliente oficial, ya compilados (generados con `tools/build.mjs`). |
| `ps/VERSION.json` | Commits del cliente y del servidor, fecha y huellas sha256 de lo generado. |
| `tools/build.mjs`, `tools/fuentes.json` | Build reproducible de `ps/` (qué ficheros y de qué commit). |
| `render.yaml` | Sitio estático gratis en Render con `frame-ancestors`. |

## Protocolo `postMessage`

Todos los mensajes son objetos con un campo `t`. El visor solo acepta mensajes de
`window.parent` cuyo origen esté en `VISOR.padres` (`visor-config.js`), y solo responde a ese origen.

### Web → visor

| `t` | Campos | Qué hace |
|---|---|---|
| `iniciar` | `lado` (`p1`\|`p2`; por defecto `p1`), `registro` (bool: enseña el registro de texto), `oscuro` (bool), `velocidad` (`normal`\|`rapida`\|`instantanea`) | Crea un combate vacío. Mandarlo al entrar en un combate y al reconectar. |
| `lineas` | `lineas` (string[]) | **En directo**: añade líneas del protocolo de Showdown (las de `{t:"lineas"}` de la arena, tal cual) a la cola y las anima en orden. Si no se ha mandado `iniciar`, lo hace con las últimas opciones. |
| `repeticion` | `lineas` (string[]) | Combate entero: lo reinicia y empieza a reproducirlo. |
| `control` | `accion` (`pausa`\|`seguir`\|`turno`), `n` (int, con `turno`) | Pausa, sigue o salta al turno `n` (repeticiones). |
| `velocidad` | `v` (`normal`\|`rapida`\|`instantanea`) | Cambia la velocidad de las animaciones. |
| `sonido` | `activo` (bool) | Sonido del motor (por defecto silenciado). |

### Visor → web

| `t` | Campos | Cuándo |
|---|---|---|
| `listo` | `cargaMs` (int), `recursos` (`cdn`\|`local`) | Motor cargado. Se manda a todos los orígenes de `VISOR.padres` (solo lo recibe el que coincide). Esperar a este mensaje antes de mandar nada. |
| `estado` | `estado` (`playing`\|`paused`\|`turn`\|`ended`\|`callback`\|`error`…), `turno` (int), `alDia` (bool), `fin` (bool) | Cambios del motor. `alDia = true` cuando ha terminado de animar todo lo recibido: **la web debería activar los botones de acción cuando llega `alDia`**, no al recibir la `peticion` (llega antes de que acabe la animación). |
| `alto` | `px` (int) | Altura del contenido, para ajustar el `height` del iframe. |

### Ejemplo en la web

```html
<iframe id="visor" src="https://<combates-visor>.onrender.com/"
  sandbox="allow-scripts allow-same-origin allow-popups"
  style="border:0;width:644px;max-width:100%"></iframe>
```
```js
const VISOR = 'https://<combates-visor>.onrender.com';
const ifr = document.getElementById('visor');
addEventListener('message', (ev) => {
  if (ev.origin !== VISOR) return;
  if (ev.data.t === 'listo') ifr.contentWindow.postMessage({ t: 'iniciar', lado: 'p1', registro: true }, VISOR);
  if (ev.data.t === 'alto') ifr.style.height = ev.data.px + 4 + 'px';
});
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.t === 'lineas') ifr.contentWindow.postMessage({ t: 'lineas', lineas: m.lineas }, VISOR);
};
```

Reconexión: volver a mandar `iniciar` y después todas las líneas que tenga la web (o pedirlas
a la arena con `desde = 0`). Espectadores: el mismo visor con las líneas de la perspectiva
`spectator` y el `lado` que se quiera seguir.

## Sprites: `cdn` o `local`

- **`cdn`** (por defecto): sprites, fondos, entrenadores e iconos se cargan de
  `play.pokemonshowdown.com`, igual que las repeticiones embebidas de Showdown. No hay que alojar nada.
- **`local`**: se cargan de `ps/sprites/` de este sitio. Hay que llenar esa carpeta con la misma
  estructura que `https://play.pokemonshowdown.com/sprites/` y con lo que usen las generaciones de
  las salas (por ejemplo `gen3/`, `gen3-back/`, `gen5/`, `gen5-back/`, `ani/`, `ani-back/`,
  `gen6bgs/`, `trainers/`, `misc/`, `pokemonicons-sheet.png`, `pokemonicons-pokeball-sheet.png`,
  `ani/substitute.gif`, `ani-back/substitute.gif`).
- Se elige en `visor-config.js` (`VISOR.recursos`) o con `?recursos=cdn|local` en la URL del iframe.
- Los efectos de las animaciones (`ps/fx/`) se sirven siempre desde este sitio.

## Seguridad: `frame-ancestors`

`render.yaml` pone `Content-Security-Policy: frame-ancestors …` con los dominios de la web, así
solo PokeLobby puede embeber el visor. **Esa lista y `VISOR.padres` en `visor-config.js` deben
coincidir.** El visor no guarda nada sensible: no recibe el pase de combate ni el JWT ni las
peticiones de la arena.

## Actualizar el motor (`ps/`)

```bash
git clone https://github.com/smogon/pokemon-showdown-client cliente
git -C cliente checkout <commit>          # el de tools/fuentes.json, o uno nuevo
node tools/build.mjs --cliente ./cliente  # --forzar si el commit no coincide con fuentes.json
```

El script baja los datos ya generados de `play.pokemonshowdown.com/data/` y
`server/chat-formatter.ts` del commit fijado del servidor, ejecuta `node build` en el clon,
copia a `ps/` solo los ficheros de `tools/fuentes.json` (el fallo del paso de noticias por
falta de `php` es normal), junta las animaciones en `ps/data/graphics.js`, quita de `fx/` lo
que no es de combate y escribe `ps/VERSION.json`. Después:

1. Actualizar el commit en `tools/fuentes.json` y en `AVISOS.md`.
2. Cambiar el `?v=` de las URLs de `index.html` (caché inmutable de `ps/`).
3. Probar una repetición de gen 3 y una de gen 7 con mega.

No se incluye `teambuilder-tables.js` (15,7 MB): solo afina las fichas emergentes por generación.

## Probar en local

Cualquier servidor estático vale (`npx serve .`). Para probarlo embebido desde otro origen,
con una arena de prueba y una web de juguete, ver la carpeta `visor-prueba` del análisis
(`PokeLobbyDocs/Analisis-showdown-visor.md`).

## Despliegue

Render → New → Blueprint con este repo (o Static Site con *Publish directory* `.` y sin build).
Antes de que lo use nadie de fuera, **el repo tiene que ser público** (AGPLv3 §13: el enlace
«Código fuente» del pie debe llevar a un código accesible).
