"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { GripIcon } from "@/components/ui/grip-icon";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DragDropProvider, type DraggableQuestion } from "./drag-drop-context";
import { DraggableSection } from "./draggable-section";

type TabType = "screening" | "main";

// Data for children section settings (screening)
const childrenSectionSettings = [
  { label: "必須回答", value: "必須オン", isToggled: true },
  { label: "回答者条件", value: "全員\nカテゴリ.2 - SC4 = 2" },
  {
    label: "回答制御",
    value: "カテゴリ.1 - ：SC5 ≠ 2 ～ 10　に該当しない場合はアラートを表示",
  },
  { label: "対象者条件", value: "なし" },
  { label: "スキップ条件", value: "なし" },
  { label: "カテゴリ表示順", value: "通常" },
  { label: "ジャンプ条件", value: "なし" },
];

// Data for main survey section settings
const mainSurveySettings = [
  { label: "必須回答", value: "必須オン", isToggled: true },
  { label: "回答者条件", value: "全員" },
  { label: "回答制御", value: "なし" },
  { label: "対象者条件", value: "なし" },
  { label: "スキップ条件", value: "なし" },
  { label: "カテゴリ表示順", value: "通常" },
  { label: "ジャンプ条件", value: "なし" },
];

type SettingsFormData = {
  requiredAnswer: boolean;
  targetCondition: string;
  answerControl: string;
  subjectCondition: string;
  skipCondition: string;
  categoryOrder: string;
  jumpCondition: string;
};

const childrenSection = {
  title: "セクション：子どもの有無",
  questions: [
    {
      id: "Q5",
      type: "MA",
      typeLabel: "MA・複数選択方式",
      question: "あなたと同居している方をお知らせください。",
      options: [
        { id: 1, label: "自分のみ（一人暮らし）" },
        { id: 2, label: "配偶者" },
        { id: 3, label: "こども（未就学児）" },
        { id: 4, label: "こども（小学生）" },
        { id: 5, label: "こども（中高生）" },
        { id: 6, label: "こども（高校生を除く18歳以上）" },
        { id: 7, label: "自分（配偶者）の親" },
        { id: 8, label: "自分（配偶者）の兄弟姉妹" },
        { id: 9, label: "自分（配偶者）の祖父母" },
        { id: 10, label: "その他" },
      ],
      settings: [...childrenSectionSettings],
    },
  ],
};

// 固定セクションの設問データ
const fixedQuestions: DraggableQuestion[] = [
  {
    id: "Q1",
    type: "SA",
    typeLabel: "SA・単一選択方式",
    question: "あなたの性別を教えてください。",
    options: [
      { id: 1, label: "男性" },
      { id: 2, label: "女性" },
    ],
    settings: [
      { label: "必須回答", value: "必須オン", isToggled: true },
      { label: "回答者条件", value: "全員" },
      { label: "回答制御", value: "なし" },
      { label: "対象者条件", value: "なし" },
      { label: "スキップ条件", value: "なし" },
      { label: "カテゴリ表示順", value: "通常" },
      { label: "ジャンプ条件", value: "なし" },
    ],
  },
  {
    id: "Q2",
    type: "NU",
    typeLabel: "NU・数値回答形式",
    question: "あなたの年齢を教えてください。",
    options: [],
    settings: [
      { label: "必須回答", value: "必須オン", isToggled: true },
      { label: "回答者条件", value: "全員" },
      { label: "回答制御", value: "なし" },
      { label: "対象者条件", value: "なし" },
      { label: "スキップ条件", value: "なし" },
      { label: "カテゴリ表示順", value: "通常" },
      { label: "ジャンプ条件", value: "なし" },
    ],
  },
  {
    id: "Q3",
    type: "SA",
    typeLabel: "SA・単一選択方式",
    question: "あなたの居住地を教えてください。",
    options: [
      { id: 1, label: "北海道" },
      { id: 2, label: "東北" },
      { id: 3, label: "関東" },
      { id: 4, label: "中部" },
      { id: 5, label: "関西" },
      { id: 6, label: "中国" },
      { id: 7, label: "四国" },
      { id: 8, label: "九州・沖縄" },
    ],
    settings: [
      { label: "必須回答", value: "必須オン", isToggled: true },
      { label: "回答者条件", value: "全員" },
      { label: "回答制御", value: "なし" },
      { label: "対象者条件", value: "なし" },
      { label: "スキップ条件", value: "なし" },
      { label: "カテゴリ表示順", value: "通常" },
      { label: "ジャンプ条件", value: "なし" },
    ],
  },
];

// スクリーニングセクションの設問データ
const screeningQuestions: DraggableQuestion[] = [
  {
    id: "Q4",
    type: "SA",
    typeLabel: "SA・単一選択方式",
    question: "あなたは結婚していますか。",
    options: [
      { id: 1, label: "未婚" },
      { id: 2, label: "既婚（離別・死別含む）" },
    ],
    settings: [
      { label: "必須回答", value: "必須オン", isToggled: true },
      { label: "回答者条件", value: "全員" },
      { label: "回答制御", value: "なし" },
      { label: "対象者条件", value: "なし" },
      { label: "スキップ条件", value: "なし" },
      { label: "カテゴリ表示順", value: "通常" },
      { label: "ジャンプ条件", value: "なし" },
    ],
  },
  {
    id: "Q5",
    type: "MA",
    typeLabel: "MA・複数選択方式",
    question: "あなたと同居している方をお知らせください。",
    options: [
      { id: 1, label: "自分のみ（一人暮らし）" },
      { id: 2, label: "配偶者" },
      { id: 3, label: "こども（未就学児）" },
      { id: 4, label: "こども（小学生）" },
      { id: 5, label: "こども（中高生）" },
      { id: 6, label: "こども（高校生を除く18歳以上）" },
      { id: 7, label: "自分（配偶者）の親" },
      { id: 8, label: "自分（配偶者）の兄弟姉妹" },
      { id: 9, label: "自分（配偶者）の祖父母" },
      { id: 10, label: "その他" },
    ],
    settings: [
      { label: "必須回答", value: "必須オン", isToggled: true },
      { label: "回答者条件", value: "全員\nカテゴリ.2 - SC4 = 2" },
      {
        label: "回答制御",
        value: "カテゴリ.1 - ：SC5 ≠ 2 ～ 10　に該当しない場合はアラートを表示",
      },
      { label: "対象者条件", value: "なし" },
      { label: "スキップ条件", value: "なし" },
      { label: "カテゴリ表示順", value: "通常" },
      { label: "ジャンプ条件", value: "なし" },
    ],
  },
];

