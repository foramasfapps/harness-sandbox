// Comprobaciones de QA sobre T-05 a T-08 que ningún CA cubre (qa-report.md). Las de "Huecos" pasan
// y protegen lo que ya funciona; las de "Fallos" están en rojo hasta que su tarea lo arregle.
// Ningún título cita un CA con dos puntos, para que el filtro "verify" de cada tarea no las seleccione.
import { expect, test } from "@playwright/test";
import {
  MESSAGES,
  addButton,
  addField,
  addTask,
  breakSetItem,
  cancelButton,
  checkbox,
  deleteButton,
  editButton,
  editField,
  expectEditing,
  expectList,
  expectMessage,
  expectNoMessage,
  expectRow,
  list,
  openConfirm,
  openEdit,
  readRaw,
  readStored,
  row,
  saveButton,
  seedRaw,
  seedTasks,
  taskText,
} from "./helpers.js";

const SURFACE_LIGHT = "rgb(255, 255, 255)";
const BORDER_LIGHT = "rgb(127, 137, 152)";
const FG_LIGHT = "rgb(27, 31, 39)";
const MUTED_LIGHT = "rgb(90, 100, 114)";
const ERROR_LIGHT = "rgb(198, 40, 40)";

const OTHER_CONTROLS = [
  ["the checkbox of another row", (page) => checkbox(row(page, 0))],
  ["Editar of another row", (page) => editButton(row(page, 0))],
  ["Borrar of another row", (page) => deleteButton(row(page, 0))],
  ["the add field", (page) => addField(page)],
];

// ── Huecos: el arreglo de Esc de T-08, sin test en el repositorio hasta ahora ───────────────────
for (const [name, control] of OTHER_CONTROLS) {
  test(`RN-14: Esc on ${name} keeps the open edit and what was typed`, async ({ page }) => {
    await seedTasks(page, ["C", "B", "A"]);
    await openEdit(page, 1);
    await editField(row(page, 1)).fill("B2");

    await control(page).focus();
    await page.keyboard.press("Escape");

    await expectEditing(row(page, 1), "B2");
    await expectRow(row(page, 0), "C");
  });

  test(`RN-14: Esc on ${name} keeps the open confirmation`, async ({ page }) => {
    await seedTasks(page, ["C", "B", "A"]);
    await openConfirm(page, 1);

    await control(page).focus();
    await page.keyboard.press("Escape");

    await expect(row(page, 1).getByText(MESSAGES.confirm, { exact: true })).toBeVisible();
    await expect(editButton(row(page, 1))).toHaveCount(0);
  });
}

test("plan.md decision 5: Esc cancels the edit from every control of the open row", async ({ page }) => {
  for (const control of [editField, saveButton, cancelButton]) {
    await seedTasks(page, ["C", "B", "A"]);
    await openEdit(page, 1);
    await editField(row(page, 1)).fill("B2");

    await control(row(page, 1)).focus();
    await page.keyboard.press("Escape");

    await expectList(page, ["C", "B", "A"]);
    await expect(editButton(row(page, 1))).toBeFocused();
  }
});

test("plan.md decision 5: Esc cancels the confirmation from both of its buttons", async ({ page }) => {
  for (const control of [deleteButton, cancelButton]) {
    await seedTasks(page, ["C", "B", "A"]);
    await openConfirm(page, 1);

    await control(row(page, 1)).focus();
    await page.keyboard.press("Escape");

    await expectNoMessage(page, MESSAGES.confirm);
    await expectList(page, ["C", "B", "A"]);
    await expect(deleteButton(row(page, 1))).toBeFocused();
  }
});

// ── Huecos: lo que CA-33 y CA-35 no llegan a comprobar ──────────────────────────────────────────
test("RN-14: the edit error stays when checking another row and goes away when opening another", async ({ page }) => {
  await seedTasks(page, ["C", "B", "A"]);
  await openEdit(page, 1);
  await editField(row(page, 1)).fill("");
  await saveButton(row(page, 1)).click();
  await expectMessage(page, MESSAGES.editError);

  await checkbox(row(page, 0)).click();
  await expectEditing(row(page, 0), "");
  await expectMessage(page, MESSAGES.editError);

  await editButton(row(page, 1)).click();
  await expect(editField(row(page, 1))).toHaveValue("A");
  await expectNoMessage(page, MESSAGES.editError);
  await expectRow(row(page, 0), "B");

  await openEdit(page, 0);
  await expect(editField(row(page, 0))).toHaveValue("B");
  await expectNoMessage(page, MESSAGES.editError);
});

test("RN-14: after opening another row, the previous edit starts again from the saved text", async ({ page }) => {
  await seedTasks(page, ["C", "B", "A"]);
  await openEdit(page, 1);
  await editField(row(page, 1)).fill("B2");

  await deleteButton(row(page, 2)).click();
  await openEdit(page, 1);

  await expect(editField(row(page, 1))).toHaveValue("B");
  await expect(editField(row(page, 1))).toHaveJSProperty("selectionStart", 0);
  await expect(editField(row(page, 1))).toHaveJSProperty("selectionEnd", 1);
});

