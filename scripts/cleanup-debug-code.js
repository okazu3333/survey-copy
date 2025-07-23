#!/usr/bin/env node

import fs from "node:fs";
import { glob } from "glob";

async function cleanupDebugCode() {
  console.log("🧹 デバッグコードの削除中...");

  const tsxFiles = await glob("**/*.tsx", {
    ignore: ["node_modules/**", ".next/**"],
  });
  const tsFiles = await glob("**/*.ts", {
    ignore: ["node_modules/**", ".next/**"],
  });
  const allFiles = [...tsxFiles, ...tsFiles];

  let totalRemoved = 0;
  const cleanedFiles = [];

  for (const file of allFiles) {
    const content = fs.readFileSync(file, "utf-8");
    let modified = false;
    let newContent = content;

    // console.logの削除（コメントアウト）
    const consoleLogRegex = /^\s*console\.log\([^)]*\);?\s*$/gm;
    const consoleMatches = newContent.match(consoleLogRegex) || [];

    if (consoleMatches.length > 0) {
      newContent = newContent.replace(consoleLogRegex, (match) => {
        // 既にコメントアウトされている場合はスキップ
        if (match.trim().startsWith("//")) return match;
        return `// ${match.trim()}`;
      });
      modified = true;
      totalRemoved += consoleMatches.length;
    }

    // TODO/FIXMEのコメント化
    const todoRegex = /^\s*(TODO|FIXME|HACK):\s*(.+)$/gm;
    const todoMatches = newContent.match(todoRegex) || [];

    if (todoMatches.length > 0) {
      newContent = newContent.replace(todoRegex, (_match, type, message) => {
        return `// ${type}: ${message}`;
      });
      modified = true;
    }

    // 未使用のimportの削除
    const importRegex = /import\s+{[^}]*}\s+from\s+['"][^'"]+['"];?\s*$/gm;
    const imports = newContent.match(importRegex) || [];

    for (const importStatement of imports) {
      // 空のimport文を削除
      if (importStatement.includes("{}")) {
        newContent = newContent.replace(importStatement, "");
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(file, newContent);
      cleanedFiles.push({
        file,
        consoleLogs: consoleMatches.length,
        todos: todoMatches.length,
      });
    }
  }

  console.log(`\n📊 クリーンアップ結果:`);
  console.log(`- 処理したファイル数: ${allFiles.length}`);
  console.log(`- 修正したファイル数: ${cleanedFiles.length}`);
  console.log(`- 削除したconsole.log: ${totalRemoved}個`);

  if (cleanedFiles.length > 0) {
    console.log("\n🔧 修正されたファイル:");
    cleanedFiles.forEach(({ file, consoleLogs, todos }) => {
      console.log(`  - ${file}: console.log ${consoleLogs}個, TODO ${todos}個`);
    });
  }

  return {
    totalFiles: allFiles.length,
    cleanedFiles: cleanedFiles.length,
    totalRemoved,
  };
}

async function generateCleanupReport() {
  console.log("\n📋 クリーンアップ推奨事項:");

  const recommendations = [
    {
      priority: "高",
      action: "console.logの削除",
      impact: "本番環境でのパフォーマンス向上",
      effort: "低",
    },
    {
      priority: "中",
      action: "TODO/FIXMEの対応",
      impact: "コード品質の向上",
      effort: "中",
    },
    {
      priority: "中",
      action: "未使用importの削除",
      impact: "バンドルサイズの削減",
      effort: "低",
    },
  ];

  recommendations.forEach((rec, index) => {
    console.log(`\n${index + 1}. ${rec.action}`);
    console.log(`   優先度: ${rec.priority}`);
    console.log(`   効果: ${rec.impact}`);
    console.log(`   工数: ${rec.effort}`);
  });
}

async function main() {
  try {
    const _result = await cleanupDebugCode();
    await generateCleanupReport();

    console.log("\n✅ デバッグコードクリーンアップ完了！");
    console.log("\n🚀 次のステップ:");
    console.log("1. 削除されたconsole.logの確認");
    console.log("2. TODO/FIXMEの対応計画策定");
    console.log("3. 定期的なクリーンアップの実行");
  } catch (error) {
    console.error("❌ エラーが発生しました:", error);
    process.exit(1);
  }
}

main();