const GridPattern = () => (
  <div className="w-4 h-4 bg-[#f0f0f0] border border-[#dcdcdc] rounded-sm" />
);

const TabSelectionSection = ({
  activeTab,
  onTabChange,
}: {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}) => {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between self-stretch w-full px-6 py-0">
      <div className="inline-flex items-center justify-end gap-2">
        <div className="inline-flex gap-2 items-center">
          <span className="font-medium text-[#138FB5] text-xs leading-8 whitespace-nowrap">
            モード切り替え
          </span>
        </div>

        <div className="inline-flex items-center">
          <button
            className={`h-6 px-4 py-0 rounded-[20px] border-2 border-solid border-[#138fb5] inline-flex items-center gap-2 ${
              activeTab === "screening" ? "bg-[#138FB5]" : "bg-white"
            }`}
            type="button"
            onClick={() => onTabChange("screening")}
          >
            <span
              className={`whitespace-nowrap font-bold text-xs leading-8 ${
                activeTab === "screening" ? "text-white" : "text-[#138FB5]"
              }`}
            >
              編集
            </span>
          </button>
          <div className="w-1 h-0.5 bg-[#138FB5] mx-0" />
          <button
            className={`h-6 px-4 py-0 rounded-[20px] border-2 border-solid border-[#138fb5] inline-flex items-center gap-2 ${
              activeTab === "main" ? "bg-[#138FB5]" : "bg-white"
            }`}
            type="button"
            onClick={() => onTabChange("main")}
          >
            <span
              className={`whitespace-nowrap font-bold text-xs leading-8 ${
                activeTab === "main" ? "text-white" : "text-[#138FB5]"
              }`}
            >
              一覧プレビュー
            </span>
          </button>
        </div>
      </div>

      <Button
        onClick={() => router.push("/surveys/review")}
        className="h-10 px-6 py-2 bg-[#138FB5] hover:bg-[#138FB5]/90 text-white font-bold rounded-[20px] inline-flex items-center justify-center relative"
      >
        <span className="flex-1 text-center">レビューへ進む</span>
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Button>
    </div>
  );
};

type SurveyEditSectionProps = {
  groupId?: string;
};

export const SurveyEditSection: React.FC<SurveyEditSectionProps> = ({
  groupId,
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("screening");
  const { register, handleSubmit } = useForm<SettingsFormData>();

  const getQuestionsForGroup = (id: string) => {
    const groupMap: Record<string, string[]> = {
      "group-1": ["Q1", "Q2", "Q3"],
      "group-2": ["Q4", "Q5"],
      "group-3": ["Q6", "Q7"],
    };
    return groupMap[id] || ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7"];
  };

  const getTabForGroup = (id: string): TabType => {
    const screeningGroups = ["group-1", "group-2"];
    const mainGroups = ["group-3"];

    if (screeningGroups.includes(id)) {
      return "screening";
    } else if (mainGroups.includes(id)) {
      return "main";
    }
    return "screening";
  };

  const onSubmit = (data: SettingsFormData) => {
    console.log("Form submitted:", data);
  };

  const handleGoToReview = () => {
    router.push("/surveys/review");
  };

  const renderScreeningContent = () => {
    const targetQuestions = groupId
      ? getQuestionsForGroup(groupId)
      : ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7"];

    // 固定セクションの設問をフィルタリング
    const filteredFixedQuestions = fixedQuestions.filter((question) =>
      targetQuestions.includes(question.id),
    );

    return (
      <>
        {/* Fixed Section - Q1, Q2, Q3 */}
        {filteredFixedQuestions.length > 0 && (
          <DragDropProvider initialQuestions={filteredFixedQuestions}>
            <DraggableSection
              title="固定セクション：性別・年齢・居住地"
              questions={filteredFixedQuestions}
              isFixed={true}
            />
          </DragDropProvider>
        )}

        {/* Screening Section */}
        <DragDropProvider initialQuestions={screeningQuestions}>
          <DraggableSection
            title="スクリーニングセクション"
            questions={screeningQuestions}
            isFixed={false}
          />
        </DragDropProvider>
      </>
    );
  };

  const renderMainSurveyContent = () => {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-gray-500">メイン調査の内容がここに表示されます</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-start gap-0 relative self-stretch w-full flex-[0_0_auto] bg-white">
      <TabSelectionSection activeTab={activeTab} onTabChange={setActiveTab} />

      <ScrollArea className="flex-1 w-full">
        <div className="flex flex-col items-start gap-4 p-6">
          {activeTab === "screening"
            ? renderScreeningContent()
            : renderMainSurveyContent()}
        </div>
      </ScrollArea>
    </div>
  );
};
