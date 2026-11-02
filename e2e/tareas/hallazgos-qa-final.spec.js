// Comprobaciones de QA de la verificación final (qa-report.md) sobre lo que construyeron T-09 a T-11
// y ningún CA cubre. Hoy pasan: protegen lo que ya funciona y detectan los fallos inyectados que
// ningún otro test veía. Ningún título cita un CA con dos puntos, para que el filtro "verify" de
// cada tarea no las seleccione: se lanzan por archivo.
import { expect, test } from "@playwright/test";
import {
  MESSAGES,
  addTask,
  breakSetItem,
  cancelButton,
  checkbox,
  editButton,
  editField,
  expectMessage,
  openEdit,
  row,
  saveButton,
  seedRaw,
  seedTasks,
  taskText,
} from "./helpers.js";

const LIVE_REGION = '[role="alert"], [role="status"], [aria-live]:not([aria-live="off"])';

// Apunta el texto de cada región que se anuncia cuando entra algo en ella (DP-06).
async function watchAnnouncements(page) {
  await page.evaluate((live) => {
    window.__announced = [];
    new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          const element = node.nodeType === 1 ? node : node.parentElement;
          const announces = element.closest(live) || element.querySelector(live);
          if (announces && announces.textContent) window.__announced.push(announces.textContent);
        }
      }
    }).observe(document.body, { childList: true, subtree: true });
  }, LIVE_REGION);
}

const announced = (page) => page.evaluate(() => window.__announced);

test("DP-06: the save warning is announced once when it appears, and neither warning is announced again on later redraws", async ({ page }) => {
  await seedRaw(page, "no-es-json");
  await breakSetItem(page);
  await page.reload();
  await expectMessage(page, MESSAGES.readWarning);
  await watchAnnouncements(page);

  await addTask(page, "Pan");
  await expectMessage(page, MESSAGES.saveWarning);
  expect(await announced(page)).toEqual([MESSAGES.saveWarning]);

  // Tres redibujados más con los dos avisos a la vista: marcar (falla al guardar), abrir y cancelar.
  await checkbox(row(page, 0)).click();
  await openEdit(page, 0);
  await cancelButton(row(page, 0)).click();
  await expect(editButton(row(page, 0))).toBeFocused();
  await expectMessage(page, MESSAGES.readWarning);
  await expectMessage(page, MESSAGES.saveWarning);

  expect(await announced(page)).toEqual([MESSAGES.saveWarning]);
});

test("states.md: the save warning is a block like the read warning, in light and dark mode", async ({ page }) => {
  await seedTasks(page, ["B"]);
  await breakSetItem(page);
  for (const colorScheme of ["light", "dark"]) {
    await page.emulateMedia({ colorScheme });
    // Lo guardado sigue siendo B: añadir falla siempre, y al recargar se pierde "Pan".
    await page.reload();
    await addTask(page, "Pan");

    const warning = page.getByText(MESSAGES.saveWarning, { exact: true });
    await expect(warning).toBeVisible();
    const style = await warning.evaluate((element) => {
      const computed = getComputedStyle(element);
      const icon = getComputedStyle(element, "::before");
      const tokens = getComputedStyle(document.documentElement);
      // Convierte un token (#rrggbb) al formato rgb() de los estilos calculados.
      const probe = document.createElement("span");
      document.body.append(probe);
      const rgb = (name) => {
        probe.style.color = tokens.getPropertyValue(name).trim();
        return getComputedStyle(probe).color;
      };
      const expected = { warn: rgb("--warn"), surface: rgb("--surface"), fg: rgb("--fg") };
      probe.remove();
      return {
        expected,
        borderWidth: computed.borderTopWidth,
        borderStyle: computed.borderTopStyle,
        borderColor: computed.borderTopColor,
        background: computed.backgroundColor,
        color: computed.color,
        icon: icon.content,
        iconColor: icon.color,
      };
    });
    expect(style.borderWidth, colorScheme).toBe("1px");
    expect(style.borderStyle, colorScheme).toBe("solid");
    expect(style.borderColor, colorScheme).toBe(style.expected.warn);
    expect(style.background, colorScheme).toBe(style.expected.surface);
    expect(style.color, colorScheme).toBe(style.expected.fg);
    expect(style.icon, colorScheme).toContain("⚠");
    expect(style.iconColor, colorScheme).toBe(style.expected.warn);
  }
});

// states.md, "Fila de tarea": en móvil los botones van debajo; desde 480 px de ancho, a la derecha.
// El error de edición va siempre debajo del campo.
test("states.md: at 479 px the row buttons go below and at 480 px to the right, with the edit error under the field", async ({ page }) => {
  await seedTasks(page, ["B", "A"]);
  const taskRow = row(page, 0);
  const box = (locator) => locator.boundingBox();

  for (const width of [479, 480]) {
    await page.setViewportSize({ width, height: 800 });
    await page.reload();
    const wide = width >= 480;

    const text = await box(taskText(taskRow));
    const edit = await box(editButton(taskRow));
    if (wide) {
      expect(edit.x, `${width} px, Editar to the right of the text`).toBeGreaterThanOrEqual(text.x + text.width);
      expect(edit.y, `${width} px, Editar on the line of the text`).toBeLessThan(text.y + text.height);
    } else {
      expect(edit.y, `${width} px, Editar below the text`).toBeGreaterThanOrEqual(text.y + text.height);
      expect(edit.x, `${width} px, Editar aligned with the text`).toBeCloseTo(text.x, 0);
    }

    await openEdit(page, 0);
    await editField(taskRow).fill("");
    await saveButton(taskRow).click();
    const field = await box(editField(taskRow));
    const error = await box(taskRow.getByText(MESSAGES.editError, { exact: true }));
    const save = await box(saveButton(taskRow));

    expect(error.y, `${width} px, error below the field`).toBeGreaterThanOrEqual(field.y + field.height);
    expect(error.x, `${width} px, error aligned with the field`).toBeCloseTo(field.x, 0);
    expect(error.x + error.width, `${width} px, error within the width of the field`).toBeLessThanOrEqual(field.x + field.width + 0.5);
    if (wide) {
      expect(save.x, `${width} px, Guardar to the right of the field`).toBeGreaterThanOrEqual(field.x + field.width);
      expect(save.y, `${width} px, Guardar on the line of the field`).toBeLessThan(field.y + field.height);
    } else {
      expect(save.y, `${width} px, Guardar below the field and its error`).toBeGreaterThanOrEqual(error.y + error.height);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await cancelButton(taskRow).click();
  }
});
