/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    // Prevent bundling of Node.js core modules for the client
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // Exclude server-only packages from client bundles
    config.externals = [
      ...(config.externals || []),
      "pino-pretty",
      "lokijs",
      "encoding",
    ];

    return config;
  },

  // Allow builds with TS errors in specific environments
  typescript: {
    ignoreBuildErrors: process.env.SKIP_TYPECHECK === "true",
  },

  reactStrictMode: true, // Recommended for catching subtle bugs
};

module.exports = nextConfig;
