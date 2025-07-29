#!/usr/bin/env node

import fs from "node:fs";
import { glob } from "glob";

async function analyzeCssSize() {
  console.log("🔍 CSSサイズ分析中...");

  const cssFiles = await glob("**/*.css", {
    ignore: ["node_modules/**", ".next/**"],
  });
  const tsxFiles = await glob("**/*.tsx", {
    ignore: ["node_modules/**", ".next/**"],
  });

  let totalCssSize = 0;
  const cssFileSizes = {};

  // CSSファイルのサイズを計算
  for (const file of cssFiles) {
    const content = fs.readFileSync(file, "utf-8");
    const size = Buffer.byteLength(content, "utf-8");
    totalCssSize += size;
    cssFileSizes[file] = {
      size,
      sizeKB: (size / 1024).toFixed(2),
      lines: content.split("\n").length,
    };
  }

  console.log("\n📊 CSSファイル分析:");
  for (const [file, info] of Object.entries(cssFileSizes)) {
    console.log(`\n${file}:`);
    console.log(`  - サイズ: ${info.sizeKB} KB`);
    console.log(`  - 行数: ${info.lines}行`);
  }

  console.log(`\n📈 合計CSSサイズ: ${(totalCssSize / 1024).toFixed(2)} KB`);

  // Tailwindクラスの使用状況を分析
  const tailwindClasses = new Set();
  const unusedClasses = new Set();

  // 一般的なTailwindクラスを定義
  const commonTailwindClasses = [
    "flex",
    "grid",
    "block",
    "inline",
    "inline-block",
    "hidden",
    "w-full",
    "h-full",
    "w-screen",
    "h-screen",
    "min-h-screen",
    "p-0",
    "p-1",
    "p-2",
    "p-3",
    "p-4",
    "p-5",
    "p-6",
    "p-8",
    "p-10",
    "p-12",
    "px-0",
    "px-1",
    "px-2",
    "px-3",
    "px-4",
    "px-5",
    "px-6",
    "px-8",
    "px-10",
    "px-12",
    "py-0",
    "py-1",
    "py-2",
    "py-3",
    "py-4",
    "py-5",
    "py-6",
    "py-8",
    "py-10",
    "py-12",
    "m-0",
    "m-1",
    "m-2",
    "m-3",
    "m-4",
    "m-5",
    "m-6",
    "m-8",
    "m-10",
    "m-12",
    "mx-0",
    "mx-1",
    "mx-2",
    "mx-3",
    "mx-4",
    "mx-5",
    "mx-6",
    "mx-8",
    "mx-10",
    "mx-12",
    "my-0",
    "my-1",
    "my-2",
    "my-3",
    "my-4",
    "my-5",
    "my-6",
    "my-8",
    "my-10",
    "my-12",
    "text-xs",
    "text-sm",
    "text-base",
    "text-lg",
    "text-xl",
    "text-2xl",
    "text-3xl",
    "font-light",
    "font-normal",
    "font-medium",
    "font-semibold",
    "font-bold",
    "bg-white",
    "bg-black",
    "bg-gray-50",
    "bg-gray-100",
    "bg-gray-200",
    "bg-gray-300",
    "text-white",
    "text-black",
    "text-gray-50",
    "text-gray-100",
    "text-gray-200",
    "text-gray-300",
    "border",
    "border-0",
    "border-2",
    "border-4",
    "border-8",
    "rounded",
    "rounded-sm",
    "rounded-md",
    "rounded-lg",
    "rounded-xl",
    "rounded-2xl",
    "rounded-full",
    "shadow",
    "shadow-sm",
    "shadow-md",
    "shadow-lg",
    "shadow-xl",
    "shadow-2xl",
  ];

  // TSXファイルからTailwindクラスを抽出
  for (const file of tsxFiles) {
    const content = fs.readFileSync(file, "utf-8");
    const classNameMatches = content.match(/className="([^"]*)"/g) || [];

    for (const match of classNameMatches) {
      const classes = match.replace(/className="([^"]*)"/, "$1").split(" ");
      for (const cls of classes) {
        if (cls.trim()) {
          tailwindClasses.add(cls.trim());
        }
      }
    }
  }

  console.log(`\n📊 Tailwindクラス使用状況:`);
  console.log(`- 使用されているクラス数: ${tailwindClasses.size}`);
  console.log(`- 一般的なクラス数: ${commonTailwindClasses.length}`);

  // 未使用の一般的なクラスを特定
  for (const cls of commonTailwindClasses) {
    if (!tailwindClasses.has(cls)) {
      unusedClasses.add(cls);
    }
  }

  console.log(`- 未使用の一般的なクラス数: ${unusedClasses.size}`);

  if (unusedClasses.size > 0) {
    console.log("\n🔧 未使用クラスの例:");
    const unusedArray = Array.from(unusedClasses).slice(0, 10);
    unusedArray.forEach((cls) => console.log(`  - ${cls}`));
  }

  // インラインスタイルの分析
  let inlineStyleCount = 0;
  let inlineStyleSize = 0;

  for (const file of tsxFiles) {
    const content = fs.readFileSync(file, "utf-8");
    const styleMatches = content.match(/style="([^"]*)"/g) || [];

    for (const match of styleMatches) {
      inlineStyleCount++;
      inlineStyleSize += match.length;
    }
  }

  console.log(`\n📊 インラインスタイル分析:`);
  console.log(`- インラインスタイル数: ${inlineStyleCount}`);
  console.log(
    `- インラインスタイルサイズ: ${(inlineStyleSize / 1024).toFixed(2)} KB`,
  );

  // 重複クラスの分析
  const classFrequency = {};
  for (const file of tsxFiles) {
    const content = fs.readFileSync(file, "utf-8");
    const classNameMatches = content.match(/className="([^"]*)"/g) || [];

    for (const match of classNameMatches) {
      const classes = match.replace(/className="([^"]*)"/, "$1").split(" ");
      for (const cls of classes) {
        const trimmed = cls.trim();
        if (trimmed) {
          classFrequency[trimmed] = (classFrequency[trimmed] || 0) + 1;
        }
      }
    }
  }

  const mostUsedClasses = Object.entries(classFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  console.log(`\n📊 最も使用されているクラス (上位10個):`);
  mostUsedClasses.forEach(([cls, count]) => {
    console.log(`  - ${cls}: ${count}回`);
  });

  return {
    totalCSSSize: totalCssSize,
    cssFileSizes,
    tailwindClasses: tailwindClasses.size,
    unusedClasses: unusedClasses.size,
    inlineStyleCount,
    inlineStyleSize,
    mostUsedClasses,
  };
}

