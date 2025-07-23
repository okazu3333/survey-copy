#!/usr/bin/env node

import { execSync } from "child_process";
import path from "path";

console.log("🚀 Push前品質チェックを開始します...\n");

try {
  // 品質チェックスクリプトを実行
  execSync("node scripts/quality-check.js", {
    stdio: "inherit",
    cwd: process.cwd(),
  });

  console.log("\n✅ Push前品質チェックが完了しました。Pushを続行します。");
  process.exit(0);
} catch (error) {
  console.error("\n❌ Push前品質チェックが失敗しました。");
  console.error("修正してから再度Pushしてください。");
  process.exit(1);
}
