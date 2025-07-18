export default {
  // 分析対象ディレクトリ
  directories: {
    components: [
      "components/ui",
      "app/_components",
      "app/(auth)",
      "components",
    ],
    css: ["app/globals.css", "styles/globals.css", "styles/main.css"],
  },

  // Tailwind CSS設定
  tailwind: {
    configFile: "tailwind.config.ts",
    analyzeTheme: true,
    analyzePlugins: true,
    detectCustomClasses: true,
  },

  // 分析オプション
  analysis: {
    // クラスパターンの重複検出
    detectDuplicatePatterns: true,

    // 長すぎるクラスリストの検出
    maxClassesPerComponent: 10,

    // 未使用クラスの検出
    detectUnusedClasses: true,

    // コンポーネント依存関係の分析
    analyzeComponentDependencies: true,

    // CSS変数の分析
    analyzeCSSVariables: true,

    // @layerディレクティブの分析
    analyzeLayers: true,
  },

  // 出力設定
  output: {
    // 詳細レポートの出力
    detailed: true,

    // 色付き出力
    colored: true,

    // 統計情報の表示
    showStatistics: true,

    // 推奨事項の表示
    showRecommendations: true,

    // 依存関係グラフの生成
    generateDependencyGraph: false,
  },

  // 警告・エラーの閾値
  thresholds: {
    // 重複パターンの警告閾値
    duplicatePatterns: 1,

    // 長いクラスリストの警告閾値
    longClassList: 10,

    // 未使用クラスの警告閾値
    unusedClasses: 5,
  },

  // 除外パターン
  exclude: {
    // 除外するファイルパターン
    files: ["**/*.test.*", "**/*.spec.*", "**/node_modules/**", "**/.next/**"],

    // 除外するクラスパターン
    classes: ["sr-only", "hidden", "invisible"],
  },
};
