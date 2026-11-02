import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "../src/server.js";

let server, base;

before(async () => {
  server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  base = `http://localhost:${server.address().port}`;
});

after(() => server.close());

test("GET /health says ok", async () => {
  const res = await fetch(`${base}/health`);
  assert.equal(res.status, 200);
  assert.equal((await res.json()).status, "ok");
});

test("GET /total applies the premium discount", async () => {
  const res = await fetch(`${base}/total?prices=100,200&sale=1,0&premium=true`);
  assert.deepEqual((await res.json()).total, 290);
});

test("GET /total rejects bad input", async () => {
  const res = await fetch(`${base}/total?prices=abc`);
  assert.equal(res.status, 400);
});
