import { expect, test } from "@playwright/test";
import {
  MESSAGES,
  addTask,
  cancelButton,
  checkbox,
  deleteButton,
  editButton,
  editField,
  expectEditing,
  expectList,
  expectMessage,
  expectNoMessage,
  openEdit,
  paste,
  readStored,
  row,
  rows,
  saveButton,
  seedTasks,
  taskText,
} from "./helpers.js";

async function showEditError(page) {
  await openEdit(page, 1);
  await editField(row(page, 1)).fill("");
  await saveButton(row(page, 1)).click();
  await expectMessage(page, MESSAGES.editError);
}

test("CA-09: HTML in a task is always literal", async ({ page }) => {
  const dialogs = [];
  page.on("dialog", async (dialog) => {
    dialogs.push(dialog.message());
    await dialog.dismiss();
  });
  const bold = "<b>hola</b>";
  const image = "<img src=x onerror=alert(1)>";
  const expectLiteral = async (text) => {
    await expect(taskText(row(page, 0))).toHaveJSProperty("textContent", text);
    await expect(row(page, 0).locator("b, img")).toHaveCount(0);
    expect(dialogs).toEqual([]);
  };

  await seedTasks(page, []);

  await addTask(page, bold);
  await expectLiteral(bold);

  await page.reload();
  await expectLiteral(bold);

  await openEdit(page, 0);
  await expect(editField(row(page, 0))).toHaveValue(bold);
  await expect(row(page, 0).locator("b, img")).toHaveCount(0);

  await editField(row(page, 0)).fill(image);
  await saveButton(row(page, 0)).click();
  await expectLiteral(image);

  await page.reload();
  await expectLiteral(image);
});

test("CA-13: Editar swaps the text and buttons for a field and Guardar and Cancelar", async ({ page }) => {
  await seedTasks(page, ["C", "B", "A"]);

  await editButton(row(page, 1)).click();

  const taskRow = row(page, 1);
  await expectEditing(taskRow, "B");
  await expect(saveButton(taskRow)).toHaveText("Guardar");
  await expect(saveButton(taskRow)).toBeVisible();
  await expect(cancelButton(taskRow)).toHaveText("Cancelar");
  await expect(cancelButton(taskRow)).toBeVisible();
  await expect(editButton(taskRow)).toHaveCount(0);
  await expect(deleteButton(taskRow)).toHaveCount(0);
  // RF-04: el texto queda seleccionado al abrir.
  await expect(editField(taskRow)).toHaveJSProperty("selectionStart", 0);
  await expect(editField(taskRow)).toHaveJSProperty("selectionEnd", 1);
  await expect(rows(page)).toHaveCount(3);
});

test("CA-14: Guardar keeps the position of the edited task", async ({ page }) => {
  await seedTasks(page, ["C", "B", "A"]);
  await openEdit(page, 1);

  await editField(row(page, 1)).fill("B2");
  await saveButton(row(page, 1)).click();

  await expectList(page, ["C", "B2", "A"]);
});

test("CA-15: Enter saves the edit", async ({ page }) => {
  await seedTasks(page, ["C", "B", "A"]);
  await openEdit(page, 1);

  await editField(row(page, 1)).fill("B2");
  await editField(row(page, 1)).press("Enter");

  await expectList(page, ["C", "B2", "A"]);
});

test("CA-16: Cancelar and Esc keep the original text", async ({ page }) => {
  await test.step("Cancelar", async () => {
    await seedTasks(page, ["C", "B", "A"]);
    await openEdit(page, 1);
    await editField(row(page, 1)).fill("B2");

    await cancelButton(row(page, 1)).click();

    await expectList(page, ["C", "B", "A"]);
  });

  await test.step("Esc", async () => {
    await seedTasks(page, ["C", "B", "A"]);
    await openEdit(page, 1);
    await editField(row(page, 1)).fill("B2");

    await editField(row(page, 1)).press("Escape");

    await expectList(page, ["C", "B", "A"]);
  });
});

