/**
 * コンポーネント用ユーティリティ関数
 *
 * コンポーネントの開発を効率化するためのユーティリティ関数を提供します。
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * CSSクラス名を結合するユーティリティ関数
 *
 * @param inputs - 結合するクラス名の配列
 * @returns 結合されたクラス名文字列
 *
 * @example
 * ```tsx
 * const className = cn(
 *   'base-class',
 *   variant === 'primary' && 'primary-class',
 *   size === 'lg' && 'large-class'
 * );
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * コンポーネントのバリアントクラスを生成する
 *
 * @param variantClasses - バリアント別のクラス定義
 * @param variant - 現在のバリアント
 * @param defaultVariant - デフォルトバリアント
 * @returns バリアントクラス文字列
 *
 * @example
 * ```tsx
 * const variantClass = getVariantClass(
 *   {
 *     default: 'bg-gray-100',
 *     primary: 'bg-blue-500',
 *     secondary: 'bg-green-500'
 *   },
 *   variant,
 *   'default'
 * );
 * ```
 */
export function getVariantClass<T extends string>(
  variantClasses: Record<T, string>,
  variant?: T,
  defaultVariant: T = Object.keys(variantClasses)[0] as T,
): string {
  const currentVariant = variant || defaultVariant;
  return variantClasses[currentVariant] || variantClasses[defaultVariant];
}

/**
 * コンポーネントのサイズクラスを生成する
 *
 * @param sizeClasses - サイズ別のクラス定義
 * @param size - 現在のサイズ
 * @param defaultSize - デフォルトサイズ
 * @returns サイズクラス文字列
 *
 * @example
 * ```tsx
 * const sizeClass = getSizeClass(
 *   {
 *     sm: 'h-8 px-2',
 *     md: 'h-10 px-4',
 *     lg: 'h-12 px-6'
 *   },
 *   size,
 *   'md'
 * );
 * ```
 */
export function getSizeClass<T extends string>(
  sizeClasses: Record<T, string>,
  size?: T,
  defaultSize: T = Object.keys(sizeClasses)[0] as T,
): string {
  const currentSize = size || defaultSize;
  return sizeClasses[currentSize] || sizeClasses[defaultSize];
}

/**
 * 条件付きクラス名を生成する
 *
 * @param condition - 条件
 * @param trueClass - 条件が真の時のクラス
 * @param falseClass - 条件が偽の時のクラス（オプション）
 * @returns クラス名文字列
 *
 * @example
 * ```tsx
 * const className = conditionalClass(
 *   isActive,
 *   'bg-blue-500 text-white',
 *   'bg-gray-200 text-gray-700'
 * );
 * ```
 */
export function conditionalClass(
  condition: boolean,
  trueClass: string,
  falseClass?: string,
): string {
  return condition ? trueClass : falseClass || "";
}

/**
 * 複数の条件付きクラス名を生成する
 *
 * @param conditions - 条件とクラスのペアの配列
 * @returns クラス名文字列
 *
 * @example
 * ```tsx
 * const className = conditionalClasses([
 *   [isActive, 'bg-blue-500'],
 *   [isDisabled, 'opacity-50'],
 *   [isLarge, 'text-lg', 'text-sm']
 * ]);
 * ```
 */
export function conditionalClasses(
  conditions: Array<[boolean, string, string?]>,
): string {
  return conditions
    .map(([condition, trueClass, falseClass]) =>
      conditionalClass(condition, trueClass, falseClass),
    )
    .filter(Boolean)
    .join(" ");
}

/**
 * コンポーネントの状態クラスを生成する
 *
 * @param stateClasses - 状態別のクラス定義
 * @param state - 現在の状態
 * @param defaultState - デフォルト状態
 * @returns 状態クラス文字列
 *
 * @example
 * ```tsx
 * const stateClass = getStateClass(
 *   {
 *     idle: 'bg-gray-100',
 *     loading: 'bg-yellow-100 animate-pulse',
 *     success: 'bg-green-100',
 *     error: 'bg-red-100'
 *   },
 *   state,
 *   'idle'
 * );
 * ```
 */
export function getStateClass<T extends string>(
  stateClasses: Record<T, string>,
  state?: T,
  defaultState: T = Object.keys(stateClasses)[0] as T,
): string {
  const currentState = state || defaultState;
  return stateClasses[currentState] || stateClasses[defaultState];
}

/**
 * コンポーネントのPropsからHTML属性を抽出する
 *
 * @param props - コンポーネントのProps
 * @param excludeKeys - 除外するキーの配列
 * @returns HTML属性オブジェクト
 *
 * @example
 * ```tsx
 * const htmlProps = extractHtmlProps(props, ['variant', 'size']);
 * ```
 */
