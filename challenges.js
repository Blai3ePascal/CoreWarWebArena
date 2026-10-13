(function(){
const E=globalThis.CoreWarEngine;
function madridDate(date=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);}
function puzzle(seed,kind){
 const r=E.seededRandom(seed), n=[256,512,1024][Math.floor(r()*3)], branch=3+Math.floor(r()*6), target=8+Math.floor(r()*36), k=2+Math.floor(r()*16), initial=2+Math.floor(r()*20), desired=initial+k;
 const names=['El primer salto','Bomba de precisión','La ruta segura','El contador perdido','Dos frentes'];
 const code=[`MOV.I 0, ??`,`ORG start\nstart MOV.I bomb, ??\n      JMP 0\nbomb DAT.F #0, #0`,`JMP ??\n${Array.from({length:branch-1},()=>'DAT #0, #0').join('\n')}\nNOP 0, 0\nJMP -1`,`ADD.AB #??, counter\nJMP 0\ncounter DAT #0, #${initial}`,`SPL ??\nJMP 0\n${Array.from({length:branch-2},()=>'DAT #0, #0').join('\n')}\nJMP 0`][kind];
 const goals=[`Copia el Imp a la celda 1 y sitúa allí su siguiente ejecución.`,`Coloca una bomba DAT en la celda ${target} en el primer turno, sin perder tu proceso.`,`Visita la celda ${branch} y mantén tu proceso vivo durante ocho turnos propios.`,`Deja el campo B de counter exactamente en ${desired} después de la suma.`,`Mantén dos procesos vivos durante ocho turnos propios.`];
 const solution=[1,target,branch,k,branch][kind];
 const hints=['El destino se calcula desde la instrucción MOV, situada en la celda 0.','El destino directo se mide desde start, situada en la celda 0.',`Las celdas intermedias contienen DAT. Busca NOP en la celda ${branch}.`,'Resta el valor inicial de counter al valor objetivo.',`Una rama debe continuar en el bucle de la celda 1 y otra en el de la celda ${branch}.`];
 return {id:seed,kind,title:names[kind],source:`;name ${names[kind]}\n${code}`,goal:goals[kind],solution,hint:hints[kind],target,desired,n,branch,turns:[1,1,8,1,8][kind],explanation:[`MOV.I 0, 1 copia toda la instrucción en la siguiente celda.`,`MOV.I bomb, ${target} copia DAT sobre el objetivo; el proceso continúa por JMP 0.`,`JMP ${branch} evita DAT y entra en el bucle NOP / JMP -1.`,`ADD.AB #${k}, counter suma ${k} al campo B, que inicialmente vale ${initial}.`,`SPL ${branch} abre una rama en la celda ${branch} y deja la continuación en la 1; ambas ejecutan JMP 0.`][kind]};
}
function check(p,value){
 if(!/^-?\d+$/.test(String(value).trim())) throw new Error('Escribe un número entero para sustituir ??.');
 const source=p.source.replace('??',String(value).trim());
 const settings={coreSize:p.n,maxCycles:200,maxProcesses:32,maxLength:80,minDistance:64,loadPoints:[0,p.n/2],seed:p.id,firstWarrior:'A'};
 const battle=E.createBattle(E.compileWarrior(source,settings),E.compileWarrior('JMP 0',settings),settings);
 if(p.kind===1) battle.core[p.target]={...E.compileWarrior('MOV.I 0, 1',settings).program[0],owner:'B'};
 const visited=[];
 for(let i=0;i<p.turns*2&&!battle.halted;i++){E.stepBattle(battle);if(battle.lastStep?.warrior==='A')visited.push(battle.lastStep.ip);}
 const alive=battle.queues.A.length>0;
 const ok=[()=>alive&&battle.core[1].op==='MOV'&&battle.queues.A[0]===1,()=>alive&&battle.core[p.target].op==='DAT'&&battle.core[p.target].owner==='A',()=>alive&&visited.includes(p.branch),()=>alive&&battle.core[2].bVal===p.desired,()=>battle.queues.A.length>=2][p.kind]();
 return {ok,battle,source,feedback:ok?'Objetivo cumplido.':alive?'Tu programa sigue vivo, pero aún no cumple el objetivo.':'Tu proceso ha ejecutado DAT y ha terminado.'};
}
function daily(date=madridDate(),slot=0){if(!/^\d{4}-\d{2}-\d{2}$/.test(date))throw new Error('Fecha inválida'); const seed=`ogun-v1:${date}:${slot}`,r=E.seededRandom(seed);return puzzle(seed,slot===0?Math.floor(r()*2):slot===1?2+Math.floor(r()*2):4);}
globalThis.OgunChallenges={madridDate,puzzle,check,daily};
})();
