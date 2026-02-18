#!/usr/bin/env node
/**
 * Sitemap generator for Selà website
 * Generates sitemap.xml with all public pages
 */

const fs = require("fs");
const path = require("path");

const DOMAIN = "https://xn--sel-cla.com";
const ROOT = path.resolve(__dirname, "..");

// Pages with their priorities and change frequencies
const PAGES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  // Clock subpages
  {
    path: "/meditativeclocks/clocks/semi-linear_clock_svg/",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    path: "/meditativeclocks/clocks/the_ebb_and_flow_of_time_svg/",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    path: "/meditativeclocks/clocks/present_past_and_future/",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    path: "/meditativeclocks/clocks/abstract_hourglass/",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    path: "/meditativeclocks/clocks/universe_clock/",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    path: "/meditativeclocks/clocks/serendipity/",
    priority: "0.8",
    changefreq: "monthly",
  },
];

function generateSitemap() {
  const today = new Date().toISOString().split("T")[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  for (const page of PAGES) {
    xml += `  <url>
    <loc>${DOMAIN}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  }

  xml += `</urlset>
`;

  return xml;
}

// Generate and save
const sitemap = generateSitemap();
const outputPath = path.join(ROOT, "sitemap.xml");
fs.writeFileSync(outputPath, sitemap);
console.log(`✓ Generated sitemap.xml (${PAGES.length} URLs)`);
