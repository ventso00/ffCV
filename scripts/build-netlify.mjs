import './build.mjs';
import {mkdir, writeFile} from 'node:fs/promises';
// All routes are served by the server function, including CSP and API responses.
// Never publish dist/server: it contains backend code and the server-only snapshot.
await mkdir(new URL('../netlify-public/', import.meta.url), {recursive:true});
await writeFile(new URL('../netlify-public/robots.txt', import.meta.url), 'User-agent: *\nAllow: /\n');
console.log('Netlify publish directory ready; backend routes handled by scoutmetrics.');
