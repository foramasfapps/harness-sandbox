import { expect, test } from "@playwright/test";
import {
  MESSAGES,
  addButton,
  addField,
  cancelButton,
  checkbox,
  deleteButton,
  editButton,
  editField,
  expectEditing,
  expectList,
  expectMessage,
  openConfirm,
  openEdit,
  pressChecked,
  row,
  saveButton,
  seedTasks,
  tabTo,
} from "./helpers.js";

test("CA-28: the whole flow works with the keyboard and with visible focus", async ({ page }) => {
  await seedTasks(page, ["B", "A"]);

  await test.step("(a) add C", async () => {
    await pressChecked(page, "Tab");
    await expect(addField(page)).toBeFocused();
    await pressChecked(page, "C");
    await pressChecked(page, "Enter");
    await expectList(page, ["C", "B", "A"]);
    await expect(addField(page)).toBeFocused();
  });

  await test.step("(b) Space on the checkbox of C", async () => {
    await tabTo(page, checkbox(row(page, 0)));
    await pressChecked(page, "Space");
    await expectList(page, ["B", "A", "C✓"]);
    await expect(checkbox(row(page, 2))).toBeFocused();
  });

  await test.step("(c) Enter on Editar of B, type B2 and Enter", async () => {
    await tabTo(page, editButton(row(page, 0)), "Shift+Tab");
    await pressChecked(page, "Enter");
    await expect(editField(row(page, 0))).toBeFocused();
    await pressChecked(page, "B");
    await pressChecked(page, "2");
    await pressChecked(page, "Enter");
    await expectList(page, ["B2", "A", "C✓"]);
    await expect(editButton(row(page, 0))).toBeFocused();
  });

  await test.step("(d) Enter on Borrar of A, reach Borrar in the confirmation and Enter", async () => {
    await tabTo(page, deleteButton(row(page, 1)));
    await pressChecked(page, "Enter");
    await expect(cancelButton(row(page, 1))).toBeFocused();
    await tabTo(page, deleteButton(row(page, 1)), "Shift+Tab");
    await pressChecked(page, "Enter");
    await expectList(page, ["B2", "C✓"]);
    await expect(addField(page)).toBeFocused();
  });
});

// CA-28 remite a RN-15, pero su recorrido no pasa por las cancelaciones. Aquí se recorre el resto
// de RN-15, los focos DP-02 y DP-03 de states.md y la nota de T-10 sobre abrir otra fila.
test("CA-28: the rest of RN-15 when cancelling, failing validation and opening another row", async ({ page }) => {
  await seedTasks(page, ["C", "B", "A"]);

  await test.step("Añadir with empty text returns the focus to the field (DP-02)", async () => {
    await pressChecked(page, "Tab");
    await tabTo(page, addButton(page));
    await pressChecked(page, "Enter");
    await expectMessage(page, MESSAGES.addError);
    await expect(addField(page)).toBeFocused();
  });

  await test.step("Esc in the edit goes back to Editar of that row", async () => {
    await tabTo(page, editButton(row(page, 1)));
    await pressChecked(page, "Enter");
    await expect(editField(row(page, 1))).toBeFocused();
    await pressChecked(page, "Escape");
    await expectList(page, ["C", "B", "A"]);
    await expect(editButton(row(page, 1))).toBeFocused();
  });

  await test.step("Cancelar in the edit goes back to Editar of that row", async () => {
    await pressChecked(page, "Enter");
    await tabTo(page, cancelButton(row(page, 1)));
    await pressChecked(page, "Enter");
    await expect(editButton(row(page, 1))).toBeFocused();
  });

  await test.step("saving an empty text keeps the focus on the edit field (DP-03)", async () => {
    await pressChecked(page, "Enter");
    await pressChecked(page, "Backspace");
    await pressChecked(page, "Enter");
    await expectMessage(page, MESSAGES.editError);
    await expect(editField(row(page, 1))).toBeFocused();
    await pressChecked(page, "Escape");
    await expect(editButton(row(page, 1))).toBeFocused();
  });

  await test.step("Esc in the confirmation goes back to Borrar of that row", async () => {
    await tabTo(page, deleteButton(row(page, 1)));
    await pressChecked(page, "Enter");
    await expect(cancelButton(row(page, 1))).toBeFocused();
    await pressChecked(page, "Escape");
    await expect(deleteButton(row(page, 1))).toBeFocused();
  });

  await test.step("Cancelar in the confirmation goes back to Borrar of that row", async () => {
    await pressChecked(page, "Enter");
    await expect(cancelButton(row(page, 1))).toBeFocused();
    await pressChecked(page, "Enter");
    await expect(deleteButton(row(page, 1))).toBeFocused();
  });

  await test.step("opening another row moves the focus to it", async () => {
    await pressChecked(page, "Enter");
    await tabTo(page, editButton(row(page, 2)));
    await pressChecked(page, "Enter");
    await expect(editField(row(page, 2))).toBeFocused();
    await expectEditing(row(page, 2), "A");
    await expect(deleteButton(row(page, 1))).toHaveText("Borrar");
  });
});

test("CA-45: the accessible names match the table in states.md and name task B", async ({ page }) => {
  await seedTasks(page, ["C", "B", "A"]);
  const taskRow = row(page, 1);

  await test.step("normal row", async () => {
    await expect(addField(page)).toHaveAccessibleName("Nueva tarea");
    await expect(checkbox(taskRow)).toHaveAccessibleName("B");
    await expect(editButton(taskRow)).toHaveAccessibleName("Editar tarea: B");
    await expect(deleteButton(taskRow)).toHaveAccessibleName("Borrar tarea: B");
  });

  await test.step("editing, also after typing another text", async () => {
    await openEdit(page, 1);
    const check = async () => {
      await expect(checkbox(taskRow)).toHaveAccessibleName("B");
      await expect(editField(taskRow)).toHaveAccessibleName("Editar tarea: B");
      await expect(saveButton(taskRow)).toHaveAccessibleName("Guardar cambios de: B");
      await expect(cancelButton(taskRow)).toHaveAccessibleName("Cancelar edición de: B");
    };
    await check();
    // Marcar A redibuja la lista: el nombre debe seguir usando el texto guardado, no "B2".
    await editField(taskRow).fill("B2");
    await checkbox(row(page, 2)).click();
    await expect(editField(taskRow)).toHaveValue("B2");
    await check();
    await cancelButton(taskRow).click();
  });

  await test.step("confirming", async () => {
    await openConfirm(page, 1);
    await expect(checkbox(taskRow)).toHaveAccessibleName("B");
    await expect(deleteButton(taskRow)).toHaveAccessibleName("Borrar tarea: B");
    await expect(cancelButton(taskRow)).toHaveAccessibleName("Cancelar borrado de: B");
  });
});
