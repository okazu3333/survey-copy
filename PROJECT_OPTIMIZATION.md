# 🚀 プロジェクト全体最適化ガイドライン

## 📋 最適化概要

このドキュメントは、survey-copyプロジェクトの全体最適化計画とガイドラインを定義します。

## 🏗️ ファイル構造の最適化

### 現在の問題点
1. **重複するコンポーネントディレクトリ**: `app/_components/` と `components/`
2. **不統一な命名規則**: ケバブケースとキャメルケースの混在
3. **深すぎるネスト**: 一部のディレクトリが過度に深い
4. **散在する設定ファイル**: 設定が複数の場所に分散

### 最適化後の構造
```
survey-copy/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 認証付きルート
│   │   └── surveys/              # アンケート管理
│   │       ├── (chat)/           # AIチャット機能
│   │       ├── review/           # レビュー機能
│   │       └── reviewer/         # レビュアー機能
│   ├── api/                      # API Routes
│   ├── globals.css               # グローバルスタイル
│   ├── layout.tsx                # ルートレイアウト
│   └── page.tsx                  # ルートページ
├── components/                   # 再利用可能コンポーネント
│   ├── ui/                       # shadcn/ui コンポーネント
│   ├── common/                   # 共通コンポーネント
│   ├── features/                 # 機能別コンポーネント
│   │   ├── survey/               # アンケート関連
│   │   ├── ai/                   # AI関連
│   │   └── review/               # レビュー関連
│   └── layouts/                  # レイアウトコンポーネント
├── lib/                          # ユーティリティ & 型定義
│   ├── types/                    # TypeScript型定義
│   ├── utils/                    # ユーティリティ関数
│   ├── constants/                # 定数定義
│   └── analyzers/                # 分析ツール
├── hooks/                        # カスタムフック
├── config/                       # 設定ファイル
├── scripts/                      # 開発スクリプト
└── docs/                         # ドキュメント
```

## 📝 命名規則の統一

### ファイル・ディレクトリ命名
- **ディレクトリ**: kebab-case (`survey-flow-nodes/`)
- **コンポーネントファイル**: PascalCase (`SurveyCard.tsx`)
- **ユーティリティファイル**: camelCase (`surveyUtils.ts`)
- **型定義ファイル**: camelCase (`surveyTypes.ts`)
- **定数ファイル**: UPPER_SNAKE_CASE (`SURVEY_CONSTANTS.ts`)

### コンポーネント命名
- **コンポーネント名**: PascalCase (`SurveyCard`)
- **Props型**: PascalCase + Props (`SurveyCardProps`)
- **イベントハンドラー**: handle + 動詞 + 名詞 (`handleSurveySubmit`)
- **状態変数**: 動詞 + 名詞 (`isLoading`, `hasError`)

### 関数命名
- **ユーティリティ関数**: camelCase (`formatSurveyData`)
- **カスタムフック**: use + 名詞 (`useSurveyForm`)
- **イベントハンドラー**: handle + 動詞 + 名詞 (`handleQuestionAdd`)

## 🎨 コンポーネント設計原則

### 1. 単一責任原則
```tsx
// ❌ 悪い例: 複数の責任を持つコンポーネント
const SurveyManager = () => {
  // データ取得、状態管理、UI表示が混在
};

// ✅ 良い例: 責任を分離
const SurveyList = ({ surveys }: SurveyListProps) => {
  return <div>{/* UI表示のみ */}</div>;
};

const useSurveyData = () => {
  // データ取得と状態管理
};
```

### 2. Props型定義の統一
```tsx
// 基本Props型
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// バリアントProps型
export interface VariantComponentProps extends BaseComponentProps {
  variant?: 'default' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

// 具体的なコンポーネントProps
export interface SurveyCardProps extends VariantComponentProps {
  survey: Survey;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}
```

### 3. コンポーネント構造の統一
```tsx
import React from 'react';
import { cn } from '@/lib/utils';
import type { SurveyCardProps } from './types';

// バリアントとサイズのクラス定義
const variantClasses = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
} as const;

const sizeClasses = {
  sm: 'h-9 px-3',
  md: 'h-10 px-4',
  lg: 'h-11 px-6',
} as const;

export const SurveyCard = React.forwardRef<HTMLDivElement, SurveyCardProps>(
  ({ className, variant = 'default', size = 'md', survey, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {/* コンポーネント内容 */}
      </div>
    );
  }
);

SurveyCard.displayName = 'SurveyCard';
```

