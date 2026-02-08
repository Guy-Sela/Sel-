#!/usr/bin/env node
/**
 * Build script for Selà website
 * - Minifies CSS and JS
 * - Adds content hashes to filenames
 * - Updates HTML references
 * - Copies all files to dist/
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const esbuild = require("esbuild");
const { execSync } = require("child_process");
const { transform } = require("lightningcss");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "docs");
const SRC = ROOT; // Source files are in root for now

// Files to process
const CSS_FILES = ["main.css"];
const JS_FILES = ["main.js"];
const HTML_FILES = ["index.html", "terminal-ansi-combined.html", "404.html"];

// Files/dirs to copy as-is
const COPY_ITEMS = [
  "meditativeclocks",
  "favicons",
  "favicon-chevron-gold.svg",
  "og-1200x630.png",
  "ascii-profile.txt",
  "CNAME",
  "manifest.json",
  "sitemap.xml",
  "robots.txt",
  "fonts",
  "vendor",
];

// Clean docs
function cleanDocs() {
  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true });
  }
  fs.mkdirSync(DIST, { recursive: true });
}

// Generate content hash
function contentHash(content, length = 8) {
  return crypto
    .createHash("md5")
    .update(content)
    .digest("hex")
    .slice(0, length);
}

// Minify CSS with lightningcss
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

// Minify JS with esbuild
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

// Copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;

  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy file or directory
function copyItem(item) {
  const srcPath = path.join(SRC, item);

  if (!fs.existsSync(srcPath)) {
    console.log(`  ⚠ Skipping ${item} (not found)`);
    return;
  }

  const stat = fs.statSync(srcPath);

  if (stat.isDirectory()) {
    const destPath = path.join(DIST, item);
    copyDir(srcPath, destPath);
    console.log(`  ✓ Copied ${item}/`);
  } else {
    const destPath = path.join(DIST, path.basename(item));
    fs.copyFileSync(srcPath, destPath);
    console.log(`  ✓ Copied ${item}`);
  }
}

function runConceptualTimingExport() {
  const projectDir = path.join(ROOT, "meditativeclocks", "exhibition");
  if (!fs.existsSync(projectDir)) {
    console.log("  ⚠ Skipping Conceptual Timing export (project not found)");
    return;
  }

  console.log("  ↳ Running Next export in meditativeclocks/exhibition");
  execSync("npm run build", {
    cwd: projectDir,
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "production" },
  });

  const outDir = path.join(projectDir, "out");
  if (!fs.existsSync(outDir)) {
    throw new Error(
      "Conceptual Timing export missing out/ directory. Run the export before building.",
    );
  } else {
    console.log("  ✓ Conceptual Timing export ready");
  }
}

function copyConceptualTimingExportToDocs() {
  const outDir = path.join(ROOT, "meditativeclocks", "exhibition", "out");
  const destDir = path.join(DIST, "meditativeclocks", "exhibition");

  if (!fs.existsSync(outDir)) {
    throw new Error(
      "Conceptual Timing export missing out/ directory. Run the export before building.",
    );
  }

  copyDir(outDir, destDir);
  console.log(
    "  ✓ Copied Conceptual Timing export to docs/meditativeclocks/exhibition/",
  );
}

// Main build
async function build() {
  console.log("🔨 Building Selà website...\n");

  // Clean
  console.log("1. Cleaning docs/");
  cleanDocs();

  // Track hash mappings for HTML replacement
  const hashMap = {};

  // Process CSS
  console.log("\n2. Minifying CSS");
  for (const file of CSS_FILES) {
    const inputPath = path.join(SRC, file);
    if (!fs.existsSync(inputPath)) {
      console.log(`  ⚠ Skipping ${file} (not found)`);
      continue;
    }

    const minified = minifyCSS(inputPath);
    const hash = contentHash(minified);
    const baseName = path.basename(file, ".css");
    const hashedName = `${baseName}.${hash}.min.css`;

    fs.writeFileSync(path.join(DIST, hashedName), minified);
    hashMap[file] = hashedName;

    const originalSize = fs.statSync(inputPath).size;
    const minifiedSize = minified.length;
    const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
    console.log(`  ✓ ${file} → ${hashedName} (${savings}% smaller)`);
  }

  // Process JS
  console.log("\n3. Minifying JS");
  for (const file of JS_FILES) {
    const inputPath = path.join(SRC, file);
    if (!fs.existsSync(inputPath)) {
      console.log(`  ⚠ Skipping ${file} (not found)`);
      continue;
    }

    const minified = await minifyJS(inputPath);
    const hash = contentHash(minified);
    const baseName = path.basename(file, ".js");
    const hashedName = `${baseName}.${hash}.min.js`;

    fs.writeFileSync(path.join(DIST, hashedName), minified);
    hashMap[file] = hashedName;

    const originalSize = fs.statSync(inputPath).size;
    const minifiedSize = minified.length;
    const savings = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
    console.log(`  ✓ ${file} → ${hashedName} (${savings}% smaller)`);
  }

  // Build Conceptual Timing export
  console.log("\n4. Building Conceptual Timing export");
  runConceptualTimingExport();

  // Copy static assets
  console.log("\n5. Copying static assets");
  for (const item of COPY_ITEMS) {
    copyItem(item);
  }

  // Copy Conceptual Timing export into docs/meditativeclocks/exhibition
  console.log("\n5.1 Copying Conceptual Timing export");
  copyConceptualTimingExportToDocs();

  // Copy exhibition public assets to docs root (for /mockups paths)
  console.log("\n5.2 Copying exhibition public assets");
  const exhibitionPublicDir = path.join(
    ROOT,
    "meditativeclocks",
    "exhibition",
    "public",
  );
  if (fs.existsSync(exhibitionPublicDir)) {
    copyDir(exhibitionPublicDir, DIST);
    console.log("  ✓ Copied exhibition public assets to docs/");
  } else {
    console.log("  ⚠ Skipping exhibition public assets (not found)");
  }

  // Process HTML files
  console.log("\n6. Processing HTML");
  for (const file of HTML_FILES) {
    const inputPath = path.join(SRC, file);
    if (!fs.existsSync(inputPath)) {
      console.log(`  ⚠ Skipping ${file} (not found)`);
      continue;
    }

    let html = fs.readFileSync(inputPath, "utf8");

    // Replace asset references with hashed versions
    for (const [original, hashed] of Object.entries(hashMap)) {
      // Handle both quoted and unquoted references
      html = html.replace(
        new RegExp(`["']${original}["']`, "g"),
        `"${hashed}"`,
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

  // Create .nojekyll to prevent GitHub Pages Jekyll processing
  fs.writeFileSync(path.join(DIST, ".nojekyll"), "");
  console.log("\n7. Created .nojekyll");

  // Summary
  console.log("\n✅ Build complete!");
  console.log(`   Output: ${DIST}`);

  // Calculate total size
  let totalSize = 0;
  function calcSize(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        calcSize(p);
      } else {
        totalSize += fs.statSync(p).size;
      }
    }
  }
  calcSize(DIST);
  console.log(`   Total size: ${(totalSize / 1024).toFixed(1)} KB`);
}

build().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
