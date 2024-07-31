/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: 'd12wklypp119aj.cloudfront.net' }
    ]
  }
};

export default nextConfig;
