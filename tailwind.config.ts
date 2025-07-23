import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  // 使用されているクラスのみをsafelistに追加
  safelist: [
    // レイアウト
    "flex",
    "flex-col",
    "grid",
    "block",
    "relative",
    "absolute",
    // サイズ
    "w-full",
    "h-full",
    "min-h-screen",
    "h-screen",
    // パディング
    "p-0",
    "p-1",
    "p-2",
    "p-3",
    "p-4",
    "p-5",
    "p-6",
    "p-8",
    "px-0",
    "px-1",
    "px-2",
    "px-3",
    "px-4",
    "px-6",
    "px-8",
    "py-0",
    "py-1",
    "py-2",
    "py-3",
    "py-4",
    "py-6",
    "py-8",
    // マージン
    "mx-0",
    "mx-1",
    "mx-4",
    "my-4", // テキスト
    "text-xs",
    "text-sm",
    "text-base",
    "text-lg",
    "text-xl",
    "text-2xl",
    "font-normal",
    "font-medium",
    "font-semibold",
    "font-bold",
    // 背景色
    "bg-white",
    "bg-black",
    "bg-gray-50",
    "bg-gray-100",
    "bg-gray-200", // テキスト色
    "text-white", // ボーダー
    "border",
    "border-0",
    "border-2",
    "border-4", // 角丸
    "rounded",
    "rounded-sm",
    "rounded-md",
    "rounded-lg",
    "rounded-xl",
    "rounded-2xl",
    "rounded-full",
    // シャドウ
    "shadow",
    "shadow-sm",
    "shadow-lg",
    "shadow-xl", // 配置
    "items-center",
    "items-start",
    "items-end",
    "justify-center",
    "justify-between",
    "justify-start",
    "justify-end",
    // ギャップ
    "gap-1",
    "gap-2",
    "gap-3",
    "gap-4",
    "gap-6",
    "gap-8",
    // その他
    "block",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
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
        // Brand Colors
        brand: {
          primary: "hsl(var(--brand-primary))",
          "primary-hover": "hsl(var(--brand-primary-hover))",
          secondary: "hsl(var(--brand-secondary))",
          accent: "hsl(var(--brand-accent))",
          success: "hsl(var(--brand-success))",
          warning: "hsl(var(--brand-warning))",
          error: "hsl(var(--brand-error))",
        },
        // Text Colors
        text: {
          primary: "hsl(var(--text-primary))",
          secondary: "hsl(var(--text-secondary))",
          muted: "hsl(var(--text-muted))",
        },
        // Border Colors
        borderColor: {
          light: "hsl(var(--border-light))",
          medium: "hsl(var(--border-medium))",
          dark: "hsl(var(--border-dark))",
        },
        // Background Colors
        bg: {
          light: "hsl(var(--bg-light))",
          card: "hsl(var(--bg-card))",
          overlay: "hsl(var(--bg-overlay))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
