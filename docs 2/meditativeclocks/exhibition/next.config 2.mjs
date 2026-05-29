/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";

// In ESM (`.mjs`), `__dirname` is not available. Use import.meta.url instead.
const turbopackRoot = new URL(".", import.meta.url).pathname.replace(/\/$/, "");

const nextConfig = {
  output: "export",
  basePath: isProd ? "/meditativeclocks/exhibition" : "",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: turbopackRoot,
  },
};

export default nextConfig;
