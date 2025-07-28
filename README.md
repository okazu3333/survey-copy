# 📊 Survey PoC - アンケート作成・管理システム

## 📋 プロジェクト概要

このプロジェクトは、Next.js 15とTypeScriptを使用したアンケート作成・管理システムのプロトタイプです。AI支援機能、ドラッグ&ドロップ編集、リアルタイムプレビュー、レビュー機能を備えた包括的なアンケートプラットフォームです。

## 🏗️ 技術スタック

### フレームワーク & 言語
- **Framework**: Next.js 15.3.4 (App Router)
- **Language**: TypeScript 5.8.3 (strict mode)
- **Package Manager**: npm 10.8.2
- **Node.js**: v18.20.8

### フロントエンド
- **UI Library**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS 3.4.0 + CSS Variables
- **Form Management**: react-hook-form 7.59.0
- **Icons**: Lucide React 0.525.0
- **Animations**: Framer Motion 12.23.0

### 開発ツール
- **Linter/Formatter**: Biome 2.1.1
- **Component Documentation**: Storybook 9.0.15
- **Type Checking**: TypeScript (strict mode)
- **Git Hooks**: Husky 9.1.7 + lint-staged 16.1.2

### 特殊機能
- **Drag & Drop**: @dnd-kit/core 6.3.1
- **Flow Diagrams**: @xyflow/react 12.8.1
- **Class Variance Authority**: 0.7.1
- **Utility Libraries**: clsx, tailwind-merge

## 📊 プロジェクト統計

- **総ファイル数**: 140個 (TypeScript/TSX)
- **総コード行数**: 16,630行
- **プロジェクトサイズ**: 4MB (ソースコード)
- **依存関係**: 820パッケージ

## 🚀 セットアップ

### 前提条件
- Node.js 18.20.8以上
- npm 10.8.2以上

### インストール
```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# プロダクション起動
npm start
```

### 開発コマンド
```bash
# 型チェック
npm run type-check

# リント & フォーマット
npm run lint
npm run format

# Storybook
npm run storybook
npm run build-storybook

# 品質チェック
npm run quality-check

# キャッシュクリア
npm run cache:clear          # Node.js版キャッシュクリア
npm run cache:clear:sh       # シェルスクリプト版キャッシュクリア
npm run clean               # 基本的なキャッシュクリア
npm run clean:all           # 完全クリーン（node_modules再インストール）
npm run dev:clean           # キャッシュクリア + 開発サーバー起動
```

## 📁 プロジェクト構造

```
survey-copy/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 認証付きルート
│   │   └── surveys/              # アンケート管理
│   │       ├── (chat)/           # AIチャット機能
│   │       │   ├── new/          # 新規作成
│   │       │   ├── question/     # 設問編集
│   │       │   └── section/      # セクション設定
│   │       ├── review/           # レビュー機能
│   │       └── reviewer/         # レビュアー機能
│   ├── api/                      # API Routes
│   └── globals.css               # グローバルスタイル
├── components/                   # 再利用可能コンポーネント
│   ├── ui/                       # shadcn/ui コンポーネント
│   ├── common/                   # 共通コンポーネント
│   ├── survey-ai/                # AI関連コンポーネント
│   └── survey-flow-nodes/        # フローチャートノード
├── lib/                          # ユーティリティ & 型定義
│   ├── types/                    # TypeScript型定義
│   ├── utils/                    # ユーティリティ関数
│   └── analyzers/                # 分析ツール
├── hooks/                        # カスタムフック
├── scripts/                      # 開発スクリプト
└── stories/                      # Storybookストーリー
```

## 🔧 主要機能

### 1. アンケート作成フロー
- **AI支援作成**: 自然言語でのアンケート設計
- **セクション管理**: スクリーニング・本調査の分離
- **設問編集**: ドラッグ&ドロップによる直感的編集
- **リアルタイムプレビュー**: 即座の結果確認

### 2. 設問タイプ
- **SA**: 単一選択
- **MA**: 複数選択
- **NU**: 数値入力
- **TE**: テキスト入力
- **RA**: ランキング
- **CA**: カード選択

### 3. ロジック機能
- **条件分岐**: 回答に基づく設問スキップ
- **表示制御**: 条件付き設問表示
- **バリデーション**: 回答条件チェック

### 4. レビューシステム
- **AIレビュー**: 自動品質チェック
- **チームレビュー**: 複数レビュアー対応
- **コメント機能**: 位置指定コメント
- **承認フロー**: 段階的承認プロセス

## 🎨 UI/UX 特徴

### デザインシステム
- **カラーパレット**: HSL変数ベースの一貫した色使い
- **タイポグラフィ**: Noto Sans JP フォント
- **コンポーネント**: 再利用可能なUIコンポーネント
- **レスポンシブ**: モバイルファーストデザイン

### インタラクション
- **アニメーション**: Framer Motionによる滑らかな動き
- **ドラッグ&ドロップ**: 直感的な編集体験
- **リアルタイム更新**: 即座のフィードバック
- **アクセシビリティ**: WCAG準拠

## 🔍 品質管理

### 自動化ツール
- **Biome**: コード品質・フォーマット
- **TypeScript**: 型安全性
- **Husky**: Git hooks
- **lint-staged**: コミット前チェック

### 品質チェック結果
```
✅ 成功したチェック:
  • 依存関係チェック完了
  • コンポーネント構造チェック完了
  • Storybook設定チェック完了
  • 型定義ファイルチェック完了
  • セキュリティチェック完了

⚠️  警告:
  • フォーマットの問題（自動修正済み）
  • CSS依存関係チェックエラー

❌ 修正が必要:
  • TypeScript型エラー（18件）
  • リントエラー（13件）
  • ビルドエラー
```

### 修正が必要な問題
1. **未使用インポート**: 複数ファイルで未使用のインポート
2. **未使用変数**: 開発中の一時的な変数
3. **アクセシビリティ**: label要素の関連付け不足
4. **SVG**: title要素の不足

## 📚 開発ガイドライン

### コーディング規約
- **TypeScript**: strict mode必須
- **Biome**: 自動フォーマット・リント
- **命名規則**: camelCase (変数), PascalCase (コンポーネント)
- **ファイル構造**: 機能別ディレクトリ分割

### コンポーネント設計
- **Props型定義**: 必須
- **Storybook**: 全UIコンポーネント
- **テスト**: 重要な機能のみ
- **ドキュメント**: JSDocコメント

### パフォーマンス
- **コード分割**: 動的インポート
- **画像最適化**: Next.js Image
- **バンドルサイズ**: 依存関係監視
- **キャッシュ**: 適切なキャッシュ戦略

## 🚀 デプロイメント

### 環境設定
```bash
# 開発環境
npm run dev

# 本番ビルド
npm run build

# 本番起動
npm start
```

### 推奨環境
- **Node.js**: 18.20.8以上
- **メモリ**: 2GB以上
- **ストレージ**: 1GB以上

## 🤝 貢献ガイド

### 開発フロー
1. 機能ブランチ作成
2. 開発・テスト
3. 品質チェック実行
4. プルリクエスト作成
5. レビュー・マージ

### 品質基準
- TypeScript型エラーなし
- Biomeリントエラーなし
- テストカバレッジ80%以上
- Storybookストーリー追加

## 📄 ライセンス

このプロジェクトはプライベートプロジェクトです。

## 🔗 関連ドキュメント

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)
- [Storybook Documentation](https://storybook.js.org/docs)

---

**最終更新**: 2024年12月
**バージョン**: 0.1.0
**ステータス**: 開発中
