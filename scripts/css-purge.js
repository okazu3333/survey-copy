#!/usr/bin/env node

import fs from "node:fs";
import { glob } from "glob";

const USED_CLASSES = new Set([
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
  "w-screen",
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
  "m-0",
  "m-1",
  "m-2",
  "m-3",
  "m-4",
  "m-5",
  "m-6",
  "m-8",
  "mx-0",
  "mx-1",
  "mx-2",
  "mx-3",
  "mx-4",
  "mx-6",
  "mx-8",
  "my-0",
  "my-1",
  "my-2",
  "my-3",
  "my-4",
  "my-6",
  "my-8",
  // テキスト
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
  // 背景色
  "bg-white",
  "bg-black",
  "bg-gray-50",
  "bg-gray-100",
  "bg-gray-200",
  "bg-gray-300",
  // テキスト色
  "text-white",
  "text-black",
  "text-gray-50",
  "text-gray-100",
  "text-gray-200",
  "text-gray-300",
  // ボーダー
  "border",
  "border-0",
  "border-2",
  "border-4",
  "border-8",
  // 角丸
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
  "shadow-md",
  "shadow-lg",
  "shadow-xl",
  "shadow-2xl",
  // 配置
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
  "hidden",
  "block",
  "inline",
  "inline-block",
]);

async function purgeUnusedCSS() {
  console.log("🧹 未使用CSSクラスの削除中...");

  const tsxFiles = await glob("**/*.tsx", {
    ignore: ["node_modules/**", ".next/**"],
  });
  const usedClasses = new Set();

  // TSXファイルから使用されているクラスを抽出
  for (const file of tsxFiles) {
    const content = fs.readFileSync(file, "utf-8");
    const classNameMatches = content.match(/className="([^"]*)"/g) || [];

    for (const match of classNameMatches) {
      const classes = match.replace(/className="([^"]*)"/, "$1").split(" ");
      for (const cls of classes) {
        const trimmed = cls.trim();
        if (trimmed) {
          usedClasses.add(trimmed);
        }
      }
    }
  }

  console.log(`📊 使用されているクラス数: ${usedClasses.size}`);
  console.log(`📊 定義されているクラス数: ${USED_CLASSES.size}`);

  // 未使用クラスを特定
  const unusedClasses = [];
  for (const cls of USED_CLASSES) {
    if (!usedClasses.has(cls)) {
      unusedClasses.push(cls);
    }
  }

  console.log(`📊 未使用クラス数: ${unusedClasses.length}`);

  if (unusedClasses.length > 0) {
    console.log("\n🔧 削除可能な未使用クラス:");
    unusedClasses.forEach((cls) => console.log(`  - ${cls}`));

    // tailwind.config.tsを更新
    await updateTailwindConfig(unusedClasses);
  }

  return {
    usedClasses: usedClasses.size,
    totalClasses: USED_CLASSES.size,
    unusedClasses: unusedClasses.length,
    unusedClassList: unusedClasses,
  };
}

async function updateTailwindConfig(unusedClasses) {
  console.log("\n📝 Tailwind設定を更新中...");

  const configPath = "tailwind.config.ts";
  const configContent = fs.readFileSync(configPath, "utf-8");

  // 未使用クラスをsafelistから削除
  let updatedContent = configContent;
  for (const cls of unusedClasses) {
    const regex = new RegExp(`"${cls}",?\\s*`, "g");
    updatedContent = updatedContent.replace(regex, "");
  }

  // 空の配列要素を削除
  updatedContent = updatedContent.replace(/,\s*,/g, ",");
  updatedContent = updatedContent.replace(/,\s*]/g, "]");

  fs.writeFileSync(configPath, updatedContent);
  console.log("✅ Tailwind設定を更新しました");
}

async function generateOptimizedCSS() {
  console.log("\n🎨 最適化されたCSSクラスを生成中...");

  const optimizedClasses = [
    // レイアウト
    "survey-card",
    "survey-card-primary",
    "survey-header",
    "survey-section",
    "survey-question",
    // ボタン
    "btn-primary",
    "btn-secondary",
    // レイアウト
    "page-container",
    "content-container",
    // テキスト
    "text-heading",
    "text-body",
    "text-caption",
  ];

  console.log("📋 最適化されたクラス一覧:");
  optimizedClasses.forEach((cls) => console.log(`  - ${cls}`));

  return optimizedClasses;
}

async function main() {
  try {
    const purgeResult = await purgeUnusedCSS();
    const optimizedClasses = await generateOptimizedCSS();

    console.log("\n✅ CSS軽量化完了！");
    console.log("\n📈 改善効果:");
    console.log(`- 未使用クラス削除: ${purgeResult.unusedClasses}個`);
    console.log(`- 最適化クラス追加: ${optimizedClasses.length}個`);
    console.log(
      `- 推定削減サイズ: ${(purgeResult.unusedClasses * 0.1).toFixed(2)} KB`,
    );

    console.log("\n🚀 次のステップ:");
    console.log("1. ビルドして実際のサイズを確認");
    console.log("2. 最適化されたクラスを使用");
    console.log("3. 定期的なCSS分析の実行");
  } catch (error) {
    console.error("❌ エラーが発生しました:", error);
    process.exit(1);
  }
}

main();
