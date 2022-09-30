/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack(config) {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    //config.externals = [...config.externals, "stockfish"];
    return config;
  },
};

module.exports = nextConfig;
