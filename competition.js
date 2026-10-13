(function(){
'use strict';
const E=globalThis.CoreWarEngine;
const FORMATS=['swiss','league','knockout','random'];
const DEFAULTS={format:'swiss',rounds:4,swissRounds:3,winPoints:3,drawPoints:1,lossPoints:0,byePoints:3,standings:'buchholz',knockoutTie:'extra',extraPairs:2,allowPSpace:false,banned:'',drawPolicy:'draw'};
function options(raw={},count){const o={...DEFAULTS,...raw};if(!FORMATS.includes(o.format))throw new Error('Formato de torneo inválido.');
 for(const [k,min,max]of [['rounds',2,16],['swissRounds',1,32],['winPoints',0,100],['drawPoints',0,100],['lossPoints',0,100],['byePoints',0,100],['extraPairs',0,8]])if(!Number.isInteger(o[k])||o[k]<min||o[k]>max)throw new Error(`Regla inválida: ${k}.`);
 if(o.rounds%2)throw new Error('Usa un número par de partidas por duelo para alternar el primer turno.');
 if(!['buchholz','sonneborn','wins','name'].includes(o.standings)||!['seeded','extra'].includes(o.knockoutTie)||!['draw','territory','processes'].includes(o.drawPolicy))throw new Error('Desempate inválido.');
 if(count!==undefined){if(count<2||count>32)throw new Error('Selecciona entre 2 y 32 guerreros.');if(['swiss','random'].includes(o.format)&&o.swissRounds>(count%2?count:count-1))throw new Error(`Con ${count} guerreros puedes jugar hasta ${count%2?count:count-1} jornadas.`);}
 const banned=String(o.banned||'').toUpperCase().split(/[\s,;]+/).filter(Boolean);const ops=['DAT','MOV','ADD','SUB','MUL','DIV','MOD','JMP','JMZ','JMN','DJN','SEQ','CMP','SNE','SLT','SPL','NOP','LDP','STP'];
 if(banned.some(op=>!ops.includes(op)))throw new Error('La lista de instrucciones prohibidas contiene un nombre desconocido.');o.banned=[...new Set(banned)].join(', ');o.allowPSpace=!!o.allowPSpace;return o;
}
function validate(code,settings,raw={}){settings={...E.DEFAULT_SETTINGS,...settings};try{E.validateSettings(settings);const o=options(raw),compiled=E.compileWarrior(code,settings);const forbidden=new Set(o.banned.split(', ').filter(Boolean));if(!o.allowPSpace){forbidden.add('LDP');forbidden.add('STP');}
 const used=[...new Set(compiled.program.filter(i=>forbidden.has(i.op)||i.op==='SEQ'&&forbidden.has('CMP')).map(i=>i.op))];
 if(!o.allowPSpace&&compiled.pin!==null)throw new Error('PIN no está permitido: activa P-space para aceptar este guerrero.');
 if(used.length)throw new Error('Instrucciones fuera de las reglas: '+used.join(', '));
 if(compiled.length>settings.coreSize)throw new Error('El guerrero supera el tamaño del núcleo.');
 if(settings.minDistance*2>settings.coreSize)throw new Error('La distancia mínima no permite alojar dos guerreros en este núcleo.');
 return{ok:true,length:compiled.length,entryPoint:compiled.entryPoint,name:compiled.metadata.name,compiled,errors:[]};
 }catch(e){return{ok:false,errors:[e.message]};}}
function compatible(a,b,settings){return Math.max(settings.minDistance,a)+Math.max(settings.minDistance,b)<=settings.coreSize;}
function rank(rows,tie='buchholz'){const names=(a,b)=>String(a.name).localeCompare(String(b.name),'es')||a.id.localeCompare(b.id);return[...rows].sort((a,b)=>b.points-a.points||(tie==='buchholz'?b.buchholz-a.buchholz:tie==='sonneborn'?b.sonneborn-a.sonneborn:tie==='wins'?b.matchWins-a.matchWins:0)||names(a,b));}
function tieScores(rows,matches){for(const r of rows){r.buchholz=0;r.sonneborn=0;}for(const m of matches){const a=rows.find(r=>r.id===m.aId),b=rows.find(r=>r.id===m.bId);if(!a||!b)continue;a.buchholz+=b.points;b.buchholz+=a.points;if(m.outcome==='A')a.sonneborn+=b.points;else if(m.outcome==='B')b.sonneborn+=a.points;else{a.sonneborn+=b.points/2;b.sonneborn+=a.points/2;}}}
function pairsForRound(rows,seen,seed,round,format='swiss'){
 const r=E.seededRandom(`${seed}:pairings:${round}`),jitter=new Map(rows.map(x=>[x.id,r()]));let order=[...rows].sort((a,b)=>format==='random'?jitter.get(a.id)-jitter.get(b.id):b.points-a.points||b.buchholz-a.buchholz||jitter.get(a.id)-jitter.get(b.id));let bye=null;
 if(order.length%2){bye=[...order].sort((a,b)=>a.byes-b.byes||a.points-b.points||jitter.get(a.id)-jitter.get(b.id))[0];order=order.filter(x=>x.id!==bye.id);}
 const key=(a,b)=>[a.id,b.id].sort().join('|');let nodes=0;
 function solve(remaining,allowRepeats){if(!remaining.length)return[];if(++nodes>150000)return null;const a=remaining[0],candidates=remaining.slice(1).sort((b,c)=>(seen.has(key(a,b))?1000000:0)-(seen.has(key(a,c))?1000000:0)+(format==='swiss'?Math.abs(a.points-b.points)-Math.abs(a.points-c.points):0)||jitter.get(b.id)-jitter.get(c.id));
 for(const b of candidates){if(!allowRepeats&&seen.has(key(a,b)))continue;const rest=solve(remaining.filter(x=>x.id!==a.id&&x.id!==b.id),allowRepeats);if(rest)return[[a.id,b.id],...rest];}return null;}
 let pairs=solve(order,false);if(!pairs){nodes=0;pairs=solve(order,true);}if(!pairs)throw new Error('No se pudieron generar los emparejamientos.');return{pairs,bye:bye?.id||null,repeated:pairs.some(([a,b])=>seen.has([a,b].sort().join('|')))};
}
globalThis.OgunCompetition={DEFAULTS,FORMATS,options,validate,compatible,rank,tieScores,pairsForRound};
if(typeof module!=='undefined')module.exports=globalThis.OgunCompetition;
})();
