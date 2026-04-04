/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["img.daisyui.com", "img.clerk.com", "10.55.68.10"], // Tambahkan domain yang diizinkan untuk memuat gambar
  },
};

export default nextConfig;
