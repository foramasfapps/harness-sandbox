import { expect, test } from "@playwright/test";
import {
  MESSAGES,
  STORAGE_KEY,
  expectList,
  expectMessage,
  expectNoMessage,
  readRaw,
  rows,
  seedRaw,
  watchErrors,
} from "./helpers.js";

const UNREADABLE_VALUES = [
  "null",
  "123",
  '{"a":1}',
  "[1,2]",
  '[{"id":"x"}]',
  '[{"id":"1","text":"","completed":false}]',
  '[{"id":"1","text":"A","completed":false},{"id":"x"}]',
  '[{"id":"1","text":"   ","completed":false}]',
  '[{"id":"","text":"A","completed":false}]',
  '[{"id":"1","text":"A","completed":false},{"id":"1","text":"B","completed":false}]',
];

// RN-12 también los declara ilegibles, aunque no están entre los 10 de CA-29.
const OTHER_UNREADABLE_VALUES = [
  "[null]",
  '[{"id":1,"text":"A","completed":false}]',
  '[{"id":"1","text":1,"completed":false}]',
  '[{"id":"1","text":"A"}]',
  '[{"id":"1","text":"A","completed":"false"}]',
];

test("CA-01: a missing key and an empty list show the empty message, without warning", async ({ page }) => {
  await test.step("the key does not exist", async () => {
    await page.goto("/");
    expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBeNull();
    await expectMessage(page, MESSAGES.empty);
    await expect(rows(page)).toHaveCount(0);
    await expectNoMessage(page, MESSAGES.readWarning);
  });

  await test.step("the key holds []", async () => {
    await seedRaw(page, "[]");
    await expectMessage(page, MESSAGES.empty);
    await expect(rows(page)).toHaveCount(0);
    await expectNoMessage(page, MESSAGES.readWarning);
  });
});

test("CA-26: invalid JSON shows the read warning and is not overwritten", async ({ page }) => {
  await seedRaw(page, "no-es-json");

  await expectMessage(page, MESSAGES.readWarning);
  await expectMessage(page, MESSAGES.empty);
  await expect(rows(page)).toHaveCount(0);
  expect(await readRaw(page)).toBe("no-es-json");
});

test("CA-29: the 10 unreadable values show the warning, keep the key and log no errors", async ({ page }) => {
  const errors = watchErrors(page);
  expect(UNREADABLE_VALUES).toHaveLength(10);

  for (const value of UNREADABLE_VALUES) {
    await test.step(`tasks.v1 = ${value}`, async () => {
      await seedRaw(page, value);

      await expectMessage(page, MESSAGES.readWarning);
      await expect(rows(page)).toHaveCount(0);
      expect(errors).toEqual([]);
      expect(await readRaw(page)).toBe(value);
    });
  }
});

test("CA-29: the other invalid shapes of RN-12 are unreadable and a long text is accepted", async ({ page }) => {
  const errors = watchErrors(page);

  for (const value of OTHER_UNREADABLE_VALUES) {
    await test.step(`tasks.v1 = ${value}`, async () => {
      await seedRaw(page, value);

      await expectMessage(page, MESSAGES.readWarning);
      await expect(rows(page)).toHaveCount(0);
      expect(errors).toEqual([]);
      expect(await readRaw(page)).toBe(value);
    });
  }

  await test.step("a text of 201 characters is accepted and shown", async () => {
    const longText = "a".repeat(201);
    await seedRaw(page, JSON.stringify([{ id: "1", text: longText, completed: false }]));

    await expectNoMessage(page, MESSAGES.readWarning);
    await expectList(page, [longText]);
  });
});
