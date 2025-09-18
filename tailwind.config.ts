/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    // "*.{js,ts,jsx,tsx,mdx}", // Temporarily commented out for diagnosis
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      screens: {
        "2xl": "1400px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Arial", "Helvetica", "sans-serif"],
        inter: ["var(--font-inter)", "Arial", "Helvetica", "sans-serif"],
        'source-serif-pro': ["var(--font-source-serif-pro)", "Georgia", "serif"],
        serif: ["var(--font-source-serif-pro)", "Georgia", "serif"],
      },
      fontSize: {
        // Оптимизированные размеры в стиле Wildberries (14-24px диапазон)
        'app-h1-mobile': '1.5rem',   // 24px - максимальный размер для мобильных
        'app-h1': '1.75rem',         // 28px - крупные заголовки
        'app-h2-mobile': '1.375rem', // 22px - средние заголовки на мобильных
        'app-h2': '1.5rem',          // 24px - средние заголовки
        'app-h3-mobile': '1.125rem', // 18px - подзаголовки на мобильных
        'app-h3': '1.25rem',         // 20px - подзаголовки
        'app-body': '1rem',          // 16px - основной текст
        'app-small': '0.875rem',     // 14px - мелкий текст (минимум по WB)
        'app-caption': '0.75rem',    // 12px - подписи
        // Дополнительные размеры для гибкости
        'app-large': '1.125rem',     // 18px - крупный основной текст
        'app-medium': '0.9375rem',   // 15px - промежуточный размер
      },
      lineHeight: {
        'cyr-text': '1.6',
        'cyr-large': '1.7',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // Цвета Wildberries для акцентов
        wildberries: {
          primary: "hsl(var(--wildberries-primary))",
          secondary: "hsl(var(--wildberries-secondary))",
          dark: "hsl(var(--wildberries-dark))",
          darkest: "hsl(var(--wildberries-darkest))",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        'tabs-active': 'hsl(var(--primary))',
        'tabs-active-text': 'hsl(var(--primary-foreground))',
        'progress-track': 'hsl(var(--border))',
        'progress-indicator': 'hsl(var(--primary))',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
