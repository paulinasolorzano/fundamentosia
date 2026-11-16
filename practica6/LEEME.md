# Algoritmo, datos y modelo · Unidad III

Abre index.html en el navegador y sigue «Continuar» al pie de cada paso. El índice «Ver pasos» del encabezado es opcional.

Para ejecutar Python, abre esta carpeta en Visual Studio Code. Usa Python 3.8 o posterior; no necesitas instalar paquetes. VS Code es el editor: Python ejecuta el programa.

## Reconoce los tres archivos

| Archivo | Función |
| --- | --- |
| algoritmo.py | Contiene el procedimiento para entrenar, guardar, cargar y predecir. |
| datos.csv | Contiene seis ejemplos sintéticos, sin etiquetas objetivo. Tamaño y dulzor son índices de 0 a 10. |
| modelo.json | Guarda los centroides aprendidos, el orden de las características, la escala, la métrica y metadatos de entrenamiento. |

El paquete incluye un modelo de ejemplo ya entrenado con el CSV original y K=2. Puedes comenzar prediciendo. Los números de grupo son identificadores, no nombres de fruta ni diagnósticos.

## 1. Usa el modelo entregado

Abre Terminal > Nueva terminal en VS Code y ejecuta:

```sh
python3 algoritmo.py predecir --tamano 2 --dulzor 2
```

En Windows puedes usar `python` o `py` si `python3` no está disponible.

El programa carga modelo.json y devuelve un grupo. No lee datos.csv, no cambia centroides y no reescribe el modelo.

## 2. Entrena y guarda otro modelo

```sh
python3 algoritmo.py entrenar --k 2 --salida modelo_nuevo.json
```

Lee datos.csv, ajusta los centroides y crea modelo_nuevo.json. Si el destino ya existe, lo reemplaza cuando el entrenamiento termina correctamente. Si omites --salida, el destino es modelo.json.

## 3. Utiliza tu nuevo modelo

```sh
python3 algoritmo.py predecir --modelo modelo_nuevo.json --tamano 8 --dulzor 8
```

## 4. Investiga qué modifica el resultado

1. Guarda una copia del CSV y del modelo original.
2. Cambia P3 de (3,2) a (8,8) en datos.csv y guarda el archivo.
3. Predice otra vez usando modelo.json: editar el CSV no modifica por sí solo el modelo guardado.
4. Entrena con el CSV modificado y guarda modelo_modificado.json.
5. Abre ambos JSON; compara centroides y SSE, y predice el mismo punto con cada modelo.
6. Restaura el CSV. Prueba K=3 con otro archivo de salida. Cuenta 3 × 2 = 6 valores de centroides.

Con un inicio determinista y los mismos datos, K y criterio de parada, debes obtener los mismos centros. Un resultado no tiene que cambiar solo por volver a entrenar.

## 5. Lleva el modelo entre Python y la página

En la sección «Algoritmo, datos y modelo» de practica.html puedes cargar el JSON generado por Python y asignar puntos nuevos sin reentrenar. También puedes estabilizar K-means en la página, descargar sus centroides y usarlos con `--modelo` en Python. Se utiliza el mismo formato de JSON.

El inicio de Python elige el primer punto y después los más lejanos. La página también permite otros inicios: no esperes resultados idénticos en todos los experimentos ni compares los números de grupo como si fueran categorías semánticas.

## Entrega tu explicación

Explica qué archivo contiene instrucciones, cuál contiene observaciones y cuál conserva el resultado aprendido. Registra qué comando crea el JSON y cuál solo lo consulta. Distingue K (hiperparámetro) de coordenadas de centroides (parámetros). El JSON es un formato de almacenamiento; no aprende por sí solo.
