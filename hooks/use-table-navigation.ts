import { useRouter } from "next/navigation";
import { useCallback } from "react";
import type { IconAction, Project, ProjectStatus } from "@/lib/types/survey";
import {
  getIconActionPath,
  getNavigationPath,
  isInteractiveElement,
} from "@/lib/utils/table-navigation";

export const useTableNavigation = () => {
  const router = useRouter();

  // 行クリックハンドラー
  const handleRowClick = useCallback(
    (project: Project, event: React.MouseEvent) => {
      // インタラクティブ要素のクリックは無視
      if (isInteractiveElement(event.target)) {
        return;
      }

      // ステータスに応じた遷移（配信中・配信終了は遷移しない）
      const path = getNavigationPath(project.status, project.id);
      if (path) {
        router.push(path);
      }
    },
    [router],
  );

  // アイコンクリックハンドラー
  const handleIconClick = useCallback(
    (action: IconAction, projectId: string, event: React.MouseEvent) => {
      event.stopPropagation(); // 行クリックを防ぐ

      // アイコン固有のアクション処理
      const path = getIconActionPath(action, projectId);
      router.push(path);
    },
    [router],
  );

  // 選択状態の切り替えハンドラー（チェックボックス用）
  const handleSelectToggle = useCallback(
    (projectId: string, checked: boolean, event: React.MouseEvent) => {
      event.stopPropagation(); // 行クリックを防ぐ
      // 選択状態の切り替え処理は親コンポーネントで実装
      return { projectId, checked };
    },
    [],
  );

  return {
    handleRowClick,
    handleIconClick,
    handleSelectToggle,
  };
};
