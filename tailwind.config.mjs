/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './index.html'],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#0d0e0f',
          900: '#121314',
          800: '#1a1b1d',
          700: '#242628',
          600: '#323538'
        },
        parchment: {
          50: '#f9f6f0',
          100: '#f3eee6',
          200: '#e6dfd3',
          300: '#d5cbbe',
          400: '#b8ab9a',
          dark: '#262422',
          ink: '#1c1b18'
        },
        moss: {
          900: '#1e2617',
          800: '#2e3a23',
          700: '#3f4f30',
          600: '#526640',
          500: '#698252',
          400: '#8ca672'
        },
        rust: {
          900: '#4d1912',
          800: '#73271c',
          700: '#9e3a2b',
          600: '#bd4b3a',
          500: '#d6604e'
        },
        tape: {
          dim: '#9a752b',
          DEFAULT: '#d6a842',
          light: '#e8be5d',
          faded: '#ecd599'
        }
      },
      fontFamily: {
        typewriter: ['"Special Elite"', '"Courier Prime"', 'Courier', 'monospace'],
        handwriting: ['"Caveat"', '"Permanent Marker"', 'cursive'],
        serif: ['"Courier Prime"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'paper': '2px 4px 15px rgba(0, 0, 0, 0.6), 0 1px 3px rgba(0, 0, 0, 0.4)',
        'polaroid': '0 8px 24px rgba(0, 0, 0, 0.75), 0 2px 6px rgba(0,0,0,0.5)',
        'tape': '0 1px 3px rgba(0,0,0,0.3)'
      }
    }
  },
  plugins: []
};
