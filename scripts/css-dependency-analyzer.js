#!/usr/bin/env node

/**
 * CSS依存関係分析ツール (コンポーネント化版)
 *
 * 使用方法:
 *   node scripts/css-dependency-analyzer.js [options]
 *
 * オプション:
 *   --config <file>     設定ファイルのパス (デフォルト: css-analysis.config.js)
 *   --output <format>   出力形式 (console, json, html, markdown)
 *   --file <path>       出力ファイルのパス
 *   --detailed          詳細レポートを生成
 *   --help              ヘルプを表示
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// TypeScriptファイルを動的にインポート
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// プロジェクトルートのパスを取得
const projectRoot = path.resolve(__dirname, "..");

// 設定ファイルを読み込み
async function loadConfig(configPath) {
  const fullPath = path.resolve(projectRoot, configPath);

  if (!fs.existsSync(fullPath)) {
    console.error(`❌ 設定ファイルが見つかりません: ${fullPath}`);
    process.exit(1);
  }

  try {
    const config = await import(fullPath);
    return config.default || config;
  } catch (error) {
    console.error(`❌ 設定ファイルの読み込みエラー: ${error.message}`);
    process.exit(1);
  }
}

// コマンドライン引数を解析
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    config: "css-analysis.config.js",
    output: "console",
    file: null,
    detailed: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case "--config":
        options.config = args[++i];
        break;
      case "--output":
        options.output = args[++i];
        break;
      case "--file":
        options.file = args[++i];
        break;
      case "--detailed":
        options.detailed = true;
        break;
      case "--help":
      case "-h":
        options.help = true;
        break;
      default:
        console.warn(`⚠️  不明なオプション: ${arg}`);
    }
  }

  return options;
}

// ヘルプを表示
function showHelp() {
  console.log(`
CSS依存関係分析ツール (コンポーネント化版)

使用方法:
  node scripts/css-dependency-analyzer.js [options]

オプション:
  --config <file>     設定ファイルのパス (デフォルト: css-analysis.config.js)
  --output <format>   出力形式 (console, json, html, markdown)
  --file <path>       出力ファイルのパス
  --detailed          詳細レポートを生成
  --help              このヘルプを表示

例:
  node scripts/css-dependency-analyzer.js --output html --file report.html
  node scripts/css-dependency-analyzer.js --detailed --output markdown
  node scripts/css-dependency-analyzer.js --config custom-config.js
`);
}

// メイン実行関数
async function main() {
  try {
    const options = parseArgs();

    if (options.help) {
      showHelp();
      return;
    }

    console.log("🔍 CSS依存関係分析を開始...\n");

    // 設定を読み込み
    const config = await loadConfig(options.config);
    console.log(`📋 設定ファイル: ${options.config}`);

    // CSSアナライザーを動的にインポート
    const { CSSDependencyAnalyzer } = await import(
      "../lib/analyzers/css-analyzer.js"
    );
    const { CSSReportGenerator } = await import(
      "../lib/analyzers/report-generator.js"
    );

    // アナライザーを初期化
    const analyzer = new CSSDependencyAnalyzer(config);
    console.log("✅ CSSアナライザーを初期化しました");

    // 分析を実行
    console.log("🔍 分析を実行中...");
    const analysis = await analyzer.analyze();
    console.log("✅ 分析が完了しました");

    // レポート生成器を初期化
    const reportConfig = {
      detailed: options.detailed,
      outputFormat: options.output,
      showStatistics: true,
      showRecommendations: true,
    };

    const reportGenerator = new CSSReportGenerator(reportConfig);
    console.log("✅ レポート生成器を初期化しました");

    // レポートを生成
    console.log(`📊 ${options.output}形式でレポートを生成中...`);
    const report = reportGenerator.generateReport(analysis);

    // 出力
    if (options.file) {
      await reportGenerator.saveReport(analysis, options.file);
      console.log(`💾 レポートを保存しました: ${options.file}`);
    } else {
      console.log("\n" + "=".repeat(80));
      console.log(report);
    }

    // 統計情報を表示
    console.log("\n📈 分析結果サマリー:");
    console.log(`  • コンポーネント数: ${analysis.statistics.totalComponents}`);
    console.log(
      `  • Tailwindクラス数: ${analysis.statistics.totalTailwindClasses}`,
    );
    console.log(
      `  • カスタムクラス数: ${analysis.statistics.totalCustomClasses}`,
    );
    console.log(`  • 推奨事項数: ${analysis.statistics.totalRecommendations}`);
    console.log(`  • 成功率: ${analysis.statistics.successRate.toFixed(1)}%`);

    if (analysis.issues.length > 0) {
      console.log(`\n⚠️  問題が ${analysis.issues.length} 件見つかりました:`);
      analysis.issues.forEach((issue, index) => {
        console.log(
          `  ${index + 1}. [${issue.type.toUpperCase()}] ${issue.message}`,
        );
      });
    }

    if (analysis.recommendations.length > 0) {
      console.log(
        `\n💡 推奨事項が ${analysis.recommendations.length} 件あります:`,
      );
      analysis.recommendations.forEach((rec, index) => {
        console.log(
          `  ${index + 1}. ${rec.message} (影響度: ${rec.impact}, 作業量: ${rec.effort})`,
        );
      });
    }

    console.log("\n✅ CSS依存関係分析が完了しました！");
  } catch (error) {
    console.error("\n❌ エラーが発生しました:");
    console.error(error.message);

    if (error.stack) {
      console.error("\nスタックトレース:");
      console.error(error.stack);
    }

    process.exit(1);
  }
}

// スクリプトが直接実行された場合のみmain()を呼び出し
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
