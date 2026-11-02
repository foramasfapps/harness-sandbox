import { expect, test } from "@playwright/test";
import {
  MESSAGES,
  cancelButton,
  deleteButton,
  editButton,
  expectList,
  expectMessage,
  expectNoMessage,
  openConfirm,
  row,
  rows,
  seedTasks,
  taskText,
} from "./helpers.js";

async function expectBackToNormal(page) {
  await expectList(page, ["C", "B", "A"]);
  await expectNoMessage(page, MESSAGES.confirm);
  await expect(editButton(row(page, 1))).toHaveText("Editar");
  await expect(editButton(row(page, 1))).toBeVisible();
  await expect(deleteButton(row(page, 1))).toHaveText("Borrar");
  await expect(deleteButton(row(page, 1))).toBeVisible();
  await expect(cancelButton(row(page, 1))).toHaveCount(0);
}

test("CA-20: Borrar asks for confirmation in the row and keeps its text", async ({ page }) => {
  await seedTasks(page, ["C", "B", "A"]);

  await deleteButton(row(page, 1)).click();

  const taskRow = row(page, 1);
  await expect(taskRow.getByText(MESSAGES.confirm, { exact: true })).toBeVisible();
  await expect(deleteButton(taskRow)).toHaveText("Borrar");
  await expect(deleteButton(taskRow)).toBeVisible();
  await expect(cancelButton(taskRow)).toHaveText("Cancelar");
  await expect(cancelButton(taskRow)).toBeVisible();
  await expect(taskText(taskRow)).toHaveJSProperty("textContent", "B");
  await expect(taskText(taskRow)).toBeVisible();
  await expect(editButton(taskRow)).toHaveCount(0);
  await expect(rows(page)).toHaveCount(3);
});

test("CA-21: Cancelar closes the confirmation without deleting", async ({ page }) => {
  await seedTasks(page, ["C", "B", "A"]);
  await openConfirm(page, 1);

  await cancelButton(row(page, 1)).click();

  await expectBackToNormal(page);
});

test("CA-22: confirming deletes the task, also after reloading", async ({ page }) => {
  await seedTasks(page, ["C", "B", "A"]);
  await openConfirm(page, 1);

  await deleteButton(row(page, 1)).click();
  await expectList(page, ["C", "A"]);

  await page.reload();
  await expectList(page, ["C", "A"]);
});

test("CA-23: deleting the last task shows the empty message after reloading", async ({ page }) => {
  await seedTasks(page, ["Pan"]);
  await openConfirm(page, 0);

  await deleteButton(row(page, 0)).click();
  await expect(rows(page)).toHaveCount(0);

  await page.reload();
  await expect(rows(page)).toHaveCount(0);
  await expectMessage(page, MESSAGES.empty);
  await expectNoMessage(page, MESSAGES.readWarning);
});

test("CA-37: a completed task can be deleted", async ({ page }) => {
  await seedTasks(page, ["C", "A", "B✓"]);
  await openConfirm(page, 2);

  await deleteButton(row(page, 2)).click();
  await expect(rows(page)).toHaveCount(2);

  await page.reload();
  await expectList(page, ["C", "A"]);
});

test("CA-48: Esc closes the confirmation without deleting", async ({ page }) => {
  await seedTasks(page, ["C", "B", "A"]);
  await openConfirm(page, 1);

  await page.keyboard.press("Escape");

  await expectBackToNormal(page);
});
