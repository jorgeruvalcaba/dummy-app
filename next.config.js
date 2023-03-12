// const { BASE_URL } = require('./src/constants/platform')

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async rewrites() {
    return [
      {
        source: `/api/:path*`,
        destination: 'https://dummy-backend-rttuh5f3wq-uc.a.run.app/:path*',
      },
    ]
  },
}

module.exports = nextConfig
