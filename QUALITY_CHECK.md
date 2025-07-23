# 品質チェックツール

このプロジェクトには、コードの品質を自動的にチェックするツールが組み込まれています。

## 🚀 使用方法

### 手動実行

```bash
# 品質チェックを実行
npm run quality-check

# Push前チェックを実行
npm run pre-push
```

### 自動実行（Git Hooks）

Push時に自動的に品質チェックが実行されます：

```bash
git push origin feature/your-branch
```

## 📋 チェック項目

### 1. 依存関係チェック
- **必須依存関係の確認**: React, Next.js, TypeScript, Storybook, Tailwind CSS
- **バージョン競合の検出**: npm lsによる依存関係の整合性確認
- **package.jsonの存在確認**

### 2. TypeScript型チェック
- **型エラーの検出**: `tsc --noEmit`
- **未使用変数の検出**: `noUnusedLocals`
- **未使用パラメータの検出**: `noUnusedParameters`

### 3. コードリントチェック
- **Biomeによるリント**: `npm run lint`
- **コード品質の確認**: 一貫性、ベストプラクティスの遵守

### 4. フォーマットチェック
- **Biomeによるフォーマット**: `npx biome check --write`
- **自動修正**: 検出された問題の自動修正

### 5. コンポーネント構造チェック
- **必須ファイルの確認**: `index.ts`の存在
- **TypeScriptファイルの確認**: `.tsx`, `.ts`ファイルの存在
- **ディレクトリ構造の確認**: `components/ui`, `app/_components`

### 6. Storybook設定チェック
- **設定ファイルの確認**: `.storybook/main.ts`, `.storybook/preview.ts`
- **必須設定の確認**

### 7. 型定義ファイルチェック
- **型定義ファイルの確認**: `lib/types/component.ts`, `lib/utils/component.ts`
- **型システムの整合性確認**

### 8. ビルドテスト
- **Next.jsビルドの確認**: `npm run build`
- **ビルドエラーの検出**

### 9. セキュリティチェック
- **npm audit**: セキュリティ脆弱性の検出
- **中程度以上の脆弱性をチェック**

## 🎯 結果の解釈

### ✅ 成功
- すべてのチェックが成功
- Pushが許可される

### ⚠️ 警告
- 一部のチェックで警告が検出
- Pushは可能だが、修正を推奨

### ❌ 失敗
- 重要なチェックでエラーが検出
- Pushがブロックされる
- 修正後に再実行が必要

## 🔧 設定

`quality-check.config.js`でチェックの設定をカスタマイズできます：

```javascript
module.exports = {
  checks: {
    dependencies: {
      enabled: true,
      required: ['react', 'react-dom', 'next'],
    },
    typescript: {
      enabled: true,
      strict: true,
    },
    // その他の設定...
  },
  errorHandling: {
    blockPushOnFailure: true,
    treatWarningsAsErrors: false,
  },
};
```

## 🛠️ トラブルシューティング

### よくある問題と解決方法

#### 1. TypeScript型エラー
```bash
# 型エラーの詳細を確認
npm run type-check

# 未使用のインポートを削除
# 型定義を修正
```

#### 2. リントエラー
```bash
# リントエラーの詳細を確認
npm run lint

# 自動修正を実行
npm run format
```

#### 3. 依存関係の問題
```bash
# 依存関係の確認
npm ls

# 依存関係の再インストール
rm -rf node_modules package-lock.json
npm install
```

#### 4. ビルドエラー
```bash
# ビルドエラーの詳細を確認
npm run build

# キャッシュのクリア
rm -rf .next
npm run build
```

## 📊 品質メトリクス

品質チェックツールは以下のメトリクスを提供します：

- **総チェック数**: 実行されたチェックの総数
- **成功率**: 成功したチェックの割合
- **失敗率**: 失敗したチェックの割合
- **警告数**: 警告の数

## 🔄 CI/CD統合

品質チェックツールはCI/CDパイプラインにも統合できます：

```yaml
# GitHub Actions例
- name: Quality Check
  run: npm run quality-check
```

## 📝 ベストプラクティス

1. **定期的な実行**: 開発中に定期的に品質チェックを実行
2. **早期修正**: エラーを早期に発見・修正
3. **設定の見直し**: プロジェクトの成長に合わせて設定を調整
4. **チーム共有**: チーム全体で品質基準を共有

## 🆘 サポート

品質チェックツールに関する問題や質問がある場合は：

1. エラーメッセージを確認
2. 設定ファイルを確認
3. トラブルシューティングガイドを参照
4. 必要に応じて設定を調整 