"""MODELO: Huerto, Radio, Robótica y Mural. Python 3, sin paquetes externos."""
# Posiciones: A = Huerto, B = Radio, C = Robótica, D = Mural.
COSTOS = [4, 3, 5, 2]
BENEFICIOS = [7, 5, 9, 4]
PRESUPUESTO = 10


def evaluar(codigo):
    # Cada 1 indica que debemos sumar el proyecto de esa posición.
    costo = 0
    beneficio = 0
    for i in range(4):
        if codigo[i] == "1":
            costo += COSTOS[i]
            beneficio += BENEFICIOS[i]
    puntuacion = beneficio if costo <= PRESUPUESTO else 0
    return costo, beneficio, puntuacion


def torneo(a, b):
    # evaluar devuelve tres valores. El índice 2 es la puntuación.
    if evaluar(b)[2] > evaluar(a)[2]:
        return b
    return a  # En empate conservamos el primero.


def cruzar(a, b):
    # [:2] toma las dos primeras cifras; [2:] toma las dos últimas.
    hijo1 = a[:2] + b[2:]
    hijo2 = b[:2] + a[2:]
    return hijo1, hijo2


def mutar_ultima(codigo):
    # [:3] conserva las tres primeras cifras. Solo cambia la última.
    nueva = "0" if codigo[3] == "1" else "1"
    return codigo[:3] + nueva


if __name__ == "__main__":
    poblacion = ["1010", "0101", "1100", "1000"]
    print("Inicial: código, (costo, beneficio, puntuación)")
    for codigo in poblacion:
        print(codigo, evaluar(codigo))

    padre1 = torneo(poblacion[0], poblacion[2])
    padre2 = torneo(poblacion[1], poblacion[3])
    print("Padres:", padre1, padre2)

    hijo1, hijo2 = cruzar(padre1, padre2)
    print("Hijos:", hijo1, evaluar(hijo1), hijo2, evaluar(hijo2))

    # En el primer ejemplo se modifica el SEGUNDO hijo.
    mutado = mutar_ultima(hijo2)
    print("Segundo hijo mutado:", mutado, evaluar(mutado))

    # Ordenar por puntuación y conservar los dos mejores originales.
    elites = sorted(poblacion, key=lambda c: evaluar(c)[2], reverse=True)[:2]
    nueva = elites + [hijo1, mutado]
    print("Nueva población:", nueva)
    print("Mejor puntuación:", max(evaluar(c)[2] for c in nueva))
    # Recorrido fijo para aprender: no es una búsqueda aleatoria completa.
