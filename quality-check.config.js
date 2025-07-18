module.exports = {
  // チェックの設定
  checks: {
    // 依存関係チェック
    dependencies: {
      enabled: true,
      required: [
        "react",
        "react-dom",
        "next",
        "typescript",
        "@storybook/nextjs",
        "tailwindcss",
      ],
      checkVersionConflicts: true,
    },

    // TypeScriptチェック
    typescript: {
      enabled: true,
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
    },

    // リントチェック
    linting: {
      enabled: true,
      tool: "biome",
      autoFix: true,
    },

    // フォーマットチェック
    formatting: {
      enabled: true,
      tool: "biome",
      autoFix: true,
    },

    // コンポーネント構造チェック
    componentStructure: {
      enabled: true,
      requiredFiles: ["index.ts"],
      requiredExtensions: [".tsx", ".ts"],
      componentDirs: ["components/ui", "app/_components"],
    },

    // Storybook設定チェック
    storybook: {
      enabled: true,
      requiredFiles: [".storybook/main.ts", ".storybook/preview.ts"],
    },

    // 型定義チェック
    typeDefinitions: {
      enabled: true,
      requiredFiles: ["lib/types/component.ts", "lib/utils/component.ts"],
    },

    // ビルドチェック
    build: {
      enabled: true,
      command: "npm run build",
    },

    // セキュリティチェック
    security: {
      enabled: true,
      auditLevel: "moderate",
    },
  },

  // エラー処理
  errorHandling: {
    // 失敗時にPushをブロック
    blockPushOnFailure: true,

    // 警告の扱い
    treatWarningsAsErrors: false,

    // 自動修正の有効化
    autoFix: true,
  },

  // レポート設定
  reporting: {
    // 詳細レポートの出力
    detailed: true,

    // 色付き出力
    colored: true,

    // 成功率の表示
    showSuccessRate: true,
  },
};
