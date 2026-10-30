import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
for(const name of ['api','model','pilot','fallback','uid-only','netlify']) {
  const result=spawnSync(process.execPath,[fileURLToPath(new URL('../tests/'+name+'.test.mjs',import.meta.url))],{stdio:'inherit'});
  if(result.status!==0)process.exit(result.status||1);
}
