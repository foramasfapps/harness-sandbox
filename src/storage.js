// Lectura y guardado en localStorage. Nunca lanza errores y no toca window al importarse.
import { isValidTaskList } from "./tasks.js";

export const STORAGE_KEY = "tasks.v1";

// Devuelve el almacenamiento o null si el acceso falla (CA-30).
function getStore() {
  try {
    return window.localStorage || null;
  } catch {
    return null;
  }
}

// Clave inexistente o [] = lista vacía legible. Lo ilegible no se toca (RN-12, RN-13).
export function loadTasks() {
  try {
    const store = getStore();
    if (!store) return { tasks: [], readable: false };
    const raw = store.getItem(STORAGE_KEY);
    if (raw === null) return { tasks: [], readable: true };
    const value = JSON.parse(raw);
    if (!isValidTaskList(value)) return { tasks: [], readable: false };
    return { tasks: value, readable: true };
  } catch {
    return { tasks: [], readable: false };
  }
}

// true si se guardó, false si no.
export function saveTasks(tasks) {
  try {
    const store = getStore();
    if (!store) return false;
    store.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch {
    return false;
  }
}
