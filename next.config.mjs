import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'static.bytespark.me' },
      { hostname: '*.github.io' },
      { hostname: '*.githubusercontent.com' },
      { hostname: 'picsum.photos' },
    ],
  },
};

if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

export default nextConfig;
