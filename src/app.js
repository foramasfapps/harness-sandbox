// Pantalla de la lista de tareas. Un único estado en memoria; tras cada cambio se redibuja todo.
import { loadTasks, saveTasks } from "./storage.js";
import { addTask } from "./tasks.js";

const loaded = loadTasks();

const state = {
  tasks: loaded.tasks,
  readable: loaded.readable,
  // Fila abierta: { id, mode: "edit" | "confirm", value, error } o null.
  openRow: null,
  // Dónde queda el foco tras redibujar: { id, control } o { field: true } o null.
  focus: null,
  // Error de la zona de añadir.
  addError: false,
};

const READ_WARNING =
  "No se han podido leer tus tareas guardadas. Si haces un cambio, se reemplazarán.";

const ADD_ERROR = "Escribe algo para añadir la tarea.";

const els = {
  notices: document.querySelector("#notices"),
  emptySlot: document.querySelector("#empty-slot"),
  list: document.querySelector("#task-list"),
  addField: document.querySelector("#add-field"),
  addForm: document.querySelector("#add-form"),
};

function buildRow(task) {
  const item = document.createElement("li");
  item.className = "task-row";
  item.dataset.id = task.id;

  const check = document.createElement("input");
  check.type = "checkbox";
  check.className = "task-check";
  check.checked = task.completed;
  check.setAttribute("aria-label", task.text);

  const text = document.createElement("span");
  text.className = task.completed ? "task-text is-completed" : "task-text";
  text.dataset.testid = "task-text";
  text.textContent = task.text;

  const actions = document.createElement("div");
  actions.className = "task-actions";
  for (const [control, label] of [
    ["edit", "Editar"],
    ["delete", "Borrar"],
  ]) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "button";
    button.dataset.control = control;
    button.textContent = label;
    button.setAttribute("aria-label", `${label} tarea: ${task.text}`);
    actions.append(button);
  }

  item.append(check, text, actions);
  return item;
}

function applyFocus() {
  const target = state.focus;
  state.focus = null;
  if (!target) return;
  if (target.field) {
    els.addField.focus();
    return;
  }
  for (const row of els.list.children) {
    if (row.dataset.id === target.id) {
      row.querySelector(`[data-control="${target.control}"]`)?.focus();
      return;
    }
  }
}

function render() {
  const notices = [];
  if (!state.readable) {
    const warning = document.createElement("p");
    warning.className = "notice";
    warning.textContent = READ_WARNING;
    notices.push(warning);
  }
  if (state.addError) {
    const error = document.createElement("p");
    error.className = "notice notice-error";
    error.textContent = ADD_ERROR;
    notices.push(error);
  }
  els.addField.classList.toggle("is-invalid", state.addError);
  els.notices.replaceChildren(...notices);
  // El mensaje de vacío solo existe en el DOM cuando toca.
  if (state.tasks.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "Añade tu primera tarea.";
    els.emptySlot.replaceChildren(empty);
  } else {
    els.emptySlot.replaceChildren();
  }
  els.list.replaceChildren(...state.tasks.map(buildRow));
  applyFocus();
}

// Añadir: una tarea válida va al principio, se guarda y deja el campo vacío y con foco.
els.addForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const next = addTask(state.tasks, els.addField.value);
  if (next === null) {
    // CA-04 y CA-43: no se crea ni se guarda nada; el campo no cambia.
    state.addError = true;
    state.focus = { field: true };
    render();
    return;
  }
  state.tasks = next;
  state.addError = false;
  // El primer cambio guardado reemplaza lo ilegible (CA-27).
  state.readable = true;
  saveTasks(state.tasks);
  els.addField.value = "";
  state.focus = { field: true };
  render();
});

render();
