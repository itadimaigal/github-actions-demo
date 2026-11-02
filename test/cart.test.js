import { test } from "node:test";
import assert from "node:assert/strict";
import { cartTotal } from "../src/cart.js";

test("adds up prices", () => {
  assert.equal(cartTotal([{ price: 100 }, { price: 250 }]), 350);
});

test("premium members get 10% off sale items only", () => {
  const items = [{ price: 100, onSale: true }, { price: 200, onSale: false }];
  assert.equal(cartTotal(items, true), 290);
});

test("regular members pay full price", () => {
  assert.equal(cartTotal([{ price: 100, onSale: true }], false), 100);
});

test("empty cart costs nothing", () => {
  assert.equal(cartTotal([]), 0);
});
