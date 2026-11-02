import { test } from "@playwright/test";
import { checkbox, expectList, row, seedTasks } from "./helpers.js";

// Se usa click() y no check(): la fila cambia de sitio al marcarla, y check() vuelve a
// comprobar el mismo elemento, que ya no está en la página.

test("CA-10: completing a task moves it to the end, struck through", async ({ page }) => {
  await seedTasks(page, ["C", "B", "A"]);

  await checkbox(row(page, 1)).click();

  await expectList(page, ["C", "A", "B✓"]);
});

test("CA-11: the last completed task goes after the other completed ones", async ({ page }) => {
  await seedTasks(page, ["C", "A", "B✓"]);

  await checkbox(row(page, 1)).click();

  await expectList(page, ["C", "B✓", "A✓"]);
});

test("CA-12: unchecking a task moves it to the start", async ({ page }) => {
  await seedTasks(page, ["C", "B✓", "A✓"]);

  await checkbox(row(page, 1)).click();

  await expectList(page, ["B", "C", "A✓"]);
});

test("CA-38: an unchecked task stays at the start after reloading", async ({ page }) => {
  await seedTasks(page, ["C", "B✓", "A✓"]);

  await checkbox(row(page, 1)).click();
  await page.reload();

  await expectList(page, ["B", "C", "A✓"]);
});

test("CA-47: a single task can be completed and then unchecked", async ({ page }) => {
  await seedTasks(page, ["A"]);

  await checkbox(row(page, 0)).click();
  await expectList(page, ["A✓"]);

  await checkbox(row(page, 0)).click();
  await expectList(page, ["A"]);
});
