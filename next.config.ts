import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: process.env.NEXT_PUBLIC_IMAGE_DOMAIN || '161.97.167.73',
        port: process.env.NEXT_PUBLIC_IMAGE_PORT || '8001',
        pathname: '/storage/**',
      },
    ],
  },
};

export default nextConfig;
