import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const meditativeClocksDir = path.join(ROOT, "meditativeclocks");
const exhibitionDir = path.join(meditativeClocksDir, "exhibition");
const publicBaseDest = path.join(ROOT, "public", "meditativeclocks");

async function integrate() {
  console.log("🚀 Starting Integration for Meditative Clocks...");

  // 1. Build the Exhibition Next.js app
  console.log("📦 Building Exhibition Sub-App...");
  execSync("npm install", { cwd: exhibitionDir, stdio: "inherit" });
  execSync("npm run build", {
    cwd: exhibitionDir,
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "production" },
  });

  // 2. Prepare Public Destination
  console.log("📂 Preparing public/meditativeclocks folder...");
  if (fs.existsSync(publicBaseDest)) {
    fs.rmSync(publicBaseDest, { recursive: true, force: true });
  }
  fs.mkdirSync(publicBaseDest, { recursive: true });

  // 3. Sync Static Assets (Clocks, Timers, Pics)
  const staticFolders = ["clocks", "timers", "clock-pics"];
  staticFolders.forEach((folder) => {
    const src = path.join(meditativeClocksDir, folder);
    const dest = path.join(publicBaseDest, folder);
    if (fs.existsSync(src)) {
      console.log(`  ➔ Syncing static folder: ${folder}`);
      fs.cpSync(src, dest, { recursive: true });
    }
  });

  // 4. Sync Exhibition Output
  console.log("  ➔ Syncing built exhibition app...");
  const exhibitionOut = path.join(exhibitionDir, "out");
  const exhibitionDest = path.join(publicBaseDest, "exhibition");
  if (fs.existsSync(exhibitionOut)) {
    fs.cpSync(exhibitionOut, exhibitionDest, { recursive: true });
  }

  // 5. Hoist root-level assets expected at /mockups...
  const assetsToHoist = ["mockups", "mockups-compressed"];
  assetsToHoist.forEach((asset) => {
    const src = path.join(exhibitionOut, asset);
    const dest = path.join(ROOT, "public", asset);
    if (fs.existsSync(src)) {
      if (fs.existsSync(dest)) {
        fs.rmSync(dest, { recursive: true, force: true });
      }
      fs.cpSync(src, dest, { recursive: true });
      console.log(`  ✓ Hoisted ${asset} to root public/`);
    }
  });

  console.log(
    "✅ Integration complete. Everything is ready in public/meditativeclocks",
  );
}

integrate().catch(console.error);
