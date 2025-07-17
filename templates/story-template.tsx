import type { Meta, StoryObj } from "@storybook/react";
import { ComponentName } from "./component-template";

const meta: Meta<typeof ComponentName> = {
  title: "Components/ComponentName",
  component: ComponentName,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "ComponentNameコンポーネントの説明文をここに記載します。",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: [
        "default",
        "secondary",
        "destructive",
        "outline",
        "ghost",
        "link",
      ],
      description: "コンポーネントのバリアント",
    },
    size: {
      control: { type: "select" },
      options: ["default", "sm", "lg", "icon"],
      description: "コンポーネントのサイズ",
    },
    // disabled: {
    //   control: { type: "boolean" },
    //   description: "無効状態",
    // },
    className: {
      control: { type: "text" },
      description: "追加のCSSクラス",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// デフォルトストーリー
export const Default: Story = {
  args: {
    children: "ComponentName",
  },
};

// プライマリバリアント
export const Primary: Story = {
  args: {
    variant: "default",
    children: "Primary Button",
  },
};

// セカンダリバリアント
export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Button",
  },
};

// 破壊的バリアント
export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Destructive Button",
  },
};

// アウトラインバリアント
export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline Button",
  },
};

// ゴーストバリアント
export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost Button",
  },
};

// リンクバリアント
export const Link: Story = {
  args: {
    variant: "link",
    children: "Link Button",
  },
};

// サイズバリエーション
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ComponentName size="sm">Small</ComponentName>
      <ComponentName size="default">Default</ComponentName>
      <ComponentName size="lg">Large</ComponentName>
    </div>
  ),
};

// 無効状態
// export const Disabled: Story = {
//   args: {
//     disabled: true,
//     children: "Disabled Button",
//   },
// };

// ラベル付き
export const WithLabel: Story = {
  args: {
    label: "アクセシビリティラベル",
    children: "Button with Label",
  },
};

// 説明付き
export const WithDescription: Story = {
  args: {
    description: "追加の説明文",
    children: "Button with Description",
  },
};
