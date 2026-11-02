---
name: trampa-redibujar-avisos
description: Redibujar la lista entera choca con los avisos role=alert/status (DP-06): se vuelven a anunciar; excepción recogida en plan v1.1 de tareas y en la arquitectura
metadata:
  type: project
---

En `tareas`, el plan (decisión 2) decía "tras cada acción se redibuja la lista entera". Al construir T-10 apareció que volver a insertar un error dentro de `role="alert"` (o mover su fila) hace que el lector lo anuncie otra vez (DP-06). Solución construida: la fila en edición se reutiliza y las demás se colocan a su alrededor; los avisos visibles no se reconstruyen.

Cerrado en `/close` (02-11-2026): recogido en `plan.md` "Cambios en la v1.1", en `docs/architecture/README.md` "Cómo funciona la pantalla" y en las consecuencias del ADR 0001.

**Why:** el plan aprobado no lo previó y el fallo solo lo vio QA en la verificación parcial 2.

**How to apply:** al planificar pantallas sin framework con avisos anunciados, decidir desde el plan que los mensajes ya visibles y la fila con error no se reconstruyen ni se mueven. Relacionado: [[trampas-arnes-tests]].
