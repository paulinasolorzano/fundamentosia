"""K-means didáctico: separa entrenar/guardar de cargar/predecir.
Python 3.8 o posterior. Sin paquetes externos.
Ejecuta desde la terminal de VS Code: python3 algoritmo.py --help
"""
import argparse
import csv
import hashlib
import json
import math
from pathlib import Path

BASE = Path(__file__).resolve().parent
CARACTERISTICAS = ["tamano", "dulzor"]


def punto_valido(punto):
    if len(punto) != 2 or any(isinstance(x, bool) or not isinstance(x, (int, float))
                              or not math.isfinite(x) or not 0 <= x <= 10 for x in punto):
        raise ValueError("Usa dos números finitos de 0 a 10: tamaño y dulzor.")
    return list(punto)


def distancia2(a, b):
    return sum((x - y) ** 2 for x, y in zip(a, b))


def grupo_cercano(punto, centros):
    # En un empate, min elige el primer centro de la lista.
    return min(range(len(centros)), key=lambda j: distancia2(punto, centros[j]))


def leer_datos(ruta):
    with ruta.open(encoding="utf-8-sig", newline="") as archivo:
        lector = csv.DictReader(archivo)
        if not set(CARACTERISTICAS).issubset(lector.fieldnames or []):
            raise ValueError("El CSV necesita las columnas tamano y dulzor.")
        datos = [punto_valido([float(fila[c]) for c in CARACTERISTICAS]) for fila in lector]
    if not datos:
        raise ValueError("El CSV está vacío.")
    return datos


def entrenar(datos, k, max_iter=100):
    unicos = list(dict.fromkeys(tuple(p) for p in datos))
    if not 1 <= k <= len(unicos):
        raise ValueError("K debe estar entre 1 y la cantidad de puntos distintos.")
    # Inicio reproducible: primer punto y después el más lejano a los ya elegidos.
    centros = [list(unicos[0])]
    while len(centros) < k:
        siguiente = max(unicos, key=lambda p: min(distancia2(p, c) for c in centros))
        centros.append(list(siguiente))
    inicio = [c[:] for c in centros]
    for iteracion in range(1, max_iter + 1):
        grupos = [grupo_cercano(p, centros) for p in datos]
        nuevos = []
        for j, anterior in enumerate(centros):
            miembros = [p for p, g in zip(datos, grupos) if g == j]
            nuevos.append([sum(p[d] for p in miembros) / len(miembros) for d in range(2)]
                          if miembros else anterior[:])
        movimiento = max(distancia2(a, b) for a, b in zip(centros, nuevos))
        centros = nuevos
        print("Iteración", iteracion, "centroides:", centros)
        if movimiento < 1e-12:
            break
    else:
        raise ValueError("No se estabilizó; no se guardó un modelo nuevo.")
    grupos = [grupo_cercano(p, centros) for p in datos]
    return {
        "formato": "kmeans-frutas-v1", "algoritmo": "K-means",
        "caracteristicas": CARACTERISTICAS,
        "escala": {"min": 0, "max": 10, "tipo": "indices_sinteticos_sin_normalizar"},
        "metrica": "euclidiana", "k": k, "centroides": centros,
        "entrenamiento": {
            "n_ejemplos": len(datos), "iteraciones": iteracion,
            "centroides_iniciales": inicio,
            "sse": sum(distancia2(p, centros[g]) for p, g in zip(datos, grupos)),
            "inicializacion": "primer_punto_y_mas_lejanos"
        }
    }


def cargar_modelo(ruta):
    modelo = json.loads(ruta.read_text(encoding="utf-8"))
    if (modelo.get("formato") != "kmeans-frutas-v1"
            or modelo.get("caracteristicas") != CARACTERISTICAS
            or modelo.get("metrica") != "euclidiana"
            or modelo.get("escala", {}).get("min") != 0
            or modelo.get("escala", {}).get("max") != 10):
        raise ValueError("Formato, características, escala o métrica incompatibles.")
    centros = modelo.get("centroides")
    k = modelo.get("k")
    if not isinstance(k, int) or isinstance(k, bool) or not isinstance(centros, list) or k < 1 or len(centros) != k:
        raise ValueError("K y la cantidad de centroides no coinciden.")
    for c in centros:
        punto_valido(c)
    return modelo


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    tareas = parser.add_subparsers(dest="tarea", required=True)
    t = tareas.add_parser("entrenar", help="Lee CSV, aprende centroides y escribe JSON.")
    t.add_argument("--datos", type=Path, default=BASE / "datos.csv")
    t.add_argument("--k", type=int, default=2)
    t.add_argument("--salida", type=Path, default=BASE / "modelo.json",
                   help="Destino; si existe, se reemplaza solo al entrenar correctamente.")
    p = tareas.add_parser("predecir", help="Solo carga el JSON; no lee el CSV ni reentrena.")
    p.add_argument("--modelo", type=Path, default=BASE / "modelo.json")
    p.add_argument("--tamano", type=float, required=True)
    p.add_argument("--dulzor", type=float, required=True)
    args = parser.parse_args()
    try:
        if args.tarea == "entrenar":
            datos = leer_datos(args.datos)
            modelo = entrenar(datos, args.k)
            modelo["entrenamiento"]["datos_sha256"] = hashlib.sha256(args.datos.read_bytes()).hexdigest()
            # El archivo se escribe únicamente en esta rama, después del entrenamiento.
            args.salida.write_text(json.dumps(modelo, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            print("Modelo guardado en:", args.salida.resolve())
            print("Parámetros de los centroides:", args.k * len(CARACTERISTICAS))
        else:
            modelo = cargar_modelo(args.modelo)
            punto = punto_valido([args.tamano, args.dulzor])
            grupo = grupo_cercano(punto, modelo["centroides"])
            print("Modelo cargado de:", args.modelo.resolve())
            print("Punto:", punto, "→ Grupo", grupo + 1)
            print("Centroide:", modelo["centroides"][grupo])
            print("No se entrenó ni se modificó el JSON. Un grupo no es un diagnóstico.")
    except (OSError, ValueError, TypeError, KeyError) as error:
        parser.exit(1, "Error: " + str(error) + "\n")


if __name__ == "__main__":
    main()
