# ASTAR · Buscar de A a G en un grafo no dirigido.
# Cada conexión cuesta 1. Los vecinos se consideran alfabéticamente.
import heapq


def reconstruir(anterior, nodo):
    ruta = []
    while nodo is not None:
        ruta.append(nodo)
        nodo = anterior[nodo]
    return ruta[::-1]


# Pistas hacia G: no exageran lo que falta y son consistentes.
# Si cambias la meta o añades conexiones nuevas, revisa estas pistas.
# Con h = 0 en todos los nodos, A* también funciona, pero sin orientación.
heuristica = {"A":2,"B":3,"C":1,"D":4,"E":3,"F":2,"G":0,"H":1}


def vecinos(grafo, actual):
    # Las letras corresponden a los índices: A=0, B=1, C=2...
    fila = nodos.index(actual)
    resultado = []
    for columna in range(len(nodos)):
        if grafo[fila][columna] == 1:
            resultado.append(nodos[columna])
    return resultado


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
        for vecino in sorted(vecinos(grafo, actual)):
            nuevo_g = g + 1
            if nuevo_g < mejor.get(vecino, float("inf")):
                mejor[vecino] = nuevo_g
                anterior[vecino] = actual
                nuevo_f = nuevo_g + heuristica[vecino]
                heapq.heappush(pendientes, (nuevo_f, nuevo_g, vecino))
    return None


nodos = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

# 1 = hay conexión; 0 = no hay conexión.
# Columnas: A  B  C  D  E  F  G  H
grafo = [
    [0, 1, 1, 0, 0, 0, 0, 0],  # A
    [1, 0, 0, 1, 0, 0, 0, 0],  # B
    [1, 0, 0, 0, 0, 0, 1, 0],  # C
    [0, 1, 0, 0, 1, 0, 0, 0],  # D
    [0, 0, 0, 1, 0, 1, 0, 0],  # E
    [0, 0, 0, 0, 1, 0, 0, 1],  # F
    [0, 0, 1, 0, 0, 0, 0, 1],  # G
    [0, 0, 0, 0, 0, 1, 1, 0]   # H
]

if __name__ == "__main__":
    ruta = buscar(grafo, "A", "G")
    if ruta is None:
        print("No existe una ruta de A a G.")
    else:
        print("Ruta:", " -> ".join(ruta))
        print("Conexiones:", len(ruta) - 1)
