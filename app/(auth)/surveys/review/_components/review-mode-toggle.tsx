"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { UrlModal } from "./url-modal";

type Mode = {
  id: string;
  label: string;
  path: string;
};

const modesReviewee: Mode[] = [
  { id: "edit", label: "編集", path: "/surveys/review/edit" },
  { id: "preview", label: "一覧プレビュー", path: "/surveys/review/preview" },
  { id: "logic", label: "ロジックチェック", path: "/surveys/review/logic" },
];

const modesReviewer: Mode[] = [
  {
    id: "preview",
    label: "一覧プレビュー",
    path: "/surveys/review/reviewer/preview",
  },
  // 編集モードはレビュワーには不要な場合は追加しない（必要ならここにも追加）
  {
    id: "logic",
    label: "ロジックチェック",
    path: "/surveys/review/reviewer/logic",
  },
];

type ReviewModeToggleProps = {
  type?: "reviewer" | "reviewee";
  currentMode: string;
};

export const ReviewModeToggle = ({
  currentMode,
  type = "reviewee",
}: ReviewModeToggleProps) => {
  const router = useRouter();
  const modes = type === "reviewer" ? modesReviewer : modesReviewee;
  const [isUrlModalOpen, setIsUrlModalOpen] = React.useState(false);
  const [urlModalConfig, setUrlModalConfig] = React.useState({
    url: "",
    title: "",
  });

  const handleModeChange = (path: string) => {
    router.push(path);
  };

  const handleReviewScreen = () => {
    // Show URL modal instead of opening new tab
    setUrlModalConfig({
      url: `${window.location.origin}/surveys/review/reviewer/preview`,
      title: "レビュー画面URL",
    });
    setIsUrlModalOpen(true);
  };

  const handleAnswerScreen = () => {
    // Show URL modal for answer screen
    setUrlModalConfig({
      url: `${window.location.origin}/surveys/answer`,
      title: "回答画面URL",
    });
    setIsUrlModalOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-between self-stretch w-full px-6 py-0">
        <div className="inline-flex items-center justify-end gap-2">
          <div className="inline-flex gap-2 items-center">
            <span className="font-bold text-[#138FB5] text-xs leading-8 whitespace-nowrap underline">
              モード切り替え
            </span>
          </div>

          <div className="inline-flex items-center">
            {modes.map((mode, index) => (
              <React.Fragment key={mode.id}>
                {index > 0 && <div className="w-1 h-0.5 bg-[#138FB5] mx-0" />}
                <button
                  className={`h-6 px-4 py-0 rounded-[20px] border-2 border-solid border-[#138fb5] inline-flex items-center gap-2 ${
                    mode.id === currentMode ? "bg-[#138FB5]" : "bg-white"
                  }`}
                  type="button"
                  onClick={() => handleModeChange(mode.path)}
                >
                  <span
                    className={`whitespace-nowrap font-bold text-xs leading-8 ${
                      mode.id === currentMode ? "text-white" : "text-[#138FB5]"
                    }`}
                  >
                    {mode.label}
                  </span>
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>

        {type !== "reviewer" && (
          <div className="flex items-center gap-2">
            <span className="text-[#138FB5] text-xs font-medium leading-6 whitespace-nowrap">
              確認URL
            </span>
            <Button
              onClick={handleReviewScreen}
              variant="outline"
              className="h-8 px-6 py-4 bg-white border border-[#60ADC2] rounded-[20px] inline-flex items-center justify-center"
            >
              <span className="font-bold text-[#60ADC2] text-sm text-center leading-6 whitespace-nowrap">
                レビュー画面
              </span>
            </Button>
            <Button
              onClick={handleAnswerScreen}
              variant="outline"
              className="h-8 px-6 py-4 bg-white border border-[#60ADC2] rounded-[20px] inline-flex items-center justify-center"
            >
              <span className="font-bold text-[#60ADC2] text-sm text-center leading-6 whitespace-nowrap">
                回答画面
              </span>
            </Button>
          </div>
        )}
      </div>

      {/* URL Modal */}
      <UrlModal
        open={isUrlModalOpen}
        onOpenChange={setIsUrlModalOpen}
        url={urlModalConfig.url}
        title={urlModalConfig.title}
      />
    </>
  );
};
