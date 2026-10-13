const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../..');
function createWorkerContext({postMessage,readScript}={}){
 const imports=[],messages=[],scope=vm.createContext({});
 scope.self=scope;
 scope.postMessage=message=>{const copy=structuredClone(message);messages.push(copy);postMessage?.(copy);};
 scope.importScripts=(...urls)=>{
  for(const url of urls){
   const resolved=new URL(url,'https://test.invalid/CoreWarWebArena/worker.js');
   const filename=path.basename(resolved.pathname);
   imports.push(url);
   const code=readScript?readScript(filename):fs.readFileSync(path.join(root,filename),'utf8');
   vm.runInContext(code,scope,{filename:resolved.href});
  }
 };
 vm.runInContext(fs.readFileSync(path.join(root,'worker.js'),'utf8'),scope,{filename:'worker.js'});
 return{scope,imports,messages,send(data){scope.onmessage({data:structuredClone(data)});return messages.at(-1);}};
}
module.exports={createWorkerContext,root};
