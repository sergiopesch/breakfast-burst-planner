import assert from "node:assert/strict";
import test from "node:test";
import { loginResolver } from "../src/lib/login-validation.ts";

const options = { fields: {}, shouldUseNativeValidation: false };

test("login accepts normal credentials and preserves their values", async () => {
  const values = { email: "member+training@example.com", password: "six-or-more" };
  assert.deepEqual(await loginResolver(values, undefined, options), { values, errors: {} });
});

test("login rejects invalid fields and returns their existing visible messages", async () => {
  const result = await loginResolver({ email: "not-an-email", password: "short" }, undefined, options);
  assert.deepEqual(result.values, {});
  assert.equal(result.errors.email.message, "Please enter a valid email address");
  assert.equal(result.errors.password.message, "Password must be at least 6 characters");
});

test("login enforces the password boundary and strips unrecognized inputs", async () => {
  assert.equal((await loginResolver({ email: "member@example.com", password: "12345" }, undefined, options)).errors.password.message,
    "Password must be at least 6 characters");
  const result = await loginResolver({ email: "member@example.com", password: "123456", role: "admin" }, undefined, options);
  assert.deepEqual(result, { values: { email: "member@example.com", password: "123456" }, errors: {} });
});

test("login keeps field references for invalid-field focus", async () => {
  const ref = { focus() {} };
  const result = await loginResolver({ email: "not-an-email", password: "123456" }, undefined,
    { fields: { email: { ref, name: "email" } }, shouldUseNativeValidation: false });
  assert.equal(result.errors.email.ref, ref);
});
