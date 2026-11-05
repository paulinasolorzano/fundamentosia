/* Funciones puras compartidas por la interfaz y las verificaciones. */
(function(root){
const paisajes={cimas:[1,4,7,6,3,5,9,8],meseta:[1,4,7,7,7,6,9,8]};
function rng(seed){let s=seed>>>0;return ()=>{s=(1664525*s+1013904223)>>>0;return s/4294967296;};}
function vecinos(x,n){return [x-1,x+1].filter(v=>v>=0&&v<n);}
function landscape(mode,values,start,T=4,alpha=.95,seed=42,limit=120){
 let x=start,best=x,t=T,random=rng(seed),states=[{x,best,t,step:0,reason:'Solución inicial. Todavía no se ha propuesto ningún cambio.'}];
 for(let i=1;i<=limit;i++){
  let ns=vecinos(x,values.length),candidate=mode==='hc'?ns.reduce((a,b)=>values[b]>values[a]?b:a):ns[Math.floor(random()*ns.length)];
  let from=x,delta=values[candidate]-values[x],p=delta>=0?1:Math.exp(delta/t),u=mode==='sa'&&delta<0?random():null;
  let accepted=mode==='hc'?delta>0:delta>=0||u<p;
  if(accepted)x=candidate;
  if(values[x]>values[best])best=x;
  let done=mode==='hc'?!accepted:(t*alpha<.05||i===limit);
  let reason=mode==='hc'?(accepted?'Se acepta: es el mejor vecino y mejora estrictamente.':'Se detiene: ningún vecino mejora. Los empates tampoco se aceptan.'):(delta>=0?'Se acepta porque mejora o empata.':`${accepted?'Se acepta':'Se rechaza'} el retroceso: u = ${u.toFixed(3)} ${accepted?'<':'≥'} p = ${p.toFixed(3)}.`);
  states.push({step:i,from,candidate,x,best,t,delta,p,u,accepted,done,reason,neighbors:ns});
  if(done)break;
  if(mode==='sa')t*=alpha;
 }
 return states;
}
const points=[[0,0],[2,5],[5,6],[8,4],[7,1],[3,1]];
const names=['Almacén','A','B','C','D','E'];
function distance(route){let r=[0,...route,0];return r.slice(1).reduce((s,p,i)=>s+Math.hypot(points[p][0]-points[r[i]][0],points[p][1]-points[r[i]][1]),0);}
function swap(r,i,j){let n=[...r];[n[i],n[j]]=[n[j],n[i]];return n;}
function routeSearch(mode,initial,seed=42,T=4,alpha=.98,limit=300){let r=[...initial],best=[...r],t=T,random=rng(seed),history=[];
 for(let step=1;step<=limit;step++){
  let n,i,j;
  if(mode==='hc'){n=r;for(i=0;i<r.length;i++)for(j=i+1;j<r.length;j++){let q=swap(r,i,j);if(distance(q)<distance(n)-1e-10)n=q;}}
  else{i=Math.floor(random()*r.length);j=Math.floor(random()*(r.length-1));if(j>=i)j++;n=swap(r,i,j);}
  let old=distance(r),cost=distance(n),delta=cost-old,p=delta<=0?1:Math.exp(-delta/t),u=mode==='sa'&&delta>0?random():null;
  let accepted=mode==='hc'?delta< -1e-10:delta<=0||u<p;
  if(accepted)r=[...n];if(distance(r)<distance(best))best=[...r];
  history.push({step,from:old,candidate:cost,cost:distance(r),best:distance(best),accepted,t,delta});
  if(mode==='hc'&&!accepted||mode==='sa'&&t*alpha<.05)break;
  t*=alpha;
 }
 return {route:best,cost:distance(best),current:r,history};
}
const api={paisajes,rng,vecinos,landscape,points,names,distance,routeSearch};root.SearchLab=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
