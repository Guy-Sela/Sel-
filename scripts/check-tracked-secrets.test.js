// Purpose: verify the deployment security path rules without creating real secrets.
// Input: representative repository paths. Output: Node.js test results.
// Run with: node --test scripts/check-tracked-secrets.test.js
import assert from "node:assert/strict";
import test from "node:test";
import { isUnsafePath } from "./check-tracked-secrets.js";

test("blocks generated keys and private environment files, including nested projects", () => {
  for (const file of [
    ".next/server/server-reference-manifest.json",
    "nested/.next/cache/.previewinfo",
    ".env",
    ".env.local",
    ".env.production",
    "nested/.env.production.local",
    ".env.local\nmisleading-name",
  ]) {
    assert.equal(isUnsafePath(file), true, file);
  }
});

test("allows source files, public assets, and explicit environment templates", () => {
  for (const file of [
    "next.config.mjs",
    "public/manifest.json",
    "src/app/page.tsx",
    ".env.example",
    "nested/.env.sample",
    ".env.template",
    "docs/environment.md",
  ]) {
    assert.equal(isUnsafePath(file), false, file);
  }
});
