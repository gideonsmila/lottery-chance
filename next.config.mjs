/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: () => [
    {
      source: '/:page*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store',
        },
      ],
    },
  ],
};

export default nextConfig;
