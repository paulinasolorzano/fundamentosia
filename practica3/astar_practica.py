# Práctica ASTAR · Mapa generado desde la página.
# 0: libre; 1: pared. Cuatro direcciones, costo 1 por movimiento.
# Coordenadas: (fila, columna). Mapa rectangular con inicio y meta libres.
import heapq


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
