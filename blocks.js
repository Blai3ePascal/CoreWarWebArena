(function(){
'use strict';
const OPS={
 DAT:['Datos / terminar proceso','Guarda dos números. Si un proceso llega aquí, muere. El guerrero solo se autodestruye cuando pierde TODOS sus procesos.','DAT.F #0, #0','data'],
 MOV:['Copiar','Copia desde el origen A al destino B. Con .I copia la instrucción completa; con los demás modificadores copia los campos elegidos. Sirve para avanzar, replicarse o lanzar bombas.','MOV.I $0, $1','memory'],
 ADD:['Sumar','Suma los campos de A a los de B. Los números dan la vuelta al alcanzar el tamaño del núcleo.','ADD.AB #4, $bomba','math'],
 SUB:['Restar','Resta los campos de A a los de B y guarda el resultado en B. La memoria y los valores son circulares.','SUB.AB #1, $contador','math'],
 MUL:['Multiplicar','Multiplica los campos de B por los de A y guarda el resultado en B.','MUL.AB #2, $dato','math'],
 DIV:['Dividir','Divide los campos de B entre los de A con cociente entero. Un divisor cero mata este proceso; otros procesos pueden sobrevivir.','DIV.AB #2, $dato','math'],
 MOD:['Obtener resto','Calcula el resto de B dividido entre A y lo guarda en B. Un divisor cero mata este proceso.','MOD.AB #3, $dato','math'],
 JMP:['Saltar','Continúa en la dirección A en lugar de la siguiente celda. Un salto de 0 repite la misma instrucción. El operando B también se resuelve y puede tener efectos laterales.','JMP.B $inicio, $0','flow'],
 JMZ:['Saltar si cero','Salta a A si los campos de B seleccionados por el modificador son cero; si no, continúa a la siguiente celda.','JMZ.B $inicio, $contador','flow'],
 JMN:['Saltar si no es cero','Salta a A si alguno de los campos de B seleccionados es distinto de cero; si no, continúa.','JMN.B $inicio, $contador','flow'],
 DJN:['Restar uno y saltar','Resta uno a los campos seleccionados de B. Si alguno queda distinto de cero, salta a A. Es útil para repetir una acción un número de veces.','DJN.B $inicio, $contador','flow'],
 CMP:['Comparar iguales (alias de SEQ)','Es exactamente SEQ: salta una instrucción si los campos seleccionados de A y B son iguales. El compilador lo transforma en SEQ.','CMP.I $12, $16','scan'],
 SEQ:['Si son iguales, saltar una celda','Compara A con B. Si coinciden los campos elegidos, continúa dos celdas más adelante; si no, una. Con .I compara toda la instrucción.','SEQ.I $12, $16','scan'],
 SNE:['Si son distintos, saltar una celda','Compara A con B. Si difieren los campos elegidos, omite la siguiente instrucción. Con .I compara toda la instrucción.','SNE.I $12, $16','scan'],
 SLT:['Si es menor, saltar una celda','Omite la siguiente instrucción si los valores de A son menores que los de B en todos los pares de campos elegidos.','SLT.AB #10, $contador','scan'],
 SPL:['Crear otro proceso','Añade un proceso que empezará en A y mantiene la continuación actual. Comparten memoria y se turnan. Al alcanzar el límite no se añade el hijo.','SPL.B $hijo, $0','flow'],
 NOP:['Continuar sin operar','Continúa en la siguiente celda. Aunque no copie ni calcule, resuelve ambos operandos: los modos de incremento y decremento sí cambian memoria.','NOP.F $0, $0','flow'],
 LDP:['Leer memoria privada','Lee una posición de P-space indicada por A y la carga en B. La posición 0 es privada y empieza en CORESIZE − 1, sin resultado previo. STP puede cambiarla. Cada combate comienza con P-space nuevo.','LDP.AB #0, $dato','pspace'],
 STP:['Escribir memoria privada','Guarda un valor de A en una posición de P-space indicada por B. La posición 0 es propia de cada guerrero y STP puede cambiarla durante el combate. Dos guerreros con el mismo PIN comparten las demás posiciones durante ese combate.','STP.AB #7, #1','pspace']
};
const MODES={
 '#':['Número inmediato','Usa el número escrito como valor, en vez de buscar otra celda. En un salto, la dirección inmediata apunta a la propia instrucción.'],
 '$':['Dirección relativa','0 es esta celda, 1 la siguiente, −1 la anterior. No son direcciones absolutas. Se puede omitir el símbolo $.'],
 '@':['Indirecto por B','Ve a la celda indicada por el número y usa su campo B como un segundo desplazamiento, relativo a esa celda.'],
 '*':['Indirecto por A','Ve a la celda indicada por el número y usa su campo A como segundo desplazamiento.'],
 '<':['Decrementar B antes','Resta uno al campo B de la celda puntero ANTES de usarlo como segundo desplazamiento.'],
 '>':['Incrementar B después','Usa el campo B de la celda puntero como segundo desplazamiento; después incrementa ese campo.'],
 '{':['Decrementar A antes','Resta uno al campo A de la celda puntero ANTES de calcular la dirección indirecta.'],
 '}':['Incrementar A después','Usa el campo A de la celda puntero para la dirección indirecta; después lo incrementa.']
};
const MODS={
 '':['Automático','El motor elige el modificador según la instrucción y sus modos. La vista compilada muestra cuál se aplicó.'],
 A:['A → A','Selecciona el campo A del origen y el A del destino.'],
 B:['B → B','Selecciona el campo B del origen y el B del destino.'],
 AB:['A → B','Selecciona el campo A del origen y el B del destino. Ideal para sumar un número inmediato a un puntero B.'],
 BA:['B → A','Selecciona el campo B del origen y el A del destino.'],
 F:['A → A y B → B','Opera con ambos pares de campos, conservando sus posiciones.'],
 X:['A → B y B → A','Cruza los pares de campos.'],
 I:['Instrucción completa','MOV y las comparaciones SEQ/CMP/SNE usan la instrucción completa. En operaciones aritméticas y SLT equivale a .F; los saltos condicionales comprueban ambos campos.']
};
const DIRECTIVES={
 ORG:['Elegir dónde empezar','Indica la etiqueta o el desplazamiento de la primera instrucción que se ejecutará. No ocupa una celda.','inicio'],
 END:['Final del programa','Termina la lectura del programa. Opcionalmente indica su entrada. Las líneas posteriores no se cargan.','inicio'],
 EQU:['Dar nombre a un valor','Asigna una expresión a una constante. Escribe su nombre en Etiqueta, por ejemplo paso EQU 4. No ocupa memoria.','4'],
 FOR:['Repetir al compilar','Repite los bloques interiores antes de cargar el guerrero. Cierra con ROF. La etiqueta opcional es un índice que cuenta desde 1; puede haber bucles anidados. No es un bucle durante la batalla.','4'],
 ROF:['Cerrar repetición','Cierra el FOR anterior. Los bloques interiores se repetirán al compilar.',''],
 PIN:['Identificador de memoria privada','Con el mismo PIN dos guerreros comparten las posiciones no nulas de P-space durante el combate. No es memoria persistente entre partidas.','42'],
 LABEL:['Nombrar una posición','Una etiqueta da nombre a la siguiente instrucción. Puedes usarla en cualquier expresión para evitar contar celdas a mano.','inicio'],
 ASSERT:['Comprobar las reglas','Exige que una condición se cumpla al compilar, por ejemplo CORESIZE == 8000. Si falla, el guerrero no es válido para esas reglas.','CORESIZE == 8000'],
 NAME:['Nombre del guerrero','Este nombre aparecerá en partidas, biblioteca y resultados.','Mi guerrero'],
 AUTHOR:['Autoría','El nombre de la persona que ha escrito el guerrero.',''],
 STRATEGY:['Describir tu estrategia','Una explicación de lo que intenta hacer tu guerrero. Puedes añadir varias.','Avanzar copiando mi instrucción'],
 STANDARD:['Versión de Redcode','Cabecera ;redcode-94. Este taller utiliza las instrucciones que admite el motor de OGUN.','94'],
 COMMENT:['Nota para ti','Un comentario no ocupa memoria y nunca se ejecuta.','Mi siguiente movimiento'],
 RAW:['Línea original','Conserva sin pérdida una línea que no se puede dividir en campos. Puedes corregirla aquí o en Código; la validación dirá si el motor la admite.','']
};
function parse(source){
 if(typeof source!=='string'||source.length>100000)throw new Error('Máximo 100.000 caracteres.');
 return source.replace(/\r\n/g,'\n').split('\n').map((raw)=>{
  const trimmed=raw.trim();let m;
  if(!trimmed)return{kind:'blank',raw};
  if(trimmed.startsWith(';')){
   m=trimmed.match(/^;(name|author|strategy|assert)\b\s*(.*)$/i);
   if(m)return{kind:'directive',op:({name:'NAME',author:'AUTHOR',strategy:'STRATEGY',assert:'ASSERT'})[m[1].toLowerCase()],value:m[2],label:'',raw};
   m=trimmed.match(/^;redcode-(.*)$/i);if(m)return{kind:'directive',op:'STANDARD',value:m[1],label:'',raw};
   return{kind:'directive',op:'COMMENT',value:trimmed.slice(1),label:'',raw};
  }
  const semi=raw.indexOf(';'),code=(semi<0?raw:raw.slice(0,semi)).trim(),comment=semi<0?'':raw.slice(semi);
  const firstOp=code.split(/\s+/)[0].split('.')[0].toUpperCase();
  m=code.match(/^(?:([A-Za-z_]\w*:?)\s+)?([A-Za-z]+)(?:\.([A-Za-z]+))?(?:\s+(.*))?$/);
  if(OPS[firstOp]||['ORG','END','EQU','FOR','ROF','PIN'].includes(firstOp)){const direct=code.match(/^([A-Za-z]+)(?:\.([A-Za-z]+))?(?:\s+(.*))?$/);if(direct)m=[direct[0],'',direct[1],direct[2],direct[3]];}
  if(m){const op=m[2].toUpperCase(),label=(m[1]||'').replace(/:$/,''),mod=(m[3]||'').toUpperCase(),args=m[4]||'';
   if(OPS[op]){
    const pair=args.split(',');if(pair.length>2)return{kind:'raw',op:'RAW',value:raw,raw};
    const operand=s=>{s=s.trim();return MODES[s[0]]?{mode:s[0],value:s.slice(1).trim()}:{mode:op==='DAT'?'#':'$',value:s};};
    const singleDAT=op==='DAT'&&pair.length===1;const a=operand(singleDAT?'0':pair[0]||''),b=operand(singleDAT?pair[0]||'0':pair[1]||'');
    return{kind:'instruction',op,label,mod,aMode:a.mode,a:a.value,bMode:b.mode,b:b.value,hasB:singleDAT||pair.length===2,comment,raw};
   }
   if(['ORG','END','EQU','FOR','ROF','PIN'].includes(op))return{kind:'directive',op,label,value:args,comment,raw};
  }
  if(/^[A-Za-z_]\w*:?$/.test(code))return{kind:'directive',op:'LABEL',value:code.replace(/:$/,''),label:'',comment,raw};
  return{kind:'raw',op:'RAW',value:raw,raw};
 });
}
function line(b){
 if(b.raw!==undefined)return b.raw;
 if(b.kind==='blank')return'';
 const label=b.label?b.label+' ':'';let code;
 if(b.kind==='instruction')code=label+b.op+(b.mod?'.'+b.mod:'')+' '+(b.aMode||'')+(b.a||'0')+(b.hasB===false?'':', '+(b.bMode||'')+(b.b||'0'));
 else if(b.op==='RAW')return b.value||'';
 else if(b.op==='LABEL')code=(b.value||'inicio')+':';
 else if(['NAME','AUTHOR','STRATEGY','ASSERT'].includes(b.op))code=';'+b.op.toLowerCase()+' '+b.value;
 else if(b.op==='STANDARD')code=';redcode-'+b.value;
 else if(b.op==='COMMENT')code=';'+b.value;
 else code=label+b.op+(b.value?' '+b.value:'');
 return code+(b.comment?' '+b.comment:'');
}
function serialize(blocks){return blocks.map(line).join('\n');}
function edit(block,key,value){const out={...block,[key]:value};delete out.raw;if(key==='b'||key==='bMode')out.hasB=true;return out;}
function create(op){if(OPS[op])return{kind:'instruction',op,label:'',mod:op==='MOV'?'I':'',aMode:'$',a:'0',bMode:'$',b:op==='MOV'?'1':'0',hasB:true,comment:''};if(!DIRECTIVES[op])throw new Error('Bloque desconocido');return{kind:op==='RAW'?'raw':'directive',op,label:op==='EQU'?'paso':'',value:DIRECTIVES[op][2],comment:''};}
function span(blocks,index){let end=index+1;if(blocks[index]?.op==='FOR'){let n=1;while(end<blocks.length&&n){if(blocks[end].op==='FOR')n++;if(blocks[end].op==='ROF')n--;end++;}}return end;}
function move(blocks,index,to){if(!Number.isInteger(index)||index<0||index>=blocks.length||!Number.isInteger(to)||to<0||to>blocks.length)return blocks;const end=span(blocks,index);if(to>=index&&to<=end)return blocks;const out=blocks.slice(),part=out.splice(index,end-index);out.splice(to>index?to-part.length:to,0,...part);return out;}
function explanation(block){
 const info=OPS[block.op]||DIRECTIVES[block.op]||DIRECTIVES.RAW;
 let modifier=block.kind==='instruction'?MODS[block.mod||'']:null;
 if(block.mod&&['LDP','STP'].includes(block.op)&&['F','X','I'].includes(block.mod))modifier=['B → B en P-space','En LDP y STP, el motor de OGUN trata .F, .X y .I como .B. Se utiliza el campo B del origen y el B del destino.'];
 if(block.mod&&['JMZ','JMN','DJN'].includes(block.op)){const fields=['A','BA'].includes(block.mod)?'A':['B','AB'].includes(block.mod)?'B':'A y B';modifier=['Comprobar '+fields+' del destino','En este salto condicional, el modificador selecciona el campo '+fields+' de la celda B. La dirección de salto sigue siendo A.'];}
 if(block.mod&&['JMP','SPL','NOP','DAT'].includes(block.op))modifier=['Modificador sin efecto de control','En esta instrucción el modificador no cambia la decisión de continuar, saltar, dividir o terminar. Sigue formando parte de la instrucción almacenada; los modos de ambos operandos sí se resuelven.'];
 return{title:info[0],text:info[1],example:info[2],modes:block.kind==='instruction'?[MODES[block.aMode||(block.op==='DAT'?'#':'$')],MODES[block.bMode||(block.op==='DAT'?'#':'$')]]:[],modifier};
}
const api={OPS,MODES,MODS,DIRECTIVES,parse,line,serialize,edit,create,span,move,explanation};
if(typeof globalThis!=='undefined')globalThis.OgunBlocks=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})();
