/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Enables static export
    images: {
      unoptimized: true, // Required if using Next.js Image component
    },
    trailingSlash: true, // Ensures correct routing for GitHub Pages
  };
  
  module.exports = nextConfig; // Correct CommonJS syntax
  