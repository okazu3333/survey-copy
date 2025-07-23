/** biome-ignore-all lint/suspicious/noExplicitAny: so many any */

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

// Data for screening survey questions
const screeningSections = [
  {
    id: "screening-1",
    title: "基本情報",
    questions: [
      {
        id: "q1",
        type: "text",
        label: "お名前",
        required: true,
      },
      {
        id: "q2",
        type: "email",
        label: "メールアドレス",
        required: true,
      },
    ],
  },
  {
    id: "screening-2",
    title: "スクリーニング",
    questions: [
      {
        id: "q3",
        type: "radio",
        label: "年齢",
        options: ["18-24歳", "25-34歳", "35-44歳", "45歳以上"],
        required: true,
      },
      {
        id: "q4",
        type: "checkbox",
        label: "興味のある分野",
        options: ["技術", "ビジネス", "エンターテイメント", "スポーツ"],
        required: false,
      },
    ],
  },
];

// Data for main survey questions
const mainSurveySections = [
  {
    id: "main-1",
    title: "本調査",
    questions: [
      {
        id: "q5",
        type: "radio",
        label: "満足度",
        options: ["非常に満足", "満足", "普通", "不満", "非常に不満"],
        required: true,
      },
      {
        id: "q6",
        type: "text",
        label: "改善点",
        required: false,
      },
    ],
  },
];

type TabType = "screening" | "main";

type QuestionFormData = {
  q1: string;
  q2: string;
  q3: string;
  q4: string[];
  q5: string;
  q6: string;
  q7: string;
  q8: string;
  q9: string[];
  q10: string;
  q11: string;
  q12: string;
  q13: string;
  q14: string;
  q15: string;
};

// Mock SurveySectionCard component
const SurveySectionCard = ({ section }: { section: any }) => {
  return (
    <div className="w-full p-4 bg-white rounded-lg border">
      <h3 className="font-bold text-lg mb-4">{section.title}</h3>
      {section.questions.map((question: any) => (
        <div key={question.id} className="mb-4">
          <label
            htmlFor={question.id}
            className="block text-sm font-medium mb-2"
          >
            {question.label}
          </label>
          {question.type === "text" && (
            <input
              id={question.id}
              type="text"
              className="w-full p-2 border rounded"
              placeholder="回答を入力"
            />
          )}
          {question.type === "email" && (
            <input
              id={question.id}
              type="email"
              className="w-full p-2 border rounded"
              placeholder="メールアドレスを入力"
            />
          )}
          {question.type === "radio" && (
            <div className="space-y-2">
              {question.options.map((option: string) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
          {question.type === "checkbox" && (
            <div className="space-y-2">
              {question.options.map((option: string) => (
                <label key={option} className="flex items-center">
                  <input type="checkbox" value={option} className="mr-2" />
                  {option}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Tab Selection Component
const TabSelectionSection = ({
  activeTab,
  onTabChange,
}: {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}) => {
  const tabItems = [
    { id: "screening" as TabType, label: "スクリーニング調査" },
    { id: "main" as TabType, label: "本調査" },
  ];

  return (
    <div className="ml-1">
      <div className="flex items-center gap-1">
        {tabItems.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`w-53 h-10 rounded-[8px_8px_0px_0px] px-8 py-2 flex items-center justify-center cursor-pointer transition-colors ${
              activeTab === tab.id
                ? "bg-[#138FB5] text-white font-bold text-base"
                : "bg-white text-[#138FB5] font-medium text-base border-t-2 border-r-2 border-l-2 border-[#138FB5] hover:bg-gray-50"
            }`}
          >
            <span className="text-center leading-6 font-['Noto_Sans_JP']">
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export const SurveyPreviewSection = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("screening");
  const { handleSubmit } = useForm<QuestionFormData>({
    defaultValues: {
      q1: "",
      q2: "",
      q3: "",
      q4: [],
      q5: "",
      q8: "",
      q9: [],
      q10: "",
      q11: "",
      q12: "",
      q13: "",
      q14: "",
      q15: "",
    },
  });

  const onSubmit = (data: QuestionFormData) => {
    console.log("Form submitted:", data);
  };

  const handleGoToReview = () => {
    router.push("/surveys/review/preview");
  };

  const renderScreeningContent = () => (
    <div className="flex flex-col items-start gap-4 relative w-full">
      {screeningSections.map((section) => (
        <SurveySectionCard key={section.id} section={section} />
      ))}
    </div>
  );

  const renderMainSurveyContent = () => (
    <div className="flex flex-col items-start gap-4 relative w-full">
      {mainSurveySections.map((section) => (
        <SurveySectionCard key={section.id} section={section} />
      ))}
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-start relative self-stretch w-full"
    >
      <div className="flex items-center justify-between w-full">
        <TabSelectionSection activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      <Card className="flex flex-col items-start gap-4 p-4 relative self-stretch w-full flex-[0_0_auto] bg-[#138fb5] rounded-lg">
        <ScrollArea className="flex flex-col h-[580px] items-start gap-4 relative self-stretch rounded-lg">
          {activeTab === "screening"
            ? renderScreeningContent()
            : renderMainSurveyContent()}
        </ScrollArea>
      </Card>

      {/* レビューへ進むボタンを下部に配置 */}
      <div className="flex justify-center w-full mt-6 pb-6">
        <Button
          onClick={handleGoToReview}
          className="w-[340px] h-14 bg-[#556064] rounded-[34px] flex items-center justify-center gap-4 px-4 py-0"
        >
          <span className="font-bold text-white text-base text-center tracking-[0] leading-[22.4px] font-['Noto_Sans_JP',Helvetica]">
            レビューへ進む
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-right w-[6.68px] h-[11.89px]"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </Button>
      </div>
    </form>
  );
};
