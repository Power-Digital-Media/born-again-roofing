import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [50, 60, 75],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'checkinsandreviews.s3.us-east-2.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
