// Fallos encontrados a mano por QA en T-01 a T-04 (qa-report.md). No citan ningún CA con dos puntos
// en el título para que el filtro "verify" de cada tarea siga seleccionando solo sus tests.
import { expect, test } from "@playwright/test";
import {
  MESSAGES,
  addButton,
  addField,
  addTask,
  breakSetItem,
  expectList,
  expectMessage,
  expectNoMessage,
  list,
  readRaw,
  readStored,
  seedRaw,
  seedTasks,
  toTasks,
} from "./helpers.js";

const LIVE_REGION = '[aria-live]:not([aria-live="off"]), [role="alert"], [role="status"]';
const WARN_LIGHT = "rgb(154, 91, 0)";
const ERROR_LIGHT = "rgb(198, 40, 40)";
const FG_LIGHT = "rgb(27, 31, 39)";
const SURFACE_LIGHT = "rgb(255, 255, 255)";

const inLiveRegion = (locator) =>
  locator.evaluate((element, selector) => element.closest(selector) !== null, LIVE_REGION);

// Admite cualquier forma de icono: ::before, svg o img, o un hermano decorativo.
const hasIcon = (locator) =>
  locator.evaluate((element) => {
    for (const node of [element, element.parentElement]) {
      if (getComputedStyle(node, "::before").content !== "none") return true;
      if (node.querySelector("svg, img, [aria-hidden='true']")) return true;
    }
    return false;
  });

function luminance([r, g, b]) {
  const channel = (value) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

const parseRgb = (color) => color.match(/[\d.]+/g).slice(0, 3).map(Number);

function contrast(colorA, colorB) {
  const [high, low] = [luminance(parseRgb(colorA)), luminance(parseRgb(colorB))].sort((a, b) => b - a);
  return (high + 0.05) / (low + 0.05);
}

test("RN-13: a failed save keeps the read warning, adds the save warning and keeps the unreadable value", async ({ page }) => {
  await seedRaw(page, "no-es-json");
  await breakSetItem(page);
  await page.reload();

  await addTask(page, "Pan");

  await expectMessage(page, MESSAGES.readWarning);
  await expectMessage(page, MESSAGES.saveWarning);
  await expectList(page, ["Pan"], { stored: false });
  expect(await readRaw(page)).toBe("no-es-json");
});

test("DP-06: the add error and the read warning are announced, the empty message is not", async ({ page }) => {
  await seedTasks(page, []);

  // El contenedor tiene que existir antes del mensaje (plan.md) para que el lector lo anuncie.
  await expect(page.locator(LIVE_REGION)).not.toHaveCount(0);
  expect(await inLiveRegion(page.getByText(MESSAGES.empty, { exact: true }))).toBe(false);

  await addButton(page).click();
  expect(await inLiveRegion(page.getByText(MESSAGES.addError, { exact: true }))).toBe(true);

  await seedRaw(page, "no-es-json");
  expect(await inLiveRegion(page.getByText(MESSAGES.readWarning, { exact: true }))).toBe(true);
});

test("flows.md: the add error goes right under the form, before the read warning", async ({ page }) => {
  await seedRaw(page, "no-es-json");

  await addButton(page).click();

  const error = await page.getByText(MESSAGES.addError, { exact: true }).boundingBox();
  const warning = await page.getByText(MESSAGES.readWarning, { exact: true }).boundingBox();
  expect(error.y).toBeLessThan(warning.y);
});

test("states.md: the field with an error has a 2 px border in --error and the message an icon", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await seedTasks(page, []);

  await addButton(page).click();

  await expect(addField(page)).toHaveCSS("border-top-width", "2px");
  await expect(addField(page)).toHaveCSS("border-top-color", ERROR_LIGHT);
  const message = page.getByText(MESSAGES.addError, { exact: true });
  await expect(message).toHaveCSS("color", ERROR_LIGHT);
  expect(await hasIcon(message)).toBe(true);
});

test("states.md: the read warning is a block with border, surface, icon and text in --fg", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await seedRaw(page, "no-es-json");

  const message = page.getByText(MESSAGES.readWarning, { exact: true });

  await expect(message).toHaveCSS("color", FG_LIGHT);
  expect(await hasIcon(message)).toBe(true);
  const block = await message.evaluate((element) => {
    for (let node = element; node && node !== document.body; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (style.borderTopStyle !== "none" && parseFloat(style.borderTopWidth) > 0) {
        return { width: style.borderTopWidth, color: style.borderTopColor, background: style.backgroundColor };
      }
    }
    return null;
  });
  expect(block).toEqual({ width: "1px", color: WARN_LIGHT, background: SURFACE_LIGHT });
});

test("states.md: with no tasks the message replaces the list", async ({ page }) => {
  await seedTasks(page, []);

  await expectMessage(page, MESSAGES.empty);
  await expect(list(page)).toHaveCount(0);

  await addTask(page, "Pan");
  await expect(list(page)).toHaveCount(1);
});

for (const colorScheme of ["light", "dark"]) {
  test(`design-system.md: the placeholder reaches AA contrast in ${colorScheme} mode`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await seedTasks(page, []);

    const colors = await addField(page).evaluate((element) => ({
      text: getComputedStyle(element, "::placeholder").color,
      background: getComputedStyle(element).backgroundColor,
    }));

    expect(contrast(colors.text, colors.background)).toBeGreaterThanOrEqual(4.5);
  });
}

// Huecos de los tests, no fallos de la app: con estos cambios inyectados, los 17 tests de T-03 y T-04
// seguían en verde. Una repetición de id haría ilegible toda la lista al recargar (RN-12).
test("RN-09: two tasks added in a row get different ids and survive a reload", async ({ page }) => {
  await seedTasks(page, []);

  await addTask(page, "Pan");
  await addTask(page, "Pan");

  const [first, second] = await readStored(page);
  expect(first.id).not.toBe(second.id);

  await page.reload();
  await expectList(page, ["Pan", "Pan"]);
  await expectNoMessage(page, MESSAGES.readWarning);
});

test("DP-02: a rejected add returns the focus to the field, with the button and with Enter", async ({ page }) => {
  await seedTasks(page, []);

  await addButton(page).click();
  await expectMessage(page, MESSAGES.addError);
  await expect(addField(page)).toBeFocused();

  await addField(page).press("Enter");
  await expect(addField(page)).toBeFocused();
});

test("plan.md decision 7: opening the page never writes", async ({ page }) => {
  await page.addInitScript(() => {
    const original = Storage.prototype.setItem;
    window.__writes = 0;
    Storage.prototype.setItem = function setItem(key, value) {
      window.__writes += 1;
      return original.call(this, key, value);
    };
  });
  const writes = () => page.evaluate(() => window.__writes);

  await page.goto("/");
  await expectMessage(page, MESSAGES.empty);
  expect(await writes()).toBe(0);

  await seedRaw(page, "[]");
  await expectMessage(page, MESSAGES.empty);
  expect(await writes()).toBe(0);

  await seedRaw(page, JSON.stringify(toTasks(["B", "A✓"])));
  await expectList(page, ["B", "A✓"]);
  expect(await writes()).toBe(0);
});

test("plan.md decision 6: the limit of the add field comes from MAX_TEXT_LENGTH", async ({ page }) => {
  await page.route("**/src/tasks.js", async (route) => {
    const response = await route.fetch();
    const body = (await response.text()).replace("MAX_TEXT_LENGTH = 200", "MAX_TEXT_LENGTH = 10");
    await route.fulfill({ response, body });
  });

  await page.goto("/");

  await expect(addField(page)).toHaveJSProperty("maxLength", 10);
});
