const path = require('path')

// Normalize to forward slashes for fast-glob compatibility on Windows
const webDir = __dirname.replace(/\\/g, '/')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `${webDir}/app/**/*.{js,ts,jsx,tsx,mdx}`,
    `${webDir}/components/**/*.{js,ts,jsx,tsx,mdx}`,
    `${webDir}/lib/**/*.{js,ts,jsx,tsx,mdx}`,
    `${webDir}/store/**/*.{js,ts,jsx,tsx,mdx}`,
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './store/**/*.{js,ts,jsx,tsx,mdx}',
    './apps/web/app/**/*.{js,ts,jsx,tsx,mdx}',
    './apps/web/components/**/*.{js,ts,jsx,tsx,mdx}',
    './apps/web/lib/**/*.{js,ts,jsx,tsx,mdx}',
    './apps/web/store/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#524C73',
          50: '#F5F4F8',
          100: '#EAE8F0',
          200: '#D5D1E1',
          300: '#B6B0CE',
          400: '#8A82AE',
          500: '#524C73',
          600: '#433E60',
          700: '#35314D',
          800: '#27243B',
          900: '#1A1828',
        },
        accent: {
          DEFAULT: '#B85324',
          50: '#FBF5F1',
          100: '#F6E9E1',
          200: '#ECD2C2',
          300: '#DEB097',
          400: '#CC815A',
          500: '#B85324',
          600: '#9E431B',
          700: '#7E3414',
          800: '#5F270F',
          900: '#421B0A',
        },
        background: '#FFFFFF',
        surface: {
          DEFAULT: '#F8F9FA',
          subtle: '#F3F4F6',
          muted: '#E5E7EB',
        },
        foreground: '#111827',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        elevated: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
        modal: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
