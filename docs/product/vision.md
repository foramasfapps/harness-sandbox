# Visión

> Estado: Aprobado (01-11-2026) · Se escribe con `/bootstrap` y se aprueba en G0.

## Problema

Una persona quiere apuntar lo que tiene que hacer y ver qué le queda, sin cuentas ni instalaciones. Además, el arnés de esta plantilla aún no se ha probado con su ciclo completo: esta app es el ensayo (paso A9b de `docs/process/template-maintenance.md`).

## Usuarios

Una sola persona, en su propio navegador. No hay equipos, cuentas ni tareas compartidas.

## Propuesta de valor

Abrir la página y gestionar las tareas al momento, sin registrarse. Para quien mantiene la plantilla, deja pruebas de qué pieza del arnés funciona, cuál falla y cuál sobra.

## Decisiones que la app debe ayudar a tomar

1. ¿Qué me queda por hacer?

## Qué NO es

- Una herramienta de equipo: no hay cuentas, permisos ni colaboración.
- Un gestor de proyectos: no hay fechas, prioridades, etiquetas ni recordatorios.
- Un producto para usar a largo plazo: los datos solo viven en un navegador, sin copia de seguridad.

## Alcance del MVP

| Incluido | Fuera (y por qué) |
|---|---|
| Crear una tarea | Sincronizar entre dispositivos: exige cuenta y servidor (D-01) |
| Editar su texto | Fechas, prioridades y etiquetas: no hacen falta para probar el arnés |
| Marcarla como completada | Listas múltiples y búsqueda: no aportan al ensayo |
| Borrarla | Exportar o importar datos: no aportan al ensayo |
| Conservar las tareas al recargar la página | |

## Métricas de éxito

Miden el ensayo, no el uso de la app (D-03).

| Métrica | Cómo se mide | Objetivo |
|---|---|---|
| Ciclo completo | La funcionalidad pasa por G0, G1, G2, G3 y `/close` | Llega a un PR con CI en verde y al cierre |
| Lecciones registradas | Entradas en `docs/process/lessons.md` | Una por fase, con lo que falló o sobró |
| Intervención de la persona | Veces que hizo falta fuera de las puertas, según `lessons.md` | Registrada; cuantas menos, mejor |
| Consumo | Dato de `/usage` anotado al cerrar | Registrado |

## Mapa de funcionalidades

Orden de construcción y porqué. Cada fila acaba siendo un PRD.

| # | Funcionalidad | Talla | Por qué en este orden |
|---|---|---|---|
| 01 | `tareas`: crear, editar, completar y borrar | M | Es la app entera; las cuatro operaciones comparten pantalla y datos (D-02) |
