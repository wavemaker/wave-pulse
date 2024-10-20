/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: '/wavepulse',
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
    distDir: 'build',
    output: 'standalone',
    productionBrowserSourceMaps: true
}

module.exports = nextConfig
