// Ayudantes de los tests de aceptación de "tareas". Siguen el contrato de Interfaces de plan.md.
import { expect } from "@playwright/test";

export const STORAGE_KEY = "tasks.v1";

export const MESSAGES = {
  empty: "Añade tu primera tarea.",
  addError: "Escribe algo para añadir la tarea.",
  editError: "Escribe algo para guardar la tarea.",
  saveWarning: "No se han podido guardar los cambios.",
  readWarning: "No se han podido leer tus tareas guardadas. Si haces un cambio, se reemplazarán.",
  confirm: "¿Borrar esta tarea?",
};

// ── Localizadores ───────────────────────────────────────────────────────────
export const addField = (page) => page.getByRole("textbox", { name: "Nueva tarea" });
export const addButton = (page) => page.getByRole("button", { name: "Añadir", exact: true });
export const list = (page) => page.getByRole("list", { name: "Tareas" });
export const rows = (page) => list(page).getByRole("listitem");
export const row = (page, index) => rows(page).nth(index);

export const taskText = (taskRow) => taskRow.getByTestId("task-text");
export const checkbox = (taskRow) => taskRow.getByRole("checkbox");
export const editButton = (taskRow) => taskRow.getByRole("button", { name: /^Editar/ });
export const deleteButton = (taskRow) => taskRow.getByRole("button", { name: /^Borrar/ });
export const saveButton = (taskRow) => taskRow.getByRole("button", { name: /^Guardar/ });
export const cancelButton = (taskRow) => taskRow.getByRole("button", { name: /^Cancelar/ });
export const editField = (taskRow) => taskRow.getByRole("textbox");

// ── Datos ───────────────────────────────────────────────────────────────────
// "B✓" es una tarea completada, con la notación del PRD. Los id son t1, t2… por posición.
export function toTasks(spec) {
  return spec.map((item, index) => {
    const completed = item.endsWith("✓");
    return {
      id: `t${index + 1}`,
      text: completed ? item.slice(0, -1) : item,
      completed,
    };
  });
}

// No usa addInitScript: se repetiría en cada recarga y falsearía los CA que recargan (plan.md).
export async function seedRaw(page, raw) {
  await page.goto("/");
  await page.evaluate(([key, value]) => localStorage.setItem(key, value), [STORAGE_KEY, raw]);
  await page.reload();
}

export const seedTasks = (page, spec) => seedRaw(page, JSON.stringify(toTasks(spec)));

export const readRaw = (page) =>
  page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);

export async function readStored(page) {
  return JSON.parse(await readRaw(page));
}

// ── Acciones ────────────────────────────────────────────────────────────────
export async function addTask(page, text) {
  await addField(page).fill(text);
  await addButton(page).click();
}

export async function openEdit(page, index) {
  await editButton(row(page, index)).click();
  await expect(editField(row(page, index))).toBeVisible();
}

export async function openConfirm(page, index) {
  await deleteButton(row(page, index)).click();
  await expect(row(page, index).getByText(MESSAGES.confirm, { exact: true })).toBeVisible();
}

// Pegado real con el portapapeles. Sin selección, se inserta donde esté el cursor.
export async function paste(page, target, text) {
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await target.focus();
  await page.evaluate((value) => navigator.clipboard.writeText(value), text);
  await page.keyboard.press("ControlOrMeta+V");
}

// ── Comprobaciones ──────────────────────────────────────────────────────────
export async function expectMessage(page, text) {
  await expect(page.getByText(text, { exact: true })).toBeVisible();
}

// "No se ve el aviso" significa, según el PRD, que el texto no está en la página.
export async function expectNoMessage(page, text) {
  await expect(page.locator("body")).not.toContainText(text);
}

export async function expectRow(taskRow, item) {
  const completed = item.endsWith("✓");
  const text = completed ? item.slice(0, -1) : item;
  await expect(taskText(taskRow)).toHaveJSProperty("textContent", text);
  if (completed) {
    await expect(checkbox(taskRow)).toBeChecked();
  } else {
    await expect(checkbox(taskRow)).not.toBeChecked();
  }
  await expect(taskText(taskRow)).toHaveCSS(
    "text-decoration-line",
    completed ? "line-through" : "none",
  );
}

export async function expectEditing(taskRow, value) {
  await expect(editField(taskRow)).toHaveValue(value);
  await expect(taskText(taskRow)).toHaveCount(0);
}

// Comprueba la pantalla y, salvo stored: false, también tasks.v1 (texto, completed y orden).
export async function expectList(page, spec, { stored = true } = {}) {
  await expect(rows(page)).toHaveCount(spec.length);
  for (const [index, item] of spec.entries()) {
    await expectRow(row(page, index), item);
  }
  if (stored) await expectStored(page, spec);
}

export async function expectStored(page, spec) {
  const expected = toTasks(spec).map(({ text, completed }) => ({ text, completed }));
  await expect
    .poll(async () =>
      (await readStored(page)).map(({ text, completed }) => ({ text, completed })),
    )
    .toEqual(expected);
}

// Reúne los errores de consola y las excepciones sin capturar de la página.
export function watchErrors(page) {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  return errors;
}

// ── Simular fallos ──────────────────────────────────────────────────────────
// Se instala tras preparar los datos y actúa desde la siguiente carga, también tras recargar.
export async function breakSetItem(page) {
  await page.addInitScript(() => {
    const original = Storage.prototype.setItem;
    window.__setItemFails = true;
    Storage.prototype.setItem = function setItem(key, value) {
      if (window.__setItemFails) {
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      }
      return original.call(this, key, value);
    };
  });
}

export async function restoreSetItem(page) {
  await page.evaluate(() => {
    window.__setItemFails = false;
  });
}

export async function blockLocalStorage(page) {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new DOMException("Access denied", "SecurityError");
      },
    });
  });
}

// ── Teclado ─────────────────────────────────────────────────────────────────
// CA-28: tras cada tecla, activeElement no es body y su outline-style calculado no es none.
export async function pressChecked(page, key) {
  await page.keyboard.press(key);
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const active = document.activeElement;
          if (!active || active === document.body) return "focus on body";
          return getComputedStyle(active).outlineStyle;
        }),
      { message: `visible focus after pressing ${key}` },
    )
    .toMatch(/^(?!none$)(?!focus on body$)/);
}

export async function tabTo(page, target, key = "Tab") {
  for (let presses = 0; presses < 15; presses += 1) {
    await pressChecked(page, key);
    if (await target.evaluate((element) => element === document.activeElement)) return;
  }
  throw new Error(`${key} never reached ${target}`);
}