test("CA-17: empty or blank text does not save in the 4 combinations", async ({ page }) => {
  const combinations = [
    { text: "", submit: "button" },
    { text: "", submit: "Enter" },
    { text: "   ", submit: "button" },
    { text: "   ", submit: "Enter" },
  ];

  for (const { text, submit } of combinations) {
    await test.step(`${JSON.stringify(text)} with ${submit}`, async () => {
      await seedTasks(page, ["C", "B", "A"]);
      await openEdit(page, 1);

      await editField(row(page, 1)).fill(text);
      if (submit === "button") {
        await saveButton(row(page, 1)).click();
      } else {
        await editField(row(page, 1)).press("Enter");
      }

      await expectMessage(page, MESSAGES.editError);
      await expectEditing(row(page, 1), text);

      await page.reload();
      await expectList(page, ["C", "B", "A"]);
    });
  }
});

test("CA-18: editing a completed task keeps its position and state", async ({ page }) => {
  await seedTasks(page, ["C", "A", "B✓"]);
  await openEdit(page, 2);

  await editField(row(page, 2)).fill("B2");
  await saveButton(row(page, 2)).click();

  await expectList(page, ["C", "A", "B2✓"]);
});

test("CA-19: the edit field keeps 200 characters when typing and when pasting", async ({ page }) => {
  const input = `${"a".repeat(200)}b`;
  const expected = "a".repeat(200);

  const check = async () => {
    await expect(editField(row(page, 1))).toHaveValue(expected);
    await saveButton(row(page, 1)).click();
    await expect(taskText(row(page, 1))).toHaveJSProperty("textContent", expected);
    expect((await readStored(page))[1].text).toBe(expected);
  };

  await test.step("typing", async () => {
    await seedTasks(page, ["C", "B", "A"]);
    await openEdit(page, 1);
    await editField(row(page, 1)).selectText();
    await editField(row(page, 1)).pressSequentially(input);
    await check();
  });

  await test.step("pasting", async () => {
    await seedTasks(page, ["C", "B", "A"]);
    await openEdit(page, 1);
    await editField(row(page, 1)).selectText();
    await paste(page, editField(row(page, 1)), input);
    await check();
  });
});

test("CA-24: every change survives a reload", async ({ page }) => {
  await page.goto("/");
  await addTask(page, "C");
  await addTask(page, "B");
  await addTask(page, "A");
  await expectList(page, ["A", "B", "C"]);

  await checkbox(row(page, 1)).click();
  await expectList(page, ["A", "C", "B✓"]);

  await openEdit(page, 1);
  await editField(row(page, 1)).fill("C2");
  await saveButton(row(page, 1)).click();
  await expectList(page, ["A", "C2", "B✓"]);

  await page.reload();
  await expectList(page, ["A", "C2", "B✓"]);
});

test("CA-39: spaces are removed when saving an edit", async ({ page }) => {
  await seedTasks(page, ["C", "B", "A"]);
  await openEdit(page, 1);

  await editField(row(page, 1)).fill("  B2  ");
  await saveButton(row(page, 1)).click();
  await expect(editField(row(page, 1))).toHaveCount(0);

  expect((await readStored(page))[1].text).toBe("B2");
});

test("CA-40: Cancelar and Esc clear the edit error and recover the text", async ({ page }) => {
  const check = async () => {
    await expectList(page, ["C", "B", "A"]);
    await expectNoMessage(page, MESSAGES.editError);
    await openEdit(page, 1);
    await expect(editField(row(page, 1))).toHaveValue("B");
    await expectNoMessage(page, MESSAGES.editError);
  };

  await test.step("Cancelar", async () => {
    await seedTasks(page, ["C", "B", "A"]);
    await showEditError(page);
    await cancelButton(row(page, 1)).click();
    await check();
  });

  await test.step("Esc", async () => {
    await seedTasks(page, ["C", "B", "A"]);
    await showEditError(page);
    await page.keyboard.press("Escape");
    await check();
  });
});

test("CA-41: a valid text clears the edit error and is saved", async ({ page }) => {
  await seedTasks(page, ["C", "B", "A"]);
  await showEditError(page);

  await editField(row(page, 1)).fill("B2");
  await saveButton(row(page, 1)).click();

  await expectList(page, ["C", "B2", "A"]);
  await expectNoMessage(page, MESSAGES.editError);
});