test("RN-14 and RN-15: what was typed can still be saved after adding and checking, with the focus where it belongs", async ({ page }) => {
  await seedTasks(page, ["C", "B", "A"]);
  await openEdit(page, 1);
  await editField(row(page, 1)).fill("B2");

  await addTask(page, "D");
  await expect(addField(page)).toBeFocused();
  await expectEditing(row(page, 2), "B2");

  await checkbox(row(page, 1)).click();
  await expect(checkbox(row(page, 3))).toBeFocused();
  await expectEditing(row(page, 1), "B2");

  await saveButton(row(page, 1)).click();
  await expectList(page, ["D", "B2", "A", "C✓"]);
  await expect(editButton(row(page, 1))).toBeFocused();
});

test("RN-14: adding and checking keep the open confirmation, and confirming deletes the right task", async ({ page }) => {
  await seedTasks(page, ["C", "B", "A"]);
  await openConfirm(page, 1);

  await checkbox(row(page, 0)).click();
  await expect(row(page, 0).getByText(MESSAGES.confirm, { exact: true })).toBeVisible();
  await expect(taskText(row(page, 0))).toHaveText("B");
  await expect(checkbox(row(page, 2))).toBeFocused();

  await addTask(page, "D");
  await expect(row(page, 1).getByText(MESSAGES.confirm, { exact: true })).toBeVisible();
  await expect(addField(page)).toBeFocused();

  await deleteButton(row(page, 1)).click();
  await expectList(page, ["D", "A", "C✓"]);
  await expect(addField(page)).toBeFocused();
});

test("RN-04 and states.md: a completed task keeps its look while it is being edited or confirmed", async ({ page }) => {
  await seedTasks(page, ["C", "A", "B✓"]);

  await openEdit(page, 2);
  await expect(checkbox(row(page, 2))).toBeChecked();
  await expect(checkbox(row(page, 2))).toBeDisabled();
  await page.keyboard.press("Escape");
  await expectList(page, ["C", "A", "B✓"]);

  await openConfirm(page, 2);
  await expect(checkbox(row(page, 2))).toBeChecked();
  await expect(checkbox(row(page, 2))).toBeDisabled();
  await expect(taskText(row(page, 2))).toHaveCSS("text-decoration-line", "line-through");
  await page.keyboard.press("Escape");
  await expectList(page, ["C", "A", "B✓"]);
});

test("plan.md decision 7: opening, cancelling and a rejected save never write; saving without changes does", async ({ page }) => {
  await seedTasks(page, ["C", "B", "A"]);
  await page.addInitScript(() => {
    const original = Storage.prototype.setItem;
    window.__writes = 0;
    Storage.prototype.setItem = function setItem(key, value) {
      window.__writes += 1;
      return original.call(this, key, value);
    };
  });
  await page.reload();
  const expectWrites = async (count) =>
    expect(await page.evaluate(() => window.__writes)).toBe(count);

  await openEdit(page, 1);
  await expectWrites(0);

  await editField(row(page, 1)).fill("");
  await saveButton(row(page, 1)).click();
  await expectMessage(page, MESSAGES.editError);
  await expectWrites(0);

  await cancelButton(row(page, 1)).click();
  await openConfirm(page, 1);
  await cancelButton(row(page, 1)).click();
  await expectWrites(0);

  await openEdit(page, 1);
  await saveButton(row(page, 1)).click();
  await expect(editButton(row(page, 1))).toBeVisible();
  await expectWrites(1);
});

test("plan.md decision 6: the limit of the edit field comes from MAX_TEXT_LENGTH", async ({ page }) => {
  await page.route("**/src/tasks.js", async (route) => {
    const response = await route.fetch();
    const body = (await response.text()).replace("MAX_TEXT_LENGTH = 200", "MAX_TEXT_LENGTH = 10");
    await route.fulfill({ response, body });
  });
  await seedTasks(page, ["B"]);

  await openEdit(page, 0);

  await expect(editField(row(page, 0))).toHaveJSProperty("maxLength", 10);
});

// ── Huecos: cambios inyectados que ningún CA detectaba ──────────────────────────────────────────
// CA-36 borra la primera "Pan": borrar siempre la primera repetida también lo pasaba.
test("RN-09: deleting the second of two repeated tasks keeps the first one", async ({ page }) => {
  await seedTasks(page, ["Pan", "Pan"]);
  await openConfirm(page, 1);

  await deleteButton(row(page, 1)).click();

  await expectList(page, ["Pan"]);
  expect((await readStored(page)).map(({ id }) => id)).toEqual(["t1"]);
});

test("DP-06 and states.md: the edit error is announced and its field has a 2 px border in --error", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await seedTasks(page, ["B"]);
  await openEdit(page, 0);

  await editField(row(page, 0)).fill("");
  await saveButton(row(page, 0)).click();

  const message = row(page, 0).getByText(MESSAGES.editError, { exact: true });
  expect(await message.evaluate((element) => element.closest('[role="alert"], [aria-live="assertive"], [aria-live="polite"]') !== null)).toBe(true);
  await expect(message).toHaveCSS("color", ERROR_LIGHT);
  await expect(editField(row(page, 0))).toHaveCSS("border-top-width", "2px");
  await expect(editField(row(page, 0))).toHaveCSS("border-top-color", ERROR_LIGHT);
});

