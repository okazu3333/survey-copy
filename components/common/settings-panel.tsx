import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type SettingsFormData = {
  requiredAnswer: boolean;
  targetCondition: string;
  answerControl: string;
  subjectCondition: string;
  skipCondition: string;
  categoryOrder: string;
  jumpCondition: string;
};

interface SettingsPanelProps {
  defaultValues?: Partial<SettingsFormData>;
  onSave?: (data: SettingsFormData) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  defaultValues = {
    requiredAnswer: true,
    targetCondition: "全員",
    answerControl: "なし",
    subjectCondition: "なし",
    skipCondition: "なし",
    categoryOrder: "通常",
    jumpCondition: "なし",
  },
  onSave,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit } = useForm<SettingsFormData>({
    defaultValues,
  });

  const onSubmit = (data: SettingsFormData) => {
    onSave?.(data);
  };

  return (
    <div className="border border-solid border-[#dcdcdc] rounded-lg overflow-hidden">
      {/* ヘッダー部分 */}
      <div
        className="flex items-center justify-between px-4 py-2 bg-[#f5f5f5] cursor-pointer hover:bg-[#e5e5e5] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-[#333333] text-sm">設定</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-[#333333]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#333333]" />
        )}
      </div>

      {/* 設定フォーム */}
      {isOpen && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-start gap-2 px-6 py-3.5 relative self-stretch w-full flex-[0_0_auto] bg-[#f5f5f5]"
        >
          {/* 必須回答 */}
          <div className="flex items-start gap-2 relative self-stretch w-full flex-[0_0_auto] min-w-0">
            <div className="flex w-36 items-center gap-1 px-0 py-1 relative flex-shrink-0">
              <div className="inline-flex items-center gap-2 relative flex-[0_0_auto] min-w-0">
                <label
                  htmlFor="requiredAnswer"
                  className="w-fit font-medium text-[#333333] text-sm relative mt-[-1.00px] truncate"
                >
                  必須回答
                </label>
                <div className="inline-flex items-center pt-0.5 pb-0 px-0 relative flex-shrink-0">
                  <HelpCircle className="w-4 h-4 flex-shrink-0" />
                </div>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-0 py-1 relative flex-shrink-0">
              <Checkbox {...register("requiredAnswer")} className="h-4 w-4" />
              <span className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-xs text-center whitespace-nowrap">
                必須オン
              </span>
            </div>
          </div>

          {/* 回答者条件 */}
          <div className="flex items-start gap-2 relative self-stretch w-full flex-[0_0_auto] min-w-0">
            <div className="flex w-36 items-center gap-1 px-0 py-1 relative flex-shrink-0">
              <div className="inline-flex items-center gap-2 relative flex-[0_0_auto] min-w-0">
                <label
                  htmlFor="targetCondition"
                  className="w-fit font-medium text-[#333333] text-sm relative mt-[-1.00px] truncate"
                >
                  回答者条件
                </label>
                <div className="inline-flex items-center pt-0.5 pb-0 px-0 relative flex-shrink-0">
                  <HelpCircle className="w-4 h-4 flex-shrink-0" />
                </div>
              </div>
            </div>
            <div className="min-h-10 border border-solid border-[#dcdcdc] flex items-center gap-1.5 px-4 py-2 relative flex-1 bg-white rounded-sm overflow-hidden min-w-0">
              <Textarea
                {...register("targetCondition")}
                className="flex rounded-md border border-input ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full resize-none border-none p-0 bg-transparent text-sm text-[#333333] focus:ring-0 focus:outline-none min-h-0"
                rows={2}
              />
            </div>
          </div>

          {/* 回答制御 */}
          <div className="flex items-start gap-2 relative self-stretch w-full flex-[0_0_auto] min-w-0">
            <div className="flex w-36 items-center gap-1 px-0 py-1 relative flex-shrink-0">
              <div className="inline-flex items-center gap-2 relative flex-[0_0_auto] min-w-0">
                <label
                  htmlFor="answerControl"
                  className="w-fit font-medium text-[#333333] text-sm relative mt-[-1.00px] truncate"
                >
                  回答制御
                </label>
                <div className="inline-flex items-center pt-0.5 pb-0 px-0 relative flex-shrink-0">
                  <HelpCircle className="w-4 h-4 flex-shrink-0" />
                </div>
              </div>
            </div>
            <div className="min-h-10 border border-solid border-[#dcdcdc] flex items-center gap-1.5 px-4 py-2 relative flex-1 bg-white rounded-sm overflow-hidden min-w-0">
              <Textarea
                {...register("answerControl")}
                className="flex rounded-md border border-input ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full resize-none border-none p-0 bg-transparent text-sm text-[#333333] focus:ring-0 focus:outline-none min-h-0"
                rows={2}
              />
            </div>
          </div>

          {/* 対象者条件 */}
          <div className="flex items-start gap-2 relative self-stretch w-full flex-[0_0_auto] min-w-0">
            <div className="flex w-36 items-center gap-1 px-0 py-1 relative flex-shrink-0">
              <div className="inline-flex items-center gap-2 relative flex-[0_0_auto] min-w-0">
                <label
                  htmlFor="subjectCondition"
                  className="w-fit font-medium text-[#333333] text-sm relative mt-[-1.00px] truncate"
                >
                  対象者条件
                </label>
                <div className="inline-flex items-center pt-0.5 pb-0 px-0 relative flex-shrink-0">
                  <HelpCircle className="w-4 h-4 flex-shrink-0" />
                </div>
              </div>
            </div>
            <div className="h-10 border border-solid border-[#dcdcdc] flex items-center gap-1.5 px-4 py-2 relative flex-1 bg-white rounded-sm overflow-hidden min-w-0">
              <Input
                {...register("subjectCondition")}
                className="flex rounded-md border border-input ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full border-none p-0 bg-transparent text-sm text-[#333333] focus:ring-0 focus:outline-none h-auto min-w-0"
              />
            </div>
          </div>

          {/* スキップ条件 */}
          <div className="flex items-start gap-2 relative self-stretch w-full flex-[0_0_auto] min-w-0">
            <div className="flex w-36 items-center gap-1 px-0 py-1 relative flex-shrink-0">
              <div className="inline-flex items-center gap-2 relative flex-[0_0_auto] min-w-0">
                <label
                  htmlFor="skipCondition"
                  className="w-fit font-medium text-[#333333] text-sm relative mt-[-1.00px] truncate"
                >
                  スキップ条件
                </label>
                <div className="inline-flex items-center pt-0.5 pb-0 px-0 relative flex-shrink-0">
                  <HelpCircle className="w-4 h-4 flex-shrink-0" />
                </div>
              </div>
            </div>
            <div className="h-10 border border-solid border-[#dcdcdc] flex items-center gap-1.5 px-4 py-2 relative flex-1 bg-white rounded-sm overflow-hidden min-w-0">
              <Input
                {...register("skipCondition")}
                className="flex rounded-md border border-input ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full border-none p-0 bg-transparent text-sm text-[#333333] focus:ring-0 focus:outline-none h-auto min-w-0"
              />
            </div>
          </div>

          {/* カテゴリ表示順 */}
          <div className="flex items-start gap-2 relative self-stretch w-full flex-[0_0_auto] min-w-0">
            <div className="flex w-36 items-center gap-1 px-0 py-1 relative flex-shrink-0">
              <div className="inline-flex items-center gap-2 relative flex-[0_0_auto] min-w-0">
                <label
                  htmlFor="categoryOrder"
                  className="w-fit font-medium text-[#333333] text-sm relative mt-[-1.00px] truncate"
                >
                  カテゴリ表示順
                </label>
                <div className="inline-flex items-center pt-0.5 pb-0 px-0 relative flex-shrink-0">
                  <HelpCircle className="w-4 h-4 flex-shrink-0" />
                </div>
              </div>
            </div>
            <div className="h-10 border border-solid border-[#dcdcdc] flex items-center gap-1.5 px-4 py-2 relative flex-1 bg-white rounded-sm overflow-hidden min-w-0">
              <Input
                {...register("categoryOrder")}
                className="flex rounded-md border border-input ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full border-none p-0 bg-transparent text-sm text-[#333333] focus:ring-0 focus:outline-none h-auto min-w-0"
              />
            </div>
          </div>

          {/* ジャンプ条件 */}
          <div className="flex items-start gap-2 relative self-stretch w-full flex-[0_0_auto] min-w-0">
            <div className="flex w-36 items-center gap-1 px-0 py-1 relative flex-shrink-0">
              <div className="inline-flex items-center gap-2 relative flex-[0_0_auto] min-w-0">
                <label
                  htmlFor="jumpCondition"
                  className="w-fit font-medium text-[#333333] text-sm relative mt-[-1.00px] truncate"
                >
                  ジャンプ条件
                </label>
                <div className="inline-flex items-center pt-0.5 pb-0 px-0 relative flex-shrink-0">
                  <HelpCircle className="w-4 h-4 flex-shrink-0" />
                </div>
              </div>
            </div>
            <div className="min-h-10 border border-solid border-[#dcdcdc] flex items-center gap-1.5 px-4 py-2 relative flex-1 bg-white rounded-sm overflow-hidden min-w-0">
              <Textarea
                {...register("jumpCondition")}
                className="flex rounded-md border border-input ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full resize-none border-none p-0 bg-transparent text-sm text-[#333333] focus:ring-0 focus:outline-none min-h-0"
                rows={2}
              />
            </div>
          </div>

          {/* 保存ボタン */}
          <div className="flex justify-end w-full pt-2">
            <Button
              type="submit"
              className="px-4 py-2 bg-[#138fb5] text-white text-sm rounded hover:bg-[#0f7a9a]"
            >
              保存
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
