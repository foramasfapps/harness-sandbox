import { expect, test } from "@playwright/test";
import {
  MESSAGES,
  addButton,
  addField,
  addTask,
  checkbox,
  deleteButton,
  editButton,
  expectList,
  expectMessage,
  expectNoMessage,
  paste,
  readRaw,
  readStored,
  row,
  rows,
  seedRaw,
  seedTasks,
  taskText,
  watchErrors,
} from "./helpers.js";

test("CA-02: adding with the button creates the row and leaves the field empty and focused", async ({ page }) => {
  // Además de CA-02: el envío no debe chocar con form-action 'none' (riesgo de plan.md).
  const errors = watchErrors(page);
  await seedTasks(page, []);

  await addField(page).fill("Comprar pan");
  await addButton(page).click();

  await expect(rows(page)).toHaveCount(1);
  const taskRow = row(page, 0);
  await expect(taskText(taskRow)).toHaveJSProperty("textContent", "Comprar pan");
  await expect(checkbox(taskRow)).toHaveCount(1);
  await expect(checkbox(taskRow)).not.toBeChecked();
  await expect(editButton(taskRow)).toHaveText("Editar");
  await expect(editButton(taskRow)).toBeVisible();
  await expect(deleteButton(taskRow)).toHaveText("Borrar");
  await expect(deleteButton(taskRow)).toBeVisible();
  await expectNoMessage(page, MESSAGES.empty);
  await expect(addField(page)).toHaveValue("");
  await expect(addField(page)).toBeFocused();
  expect(errors).toEqual([]);
});

test("CA-03: adding with Enter puts the task first and leaves the field empty and focused", async ({ page }) => {
  const errors = watchErrors(page);
  await seedTasks(page, ["B", "A"]);

  await addField(page).fill("C");
  await addField(page).press("Enter");

  await expectList(page, ["C", "B", "A"]);
  await expect(addField(page)).toHaveValue("");
  await expect(addField(page)).toBeFocused();
  expect(errors).toEqual([]);
});

test("CA-04: empty or blank text creates nothing in the 4 combinations", async ({ page }) => {
  const combinations = [
    { text: "", submit: "button" },
    { text: "", submit: "Enter" },
    { text: "   ", submit: "button" },
    { text: "   ", submit: "Enter" },
  ];

  for (const { text, submit } of combinations) {
    await test.step(`${JSON.stringify(text)} with ${submit}`, async () => {
      await seedTasks(page, []);

      await addField(page).fill(text);
      if (submit === "button") {
        await addButton(page).click();
      } else {
        await addField(page).press("Enter");
      }

      await expectMessage(page, MESSAGES.addError);
      await expectMessage(page, MESSAGES.empty);
      await expect(rows(page)).toHaveCount(0);
      expect(await readRaw(page)).toBe("[]");
      await expect(addField(page)).toHaveValue(text);
    });
  }
});

test("CA-05: a valid task clears the add error", async ({ page }) => {
  await seedTasks(page, []);
  await addButton(page).click();
  await expectMessage(page, MESSAGES.addError);

  await addTask(page, "Comprar pan");

  await expectNoMessage(page, MESSAGES.addError);
  await expect(rows(page)).toHaveCount(1);
  await expect(taskText(row(page, 0))).toHaveJSProperty("textContent", "Comprar pan");
});

test("CA-06: leading and trailing spaces are removed when adding", async ({ page }) => {
  await seedTasks(page, []);

  await addTask(page, "  Comprar pan  ");

  await expect(taskText(row(page, 0))).toHaveJSProperty("textContent", "Comprar pan");
  const [stored] = await readStored(page);
  expect(stored.text).toBe("Comprar pan");
  expect(stored.text).toHaveLength(11);
});

test("CA-07: the add field keeps 200 characters when typing and when pasting", async ({ page }) => {
  const input = `${"a".repeat(200)}b`;
  const expected = "a".repeat(200);

  const check = async () => {
    await expect(addField(page)).toHaveValue(expected);
    await addButton(page).click();
    await expect(taskText(row(page, 0))).toHaveJSProperty("textContent", expected);
    expect((await readStored(page))[0].text).toBe(expected);
  };

  await test.step("typing", async () => {
    await seedTasks(page, []);
    await addField(page).pressSequentially(input);
    await check();
  });

  await test.step("pasting", async () => {
    await seedTasks(page, []);
    await paste(page, addField(page), input);
    await check();
  });

  // Riesgo de plan.md: un emoji cuenta como 2 (RN-08) y no debe quedar partido por la mitad.
  await test.step("pasting an emoji that does not fit", async () => {
    await seedTasks(page, []);
    await paste(page, addField(page), `${"a".repeat(199)}😀`);
    await expect(addField(page)).toHaveValue("a".repeat(199));
  });
});

test("CA-08: two tasks can have the same text", async ({ page }) => {
  await seedTasks(page, ["Pan"]);

  await addTask(page, "Pan");

  await expectList(page, ["Pan", "Pan"]);
  const [first, second] = await readStored(page);
  expect(first.id).not.toBe(second.id);
});

test("CA-27: the first saved change clears the read warning and replaces the data", async ({ page }) => {
  await seedRaw(page, "no-es-json");
  await expectMessage(page, MESSAGES.readWarning);

  await addTask(page, "Pan");

  await expectNoMessage(page, MESSAGES.readWarning);
  const stored = await readStored(page);
  expect(Array.isArray(stored)).toBe(true);
  expect(stored).toHaveLength(1);
  expect(stored[0]).toEqual({ id: expect.any(String), text: "Pan", completed: false });
  expect(stored[0].id).not.toBe("");

  await page.reload();
  await expectList(page, ["Pan"]);
  await expectNoMessage(page, MESSAGES.readWarning);
});

test("CA-42: pasting 100 characters after 150 leaves 200 in the field", async ({ page }) => {
  await seedTasks(page, []);
  await addField(page).fill("a".repeat(150));
  await addField(page).press("End");

  await paste(page, addField(page), "b".repeat(100));

  await expect(addField(page)).toHaveValue(`${"a".repeat(150)}${"b".repeat(50)}`);
});

test("CA-43: a rejected attempt does not overwrite unreadable data", async ({ page }) => {
  await seedRaw(page, "no-es-json");
  await expectMessage(page, MESSAGES.readWarning);

  await addButton(page).click();
  await expectMessage(page, MESSAGES.addError);
  await expectMessage(page, MESSAGES.readWarning);
  expect(await readRaw(page)).toBe("no-es-json");

  await page.reload();
  expect(await readRaw(page)).toBe("no-es-json");
  await expectMessage(page, MESSAGES.readWarning);
});

test("CA-46: a new task goes before pending and completed tasks", async ({ page }) => {
  await seedTasks(page, ["C", "A", "B✓"]);

  await addTask(page, "D");

  await expectList(page, ["D", "C", "A", "B✓"]);
});

test("CA-49: the limit applies before removing spaces", async ({ page }) => {
  await seedTasks(page, []);
  const expectedField = `${" ".repeat(5)}${"a".repeat(195)}`;

  await paste(page, addField(page), `${" ".repeat(5)}${"a".repeat(200)}`);
  await expect(addField(page)).toHaveValue(expectedField);

  await addButton(page).click();

  expect((await readStored(page))[0].text).toBe("a".repeat(195));
  await expect(taskText(row(page, 0))).toHaveJSProperty("textContent", "a".repeat(195));
});
