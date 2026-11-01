// Pantalla de la lista de tareas. Un único estado en memoria; tras cada cambio se redibuja todo.
import { loadTasks, saveTasks } from "./storage.js";
import { MAX_TEXT_LENGTH, addTask, editTask, removeTask, setCompleted } from "./tasks.js";

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

const EDIT_ERROR = "Escribe algo para guardar la tarea.";

const READ_WARNING =
  "No se han podido leer tus tareas guardadas. Si haces un cambio, se reemplazarán.";

const ADD_ERROR = "Escribe algo para añadir la tarea.";

const els = {
  addErrorSlot: document.querySelector("#add-error-slot"),
  readSlot: document.querySelector("#read-slot"),
  emptySlot: document.querySelector("#empty-slot"),
  list: document.querySelector("#task-list"),
  addField: document.querySelector("#add-field"),
  addForm: document.querySelector("#add-form"),
};

// El límite sale de MAX_TEXT_LENGTH para que el 200 esté en un solo sitio.
els.addField.maxLength = MAX_TEXT_LENGTH;

function buildEditRow(task, open) {
  const item = document.createElement("li");
  item.className = "task-row";
  item.dataset.id = task.id;

  const check = document.createElement("input");
  check.type = "checkbox";
  check.className = "task-check";
  check.dataset.control = "check";
  check.checked = task.completed;
  check.disabled = true;
  check.setAttribute("aria-label", task.text);

  const form = document.createElement("form");
  form.className = "edit-form";
  form.noValidate = true;

  const field = document.createElement("input");
  field.type = "text";
  field.className = open.error ? "field is-invalid" : "field";
  field.dataset.control = "field";
  field.maxLength = MAX_TEXT_LENGTH;
  field.autocomplete = "off";
  field.value = open.value;
  field.setAttribute("aria-label", `Editar tarea: ${task.text}`);
  form.append(field);

  if (open.error) {
    const error = document.createElement("p");
    error.className = "notice notice-error";
    error.setAttribute("role", "alert");
    error.textContent = EDIT_ERROR;
    form.append(error);
  }

  const actions = document.createElement("div");
  actions.className = "task-actions";
  const save = document.createElement("button");
  save.type = "submit";
  save.className = "button button-primary";
  save.dataset.control = "save";
  save.textContent = "Guardar";
  save.setAttribute("aria-label", `Guardar cambios de: ${task.text}`);
  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.className = "button";
  cancel.dataset.control = "cancel";
  cancel.textContent = "Cancelar";
  cancel.setAttribute("aria-label", `Cancelar edición de: ${task.text}`);
  actions.append(save, cancel);
  form.append(actions);

  item.append(check, form);
  return item;
}

function buildConfirmRow(task) {
  const item = document.createElement("li");
  item.className = "task-row is-confirming";
  item.dataset.id = task.id;

  const check = document.createElement("input");
  check.type = "checkbox";
  check.className = "task-check";
  check.dataset.control = "check";
  check.checked = task.completed;
  check.disabled = true;
  check.setAttribute("aria-label", task.text);

  const text = document.createElement("span");
  text.className = task.completed ? "task-text is-completed" : "task-text";
  text.dataset.testid = "task-text";
  text.textContent = task.text;

  const question = document.createElement("p");
  question.className = "confirm-question";
  question.textContent = "¿Borrar esta tarea?";

  const actions = document.createElement("div");
  actions.className = "task-actions";
  const del = document.createElement("button");
  del.type = "button";
  del.className = "button button-danger";
  del.dataset.control = "confirm-delete";
  del.textContent = "Borrar";
  del.setAttribute("aria-label", `Borrar tarea: ${task.text}`);
  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.className = "button";
  cancel.dataset.control = "cancel-delete";
  cancel.textContent = "Cancelar";
  cancel.setAttribute("aria-label", `Cancelar borrado de: ${task.text}`);
  actions.append(del, cancel);

  item.append(check, text, question, actions);
  return item;
}

