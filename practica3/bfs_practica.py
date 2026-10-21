# BFS · Buscar de A a G en un grafo no dirigido.
# Cada conexión cuesta 1. Los vecinos se consideran alfabéticamente.
from collections import deque


def reconstruir(anterior, nodo):
    ruta = []
    while nodo is not None:
        ruta.append(nodo)
        nodo = anterior[nodo]
    return ruta[::-1]


def buscar(grafo, inicio, meta):
    pendientes = deque([inicio])
    descubiertos = {inicio}
    anterior = {inicio: None}
    while pendientes:
        actual = pendientes.popleft()
        if actual == meta:
            return reconstruir(anterior, actual)
        # Vecinos en orden alfabético.
        for vecino in sorted(grafo[actual]):
            if vecino not in descubiertos:
                descubiertos.add(vecino)
                anterior[vecino] = actual
                pendientes.append(vecino)
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
