import { expect, test } from "@playwright/test";
import {
  MESSAGES,
  addTask,
  blockLocalStorage,
  breakSetItem,
  checkbox,
  deleteButton,
  editField,
  expectList,
  expectMessage,
  expectNoMessage,
  expectStored,
  openConfirm,
  openEdit,
  restoreSetItem,
  row,
  saveButton,
  seedTasks,
  watchErrors,
} from "./helpers.js";

// Los datos se preparan antes de romper setItem; el fallo actúa desde la siguiente carga.
async function openWithBrokenSetItem(page, spec) {
  await seedTasks(page, spec);
  await breakSetItem(page);
  await page.reload();
}

// Aquí "B✓" no puede incluir completed: true en tasks.v1, porque el guardado falla a propósito:
// se comprueba la pantalla y, aparte, que lo guardado no ha cambiado.
test("CA-25: the list keeps working and warns after every change that cannot be saved", async ({ page }) => {
  await openWithBrokenSetItem(page, ["B", "A"]);

  const expectStep = async (spec) => {
    await expectMessage(page, MESSAGES.saveWarning);
    await expectList(page, spec, { stored: false });
    await expectStored(page, ["B", "A"]);
  };

  await addTask(page, "Pan");
  await expectStep(["Pan", "B", "A"]);

  await checkbox(row(page, 1)).click();
  await expectStep(["Pan", "A", "B✓"]);

  await openEdit(page, 1);
  await editField(row(page, 1)).fill("A2");
  await saveButton(row(page, 1)).click();
  await expectStep(["Pan", "A2", "B✓"]);

  await openConfirm(page, 0);
  await deleteButton(row(page, 0)).click();
  await expectStep(["A2", "B✓"]);
});

test("CA-30: with blocked storage the page works and shows both warnings", async ({ page }) => {
  const errors = watchErrors(page);
  await blockLocalStorage(page);

  await page.goto("/");
  await expectMessage(page, MESSAGES.readWarning);
  await expectNoMessage(page, MESSAGES.saveWarning);

  await addTask(page, "Pan");

  await expectMessage(page, MESSAGES.readWarning);
  await expectMessage(page, MESSAGES.saveWarning);
  await expectList(page, ["Pan"], { stored: false });
  // DP-08: primero el de lectura, después el de guardado.
  const pageText = await page.locator("body").textContent();
  expect(pageText.indexOf(MESSAGES.readWarning)).toBeLessThan(
    pageText.indexOf(MESSAGES.saveWarning),
  );
  expect(errors.filter((error) => error.startsWith("pageerror"))).toEqual([]);
});

test("CA-31: the next correct save clears the warning and saves everything", async ({ page }) => {
  await openWithBrokenSetItem(page, ["B", "A"]);
  await addTask(page, "Pan");
  await expectMessage(page, MESSAGES.saveWarning);
  await expectList(page, ["Pan", "B", "A"], { stored: false });
  await expectStored(page, ["B", "A"]);

  await restoreSetItem(page);
  await checkbox(row(page, 1)).click();

  await expectNoMessage(page, MESSAGES.saveWarning);
  await expectList(page, ["Pan", "A", "B✓"]);

  await page.reload();
  await expectList(page, ["Pan", "A", "B✓"]);
  await expectNoMessage(page, MESSAGES.saveWarning);
});

test("CA-32: what could not be saved is lost on reload", async ({ page }) => {
  await openWithBrokenSetItem(page, ["B", "A"]);
  await addTask(page, "Pan");
  await expectMessage(page, MESSAGES.saveWarning);
  await expectList(page, ["Pan", "B", "A"], { stored: false });
  await expectStored(page, ["B", "A"]);

  await page.reload();

  await expectList(page, ["B", "A"]);
});