## 🔧 設定ファイルの統合

### 1. 設定ファイルの整理
```
config/
├── app.config.ts          # アプリケーション設定
├── build.config.ts        # ビルド設定
├── lint.config.ts         # リント設定
├── test.config.ts         # テスト設定
└── storybook.config.ts    # Storybook設定
```

### 2. 環境変数の管理
```typescript
// config/env.config.ts
export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  BASIC_AUTH_USER: process.env.BASIC_AUTH_USER || '',
  BASIC_AUTH_PASSWORD: process.env.BASIC_AUTH_PASSWORD || '',
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000',
} as const;
```

## 📊 パフォーマンス最適化

### 1. コード分割
```tsx
// 動的インポートの活用
const SurveyEditor = lazy(() => import('@/components/features/survey/SurveyEditor'));
const AIReviewDialog = lazy(() => import('@/components/features/ai/AIReviewDialog'));
```

### 2. メモ化の活用
```tsx
// React.memoで不要な再レンダリングを防止
export const SurveyCard = React.memo<SurveyCardProps>(({ survey, ...props }) => {
  return <div>{/* コンポーネント内容 */}</div>;
});

// useMemoで重い計算を最適化
const processedData = useMemo(() => {
  return processSurveyData(surveys);
}, [surveys]);
```

### 3. バンドルサイズの最適化
```typescript
// 必要な部分のみインポート
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// 大きなライブラリは動的インポート
const ReactFlow = lazy(() => import('@xyflow/react'));
```

## 🧪 テスト戦略

### 1. テスト構造
```
__tests__/
├── components/             # コンポーネントテスト
├── hooks/                  # フックテスト
├── utils/                  # ユーティリティテスト
└── integration/            # 統合テスト
```

### 2. テスト命名規則
```typescript
// ファイル名: ComponentName.test.tsx
// テスト名: ComponentName should render correctly
describe('SurveyCard', () => {
  it('should render correctly', () => {
    // テスト内容
  });
});
```

## 📚 ドキュメント整備

### 1. ドキュメント構造
```
docs/
├── README.md               # プロジェクト概要
├── SETUP.md                # セットアップガイド
├── ARCHITECTURE.md         # アーキテクチャ説明
├── COMPONENTS.md           # コンポーネントガイド
├── API.md                  # API仕様
└── DEPLOYMENT.md           # デプロイメントガイド
```

### 2. JSDocコメントの統一
```tsx
/**
 * SurveyCard - アンケートカードコンポーネント
 * 
 * @param props - コンポーネントのプロパティ
 * @param props.survey - アンケートデータ
 * @param props.onEdit - 編集時のコールバック
 * @param props.onDelete - 削除時のコールバック
 * 
 * @example
 * ```tsx
 * <SurveyCard
 *   survey={surveyData}
 *   onEdit={(id) => handleEdit(id)}
 *   onDelete={(id) => handleDelete(id)}
 * />
 * ```
 */
export const SurveyCard = ({ survey, onEdit, onDelete }: SurveyCardProps) => {
  // コンポーネント実装
};
```

## 🔄 移行計画

### Phase 1: 基盤整備 (Week 1)
- [ ] 設定ファイルの統合
- [ ] 型定義の整理
- [ ] ユーティリティ関数の整理

### Phase 2: コンポーネント整理 (Week 2)
- [ ] 重複コンポーネントの統合
- [ ] 命名規則の統一
- [ ] Props型定義の統一

### Phase 3: パフォーマンス最適化 (Week 3)
- [ ] コード分割の実装
- [ ] メモ化の適用
- [ ] バンドルサイズの最適化

### Phase 4: テスト・ドキュメント (Week 4)
- [ ] テスト構造の整備
- [ ] ドキュメントの作成
- [ ] 最終チェック

## ✅ 品質基準

### コード品質
- [ ] TypeScript strict mode
- [ ] Biomeリントエラーなし
- [ ] テストカバレッジ80%以上
- [ ] バンドルサイズ最適化

### パフォーマンス
- [ ] Lighthouse Score 90以上
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1

### アクセシビリティ
- [ ] WCAG 2.1 AA準拠
- [ ] キーボードナビゲーション対応
- [ ] スクリーンリーダー対応
- [ ] 色のコントラスト比4.5:1以上

このガイドラインに従って、プロジェクト全体の最適化を進めます。 