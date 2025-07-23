import type { ComponentType, FormEvent, ReactNode } from "react";

// 基本的なコンポーネントのProps型
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

// バリアントを持つコンポーネントのProps型
export interface VariantComponentProps extends BaseComponentProps {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

// フォームコンポーネントのProps型
export interface FormComponentProps extends BaseComponentProps {
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  error?: string;
}

// アクセシビリティのProps型
export interface AccessibilityProps {
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
  "aria-hidden"?: boolean;
  role?: string;
}

// イベントハンドラーのProps型
export interface EventHandlerProps {
  onClick?: () => void;
  onChange?: (value: any) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmit?: (event: FormEvent) => void;
}

// Storybook用のメタデータ型
export interface StoryMeta {
  title: string;
  component: ComponentType<any>;
  parameters?: {
    layout?: "centered" | "padded" | "fullscreen";
    docs?: {
      description?: {
        component?: string;
      };
    };
  };
  argTypes?: Record<string, any>;
  decorators?: any[];
}

// コンポーネントの状態型
export type ComponentState =
  | "default"
  | "hover"
  | "focus"
  | "active"
  | "disabled"
  | "loading"
  | "error";

// サイズ型
export type ComponentSize = "xs" | "sm" | "md" | "lg" | "xl";

// 色型
export type ComponentColor =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info";
