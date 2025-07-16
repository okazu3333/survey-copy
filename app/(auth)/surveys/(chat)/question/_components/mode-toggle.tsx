"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";

type Mode = {
  id: string;
  label: string;
  path: string;
};

const modes: Mode[] = [
  { id: "preview", label: "一覧プレビュー", path: "/surveys/question/preview" },
  { id: "edit", label: "編集", path: "/surveys/question/edit" },
  { id: "logic", label: "ロジックチェック", path: "/surveys/question/check" },
];

type ModeToggleProps = {
  currentMode: string;
};

export const ModeToggle = ({ currentMode }: ModeToggleProps) => {
  const router = useRouter();

  const handleModeChange = (path: string) => {
    router.push(path);
  };

  const handleSaveSurvey = () => {
    router.push("/surveys/review/preview");
  };

  return (
    <div className="flex items-center justify-between self-stretch w-full px-6 py-0">
      <div className="inline-flex items-center justify-end gap-2">
        <div className="inline-flex gap-2 items-center">
          <span className="font-medium text-[#138FB5] text-xs leading-8 whitespace-nowrap">
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

      <Button
        onClick={handleSaveSurvey}
        className="h-10 px-6 py-4 bg-[#556064] rounded-[20px] inline-flex items-center justify-center gap-4"
      >
        <span className="font-bold text-white text-base text-center leading-6 whitespace-nowrap">
          調査票を保存する
        </span>
      </Button>
    </div>
  );
};
