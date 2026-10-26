// Editorial rules, not official Garena ranks or a competitive skill score.
export function analyzeProfile(p) {
  const present = x => x !== null && x !== undefined && x !== '';
  const keys = ['nickname','editUid','editRegion','level','rankPoints','csPoints','likes','guild','role','availability','languages','characterName'];
  const completed = keys.filter(k => present(p[k]) && p[k] !== 'À préciser').length;
  const level = typeof p.level === 'number' && Number.isFinite(p.level) && p.level >= 1 ? p.level : null;
  const style = level === null ? {name:'À personnaliser',theme:'solar',headline:['YOUR','STORY.']} : level < 30 ? {name:'Premiers pas',theme:'ice',headline:['NEW','WAVE.']} : level < 60 ? {name:'Parcours confirmé',theme:'solar',headline:['NEXT','LEVEL.']} : {name:'Long parcours',theme:'neon',headline:['PLAYER','LEGACY.']};
  const observations = [level === null ? 'Le niveau manque : la direction artistique reste libre.' : `Niveau ${level} : direction « ${style.name} ». Le niveau mesure la progression du compte, pas à lui seul le talent.`, present(p.rankPoints) ? `${p.rankPoints} points BR disponibles. La saison et le serveur sont nécessaires pour une comparaison fiable.` : 'Points BR absents : aucun classement compétitif déduit.', present(p.csPoints) ? `${p.csPoints} points CS disponibles, séparés des points BR.` : 'Points CS absents : aucun résultat Clash Squad déduit.'];
  const next = [];
  if (!present(p.characterName)) next.push('Personnage indisponible : attendre une source de rendu liée au compte.');
  if (!present(p.availability)) next.push('Disponibilités non fournies par la source.');
  if (!present(p.role) || p.role === 'À préciser') next.push('Rôle non déterminé : aucune spécialité attribuée automatiquement.');
  next.push('Les performances détaillées nécessitent une source de statistiques de matchs validée.');
  return {completed,total:keys.length,percent:Math.round(100*completed/keys.length),style,observations,next};
}

export function normalize(raw,uid,region){
 const b=raw.basicInfo;
 if(!b||String(b.accountId)!==uid||typeof b.nickname!=='string'||!b.nickname.trim())throw new Error('SCHEMA_CHANGED');
 const n=v=>typeof v==='number'&&Number.isFinite(v)&&v>=0?v:null;
 const t=v=>typeof v==='string'&&v.trim()?v.trim().slice(0,160):null;
 const id=v=>(typeof v==='string'||Number.isSafeInteger(v))&&/^[0-9]{1,20}$/.test(String(v))?String(v):null;
 const ids=v=>Array.isArray(v)?v.map(id).filter(Boolean).slice(0,60):[];
 const g=raw.clanBasicInfo||{},c=raw.profileInfo||{},pet=raw.petInfo||{};
 const dossier={experience:n(b.exp),season:n(b.seasonId),rankCode:n(b.rank),csRankCode:n(b.csRank),badges:n(b.badgeCnt),createdAt:id(b.createAt),lastLoginAt:id(b.lastLoginAt),bannerId:id(b.bannerId),portraitId:id(b.headPic),signature:t(raw.socialInfo?.signature),guildId:id(g.clanId),guildLevel:n(g.clanLevel),guildMembers:n(g.memberNum),guildCapacity:n(g.capacity),characterId:id(c.avatarId),outfitIds:ids(c.clothes),petId:id(pet.id),petLevel:n(pet.level),petExperience:n(pet.exp),creditScore:n(raw.creditScoreInfo?.creditScore)};
 return {uid,nickname:b.nickname.slice(0,100),region:t(b.region)?.toUpperCase()||region.toUpperCase(),level:n(b.level),rankPoints:n(b.rankingPoints),csPoints:n(b.csRankingPoints),likes:n(b.liked),guild:t(g.clanName),characterId:dossier.characterId,dossier,source:'Free Fire Community API',fetchedAt:new Date().toISOString(),demo:false,ownership:'unverified',characterImage:null};
}
