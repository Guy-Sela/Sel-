// Purpose: stop generated Next.js keys and private environment files entering deployments.
// Input: Git's index (the next commit locally, or checked-out files in GitHub Actions).
// Output: a pass/fail exit status and unsafe paths only; never prints file contents.
// Run with: npm run security:check
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));

export function isUnsafePath(file) {
  const parts = file.split("/");
  const name = parts.at(-1);
  return parts.includes(".next") ||
    ((name === ".env" || name.startsWith(".env.")) &&
      ![".env.example", ".env.sample", ".env.template"].includes(name));
}

function main() {
  const files = execFileSync("git", ["ls-files", "--cached", "-z"], {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  }).split("\0").filter(Boolean);
  const unsafe = files.filter(isUnsafePath);
  if (unsafe.length) {
    console.error("Deployment blocked: generated Next.js files or private environment files are tracked:");
    for (const file of unsafe) console.error(JSON.stringify(file));
    console.error("Remove these paths from Git's index without deleting your local copies, then retry.");
    process.exitCode = 1;
  } else {
    console.log("Security path check passed: no tracked .next or private environment files.");
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch {
    console.error("Security path check failed: unable to inspect Git's index.");
    process.exitCode = 1;
  }
}
