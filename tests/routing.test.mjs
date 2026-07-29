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

test("keeps the React Router 8 packages aligned on the patched release", async () => {
  const { readFile } = await import("node:fs/promises");
  const packageJson = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );
  const packageLock = JSON.parse(
    await readFile(new URL("../package-lock.json", import.meta.url), "utf8"),
  );

  assert.equal(packageJson.dependencies["react-router-dom"], "^8.3.0");
  assert.equal(packageLock.packages["node_modules/react-router"].version, "8.3.0");
  assert.equal(packageLock.packages["node_modules/react-router-dom"].version, "8.3.0");
  assert.equal(
    packageLock.packages["node_modules/react-router-dom"].dependencies["react-router"],
    "8.3.0",
  );
});
