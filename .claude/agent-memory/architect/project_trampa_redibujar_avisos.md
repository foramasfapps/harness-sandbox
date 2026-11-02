---
name: trampa-redibujar-avisos
description: Redibujar la lista entera choca con los avisos role=alert/status (DP-06): se vuelven a anunciar; la decisión 2 del plan de tareas quedó desfasada
metadata:
  type: project
---

En `tareas`, el plan (decisión 2) decía "tras cada acción se redibuja la lista entera". Al construir T-10 apareció que volver a insertar un error dentro de `role="alert"` hace que el lector lo anuncie otra vez (DP-06). El Developer lo resolvió reutilizando la fila en edición y sin reconstruir los avisos ya visibles, y lo dejó apuntado en `progress.md` para `/close`.

**Why:** revisión de coherencia de `feature/tareas` (02-11-2026). El plan aprobado no se corrigió en su momento.

**How to apply:** al planificar pantallas sin framework con avisos anunciados, decidir desde el plan que los mensajes ya visibles no se reconstruyen. En `/close` de `tareas`, comprobar que el plan o la arquitectura recogen la excepción. Relacionado: [[trampas-arnes-tests]].
