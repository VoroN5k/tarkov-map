import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },
}

export default nextConfig
