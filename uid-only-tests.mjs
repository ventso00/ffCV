import assert from 'node:assert/strict';
import worker from './worker/index.js';
import {readFileSync} from 'node:fs';
const request=uid=>new Request('https://example.com/api/v1/player/'+uid);
for(const uid of ['8678687120','23146856']) {
  const p=await (await worker.fetch(request(uid),{PROFILE_TEST_FALLBACK:'false'})).json();
  assert.equal(p.code,'SOURCE_NOT_CONFIGURED');
}
const saved=globalThis.fetch;
try {
  const regions=[];
  globalThis.fetch=async url=>{
    const u=new URL(url); regions.push(u.searchParams.get('region'));
    if(regions.length===1)return new Response('',{status:404});
    return Response.json({basicInfo:{accountId:'8678687120',nickname:'Fixture uniquement',region:'IND',level:42}});
  };
  const p=await(await worker.fetch(request('8678687120'),{FF_COMMUNITY_API_KEY:'fixture'})).json();
  assert.deepEqual(regions,['sg','ind']);assert.equal(p.region,'IND');assert.equal(p.characterImage,null);
  let calls=0;globalThis.fetch=async()=>{calls++;return new Response('',{status:401})};
  assert.equal((await worker.fetch(request('23146856'),{FF_COMMUNITY_API_KEY:'fixture',PROFILE_TEST_FALLBACK:'false'})).status,503);
  assert.equal(calls,1);
}finally{globalThis.fetch=saved}
const html=readFileSync(new URL('./page.html',import.meta.url),'utf8');
assert.ok(!html.includes('id="region"'));
assert.ok(html.includes('Profil en lecture seule. Pseudo, niveau et statistiques proviennent de la source ; tu ne peux pas les modifier ici.'));
console.log('UID-only: both pilot IDs, backend region fallback, stop on auth error, no invented skin, no server selector, mandatory notice.');
