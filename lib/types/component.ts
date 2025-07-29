/**
 * コンポーネントの基本型定義
 *
 * すべてのコンポーネントで使用される共通の型定義を提供します。
 */

import type { ReactNode, RefAttributes } from "react";

// 基本Props型
export interface BaseComponentProps {
  /** 追加のCSSクラス名 */
  className?: string;
  /** 子要素 */
  children?: ReactNode;
  /** テスト用のID */
  "data-testid"?: string;
}

// バリアントProps型
export interface VariantComponentProps extends BaseComponentProps {
  /** コンポーネントのバリアント */
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "ghost"
    | "link";
  /** コンポーネントのサイズ */
  size?: "sm" | "md" | "lg" | "xl";
  /** 無効状態 */
  disabled?: boolean;
}

// サイズ型
export type ComponentSize = "sm" | "md" | "lg" | "xl";

// バリアント型
export type ComponentVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link";

// 色型
export type ComponentColor =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info";

// 位置型
export type ComponentPosition = "top" | "right" | "bottom" | "left" | "center";

// アライメント型
export type ComponentAlignment = "start" | "center" | "end" | "stretch";

// 方向型
export type ComponentDirection = "horizontal" | "vertical";

// 状態型
export type ComponentState =
  | "idle"
  | "loading"
  | "success"
  | "error"
  | "disabled";

// イベントハンドラー型
export type EventHandler<T = unknown> = (event: T) => void;

// クリックハンドラー型
export type ClickHandler = EventHandler<React.MouseEvent<HTMLElement>>;

// フォーカスハンドラー型
export type FocusHandler = EventHandler<React.FocusEvent<HTMLElement>>;

// キーボードハンドラー型
export type KeyboardHandler = EventHandler<React.KeyboardEvent<HTMLElement>>;

// 変更ハンドラー型
export type ChangeHandler<T = unknown> = (value: T) => void;

// コンポーネントの参照型
export type ComponentRef<T extends HTMLElement = HTMLElement> =
  RefAttributes<T>;

// コンポーネントのProps型（ジェネリック）
export type ComponentProps<T extends BaseComponentProps = BaseComponentProps> =
  T;

// コンポーネントの型（ジェネリック）
export type ComponentType<P extends BaseComponentProps = BaseComponentProps> =
  React.ComponentType<P>;

// フォワードリファレンスコンポーネントの型
export type ForwardRefComponent<
  T extends HTMLElement,
  P extends BaseComponentProps,
> = React.ForwardRefExoticComponent<P & RefAttributes<T>>;

// 条件付きProps型
export type ConditionalProps<T, U> = T extends true ? U : never;

// 必須Props型
export type RequiredProps<T, K extends keyof T> = T & Required<Pick<T, K>>;

// オプショナルProps型
export type OptionalProps<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

// 読み取り専用Props型
export type ReadonlyProps<T> = Readonly<T>;

// 部分Props型
export type PartialProps<T> = Partial<T>;

// ピックProps型
export type PickProps<T, K extends keyof T> = Pick<T, K>;

// 除外Props型
export type OmitProps<T, K extends keyof T> = Omit<T, K>;

// ユニオンProps型
export type UnionProps<T, U> = T | U;

// 交差Props型
export type IntersectionProps<T, U> = T & U;

// コンポーネントのスタイル型
export interface ComponentStyle {
  /** カスタムスタイル */
  style?: React.CSSProperties;
  /** CSS変数 */
  cssVariables?: Record<string, string>;
  /** カスタムクラス */
  customClass?: string;
}

// コンポーネントのアクセシビリティ型
export interface ComponentAccessibility {
  /** ARIAラベル */
  "aria-label"?: string;
  /** ARIA説明 */
  "aria-describedby"?: string;
  /** ARIA隠し */
  "aria-hidden"?: boolean;
  /** ARIA必須 */
  "aria-required"?: boolean;
  /** ARIA無効 */
  "aria-disabled"?: boolean;
  /** ARIA選択済み */
  "aria-selected"?: boolean;
  /** ARIA展開 */
  "aria-expanded"?: boolean;
  /** ARIA制御 */
  "aria-controls"?: string;
  /** ARIA所有 */
  "aria-owns"?: string;
  /** ARIA現在 */
  "aria-current"?: boolean | "page" | "step" | "location" | "date" | "time";
  /** ARIAライブ */
  "aria-live"?: "off" | "polite" | "assertive";
  /** ARIA原子 */
  "aria-atomic"?: boolean;
  /** ARIA関連 */
  "aria-relevant"?:
    | "additions"
    | "additions removals"
    | "additions text"
    | "all"
    | "removals"
    | "removals additions"
    | "removals text"
    | "text"
    | "text additions"
    | "text removals";
}

// コンポーネントのデータ属性型
export interface ComponentDataAttributes {
  /** テスト用ID */
  "data-testid"?: string;
  /** コンポーネントID */
  "data-component-id"?: string;
  /** バリアント */
  "data-variant"?: string;
  /** サイズ */
  "data-size"?: string;
  /** 状態 */
  "data-state"?: string;
  /** 方向 */
  "data-direction"?: string;
  /** 位置 */
  "data-position"?: string;
}

// 完全なコンポーネントProps型
export interface FullComponentProps
  extends BaseComponentProps,
    VariantComponentProps,
    ComponentStyle,
    ComponentAccessibility,
    ComponentDataAttributes {
  /** 追加のHTML属性 */
  [key: string]: unknown;
}
