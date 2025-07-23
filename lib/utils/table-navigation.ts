// テーブルナビゲーション用ユーティリティ
import type { IconAction, ProjectStatus } from "@/lib/types/survey";

// ステータス別遷移マッピング
export const STATUS_NAVIGATION_MAP: Record<ProjectStatus, string> = {
  作成中: "/surveys/question/edit",
  レビュー待ち: "/surveys/review/preview",
  レビュー完了: "/surveys/review/preview",
  作成完了: "/surveys/review/preview",
  配信中: "/surveys/distribution",
  配信終了: "/surveys/results",
} as const;

// アイコンアクション定義
export const ICON_ACTIONS = {
  review: {
    action: "review" as const,
    tooltip: "レビュー画面を開く",
    path: "/surveys/review/preview",
  },
  response: {
    action: "response" as const,
    tooltip: "回答画面を開く",
    path: "/surveys/response",
  },
  distribution: {
    action: "distribution" as const,
    tooltip: "配信設定を開く",
    path: "/surveys/distribution",
  },
  gtTable: {
    action: "gtTable" as const,
    tooltip: "GT表を開く",
    path: "/surveys/gt-table",
  },
} as const;

// インタラクティブ要素かどうかを判定
export const isInteractiveElement = (target: EventTarget | null): boolean => {
  const element = target as HTMLElement;
  if (!element) return false;

  return !!(
    element.tagName.toLowerCase() === "button" ||
    element.tagName.toLowerCase() === "a" ||
    element.tagName.toLowerCase() === "input" ||
    element.closest("button") ||
    element.closest("a") ||
    element.closest("input") ||
    element.closest("[role='button']")
  );
};

// ステータスに応じた遷移パスを取得（配信中・配信終了は遷移しない）
export const getNavigationPath = (
  status: ProjectStatus,
  projectId: string,
): string | null => {
  // 配信中・配信終了の場合は遷移しない
  if (status === "配信中" || status === "配信終了") {
    return null;
  }

  const basePath = STATUS_NAVIGATION_MAP[status];
  return basePath ? `${basePath}?id=${projectId}` : null;
};

// アイコンアクションに応じた遷移パスを取得
export const getIconActionPath = (
  action: IconAction,
  projectId: string,
): string => {
  const iconConfig = Object.values(ICON_ACTIONS).find(
    (config) => config.action === action,
  );
  const basePath = iconConfig?.path || "/surveys";
  return `${basePath}?id=${projectId}`;
};
