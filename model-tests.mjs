import assert from 'node:assert/strict';
import {analyzeProfile,normalize} from './profile-model.js';
for(const [level,theme]of [[null,'solar'],[29,'ice'],[30,'solar'],[59,'solar'],[60,'neon']])assert.equal(analyzeProfile({level}).style.theme,theme);
assert.equal(analyzeProfile({}).completed,0);
const p=normalize({basicInfo:{accountId:'12345678',nickname:'Fixture',level:30},profileInfo:{clothes:[123,'456',{},'bad']},petInfo:{level:-1},email:'private'},'12345678','sg');
assert.equal(p.source,'Free Fire Community API');assert.deepEqual(p.dossier.outfitIds,['123','456']);assert.equal(p.dossier.petLevel,null);assert.equal(p.email,undefined);assert.equal(p.level,30);
assert.throws(()=>normalize({basicInfo:{accountId:'87654321',nickname:'Wrong'}},'12345678','sg'));
assert.throws(()=>normalize(null,'12345678','sg'));
console.log('9 checks passed: level boundaries, missing fields, standalone import, allowlist, UID validation.');
