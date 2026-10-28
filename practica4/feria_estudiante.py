"""TU PROGRAMA: feria tecnológica. Usa modelo_proyectos.py como referencia.
Completa cada TODO después de resolver la bitácora. Python 3, sin paquetes externos.
Los puntos suspensivos son espacios por completar: no es una solución ejecutable.
"""
# TODO 1: coloca costos, beneficios y presupuesto de la FERIA, en orden A, B, C, D.
COSTOS = ...
BENEFICIOS = ...
PRESUPUESTO = ...


def evaluar(codigo):
    # TODO 2: suma costo y beneficio de las posiciones con 1.
    # Devuelve costo, beneficio y puntuación con la regla del presupuesto.
    raise NotImplementedError("Completa evaluar usando el modelo")


def torneo(a, b):
    # TODO 3: compara puntuaciones y devuelve el código ganador.
    raise NotImplementedError("Completa torneo")


def cruzar(a, b):
    # TODO 4: corta después de la segunda posición y crea dos hijos.
    raise NotImplementedError("Completa cruzar")


def mutar_ultima(codigo):
    # TODO 5: cambia solo la última cifra.
    raise NotImplementedError("Completa mutar_ultima")


if __name__ == "__main__":
    # TODO 6: escribe las cuatro propuestas iniciales indicadas en la bitácora.
    poblacion = ...
    # TODO 7: muestra código, costo, beneficio y puntuación de cada propuesta.
    # TODO 8: realiza los dos torneos que indica la actividad y muestra los padres.
    # TODO 9: cruza los padres y evalúa ambos hijos.
    # TODO 10: en la FERIA se modifica el PRIMER hijo. Evalúalo después de mutar.
    # TODO 11: conserva las dos mejores originales y agrega los descendientes
    #          en el orden indicado en el paso 5 de la bitácora.
    # TODO 12: muestra la nueva población y su mejor puntuación.
