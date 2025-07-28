#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");

console.log("🧹 キャッシュクリアを開始します...\n");

// プロジェクトルートのパス
const projectRoot = path.resolve(__dirname, "..");

// クリア対象のディレクトリとファイル
const targets = [
  ".next",
  "node_modules/.cache",
  ".turbo",
  "dist",
  "build",
  "coverage",
  ".nyc_output",
];

// 削除対象のファイル
const filesToDelete = [
  ".next/static/development/_buildManifest.js.tmp.*",
  ".next/static/development/_ssgManifest.js.tmp.*",
  ".next/static/development/_app.js.tmp.*",
  ".next/static/development/_error.js.tmp.*",
];

let clearedCount = 0;

// ディレクトリの削除
targets.forEach((target) => {
  const targetPath = path.join(projectRoot, target);
  if (fs.existsSync(targetPath)) {
    try {
      if (fs.lstatSync(targetPath).isDirectory()) {
        fs.rmSync(targetPath, { recursive: true, force: true });
        console.log(`✅ ${target} を削除しました`);
        clearedCount++;
      }
    } catch (error) {
      console.log(`⚠️  ${target} の削除に失敗しました: ${error.message}`);
    }
  } else {
    console.log(`ℹ️  ${target} は存在しません`);
  }
});

// 一時ファイルの削除
filesToDelete.forEach((pattern) => {
  try {
    const _globPattern = path.join(projectRoot, pattern);
    execSync(
      `find . -name "${path.basename(pattern)}" -delete 2>/dev/null || true`,
      { cwd: projectRoot },
    );
    console.log(`✅ 一時ファイル ${path.basename(pattern)} を削除しました`);
    clearedCount++;
  } catch (_error) {
    // エラーは無視（ファイルが存在しない場合）
  }
});

// npm cacheのクリア
try {
  console.log("\n📦 npm cacheをクリアしています...");
  execSync("npm cache clean --force", { stdio: "inherit" });
  console.log("✅ npm cacheをクリアしました");
  clearedCount++;
} catch (error) {
  console.log(`⚠️  npm cacheのクリアに失敗しました: ${error.message}`);
}

// メモリ使用量の表示
try {
  const memoryUsage = process.memoryUsage();
  console.log("\n📊 メモリ使用量:");
  console.log(`  RSS: ${Math.round(memoryUsage.rss / 1024 / 1024)} MB`);
  console.log(
    `  Heap Used: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
  );
  console.log(
    `  Heap Total: ${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
  );
} catch (_error) {
  console.log("⚠️ メモリ使用量の取得に失敗しました");
}

console.log(
  `\n🎉 キャッシュクリアが完了しました！ (${clearedCount}個の項目をクリア)`,
);
console.log("\n💡 次のコマンドで開発サーバーを再起動してください:");
console.log("   npm run dev");
console.log("\n💡 完全にクリーンな状態で開発サーバーを起動する場合:");
console.log("   npm run dev:clean");
