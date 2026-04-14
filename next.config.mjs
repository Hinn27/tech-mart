/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Cho phép load ảnh từ tất cả các domain https
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Cho phép cả unoptimized cho ảnh local
    unoptimized: true,
  },
}

export default nextConfig
