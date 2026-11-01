import { test } from "node:test";
import assert from "node:assert/strict";
import {
  MAX_TEXT_LENGTH,
  addTask,
  editTask,
  setCompleted,
  removeTask,
  isValidTaskList,
} from "../../src/tasks.js";

const t = (id, completed = false) => ({ id, text: id, completed });
const view = (list) => list.map((x) => x.text + (x.completed ? "✓" : "")).join(",");

test("MAX_TEXT_LENGTH vale 200", () => {
  assert.equal(MAX_TEXT_LENGTH, 200);
});

test("addTask pone la nueva al principio (CA-03, CA-46)", () => {
  assert.equal(view(addTask([t("B"), t("A")], "C", () => "C")), "C,B,A");
  assert.equal(view(addTask([t("C"), t("A"), t("B", true)], "D", () => "D")), "D,C,A,B✓");
});

test("addTask recorta espacios y rechaza el vacío (RN-05)", () => {
  const list = addTask([], "  Comprar pan  ", () => "1");
  assert.equal(list[0].text, "Comprar pan");
  assert.equal(list[0].completed, false);
  assert.equal(addTask([], "", () => "1"), null);
  assert.equal(addTask([], "   ", () => "1"), null);
});

test("addTask no modifica la lista original y genera ids", () => {
  const original = [t("A")];
  const out = addTask(original, "B");
  assert.equal(original.length, 1);
  assert.equal(typeof out[0].id, "string");
  assert.notEqual(out[0].id, "");
});

test("addTask permite textos repetidos con ids distintos (RN-09)", () => {
  let n = 0;
  let list = addTask([], "Pan", () => `id${++n}`);
  list = addTask(list, "Pan", () => `id${++n}`);
  assert.equal(list.length, 2);
  assert.notEqual(list[0].id, list[1].id);
});

test("setCompleted: completar va al final (CA-10, CA-11)", () => {
  let list = setCompleted([t("C"), t("B"), t("A")], "B", true);
  assert.equal(view(list), "C,A,B✓");
  list = setCompleted(list, "A", true);
  assert.equal(view(list), "C,B✓,A✓");
});

test("setCompleted: desmarcar va al principio (CA-12)", () => {
  const list = setCompleted([t("C"), t("B", true), t("A", true)], "B", false);
  assert.equal(view(list), "B,C,A✓");
});

test("setCompleted: lista con solo A (CA-47)", () => {
  let list = setCompleted([t("A")], "A", true);
  assert.equal(view(list), "A✓");
  list = setCompleted(list, "A", false);
  assert.equal(view(list), "A");
});

test("setCompleted solo afecta a la fila con ese id (RN-09)", () => {
  const list = [{ id: "1", text: "Pan", completed: false }, { id: "2", text: "Pan", completed: false }];
  const out = setCompleted(list, "2", true);
  assert.deepEqual(out.map((x) => [x.id, x.completed]), [["1", false], ["2", true]]);
  const out2 = setCompleted(list, "1", true);
  assert.deepEqual(out2.map((x) => x.id), ["2", "1"]);
});

test("editTask mantiene posición y estado (RN-04)", () => {
  const out = editTask([t("C"), t("A"), t("B", true)], "B", "B2");
  assert.equal(view(out), "C,A,B2✓");
  assert.equal(view(editTask([t("C"), t("B"), t("A")], "B", "  B2  ")), "C,B2,A");
});

test("editTask rechaza el vacío y solo cambia su fila (RN-05, RN-09)", () => {
  assert.equal(editTask([t("B")], "B", "   "), null);
  const list = [{ id: "1", text: "Pan", completed: false }, { id: "2", text: "Pan", completed: false }];
  assert.deepEqual(editTask(list, "2", "Pan2").map((x) => x.text), ["Pan", "Pan2"]);
});

test("removeTask quita solo la fila con ese id", () => {
  assert.equal(view(removeTask([t("C"), t("B"), t("A")], "B")), "C,A");
  const list = [{ id: "1", text: "Pan", completed: false }, { id: "2", text: "Pan", completed: false }];
  assert.deepEqual(removeTask(list, "1").map((x) => x.id), ["2"]);
});

test("isValidTaskList acepta listas válidas", () => {
  assert.equal(isValidTaskList([]), true);
  assert.equal(isValidTaskList([{ id: "1", text: "A", completed: false }, { id: "2", text: "B", completed: true }]), true);
  assert.equal(isValidTaskList([{ id: "1", text: "a".repeat(300), completed: false }]), true);
});

test("isValidTaskList rechaza los 10 valores de CA-29", () => {
  const bad = [
    null,
    123,
    { a: 1 },
    [1, 2],
    [{ id: "x" }],
    [{ id: "1", text: "", completed: false }],
    [{ id: "1", text: "A", completed: false }, { id: "x" }],
    [{ id: "1", text: "   ", completed: false }],
    [{ id: "", text: "A", completed: false }],
    [{ id: "1", text: "A", completed: false }, { id: "1", text: "B", completed: false }],
  ];
  for (const value of bad) assert.equal(isValidTaskList(value), false, JSON.stringify(value));
});

test("isValidTaskList no lanza con elementos nulos o de tipo incorrecto", () => {
  assert.equal(isValidTaskList([null]), false);
  assert.equal(isValidTaskList([[]]), false);
  assert.equal(isValidTaskList([{ id: 1, text: "A", completed: false }]), false);
  assert.equal(isValidTaskList([{ id: "1", text: 5, completed: false }]), false);
  assert.equal(isValidTaskList([{ id: "1", text: "A", completed: "no" }]), false);
});
