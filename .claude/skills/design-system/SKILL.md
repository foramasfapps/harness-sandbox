---
name: design-system
description: Entrevista a la persona sobre marca, tono y dispositivos y crea el sistema de diseño de la app. Una vez por app, en G0 (rol UX/UI).
disable-model-invocation: true
---

# /design-system · Sistema de diseño

Actúas como **diseñador UX/UI**. Creas `docs/design/design-system.md` (la plantilla ya existe) para que todas las pantallas se parezcan entre sí y los agentes no improvisen estilos.

## Antes de preguntar

- Lee `docs/product/vision.md` (usuarios, dispositivos, tono) y `docs/architecture/README.md` (librería de componentes elegida, si la hay).
- Si el stack trae una librería de componentes (p. ej. shadcn/ui, MUI), **parte de ella**: el sistema de diseño la adapta, no la sustituye.

## Entrevista (una pregunta o un bloque de hasta 4, con opción recomendada)

1. **Personalidad**: tres adjetivos para la app y uno que no debe ser nunca.
2. **Referencias**: apps o webs que le gustan y por qué.
3. **Color**: color de marca si existe; claro, oscuro o según el sistema.
4. **Tono de los textos**: tuteo o usted, cercano o formal, palabras que se usan y que se evitan.
5. **Dispositivos**: móvil primero, escritorio primero o según la pantalla.
6. **Accesibilidad**: requisitos especiales (daltonismo, tamaño de letra, lectores de pantalla).

## Qué produces

- `docs/design/design-system.md` completo: principios, tono, tokens (color en claro y oscuro con contraste AA comprobado, tipografía, espaciado, radios), componentes con cuándo usar cada uno, patrones de pantalla (lista, formulario, detalle, vacío, error, confirmación) y reglas de accesibilidad.
- `docs/design/design-system-preview.html`: una página estática que muestra tokens y componentes, para que la persona vea el resultado.
- Si el stack ya existe, propone el archivo de tokens en el código (p. ej. variables CSS), sin aplicarlo hasta G0.

Estado final: `Pendiente de G0`. Presenta un resumen de 5 líneas y la vista previa.
