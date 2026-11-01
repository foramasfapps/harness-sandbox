// Reglas de las tareas: funciones puras que devuelven una lista nueva.
// No tocan el navegador ni el guardado.

export const MAX_TEXT_LENGTH = 200;

// RN-05: sin espacios al principio y al final.
function clean(rawText) {
  return typeof rawText === "string" ? rawText.trim() : "";
}

// RN-01 y RN-05: la tarea nueva va al principio. Devuelve null si el texto queda vacío.
export function addTask(tasks, rawText, newId = () => crypto.randomUUID()) {
  const text = clean(rawText);
  if (text === "") return null;
  return [{ id: newId(), text, completed: false }, ...tasks];
}

// RN-04 y RN-05: cambia solo el texto; posición y estado no cambian.
export function editTask(tasks, id, rawText) {
  const text = clean(rawText);
  if (text === "") return null;
  return tasks.map((task) => (task.id === id ? { ...task, text } : task));
}

// RN-02 y RN-03: al completar va al final; al desmarcar, al principio.
export function setCompleted(tasks, id, completed) {
  const target = tasks.find((task) => task.id === id);
  if (!target) return tasks.slice();
  const updated = { ...target, completed };
  const rest = tasks.filter((task) => task.id !== id);
  return completed ? [...rest, updated] : [updated, ...rest];
}

export function removeTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}

// RN-12: lo guardado solo es legible si cada tarea cumple el modelo.
// Un texto de más de MAX_TEXT_LENGTH se acepta.
export function isValidTaskList(value) {
  if (!Array.isArray(value)) return false;
  const ids = new Set();
  for (const task of value) {
    if (task === null || typeof task !== "object" || Array.isArray(task)) return false;
    if (typeof task.id !== "string" || task.id === "" || ids.has(task.id)) return false;
    if (typeof task.text !== "string" || task.text.trim() === "") return false;
    if (typeof task.completed !== "boolean") return false;
    ids.add(task.id);
  }
  return true;
}
