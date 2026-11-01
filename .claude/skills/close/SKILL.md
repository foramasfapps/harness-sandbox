---
name: close
description: Cierre de una funcionalidad tras el merge - pone al día PRD, decisiones, modelo de datos y arquitectura, busca deriva documental y escribe la retro del arnés.
argument-hint: "[nombre-de-la-funcionalidad]"
disable-model-invocation: true
---

# /close · Cierre

La spec sigue viva: después del merge, la documentación vuelve a reflejar lo construido. Trabaja sobre `main` actualizado, en una rama `docs/close-$ARGUMENTS`, con un PR de solo documentación.

## Pasos

1. **Comprueba** que el PR de `feature/$ARGUMENTS` está fusionado en `main`. Si no, para.
2. **PM** (tú mismo, como PM):
   - PRD a `Implementado (dd-mm-aaaa)`, con una sección "Cambios durante la construcción" (lo que cambió frente a lo aprobado y por qué; sale de `progress.md` y de los bloqueos resueltos).
   - Decisiones de esa funcionalidad a "Implementada" en `docs/product/decisions.md`.
   - Si la funcionalidad estaba en el mapa de `vision.md`, márcala hecha.
3. **Arquitecto**: subagente **architect** para aplicar a `docs/architecture/data-model.md`, los ADR y `docs/architecture/README.md` los cambios que el plan dejó propuestos y lo que de verdad se construyó.
4. **Deriva documental**: busca contradicciones entre `CLAUDE.md`, `.claude/rules/`, `decisions.md`, los PRD, el modelo de datos y el código (p. ej. un campo que el modelo nombra distinto, una decisión "Pendiente" ya construida, una regla de oro que el código incumple). Lista cada una con su arreglo propuesto; arregla las de documentación y deja las de código como tarea para la persona.
5. **Retro del arnés** en `docs/process/lessons.md`:
   - Fila en la tabla de métricas: talla, fecha, consumo (pide a la persona la cifra de `/usage` si no la tienes), veces que hizo falta la persona fuera de las puertas y **fallos escapados** (los encontrados en G3 o después).
   - Qué falló, qué sobró, qué faltó, y **cambios concretos propuestos** a agentes, skills o controles. **No los apliques**: los decide la persona.
6. **PR** de documentación y resumen a la persona en 5 líneas, con los cambios al arnés propuestos.
