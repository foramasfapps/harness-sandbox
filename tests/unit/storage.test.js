import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { STORAGE_KEY, loadTasks, saveTasks } from "../../src/storage.js";

let data;
let writes;

function fakeStore() {
  return {
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => {
      writes += 1;
      data[k] = v;
    },
  };
}

beforeEach(() => {
  data = {};
  writes = 0;
  globalThis.window = { localStorage: fakeStore() };
});

test("clave inexistente es lista vacía legible y no escribe", () => {
  assert.deepEqual(loadTasks(), { tasks: [], readable: true });
  assert.equal(writes, 0);
});

test("[] es lista vacía legible", () => {
  data[STORAGE_KEY] = "[]";
  assert.deepEqual(loadTasks(), { tasks: [], readable: true });
});

test("'null' es ilegible", () => {
  data[STORAGE_KEY] = "null";
  assert.deepEqual(loadTasks(), { tasks: [], readable: false });
  assert.equal(writes, 0);
});

test("JSON inválido es ilegible", () => {
  data[STORAGE_KEY] = "{no";
  assert.equal(loadTasks().readable, false);
  assert.equal(writes, 0);
});

test("lista válida se lee tal cual", () => {
  const tasks = [{ id: "a", text: "A", completed: false }];
  data[STORAGE_KEY] = JSON.stringify(tasks);
  assert.deepEqual(loadTasks(), { tasks, readable: true });
});

test("[null] es ilegible sin lanzar", () => {
  data[STORAGE_KEY] = "[null]";
  assert.equal(loadTasks().readable, false);
});

test("saveTasks guarda y devuelve true", () => {
  const tasks = [{ id: "a", text: "A", completed: true }];
  assert.equal(saveTasks(tasks), true);
  assert.deepEqual(JSON.parse(data[STORAGE_KEY]), tasks);
});

test("setItem que lanza devuelve false", () => {
  globalThis.window.localStorage.setItem = () => {
    throw new Error("QuotaExceededError");
  };
  assert.equal(saveTasks([]), false);
});

test("getItem que lanza es ilegible", () => {
  globalThis.window.localStorage.getItem = () => {
    throw new Error("boom");
  };
  assert.deepEqual(loadTasks(), { tasks: [], readable: false });
});

test("acceso a localStorage que lanza: ni leer ni guardar lanzan", () => {
  globalThis.window = {
    get localStorage() {
      throw new Error("SecurityError");
    },
  };
  assert.deepEqual(loadTasks(), { tasks: [], readable: false });
  assert.equal(saveTasks([]), false);
});
