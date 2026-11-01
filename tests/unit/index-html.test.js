import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const html = await readFile(new URL("../../index.html", import.meta.url), "utf8");

test("the page restricts its sources to its own origin", () => {
  assert.match(html, /http-equiv="Content-Security-Policy" content="default-src 'self'/);
});

test("the page declares Spanish as its language", () => {
  assert.match(html, /<html lang="es">/);
});
