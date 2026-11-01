import { expect, test } from "@playwright/test";

test("the page loads its script under the security policy", async ({ page }) => {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Hola, mundo" })).toBeVisible();
  expect(errors).toEqual([]);
});
