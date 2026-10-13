const {parentPort}=require('node:worker_threads');
const {createWorkerContext}=require('./worker-context.cjs');
try{
 const worker=createWorkerContext({postMessage:message=>parentPort.postMessage(message)});
 parentPort.postMessage({type:'ready',imports:worker.imports,engine:typeof worker.scope.CoreWarEngine,hasWindow:'window' in worker.scope,hasModule:'module' in worker.scope});
 parentPort.on('message',data=>worker.send(data));
}catch(error){parentPort.postMessage({type:'boot-error',message:error.message});}
