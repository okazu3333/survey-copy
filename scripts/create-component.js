#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// コマンドライン引数を取得
const componentName = process.argv[2];

if (!componentName) {
  console.error('使用方法: npm run component:new <ComponentName>');
  process.exit(1);
}

// コンポーネント名をパスカルケースに変換
const pascalCase = componentName.charAt(0).toUpperCase() + componentName.slice(1);

// コンポーネントディレクトリを作成
const componentDir = path.join(__dirname, '..', 'components', 'ui', pascalCase);
if (!fs.existsSync(componentDir)) {
  fs.mkdirSync(componentDir, { recursive: true });
}

// コンポーネントファイルの内容
const componentContent = `import React from 'react';
import { cn } from '@/lib/utils';
import type { BaseComponentProps, VariantComponentProps } from '@/lib/types/component';

// コンポーネントのProps型定義
export interface ${pascalCase}Props extends VariantComponentProps {
  // 追加のプロパティをここに定義
  label?: string;
  description?: string;
}

// バリアントのクラス定義
const variantClasses = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
} as const;

// サイズのクラス定義
const sizeClasses = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10',
} as const;

/**
 * ${pascalCase} - コンポーネントの説明
 * 
 * @example
 * \`\`\`tsx
 * <${pascalCase} variant="primary" size="md">
 *   Button Text
 * </${pascalCase}>
 * \`\`\`
 */
export const ${pascalCase} = React.forwardRef<HTMLDivElement, ${pascalCase}Props>(
  ({ className, variant = 'default', size = 'default', children, label, description, ...props }, ref) => {
    return (
      <div
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {label && <span className="sr-only">{label}</span>}
        {children}
        {description && <span className="text-xs text-muted-foreground">{description}</span>}
      </div>
    );
  }
);

${pascalCase}.displayName = '${pascalCase}';

export default ${pascalCase};
`;

// ストーリーファイルの内容
const storyContent = `import type { Meta, StoryObj } from '@storybook/react';
import { ${pascalCase} } from './${pascalCase}';

const meta: Meta<typeof ${pascalCase}> = {
  title: 'Components/${pascalCase}',
  component: ${pascalCase},
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '${pascalCase}コンポーネントの説明文をここに記載します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
      description: 'コンポーネントのバリアント',
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'コンポーネントのサイズ',
    },
    disabled: {
      control: { type: 'boolean' },
      description: '無効状態',
    },
    className: {
      control: { type: 'text' },
      description: '追加のCSSクラス',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// デフォルトストーリー
export const Default: Story = {
  args: {
    children: '${pascalCase}',
  },
};

// プライマリバリアント
export const Primary: Story = {
  args: {
    variant: 'default',
    children: 'Primary ${pascalCase}',
  },
};

// セカンダリバリアント
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary ${pascalCase}',
  },
};

// サイズバリエーション
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <${pascalCase} size="sm">Small</${pascalCase}>
      <${pascalCase} size="default">Default</${pascalCase}>
      <${pascalCase} size="lg">Large</${pascalCase}>
    </div>
  ),
};
`;

// インデックスファイルの内容
const indexContent = `export { ${pascalCase} } from './${pascalCase}';
export type { ${pascalCase}Props } from './${pascalCase}';
`;

// ファイルを書き込み
fs.writeFileSync(path.join(componentDir, `${pascalCase}.tsx`), componentContent);
fs.writeFileSync(path.join(componentDir, `${pascalCase}.stories.tsx`), storyContent);
fs.writeFileSync(path.join(componentDir, 'index.ts'), indexContent);

console.log(`✅ ${pascalCase}コンポーネントが作成されました:`);
console.log(`   📁 ${componentDir}/`);
console.log(`   📄 ${pascalCase}.tsx`);
console.log(`   📄 ${pascalCase}.stories.tsx`);
console.log(`   📄 index.ts`);
console.log('');
console.log('次のコマンドでStorybookを起動できます:');
console.log('   npm run storybook'); 