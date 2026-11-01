---
name: bootstrap
description: Arranque de una app nueva creada desde la plantilla - visión, reglas de oro, arquitectura, puesta en marcha técnica y sistema de diseño, hasta la puerta G0.
disable-model-invocation: true
---

# /bootstrap · Arrancar una app (G0)

Conviertes este repositorio, recién creado desde la plantilla, en el punto de partida de una app concreta. Son tres bloques con una pausa para la persona al final de cada uno. Retoma donde se quedó si ya hay partes hechas (mira el estado de cada documento).

## Bloque 1 · Visión y reglas de oro

1. Entrevista (como en `/discover`: una pregunta o bloques de hasta 4, con opción recomendada, en términos sencillos) para escribir `docs/product/vision.md`: problema, usuarios, propuesta de valor, decisiones que la app debe ayudar a tomar, qué NO es, alcance del MVP y métricas.
2. Propón las **reglas de oro** (invariantes no negociables: datos, dinero, seguridad, idioma…) y el **mapa de funcionalidades** en orden de construcción, con su talla y su porqué.
3. Rellena en `CLAUDE.md` "Qué es la app" y las reglas de oro, y **quita la línea que avisa de que es la plantilla**. Primeras decisiones en `decisions.md`.
4. **Pausa**: presenta visión, reglas y mapa. Espera el ok.

## Bloque 2 · Arquitectura base

Subagente **architect** (o tú en su papel si prefieres conversar) para proponer, con alternativas y recomendación y en términos sencillos:

- Stack, librería de componentes y despliegue.
- Modelo de datos v0 en `docs/architecture/data-model.md`.
- **Entornos**: local con datos semilla para los agentes (nunca datos reales), vista previa para G3 y producción (solo la persona aplica migraciones).
- Seguridad, y tests por nivel (unitario, integración, aceptación en `tests/acceptance/`, e2e en `e2e/`).
- Un ADR por cada decisión difícil de revertir.

**Pausa**: presenta y espera el ok antes de crear código.

## Bloque 3 · Puesta en marcha técnica

1. Crea el proyecto con el stack aprobado.
2. Rellena `.claude/harness.json`: `checks` (typecheck, lint, test; el comando de test debe incluir `tests/acceptance/`), `init` (app + base de datos local con datos semilla) y `production_command_patterns` (lo que toca producción en este stack). Necesitarás la aprobación de la persona para editarlo.
3. Convierte en comprobaciones de `scripts/check-invariants.sh` las reglas de oro que se puedan comprobar con un script.
4. Rellena la preparación del stack en `.github/workflows/ci.yml` y activa los e2e.
5. Añade reglas por carpeta en `.claude/rules/` para las partes críticas (p. ej. la lógica de negocio, las migraciones), con `paths:`.
6. Completa los comandos de `CLAUDE.md`.
7. Ejecuta `scripts/test-harness.sh` y `scripts/check.sh`: todo en verde.
8. Dale a la persona, paso a paso, lo que tiene que hacer fuera de aquí: proteger `main` en GitHub (exigir PR y CI en verde), vistas previas en el servicio de despliegue, secretos y variables de entorno.
9. Ejecuta `/design-system`.
10. Termina con un "hola mundo" en una rama con PR: CI en verde, vista previa desplegada y un primer test e2e pasando.

## Al final (G0)

Resumen de 5 líneas y "¿G0 aprobado?". Al aprobar, marca visión, arquitectura y sistema de diseño como `Aprobado (dd-mm-aaaa)` y propón `/feature` para elegir la primera funcionalidad.
