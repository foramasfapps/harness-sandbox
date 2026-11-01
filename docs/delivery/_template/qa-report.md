# Informe de QA – {{feature}}

> Lo escribe QA al final de `/build`. Fecha: {{dd-mm-aaaa}} · Rama: `feature/{{feature}}` · Commit: {{sha}}
> Veredicto: {{Aprobado | Con fallos}}

## Criterios de aceptación

| CA | Nivel | Resultado | Prueba | Pasos para reproducir (si falla) |
|---|---|---|---|---|
| CA-01 | {{unit / integration / e2e / exploratoria}} | {{Pasa / Falla}} | {{test o captura}} | {{…}} |

## Revisión del código frente a los criterios

{{CA sin test real, tests triviales o debilitados, reglas de negocio mal aplicadas.}}

## Prueba exploratoria

{{Qué se probó en la app fuera de los tests y qué se encontró.}}

## Fallos por gravedad

| # | Gravedad | Qué pasa | CA | Test nuevo que lo cubre |
|---|---|---|---|---|

Gravedad: **Crítico** (dato incorrecto o pérdida de datos) · **Alto** (un CA no se cumple) · **Medio** (caso límite o error mal tratado) · **Bajo** (molestia sin efecto en datos).
