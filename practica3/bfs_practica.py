# Práctica BFS · Mapa generado desde la página.
# 0: libre; 1: pared. Cuatro direcciones, costo 1 por movimiento.
# Coordenadas: (fila, columna). Mapa rectangular con inicio y meta libres.
from collections import deque


def vecinos(mapa, posicion):
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


def buscar(mapa, inicio, meta):
    pendientes = deque([inicio])
    descubiertos = {inicio}
    anterior = {inicio: None}
    while pendientes:
        actual = pendientes.popleft()
        if actual == meta:
            return reconstruir(anterior, actual)
        opciones = list(vecinos(mapa, actual))
        for vecino in opciones:
            if vecino not in descubiertos:
                descubiertos.add(vecino)
                anterior[vecino] = actual
                pendientes.append(vecino)
    return None


mapa = [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0]
]
inicio = (0, 0)
meta = (4, 0)

if __name__ == "__main__":
    ruta = buscar(mapa, inicio, meta)
    if ruta is None:
        print("No existe una ruta.")
    else:
        print("Ruta:", ruta)
        print("Movimientos:", len(ruta) - 1)
