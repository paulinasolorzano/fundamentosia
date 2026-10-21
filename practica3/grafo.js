'use strict';
const algorithm=document.body.dataset.algorithm, $=id=>document.getElementById(id);
const positions={A:[70,205],B:[195,80],C:[195,330],D:[325,80],E:[455,80],F:[585,160],G:[585,330],H:[585,245]};
const allEdges=[['A','B'],['A','C'],['B','D'],['D','E'],['E','F'],['F','H'],['H','G'],['C','G']];
const hints={A:2,B:3,C:1,D:4,E:3,F:2,G:0,H:1};
let enabled=allEdges.map(()=>true),frames=[],tick=0,generated='',view='grid';
const cells={A:[0,0],B:[0,1],D:[0,2],C:[1,0],E:[1,2],G:[2,0],H:[2,1],F:[2,2]};
function graphData(){const g=Object.fromEntries(Object.keys(positions).map(n=>[n,[]]));allEdges.forEach(([a,b],i)=>{if(enabled[i]){g[a].push(b);g[b].push(a);}});for(const ns of Object.values(g))ns.sort();return g;}
const cmp=(a,b)=>a.f-b.f||a.g-b.g||a.node.localeCompare(b.node);
function search(){
 const graph=graphData(),result=[],parent={A:null},best={A:0},discovered=new Set(['A']),reviewed=[];
 let frontier=[{node:'A',g:0,f:hints.A}];
 function snap(actual,path,text){result.push({frontier:frontier.map(x=>({...x})),reviewed:[...reviewed],parent:{...parent},actual,path,text});}
 snap(null,[],'El nodo A está pendiente. Todavía no se ha revisado ningún nodo.');
 while(frontier.length){
  if(algorithm==='astar')frontier.sort(cmp);
  const current=algorithm==='dfs'?frontier.pop():frontier.shift();
  const {node,g}=current;
  if(algorithm==='astar'&&g!==best[node])continue;
  reviewed.push(node);
  if(node==='G'){const path=[];let n=node;while(n!==null){path.push(n);n=parent[n];}path.reverse();snap(node,path,`Meta encontrada. Ruta: ${path.join(' → ')}. Costo: ${path.length-1} conexiones.`);return result;}
  let ns=[...graph[node]];if(algorithm==='dfs')ns.reverse();const added=[];
  for(const next of ns){const cost=g+1;if(algorithm==='astar'?cost>=(best[next]??Infinity):discovered.has(next))continue;
   discovered.add(next);best[next]=cost;parent[next]=node;frontier.push({node:next,g:cost,f:cost+hints[next]});added.push(next);
  }
  if(algorithm==='astar')frontier.sort(cmp);
  snap(node,[],`Se revisa ${node}. ${added.length?'Se guardan '+added.join(', ')+'.':'No hay vecinos nuevos que guardar.'} ${algorithm==='dfs'?'La última opción guardada se revisa primero.':algorithm==='bfs'?'Los nuevos vecinos esperan al final de la cola.':'La próxima elección usa el menor f entre todas las pendientes.'}`);
 }
 snap(null,[],'No existe una ruta hasta G: se agotaron las opciones pendientes.');return result;
}
function drawGraph(s){
 const edges=allEdges.map(([a,b],i)=>{const [x1,y1]=positions[a],[x2,y2]=positions[b];const route=s.path.some((n,j)=>j&&((s.path[j-1]===a&&n===b)||(s.path[j-1]===b&&n===a)));return `<line class="edge ${enabled[i]?'':'off'} ${route?'onroute':''}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>${enabled[i]?`<text class="edge-cost" x="${(x1+x2)/2}" y="${(y1+y2)/2-10}">1</text>`:''}`;}).join('');
 const nodes=Object.entries(positions).map(([n,[x,y]])=>{const state=s.path.includes(n)?'route':s.reviewed.includes(n)?'seen':s.frontier.some(v=>v.node===n)?'pending':'';return `<g class="node ${state} ${s.actual===n?'active':''}" aria-label="Nodo ${n}${n==='A'?', inicio':n==='G'?', meta':''}"><circle cx="${x}" cy="${y}" r="25"/><text x="${x}" y="${y+7}">${n}</text></g><text class="caption" x="${x}" y="${y+48}">${n==='A'?'Inicio':n==='G'?'Meta':algorithm==='astar'?'h = '+hints[n]:''}</text>${algorithm==='astar'&&(n==='A'||n==='G')?`<text class="caption" x="${x}" y="${y+67}">h = ${hints[n]}</text>`:''}`;}).join('');
 $('graph').innerHTML=`<svg class="graph" viewBox="0 0 660 425" role="img" aria-label="Grafo de ocho nodos. A es el inicio y G la meta. Conexiones activas: ${allEdges.filter((_,i)=>enabled[i]).map(e=>e.join(' con ')).join('; ')}"><title>Grafo de búsqueda de A a G</title>${edges}${nodes}</svg>`;
}
function drawGrid(s){
 const size=105,ox=42,oy=38;
 let content='<rect x="42" y="38" width="315" height="315" rx="8" fill="#dce3df"/>';
 for(let r=0;r<3;r++)for(let c=0;c<3;c++){
  const name=Object.keys(cells).find(n=>cells[n][0]===r&&cells[n][1]===c),x=ox+c*size,y=oy+r*size;
  if(!name){content+=`<rect x="${x+3}" y="${y+3}" width="99" height="99" fill="#203d43"/><text x="${x+52}" y="${y+57}" fill="white" text-anchor="middle" font-size="15">Pared</text>`;continue;}
  const route=s.path.includes(name),seen=s.reviewed.includes(name),pending=s.frontier.some(n=>n.node===name);
  const color=route?'#126b61':seen?'#dce8e0':pending?'#f4d899':'#fff';
  content+=`<rect x="${x+3}" y="${y+3}" width="99" height="99" rx="5" fill="${color}" stroke="${s.actual===name?'#bd7932':'#c1d0c9'}" stroke-width="${s.actual===name?5:1}"/><text x="${x+52}" y="${y+49}" text-anchor="middle" font-size="26" fill="${route?'white':'#203d43'}">${name}</text><text x="${x+52}" y="${y+75}" text-anchor="middle" font-size="13" fill="${route?'white':'#203d43'}">${name==='A'?'Inicio':name==='G'?'Meta':algorithm==='astar'?'h = '+hints[name]:''}</text>`;
 }
 allEdges.forEach(([a,b],i)=>{
  const [r,c]=cells[a],[r2,c2]=cells[b];const x1=ox+c*size+52,y1=oy+r*size+52,x2=ox+c2*size+52,y2=oy+r2*size+52;
  if(!enabled[i]){const x=(x1+x2)/2,y=(y1+y2)/2;content+=`<line x1="${x-(r===r2?0:38)}" y1="${y-(r===r2?38:0)}" x2="${x+(r===r2?0:38)}" y2="${y+(r===r2?38:0)}" stroke="#203d43" stroke-width="9"/>`;}
  else if(s.path.some((n,j)=>j&&((s.path[j-1]===a&&n===b)||(s.path[j-1]===b&&n===a))))content+=`<line x1="${x1+(x2-x1)*.3}" y1="${y1+(y2-y1)*.3}" x2="${x2-(x2-x1)*.3}" y2="${y2-(y2-y1)*.3}" stroke="#a8d7c3" stroke-width="5"/>`;
 });
 $('graph').innerHTML=`<svg viewBox="0 0 400 395" role="img" aria-label="Cuadrícula con ocho casillas libres y pared central. A es inicio y G es meta. Solo movimientos horizontales y verticales." style="width:100%;display:block"><title>El mismo problema visto como cuadrícula</title>${content}</svg>`;
}
function draw(s){if(view==='grid')drawGrid(s);else drawGraph(s);$('viewGrid').setAttribute('aria-pressed',String(view==='grid'));$('viewGraph').setAttribute('aria-pressed',String(view==='graph'));}
$('viewGrid').onclick=()=>{view='grid';render();};
$('viewGraph').onclick=()=>{view='graph';render();};
function render(){const s=frames[tick];draw(s);$('status').textContent=`Paso ${tick} de ${frames.length-1}. ${s.text}`;$('metrics').textContent=`Nodos revisados: ${s.reviewed.length} · Pendientes: ${s.frontier.length}`;
 $('structure').textContent=algorithm==='bfs'?'Cola: el primero que entra es el primero que sale.':algorithm==='dfs'?'Pila: la última opción guardada sale primero. Se muestra primero el tope.':'Prioridad: menor f = g + h. Se muestra primero el menor.';
 const ordered=algorithm==='dfs'?[...s.frontier].reverse():s.frontier;
 $('pending').innerHTML=ordered.length?ordered.map((v,i)=>`<span class="token">${i===0?'Sigue: ':''}${v.node}</span>`).join(''):'Sin opciones pendientes.';
 $('priority').innerHTML=algorithm==='astar'?'<table class="pending-table"><tr><th>Nodo</th><th>g</th><th>h</th><th>f</th></tr>'+ordered.map(v=>`<tr><td>${v.node}</td><td>${v.g}</td><td>${hints[v.node]}</td><td>${v.f}</td></tr>`).join('')+'</table>':'';
 $('reviewed').textContent=s.reviewed.join(' → ')||'Ninguno todavía.';
 $('parents').textContent=Object.entries(s.parent).map(([n,p])=>p===null?`${n}: inicio`:`${p} → ${n}`).join('\n');
 $('back').disabled=tick===0;$('next').disabled=tick===frames.length-1;$('finish').disabled=tick===frames.length-1;
}
function rebuild(){frames=search();tick=0;render();generated='';$('code').textContent='Pulsa «Generar código» para crear el programa con las conexiones actuales.';$('codeStatus').textContent='';$('adjacency').textContent=JSON.stringify(graphData(),null,2);$('edges').innerHTML=allEdges.map(([a,b],i)=>`<button data-edge="${i}" aria-pressed="${enabled[i]}" aria-label="Conexión ${a} con ${b}: ${enabled[i]?'abierta':'cerrada'}">${a}—${b}</button>`).join('');}
$('edges').addEventListener('click',e=>{const b=e.target.closest('button[data-edge]');if(!b)return;enabled[+b.dataset.edge]=!enabled[+b.dataset.edge];rebuild();});
$('scenario').onchange=()=>{enabled=allEdges.map(([a,b])=>$('scenario').value==='trapped'?![a,b].includes('G'):$('scenario').value==='detour'?!(a==='C'&&b==='G'):true);rebuild();};
$('next').onclick=()=>{tick=Math.min(tick+1,frames.length-1);render();};$('back').onclick=()=>{tick=Math.max(tick-1,0);render();};$('finish').onclick=()=>{tick=frames.length-1;render();};$('reset').onclick=()=>{tick=0;render();};
function pythonCode(){
 const data='grafo = '+JSON.stringify(graphData(),null,4)+'\n';
 const common=`def reconstruir(anterior, nodo):
    ruta = []
    while nodo is not None:
        ruta.append(nodo)
        nodo = anterior[nodo]
    return ruta[::-1]


`;
 let head='',code='';
 if(algorithm==='astar'){
 head='import heapq\n\n\n';
 code=`# Pistas hacia G: no exageran lo que falta y son consistentes.
# Si cambias la meta o añades conexiones nuevas, revisa estas pistas.
# Con h = 0 en todos los nodos, A* también funciona, pero sin orientación.
heuristica = ${JSON.stringify(hints)}


def buscar(grafo, inicio, meta):
    pendientes = [(heuristica[inicio], 0, inicio)]
    mejor = {inicio: 0}
    anterior = {inicio: None}
    while pendientes:
        f, g, actual = heapq.heappop(pendientes)
        if g != mejor[actual]:
            continue  # Ya encontramos una propuesta mejor para ese nodo.
        if actual == meta:
            return reconstruir(anterior, actual)
        for vecino in sorted(grafo[actual]):
            nuevo_g = g + 1
            if nuevo_g < mejor.get(vecino, float("inf")):
                mejor[vecino] = nuevo_g
                anterior[vecino] = actual
                nuevo_f = nuevo_g + heuristica[vecino]
                heapq.heappush(pendientes, (nuevo_f, nuevo_g, vecino))
    return None
`;
 }else{
 const bfs=algorithm==='bfs';head=bfs?'from collections import deque\n\n\n':'';
 code=`def buscar(grafo, inicio, meta):
    pendientes = ${bfs?'deque([inicio])':'[inicio]'}
    descubiertos = {inicio}
    anterior = {inicio: None}
    while pendientes:
        actual = pendientes.${bfs?'popleft()':'pop()'}
        if actual == meta:
            return reconstruir(anterior, actual)
        # ${bfs?'Vecinos en orden alfabético.':'Apilar al revés permite explorar primero la letra menor.'}
        for vecino in sorted(grafo[actual]${bfs?'':', reverse=True'}):
            if vecino not in descubiertos:
                descubiertos.add(vecino)
                anterior[vecino] = actual
                pendientes.append(vecino)
    return None
`;
 }
 return `# ${algorithm.toUpperCase()} · Buscar de A a G en un grafo no dirigido.
# Cada conexión cuesta 1. Los vecinos se consideran alfabéticamente.
${head}${common}${code}\n\n${data}
if __name__ == "__main__":
    ruta = buscar(grafo, "A", "G")
    if ruta is None:
        print("No existe una ruta de A a G.")
    else:
        print("Ruta:", " -> ".join(ruta))
        print("Conexiones:", len(ruta) - 1)
`;
}
function generate(){generated=pythonCode();$('code').textContent=generated;$('codeStatus').textContent='Código actualizado con las conexiones actuales.';return generated;}
function save(text,name){const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('generate').onclick=generate;$('download').onclick=()=>save(generated||generate(),`${algorithm}_practica.py`);
$('copy').onclick=async()=>{try{await navigator.clipboard.writeText(generated||generate());$('codeStatus').textContent='Código copiado.';}catch{$('codeStatus').textContent='Puedes seleccionar el código para copiarlo o descargar el archivo .py.';}};
for(const id of ['answer1','answer2','answer3']){try{$(id).value=localStorage.getItem(`grafos-${algorithm}-${id}`)||'';}catch{}$(id).addEventListener('input',()=>{try{localStorage.setItem(`grafos-${algorithm}-${id}`,$(id).value);}catch{}});}
$('notes').onclick=()=>save(`${algorithm.toUpperCase()} · Práctica con grafos\n\n`+['answer1','answer2','answer3'].map((id,i)=>`${i+1}. ${$(id).value}`).join('\n\n'),`${algorithm}_respuestas.txt`);
rebuild();
