import { expect, test } from "@playwright/test";
import { rows, seedTasks, taskText, watchErrors } from "./helpers.js";

// Sustituye a e2e/hello.spec.js (plan.md, contradicción 10). Las filas solo existen si el
// script de la app se ha ejecutado bajo la política de seguridad.
test("smoke: the app runs under the security policy without console errors", async ({ page }) => {
  const errors = watchErrors(page);

  await seedTasks(page, ["B", "A✓"]);

  await expect(rows(page)).toHaveCount(2);
  await expect(taskText(rows(page).nth(0))).toHaveJSProperty("textContent", "B");
  expect(errors).toEqual([]);
});
