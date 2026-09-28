/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './index.html'],
  theme: {
    extend: {
      colors: {
        concrete: {
          950: '#0c0d0d',
          900: '#131415',
          800: '#1a1b1d',
          700: '#232528',
          600: '#2d3034'
        },
        parchment: {
          DEFAULT: '#E3DED1',
          light: '#F2EDE4',
          dim: '#CFC8BA'
        },
        slate: {
          muted: '#7A8087',
          light: '#A5ABB3'
        },
        moss: {
          900: '#1e2617',
          800: '#2E3A23',
          700: '#3d4d2f',
          600: '#5E7A45',
          400: '#8EA870'
        },
        rust: {
          900: '#522219',
          800: '#6e2e22',
          700: '#8B3A2B',
          600: '#aa4735',
          500: '#C7523C'
        },
        tape: {
          DEFAULT: '#C69234',
          light: '#E0AB48',
          faded: '#DEC48E'
        }
      },
      fontFamily: {
        typewriter: ['"Special Elite"', '"Courier Prime"', 'Courier', 'monospace'],
        courier: ['"Courier Prime"', 'monospace'],
        handwriting: ['"Caveat"', 'cursive'],
        marker: ['"Permanent Marker"', 'cursive'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif']
      }
    }
  },
  plugins: []
};
