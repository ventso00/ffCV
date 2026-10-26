// Optional isolated browser worker. NOT shipped inside the Cloudflare Worker.
// npm install playwright; install a supported browser separately.
// Configure selectors only after inspecting an authorized Shop2Game flow.
// This module is a test harness, not a validated production connector.
import {chromium} from 'playwright';
export async function inspectPublicNickname(uid, config){
 if(!/^[0-9]{5,15}$/.test(uid))throw new Error('INVALID_UID');
 const u=new URL(config.url);
 if(u.protocol!=='https:'||!['shop2game.com','www.shop2game.com'].includes(u.hostname))throw new Error('HOST_NOT_ALLOWED');
 if(!config.uidSelector||!config.nicknameSelector)throw new Error('SELECTORS_NOT_CONFIGURED');
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();page.setDefaultTimeout(8000);
  let blocked=false;page.on('response',r=>{if([403,429].includes(r.status()))blocked=true});
  const response=await page.goto(u.href,{waitUntil:'domcontentloaded',timeout:15000});
  if(!response?.ok()||blocked)throw new Error('SOURCE_BLOCKED_OR_UNAVAILABLE');
  const challenge=page.locator('iframe[src*="captcha"], iframe[src*="challenge"], [id*="captcha"]');
  if(await challenge.count())throw new Error('HUMAN_REVIEW_REQUIRED');
  await page.locator(config.uidSelector).fill(uid);
  // Explicit verification button only. Never a purchase, checkout or payment selector.
  if(config.verifySelector)await page.locator(config.verifySelector).click();
  if(blocked||await challenge.count())throw new Error('HUMAN_REVIEW_REQUIRED');
  const nickname=(await page.locator(config.nicknameSelector).innerText()).trim();
  if(blocked||!nickname||nickname.length>100)throw new Error('UNVALIDATED_RESPONSE');
  return {uid,nickname,source:'Shop2Game public UI',fetchedAt:new Date().toISOString(),stats:null};
 }finally{await browser.close()}
}
