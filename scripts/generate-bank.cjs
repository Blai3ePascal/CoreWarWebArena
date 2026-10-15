'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),E=require('../engine.js');
const ROOT=path.resolve(__dirname,'..');
const names=['chispa del alba','sendero de hierro','marcha de los titanes','legión del amanecer','juramento eterno','vigía de obsidiana','guardián del umbral','centinela de las brasas','custodio del eclipse','baluarte de la aurora','martillo del trueno','lanza del firmamento','ira del volcán','colmillo de bronce','hacha del destino','flecha de la tormenta','garra del infinito','puño de la montaña','marea de cenizas','avalancha de acero','río de las espadas','cascada del abismo','vendaval de la forja','torbellino de ónice','oleada de los reyes','tempestad del ocaso','ojo del dragón','oráculo de las sombras','halcón de medianoche','rastreador del vacío','lince del inframundo','faro del fin del mundo','meteorito de hierro','cometa de las almas','estrella del asedio','sol de los caídos','luna de los guerreros','corazón de la fortaleza','memoria de los antiguos','sello del oráculo','crónica del fuego','runa del renacer','heraldo de dos mundos','gemelos del relámpago','pacto de las dos lunas','alianza de los inmortales','verdugo de las sombras','espada del último juicio','nexo del apocalipsis','trono de la eternidad'];
function explain(line){
 const clean=line.trim(),tokens=clean.split(/\s+/);let op=tokens[0].split('.')[0];if(!['ORG','END','DAT','MOV','ADD','SUB','MOD','JMP','SPL','SEQ','SLT','LDP','STP','DJN'].includes(op))op=(tokens[1]||'').split('.')[0];
 if(op==='ORG')return 'Elige la etiqueta donde empieza el primer proceso.';
 if(op==='END')return 'Cierra el programa y confirma su punto de entrada.';
 if(op==='DAT')return clean.startsWith('origen')?'Longitud total del programa; se usa para reiniciar el contador de copia.':clean.startsWith('puntero')?'Su campo B guarda el desplazamiento del próximo objetivo; no se ejecuta.':clean.startsWith('bomba')?'Munición: al ejecutarla, el proceso que la recibe termina.':clean.startsWith('vacio')?'Patrón de memoria vacía que usa el escáner para comparar.':'Reserva dos valores; un proceso que llegue aquí termina.';
 if(op==='MOV'&&clean.includes('origen, -1'))return 'Coloca antes del programa el contador con la longitud de la nueva copia.';
 if(op==='MOV'&&clean.includes('bomba, >destino'))return 'Lanza una bomba hacia la próxima zona y avanza el puntero tras la escritura.';
 if(op==='MOV'&&clean.includes('@inicio-1'))return 'Lee la celda indicada por el contador y la copia retrocediendo el puntero de destino.';
 if(op==='MOV'&&clean.includes('<inicio-1'))return 'Retrocede el contador de origen y el puntero de destino antes de copiar otra instrucción.';
 if(op==='DJN')return 'Resta uno al contador de copia y repite el lote mientras queden instrucciones.';
 if(op==='DAT'&&clean.startsWith('origen'))return 'Longitud total del programa que se cargará como contador de copia.';
 if(op==='ADD'&&clean.includes('destino'))return 'Desplaza el destino de la siguiente réplica con el salto elegido.';
 if(op==='SPL'&&clean.startsWith('destino'))return 'Arranca otro proceso en el comienzo de la copia recién escrita.';
 if(op==='MOV')return /MOV\.AB/.test(clean)?'Restaura el campo B del puntero al inicio de la zona segura.':/MOV\.I 0,/.test(clean)?'Copia esta instrucción hacia delante; las copias permiten continuar la marcha.':clean.includes('@puntero')?'Copia la bomba a la dirección calculada con el campo B de puntero.':clean.includes('>puntero')?'Copia una bomba y después avanza una celda el campo B de puntero.':'Copia la instrucción completa en el destino indicado.';
 if(op==='ADD')return clean.includes('#128')?'Desplaza el resultado a la franja segura, lejos del código propio.':clean.includes('puntero')?'Aumenta el campo B del puntero con el salto indicado.':'Aumenta el valor que se guardará en memoria privada.';
 if(op==='MOD')return 'Envuelve el puntero dentro de la amplitud segura; la suma siguiente añade el margen.';
 if(op==='SPL')return clean.includes(' 1,')?'Divide la ejecución; la continuación y la rama avanzan por turnos.':'Abre una rama en la etiqueta indicada y conserva el proceso original.';
 if(op==='JMP')return /JMP(?:\.B)? 0(?:,|$)/.test(clean)?'Mantiene este proceso en un bucle seguro sobre su propia instrucción.':/[<{>}]/.test(clean)?'Repite el bucle y altera el puntero remoto del segundo operando.':'Vuelve a la etiqueta indicada para repetir la estrategia.';
 if(op==='SLT')return 'Si el puntero supera el extremo seguro, omite el salto y permite reiniciarlo.';
 if(op==='SEQ')return 'Compara una instrucción con memoria vacía; si coincide, omite el ataque.';
 if(op==='STP')return 'Guarda el campo A inmediato en la posición indicada de la memoria privada.';
 if(op==='LDP')return 'Recupera la memoria privada en el campo B del dato indicado.';
 return 'Continúa la estrategia con los operandos mostrados.';
}
function annotate(body){return body.split('\n').filter(l=>l.trim()).map(l=>l+' ; '+explain(l)).join('\n');}
function bounded(step=37){return `ORG inicio\ninicio MOV.I bomba, @puntero\nADD.AB #${step}, puntero\nMOD.AB #(CORESIZE-256), puntero\nADD.AB #128, puntero\nJMP inicio\npuntero DAT.F #0, #128\nbomba DAT.F #0, #0\nEND inicio`;}
function sweep(batch=4,payload=0){return `ORG inicio\ninicio ${Array.from({length:batch},()=> 'MOV.I bomba, >puntero').join('\n')}\nSLT.AB #(CORESIZE-96), puntero\nJMP inicio\nMOV.AB #96, puntero\nJMP inicio\npuntero DAT.F #0, #96\nbomba DAT.F #0, #${payload}\nEND inicio`;}
function scan(step=73,batch=4,payload=0){return `ORG inicio\ninicio SEQ.I vacio, @puntero\nJMP atacar\nADD.AB #${step}, puntero\nMOD.AB #(CORESIZE-256), puntero\nADD.AB #128, puntero\nJMP inicio\natacar ${Array.from({length:batch},()=> 'MOV.I bomba, >puntero').join('\n')}\nSLT.AB #(CORESIZE-96), puntero\nJMP inicio\nMOV.AB #128, puntero\nJMP inicio\npuntero DAT.F #0, #128\nbomba DAT.F #0, #${payload}\nvacio DAT.F $0, $0\nEND inicio`;}
function stone(step=8,initial=128,payload='DAT.F #0, #0'){return `ORG inicio\ninicio MOV.I bomba, @puntero\nADD.AB #${step}, puntero\nJMP inicio\npuntero DAT.F #0, #${initial}\nbomba ${payload}\nEND inicio`;}
function fleet(hop=997,unroll=4){let length=Math.ceil((unroll+8)/unroll)*unroll;return `ORG inicio\ninicio MOV.I origen, -1\ncopia MOV.I @inicio-1, <destino\n${Array.from({length:unroll-1},()=> 'MOV.I <inicio-1, <destino').join('\n')}\nDJN.B copia, inicio-1\ndestino SPL.B @destino, ${hop}\nADD.AB #${hop}, destino\nJMP inicio\norigen DAT.F #0, #${length}\nDAT.F #0, #0\nDAT.F #0, #1\n${Array.from({length:length-(unroll+8)},()=> 'DAT.F #0, #0').join('\n')}\nEND inicio`;}
function assault(hop=997,k=4,rounds=1){let n=Math.ceil((k+8+rounds)/k)*k;return `ORG inicio\ninicio MOV.I origen, -1\ncopia MOV.I @inicio-1, <destino\n${Array.from({length:k-1},()=> 'MOV.I <inicio-1, <destino').join('\n')}\nDJN.B copia, inicio-1\ndestino SPL.B @destino, ${hop}\nADD.AB #${hop}, destino\n${Array.from({length:rounds},()=> 'MOV.I bomba, >destino').join('\n')}\nJMP inicio\norigen DAT.F #0, #${n}\nbomba DAT.F #0, #1\nDAT.F #0, #1\n${Array.from({length:n-(k+8+rounds)},()=> 'DAT.F #0, #0').join('\n')}\nEND inicio`;}
function buildBank(){
 const specs=[];const add=(type,level,description,body,assert='CORESIZE >= 256')=>specs.push({type,level,description,body,assert});
 add('Replicador','Inicial','Una instrucción basta para avanzar por toda la memoria.','ORG inicio\ninicio MOV.I 0, 1\nEND inicio');
 for(const width of [2,3,4])add('Replicador','Inicial',`Una cadena de ${width} instrucciones conserva por delante sus próximas copias.`,`ORG inicio\ninicio ${Array.from({length:width},()=> 'MOV.I 0, '+width).join('\n')}\nEND inicio`);
 add('Defensivo','Inicial','El bucle mínimo para comprender qué significa seguir vivo.','ORG inicio\ninicio JMP.B 0, $0\nEND inicio');
 for(const[mode,offset]of[['<',64],['>',96],['{',128],['}',160],['<',192]])add('Defensivo','Inicial','Mantiene un proceso vivo mientras modifica un puntero remoto. Es defensa, no un bombardero.',`ORG inicio\ninicio JMP.B 0, ${mode}${offset}\nEND inicio`);
 for(const step of [7,13,37,73,121,293,509,1279])add('Bombardero','Intermedio',`Bombardeo con salto ${step} y aritmética que protege la zona de su propio código.`,bounded(step));
 for(const batch of [1,2,3,4,6,8,12,16])add('Barrido','Intermedio',`Lanza ${batch} bombas seguidas antes de comprobar el límite de su franja de ataque.`,sweep(batch,batch%3?1:0));
 for(const[step,batch]of[[1,2],[13,4],[73,6],[293,8],[509,10],[1279,12]])add('Escáner','Avanzado',`Examina la memoria con salto ${step} y responde con una ráfaga de ${batch} bombas.`,scan(step,batch,batch%3));
 for(const step of [4,8,16,20,25,40])add('Bombardero rápido','Avanzado',`Tres instrucciones por ataque. El paso ${step} divide el núcleo y la trayectoria evita sus instrucciones activas.`,stone(step,step*16),`CORESIZE >= 256 && CORESIZE % ${step} == 0`);
 for(const slot of [1,7,31,127])add('Memoria privada','Intermedio',`Ensaya STP y LDP en la posición ${slot} de P-space. Requiere permitir memoria privada en el torneo.`,`ORG inicio\ninicio STP.AB #${slot+1}, #${slot}\nLDP.AB #${slot}, dato\nJMP inicio\ndato DAT.F #0, #0\nEND inicio`,'CORESIZE >= 256 && PSPACESIZE >= 128');
 for(const step of [13,37,73,509])add('Multiproceso','Avanzado','Separa un guardián inmóvil de una rama de bombardeo con puntero acotado.',bounded(step).replace('ORG inicio','ORG entrada\nentrada SPL.B inicio, $0\nJMP.B 0, $0').replace('END inicio','END entrada'));
 // Distributed copies trade the original hunter's waiting phase for a new relocation.
 for(const[k,rounds]of[[2,1],[4,1],[4,2]])add('Replicador de asalto','Avanzado',`Dispersa copias en lotes de ${k} instrucciones con salto 997 y lanza ${rounds} bombas tras cada traslado. Evoluciona el copiado del sabio oscuro y conserva los resultados medidos.`,assault(997,k,rounds));
 add('Replicador de asalto','Avanzado','Dispersa su programa completo con salto 6283. Sustituye la búsqueda del sabio oscuro por nuevas réplicas; apuesta por la supervivencia de sus procesos.',fleet(6283,2));
 const random=E.seededRandom('ogun-forja-autoria-2026');
 if(specs.length!==50)throw new Error('El banco debe contener exactamente 50 guerreros.');
 return specs.map((s,i)=>{const name=names[i],author=random()<.5?'Pascal':'Sara',code=`;redcode-94\n;name ${name}\n;author ${author}\n;strategy ${s.description}\n;assert ${s.assert} ; Reglas necesarias para mantener segura esta estrategia.\n${annotate(s.body)}\n`;return{id:'forja-'+String(i+1).padStart(2,'0'),name,author,type:s.type,level:s.level,description:s.description,collection:'forja',code};});
}
function writeBank(bank){
 const file=path.join(ROOT,'data.js');let data=fs.readFileSync(file,'utf8');const start='// BEGIN FORJA BANK\n',end='// END FORJA BANK\n',section=start+'warriors.push(...'+JSON.stringify(bank,null,2)+');\n'+end;
 if(data.includes(start))data=data.slice(0,data.indexOf(start))+section+data.slice(data.indexOf(end)+end.length);else data=data.replace('const lessons=',section+'const lessons=');fs.writeFileSync(file,data);
 const dir=path.join(ROOT,'warriors','forja');fs.mkdirSync(dir,{recursive:true});for(const w of bank)fs.writeFileSync(path.join(dir,w.id+'.red'),w.code);
}
function verifyBank(bank){
 const ctx=vm.createContext({});vm.runInContext(fs.readFileSync(path.join(ROOT,'data.js'),'utf8'),ctx);const enemy=ctx.OgunData.warriors.find(w=>w.id==='sabioOscuro');
 const base={coreSize:8000,maxCycles:20000,maxProcesses:256,maxLength:300,minDistance:100,pSpaceSize:512,trace:false};
 for(const w of bank){const profiles=[];for(const coreSize of [800,8000]){const cfg={...base,coreSize,maxCycles:500000};const s=E.createSandbox(E.compileWarrior(w.code,cfg),cfg);E.runSteps(s,cfg.maxCycles);if(!s.queues.A.length)throw new Error(w.name+' se autodestruye en '+coreSize+' tras '+s.cycle+' pasos.');profiles.push({coreSize,steps:s.cycle,processes:s.queues.A.length});}
  const candidate=E.compileWarrior(w.code,base),opponent=E.compileWarrior(enemy.code,base),record={wins:0,draws:0,losses:0,games:[]};
  for(let i=0;i<20;i++){const seed='ogun-forja-validacion-v1:'+Math.floor(i/2),firstWarrior=i%2?'B':'A',s=E.createBattle(candidate,opponent,{...base,seed,firstWarrior});E.runSteps(s,base.maxCycles);record[s.winner==='A'?'wins':s.winner==='B'?'losses':'draws']++;record.games.push({seed,firstWarrior,winner:s.winner,turns:s.cycle,positions:s.warriors.map(w=>w.start)});}
  w.validation={version:'forja-1',sourceSha256:crypto.createHash('sha256').update(w.code).digest('hex'),profiles,vsSabio:{wins:record.wins,draws:record.draws,losses:record.losses,total:20},rules:base};w._games=record.games;console.log(w.id,w.name,'vivas',profiles.map(p=>p.processes).join('/'),'sabio',record.wins,record.draws,record.losses);
 }
 return bank;
}
if(require.main===module){const bank=buildBank();if(process.argv.includes('--verify'))verifyBank(bank);const evidence=bank.filter(w=>w.validation).map(({id,name,validation,_games})=>({id,name,...validation,games:_games}));for(const w of bank)delete w._games;writeBank(bank);if(evidence.length)fs.writeFileSync(path.join(ROOT,'warriors','forja-validation.json'),JSON.stringify({version:'forja-1',warriors:evidence},null,2)+'\n');}
module.exports={buildBank,writeBank,verifyBank};
