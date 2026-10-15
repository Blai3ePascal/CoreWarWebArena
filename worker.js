importScripts('engine.js?v=1.4.0','competition.js?v=1.4.0');
self.onmessage=({data})=>{
 try{
 const {entries,seed}=data,E=CoreWarEngine,C=OgunCompetition,o=C.options({...data.options,format:data.format||data.options?.format||'league',rounds:data.rounds||data.options?.rounds||4},entries.length),settings={...E.DEFAULT_SETTINGS,...data.settings,drawPolicy:o.drawPolicy};
 if(new Set(entries.map(e=>e.id)).size!==entries.length)throw new Error('Los participantes necesitan identificadores únicos.');
 const compiled=entries.map(w=>{const v=C.validate(w.code,settings,o);if(!v.ok)throw new Error(w.name+': '+v.errors.join(' '));return v.compiled;});
 for(let i=0;i<compiled.length;i++)for(let j=i+1;j<compiled.length;j++)if(!C.compatible(compiled[i].length,compiled[j].length,settings))throw new Error(`No caben juntos ${entries[i].name} y ${entries[j].name} con esa distancia mínima.`);
 const rows=entries.map(w=>({id:w.id,name:w.name,points:0,wins:0,draws:0,losses:0,played:0,matchWins:0,matchDraws:0,matchLosses:0,encounters:0,byes:0,buchholz:0,sonneborn:0}));
 const matches=[],stages=[],seen=new Set(),byId=new Map(entries.map((w,i)=>[w.id,i]));
 function publish(type,extra={}){C.tieScores(rows,matches);self.postMessage({type,rows,stages,...(type==='complete'?{matches}:{}),...extra});}
 function game(i,j,index,number){const s={...settings,seed:`${seed}:${index}:${Math.floor(number/2)}`,firstWarrior:number%2?'B':'A'};delete s.loadPoints;
 const state=E.createBattle(compiled[i],compiled[j],s);E.runSteps(state,s.maxCycles);
 const g={winner:state.winner,reason:state.winReason,seed:s.seed,firstWarrior:s.firstWarrior,positions:state.warriors.map(w=>w.start),turns:state.cycle};
 self.postMessage({type:'game',result:g,a:entries[i].name,b:entries[j].name});return g;}
 function duel(i,j,stage){const index=matches.length,games=[];let a=0,b=0,draws=0;
 function add(number){const g=game(i,j,index,number);games.push(g);if(g.winner==='A')a++;else if(g.winner==='B')b++;else draws++;}
 for(let n=0;n<o.rounds;n++)add(n);
 if(o.format==='knockout'&&a===b&&o.knockoutTie==='extra')for(let p=0;p<o.extraPairs&&a===b;p++){add(o.rounds+p*2);add(o.rounds+p*2+1);}
 const outcome=a===b?'Empate':a>b?'A':'B',winner=a===b?(E.seededRandom(`${seed}:tie:${index}`)()<.5?i:j):a>b?i:j,ra=rows[i],rb=rows[j];
 ra.wins+=a;ra.losses+=b;ra.draws+=draws;rb.wins+=b;rb.losses+=a;rb.draws+=draws;ra.played+=games.length;rb.played+=games.length;ra.encounters++;rb.encounters++;
 if(outcome==='Empate'){ra.matchDraws++;rb.matchDraws++;ra.points+=o.drawPoints;rb.points+=o.drawPoints;}else{const win=outcome==='A'?ra:rb,loss=outcome==='A'?rb:ra;win.matchWins++;loss.matchLosses++;win.points+=o.winPoints;loss.points+=o.lossPoints;}
 const repeated=seen.has([ra.id,rb.id].sort().join('|'));seen.add([ra.id,rb.id].sort().join('|'));
 const m={stage,a:entries[i].name,b:entries[j].name,aId:entries[i].id,bId:entries[j].id,aWins:a,bWins:b,draws,games,outcome,winnerId:outcome==='Empate'&&o.format!=='knockout'?null:entries[winner].id,tiebreak:outcome==='Empate'&&o.format==='knockout',extraGames:games.length-o.rounds,repeated};matches.push(m);publish('progress',{lastMatch:m});return winner;}
 let champion=null;
 if(o.format==='league'){stages.push({number:1,label:'Liga'});for(let i=0;i<entries.length;i++)for(let j=i+1;j<entries.length;j++)duel(i,j,1);}
 else if(o.format==='knockout'){
 const rng=E.seededRandom(`${seed}:bracket`);let bracket=entries.map((_,i)=>i);for(let i=bracket.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[bracket[i],bracket[j]]=[bracket[j],bracket[i]];}let stage=0;
 while(bracket.length>1){stage++;const next=[],byes=[];for(let p=0;p<bracket.length;p+=2)if(p+1===bracket.length){next.push(bracket[p]);rows[bracket[p]].byes++;byes.push(entries[bracket[p]].id);}else next.push(duel(bracket[p],bracket[p+1],stage));stages.push({number:stage,label:'Eliminatoria '+stage,byes});bracket=next;}champion=entries[bracket[0]].id;
 }else{
 for(let n=1;n<=o.swissRounds;n++){C.tieScores(rows,matches);const pairing=C.pairsForRound(rows,seen,seed,n,o.format);stages.push({number:n,label:'Jornada '+n,bye:pairing.bye,pairs:pairing.pairs,repeated:pairing.repeated});if(pairing.bye){const row=rows.find(r=>r.id===pairing.bye);row.byes++;row.points+=o.byePoints;publish('progress');}for(const[a,b]of pairing.pairs)duel(byId.get(a),byId.get(b),n);}
 }
 C.tieScores(rows,matches);const ranked=C.rank(rows,o.standings),top=ranked[0];
 const tieValue=r=>o.standings==='buchholz'?r.buchholz:o.standings==='sonneborn'?r.sonneborn:o.standings==='wins'?r.matchWins:0;
 const leaders=o.format==='knockout'?[champion]:ranked.filter(r=>r.points===top.points&&tieValue(r)===tieValue(top)).map(r=>r.id);
 if(o.format!=='knockout')champion=leaders.length===1?leaders[0]:null;
 publish('complete',{champion,leaders,options:o});
 }catch(e){self.postMessage({type:'error',message:e.message});}
};
