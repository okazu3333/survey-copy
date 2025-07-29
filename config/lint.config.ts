/**
 * リント設定
 *
 * BiomeとTypeScriptの設定を統合管理します。
 */

export const lintConfig = {
  // Biome設定
  biome: {
    formatter: {
      enabled: true,
      indentStyle: "space" as const,
      indentWidth: 2,
      lineWidth: 80,
    },
    linter: {
      enabled: true,
      rules: {
        recommended: true,
        style: {
          noDefaultExport: "off",
          useNamingConvention: "error",
        },
        nursery: {
          useSortedClasses: "off",
        },
        suspicious: {
          noArrayIndexKey: "off",
        },
      },
    },
    javascript: {
      formatter: {
        quoteStyle: "double" as const,
        trailingCommas: "all" as const,
        semicolons: "always" as const,
      },
    },
  },

  // TypeScript設定
  typescript: {
    strict: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    noImplicitReturns: true,
    noFallthroughCasesInSwitch: true,
    noUncheckedIndexedAccess: true,
  },

  // ファイルパターン
  patterns: {
    include: ["**/*.{ts,tsx,js,jsx}", "**/*.json", "**/*.md"],
    exclude: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "**/*.d.ts",
    ],
  },

  // カスタムルール
  customRules: {
    // コンポーネント命名規則
    componentNaming: {
      pattern: "^[A-Z][a-zA-Z0-9]*$",
      message: "コンポーネント名はPascalCaseである必要があります",
    },

    // ファイル命名規則
    fileNaming: {
      component: "^[A-Z][a-zA-Z0-9]*\\.tsx$",
      utility: "^[a-z][a-zA-Z0-9]*\\.ts$",
      type: "^[a-z][a-zA-Z0-9]*Types?\\.ts$",
    },

    // インポート順序
    importOrder: ["^react$", "^next", "^@/", "^[a-zA-Z]", "^[./]"],
  },
} as const;

// 設定の型定義
export type BiomeConfig = typeof lintConfig.biome;
export type TypeScriptConfig = typeof lintConfig.typescript;