test("states.md: the confirmation has a destructive Borrar and the question in --fg with weight 600", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await seedTasks(page, ["B"]);

  await openConfirm(page, 0);

  const confirmDelete = deleteButton(row(page, 0));
  await expect(confirmDelete).toHaveCSS("border-top-color", ERROR_LIGHT);
  await expect(confirmDelete).toHaveCSS("color", ERROR_LIGHT);
  await expect(confirmDelete).toHaveCSS("background-color", SURFACE_LIGHT);
  const question = row(page, 0).getByText(MESSAGES.confirm, { exact: true });
  await expect(question).toHaveCSS("color", FG_LIGHT);
  await expect(question).toHaveCSS("font-weight", "600");
});

test("states.md: a completed task is shown in --muted", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await seedTasks(page, ["A", "B✓"]);

  await expect(taskText(row(page, 1))).toHaveCSS("color", MUTED_LIGHT);
  await expect(taskText(row(page, 0))).toHaveCSS("color", FG_LIGHT);
});

// ── Fallos encontrados a mano ───────────────────────────────────────────────────────────────────
// Lo arregla T-09: hoy src/app.js quita el aviso de lectura sin mirar lo que devuelve saveTasks.
test("RN-13: completing, editing and deleting that cannot be saved keep the read warning and the unreadable value", async ({ page }) => {
  await seedRaw(page, "no-es-json");
  await breakSetItem(page);
  await page.reload();

  const expectStillUnreadable = async () => {
    await expectMessage(page, MESSAGES.readWarning);
    expect(await readRaw(page)).toBe("no-es-json");
  };

  await addTask(page, "Pan");
  await expectStillUnreadable();

  await checkbox(row(page, 0)).click();
  await expectRow(row(page, 0), "Pan✓");
  await expectStillUnreadable();

  await openEdit(page, 0);
  await editField(row(page, 0)).fill("Pan2");
  await saveButton(row(page, 0)).click();
  await expectRow(row(page, 0), "Pan2✓");
  await expectStillUnreadable();

  await openConfirm(page, 0);
  await deleteButton(row(page, 0)).click();
  await expect(list(page)).toHaveCount(0);
  await expectStillUnreadable();
});

// Lo arregla T-10: el redibujado vuelve a crear los dos mensajes dentro de role="alert".
test("DP-06: a redraw does not announce again the errors that are already visible", async ({ page }) => {
  await seedTasks(page, ["C", "B", "A"]);
  await openEdit(page, 1);
  await editField(row(page, 1)).fill("");
  await saveButton(row(page, 1)).click();
  await addButton(page).click();
  await expectMessage(page, MESSAGES.editError);
  await expectMessage(page, MESSAGES.addError);

  await page.evaluate(() => {
    const live = '[role="alert"], [role="status"], [aria-live]:not([aria-live="off"])';
    window.__announced = [];
    new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          const element = node.nodeType === 1 ? node : node.parentElement;
          const announces = element.closest(live) || element.querySelector(live);
          if (announces && announces.textContent) window.__announced.push(announces.textContent);
        }
      }
    }).observe(document.body, { childList: true, subtree: true });
  });

  await checkbox(row(page, 0)).click();
  await expectRow(row(page, 2), "C✓");
  await expectMessage(page, MESSAGES.editError);
  await expectMessage(page, MESSAGES.addError);

  expect(await page.evaluate(() => window.__announced)).toEqual([]);
});

// Lo arregla T-11, "Estilos de fila y móvil según states.md".
test("states.md: Guardar is a secondary button, because Añadir is the only primary one", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await seedTasks(page, ["B"]);

  await openEdit(page, 0);

  const save = saveButton(row(page, 0));
  await expect(save).toHaveCSS("background-color", SURFACE_LIGHT);
  await expect(save).toHaveCSS("color", FG_LIGHT);
  await expect(save).toHaveCSS("border-top-color", BORDER_LIGHT);
});

test("states.md: the disabled checkbox has reduced opacity and a not-allowed cursor", async ({ page }) => {
  await seedTasks(page, ["B"]);

  await openEdit(page, 0);

  const style = await checkbox(row(page, 0)).evaluate((element) => {
    const computed = getComputedStyle(element);
    return { opacity: Number(computed.opacity), cursor: computed.cursor };
  });
  expect(style.opacity).toBeLessThan(1);
  expect(style.cursor).toBe("not-allowed");
});

test("states.md: from 480 px on, Guardar and Cancelar go to the right of the edit field", async ({ page }) => {
  await seedTasks(page, ["B"]);

  await openEdit(page, 0);

  const field = await editField(row(page, 0)).boundingBox();
  const save = await saveButton(row(page, 0)).boundingBox();
  expect(save.x).toBeGreaterThanOrEqual(field.x + field.width);
  expect(save.y).toBeLessThan(field.y + field.height);
});