function buildRow(task) {
  if (state.openRow && state.openRow.id === task.id && state.openRow.mode === "confirm") {
    return buildConfirmRow(task);
  }
  if (state.openRow && state.openRow.id === task.id && state.openRow.mode === "edit") {
    return buildEditRow(task, state.openRow);
  }
  const item = document.createElement("li");
  item.className = "task-row";
  item.dataset.id = task.id;

  const check = document.createElement("input");
  check.type = "checkbox";
  check.className = "task-check";
  check.dataset.control = "check";
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
      const control = row.querySelector(`[data-control="${target.control}"]`);
      control?.focus();
      // Al abrir la edición el texto queda seleccionado (RF-04).
      if (target.select && control) control.select();
      return;
    }
  }
}

function render() {
  // Los contenedores existen desde el principio para que el lector anuncie lo que entra (DP-06).
  // El error va justo bajo el formulario y el aviso de lectura después; el de lectura solo se
  // reconstruye si cambia, para no anunciarlo de nuevo en cada redibujado.
  if (state.addError) {
    const error = document.createElement("p");
    error.className = "notice notice-error";
    error.textContent = ADD_ERROR;
    els.addErrorSlot.replaceChildren(error);
  } else {
    els.addErrorSlot.replaceChildren();
  }
  els.addField.classList.toggle("is-invalid", state.addError);
  if (!state.readable && els.readSlot.children.length === 0) {
    const warning = document.createElement("p");
    warning.className = "notice notice-warn";
    warning.textContent = READ_WARNING;
    els.readSlot.replaceChildren(warning);
  } else if (state.readable) {
    els.readSlot.replaceChildren();
  }
  // El mensaje de vacío solo existe en el DOM cuando toca.
  if (state.tasks.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "Añade tu primera tarea.";
    els.emptySlot.replaceChildren(empty);
  } else {
    els.emptySlot.replaceChildren();
  }
  els.list.hidden = state.tasks.length === 0;
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

// Completar o desmarcar: setCompleted recoloca la tarea; el foco sigue a la casilla.
els.list.addEventListener("change", (event) => {
  const check = event.target;
  if (!check.classList?.contains("task-check")) return;
  const id = check.closest(".task-row").dataset.id;
  state.tasks = setCompleted(state.tasks, id, check.checked);
  state.readable = true;
  saveTasks(state.tasks);
  state.focus = { id, control: "check" };
  render();
});

function closeEdit() {
  const id = state.openRow.id;
  state.openRow = null;
  state.focus = { id, control: "edit" };
  render();
}

function closeConfirm() {
  const id = state.openRow.id;
  state.openRow = null;
  state.focus = { id, control: "delete" };
  render();
}

// Editar: abre la fila con el texto seleccionado; lo escrito vive en el estado.
els.list.addEventListener("click", (event) => {
  const button = event.target.closest?.("button");
  if (!button) return;
  const id = button.closest(".task-row").dataset.id;
  const control = button.dataset.control;
  if (control === "edit") {
    const task = state.tasks.find((t) => t.id === id);
    state.openRow = { id, mode: "edit", value: task.text, error: false };
    state.focus = { id, control: "field", select: true };
    render();
  } else if (control === "cancel" && state.openRow?.mode === "edit") {
    closeEdit();
  } else if (control === "delete") {
    state.openRow = { id, mode: "confirm" };
    state.focus = { id, control: "cancel-delete" };
    render();
  } else if (control === "cancel-delete") {
    closeConfirm();
  } else if (control === "confirm-delete") {
    state.tasks = removeTask(state.tasks, id);
    state.readable = true;
    saveTasks(state.tasks);
    state.openRow = null;
    state.focus = { field: true };
    render();
  }
});

els.list.addEventListener("input", (event) => {
  if (event.target.dataset?.control === "field" && state.openRow) {
    state.openRow.value = event.target.value;
  }
});

els.list.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!state.openRow || state.openRow.mode !== "edit") return;
  const next = editTask(state.tasks, state.openRow.id, state.openRow.value);
  if (next === null) {
    state.openRow.error = true;
    state.focus = { id: state.openRow.id, control: "field" };
    render();
    return;
  }
  state.tasks = next;
  state.readable = true;
  saveTasks(state.tasks);
  closeEdit();
});

els.list.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || !state.openRow) return;
  if (state.openRow.mode === "edit") closeEdit();
  else if (state.openRow.mode === "confirm") closeConfirm();
});

render();
