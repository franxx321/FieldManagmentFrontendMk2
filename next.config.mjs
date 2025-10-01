/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default {
    output: "standalone",
    // Only set basePath when not empty (subdomain deployments shouldn't use it)
    ...(basePath ? { basePath } : {}),
};

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

//export default nextConfig
