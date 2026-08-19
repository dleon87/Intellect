/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#561FB7',
          lighter: '#EFE9FA',
          hover: '#43188F',
          pressed: '#34136F',
          disabled: '#946BDB',
        },
        danger: {
          DEFAULT: '#CC293C',
          hover: '#A11C2B',
          pressed: '#85212D',
          disabled: '#F26172',
        },
        info: { DEFAULT: '#04728D', lighter: '#E8F6FA' },
        success: { DEFAULT: '#0B773A', lighter: '#E6F7EE' },
        warning: { DEFAULT: '#9E4B12', lighter: '#FAF0E8' },
        content: {
          text: '#111827',
          /* Foreground/content-text-color-alt1 — DS "text secondary". Was
             missing from this config; the dialog body copy needs it. */
          alt1: '#374151',
          disabled: '#9CA3AF',
        },
        placeholder: '#6b7280',
        /* From the Hub & Spoke Figma file — hub-post surface, its body copy,
           and the link blue used for an author's name. */
        'grey-100': '#F9FAFC',
        'dark-grey': '#4F5B68',
        link: '#145FC8',
        border: {
          DEFAULT: '#d1d5db',
          hover: '#d1d5db',
          light: '#e5e7eb',
        },
        surface: {
          DEFAULT: '#ffffff',
          alt2: '#f3f4f6',
          alt3: '#e5e7eb',
        },
        icon: {
          DEFAULT: '#6b7280',
          hover: '#374151',
          disabled: '#d1d5db',
        },
      },
      borderRadius: {
        'btn-bigger': '8px',
        'btn-bigger-small': '6px',
        'btn-default': '6px',
        'btn-small': '4px',
        'checkbox-default': '4px',
      },
      spacing: {
        48: '48px',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'focus-ring': '0 0 0 4px #561FB7, 0 0 0 6px #fff',
      },
    },
  },
  plugins: [],
}
