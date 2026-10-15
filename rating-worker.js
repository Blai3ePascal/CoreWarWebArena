'use strict';
importScripts('engine.js?v=1.3.0','data.js?v=1.3.0','rating.js?v=1.3.0');
self.onmessage=function(event){const {id,source,custom=[]}=event.data||{};try{
 const rivals=[...OgunData.warriors,...custom];
 const result=OgunRating.evaluate(source,rivals,progress=>self.postMessage({type:'progress',id,...progress}));
 self.postMessage({type:'complete',id,result});
}catch(error){self.postMessage({type:'error',id,error:error.message});}};
