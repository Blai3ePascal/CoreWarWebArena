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
 if(p.version===2)return checkGenerated(p,value);
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
const dailyCache=new Map();
const GENERATOR_VERSION=2, DAILY_MODULUS=16000003, DAILY_MULTIPLIER=104729;
function dayNumber(date){
 if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date)||date.startsWith('0000'))throw new Error('Fecha inválida');
 const d=new Date(date+'T12:00:00Z');if(!Number.isFinite(+d)||d.toISOString().slice(0,10)!==date)throw new Error('Fecha inválida');
 return Math.floor((+d-Date.parse('0001-01-01T12:00:00Z'))/86400000);
}
function generated(seed,kind,encoded){
 const random=E.seededRandom(seed),low=encoded%16384,padding=Math.floor(encoded/16384)+1,n=32768,start=padding,target=2048+low;
 const prefix=`ORG inicio ; Comienza en la primera instrucción activa.\nreserva EQU ${padding} ; Distancia hasta la zona activa.\nFOR reserva ; Reserva una zona de datos antes del programa.\nDAT.F #0, #0 ; Estas celdas no deben ejecutarse.\nROF ; Fin de la zona reservada.\n`;
 let body,goal,solution,hint,explanation,objective,turns=8,title;
 const value=low+1,delta=17+Math.floor(random()*193),factor=[3,5,7,11][Math.floor(random()*4)];
 switch(kind){
 case 0:title='El tributo de la forja';body='inicio MOV.AB #??, dato\n       JMP 0\ndato DAT.F #0, #0';solution=value;goal=`Deja el campo B de dato exactamente en ${value} y conserva un proceso.`;objective={type:'field',address:start+2,field:'bVal',value};hint='MOV.AB copia el número inmediato al campo B del destino.';explanation=`MOV.AB #${solution}, dato deja B = ${value}; JMP 0 mantiene vivo al guerrero.`;break;
 case 1:title='La suma del oráculo';body=`inicio ADD.AB #??, dato\n       JMP 0\ndato DAT.F #0, #${value}`;solution=delta;goal=`Suma lo necesario para que B de dato pase de ${value} a ${value+delta}.`;objective={type:'field',address:start+2,field:'bVal',value:value+delta};hint='Resta el valor inicial del objetivo.';explanation=`${value} + ${delta} = ${value+delta}. La suma solo se ejecuta una vez.`;break;
 case 2:title='La deuda del acero';body=`inicio SUB.AB #??, dato\n       JMP 0\ndato DAT.F #0, #${value}`;solution=delta;goal=`Deja B de dato en ${(value-delta+n)%n} restando un número a ${value}. Recuerda que el núcleo tiene ${n} celdas.`;objective={type:'field',address:start+2,field:'bVal',value:(value-delta+n)%n};hint='SUB resta el origen al destino. Los valores negativos se envuelven en el núcleo.';explanation=`SUB.AB #${delta}, dato calcula (${value} − ${delta}) módulo ${n}.`;break;
 case 3:title='El multiplicador de bronce';body=`inicio MUL.AB #??, dato\n       JMP 0\ndato DAT.F #0, #${factor}`;solution=value;goal=`Multiplica B de dato, que vale ${factor}, para dejarlo en ${(factor*value)%n}. La aritmética se envuelve en ${n}.`;objective={type:'field',address:start+2,field:'bVal',value:(factor*value)%n};hint=`Busca un número que multiplicado por ${factor} dé el objetivo, módulo ${n}.`;explanation=`${factor} × ${value} = ${factor*value}; al envolver en el núcleo queda ${(factor*value)%n}.`;break;
 case 4:title='La flecha de obsidiana';body='inicio MOV.I bomba, ??\n       JMP 0\nbomba DAT.F #0, #0';solution=target-start;goal=`Escribe la bomba DAT en @${target} desde inicio, situado en @${start}, y sigue vivo.`;objective={type:'bomb',address:target};hint=`El destino directo es un desplazamiento: ${target} menos ${start}.`;explanation=`MOV.I bomba, ${solution} alcanza @${target}. El siguiente proceso ejecuta JMP 0.`;break;
 case 5:title='El refugio distante';body=`inicio MOV.I refugio, $${target-start}\n       JMP ??\nrefugio JMP 0`;solution=target-(start+1);goal=`Tras crear un refugio JMP en @${target}, salta a él y sobrevive ocho pasos propios. El salto está en @${start+1}.`;objective={type:'visit',address:target};hint='Calcula la distancia desde la celda de JMP, no desde inicio.';explanation=`JMP ${solution} parte de @${start+1} y llega al refugio @${target}.`;break;
 case 6:title='Los dos juramentos';body=`inicio MOV.I refugio, $${target-start}\n       SPL ??\n       JMP 0\nrefugio JMP 0`;solution=target-(start+1);goal=`Abre una segunda rama en el refugio @${target}. Conserva dos procesos durante ocho pasos propios.`;objective={type:'fork',address:target};hint=`SPL está en @${start+1}. Su continuación permanece en el JMP de @${start+2}.`;explanation=`SPL ${solution} crea la rama remota. La rama original y la nueva se turnan en dos bucles seguros.`;break;
 case 7:title='El espejo del guardián';body=`inicio SEQ.AB #??, dato\n       DAT.F #0, #0\n       JMP 0\ndato DAT.F #0, #${value}`;solution=value;goal=`Compara con B de dato (${value}), evita la celda DAT y sobrevive ocho pasos.`;objective={type:'visit',address:start+2};hint='SEQ salta la siguiente instrucción si ambos valores son iguales.';explanation=`Con #${value}, SEQ.AB encuentra igualdad y evita DAT. El proceso entra en JMP 0.`;break;
 case 8:title='El puntero de las cenizas';body='inicio MOV.I bomba, @puntero\n       JMP 0\npuntero DAT.F #0, #??\nbomba DAT.F #0, #0';solution=target-(start+2);goal=`Haz que @puntero dirija la bomba a @${target}. puntero está en @${start+2}.`;objective={type:'bomb',address:target};hint='El segundo desplazamiento se suma desde puntero, no desde MOV.';explanation=`El campo B ${solution} de puntero conduce desde @${start+2} hasta @${target}.`;break;
 case 9:title='El último latido';body='inicio DJN refugio, contador\n       DAT.F #0, #0\nrefugio JMP 0\ncontador DAT.F #0, #??';solution=value+1;goal=`Después de DJN, B de contador debe valer ${value}. Mantén vivo al guerrero evitando DAT.`;objective={type:'field',address:start+3,field:'bVal',value};hint='DJN resta uno antes de decidir el salto. El valor resultante debe ser distinto de cero.';explanation=`El contador comienza en ${value+1}; DJN lo deja en ${value} y salta al refugio.`;break;
 case 10:{const slot=1+Math.floor(random()*511);title='La memoria del herrero';body=`inicio STP.AB #??, #${slot}\n       LDP.AB #${slot}, dato\n       JMP 0\ndato DAT.F #0, #0`;solution=value;goal=`Guarda ${value} en P-space[${slot}] y recupera ese valor en B de dato, sin perder el proceso.`;objective={type:'pspace',address:start+3,slot,value};hint='STP guarda el número inmediato y LDP lo recupera en el turno siguiente.';explanation=`STP.AB #${value}, #${slot} escribe la memoria privada; LDP.AB #${slot}, dato la copia al núcleo.`;break;}
 case 11:title='La puerta cruzada';body=`inicio MOV.X dato, destino\n       JMP 0\ndato DAT.F #${value}, #??\ndestino DAT.F #0, #0`;solution=(value+delta)%n;goal=`Después de MOV.X, destino debe contener A = ${solution} y B = ${value}.`;objective={type:'cross',address:start+3,a:solution,b:value};hint='El modificador .X cruza los campos: A del origen va a B y B del origen va a A.';explanation=`Con B de dato = ${solution}, MOV.X deja destino con A = ${solution}, B = ${value}.`;break;
 default:throw new Error('Familia de puzle inválida.');
 }
 return{id:seed,version:2,kind,title,source:`;name ${title}\n${prefix}${body}\nEND inicio`,goal,solution,hint,explanation,n,turns,objective,construction:{padding,low}};
}
function checkGenerated(p,value){
 const text=String(value).trim();if(!/^-?\d+$/.test(text))throw new Error('Escribe un número entero para sustituir ??.');
 const answer=Number(text);if(!Number.isSafeInteger(answer)||Math.abs(answer)>=p.n)return{ok:false,feedback:`Usa un entero entre ${1-p.n} y ${p.n-1}.`};
 const source=p.source.replace('??',text),settings={coreSize:p.n,maxCycles:32,maxProcesses:32,maxLength:1000,minDistance:0,pSpaceSize:512,trace:false};
 const battle=E.createSandbox(E.compileWarrior(source,settings),settings),visited=[];
 for(let i=0;i<p.turns&&!battle.halted;i++){E.stepSandbox(battle);visited.push(battle.lastStep.ip);}
 const alive=battle.queues.A.length>0,o=p.objective,c=battle.core[o.address];
 const ok=alive&&(o.type==='field'?c[o.field]===o.value:o.type==='bomb'?c.op==='DAT'&&c.owner==='A':o.type==='visit'?visited.includes(o.address):o.type==='fork'?battle.queues.A.length>=2&&visited.includes(o.address):o.type==='pspace'?c.bVal===o.value&&battle.warriors[0].pSpace[o.slot]===o.value:o.type==='cross'?c.aVal===o.a&&c.bVal===o.b:false);
 return{ok,battle,source,feedback:ok?'Objetivo cumplido.':alive?'Tu programa sigue vivo, pero aún no cumple el objetivo.':'Tu proceso ha terminado: revisa el salto, los datos y la ruta de ejecución.'};
}
function daily(date=madridDate(),slot=0){
 const ordinal=dayNumber(date);if(!Number.isInteger(slot)||slot<0||slot>2)throw new Error('Elige uno de los tres retos diarios.');
 const seed=`ogun-diario-v2:${date}:${slot}`;if(dailyCache.has(seed))return dailyCache.get(seed);
 const key=ordinal*3+slot,encoded=(key*DAILY_MULTIPLIER+32452843)%DAILY_MODULUS;
 const random=E.seededRandom(seed),kind=slot*4+Math.floor(random()*4),p=generated(seed,kind,encoded);
 // Generation is accepted only after its proposed solution meets the executable objective.
 if(!checkGenerated(p,p.solution).ok)throw new Error('No se ha podido verificar el reto diario.');
 p.date=date;p.slot=slot;
 dailyCache.set(seed,p);if(dailyCache.size>93)dailyCache.delete(dailyCache.keys().next().value);
 return p;
}

globalThis.OgunChallenges={madridDate,puzzle,check,daily,dayNumber,GENERATOR_VERSION};
})();
