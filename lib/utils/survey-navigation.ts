"use client";

import { useRouter } from "next/navigation";

export const useSurveyStepNavigation = () => {
  const router = useRouter();

  const handleStepClick = (stepIndex: number) => {
    // ステップに応じてページ遷移
    switch (stepIndex) {
      case 0: // 概要の設定
        router.push("/surveys/new");
        break;
      case 1: // セクションの設定
        router.push("/surveys/section");
        break;
      case 2: // 設問の設定
        router.push("/surveys/question/edit");
        break;
      case 3: // レビュー
        router.push("/surveys/review");
        break;
      case 4: // 調査票の確定
        router.push("/surveys/complete");
        break;
      default:
        break;
    }
  };

  return { handleStepClick };
}; 