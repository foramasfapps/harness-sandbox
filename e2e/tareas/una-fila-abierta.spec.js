import { expect, test } from "@playwright/test";
import {
  MESSAGES,
  addTask,
  checkbox,
  deleteButton,
  editButton,
  editField,
  expectEditing,
  expectList,
  expectRow,
  expectStored,
  list,
  openConfirm,
  openEdit,
  readStored,
  row,
  saveButton,
  seedTasks,
} from "./helpers.js";

async function expectOpenRows(page, { editing, confirming }) {
  await expect(list(page).getByRole("textbox")).toHaveCount(editing);
  await expect(list(page).getByText(MESSAGES.confirm, { exact: true })).toHaveCount(confirming);
}

async function editBWithB2(page) {
  await seedTasks(page, ["C", "B", "A"]);
  await openEdit(page, 1);
  await editField(row(page, 1)).fill("B2");
}

test("CA-33: opening another row cancels the previous one without saving", async ({ page }) => {
  await test.step("Editar on A", async () => {
    await editBWithB2(page);

    await editButton(row(page, 2)).click();

    await expect(editField(row(page, 2))).toHaveValue("A");
    await expectRow(row(page, 1), "B");
    await expectOpenRows(page, { editing: 1, confirming: 0 });
    await expectStored(page, ["C", "B", "A"]);
  });

  await test.step("Borrar on A", async () => {
    await editBWithB2(page);

    await deleteButton(row(page, 2)).click();

    await expect(row(page, 2).getByText(MESSAGES.confirm, { exact: true })).toBeVisible();
    await expectRow(row(page, 1), "B");
    await expectOpenRows(page, { editing: 0, confirming: 1 });
    await expectStored(page, ["C", "B", "A"]);
  });

  await test.step("RN-14 from a confirmation: Editar on A while B is confirming", async () => {
    await seedTasks(page, ["C", "B", "A"]);
    await openConfirm(page, 1);

    await editButton(row(page, 2)).click();

    await expect(editField(row(page, 2))).toHaveValue("A");
    await expectRow(row(page, 1), "B");
    await expect(editButton(row(page, 1))).toBeVisible();
    await expectOpenRows(page, { editing: 1, confirming: 0 });
    await expectStored(page, ["C", "B", "A"]);
  });
});

test("CA-34: the checkbox of the open row is disabled and the others are not", async ({ page }) => {
  const check = async () => {
    await expect(checkbox(row(page, 1))).toBeDisabled();
    await expect(checkbox(row(page, 0))).toBeEnabled();
  };

  await test.step("editing B", async () => {
    await seedTasks(page, ["C", "B", "A"]);
    await openEdit(page, 1);
    await check();
  });

  await test.step("confirming the deletion of B", async () => {
    await seedTasks(page, ["C", "B", "A"]);
    await openConfirm(page, 1);
    await check();
  });
});

test("CA-35: adding and checking another row keep the open edit and its text", async ({ page }) => {
  await test.step("adding D", async () => {
    await editBWithB2(page);

    await addTask(page, "D");

    await expectRow(row(page, 0), "D");
    await expectRow(row(page, 1), "C");
    await expectEditing(row(page, 2), "B2");
    await expectRow(row(page, 3), "A");
    await expectStored(page, ["D", "C", "B", "A"]);
  });

  await test.step("checking C", async () => {
    await editBWithB2(page);

    await checkbox(row(page, 0)).click();

    await expectEditing(row(page, 0), "B2");
    await expectRow(row(page, 1), "A");
    await expectRow(row(page, 2), "C✓");
    await expectStored(page, ["B", "A", "C✓"]);
  });
});

test("CA-36: with repeated texts each action affects only its own row", async ({ page }) => {
  // Se comprueba el id: "Pan, Pan✓" también saldría si se completara la fila equivocada.
  await test.step("completing the second", async () => {
    await seedTasks(page, ["Pan", "Pan"]);

    await checkbox(row(page, 1)).click();

    await expectList(page, ["Pan", "Pan✓"]);
    expect((await readStored(page)).map(({ id }) => id)).toEqual(["t1", "t2"]);
  });

  await test.step("editing the second", async () => {
    await seedTasks(page, ["Pan", "Pan"]);
    await openEdit(page, 1);

    await editField(row(page, 1)).fill("Pan2");
    await saveButton(row(page, 1)).click();

    await expectList(page, ["Pan", "Pan2"]);
    expect((await readStored(page)).map(({ id }) => id)).toEqual(["t1", "t2"]);
  });

  await test.step("deleting the first", async () => {
    await seedTasks(page, ["Pan", "Pan"]);
    await openConfirm(page, 0);

    await deleteButton(row(page, 0)).click();

    await expectList(page, ["Pan"]);
    expect((await readStored(page)).map(({ id }) => id)).toEqual(["t2"]);
  });
});
