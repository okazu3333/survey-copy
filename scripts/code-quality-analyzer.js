#!/usr/bin/env node

import fs from "fs";
import { glob } from "glob";
import path from "path";

async function analyzeCodeQuality() {
  console.log("🔍 コード品質分析中...");

  const tsxFiles = await glob("**/*.tsx", {
    ignore: ["node_modules/**", ".next/**"],
  });
  const tsFiles = await glob("**/*.ts", {
    ignore: ["node_modules/**", ".next/**"],
  });
  const allFiles = [...tsxFiles, ...tsFiles];

  const analysis = {
    totalFiles: allFiles.length,
    totalLines: 0,
    consoleLogs: 0,
    todos: 0,
    anyTypes: 0,
    largeFiles: [],
    duplicatePatterns: {},
    formUsage: 0,
    stateUsage: 0,
    componentUsage: {},
  };

  // ファイル分析
  for (const file of allFiles) {
    const content = fs.readFileSync(file, "utf-8");
    const lines = content.split("\n").length;
    analysis.totalLines += lines;

    // 大きなファイルを特定
    if (lines > 200) {
      analysis.largeFiles.push({
        file,
        lines,
        size: (Buffer.byteLength(content, "utf-8") / 1024).toFixed(2),
      });
    }

    // console.logの数をカウント
    const consoleMatches = content.match(/console\.log/g) || [];
    analysis.consoleLogs += consoleMatches.length;

    // TODO/FIXMEの数をカウント
    const todoMatches = content.match(/TODO|FIXME|HACK/g) || [];
    analysis.todos += todoMatches.length;

    // any型の数をカウント
    const anyMatches = content.match(/: any/g) || [];
    analysis.anyTypes += anyMatches.length;

    // useFormの使用をカウント
    if (content.includes("useForm")) {
      analysis.formUsage++;
    }

    // useStateの使用をカウント
    if (content.includes("useState")) {
      analysis.stateUsage++;
    }

    // コンポーネントの使用を分析
    const componentMatches =
      content.match(/import.*from.*["']([^"']+)["']/g) || [];
    for (const match of componentMatches) {
      const importPath = match.match(/["']([^"']+)["']/)?.[1];
      if (importPath) {
        analysis.componentUsage[importPath] =
          (analysis.componentUsage[importPath] || 0) + 1;
      }
    }
  }

  return analysis;
}

async function analyzeDuplicatePatterns() {
  console.log("\n🔍 重複パターン分析中...");

  const tsxFiles = await glob("**/*.tsx", {
    ignore: ["node_modules/**", ".next/**"],
  });
  const patterns = {};

  // よく使用されるパターンを抽出
  for (const file of tsxFiles) {
    const content = fs.readFileSync(file, "utf-8");

    // classNameパターン
    const classNameMatches = content.match(/className="([^"]*)"/g) || [];
    for (const match of classNameMatches) {
      const classes = match.replace(/className="([^"]*)"/, "$1");
      patterns[classes] = (patterns[classes] || 0) + 1;
    }

    // 関数パターン
    const functionMatches =
      content.match(/const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*{/g) || [];
    for (const match of functionMatches) {
      patterns[match] = (patterns[match] || 0) + 1;
    }
  }

  // 重複が多いパターンを抽出
  const duplicates = Object.entries(patterns)
    .filter(([, count]) => count > 3)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  return duplicates;
}

async function analyzeFileStructure() {
  console.log("\n📁 ファイル構造分析中...");

  const structure = {
    components: {
      ui: 0,
      survey: 0,
      layout: 0,
      form: 0,
    },
    pages: 0,
    hooks: 0,
    utils: 0,
    types: 0,
  };

  const files = await glob("**/*", {
    ignore: ["node_modules/**", ".next/**", "**/node_modules/**"],
  });

  for (const file of files) {
    if (file.includes("/components/ui/")) structure.components.ui++;
    else if (file.includes("/components/survey")) structure.components.survey++;
    else if (file.includes("/components/layout")) structure.components.layout++;
    else if (file.includes("/_components/form/")) structure.components.form++;
    else if (file.includes("/page.tsx")) structure.pages++;
    else if (file.includes("/hooks/")) structure.hooks++;
    else if (file.includes("/lib/") && file.includes(".ts")) structure.utils++;
    else if (file.includes("/types/")) structure.types++;
  }

  return structure;
}

