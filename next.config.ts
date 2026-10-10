import type { NextConfig } from "next";

// Netlify draft/preview/branch/permalink deploys are served from "<name>--<site>.netlify.app" hosts. Only those
// hosts get a non-indexable header; www.bornagainroofing.com and the primary <site>.netlify.app never match.
const nextConfig: NextConfig = {
  trailingSlash: true,
  async headers() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: '(?<deploy>.+--.+\\.netlify\\.app)' }],
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
      },
    ];
  },
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
