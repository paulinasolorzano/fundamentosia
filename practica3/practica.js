'use strict';
const algorithm=document.body.dataset.algorithm;
const $=id=>document.getElementById(id);
const BASE=[[0,0,0,0,0],[0,1,1,1,0],[0,0,0,1,0],[0,1,0,1,0],[0,0,0,0,0]];
let map=BASE.map(r=>r.slice()), start=[0,0], goal=[4,0], frames=[], tick=0, generated='';
const key=p=>p.join(','), equal=(a,b)=>key(a)===key(b);
const moves=[[0,1],[1,0],[0,-1],[-1,0]];
const heuristic=p=>Math.abs(p[0]-goal[0])+Math.abs(p[1]-goal[1]);
function neighbors(p){return moves.map(([r,c])=>[p[0]+r,p[1]+c]).filter(([r,c])=>r>=0&&r<5&&c>=0&&c<5&&!map[r][c]);}
function search(){
 let frontier=[{p:start,g:0,f:heuristic(start)}], discovered=new Set([key(start)]), best={[key(start)]:0}, parent={[key(start)]:null}, reviewed=[];
 const result=[];
 function snap(active,path,text){result.push({frontier:frontier.map(x=>({...x,p:x.p.slice()})),reviewed:reviewed.slice(),active:active?.p,path,text});}
 snap(null,[],'A espera para comenzar la búsqueda.');
 while(frontier.length){
  if(algorithm==='astar')frontier.sort((a,b)=>a.f-b.f||a.g-b.g||a.p[0]-b.p[0]||a.p[1]-b.p[1]);
  const actual=algorithm==='dfs'?frontier.pop():frontier.shift();
  if(algorithm==='astar'&&actual.g!==best[key(actual.p)])continue;
  reviewed.push(key(actual.p));
  if(equal(actual.p,goal)){
   const path=[];let p=actual.p;while(p!==null){path.push(p);p=parent[key(p)];}path.reverse();
   snap(actual,path,`Meta encontrada: ${path.length-1} movimientos. La ruta es la secuencia verde oscura.`);return result;
  }
  let ns=neighbors(actual.p);if(algorithm==='dfs')ns=ns.slice().reverse();
  for(const p of ns){const k=key(p),g=actual.g+1;
   if(algorithm==='astar'?g>=(best[k]??Infinity):discovered.has(k))continue;
   discovered.add(k);best[k]=g;parent[k]=actual.p;frontier.push({p,g,f:g+heuristic(p)});
  }
  if(algorithm==='astar')frontier.sort((a,b)=>a.f-b.f||a.g-b.g||a.p[0]-b.p[0]||a.p[1]-b.p[1]);
  snap(actual,[],`Se revisa (${actual.p.join(', ')}). ${algorithm==='dfs'?'Se continúa con la última opción guardada.':algorithm==='bfs'?'Se agregan vecinos nuevos al final de la cola.':'Se comparan las prioridades de todas las opciones pendientes.'}`);
 }
 snap(null,[],'No existe una ruta: se agotaron las opciones.');return result;
}
function render(){
 const s=frames[tick];$('grid').innerHTML=map.map((row,r)=>row.map((wall,c)=>{
  const p=[r,c],endpoint=equal(p,start)?'A':equal(p,goal)?'B':'',route=s.path.some(q=>equal(q,p)),active=s.active&&equal(s.active,p),seen=s.reviewed.includes(key(p)),pending=s.frontier.some(x=>equal(x.p,p));
  const state=wall?'pared':route?'ruta':seen?'revisada':pending?'pendiente':'libre';
  return `<button class="cell ${wall?'wall':route?'route':seen?'seen':pending?'pending':''} ${active?'active':''}" data-row="${r}" data-col="${c}" aria-label="Fila ${r}, columna ${c}: ${endpoint||state}" ${endpoint?'disabled':''}>${endpoint||(wall?'×':route?'●':seen?'✓':pending?'?':'·')}</button>`;
 }).join('')).join('');
 $('status').textContent=`Paso ${tick} de ${frames.length-1}. ${s.text}`;
 $('metrics').textContent=`Revisadas: ${s.reviewed.length} · Pendientes: ${s.frontier.length}`;
 const ordered=algorithm==='dfs'?s.frontier.slice().reverse():s.frontier;
 $('pending').textContent=ordered.length?ordered.map((x,i)=>`${i===0?'Sigue → ':''}(${x.p.join(', ')})${algorithm==='astar'?` [g=${x.g}, h=${heuristic(x.p)}, f=${x.f}]`:''}`).join(' · '):'Sin opciones pendientes.';
 $('back').disabled=tick===0;$('next').disabled=tick===frames.length-1;$('finish').disabled=tick===frames.length-1;
}
function rebuild(){frames=search();tick=0;render();generated='';$('code').textContent='Pulsa «Generar código» para crear el programa con este mapa.';$('codeStatus').textContent='';}
$('grid').addEventListener('click',e=>{const b=e.target.closest('button[data-row]');if(!b||b.disabled)return;const r=+b.dataset.row,c=+b.dataset.col;map[r][c]=1-map[r][c];rebuild();});
$('scenario').onchange=()=>{map=BASE.map(r=>r.slice());goal=[4,0];if($('scenario').value==='trapped'){map[0][1]=1;map[1][0]=1;}if($('scenario').value==='detour'){map=Array.from({length:5},(_,r)=>[0,r<4?1:0,0,0,0]);goal=[0,4];}rebuild();};
$('next').onclick=()=>{tick=Math.min(tick+1,frames.length-1);render();};$('back').onclick=()=>{tick=Math.max(0,tick-1);render();};$('finish').onclick=()=>{tick=frames.length-1;render();};$('reset').onclick=()=>{tick=0;render();};
function pythonCode(){
 const common=`def vecinos(mapa, posicion):
    fila, columna = posicion
    # Orden: derecha, abajo, izquierda, arriba.
    for df, dc in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
        nf, nc = fila + df, columna + dc
        if 0 <= nf < len(mapa) and 0 <= nc < len(mapa[0]):
            if mapa[nf][nc] == 0:
                yield (nf, nc)


def reconstruir(anterior, actual):
    ruta = []
    while actual is not None:
        ruta.append(actual)
        actual = anterior[actual]
    return ruta[::-1]


`;
 let head,searchCode;
 if(algorithm==='astar'){
 head='import heapq\n\n\n';
 searchCode=`def buscar(mapa, inicio, meta):
    def h(posicion):
        return abs(posicion[0] - meta[0]) + abs(posicion[1] - meta[1])

    pendientes = [(h(inicio), 0, inicio)]
    mejor = {inicio: 0}
    anterior = {inicio: None}
    while pendientes:
        f, g, actual = heapq.heappop(pendientes)
        if g != mejor[actual]:
            continue  # Descartar una propuesta que ya fue mejorada.
        if actual == meta:
            return reconstruir(anterior, actual)
        for vecino in vecinos(mapa, actual):
            nuevo_g = g + 1
            if nuevo_g < mejor.get(vecino, float("inf")):
                mejor[vecino] = nuevo_g
                anterior[vecino] = actual
                heapq.heappush(pendientes, (nuevo_g + h(vecino), nuevo_g, vecino))
    return None
`;
 }else{
 const bfs=algorithm==='bfs';head=bfs?'from collections import deque\n\n\n':'';
 searchCode=`def buscar(mapa, inicio, meta):
    pendientes = ${bfs?'deque([inicio])':'[inicio]'}
    descubiertos = {inicio}
    anterior = {inicio: None}
    while pendientes:
        actual = pendientes.${bfs?'popleft()':'pop()'}
        if actual == meta:
            return reconstruir(anterior, actual)
        opciones = list(vecinos(mapa, actual))
        for vecino in ${bfs?'opciones':'reversed(opciones)'}:
            if vecino not in descubiertos:
                descubiertos.add(vecino)
                anterior[vecino] = actual
                pendientes.append(vecino)
    return None
`;
 }
 return `# Práctica ${algorithm.toUpperCase()} · Mapa generado desde la página.
# 0: libre; 1: pared. Cuatro direcciones, costo 1 por movimiento.
# Coordenadas: (fila, columna). Mapa rectangular con inicio y meta libres.
${head}${common}${searchCode}

mapa = [
${map.map(r=>'    ['+r.join(', ')+']').join(',\n')}
]
inicio = (${start.join(', ')})
meta = (${goal.join(', ')})

if __name__ == "__main__":
    ruta = buscar(mapa, inicio, meta)
    if ruta is None:
        print("No existe una ruta.")
    else:
        print("Ruta:", ruta)
        print("Movimientos:", len(ruta) - 1)
`;
}
function generate(){generated=pythonCode();$('code').textContent=generated;$('codeStatus').textContent='Programa actualizado con tu mapa actual.';return generated;}
function save(text,name){const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('generate').onclick=generate;$('download').onclick=()=>save(generated||generate(),`${algorithm}_practica.py`);
$('copy').onclick=async()=>{const text=generated||generate();try{await navigator.clipboard.writeText(text);$('codeStatus').textContent='Código copiado.';}catch{$('codeStatus').textContent='Selecciona el código para copiarlo o utiliza «Descargar .py».';}};
for(const id of ['answer1','answer2','answer3']){try{$(id).value=localStorage.getItem(`${algorithm}-${id}`)||'';}catch{}$(id).addEventListener('input',()=>{try{localStorage.setItem(`${algorithm}-${id}`,$(id).value);}catch{}});}
$('notes').onclick=()=>save(`${algorithm.toUpperCase()} · Mis respuestas\n\n`+['answer1','answer2','answer3'].map((id,i)=>`${i+1}. ${$(id).value}`).join('\n\n'),`${algorithm}_respuestas.txt`);
rebuild();
