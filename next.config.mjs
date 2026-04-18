/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["img.daisyui.com", "img.clerk.com", "10.55.68.10"],
  },
  reactStrictMode: false,
  experimental: {
    middlewareClientMaxBodySize: "1gb",
    serverActions: {
      bodySizeLimit: "1gb",
    },
  },
};

export default nextConfig;