async function generateRecommendations(analysis, duplicates, structure) {
  console.log("\n💡 改善推奨事項:");

  const recommendations = [];

  // 大きなファイルの改善
  if (analysis.largeFiles.length > 0) {
    recommendations.push({
      priority: "高",
      category: "ファイルサイズ",
      action: "大きなファイルの分割",
      details: `${analysis.largeFiles.length}個のファイルが200行を超えています`,
      files: analysis.largeFiles.map((f) => f.file),
    });
  }

  // console.logの削除
  if (analysis.consoleLogs > 0) {
    recommendations.push({
      priority: "中",
      category: "デバッグコード",
      action: "console.logの削除",
      details: `${analysis.consoleLogs}個のconsole.logが残っています`,
    });
  }

  // TODOの対応
  if (analysis.todos > 0) {
    recommendations.push({
      priority: "中",
      category: "未完了タスク",
      action: "TODO/FIXMEの対応",
      details: `${analysis.todos}個のTODO/FIXMEが残っています`,
    });
  }

  // any型の改善
  if (analysis.anyTypes > 0) {
    recommendations.push({
      priority: "高",
      category: "型安全性",
      action: "any型の型定義改善",
      details: `${analysis.anyTypes}個のany型が使用されています`,
    });
  }

  // 重複パターンの改善
  if (duplicates.length > 0) {
    recommendations.push({
      priority: "中",
      category: "コード重複",
      action: "重複パターンの共通化",
      details: `${duplicates.length}個の重複パターンが検出されました`,
      examples: duplicates.slice(0, 3),
    });
  }

  // フォーム処理の共通化
  if (analysis.formUsage > 5) {
    recommendations.push({
      priority: "高",
      category: "ロジック重複",
      action: "フォーム処理の共通化",
      details: `${analysis.formUsage}個のファイルでuseFormが使用されています`,
    });
  }

  return recommendations;
}

async function main() {
  try {
    const analysis = await analyzeCodeQuality();
    const duplicates = await analyzeDuplicatePatterns();
    const structure = await analyzeFileStructure();
    const recommendations = await generateRecommendations(
      analysis,
      duplicates,
      structure,
    );

    console.log("\n📊 コード品質分析結果:");
    console.log(`- 総ファイル数: ${analysis.totalFiles}`);
    console.log(`- 総行数: ${analysis.totalLines.toLocaleString()}`);
    console.log(
      `- 平均行数: ${Math.round(analysis.totalLines / analysis.totalFiles)}`,
    );
    console.log(`- console.log: ${analysis.consoleLogs}個`);
    console.log(`- TODO/FIXME: ${analysis.todos}個`);
    console.log(`- any型: ${analysis.anyTypes}個`);
    console.log(`- useForm使用: ${analysis.formUsage}ファイル`);
    console.log(`- useState使用: ${analysis.stateUsage}ファイル`);

    console.log("\n📁 ファイル構造:");
    console.log(`- UIコンポーネント: ${structure.components.ui}個`);
    console.log(`- 調査コンポーネント: ${structure.components.survey}個`);
    console.log(`- レイアウトコンポーネント: ${structure.components.layout}個`);
    console.log(`- フォームコンポーネント: ${structure.components.form}個`);
    console.log(`- ページ: ${structure.pages}個`);
    console.log(`- フック: ${structure.hooks}個`);
    console.log(`- ユーティリティ: ${structure.utils}個`);
    console.log(`- 型定義: ${structure.types}個`);

    if (analysis.largeFiles.length > 0) {
      console.log("\n📏 大きなファイル (200行以上):");
      analysis.largeFiles.forEach((file) => {
        console.log(`  - ${file.file}: ${file.lines}行 (${file.size} KB)`);
      });
    }

    if (duplicates.length > 0) {
      console.log("\n🔄 重複パターン (上位3個):");
      duplicates.slice(0, 3).forEach(([pattern, count]) => {
        console.log(`  - ${pattern.substring(0, 50)}...: ${count}回`);
      });
    }

    console.log("\n📋 改善推奨事項:");
    recommendations.forEach((rec, index) => {
      console.log(`\n${index + 1}. ${rec.action}`);
      console.log(`   優先度: ${rec.priority}`);
      console.log(`   カテゴリ: ${rec.category}`);
      console.log(`   詳細: ${rec.details}`);
    });

    console.log("\n✅ 分析完了！");
    console.log("\n🚀 次のステップ:");
    console.log("1. 大きなファイルの分割");
    console.log("2. 重複パターンの共通化");
    console.log("3. 型安全性の向上");
    console.log("4. デバッグコードの削除");
  } catch (error) {
    console.error("❌ エラーが発生しました:", error);
    process.exit(1);
  }
}

main();
