// Pantalla de la lista de tareas. Un único estado en memoria; tras cada cambio se redibuja todo.
import { loadTasks } from "./storage.js";

const loaded = loadTasks();

const state = {
  tasks: loaded.tasks,
  readable: loaded.readable,
  // Fila abierta: { id, mode: "edit" | "confirm", value, error } o null.
  openRow: null,
  // Dónde queda el foco tras redibujar: { id, control } o { field: true } o null.
  focus: null,
};

const READ_WARNING =
  "No se han podido leer tus tareas guardadas. Si haces un cambio, se reemplazarán.";

const els = {
  notices: document.querySelector("#notices"),
  empty: document.querySelector("#empty-message"),
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
  els.notices.replaceChildren(...notices);
  els.empty.hidden = state.tasks.length > 0;
  els.list.replaceChildren(...state.tasks.map(buildRow));
  applyFocus();
}

// Los botones se conectan en las tareas siguientes; por ahora solo se evita enviar el formulario.
els.addForm.addEventListener("submit", (event) => event.preventDefault());

render();
