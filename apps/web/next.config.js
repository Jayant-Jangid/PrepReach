/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    'lucide-react',
    'react-hot-toast',
    'tailwind-merge',
    'clsx',
    'zustand',
    'js-cookie',
  ],
  images: {
    domains: ['localhost', 'res.cloudinary.com', 'via.placeholder.com'],
  },
}
module.exports = nextConfig
