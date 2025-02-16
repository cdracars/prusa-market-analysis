/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  images: {
    unoptimized: true,  // Required for static export
  },
  // Ensure your repo name is used for GitHub Pages
  assetPrefix: process.env.NODE_ENV === 'production' ? '/prusa-market-analysis' : '',
}

module.exports = nextConfig