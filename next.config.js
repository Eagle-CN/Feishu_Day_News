/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // 匹配所有 API 路由
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  // 添加飞书域名到允许列表
  async rewrites() {
    return [
      {
        source: '/feishu/:path*',
        destination: 'https://open.feishu.cn/:path*',
      },
    ];
  },
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['sf1-cdn-tos.douyinstatic.com', 'sf3-cdn-tos.douyinstatic.com'],
  },
}

module.exports = nextConfig 