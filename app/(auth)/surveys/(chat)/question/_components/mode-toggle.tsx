"use client";

import { Play } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";

type Mode = {
  id: string;
  label: string;
  path: string;
};

const modes: Mode[] = [
  { id: "edit", label: "編集", path: "/surveys/question/edit" },
  { id: "preview", label: "一覧プレビュー", path: "/surveys/question/preview" },
  { id: "logic", label: "ロジックチェック", path: "/surveys/question/check" },
];

type ModeToggleProps = {
  currentMode: string;
  onTestExecution?: () => void;
};

export const ModeToggle = ({
  currentMode,
  onTestExecution,
}: ModeToggleProps) => {
  const router = useRouter();

  const handleModeChange = (path: string) => {
    router.push(path);
  };

  const handleSaveSurvey = () => {
    router.push("/surveys/review/preview");
  };

  const handleTestExecution = () => {
    // テスト実行のロジックを実装
    console.log("テスト実行を開始します");
    onTestExecution?.();
  };

  return (
    <div className="flex items-center justify-between self-stretch w-full py-0">
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
                className={`h-6 px-4 py-0 rounded-[20px] border-2 border-solid border-[#138fb5] inline-flex items-center justify-center gap-2 w-28 ${
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

      <div className="flex items-center gap-2">
        <Button
          onClick={handleTestExecution}
          className="h-8 px-4 py-2 bg-[#138fb5] border-2 border-[#138fb5] hover:bg-[#0f7a9e] rounded-md inline-flex items-center justify-center gap-2"
        >
          <Play className="w-3 h-3 text-white" />
          <span className="font-bold text-white text-sm text-center leading-5 whitespace-nowrap">
            テスト実行
          </span>
        </Button>
        <Button
          onClick={handleSaveSurvey}
          className="h-8 px-4 py-2 bg-[#138fb5] hover:bg-[#0f7a9e] rounded-md inline-flex items-center justify-center gap-2"
        >
          <span className="font-bold text-white text-sm text-center leading-5 whitespace-nowrap">
            調査票を保存する
          </span>
        </Button>
      </div>
    </div>
  );
};
