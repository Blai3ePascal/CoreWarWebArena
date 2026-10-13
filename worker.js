importScripts('engine.js');
self.onmessage=({data})=>{
 try{
 const {entries,settings,rounds,format,seed}=data;const E=CoreWarEngine;
 const compiled=entries.map(w=>E.compileWarrior(w.code,settings));
 const rows=entries.map(w=>({id:w.id,name:w.name,points:0,wins:0,draws:0,losses:0,played:0}));
 const matches=[];let cancelled=false;
 function duel(i,j,index){let a=0,b=0,draws=0;const games=[];
 for(let round=0;round<rounds;round++){
 const s={...settings,seed:`${seed}:${index}:${Math.floor(round/2)}`,firstWarrior:round%2?'B':'A'};
 const state=E.createBattle(compiled[i],compiled[j],s);E.runSteps(state,s.maxCycles);
 if(state.winner==='A')a++;else if(state.winner==='B')b++;else draws++;
 games.push({winner:state.winner,seed:s.seed,firstWarrior:s.firstWarrior,positions:state.warriors.map(w=>w.start),turns:state.cycle});
 }
 const ra=rows[i],rb=rows[j];ra.wins+=a;ra.losses+=b;ra.draws+=draws;rb.wins+=b;rb.losses+=a;rb.draws+=draws;ra.points+=3*a+draws;rb.points+=3*b+draws;ra.played+=rounds;rb.played+=rounds;
 const winner=a===b?(E.seededRandom(`${seed}:tie:${index}`)()<.5?i:j):a>b?i:j;
 const match={a:entries[i].name,b:entries[j].name,aId:entries[i].id,bId:entries[j].id,aWins:a,bWins:b,draws,games,winnerId:entries[winner].id,tiebreak:a===b};matches.push(match);
 self.postMessage({type:'progress',rows,matches});return winner;
 }
 let champion=null;
 if(format==='league'){let m=0;for(let i=0;i<entries.length;i++)for(let j=i+1;j<entries.length;j++)duel(i,j,m++);}
 else{let bracket=entries.map((_,i)=>i),m=0;while(bracket.length>1){const next=[];for(let p=0;p<bracket.length;p+=2)next.push(p+1===bracket.length?bracket[p]:duel(bracket[p],bracket[p+1],m++));bracket=next;}champion=entries[bracket[0]].id;}
 self.postMessage({type:'complete',rows,matches,champion});
 }catch(e){self.postMessage({type:'error',message:e.message});}
};
