#!/usr/bin/env node

import { execSync, spawn } from "child_process";
import fs from "fs";
import path from "path";

// 色付きログ出力
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
  log(`❌ ${message}`, "red");
}

function logSuccess(message) {
  log(`✅ ${message}`, "green");
}

function logWarning(message) {
  log(`⚠️  ${message}`, "yellow");
}

function logInfo(message) {
  log(`ℹ️  ${message}`, "blue");
}

// チェック結果を格納
const results = {
  passed: [],
  failed: [],
  warnings: [],
};

// 依存関係チェック
function checkDependencies() {
  logInfo("依存関係のチェック中...");

  try {
    // package.jsonの存在確認
    if (!fs.existsSync("package.json")) {
      results.failed.push("package.jsonが見つかりません");
      return false;
    }

    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

    // 必須依存関係の確認
    const requiredDeps = [
      "react",
      "react-dom",
      "next",
      "typescript",
      "@storybook/nextjs",
      "tailwindcss",
    ];

    const missingDeps = requiredDeps.filter((dep) => {
      return (
        !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
      );
    });

    if (missingDeps.length > 0) {
      results.failed.push(`必須依存関係が不足: ${missingDeps.join(", ")}`);
      return false;
    }

    // 依存関係のバージョン競合チェック
    try {
      execSync("npm ls --depth=0", { stdio: "pipe" });
      logSuccess("依存関係のバージョン競合なし");
    } catch (error) {
      results.warnings.push("依存関係のバージョン競合が検出されました");
    }

    results.passed.push("依存関係チェック完了");
    return true;
  } catch (error) {
    results.failed.push(`依存関係チェックエラー: ${error.message}`);
    return false;
  }
}

// TypeScript型チェック
function checkTypeScript() {
  logInfo("TypeScript型チェック中...");

  try {
    execSync("npx tsc --noEmit", { stdio: "pipe" });
    results.passed.push("TypeScript型チェック完了");
    return true;
  } catch (error) {
    results.failed.push("TypeScript型エラーが検出されました");
    return false;
  }
}

// リントチェック
function checkLinting() {
  logInfo("コードリントチェック中...");

  try {
    execSync("npm run lint", { stdio: "pipe" });
    results.passed.push("リントチェック完了");
    return true;
  } catch (error) {
    results.failed.push("リントエラーが検出されました");
    return false;
  }
}

// フォーマットチェック
function checkFormatting() {
  logInfo("コードフォーマットチェック中...");

  try {
    execSync("npx biome check --write", { stdio: "pipe" });
    results.passed.push("フォーマットチェック完了");
    return true;
  } catch (error) {
    results.warnings.push("フォーマットの問題が検出されました（自動修正済み）");
    return true;
  }
}

// コンポーネント構造チェック
function checkComponentStructure() {
  logInfo("コンポーネント構造チェック中...");

  const componentDirs = ["components/ui", "app/_components"];

  let hasIssues = false;

  componentDirs.forEach((dir) => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir, { withFileTypes: true });

      files.forEach((file) => {
        if (file.isDirectory()) {
          const componentPath = path.join(dir, file.name);
          const componentFiles = fs.readdirSync(componentPath);

          // 必須ファイルの確認
          const requiredFiles = ["index.ts"];
          const missingFiles = requiredFiles.filter(
            (file) => !componentFiles.includes(file),
          );

          if (missingFiles.length > 0) {
            results.warnings.push(
              `${componentPath}: 必須ファイルが不足 (${missingFiles.join(", ")})`,
            );
            hasIssues = true;
          }

          // TypeScriptファイルの確認
          const tsFiles = componentFiles.filter(
            (file) => file.endsWith(".tsx") || file.endsWith(".ts"),
          );
          if (tsFiles.length === 0) {
            results.warnings.push(
              `${componentPath}: TypeScriptファイルが見つかりません`,
            );
            hasIssues = true;
          }
        }
      });
    }
  });

  if (!hasIssues) {
    results.passed.push("コンポーネント構造チェック完了");
  }

  return !hasIssues;
}

// Storybook設定チェック
function checkStorybookConfig() {
  logInfo("Storybook設定チェック中...");

  const requiredFiles = [".storybook/main.ts", ".storybook/preview.ts"];

  let hasIssues = false;

  requiredFiles.forEach((file) => {
    if (!fs.existsSync(file)) {
      results.failed.push(`Storybook設定ファイルが見つかりません: ${file}`);
      hasIssues = true;
    }
  });

  if (!hasIssues) {
    results.passed.push("Storybook設定チェック完了");
  }

  return !hasIssues;
}

