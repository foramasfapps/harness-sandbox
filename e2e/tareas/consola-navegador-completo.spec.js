// El Chromium por defecto de Playwright (sin interfaz reducido) no pide el icono de la página y por
// eso no ve su error 404. Un navegador de verdad sí lo pide: CA-29 se comprueba también con él.
import { expect, test } from "@playwright/test";
import { MESSAGES, expectMessage, readRaw, seedRaw, watchErrors } from "./helpers.js";

test.use({ channel: "chromium" });

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

test("CA-29: in the full browser the console has no errors with the 10 unreadable values", async ({ page }) => {
  const errors = watchErrors(page);

  for (const value of UNREADABLE_VALUES) {
    await test.step(`tasks.v1 = ${value}`, async () => {
      await seedRaw(page, value);

      await expectMessage(page, MESSAGES.readWarning);
      expect(await readRaw(page)).toBe(value);
    });
  }

  // El navegador pide el icono después de cargar: hay que darle tiempo para que el error aparezca.
  await page.waitForTimeout(1000);
  expect(errors).toEqual([]);
});
