import assert from "node:assert/strict";
import test from "node:test";

import { PUBLIC_ROUTE_PATHS, ROUTE_PATHS } from "../src/routePaths.js";

test("preserves the public and protected route boundaries", () => {
  assert.deepEqual(PUBLIC_ROUTE_PATHS, [
    "/", "/login", "/register", "/auth/callback", "/planner",
    "/recipes", "/create-recipe", "*",
  ]);
  assert.equal(PUBLIC_ROUTE_PATHS.includes(ROUTE_PATHS.profile), false);
});

test("preserves authentication navigation destinations", () => {
  assert.equal(ROUTE_PATHS.register, "/register");
  assert.equal(ROUTE_PATHS.login, "/login");
  assert.equal(ROUTE_PATHS.authCallback, "/auth/callback");
  assert.equal(ROUTE_PATHS.planner, "/planner");
});