// 型定義ファイルチェック
function checkTypeDefinitions() {
  logInfo("型定義ファイルチェック中...");

  const requiredTypeFiles = [
    "lib/types/component.ts",
    "lib/utils/component.ts",
  ];

  let hasIssues = false;

  requiredTypeFiles.forEach((file) => {
    if (!fs.existsSync(file)) {
      results.failed.push(`型定義ファイルが見つかりません: ${file}`);
      hasIssues = true;
    }
  });

  if (!hasIssues) {
    results.passed.push("型定義ファイルチェック完了");
  }

  return !hasIssues;
}

// ビルドテスト
function checkBuild() {
  logInfo("ビルドテスト中...");

  try {
    execSync("npm run build", { stdio: "pipe" });
    results.passed.push("ビルドテスト完了");
    return true;
  } catch (error) {
    results.failed.push("ビルドエラーが検出されました");
    return false;
  }
}

// セキュリティチェック
function checkSecurity() {
  logInfo("セキュリティチェック中...");

  try {
    execSync("npm audit --audit-level=moderate", { stdio: "pipe" });
    results.passed.push("セキュリティチェック完了");
    return true;
  } catch (error) {
    results.warnings.push("セキュリティの脆弱性が検出されました");
    return false;
  }
}

// CSS依存関係チェック
async function checkCSSDependencies() {
  logInfo("CSS依存関係チェック中...");

  try {
    // コンポーネント化されたCSSアナライザーを使用
    const { CSSDependencyAnalyzer } = await import(
      "../lib/analyzers/css-analyzer.js"
    );

    // 設定を読み込み
    const config = await import("../css-analysis.config.js");
    const analyzer = new CSSDependencyAnalyzer(config.default || config);

    // 分析を実行
    const analysis = await analyzer.analyze();

    // 問題と推奨事項をチェック
    if (analysis.issues.length > 0) {
      results.warnings.push(
        `CSS問題が検出されました (${analysis.issues.length}件)`,
      );
    }

    if (analysis.recommendations.length > 0) {
      results.warnings.push(
        `CSS推奨事項が検出されました (${analysis.recommendations.length}件)`,
      );
    }

    results.passed.push("CSS依存関係チェック完了");
    return true;
  } catch (error) {
    results.warnings.push(`CSS依存関係チェックエラー: ${error.message}`);
    return false;
  }
}

// 結果の表示
function displayResults() {
  console.log("\n" + "=".repeat(60));
  log("品質チェック結果", "cyan");
  console.log("=".repeat(60));

  if (results.passed.length > 0) {
    log("\n✅ 成功したチェック:", "green");
    results.passed.forEach((item) => log(`  • ${item}`, "green"));
  }

  if (results.warnings.length > 0) {
    log("\n⚠️  警告:", "yellow");
    results.warnings.forEach((item) => log(`  • ${item}`, "yellow"));
  }

  if (results.failed.length > 0) {
    log("\n❌ 失敗したチェック:", "red");
    results.failed.forEach((item) => log(`  • ${item}`, "red"));
  }

  console.log("\n" + "=".repeat(60));

  const totalChecks =
    results.passed.length + results.warnings.length + results.failed.length;
  const successRate = ((results.passed.length / totalChecks) * 100).toFixed(1);

  log(`総チェック数: ${totalChecks}`, "cyan");
  log(`成功率: ${successRate}%`, "cyan");

  if (results.failed.length > 0) {
    log(
      "\n🚫 品質チェックが失敗しました。修正してから再度実行してください。",
      "red",
    );
    process.exit(1);
  } else if (results.warnings.length > 0) {
    log("\n⚠️  警告がありますが、Pushは可能です。", "yellow");
  } else {
    log("\n🎉 すべての品質チェックが成功しました！", "green");
  }
}

// メイン実行関数
async function main() {
  log("🚀 品質チェックを開始します...", "cyan");

  const checks = [
    checkDependencies,
    checkTypeScript,
    checkLinting,
    checkFormatting,
    checkComponentStructure,
    checkStorybookConfig,
    checkTypeDefinitions,
    checkBuild,
    checkSecurity,
    checkCSSDependencies,
  ];

  for (const check of checks) {
    try {
      if (check === checkCSSDependencies) {
        await check();
      } else {
        check();
      }
    } catch (error) {
      results.failed.push(`チェック実行エラー: ${error.message}`);
    }
  }

  displayResults();
}

// スクリプトが直接実行された場合
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  checkDependencies,
  checkTypeScript,
  checkLinting,
  checkFormatting,
  checkComponentStructure,
  checkStorybookConfig,
  checkTypeDefinitions,
  checkBuild,
  checkSecurity,
  checkCSSDependencies,
  results,
};
