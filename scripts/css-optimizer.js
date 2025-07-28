#!/usr/bin/env node

import fs from "node:fs";
import { glob } from "glob";

const HARDCODED_COLORS = {
  "#138FB5": "brand-primary",
  "#0f7a9b": "brand-primary-hover",
  "#F4F7F9": "brand-secondary",
  "#60adc2": "brand-accent",
  "#4BBC80": "brand-success",
  "#FFE9A3": "brand-warning",
  "#D96868": "brand-error",
  "#333333": "text-primary",
  "#888888": "text-secondary",
  "#ABABAB": "text-muted",
  "#DCDCDC": "border-light",
  "#CBCBCB": "border-medium",
  "#8E99A2": "border-dark",
  "#F9F9F9": "bg-light",
  "#FFFFFF": "bg-overlay",
};

async function analyzeCSSDependencies() {
  console.log("🔍 CSS依存関係を分析中...");

  const tsxFiles = await glob("**/*.tsx", {
    ignore: ["node_modules/**", ".next/**"],
  });
  const colorUsage = {};

  for (const file of tsxFiles) {
    const content = fs.readFileSync(file, "utf-8");

    for (const [color, _className] of Object.entries(HARDCODED_COLORS)) {
      const regex = new RegExp(color.replace("#", "\\#"), "g");
      const matches = content.match(regex);

      if (matches) {
        if (!colorUsage[color]) {
          colorUsage[color] = [];
        }
        colorUsage[color].push({
          file,
          count: matches.length,
        });
      }
    }
  }

  console.log("\n📊 ハードコードされた色の使用状況:");
  for (const [color, usages] of Object.entries(colorUsage)) {
    const totalCount = usages.reduce((sum, usage) => sum + usage.count, 0);
    console.log(`\n${color} (${HARDCODED_COLORS[color]}): ${totalCount}回使用`);
    usages.forEach((usage) => {
      console.log(`  - ${usage.file}: ${usage.count}回`);
    });
  }

  return colorUsage;
}

async function generateOptimizationReport() {
  console.log("\n📋 最適化レポートを生成中...");

  const report = {
    totalFiles: 0,
    hardcodedColors: 0,
    recommendations: [],
  };

  const tsxFiles = await glob("**/*.tsx", {
    ignore: ["node_modules/**", ".next/**"],
  });
  report.totalFiles = tsxFiles.length;

  for (const file of tsxFiles) {
    const content = fs.readFileSync(file, "utf-8");
    const hardcodedColorMatches = content.match(/#[0-9A-Fa-f]{6}/g);

    if (hardcodedColorMatches) {
      report.hardcodedColors += hardcodedColorMatches.length;

      if (hardcodedColorMatches.length > 5) {
        report.recommendations.push({
          file,
          type: "high_color_usage",
          count: hardcodedColorMatches.length,
          suggestion:
            "カスタムCSS変数またはTailwindクラスに置き換えることを推奨",
        });
      }
    }
  }

  console.log("\n📈 最適化レポート:");
  console.log(`- 総ファイル数: ${report.totalFiles}`);
  console.log(`- ハードコードされた色の総数: ${report.hardcodedColors}`);
  console.log(`- 推奨改善箇所: ${report.recommendations.length}件`);

  if (report.recommendations.length > 0) {
    console.log("\n🔧 推奨改善箇所:");
    report.recommendations.forEach((rec) => {
      console.log(`- ${rec.file}: ${rec.count}個の色使用 → ${rec.suggestion}`);
    });
  }

  return report;
}

async function main() {
  try {
    await analyzeCSSDependencies();
    await generateOptimizationReport();

    console.log("\n✅ 分析完了！");
    console.log("\n💡 次のステップ:");
    console.log("1. ハードコードされた色をCSS変数に置き換える");
    console.log("2. 共通コンポーネントを作成して重複を削減");
    console.log("3. Tailwindのカスタムクラスを活用する");
  } catch (error) {
    console.error("❌ エラーが発生しました:", error);
    process.exit(1);
  }
}

main();
