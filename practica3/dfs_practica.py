# DFS · Buscar de A a G en un grafo no dirigido.
# Cada conexión cuesta 1. Los vecinos se consideran alfabéticamente.
def reconstruir(anterior, nodo):
    ruta = []
    while nodo is not None:
        ruta.append(nodo)
        nodo = anterior[nodo]
    return ruta[::-1]


def vecinos(grafo, actual):
    # Las letras corresponden a los índices: A=0, B=1, C=2...
    fila = nodos.index(actual)
    resultado = []
    for columna in range(len(nodos)):
        if grafo[fila][columna] == 1:
            resultado.append(nodos[columna])
    return resultado


def buscar(grafo, inicio, meta):
    pendientes = [inicio]
    descubiertos = {inicio}
    anterior = {inicio: None}
    while pendientes:
        actual = pendientes.pop()
        if actual == meta:
            return reconstruir(anterior, actual)
        # Apilar al revés permite explorar primero la letra menor.
        for vecino in sorted(vecinos(grafo, actual), reverse=True):
            if vecino not in descubiertos:
                descubiertos.add(vecino)
                anterior[vecino] = actual
                pendientes.append(vecino)
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
