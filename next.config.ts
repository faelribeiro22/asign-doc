import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb' // Limite de 10MB para o tamanho do corpo da requisição
    }
  },
  images: {
    domains: ['localhost']
  },
  rewrites: async () => {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*'
      }
    ]
  }
}

export default nextConfig
