#!/usr/bin/env node
/**
 * Build script for Selà website
 * - Minifies CSS and JS
 * - Adds content hashes to filenames
 * - Updates HTML references
 * - Copies assets to docs/ for GitHub Pages
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const esbuild = require("esbuild");
const { execSync } = require("child_process");
const { transform } = require("lightningcss");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "docs");
const SRC = ROOT;

// Files to process and hash
const CSS_FILES = ["main.css"];
const JS_FILES = ["main.js"];
const HTML_FILES = ["index.html", "terminal-ansi-combined.html", "404.html"];

// Static items to copy to docs/ root
// These are items from the project root that should be in the final site
const COPY_ITEMS = [
  "favicons",
  "fonts",
  "vendor",
  "meditativeclocks/clock-pics",
  "meditativeclocks/clocks",
  "favicon-chevron-gold.svg",
  "og-1200x630.png",
  "ascii-profile.txt",
  "CNAME",
  "manifest.json",
  "sitemap.xml",
  "robots.txt",
];

// Folders/Files to skip during any recursive copies to avoid bloating the build
// This prevents source code, node_modules, and cache files from leaking into docs/
const GLOBAL_IGNORE = [
  "node_modules",
  ".git",
  ".next",
  "src",
  "components",
  "out",
  ".DS_Store",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "next.config.mjs",
  "postcss.config.mjs",
  "tailwind.config.js",
  "tailwind.config.ts",
];

function cleanDocs() {
  console.log("1. Cleaning docs/");
  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true });
  }
  fs.mkdirSync(DIST, { recursive: true });
}

function contentHash(content, length = 8) {
  return crypto
    .createHash("md5")
    .update(content)
    .digest("hex")
    .slice(0, length);
}

function minifyCSS(inputPath) {
  const code = fs.readFileSync(inputPath);
  const { code: minified } = transform({
    filename: path.basename(inputPath),
    code,
    minify: true,
    sourceMap: false,
  });
  return minified;
}

async function minifyJS(inputPath) {
  const result = await esbuild.build({
    entryPoints: [inputPath],
    bundle: false,
    minify: true,
    write: false,
    target: ["es2020"],
    format: "iife",
  });
  return result.outputFiles[0].text;
}

/**
 * Recursively copies a directory with filtering to prevent source leakage
 */
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    // Skip ignored names (node_modules, src, etc)
    if (GLOBAL_IGNORE.includes(entry.name)) continue;

    // Skip source/config files (ts, tsx, jsx, mjs, config.js)
    if (
      entry.isFile() &&
      entry.name.match(/\.(ts|tsx|jsx|mjs|config\.(js|mjs|ts))$/)
    )
      continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Copies a file or directory item to its corresponding path in DIST
 */
function copyItem(itemPath) {
  const fullSrcPath = path.join(SRC, itemPath);
  if (!fs.existsSync(fullSrcPath)) {
    console.log(`  ⚠ Skipping ${itemPath} (not found)`);
    return;
  }

  const stat = fs.statSync(fullSrcPath);
  const destPath = path.join(DIST, itemPath);

  if (stat.isDirectory()) {
    copyDir(fullSrcPath, destPath);
    console.log(`  ✓ Copied ${itemPath}/`);
  } else {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(fullSrcPath, destPath);
    console.log(`  ✓ Copied ${itemPath}`);
  }
}

/**
 * Builds the Next.js exhibition project and deploys it to docs/
 */
function buildExhibition() {
  const projectDir = path.join(ROOT, "meditativeclocks", "exhibition");
  if (!fs.existsSync(projectDir)) {
    console.log("  ⚠ Skipping exhibition build (folder not found)");
    return;
  }

  console.log("  ↳ Running Next.js build & export...");
  // Use npm run build which triggers next build (configured for static export in next.config.mjs)
  execSync("npm run build", {
    cwd: projectDir,
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "production" },
  });

  const outDir = path.join(projectDir, "out");
  const destDir = path.join(DIST, "meditativeclocks", "exhibition");

  if (!fs.existsSync(outDir)) {
    throw new Error("Exhibition build failed: 'out' directory not found.");
  }

  // Copy built site to its subfolder in docs
  copyDir(outDir, destDir);
  console.log(
    "  ✓ Copied exhibition build to docs/meditativeclocks/exhibition/",
  );

  // Support root-level access for mockups to avoid broken links in main site
  // We take them from the build output (which already includes public assets)
  // this avoids copying the large source 'public' folder redundantly.
  const assetsToSync = ["mockups", "mockups-compressed"];
  assetsToSync.forEach((asset) => {
    const src = path.join(outDir, asset);
    const dest = path.join(DIST, asset);
    if (fs.existsSync(src)) {
      copyDir(src, dest);
      console.log(`  ✓ Synced ${asset} to docs root`);
    }
  });
}

async function main() {
  console.log("🔨 Building Selà website...\n");

  cleanDocs();

  const hashMap = {};

  console.log("\n2. Processing CSS");
  for (const file of CSS_FILES) {
    const inputPath = path.join(SRC, file);
    if (!fs.existsSync(inputPath)) continue;
    const minified = minifyCSS(inputPath);
    const hash = contentHash(minified);
    const hashedName = `${path.basename(file, ".css")}.${hash}.min.css`;
    fs.writeFileSync(path.join(DIST, hashedName), minified);
    hashMap[file] = hashedName;
    console.log(`  ✓ ${file} → ${hashedName}`);
  }

  console.log("\n3. Processing JS");
  for (const file of JS_FILES) {
    const inputPath = path.join(SRC, file);
    if (!fs.existsSync(inputPath)) continue;
    const minified = await minifyJS(inputPath);
    const hash = contentHash(minified);
    const hashedName = `${path.basename(file, ".js")}.${hash}.min.js`;
    fs.writeFileSync(path.join(DIST, hashedName), minified);
    hashMap[file] = hashedName;
    console.log(`  ✓ ${file} → ${hashedName}`);
  }

  console.log("\n4. Building Exhibition (Conceptual Timing)");
  buildExhibition();

  console.log("\n5. Copying Static Assets");
  for (const item of COPY_ITEMS) {
    copyItem(item);
  }

  console.log("\n6. Finalizing HTML");
  for (const file of HTML_FILES) {
    const inputPath = path.join(SRC, file);
    if (!fs.existsSync(inputPath)) continue;
    let html = fs.readFileSync(inputPath, "utf8");
    for (const [original, hashed] of Object.entries(hashMap)) {
      // Replace references to unminified assets with hashed versions
      html = html.replace(
        new RegExp(`(["'])${original}(["'])`, "g"),
        `$1${hashed}$2`,
      );
      html = html.replace(
        new RegExp(`href="${original}"`, "g"),
        `href="${hashed}"`,
      );
      html = html.replace(
        new RegExp(`src="${original}"`, "g"),
        `src="${hashed}"`,
      );
    }
    fs.writeFileSync(path.join(DIST, file), html);
    console.log(`  ✓ Processed ${file}`);
  }

  // GitHub Pages requirements
  fs.writeFileSync(path.join(DIST, ".nojekyll"), "");
  console.log("\n7. Created .nojekyll");

  console.log("\n✅ Build complete!");
  console.log(`   Output: ${DIST}`);

  // Calculate final build size
  let totalSize = 0;
  function calcSize(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) calcSize(p);
      else totalSize += fs.statSync(p).size;
    }
  }
  if (fs.existsSync(DIST)) {
    calcSize(DIST);
    console.log(`   Total size: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
  }
}

main().catch((err) => {
  console.error("\n❌ Build failed:", err);
  process.exit(1);
});
