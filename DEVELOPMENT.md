# 開発環境セットアップガイド

このプロジェクトは、コンポーネント単位での開発を効率化するための環境が整備されています。

## 🚀 クイックスタート

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
# Next.js開発サーバー
npm run dev

# Storybook（別ターミナルで）
npm run storybook
```

## 📦 利用可能なスクリプト

| スクリプト | 説明 |
|-----------|------|
| `npm run dev` | Next.js開発サーバーを起動 |
| `npm run storybook` | Storybookを起動（ポート6006） |
| `npm run build-storybook` | Storybookをビルド |
| `npm run lint` | Biomeでコードをリント |
| `npm run format` | Biomeでコードをフォーマット |
| `npm run type-check` | TypeScriptの型チェック |
| `npm run component:new <Name>` | 新しいコンポーネントを作成 |

## 🧩 コンポーネント開発

### 新しいコンポーネントの作成

```bash
npm run component:new MyComponent
```

このコマンドは以下を自動生成します：
- `components/ui/MyComponent/MyComponent.tsx` - メインコンポーネント
- `components/ui/MyComponent/MyComponent.stories.tsx` - Storybookストーリー
- `components/ui/MyComponent/index.ts` - エクスポートファイル

### コンポーネントの構造

```tsx
import React from 'react';
import { cn } from '@/lib/utils';
import type { BaseComponentProps, VariantComponentProps } from '@/lib/types/component';

export interface MyComponentProps extends VariantComponentProps {
  // カスタムプロパティ
  label?: string;
  description?: string;
}

// バリアントとサイズのクラス定義
const variantClasses = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  // ...
} as const;

const sizeClasses = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  // ...
} as const;

export const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
    return (
      <div
        className={cn(
          'base-classes',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MyComponent.displayName = 'MyComponent';
```

### 型定義の活用

プロジェクトには以下の型定義が用意されています：

- `BaseComponentProps` - 基本的なプロパティ
- `VariantComponentProps` - バリアントとサイズ付きプロパティ
- `FormComponentProps` - フォームコンポーネント用
- `AccessibilityProps` - アクセシビリティ属性
- `EventHandlerProps` - イベントハンドラー

### ユーティリティ関数

`lib/utils/component.ts`には以下のヘルパー関数があります：

- `getStateClasses()` - 状態に基づくクラス名生成
- `getSizeClasses()` - サイズに基づくクラス名生成
- `getColorClasses()` - 色に基づくクラス名生成
- `getAccessibilityProps()` - アクセシビリティ属性生成
- `generateId()` - ユニークID生成

## 🎨 Storybook

### ストーリーの作成

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  title: 'Components/MyComponent',
  component: MyComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'コンポーネントの説明',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary', 'destructive'],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'MyComponent',
  },
};
```

### Storybookアドオン

以下のアドオンが利用可能です：

- **Controls** - プロパティの動的変更
- **Actions** - イベントハンドラーのテスト
- **Viewport** - レスポンシブデザインのテスト
- **Backgrounds** - 背景色の変更
- **Measure** - 要素のサイズ測定
- **Outline** - 要素のアウトライン表示

## 🎯 開発ワークフロー

### 1. コンポーネントの設計
- プロパティの型定義
- バリアントとサイズの決定
- アクセシビリティの考慮

### 2. コンポーネントの実装
- テンプレートを使用してコンポーネント作成
- TypeScriptで型安全性を確保
- Tailwind CSSでスタイリング

### 3. Storybookでのテスト
- 各バリアントのストーリー作成
- インタラクティブなテスト
- ドキュメントの作成

### 4. 統合テスト
- Next.jsアプリでの動作確認
- 他のコンポーネントとの連携テスト

## 🔧 設定ファイル

### TypeScript設定
- `tsconfig.json` - 厳密な型チェック
- パスエイリアス設定済み（`@/*`）

### Tailwind CSS設定
- `tailwind.config.ts` - カスタムテーマ
- CSS変数によるダークモード対応

### Biome設定
- `biome.json` - コードフォーマットとリント
- 自動修正機能付き

## 📚 参考資料

- [Next.js Documentation](https://nextjs.org/docs)
- [Storybook Documentation](https://storybook.js.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🤝 貢献ガイドライン

1. 新しいコンポーネントを作成する際は、必ずStorybookストーリーも作成
2. TypeScriptの型定義を適切に行う
3. アクセシビリティを考慮した実装
4. コードフォーマットとリントを実行してからコミット 