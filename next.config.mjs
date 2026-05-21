/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // If you are deploying to a sub-path (like github pages),
  // you might need basePath. But for now we assume root.
};

export default nextConfig;
