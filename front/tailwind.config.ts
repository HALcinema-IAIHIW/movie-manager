import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // より深みのある暗いトーンのカラーパレット
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // 高級映画館らしい深い色調
        darkest: "#0a0d14", // 最も深い背景色
        darker: "#0f131e", // 深い背景色
        dark: "#161b2c", // 基本背景色
        "dark-lighter": "#1e2538", // 少し明るい背景色

        // 高級感を演出するゴールド系
        gold: {
          DEFAULT: "#d4af37",
          light: "#e5c76b",
          dark: "#b8941f",
        },

        // アクセントカラー（既存を深く調整）
        accent: {
          DEFAULT: "#6b6b7d",
          light: "#8a8a9d",
          dark: "#4a4a5a",
        },

        // テキスト用の白系統
        "text-primary": "#ffffff",
        "text-secondary": "#e2e8f0",
        "text-muted": "#94a3b8",
        "text-subtle": "#64748b",

        // その他のshadcn/ui互換色
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },

      // フォントファミリーの設定
      fontFamily: {
        // 英語テキスト用のフォント
        playfair: ["var(--font-playfair)", "serif"],
        // 日本語テキスト用のフォント
        shippori: ["var(--font-shippori)", "serif"],
        // デフォルトフォント設定
        sans: ["var(--font-shippori)", "serif"],
        serif: ["var(--font-shippori)", "serif"],
      },

      // カスタムアニメーション
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out",
        "slide-in-left": "slide-in-left 0.5s ease-out",
        "scale-in": "scale-in 0.4s ease-out",
      },

      // カスタムボックスシャドウ（高級感演出）
      boxShadow: {
        luxury: "0 8px 32px rgba(0, 0, 0, 0.4)",
        "luxury-lg": "0 16px 64px rgba(0, 0, 0, 0.5)",
        "gold-glow": "0 0 20px rgba(212, 175, 55, 0.3)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