export function extractHtmlProps<T extends Record<string, unknown>>(
  props: T,
  excludeKeys: (keyof T)[] = [],
): Omit<T, keyof T> {
  const excluded = new Set(excludeKeys);
  return Object.fromEntries(
    Object.entries(props).filter(([key]) => !excluded.has(key as keyof T)),
  ) as Omit<T, keyof T>;
}

/**
 * コンポーネントのPropsから特定の属性を抽出する
 *
 * @param props - コンポーネントのProps
 * @param includeKeys - 含めるキーの配列
 * @returns 抽出された属性オブジェクト
 *
 * @example
 * ```tsx
 * const variantProps = extractProps(props, ['variant', 'size']);
 * ```
 */
export function extractProps<T extends Record<string, any>, K extends keyof T>(
  props: T,
  includeKeys: K[],
): Pick<T, K> {
  const included = new Set(includeKeys);
  return Object.fromEntries(
    Object.entries(props).filter(([key]) => included.has(key as K)),
  ) as Pick<T, K>;
}

/**
 * コンポーネントのPropsをマージする
 *
 * @param defaultProps - デフォルトProps
 * @param props - 上書きするProps
 * @returns マージされたProps
 *
 * @example
 * ```tsx
 * const mergedProps = mergeProps(defaultProps, props);
 * ```
 */
export function mergeProps<T extends Record<string, any>>(
  defaultProps: Partial<T>,
  props: Partial<T>,
): T {
  return { ...defaultProps, ...props } as T;
}

/**
 * コンポーネントのPropsを検証する
 *
 * @param props - 検証するProps
 * @param requiredKeys - 必須キーの配列
 * @returns 検証結果
 *
 * @example
 * ```tsx
 * const validation = validateProps(props, ['id', 'name']);
 * if (!validation.isValid) {
 *   console.error('Missing required props:', validation.missing);
 * }
 * ```
 */
export function validateProps<T extends Record<string, any>>(
  props: T,
  requiredKeys: (keyof T)[],
): { isValid: boolean; missing: (keyof T)[] } {
  const missing = requiredKeys.filter((key) => !(key in props));
  return {
    isValid: missing.length === 0,
    missing,
  };
}

/**
 * コンポーネントのPropsを変換する
 *
 * @param props - 変換するProps
 * @param transformer - 変換関数
 * @returns 変換されたProps
 *
 * @example
 * ```tsx
 * const transformedProps = transformProps(props, (key, value) => {
 *   if (key === 'className') {
 *     return cn(value, 'additional-class');
 *   }
 *   return value;
 * });
 * ```
 */
export function transformProps<T extends Record<string, any>>(
  props: T,
  transformer: (key: keyof T, value: T[keyof T]) => any,
): Record<string, any> {
  return Object.fromEntries(
    Object.entries(props).map(([key, value]) => [
      key,
      transformer(key as keyof T, value),
    ]),
  );
}

/**
 * コンポーネントのPropsをフィルタリングする
 *
 * @param props - フィルタリングするProps
 * @param filter - フィルタ関数
 * @returns フィルタリングされたProps
 *
 * @example
 * ```tsx
 * const filteredProps = filterProps(props, (key, value) => {
 *   return value !== undefined && value !== null;
 * });
 * ```
 */
export function filterProps<T extends Record<string, any>>(
  props: T,
  filter: (key: keyof T, value: T[keyof T]) => boolean,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(props).filter(([key, value]) =>
      filter(key as keyof T, value),
    ),
  ) as Partial<T>;
}

/**
 * コンポーネントのPropsを正規化する
 *
 * @param props - 正規化するProps
 * @returns 正規化されたProps
 *
 * @example
 * ```tsx
 * const normalizedProps = normalizeProps(props);
 * ```
 */
export function normalizeProps<T extends Record<string, any>>(props: T): T {
  return Object.fromEntries(
    Object.entries(props).map(([key, value]) => [
      key,
      value === undefined ? null : value,
    ]),
  ) as T;
}

/**
 * コンポーネントのPropsをデバウンスする
 *
 * @param props - デバウンスするProps
 * @param delay - デバウンス遅延時間（ミリ秒）
 * @returns デバウンスされたProps
 *
 * @example
 * ```tsx
 * const debouncedProps = debounceProps(props, 300);
 * ```
 */
export function debounceProps<T extends Record<string, any>>(
  props: T,
  delay: number,
): T {
  // この関数は実際のデバウンス実装を提供します
  // 実際の使用では、useDebounceフックを使用することを推奨します
  return props;
}

/**
 * コンポーネントのPropsをメモ化する
 *
 * @param props - メモ化するProps
 * @param deps - 依存関係の配列
 * @returns メモ化されたProps
 *
 * @example
 * ```tsx
 * const memoizedProps = memoizeProps(props, [props.id, props.variant]);
 * ```
 */
export function memoizeProps<T extends Record<string, any>>(
  props: T,
  deps: any[],
): T {
  // この関数は実際のメモ化実装を提供します
  // 実際の使用では、useMemoフックを使用することを推奨します
  return props;
}
