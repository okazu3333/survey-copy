import type {
  ComponentColor,
  ComponentSize,
  ComponentState,
} from "@/lib/types/component";
import { cn } from "@/lib/utils";

// コンポーネントの状態に基づくクラス名を生成
export function getStateClasses(
  state: ComponentState,
  baseClasses: string,
  stateClasses: Record<ComponentState, string>,
): string {
  return cn(baseClasses, stateClasses[state]);
}

// サイズに基づくクラス名を生成
export function getSizeClasses(
  size: ComponentSize,
  sizeClasses: Record<ComponentSize, string>,
): string {
  return sizeClasses[size] || sizeClasses.md;
}

// 色に基づくクラス名を生成
export function getColorClasses(
  color: ComponentColor,
  colorClasses: Record<ComponentColor, string>,
): string {
  return colorClasses[color] || colorClasses.primary;
}

// バリアントに基づくクラス名を生成
export function getVariantClasses(
  variant: string,
  variantClasses: Record<string, string>,
): string {
  return variantClasses[variant] || variantClasses.default;
}

// アクセシビリティ属性を生成
export function getAccessibilityProps(
  label?: string,
  describedBy?: string,
  labelledBy?: string,
  hidden?: boolean,
  role?: string,
) {
  return {
    ...(label && { "aria-label": label }),
    ...(describedBy && { "aria-describedby": describedBy }),
    ...(labelledBy && { "aria-labelledby": labelledBy }),
    ...(hidden && { "aria-hidden": hidden }),
    ...(role && { role }),
  };
}

// フォームバリデーション用のクラス名を生成
export function getFormClasses(
  baseClasses: string,
  errorClasses: string,
  disabledClasses: string,
  error?: string,
  disabled?: boolean,
): string {
  return cn(baseClasses, error && errorClasses, disabled && disabledClasses);
}

// コンポーネントのIDを生成
export function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

// イベントハンドラーを安全に実行
export function safeHandler<T extends (...args: any[]) => any>(
  handler: T | undefined,
  ...args: Parameters<T>
): void {
  if (typeof handler === "function") {
    try {
      handler(...args);
    } catch (error) {
      console.error("Error in event handler:", error);
    }
  }
}

// コンポーネントの表示名を生成
export function getDisplayName(Component: React.ComponentType<any>): string {
  return Component.displayName || Component.name || "Component";
}

// 条件付きでプロパティを追加
export function conditionalProps<T extends Record<string, any>>(
  props: T,
  condition: boolean,
  additionalProps: Record<string, any>,
): T {
  return condition ? { ...props, ...additionalProps } : props;
}
