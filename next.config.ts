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
      {
        protocol: 'http',
        hostname: 'api.jamjamtrek.tours',
        port: '',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'api.jamjamtrek.tours',
        port: '',
        pathname: '/storage/**',
      },
    ],
  },
};

export default nextConfig;
