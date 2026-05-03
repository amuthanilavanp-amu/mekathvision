/**
 * next.config.js – basic configuration for Maketh Vision
 */
module.exports = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pairbjcztchlwpenzxbi.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Enable experimental appDir for Next.js 14 (if needed)
  experimental: {
    appDir: true,
  },
};
