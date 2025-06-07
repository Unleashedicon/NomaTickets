/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
    turbopack: false,
  },
    reactStrictMode: true,
      webpack: (config) => {
        config.resolve.fallback = { fs: false, net: false, tls: false };
        config.externals.push("pino-pretty", "lokijs", "encoding");
        return config;
      },
    };
    
    module.exports = nextConfig;