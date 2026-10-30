import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const read=p=>readFile(new URL(p,root),'utf8');
const assets={};
for(const [name,type] of [['space-grotesk.ttf','font/ttf'],['manrope.ttf','font/ttf'],['card-background.webp','image/webp'],['concept-cutout.webp','image/webp'],['icon-192.png','image/png'],['icon-512.png','image/png']]) assets['/'+name]={base64:(await readFile(new URL('frontend/assets/'+name,root))).toString('base64'),type};
const source='const fallbackProfile='+JSON.stringify(JSON.parse(await read('backend/fixtures/josiabira.json')))+';\n'+'const page='+JSON.stringify(await read('frontend/index.html'))+';\nconst app='+JSON.stringify(await read('frontend/app.js'))+';\nconst css='+JSON.stringify(await read('frontend/style.css'))+';\nconst model='+JSON.stringify(await read('shared/profile-model.js'))+';\nconst assets='+JSON.stringify(assets)+';\n'+(await read('shared/profile-model.js')).replaceAll('export ','')+'\n'+(await read('backend/services/pilot-policy.js')).replaceAll('export ','')+'\n'+(await read('backend/services/protobuf-gateway.js')).replaceAll('export ','')+'\n'+await read('backend/server.js');

await mkdir(new URL('dist/server/',root),{recursive:true});
await mkdir(new URL('dist/.openai/',root),{recursive:true});

await writeFile(new URL('dist/server/index.js',root),source);
await copyFile(new URL('.openai/hosting.json',root),new URL('dist/.openai/hosting.json',root));
console.log('Worker assembled and artifact built.');
