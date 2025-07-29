/**
 * パフォーマンス最適化ユーティリティ
 *
 * アプリケーションのパフォーマンスを向上させるためのユーティリティ関数を提供します。
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * デバウンスフック
 *
 * @param callback - デバウンスする関数
 * @param delay - デバウンス遅延時間（ミリ秒）
 * @param deps - 依存関係の配列
 * @returns デバウンスされた関数
 *
 * @example
 * ```tsx
 * const debouncedSearch = useDebounce(searchFunction, 300, [searchTerm]);
 * ```
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = [],
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay, ...deps],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback as T;
}

/**
 * スロットルフック
 *
 * @param callback - スロットルする関数
 * @param delay - スロットル遅延時間（ミリ秒）
 * @param deps - 依存関係の配列
 * @returns スロットルされた関数
 *
 * @example
 * ```tsx
 * const throttledScroll = useThrottle(scrollHandler, 100);
 * ```
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = [],
): T {
  const lastCallRef = useRef(0);
  const lastCallTimerRef = useRef<NodeJS.Timeout>();

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCallRef.current >= delay) {
        callback(...args);
        lastCallRef.current = now;
      } else {
        if (lastCallTimerRef.current) {
          clearTimeout(lastCallTimerRef.current);
        }
        lastCallTimerRef.current = setTimeout(
          () => {
            callback(...args);
            lastCallRef.current = Date.now();
          },
          delay - (now - lastCallRef.current),
        );
      }
    },
    [callback, delay, ...deps],
  );

  useEffect(() => {
    return () => {
      if (lastCallTimerRef.current) {
        clearTimeout(lastCallTimerRef.current);
      }
    };
  }, []);

  return throttledCallback as T;
}

/**
 * メモ化された値の作成
 *
 * @param factory - 値を生成する関数
 * @param deps - 依存関係の配列
 * @returns メモ化された値
 *
 * @example
 * ```tsx
 * const expensiveValue = useMemoValue(() => {
 *   return expensiveCalculation(data);
 * }, [data]);
 * ```
 */
export function useMemoValue<T>(
  factory: () => T,
  deps: React.DependencyList,
): T {
  return useMemo(factory, deps);
}

/**
 * 前回の値を保持するフック
 *
 * @param value - 現在の値
 * @returns 前回の値
 *
 * @example
 * ```tsx
 * const previousValue = usePrevious(currentValue);
 * ```
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

/**
 * 値が変更されたかどうかを判定するフック
 *
 * @param value - 監視する値
 * @returns 値が変更されたかどうか
 *
 * @example
 * ```tsx
 * const hasChanged = useHasChanged(value);
 * ```
 */
export function useHasChanged<T>(value: T): boolean {
  const prevValue = usePrevious(value);
  return prevValue !== value;
}

/**
 * 非同期処理の状態を管理するフック
 *
 * @param asyncFunction - 非同期関数
 * @param deps - 依存関係の配列
 * @returns 非同期処理の状態
 *
 * @example
 * ```tsx
 * const { data, loading, error, execute } = useAsync(fetchData, []);
 * ```
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  deps: React.DependencyList = [],
) {
  const [state, setState] = useMemo(() => {
    const initialState = {
      data: undefined as T | undefined,
      loading: false,
      error: undefined as Error | undefined,
    };
    return [
      initialState,
      (updater: (prev: typeof initialState) => typeof initialState) => {
        setState(updater);
      },
    ] as const;
  }, []);

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: undefined }));
    try {
      const data = await asyncFunction();
      setState((prev) => ({ ...prev, data, loading: false }));
      return data;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error as Error,
        loading: false,
      }));
      throw error;
    }
  }, [asyncFunction, ...deps]);

  return { ...state, execute };
}

/**
 * ローカルストレージの値を管理するフック
 *
 * @param key - ストレージのキー
 * @param initialValue - 初期値
 * @returns ストレージの値と更新関数
 *
 * @example
 * ```tsx
 * const [value, setValue] = useLocalStorage('theme', 'light');
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue];
}

/**
 * セッションストレージの値を管理するフック
 *
 * @param key - ストレージのキー
 * @param initialValue - 初期値
 * @returns ストレージの値と更新関数
 *
 * @example
 * ```tsx
 * const [value, setValue] = useSessionStorage('formData', {});
 * ```
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useMemo(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue];
}

/**
 * インターバルを管理するフック
 *
 * @param callback - 実行する関数
 * @param delay - インターバル時間（ミリ秒）
 * @param deps - 依存関係の配列
 *
 * @example
 * ```tsx
 * useInterval(() => {
 *   updateData();
 * }, 5000, []);
 * ```
 */
export function useInterval(
  callback: () => void,
  delay: number | null,
  deps: React.DependencyList = [],
) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback, ...deps]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

/**
 * タイムアウトを管理するフック
 *
 * @param callback - 実行する関数
 * @param delay - タイムアウト時間（ミリ秒）
 * @param deps - 依存関係の配列
 *
 * @example
 * ```tsx
 * useTimeout(() => {
 *   showNotification();
 * }, 3000, []);
 * ```
 */
export function useTimeout(
  callback: () => void,
  delay: number | null,
  deps: React.DependencyList = [],
) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback, ...deps]);

  useEffect(() => {
    if (delay !== null) {
      const id = setTimeout(() => savedCallback.current(), delay);
      return () => clearTimeout(id);
    }
  }, [delay]);
}

/**
 * パフォーマンス測定用のユーティリティ
 */
export const performanceUtils = {
  /**
   * 関数の実行時間を測定する
   *
   * @param fn - 測定する関数
   * @param label - 測定ラベル
   * @returns 実行結果
   *
   * @example
   * ```tsx
   * const result = performanceUtils.measure(() => {
   *   return expensiveCalculation();
   * }, 'calculation');
   * ```
   */
  measure<T>(fn: () => T, label: string): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${label} took ${end - start}ms`);
    return result;
  },

  /**
   * 非同期関数の実行時間を測定する
   *
   * @param fn - 測定する非同期関数
   * @param label - 測定ラベル
   * @returns 実行結果
   *
   * @example
   * ```tsx
   * const result = await performanceUtils.measureAsync(async () => {
   *   return await fetchData();
   * }, 'fetch');
   * ```
   */
  async measureAsync<T>(fn: () => Promise<T>, label: string): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    console.log(`${label} took ${end - start}ms`);
    return result;
  },

  /**
   * メモリ使用量を測定する
   *
   * @param label - 測定ラベル
   * @returns メモリ使用量情報
   *
   * @example
   * ```tsx
   * const memoryInfo = performanceUtils.measureMemory('after calculation');
   * ```
   */
  measureMemory(label: string) {
    if ("memory" in performance) {
      const memory = (performance as any).memory;
      console.log(`${label} memory:`, {
        used: `${Math.round(memory.usedJSHeapSize / 1048576)}MB`,
        total: `${Math.round(memory.totalJSHeapSize / 1048576)}MB`,
        limit: `${Math.round(memory.jsHeapSizeLimit / 1048576)}MB`,
      });
    }
  },
};
