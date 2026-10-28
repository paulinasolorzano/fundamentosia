"""Ejemplos guiados: decisiones fijas para entender, sin paquetes externos."""
COSTOS = [4, 3, 5, 2]
BENEFICIOS = [7, 5, 9, 4]


def evaluar_proyectos(codigo):
    costo = 0
    beneficio = 0
    for posicion in range(4):
        if codigo[posicion] == "1":
            costo += COSTOS[posicion]
            beneficio += BENEFICIOS[posicion]
    puntos = beneficio if costo <= 10 else 0
    return costo, beneficio, puntos


def evaluar_horario(bloques):
    # Las posiciones 0, 1, 2, 3 corresponden a A, B, C, D.
    pares = [(0, 1, "Grupo 1"), (2, 3, "Grupo 2"),
             (0, 2, "Ana"), (1, 3, "Luis")]
    puntos = 0
    choques = []
    for a, b, nombre in pares:
        if bloques[a] != bloques[b]:
            puntos += 1
        else:
            choques.append(nombre)
    return puntos, choques


def cruzar(a, b):
    # Tomar las dos primeras decisiones de uno y las dos últimas del otro.
    return a[:2] + b[2:], b[:2] + a[2:]


if __name__ == "__main__":
    print("PROYECTOS: costo, beneficio y puntuación")
    for codigo in ["1010", "0101", "1100", "1000"]:
        print(codigo, evaluar_proyectos(codigo))
    hijos = cruzar("1010", "0101")
    print("Cruce:", hijos)
    for codigo in hijos:
        print(codigo, evaluar_proyectos(codigo))
    print("Mutación 0110 → 0111:", evaluar_proyectos("0111"))
    print("\nHORARIOS: puntuación y choques")
    for bloques in [[1, 2, 1, 2], [2, 1, 2, 1], [1, 1, 1, 1], [2, 2, 2, 2]]:
        print(bloques, evaluar_horario(bloques))
    hijos = cruzar([1, 2, 1, 2], [2, 1, 2, 1])
    for bloques in hijos:
        print("Descendiente:", bloques, evaluar_horario(bloques))
    print("Mutación [1,2,2,1] → [1,2,2,2]:", evaluar_horario([1, 2, 2, 2]))
