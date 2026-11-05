"""Práctica de búsqueda local: mejorar el orden de un reparto.
Ejecuta en Windows: py reparto.py
No requiere paquetes externos. Las distancias son en línea recta.
"""
from math import hypot, exp

PUNTOS = [(0, 0), (2, 5), (5, 6), (8, 4), (7, 1), (3, 1)]
NOMBRES = ["Almacén", "A", "B", "C", "D", "E"]
INICIAL = [1, 3, 5, 2, 4]  # Solo destinos; el almacén queda fijo.
SEMILLA = 42
TEMPERATURA = 4.0
ENFRIAMIENTO = 0.98
LIMITE = 300


def generador(semilla):
    # Misma secuencia que el simulador web para reproducir sus decisiones.
    estado = semilla & 0xFFFFFFFF
    def siguiente():
        nonlocal estado
        estado = (1664525 * estado + 1013904223) & 0xFFFFFFFF
        return estado / 4294967296
    return siguiente


def distancia(ruta):
    """Suma todos los tramos, incluida la salida y el regreso al almacén."""
    completa = [0] + ruta + [0]
    return sum(hypot(PUNTOS[b][0] - PUNTOS[a][0],
                     PUNTOS[b][1] - PUNTOS[a][1])
               for a, b in zip(completa, completa[1:]))


def intercambiar(ruta, i, j):
    """Crea un vecino sin alterar la ruta original."""
    nueva = ruta[:]
    nueva[i], nueva[j] = nueva[j], nueva[i]
    return nueva


def hill_climbing(inicial):
    actual = inicial[:]
    for paso in range(1, LIMITE + 1):
        mejor_vecino = actual[:]
        # Revisa todos los intercambios y elige el de menor distancia.
        for i in range(len(actual)):
            for j in range(i + 1, len(actual)):
                vecino = intercambiar(actual, i, j)
                if distancia(vecino) < distancia(mejor_vecino) - 1e-10:
                    mejor_vecino = vecino
        if distancia(mejor_vecino) >= distancia(actual) - 1e-10:
            print(f"HC paso {paso}: ningún intercambio mejora. Fin.")
            break
        actual = mejor_vecino
        print(f"HC paso {paso}: costo = {distancia(actual):.2f}")
    return actual


def simulated_annealing(inicial):
    azar = generador(SEMILLA)
    actual = inicial[:]
    mejor = actual[:]
    temperatura = TEMPERATURA
    for paso in range(1, LIMITE + 1):
        # Escoge dos posiciones diferentes para intercambiarlas.
        i = int(azar() * len(actual))
        j = int(azar() * (len(actual) - 1))
        if j >= i:
            j += 1
        vecino = intercambiar(actual, i, j)
        delta = distancia(vecino) - distancia(actual)
        # Minimizamos: un delta negativo significa una mejora.
        probabilidad = 1.0 if delta <= 0 else exp(-delta / temperatura)
        acepta = delta <= 0 or azar() < probabilidad
        if acepta:
            actual = vecino
        if distancia(actual) < distancia(mejor):
            mejor = actual[:]
        print(f"SA {paso:3d}: T={temperatura:.3f}, delta={delta:.3f}, "
              f"{'acepta' if acepta else 'rechaza'}, "
              f"actual={distancia(actual):.2f}, mejor={distancia(mejor):.2f}")
        temperatura *= ENFRIAMIENTO
        if temperatura < 0.05:
            break
    # Devuelve la mejor, aunque la solución actual haya empeorado.
    return mejor


def mostrar(etiqueta, ruta):
    nombres = [NOMBRES[p] for p in [0] + ruta + [0]]
    print(etiqueta, " → ".join(nombres), f"| Distancia: {distancia(ruta):.2f}")


if __name__ == "__main__":
    mostrar("Inicial:", INICIAL)
    hc = hill_climbing(INICIAL)
    sa = simulated_annealing(INICIAL)
    print("\nRESULTADOS")
    mostrar("Hill Climbing:", hc)
    mostrar("Simulated Annealing:", sa)
    print("Una ejecución finita no garantiza el óptimo global.")
