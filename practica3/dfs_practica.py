# DFS · Buscar de A a G en un grafo no dirigido.
# Cada conexión cuesta 1. Los vecinos se consideran alfabéticamente.
def reconstruir(anterior, nodo):
    ruta = []
    while nodo is not None:
        ruta.append(nodo)
        nodo = anterior[nodo]
    return ruta[::-1]


def buscar(grafo, inicio, meta):
    pendientes = [inicio]
    descubiertos = {inicio}
    anterior = {inicio: None}
    while pendientes:
        actual = pendientes.pop()
        if actual == meta:
            return reconstruir(anterior, actual)
        # Apilar al revés permite explorar primero la letra menor.
        for vecino in sorted(grafo[actual], reverse=True):
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
        "D"
    ],
    "C": [
        "A",
        "G"
    ],
    "D": [
        "B",
        "E"
    ],
    "E": [
        "D",
        "F"
    ],
    "F": [
        "E",
        "H"
    ],
    "G": [
        "C",
        "H"
    ],
    "H": [
        "F",
        "G"
    ]
}

if __name__ == "__main__":
    ruta = buscar(grafo, "A", "G")
    if ruta is None:
        print("No existe una ruta de A a G.")
    else:
        print("Ruta:", " -> ".join(ruta))
        print("Conexiones:", len(ruta) - 1)
