(function(){
'use strict';
const E=globalThis.CoreWarEngine,C=globalThis.OgunCompetition;
const FORMATS=['knockout','double','groups','league','swiss','random'];
const DEFAULTS={qualifyCount:8,countdown:3,intermission:2000,autoAdvance:true,liveSpeed:200,stageStyle:'spotlight',stageColor:'#b4f05a',seeding:'shuffle',liveAnnouncements:'duels'};
const clone=x=>JSON.parse(JSON.stringify(x));
const terminal=m=>m&&['complete','bye'].includes(m.status);
function options(raw={},count){const format=raw.format||'knockout';if(!FORMATS.includes(format))throw new Error('Formato de emisión inválido.');const o={...C.options({...raw,format:['double','groups'].includes(format)?'knockout':format},count),...DEFAULTS,...raw,format};
 for(const[k,min,max]of [['qualifyCount',0,64],['countdown',0,10],['intermission',0,15000]])if(!Number.isInteger(o[k])||o[k]<min||o[k]>max)throw new Error('Ajuste inválido: '+k);
 if(![0,2,4,8,16,32,64].includes(o.qualifyCount)||![20,200,2000,10000].includes(o.liveSpeed)||!['off','spotlight','rift'].includes(o.stageStyle)||!['shuffle','ordered'].includes(o.seeding)||!['off','final','duels','games'].includes(o.liveAnnouncements)||!/^#[a-f\d]{6}$/i.test(o.stageColor))throw new Error('Ajustes de presentación o clasificación inválidos.');o.autoAdvance=!!o.autoAdvance;return o;
}
function admission(raw){return{...raw,format:['double','groups'].includes(raw.format)?'knockout':raw.format};}
function shuffled(ids,seed){const a=[...ids],r=E.seededRandom(seed);for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function create(entries,settings,raw={},seed='ogun-live',name='Copa del núcleo'){
 const o=options(raw,entries.length);settings={...E.DEFAULT_SETTINGS,...settings,drawPolicy:o.drawPolicy};E.validateSettings(settings);
 if(new Set(entries.map(w=>w.id)).size!==entries.length)throw new Error('Hay participantes duplicados.');
 const accepted=entries.map(w=>{if(typeof w.id!=='string'||!/^[a-z0-9][a-z0-9_-]{0,149}$/i.test(w.id)||['constructor','prototype'].includes(w.id)||typeof w.name!=='string'||!w.name.trim())throw new Error('Participante inválido.');const v=C.validate(w.code,settings,admission(o));if(!v.ok)throw new Error(w.name+': '+v.errors.join(' '));return{...clone(w),name:w.name.slice(0,80),owner:String(w.owner||'').slice(0,80),length:v.length};});
 for(let i=0;i<accepted.length;i++)for(let j=i+1;j<accepted.length;j++)if(!C.compatible(accepted[i].length,accepted[j].length,settings))throw new Error(`No caben juntos ${accepted[i].name} y ${accepted[j].name}.`);
 if(typeof seed!=='string'||seed.length>150)throw new Error('Semilla inválida.');
 return{type:'ogun-live',schema:1,id:'live-'+Date.now(),name:String(name).slice(0,80),seed,entries:accepted,settings,options:o,results:{},adjustments:{},audit:[{kind:'created',at:new Date().toISOString(),text:'Cuadro preparado.'}],checkpoint:null,revision:0};
}
function seeds(n){let order=[1,2];while(order.length<n){const next=order.length*2+1;order=order.flatMap(s=>[s,next-s]);}return order;}
function entry(id){return{kind:'entry',id:id||null};}function win(id){return{kind:'winner',id};}function lose(id){return{kind:'loser',id};}
function view(s){
 const matches=[],byId=new Map(),used=new Set(),rows=s.entries.map(e=>({id:e.id,name:e.owner||e.name,warrior:e.name,points:0,wins:0,draws:0,losses:0,played:0,matchWins:0,matchDraws:0,matchLosses:0,encounters:0,byes:0,buchholz:0,sonneborn:0,eliminated:false})),prelim=[],groups=[],o=s.options;
 function resolve(ref){if(!ref||ref.kind==='entry')return{ready:true,id:ref?.id||null};const m=byId.get(ref.id);return terminal(m)?{ready:true,id:ref.kind==='winner'?m.winnerId:m.loserId}:{ready:false,id:null};}
 function add(id,phase,round,index,aRef,bRef,mustWin=false,gate=true,label=''){
  const a=resolve(aRef),b=resolve(bRef),m={id,phase,round,index,aRef,bRef,aId:a.id,bId:b.id,mustWin,label,status:'waiting',winnerId:null,loserId:null,result:null};
  if(gate&&a.ready&&b.ready){if(!a.id||!b.id){m.status='bye';m.winnerId=a.id||b.id;}else{m.status='ready';const r=s.results[id];if(r&&r.aId===a.id&&r.bId===b.id){m.status='complete';m.result=r;m.winnerId=r.winnerId;m.loserId=r.winnerId===a.id?b.id:r.winnerId===b.id?a.id:null;used.add(id);}}}
  matches.push(m);byId.set(id,m);return m;
 }
 function knockout(ids,prefix='K',phase='upper'){
  let size=2;while(size<ids.length)size*=2;const slots=seeds(size).map(n=>entry(ids[n-1]));const rounds=[];let prev=slots,r=0;
  while(prev.length>1){r++;const level=[];for(let i=0;i<prev.length;i+=2)level.push(add(`${prefix}-${r}-${i/2}`,phase,r,i/2,prev[i],prev[i+1],true));rounds.push(level);prev=level.map(m=>win(m.id));}return{rounds,final:rounds.at(-1)[0]};
 }
 function addStats(list,preliminary=false){for(const row of rows){row.points=0;row.wins=0;row.draws=0;row.losses=0;row.played=0;row.matchWins=0;row.matchDraws=0;row.matchLosses=0;row.encounters=0;row.byes=0;}
  for(const m of list){if(m.status==='bye'&&m.winnerId){const row=rows.find(r=>r.id===m.winnerId);row.byes++;if(['league','swiss','random'].includes(m.phase))row.points+=o.byePoints;}
   if(m.status!=='complete')continue;const a=rows.find(r=>r.id===m.aId),b=rows.find(r=>r.id===m.bId),r=m.result;a.wins+=r.aWins;a.draws+=r.draws;a.losses+=r.bWins;b.wins+=r.bWins;b.draws+=r.draws;b.losses+=r.aWins;const total=r.aWins+r.bWins+r.draws;a.played+=total;b.played+=total;a.encounters++;b.encounters++;
   if(r.outcome==='Empate'){a.points+=o.drawPoints;b.points+=o.drawPoints;a.matchDraws++;b.matchDraws++;}else{const w=r.outcome==='A'?a:b,l=r.outcome==='A'?b:a;w.points+=o.winPoints;l.points+=o.lossPoints;w.matchWins++;l.matchLosses++;}}
  for(const row of rows)row.points+=(s.adjustments[row.id]||0);
  C.tieScores(rows,list.filter(m=>m.status==='complete').map(m=>({aId:m.aId,bId:m.bId,outcome:m.result.outcome})));
 }
 const initial=o.seeding==='shuffle'?shuffled(s.entries.map(e=>e.id),s.seed+':seeding'):s.entries.map(e=>e.id);let champion=null,leaders=[],phase='upper',finalRef=null;
 if(o.format==='knockout'){const k=knockout(initial);finalRef=k.final;}
 else if(o.format==='double'){
  const up=knockout(initial,'U','upper'),k=up.rounds.length;let lower;
  if(k===1)lower=lose(up.final.id);else{
   let previous=[];for(let i=0;i<up.rounds[0].length;i+=2)previous.push(add(`L-1-${i/2}`,'lower',1,i/2,lose(up.rounds[0][i].id),lose(up.rounds[0][i+1].id),true));
   for(let ur=2;ur<=k;ur++){
    if(ur>2){const reduced=[];for(let i=0;i<previous.length;i+=2)reduced.push(add(`L-${ur*2-3}-${i/2}`,'lower',ur*2-3,i/2,win(previous[i].id),win(previous[i+1].id),true));previous=reduced;}
    const injected=[];for(let i=0;i<previous.length;i++)injected.push(add(`L-${ur*2-2}-${i}`,'lower',ur*2-2,i,win(previous[i].id),lose(up.rounds[ur-1][previous.length-1-i].id),true));previous=injected;
   }lower=win(previous[0].id);
  }
  const grand=add('GF-1','final',1,0,win(up.final.id),lower,true, true,'Gran final');finalRef=grand;
  if(terminal(grand)&&grand.winnerId&&grand.winnerId===grand.bId)finalRef=add('GF-2','final',2,0,entry(grand.aId),entry(grand.bId),true,true,'Final definitiva');
 }else if(o.format==='groups'){
  const qualifiers=[];for(let offset=0;offset<initial.length;offset+=4){const ids=initial.slice(offset,offset+4),g=offset/4+1,ref=i=>entry(ids[i]);
   const a=add(`G${g}-A`,'group-'+g,1,0,ref(0),ref(3),true),b=add(`G${g}-B`,'group-'+g,1,1,ref(1),ref(2),true),w=add(`G${g}-W`,'group-'+g,2,0,win(a.id),win(b.id),true),l=add(`G${g}-L`,'group-'+g,2,1,lose(a.id),lose(b.id),true),d=add(`G${g}-D`,'group-'+g,3,0,lose(w.id),win(l.id),true);
   groups.push({number:g,entries:ids,first:w.id,second:d.id});qualifiers.push(win(w.id),win(d.id));}
  const ready=qualifiers.every(ref=>resolve(ref).ready),ids=qualifiers.map(ref=>resolve(ref).id).filter(Boolean);
  prelim.push(...matches);if(ready){if(ids.length===1)champion=ids[0];else{const k=knockout(ids,'P','playoff');finalRef=k.final;}}phase=ready?'playoff':'groups';
 }else{
  phase=o.format;
  if(o.format==='league'){
   const rotation=[...initial];if(rotation.length%2)rotation.push(null);let gate=true;
   for(let r=1;r<rotation.length;r++){const stage=[];for(let i=0;i<rotation.length/2;i++)stage.push(add(`R-${r}-${i}`,'league',r,i,entry(rotation[i]),entry(rotation.at(-1-i)),false,gate));gate=gate&&stage.every(terminal);rotation.splice(1,0,rotation.pop());}
  }else{
   const seen=new Set();for(let r=1;r<=o.swissRounds;r++){
    addStats(matches);const pair=C.pairsForRound(rows,seen,s.seed,r,o.format),stage=[];for(let i=0;i<pair.pairs.length;i++){const[a,b]=pair.pairs[i];seen.add([a,b].sort().join('|'));stage.push(add(`R-${r}-${i}`,o.format,r,i,entry(a),entry(b),false));}
    if(pair.bye)stage.push(add(`R-${r}-bye`,o.format,r,stage.length,entry(pair.bye),entry(null),false));if(!stage.every(terminal))break;
   }
  }
  prelim.push(...matches);addStats(prelim);const done=prelim.every(terminal)&&(o.format==='league'||Math.max(...prelim.map(m=>m.round))===o.swissRounds);
  if(done){const ranked=C.rank(rows,o.standings),r=E.seededRandom(s.seed+':qualification'),jitter=new Map(rows.map(x=>[x.id,r()])),tieValue=x=>o.standings==='buchholz'?x.buchholz:o.standings==='sonneborn'?x.sonneborn:o.standings==='wins'?x.matchWins:0;
   ranked.sort((a,b)=>b.points-a.points||tieValue(b)-tieValue(a)||jitter.get(a.id)-jitter.get(b.id));
   if(o.qualifyCount){const ids=ranked.slice(0,Math.min(o.qualifyCount,ranked.length)).map(r=>r.id),k=knockout(ids,'P','playoff');finalRef=k.final;phase='playoff';}
   else{leaders=ranked.filter(x=>x.points===ranked[0].points&&tieValue(x)===tieValue(ranked[0])).map(x=>x.id);champion=leaders.length===1?leaders[0]:null;phase='complete';}
  }
 }
 addStats(prelim.length?prelim:matches);if(finalRef&&terminal(finalRef)){champion=finalRef.winnerId;leaders=champion?[champion]:[];phase='complete';}if(champion)phase='complete';
 const losses=new Map();for(const m of matches)if(m.status==='complete'&&m.loserId)losses.set(m.loserId,(losses.get(m.loserId)||0)+1);for(const row of rows)row.eliminated=o.format==='double'?(losses.get(row.id)||0)>=2:matches.some(m=>['upper','playoff'].includes(m.phase)&&m.loserId===row.id);
 let ranked=C.rank(rows,o.standings);if(['knockout','double'].includes(o.format)&&phase==='complete'){const elimination=new Map();matches.forEach((m,i)=>{if(m.loserId)elimination.set(m.loserId,i);});ranked.sort((a,b)=>(a.id===champion?-1:b.id===champion?1:(elimination.get(b.id)??-1)-(elimination.get(a.id)??-1)));}
 if(o.format==='groups'&&phase!=='groups'){const qualified=new Set(matches.filter(m=>m.phase==='playoff'&&m.round===1).flatMap(m=>[m.aId,m.bId]).filter(Boolean));for(const row of rows)if(!qualified.has(row.id))row.eliminated=true;}
 return{matches,groups,rows:ranked,champion,leaders,phase,complete:phase==='complete',next:matches.find(m=>m.status==='ready')||null,invalidResultIds:Object.keys(s.results).filter(id=>!used.has(id)),qualifiers:matches.filter(m=>m.phase==='playoff'&&m.round===1).flatMap(m=>[m.aId,m.bId]).filter(Boolean)};
}
function reconcile(s,event){const v=view(s),discarded={};for(const id of v.invalidResultIds){discarded[id]=s.results[id];delete s.results[id];}if(event)event.discarded=discarded;return Object.keys(discarded);}
function commit(s,matchId,result,reason=''){
 const m=view(s).matches.find(m=>m.id===matchId);if(!m||!m.aId||!m.bId||!['ready','complete'].includes(m.status))throw new Error('El duelo no tiene dos participantes disponibles.');
 const next=clone(s),r={...clone(result),aId:m.aId,bId:m.bId};for(const k of ['aWins','bWins','draws'])if(!Number.isInteger(r[k])||r[k]<0||r[k]>1000)throw new Error('Marcador inválido.');if(r.aWins+r.bWins+r.draws<1)throw new Error('Indica al menos una partida en el marcador.');
 r.outcome=r.aWins===r.bWins?'Empate':r.aWins>r.bWins?'A':'B';
 if(r.outcome!=='Empate')r.winnerId=r.outcome==='A'?m.aId:m.bId;else if(m.mustWin){if(reason){if(![m.aId,m.bId].includes(r.winnerId))throw new Error('Elige quién avanza en el empate.');}else r.winnerId=E.seededRandom(next.seed+':tie:'+m.id)()<.5?m.aId:m.bId;r.tiebreak=true;}else r.winnerId=null;
 r.games=Array.isArray(r.games)?r.games:[];r.manual=!!reason;r.reason=String(reason).slice(0,500);r.at=new Date().toISOString();const event={kind:reason?'manual':'result',matchId,before:next.results[matchId]||null,at:r.at,text:reason?`Corrección: ${reason}`:'Duelo resuelto.'};next.results[matchId]=r;next.checkpoint=null;next.revision++;reconcile(next,event);next.audit.push(event);return next;
}
function adjust(s,id,points,reason){if(!s.entries.some(e=>e.id===id)||!Number.isInteger(points)||Math.abs(points)>1000||!String(reason).trim())throw new Error('Indica participante, ajuste de puntos y motivo.');const next=clone(s),event={kind:'points',entryId:id,before:next.adjustments[id]||0,at:new Date().toISOString(),text:String(reason).slice(0,500)};next.adjustments[id]=points;next.checkpoint=null;next.revision++;reconcile(next,event);next.audit.push(event);return next;}
function rename(s,id,owner){const next=clone(s),e=next.entries.find(e=>e.id===id);if(!e||!String(owner).trim())throw new Error('Indica un nombre para el participante.');next.audit.push({kind:'rename',entryId:id,before:e.owner,at:new Date().toISOString(),text:'Nombre del participante actualizado.'});e.owner=String(owner).slice(0,80);next.revision++;return next;}
function undo(s){const next=clone(s),event=[...next.audit].reverse().find(e=>['result','manual','points','rename'].includes(e.kind)&&!e.undone);if(!event)throw new Error('No hay cambios que deshacer.');if(event.kind==='points')next.adjustments[event.entryId]=event.before;else if(event.kind==='rename')next.entries.find(e=>e.id===event.entryId).owner=event.before;else if(event.before)next.results[event.matchId]=event.before;else delete next.results[event.matchId];Object.assign(next.results,event.discarded||{});event.undone=true;next.checkpoint=null;next.revision++;const undone={kind:'undo',at:new Date().toISOString(),text:'Último cambio deshecho.'};reconcile(next,undone);next.audit.push(undone);return next;}
function restore(raw){if(!raw||raw.type!=='ogun-live'||raw.schema!==1||!Array.isArray(raw.entries)||!raw.settings||!raw.options||!raw.results||typeof raw.results!=='object'||!Array.isArray(raw.audit)||raw.audit.length>10000)throw new Error('No es un torneo guardado compatible.');const base=create(raw.entries,raw.settings,raw.options,raw.seed,raw.name),s={...base,id:typeof raw.id==='string'?raw.id:base.id,results:clone(raw.results),adjustments:clone(raw.adjustments||{}),audit:clone(raw.audit),revision:Number.isInteger(raw.revision)?raw.revision:0,checkpoint:null};
 if(Object.keys(s.results).length>4096)throw new Error('Demasiados resultados.');for(const r of Object.values(s.results)){if(!r||!['A','B','Empate'].includes(r.outcome)||!['aWins','bWins','draws'].every(k=>Number.isInteger(r[k])&&r[k]>=0&&r[k]<=1000)||!Array.isArray(r.games)||r.games.length>32)throw new Error('Marcador guardado inválido.');for(const g of r.games)if(!g||!['A','B','Empate'].includes(g.winner)||typeof g.seed!=='string'||g.seed.length>300||!['A','B'].includes(g.firstWarrior)||!Array.isArray(g.positions)||g.positions.length!==2||g.positions.some(x=>!Number.isInteger(x)||x<0||x>=s.settings.coreSize)||!Number.isInteger(g.turns)||g.turns<1||g.turns>s.settings.maxCycles)throw new Error('Partida guardada inválida.');}
 for(const[id,points]of Object.entries(s.adjustments))if(!s.entries.some(e=>e.id===id)||!Number.isInteger(points)||Math.abs(points)>1000)throw new Error('Ajuste guardado inválido.');
 const v=view(s);if(v.invalidResultIds.length)throw new Error('El cuadro guardado contiene cruces incoherentes.');for(const m of v.matches){const r=m.result;if(!r)continue;const expected=r.aWins===r.bWins?'Empate':r.aWins>r.bWins?'A':'B';if(r.outcome!==expected||expected==='A'&&r.winnerId!==m.aId||expected==='B'&&r.winnerId!==m.bId||expected==='Empate'&&(m.mustWin?![m.aId,m.bId].includes(r.winnerId):r.winnerId!==null))throw new Error('Ganador guardado incoherente.');}
 if(raw.checkpoint){const p=raw.checkpoint,m=v.matches.find(m=>m.id===p.matchId);if(m?.status==='ready'&&p.aId===m.aId&&p.bId===m.bId&&Array.isArray(p.games)&&p.games.length<=32){const check={...s,results:{...s.results,[m.id]:{aId:m.aId,bId:m.bId,aWins:1,bWins:0,draws:0,outcome:'A',winnerId:m.aId,games:p.games}}};restore({...check,checkpoint:null,audit:[]});s.checkpoint=clone(p);}}
 return s;
}
function gameSettings(s,m,index){return{...s.settings,drawPolicy:s.options.drawPolicy,seed:`${s.seed}:${m.id}:${Math.floor(index/2)}`,firstWarrior:index%2?'B':'A',loadPoints:undefined};}
function tally(games){return{aWins:games.filter(g=>g.winner==='A').length,bWins:games.filter(g=>g.winner==='B').length,draws:games.filter(g=>g.winner==='Empate').length,games};}
function needsGame(s,m,games){if(games.length<s.options.rounds)return true;const r=tally(games);return m.mustWin&&s.options.knockoutTie==='extra'&&r.aWins===r.bWins&&games.length<s.options.rounds+s.options.extraPairs*2||m.mustWin&&s.options.knockoutTie==='extra'&&games.length%2===1;}
globalThis.OgunLive={FORMATS,DEFAULTS,options,admission,create,view,commit,adjust,rename,undo,restore,gameSettings,tally,needsGame};if(typeof module!=='undefined')module.exports=globalThis.OgunLive;
})();
