# Sistema de diseño

> Estado: Pendiente de G0 · Se crea con `/design-system` (una vez por app) y se aprueba en G0. Vista previa: `docs/design/design-system-preview.html`.

## Principios

1. **Clara:** lo que queda por hacer se ve de un vistazo.
2. **Tranquila:** un solo color de acento y nada de animaciones llamativas.
3. **Directa:** cada acción está a la vista y a un toque.
4. **Nunca recargada:** si un elemento no ayuda a gestionar tareas, no se añade.

## Tono de los textos

Tuteo, cercano y breve. Se dice "tarea", "añade", "edita" y "borra"; se evitan los tecnicismos y los mensajes de culpa. Ejemplo: "Añade tu primera tarea".

## Tokens

Propuesta para `src/styles.css`, como variables CSS. No se aplica al código hasta aprobar G0.

### Color

| Token | Uso | Claro | Oscuro |
|---|---|---|---|
| `--bg` | Fondo | `#F7F8FA` | `#12151B` |
| `--surface` | Tarjetas y campos | `#FFFFFF` | `#1B1F27` |
| `--fg` | Texto | `#1B1F27` | `#E8EBF0` |
| `--muted` | Texto secundario y tareas completadas | `#5A6472` | `#A5AEBB` |
| `--border` | Bordes de campos y controles | `#7F8998` | `#6F7A8B` |
| `--accent` | Acción principal y foco | `#1D5FCC` | `#7FB0FF` |
| `--on-accent` | Texto sobre el acento | `#FFFFFF` | `#0B1220` |
| `--ok` / `--warn` / `--error` | Estados | `#1A7F4B` / `#9A5B00` / `#C62828` | `#5BCB8F` / `#E7B25A` / `#FF8A80` |

El modo claro u oscuro sigue la preferencia del dispositivo (`prefers-color-scheme`). Contraste comprobado por script: el texto cumple AA (4,5:1) y los bordes y controles, 3:1, sobre `--bg` y `--surface`.

### Tipografía

| Rol | Familia | Tamaños |
|---|---|---|
| Títulos | Fuente del sistema (`system-ui`) | 24 px, peso 600 |
| Texto | Fuente del sistema (`system-ui`) | 16 px; secundario, 14 px |
| Datos y código | No se usan | — |

### Espaciado y forma

- Espaciado: 4, 8, 12, 16 y 24 px.
- Radio: 8 px en campos, botones y tarjetas.
- Sin sombras: los bordes separan los elementos.

## Componentes

| Componente | Cuándo se usa | Variantes |
|---|---|---|
| Botón | Para ejecutar una acción | Principal (una por vista), secundario, destructivo |
| Campo de texto | Para escribir o editar una tarea | Normal, con error |
| Casilla | Para marcar una tarea como completada | Marcada, sin marcar |
| Fila de tarea | Para cada tarea de la lista | Pendiente, completada (texto en `--muted` y tachado), editando |

## Patrones de pantalla

- **Lista:** una columna con el campo de añadir arriba y las tareas debajo.
- **Formulario:** el campo y su botón en la misma línea; se confirma también con Intro.
- **Detalle:** no hay; una tarea se edita en su propia fila.
- **Vacío:** una frase breve que invita a añadir la primera tarea.
- **Error:** un mensaje junto al campo que dice cómo arreglarlo; usa `--error` además de texto, nunca solo color.
- **Confirmación:** sin pantallas extra; el resultado se ve en la propia lista.

## Accesibilidad

- Contraste mínimo AA.
- Foco visible en todo lo que se puede usar con teclado.
- Tamaño táctil mínimo 44 px.
- Todo se puede hacer solo con teclado, y cada control tiene un nombre que lee un lector de pantalla.
- El estado nunca se indica solo con color.

## Dispositivos

Móvil primero: una columna que en escritorio se limita a 560 px de ancho y se centra.
