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
heuristica = {"A":2,"B":3,"C":1,"D":3,"E":2,"F":1,"G":0,"H":4}


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


grafo = {
    "A": [
        "B",
        "C"
    ],
    "B": [
        "A",
        "D",
        "H"
    ],
    "C": [
        "A",
        "G"
    ],
    "D": [
        "B",
        "E",
        "H"
    ],
    "E": [
        "D",
        "F"
    ],
    "F": [
        "E",
        "G"
    ],
    "G": [
        "C",
        "F"
    ],
    "H": [
        "B",
        "D"
    ]
}

if __name__ == "__main__":
    ruta = buscar(grafo, "A", "G")
    if ruta is None:
        print("No existe una ruta de A a G.")
    else:
        print("Ruta:", " -> ".join(ruta))
        print("Conexiones:", len(ruta) - 1)
