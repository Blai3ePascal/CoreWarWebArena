(function(){
'use strict';
const DEFAULTS={theme:'dark',size:16,reduced:false,contrast:false,a:'#b4f05a',b:'#b299ff',speed:200,coreShape:'square',coreWidth:640,cellShape:'square',cellGap:1,emptyColor:'#1c2832',coreMotion:true,trails:true,trailLength:200,showProcesses:true,arenaFx:true,tournamentFx:'final',resultStyle:'orbit',resultDuration:3500,resultSize:40,resultOpacity:75,resultIntensity:45,resultParticles:16,resultGlow:45,winA:'#b4f05a',winB:'#b299ff',drawColor:'#e7c86e',background:'grid',backgroundOpacity:5,backgroundSpeed:60};
function sanitize(raw={}){if(!raw||typeof raw!=='object')raw={};const p={...DEFAULTS};for(const k of ['reduced','contrast','coreMotion','trails','showProcesses','arenaFx'])if(typeof raw[k]==='boolean')p[k]=raw[k];
 for(const[k,values]of Object.entries({theme:['dark','violet','light'],coreShape:['square','wide'],cellShape:['square','circle','rounded'],tournamentFx:['off','final','duels','games'],resultStyle:['orbit','pulse','slide','still'],background:['off','grid','orbits']}))if(values.includes(raw[k]))p[k]=raw[k];
 for(const[k,min,max]of [['size',16,22],['coreWidth',300,1000],['cellGap',0,4],['trailLength',20,1000],['resultDuration',0,15000],['resultSize',24,72],['resultOpacity',10,95],['resultIntensity',0,100],['resultParticles',0,60],['resultGlow',0,100],['backgroundOpacity',0,15],['backgroundSpeed',15,180]])if(Number.isFinite(+raw[k])&&+raw[k]>=min&&+raw[k]<=max)p[k]=+raw[k];
 if([20,200,2000,10000].includes(+raw.speed))p.speed=+raw.speed;
 for(const k of ['a','b','emptyColor','winA','winB','drawColor'])if(/^#[a-f\d]{6}$/i.test(raw[k]||''))p[k]=raw[k];return p;
}
function read(name,fallback){try{const item=document.cookie.split(';').map(s=>s.trim()).find(s=>s.startsWith(name+'='));return item?JSON.parse(decodeURIComponent(item.slice(name.length+1))):fallback;}catch{return fallback;}}
function write(name,value){try{const encoded=encodeURIComponent(JSON.stringify(value));if(encoded.length>3600)throw new Error('Preferencias demasiado grandes');const pathname=location.pathname||'/',scope=pathname.endsWith('/')?pathname:pathname.slice(0,pathname.lastIndexOf('/')+1);document.cookie=`${name}=${encoded}; Path=${scope}; SameSite=Lax${location.protocol==='https:'?'; Secure':''}`;return document.cookie.split(';').some(s=>s.trim().startsWith(name+'='));}catch{return false;}}
function geometry(n,shape='square'){if(shape==='square'){const cols=Math.ceil(Math.sqrt(n));return{cols,rows:cols,width:720,height:720};}return{cols:64,rows:Math.ceil(n/64),width:960,height:350};}
globalThis.OgunSession={DEFAULTS,sanitize,read,write,geometry};if(typeof module!=='undefined')module.exports=globalThis.OgunSession;
})();
