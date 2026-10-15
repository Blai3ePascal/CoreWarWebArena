(function(){
'use strict';
const E=typeof module!=='undefined'&&module.exports?require('./engine.js'):CoreWarEngine;
const VERSION='OGUN-2';
const SETTINGS=Object.freeze({coreSize:8000,maxCycles:20000,maxProcesses:256,maxLength:300,minDistance:100,pSpaceSize:512,warriors:2,drawPolicy:'draw',trace:false});
const titles=[[850,'Avatar de Ogún'],[700,'Señor del núcleo'],[550,'Conquistador de hierro'],[400,'Guardián de la forja'],[250,'Aprendiz de guerra'],[0,'Chispa de la forja']];
function score(wins,draws,losses){const n=wins+draws+losses;if(!n)return 0;return Math.round(1000*(wins+draws*.5)/n);}
function title(points){return titles.find(([min])=>points>=min)[1];}
function verdict(points){return points>=850?'Dominante en esta batería':points>=700?'Fuerte en esta batería':points>=550?'Combatiente sólido':points>=400?'Resistencia equilibrada':points>=250?'Todavía vulnerable':'Necesita una nueva estrategia';}
function selfTest(compiled,limit=20000){const state=E.createSandbox(compiled,{...SETTINGS,maxCycles:limit});while(!state.halted)E.stepSandbox(state);return{status:state.queues.A.length?'survives':'suicide',turns:state.cycle,processes:state.queues.A.length,lastStep:state.lastStep,limit};}
function evaluate(source,rivals,progress=()=>{}){
 if(!Array.isArray(rivals)||!rivals.length||rivals.length>200)throw new Error('Biblioteca de rivales inválida.');
 const candidate=E.compileWarrior(source,SETTINGS),compiled=[],excluded=[];
 for(const r of rivals){try{compiled.push({...r,compiled:E.compileWarrior(r.code,SETTINGS)});}catch(e){if(r.benchmark!==false)throw e;excluded.push({id:r.id,name:r.name,error:e.message});}}
 const solo=selfTest(candidate),rows=[];let wins=0,draws=0,losses=0,done=0;const total=compiled.length*10;
 progress({done,total,solo});
 for(const r of compiled){const row={id:r.id,name:r.name,benchmark:r.benchmark!==false,wins:0,draws:0,losses:0,games:[]};
  for(let i=0;i<10;i++){
   const seed=`${VERSION}:${r.id}:${Math.floor(i/2)}`,firstWarrior=i%2?'B':'A';
   const state=E.createBattle(candidate,r.compiled,{...SETTINGS,seed,firstWarrior});E.runSteps(state,SETTINGS.maxCycles);
   const key=state.winner==='A'?'wins':state.winner==='Empate'?'draws':'losses';row[key]++;
   row.games.push({seed,firstWarrior,winner:state.winner,turns:state.cycle,positions:state.warriors.map(w=>w.start)});
   done++;progress({done,total,rival:r.name,solo});
  }
  if(row.benchmark){wins+=row.wins;draws+=row.draws;losses+=row.losses;}rows.push(row);
 }
 const points=score(wins,draws,losses);return{version:VERSION,settings:{...SETTINGS},name:candidate.metadata.name,wins,draws,losses,total,benchmarkTotal:wins+draws+losses,excluded,score:points,title:title(points),verdict:verdict(points),solo,rows};
}
const api={VERSION,SETTINGS,score,title,verdict,selfTest,evaluate};if(typeof globalThis!=='undefined')globalThis.OgunRating=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})();
