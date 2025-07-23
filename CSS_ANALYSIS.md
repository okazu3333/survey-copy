# CSS依存関係分析ツール

このプロジェクトには、CSSの親子依存関係を分析するツールが組み込まれています。

## 🚀 使用方法

### 手動実行

```bash
# CSS依存関係分析を実行
npm run css-analyze

# 品質チェックに含めて実行
npm run quality-check
```

### 自動実行（品質チェック）

品質チェックツールにCSS依存関係分析が含まれているため、Push時に自動実行されます。

## 📋 分析項目

### 1. Tailwind CSSクラス分析
- **クラス使用状況**: 各コンポーネントで使用されているTailwindクラス
- **クラスパターン**: 重複するクラスパターンの検出
- **長いクラスリスト**: クラス数が多すぎるコンポーネントの検出

### 2. カスタムCSS分析
- **CSS変数**: グローバルCSS変数の使用状況
- **カスタムクラス**: 独自定義のCSSクラス
- **@layerディレクティブ**: Tailwindレイヤーの使用状況

### 3. コンポーネント依存関係分析
- **import文**: コンポーネント間の依存関係
- **スタイル継承**: 親子コンポーネントのスタイル依存関係
- **共通パターン**: 類似したスタイルパターンの検出

### 4. グローバルスタイル分析
- **Tailwind設定**: カスタムテーマとプラグイン
- **グローバルCSS**: アプリケーション全体のスタイル
- **CSS変数**: デザインシステムの変数

## 🎯 分析結果の解釈

### 📊 統計情報
- **コンポーネント数**: 分析対象のコンポーネント数
- **Tailwindクラス数**: 使用されているTailwindクラスの総数
- **カスタムクラス数**: 独自定義のCSSクラス数
- **推奨事項数**: 改善提案の数

### 💡 推奨事項

#### 1. 重複パターンの検出
```
重複するクラスパターン: Button, Card, Badge
パターン: bg-primary text-primary-foreground hover:bg-primary/90
```
**対策**: 共通のスタイルをコンポーネントまたはユーティリティクラスに抽出

#### 2. 長いクラスリスト
```
Button: クラス数が多すぎます (15個)
```
**対策**: クラスをグループ化またはコンポーネントに分割

#### 3. 未使用クラス
```
未使用のカスタムクラス: custom-button, legacy-style
```
**対策**: 未使用クラスの削除または整理

## 🔧 設定

`css-analysis.config.js`で分析の設定をカスタマイズできます：

```javascript
module.exports = {
  directories: {
    components: ['components/ui', 'app/_components'],
    css: ['app/globals.css']
  },
  analysis: {
    detectDuplicatePatterns: true,
    maxClassesPerComponent: 10,
    detectUnusedClasses: true
  },
  thresholds: {
    duplicatePatterns: 1,
    longClassList: 10,
    unusedClasses: 5
  }
};
```

## 📈 分析レポート例

```
================================================================================
CSS依存関係分析レポート
================================================================================

📊 Tailwind CSSクラス使用状況:
  Button: 8個のクラス
    bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium
  Card: 6個のクラス
    bg-card text-card-foreground rounded-lg border shadow-sm
  Badge: 4個のクラス
    inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold

🎨 カスタムCSS:
  globals.css: 3個のクラス
    badge-fixed-size, custom-button, legacy-style

🌍 グローバルスタイル:
  tailwind-theme: カスタムテーマ設定あり
  globals.css-variables: 25
  globals.css-layers: 3

🔗 コンポーネント依存関係:
  Button:
    → @/lib/utils
    → @/components/ui/card
  Card:
    → @/lib/utils

💡 推奨事項:
  1. 重複するクラスパターン: Button, Card
     パターン: bg-primary text-primary-foreground
  2. Button: クラス数が多すぎます (8個)

📈 統計情報:
  コンポーネント数: 15
  Tailwindクラス数: 89
  カスタムクラス数: 3
  推奨事項数: 2
================================================================================
```

## 🛠️ ベストプラクティス

### 1. クラス管理
- **一貫性**: 同じパターンのクラスは統一
- **簡潔性**: 長いクラスリストは避ける
- **再利用性**: 共通パターンはコンポーネント化

### 2. 依存関係管理
- **明確な階層**: 親子関係を明確にする
- **循環依存**: 循環参照を避ける
- **適切な抽象化**: 共通スタイルは適切に抽象化

### 3. パフォーマンス最適化
- **未使用クラス**: 定期的に未使用クラスを削除
- **CSS変数**: デザインシステムはCSS変数で管理
- **Tailwind最適化**: 使用されていないクラスをPurge

## 🔄 CI/CD統合

CSS依存関係分析はCI/CDパイプラインにも統合できます：

```yaml
# GitHub Actions例
- name: CSS Dependency Analysis
  run: npm run css-analyze
```

## 📝 定期的な分析

### 推奨スケジュール
- **開発中**: 新機能追加時に実行
- **リリース前**: リリース前に実行
- **定期**: 週次または月次で実行

### 分析結果の活用
1. **コードレビュー**: 分析結果をレビューに活用
2. **リファクタリング**: 重複パターンの整理
3. **パフォーマンス改善**: 未使用クラスの削除
4. **設計改善**: 依存関係の最適化

## 🆘 トラブルシューティング

### よくある問題と解決方法

#### 1. 分析が遅い
```bash
# 除外パターンを調整
# css-analysis.config.jsのexclude設定を確認
```

#### 2. 誤検出が多い
```bash
# 閾値の調整
# css-analysis.config.jsのthresholds設定を調整
```

#### 3. ファイルが見つからない
```bash
# ディレクトリ設定の確認
# css-analysis.config.jsのdirectories設定を確認
```

## 📚 参考資料

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Architecture Best Practices](https://css-tricks.com/css-architecture/)
- [Component Design Patterns](https://www.component-driven.org/) 