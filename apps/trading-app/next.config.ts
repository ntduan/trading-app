import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/**')],
  },
};

export default nextConfig;
