import { expect, test } from "@playwright/test";
import {
  cancelButton,
  checkbox,
  deleteButton,
  editButton,
  openConfirm,
  openEdit,
  row,
  saveButton,
  seedTasks,
  taskText,
} from "./helpers.js";

const WIDTH = 360;

async function expectNoHorizontalScroll(page) {
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(WIDTH);
}

// "Se ven": visible y entero dentro de los 360 px de ancho.
async function expectSeen(locator) {
  await expect(locator).toBeVisible();
  const box = await locator.boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(WIDTH);
}

test("CA-44: a task of 200 characters without spaces fits in 360 px", async ({ page }) => {
  await page.setViewportSize({ width: WIDTH, height: 800 });
  await seedTasks(page, ["a".repeat(200)]);
  const taskRow = row(page, 0);

  await test.step("normal row", async () => {
    await expect(taskText(taskRow)).toHaveJSProperty("textContent", "a".repeat(200));
    await expectSeen(checkbox(taskRow));
    await expectSeen(editButton(taskRow));
    await expectSeen(deleteButton(taskRow));
    await expectNoHorizontalScroll(page);
  });

  // RF-12 habla de la pantalla entera; la nota de T-11 pide también estas dos filas.
  await test.step("editing", async () => {
    await openEdit(page, 0);
    await expectSeen(saveButton(taskRow));
    await expectSeen(cancelButton(taskRow));
    await expectNoHorizontalScroll(page);
    await cancelButton(taskRow).click();
  });

  await test.step("confirming", async () => {
    await openConfirm(page, 0);
    await expectSeen(deleteButton(taskRow));
    await expectSeen(cancelButton(taskRow));
    await expectNoHorizontalScroll(page);
  });
});