async function generateOptimizationRecommendations(analysis) {
  console.log("\n💡 CSS軽量化の推奨事項:");

  const recommendations = [];

  // 1. 未使用CSSの削除
  if (analysis.unusedClasses > 0) {
    recommendations.push({
      priority: "高",
      action: "未使用のTailwindクラスを削除",
      impact: `${analysis.unusedClasses}個のクラスを削除可能`,
      effort: "低",
    });
  }

  // 2. インラインスタイルの最適化
  if (analysis.inlineStyleCount > 0) {
    recommendations.push({
      priority: "中",
      action: "インラインスタイルをCSSクラスに変換",
      impact: `${(analysis.inlineStyleSize / 1024).toFixed(2)} KB削減可能`,
      effort: "中",
    });
  }

  // 3. CSS変数の活用
  recommendations.push({
    priority: "高",
    action: "ハードコードされた色をCSS変数に置き換え",
    impact: "保守性向上、一貫性確保",
    effort: "中",
  });

  // 4. 重複クラスの統合
  recommendations.push({
    priority: "中",
    action: "頻繁に使用されるクラス組み合わせを共通クラスに統合",
    impact: "HTMLサイズ削減、可読性向上",
    effort: "中",
  });

  console.log("\n📋 推奨事項一覧:");
  recommendations.forEach((rec, index) => {
    console.log(`\n${index + 1}. ${rec.action}`);
    console.log(`   優先度: ${rec.priority}`);
    console.log(`   効果: ${rec.impact}`);
    console.log(`   工数: ${rec.effort}`);
  });

  return recommendations;
}

async function main() {
  try {
    const analysis = await analyzeCssSize();
    await generateOptimizationRecommendations(analysis);

    console.log("\n✅ CSS分析完了！");
    console.log("\n🚀 次のステップ:");
    console.log("1. 未使用クラスの削除");
    console.log("2. インラインスタイルの最適化");
    console.log("3. CSS変数の活用");
    console.log("4. 共通クラスの作成");
  } catch (error) {
    console.error("❌ エラーが発生しました:", error);
    process.exit(1);
  }
}

main();
