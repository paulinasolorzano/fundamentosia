"""Solución docente. Python 3, sin paquetes externos. Recorrido fijo para aprender."""
COSTOS = [3, 4, 2, 5]
BENEFICIOS = [5, 8, 3, 9]
PRESUPUESTO = 10


def evaluar(codigo):
    costo = 0
    beneficio = 0
    for i in range(4):
        if codigo[i] == "1":
            costo += COSTOS[i]
            beneficio += BENEFICIOS[i]
    puntos = beneficio if costo <= PRESUPUESTO else 0
    return costo, beneficio, puntos


def torneo(a, b):
    if evaluar(b)[2] > evaluar(a)[2]:
        return b
    return a


def cruzar(a, b):
    return a[:2] + b[2:], b[:2] + a[2:]


def mutar_ultima(codigo):
    nueva = "0" if codigo[3] == "1" else "1"
    return codigo[:3] + nueva


if __name__ == "__main__":
    poblacion = ["1100", "1000", "0011", "1010"]
    print("Inicial (costo, beneficio, puntuación):")
    for propuesta in poblacion:
        print(propuesta, evaluar(propuesta))
    padre1 = torneo(poblacion[0], poblacion[1])
    padre2 = torneo(poblacion[2], poblacion[3])
    print("Padres:", padre1, padre2)
    hijo1, hijo2 = cruzar(padre1, padre2)
    print("Hijos:", hijo1, evaluar(hijo1), hijo2, evaluar(hijo2))
    mutado = mutar_ultima(hijo1)
    print("Primer hijo mutado:", mutado, evaluar(mutado))
    elites = sorted(poblacion, key=lambda c: evaluar(c)[2], reverse=True)[:2]
    nueva = elites + [mutado, hijo2]
    print("Nueva población:", nueva)
    print("Mejor puntuación:", max(evaluar(c)[2] for c in nueva))
    # Las decisiones son fijas: no es una búsqueda aleatoria completa.
