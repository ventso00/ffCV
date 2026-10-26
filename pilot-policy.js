// Admission is an administrative decision, never inferred from an UID prefix.
export function pilotAdmission(env, uid, requestedRegion) {
  let roster;
  try { roster = JSON.parse(env.MG_PILOT_ROSTER || '{}'); } catch { return {status:503,code:'PILOT_CONFIG_INVALID',message:'La configuration du pilote doit être corrigée.'}; }
  if(!roster||typeof roster!=='object'||Array.isArray(roster))return {status:503,code:'PILOT_CONFIG_INVALID',message:'Configuration du pilote invalide.'};
  const entry = Object.hasOwn(roster,uid) ? roster[uid] : null;
  if (!entry || entry.country !== 'MG' || entry.status !== 'approved' || !/^[a-z]{2,3}$/.test(entry.region || '')) return {status:403,code:'MADAGASCAR_APPROVAL_REQUIRED',message:'Cet UID n’est pas encore admis au pilote Madagascar. Une vérification locale est nécessaire avant la création du CV.'};
  if (requestedRegion && requestedRegion !== entry.region) return {status:400,code:'REGION_MISMATCH',message:'Le serveur ne correspond pas à celui validé pour cet UID.'};
  return {region:entry.region};
}
export async function validateMooGold(uid, env, fetcher=fetch) {
  if(!env.MOOGOLD_PARTNER_ID || !env.MOOGOLD_SECRET || !env.MOOGOLD_FF_PRODUCT_ID) throw new Error('PARTNER_NOT_CONFIGURED');
  const path='product/validate', timestamp=String(Math.floor(Date.now()/1000));
  const data={'product-id':env.MOOGOLD_FF_PRODUCT_ID,'User ID':uid};
  if(env.MOOGOLD_FF_SERVER) data.Server=env.MOOGOLD_FF_SERVER;
  const body=JSON.stringify({path,data});
  const enc=new TextEncoder();
  const key=await crypto.subtle.importKey('raw',enc.encode(env.MOOGOLD_SECRET),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const auth=Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',key,enc.encode(body+timestamp+path))),b=>b.toString(16).padStart(2,'0')).join('');
  const response=await fetcher('https://moogold.com/wp-json/v1/api/'+path,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Basic '+btoa(env.MOOGOLD_PARTNER_ID+':'+env.MOOGOLD_SECRET),auth,timestamp},body,signal:AbortSignal.timeout(9000),redirect:'error'});
  if(!response.ok) throw new Error('PARTNER_UNAVAILABLE');
  const raw=await response.text(); if(raw.length>200000) throw new Error('PARTNER_SCHEMA');
  const p=JSON.parse(raw);
  if((p.status!==true&&p.status!=='true')||typeof p.username!=='string'||!p.username.trim())throw new Error('PARTNER_NOT_VALIDATED');
  return {nickname:p.username.slice(0,100),source:'MooGold · validation du compte'};
}
