#!/usr/bin/env node
// Regenera ps/ (el motor del visor) a partir de un clon del cliente oficial de
// Pokémon Showdown en el commit fijado en tools/fuentes.json.
//
// Uso:
//   git clone https://github.com/smogon/pokemon-showdown-client cliente
//   git -C cliente checkout <commit de tools/fuentes.json>
//   node tools/build.mjs --cliente ./cliente [--forzar]
//
// Qué hace:
//   1. Comprueba que el clon está en el commit fijado (--forzar para saltárselo).
//   2. Baja al clon lo que su `node build` normal no trae: los datos ya generados
//      (data/*.js) y server/chat-formatter.ts del commit fijado del servidor.
//   3. Ejecuta `npm install` (si hace falta) y `node build` en el clon.
//   4. Copia a ps/ solo los ficheros del visor (lista en tools/fuentes.json),
//      junta las animaciones en ps/data/graphics.js y copia fx/.
//   5. Escribe ps/VERSION.json con commits, fecha y huellas sha256.
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fuentes = JSON.parse(readFileSync(join(raiz, 'tools/fuentes.json'), 'utf8'));
const args = process.argv.slice(2);
const idx = args.indexOf('--cliente');
if (idx < 0 || !args[idx + 1]) {
  console.error('Uso: node tools/build.mjs --cliente <ruta al clon de pokemon-showdown-client> [--forzar]');
  process.exit(1);
}
const clon = resolve(args[idx + 1]);
const forzar = args.includes('--forzar');
const play = join(clon, 'play.pokemonshowdown.com');

function commitDe(repo) {
  const git = join(repo, '.git');
  let head = readFileSync(join(git, 'HEAD'), 'utf8').trim();
  if (!head.startsWith('ref: ')) return head;
  const ref = head.slice(5);
  if (existsSync(join(git, ref))) return readFileSync(join(git, ref), 'utf8').trim();
  const packed = readFileSync(join(git, 'packed-refs'), 'utf8').split('\n').find(l => l.endsWith(' ' + ref));
  return packed ? packed.split(' ')[0] : '?';
}
const sha = (buf) => createHash('sha256').update(buf).digest('hex');
async function bajar(url, destino) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} al bajar ${url}`);
  const buf = Buffer.from(await r.arrayBuffer());
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, buf);
  return buf;
}

// 1. Commit
const commit = commitDe(clon);
if (commit !== fuentes.cliente.commit) {
  const msg = `El clon está en ${commit} y tools/fuentes.json fija ${fuentes.cliente.commit}.`;
  if (!forzar) { console.error(msg + ' Haz checkout de ese commit o usa --forzar (y actualiza fuentes.json).'); process.exit(1); }
  console.warn('AVISO: ' + msg);
}

// 2. Lo que falta en el clon
console.log('Bajando datos generados y chat-formatter.ts…');
const huellasDatos = {};
for (const f of fuentes.datos.ficheros) {
  huellasDatos[f] = sha(await bajar(fuentes.datos.url + f, join(play, 'data', f)));
}
for (const f of fuentes.servidor.ficheros) {
  const url = `https://raw.githubusercontent.com/smogon/pokemon-showdown/${fuentes.servidor.commit}/${f}`;
  await bajar(url, join(clon, 'caches/pokemon-showdown', f));
}

// 3. Compilar el cliente
if (!existsSync(join(clon, 'node_modules/@babel/core'))) {
  console.log('npm install en el clon…');
  execSync('npm install --no-audit --no-fund', { cwd: clon, stdio: 'inherit' });
}
console.log('node build en el clon…');
try {
  execSync('node build', { cwd: clon, stdio: 'inherit' });
} catch (e) {
  // El paso de noticias del build llama a php; si no hay php falla sin afectar a lo que copiamos.
  console.warn('node build terminó con error (normal si no hay php); se comprueba lo compilado.');
}

// 4. Copiar a ps/
const ps = join(raiz, 'ps');
rmSync(ps, { recursive: true, force: true });
const huellas = {};
for (const f of Object.keys(fuentes.copiar)) {
  if (f.endsWith('/')) continue;
  const src = join(play, f);
  if (!existsSync(src)) throw new Error('Falta en el clon: ' + f);
  mkdirSync(dirname(join(ps, f)), { recursive: true });
  cpSync(src, join(ps, f));
  huellas[f] = sha(readFileSync(src));
}
const graficos = Buffer.from(
  fuentes.generar['data/graphics.js'].map(d => readFileSync(join(play, d.split(' ')[0]), 'utf8')).join('\n'));
mkdirSync(join(ps, 'data'), { recursive: true });
writeFileSync(join(ps, 'data/graphics.js'), graficos);
huellas['data/graphics.js'] = sha(graficos);
// Solo los efectos del combate: fuera fondos del cliente, mafia, ahorcado, etc.
const noCombate = /^(client-|mafia-|hangman|groupchat|mail|closebuttonsheet|mute|sound)/;
cpSync(join(play, 'fx'), join(ps, 'fx'), { recursive: true, filter: (src) => !noCombate.test(basename(src)) });
const nFx = readdirSync(join(ps, 'fx')).length;

// 5. Versión
const version = {
  generado: new Date().toISOString(),
  cliente: { repo: fuentes.cliente.repo, commit },
  servidor: { repo: fuentes.servidor.repo, commit: fuentes.servidor.commit, ficheros: fuentes.servidor.ficheros },
  datos: { url: fuentes.datos.url, sha256: huellasDatos },
  ficheros: huellas,
  fx: nFx,
};
writeFileSync(join(ps, 'VERSION.json'), JSON.stringify(version, null, 2) + '\n');
let total = 0;
const sumar = (d) => readdirSync(d).forEach(n => { const p = join(d, n); const s = statSync(p); s.isDirectory() ? sumar(p) : (total += s.size); });
sumar(ps);
console.log(`ps/ regenerado desde ${commit.slice(0, 8)}: ${Object.keys(huellas).length} ficheros + ${nFx} efectos, ${(total / 1048576).toFixed(1)} MB.`);
console.log('Sube el número de versión de las URLs (?v=) en index.html si cambian los ficheros.');
