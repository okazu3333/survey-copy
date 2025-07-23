/** biome-ignore-all lint/suspicious/noExplicitAny: so many any */

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { Separator } from "@radix-ui/react-separator";
import { HelpCircle, Lock, Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Data for children section settings (screening) - 編集画面と同期
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

// Data for main survey section settings - 編集画面と同期
const mainSurveySettings = [
  { label: "必須回答", value: "必須オン", isToggled: true },
  { label: "回答者条件", value: "全員" },
  { label: "回答制御", value: "なし" },
  { label: "対象者条件", value: "なし" },
  { label: "スキップ条件", value: "なし" },
  { label: "カテゴリ表示順", value: "通常" },
  { label: "ジャンプ条件", value: "なし" },
];

// GridPattern component from edit section
const GridPattern = () => (
  <svg
    width="100%"
    height="100%"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute inset-0 h-full w-full"
  >
    <defs>
      <pattern
        id="grid"
        width="8"
        height="8"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M 8 0 L 0 0 0 8"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);

// Data for screening survey questions (編集画面と同期)
const screeningSections = [
  {
    id: "fixed",
    title: "固定セクション：性別・年齢・居住地",
    questions: [
      {
        id: "Q1",
        type: "SA",
        typeLabel: "SA・単一選択方式",
        question: "あなたの性別を教えてください。",
        options: [
          { id: 1, label: "男性" },
          { id: 2, label: "女性" },
        ],
        settings: [...childrenSectionSettings],
        required: true,
      },
      {
        id: "Q2",
        type: "NU",
        typeLabel: "NU・数値回答形式",
        question: "あなたの年齢を教えてください。",
        settings: [...childrenSectionSettings],
        required: true,
      },
      {
        id: "Q3",
        type: "SA",
        typeLabel: "SA・単一選択方式",
        question: "あなたのお住まい（都道府県）を教えてください。",
        options: [
          { id: 1, label: "47都道府県" },
        ],
        settings: [...childrenSectionSettings],
        required: true,
      },
    ],
  },
  {
    id: "marital",
    title: "セクション：未既婚",
    questions: [
      {
        id: "Q4",
        type: "SA",
        typeLabel: "SA・単一選択方式",
        question: "あなたは結婚していますか。",
        options: [
          { id: 1, label: "未婚" },
          { id: 2, label: "既婚（離別・死別含む）" },
        ],
        settings: [...childrenSectionSettings],
        required: true,
      },
    ],
  },
  {
    id: "children",
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
        required: true,
      },
    ],
  },
  {
    id: "occupation",
    title: "セクション：職業",
    questions: [
      {
        id: "Q6",
        type: "GR",
        typeLabel: "GR・グループ選択",
        question: "あなたの職業を教えてください。",
        options: [],
        settings: [...childrenSectionSettings],
        required: true,
      },
      {
        id: "Q7",
        type: "GR",
        typeLabel: "GR・グループ選択",
        question: "ご家族の職業を教えてください。",
        options: [],
        settings: [...childrenSectionSettings],
        required: true,
      },
    ],
  },
];

// Data for main survey questions (編集画面と同期)
const mainSurveySections = [
  {
    id: "cosmetics-usage-1",
    title: "セクション：男性化粧品の使用状況（使用有無、頻度）",
    questions: [
      {
        id: "Q8",
        type: "SA",
        typeLabel: "SA・単一選択方式",
        question: "あなたはどのくらいの頻度で化粧品を使用しますか？",
        options: [
          { id: 1, label: "毎日" },
          { id: 2, label: "週に数回" },
          { id: 3, label: "月に数回" },
          { id: 4, label: "ほとんど使用しない" },
        ],
        settings: [...mainSurveySettings],
        required: true,
      },
      {
        id: "Q9",
        type: "GR",
        typeLabel: "GR・グループ選択",
        question: "あなたが使用している化粧品の種類を教えてください。",
        options: [
          { id: 1, label: "スキンケア用品" },
          { id: 2, label: "洗顔料" },
          { id: 3, label: "化粧水" },
          { id: 4, label: "乳液・クリーム" },
          { id: 5, label: "日焼け止め" },
          { id: 6, label: "ヘアケア用品" },
        ],
        settings: [...mainSurveySettings],
        required: true,
      },
      {
        id: "Q10",
        type: "MA",
        typeLabel: "MA・複数選択方式",
        question: "化粧品を購入する際に重視する要素を教えてください。",
        options: [
          { id: 1, label: "価格" },
          { id: 2, label: "ブランド" },
          { id: 3, label: "効果" },
          { id: 4, label: "口コミ・評価" },
          { id: 5, label: "パッケージデザイン" },
          { id: 6, label: "成分" },
        ],
        settings: [...mainSurveySettings],
        required: true,
      },
      {
        id: "Q11",
        type: "SA",
        typeLabel: "SA・単一選択方式",
        question: "化粧品の情報を主にどこから得ていますか？",
        options: [
          { id: 1, label: "インターネット（SNS含む）" },
          { id: 2, label: "友人・知人" },
          { id: 3, label: "店舗スタッフ" },
          { id: 4, label: "雑誌・広告" },
          { id: 5, label: "テレビ" },
        ],
        settings: [...mainSurveySettings],
        required: true,
      },
      {
        id: "Q12",
        type: "NU",
        typeLabel: "NU・数値回答形式",
        question: "化粧品に月にどの程度の金額を使いますか？（円）",
        settings: [...mainSurveySettings],
        required: true,
      },
    ],
  },
  {
    id: "cosmetics-usage-2",
    title: "セクション：化粧品ブランドの認知・購入意向",
    questions: [
      {
        id: "Q13",
        type: "SA",
        typeLabel: "SA・単一選択方式",
        question: "最も信頼している化粧品ブランドを教えてください。",
        options: [
          { id: 1, label: "資生堂" },
          { id: 2, label: "花王" },
          { id: 3, label: "ユニリーバ" },
          { id: 4, label: "ロレアル" },
          { id: 5, label: "その他" },
        ],
        settings: [...mainSurveySettings],
        required: true,
      },
      {
        id: "Q14",
        type: "GR",
        typeLabel: "GR・グループ選択",
        question: "今後使用してみたい化粧品カテゴリを教えてください。",
        options: [
          { id: 1, label: "アンチエイジング製品" },
          { id: 2, label: "ニキビケア製品" },
          { id: 3, label: "美白製品" },
          { id: 4, label: "保湿製品" },
          { id: 5, label: "UV対策製品" },
          { id: 6, label: "メイクアップ製品" },
        ],
        settings: [...mainSurveySettings],
        required: true,
      },
      {
        id: "Q15",
        type: "MA",
        typeLabel: "MA・複数選択方式",
        question: "化粧品を購入する場所を教えてください。",
        options: [
          { id: 1, label: "ドラッグストア" },
          { id: 2, label: "デパート・百貨店" },
          { id: 3, label: "オンラインショップ" },
          { id: 4, label: "コンビニエンスストア" },
          { id: 5, label: "専門店" },
          { id: 6, label: "ディスカウントストア" },
        ],
        settings: [...mainSurveySettings],
        required: true,
      },
    ],
  },
];

type TabType = "screening" | "main";

type QuestionFormData = {
  Q1: string;
  Q2: string;
  Q3: string;
  Q4: string;
  Q5: string[];
  Q6: string;
  Q7: string;
  Q8: string;
  Q9: string;
  Q10: string[];
  Q11: string;
  Q12: string;
  Q13: string;
  Q14: string;
  Q15: string[];
};

// SurveySectionCard component for new data structure
const SurveySectionCard = ({ section }: { section: any }) => {
  return (
    <div className="w-full p-4 bg-white rounded-lg border">
      <h3 className="font-bold text-lg mb-4">{section.title}</h3>
      {section.questions.map((question: any) => (
        <div key={question.id} className="mb-6">
          <div className="mb-2">
            <label
              htmlFor={question.id}
              className="block text-sm font-medium mb-1"
            >
              {question.question}
            </label>
            <span className="text-xs text-gray-500">{question.typeLabel}</span>
          </div>
          
          {/* SA: 単一選択方式 */}
          {question.type === "SA" && question.options && (
            <div className="space-y-2">
              {question.options.map((option: any) => (
                <label key={option.id} className="flex items-center">
                  <input
                    type="radio"
                    name={question.id}
                    value={option.id}
                    className="mr-2"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          )}
          
          {/* MA: 複数選択方式 */}
          {question.type === "MA" && question.options && (
            <div className="space-y-2">
              {question.options.map((option: any) => (
                <label key={option.id} className="flex items-center">
                  <input 
                    type="checkbox" 
                    value={option.id} 
                    className="mr-2" 
                  />
                  {option.label}
                </label>
              ))}
            </div>
          )}
          
          {/* GR: グループ選択 */}
          {question.type === "GR" && question.options && (
            <div className="space-y-2">
              {question.options.map((option: any) => (
                <label key={option.id} className="flex items-center">
                  <input
                    type="radio"
                    name={question.id}
                    value={option.id}
                    className="mr-2"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          )}
          
          {/* NU: 数値回答形式 */}
          {question.type === "NU" && (
            <input
              id={question.id}
              type="number"
              className="w-full p-2 border rounded"
              placeholder="数値を入力"
            />
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
      Q1: "",
      Q2: "",
      Q3: "",
      Q4: "",
      Q5: [],
      Q6: "",
      Q7: "",
      Q8: "",
      Q9: "",
      Q10: [],
      Q11: "",
      Q12: "",
      Q13: "",
      Q14: "",
      Q15: [],
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
      {/* 固定セクション：性別・年齢・居住地 */}
      <Card className="flex flex-col items-start gap-4 px-6 py-4 relative self-stretch w-full flex-[0_0_auto] bg-[#f4f7f9] rounded-lg border border-solid border-[#dcdcdc]">
        <div className="items-center inline-flex gap-2 relative flex-[0_0_auto]">
          <div className="relative w-fit mt-[-1.00px] font-bold text-[#333333] text-xs whitespace-nowrap">
            固定セクション：性別・年齢・居住地
          </div>
        </div>

        {/* Q1 - 性別 */}
        <Card className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] bg-white rounded-lg border border-solid border-[#dcdcdc]">
          <div className="flex items-center gap-3 pl-3 pr-0 py-0 relative self-stretch w-full flex-[0_0_auto] bg-[#f5f5f5] rounded-[8px_8px_0px_0px] border border-solid border-[#dcdcdc]">
            <Checkbox className="w-4 h-4" />

            <div className="inline-flex items-center justify-center px-4 py-2 relative flex-[0_0_auto] bg-[#138fb5]">
              <div className="relative w-fit mt-[-1.00px] font-medium text-white text-xs text-center whitespace-nowrap">
                Q1
              </div>
            </div>

            <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
              <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
                <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-xs text-center whitespace-nowrap">
                  固定設問
                </div>

                <Lock className="w-4 h-4 text-[#333333]" />
              </div>

              <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-xs text-center whitespace-nowrap">
                SA・単一選択方式
              </div>
            </div>
          </div>

          <CardContent className="flex flex-col items-start gap-4 pt-4 pb-6 px-12 relative self-stretch w-full">
            <Select>
              <SelectTrigger className="flex w-[200px] items-center justify-between pl-4 pr-2 py-1 relative flex-[0_0_auto] rounded-[3px] border border-solid border-[#dcdcdc]">
                <div className="inline-flex items-center gap-[9px] relative flex-[0_0_auto]">
                  <div className="w-10 font-bold text-[#333333] text-xs relative mt-[-1.00px]">
                    SA 単一選択方式
                  </div>

                  <SelectValue className="relative w-fit mt-[-1.00px] font-bold text-[#333333] text-xs whitespace-nowrap">
                    単一選択方式
                  </SelectValue>
                </div>
              </SelectTrigger>
            </Select>

            <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex items-center relative flex-1 grow">
                <div className="flex-1 font-medium text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                  あなたの性別を教えてください。
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
              <RadioGroup className="w-full flex flex-col gap-2">
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <RadioGroupItem
                      value="1"
                      id="gender-1"
                      className="w-4 h-4"
                    />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        1
                      </div>
                    </div>
                  </div>

                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <Input
                      defaultValue="男性"
                      className="h-6 border border-solid border-[#dcdcdc] font-normal text-[#333333] text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center flex-[0_0_auto] relative self-stretch w-full">
                  <Separator className="h-px relative self-stretch w-full" />
                </div>

                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <RadioGroupItem
                      value="2"
                      id="gender-2"
                      className="w-4 h-4"
                    />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        2
                      </div>
                    </div>
                  </div>

                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <Input
                      defaultValue="女性"
                      className="h-6 border border-solid border-[#dcdcdc] font-normal text-[#333333] text-sm"
                    />
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="absolute top-[94px] left-3.5 inline-flex items-center p-1">
              <GridPattern />
            </div>
          </CardContent>
        </Card>

        {/* Q2 - 年齢 */}
        <Card className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] bg-white rounded-lg border border-solid border-[#dcdcdc]">
          <div className="flex items-center gap-3 pl-3 pr-0 py-0 relative self-stretch w-full flex-[0_0_auto] bg-[#f5f5f5] rounded-[8px_8px_0px_0px] border border-solid border-[#dcdcdc]">
            <Checkbox className="w-4 h-4" />
            <div className="inline-flex items-center justify-center px-4 py-2 relative flex-[0_0_auto] bg-[#138fb5]">
              <div className="relative w-fit mt-[-1.00px] font-medium text-white text-xs text-center whitespace-nowrap">
                Q2
              </div>
            </div>
            <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
              <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
                <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-xs text-center whitespace-nowrap">
                  固定設問
                </div>
                <Lock className="w-4 h-4 text-[#333333]" />
              </div>
              <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-xs text-center whitespace-nowrap">
                NU・数値回答形式
              </div>
            </div>
          </div>
          <CardContent className="flex flex-col items-start gap-4 pt-4 pb-6 px-12 relative self-stretch w-full">
            <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex items-center relative flex-1 grow">
                <div className="flex-1 font-medium text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                  あなたの年齢を教えてください。
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="w-10 justify-end flex items-center relative">
                  <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                    <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                      1
                    </div>
                  </div>
                </div>

                <div className="gap-2 px-2 py-0 flex-1 grow flex items-center relative">
                  <Input className="h-6 relative w-[104px] rounded border border-solid border-[#dcdcdc]" />
                  <div className="w-fit font-normal text-[#333333] text-xs whitespace-nowrap relative mt-[-1.00px]">
                    歳
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-[42px] left-3.5 inline-flex items-center p-1">
              <GridPattern />
            </div>
          </CardContent>
        </Card>

        {/* Q3 - 都道府県 */}
        <Card className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] bg-white rounded-lg border border-solid border-[#dcdcdc]">
          <div className="flex items-center gap-3 pl-3 pr-0 py-0 relative self-stretch w-full flex-[0_0_auto] bg-[#f5f5f5] rounded-[8px_8px_0px_0px] border border-solid border-[#dcdcdc]">
            <Checkbox className="w-4 h-4" />

            <div className="inline-flex items-center justify-center px-4 py-2 relative flex-[0_0_auto] bg-[#138fb5]">
              <div className="relative w-fit mt-[-1.00px] font-medium text-white text-xs text-center whitespace-nowrap">
                Q3
              </div>
            </div>

            <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
              <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
                <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-xs text-center whitespace-nowrap">
                  固定設問
                </div>

                <Lock className="w-4 h-4 text-[#333333]" />
              </div>

              <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-xs text-center whitespace-nowrap">
                SA・単一選択方式
              </div>
            </div>
          </div>

          <CardContent className="flex flex-col items-start gap-4 pt-4 pb-6 px-12 relative self-stretch w-full">
            <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex items-center relative flex-1 grow">
                <div className="flex-1 font-medium text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                  あなたのお住まい（都道府県）を教えてください。
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex items-center gap-4 relative self-stretch w-full flex-[0_0_auto]">
                <div className="w-10 justify-end flex items-center relative">
                  <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                    <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                      1
                    </div>
                  </div>
                </div>

                <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                  <Input
                    defaultValue="47都道府県"
                    className="h-6 border border-solid border-[#dcdcdc] font-normal text-[#333333] text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="absolute top-[42px] left-3.5 inline-flex items-center p-1">
              <GridPattern />
            </div>
          </CardContent>
        </Card>
      </Card>

      {/* セクション：未既婚 */}
      <Card className="flex flex-col items-start gap-4 px-6 py-4 relative self-stretch w-full flex-[0_0_auto] bg-[#f4f7f9] rounded-lg border border-solid border-[#dcdcdc]">
        <div className="items-start inline-flex gap-2 relative flex-[0_0_auto]">
          <div className="relative w-fit mt-[-1.00px] font-bold text-[#333333] text-xs whitespace-nowrap">
            セクション：未既婚
          </div>
        </div>

        {/* Q4 - 結婚 */}
        <Card className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] bg-white rounded-lg border border-solid border-[#dcdcdc]">
          <div className="flex items-center gap-3 pl-3 pr-0 py-0 relative self-stretch w-full flex-[0_0_auto] bg-[#f5f5f5] rounded-[8px_8px_0px_0px] border border-solid border-[#dcdcdc]">
            <Checkbox className="w-4 h-4" />

            <div className="inline-flex items-center justify-center px-4 py-2 relative flex-[0_0_auto] bg-[#138fb5]">
              <div className="relative w-fit mt-[-1.00px] font-medium text-white text-xs text-center whitespace-nowrap">
                Q4
              </div>
            </div>

            <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
              <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
                <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-xs text-center whitespace-nowrap">
                  固定設問
                </div>

                <Lock className="w-4 h-4 text-[#333333]" />
              </div>

              <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-xs text-center whitespace-nowrap">
                SA・単一選択方式
              </div>
            </div>
          </div>

          <CardContent className="flex flex-col items-start gap-4 pt-4 pb-6 px-12 relative self-stretch w-full">
            <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex items-center relative flex-1 grow">
                <div className="flex-1 font-medium text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                  あなたは結婚していますか。
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
              <RadioGroup className="w-full flex flex-col gap-2">
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <RadioGroupItem
                      value="1"
                      id="marriage-1"
                      className="w-4 h-4"
                    />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        1
                      </div>
                    </div>
                  </div>

                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <Input
                      defaultValue="既婚"
                      className="h-6 border border-solid border-[#dcdcdc] font-normal text-[#333333] text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center flex-[0_0_auto] relative self-stretch w-full">
                  <Separator className="h-px relative self-stretch w-full" />
                </div>

                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <RadioGroupItem
                      value="2"
                      id="marriage-2"
                      className="w-4 h-4"
                    />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        2
                      </div>
                    </div>
                  </div>

                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <Input
                      defaultValue="未婚"
                      className="h-6 border border-solid border-[#dcdcdc] font-normal text-[#333333] text-sm"
                    />
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="absolute top-[94px] left-3.5 inline-flex items-center p-1">
              <GridPattern />
            </div>
          </CardContent>
        </Card>
      </Card>

      {/* セクション：子どもの有無 */}
      <Card className="flex flex-col items-start gap-4 px-6 py-4 relative self-stretch w-full flex-[0_0_auto] bg-[#f4f7f9] rounded-lg border border-solid border-[#dcdcdc]">
        <div className="items-start inline-flex gap-2 relative flex-[0_0_auto]">
          <div className="relative w-fit mt-[-1.00px] font-bold text-[#333333] text-xs whitespace-nowrap">
            セクション：子どもの有無
          </div>
        </div>

        {/* Q5 - 同居者 */}
        <Card className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] bg-white rounded-lg border border-solid border-[#dcdcdc]">
          <div className="flex items-center gap-3 pl-3 pr-0 py-0 relative self-stretch w-full flex-[0_0_auto] bg-[#f5f5f5] rounded-[8px_8px_0px_0px] border border-solid border-[#dcdcdc]">
            <Checkbox className="w-4 h-4" />

            <div className="inline-flex items-center justify-center px-4 py-2 relative flex-[0_0_auto] bg-[#138fb5]">
              <div className="relative w-fit mt-[-1.00px] font-medium text-white text-xs text-center whitespace-nowrap">
                Q5
              </div>
            </div>

            <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
              <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
                <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-xs text-center whitespace-nowrap">
                  固定設問
                </div>

                <Lock className="w-4 h-4 text-[#333333]" />
              </div>

              <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-xs text-center whitespace-nowrap">
                MA・複数選択方式
              </div>
            </div>
          </div>

          <CardContent className="flex flex-col items-start gap-4 pt-4 pb-6 px-12 relative self-stretch w-full">
            <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex items-center relative flex-1 grow">
                <div className="flex-1 font-medium text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                  あなたと同居している方をお知らせください。
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="w-10 justify-end flex items-center relative">
                  <Checkbox className="w-4 h-4" />
                  <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                    <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                      1
                    </div>
                  </div>
                </div>

                <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                  <Input
                    defaultValue="配偶者"
                    className="h-6 border border-solid border-[#dcdcdc] font-normal text-[#333333] text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center flex-[0_0_auto] relative self-stretch w-full">
                <Separator className="h-px relative self-stretch w-full" />
              </div>

              <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="w-10 justify-end flex items-center relative">
                  <Checkbox className="w-4 h-4" />
                  <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                    <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                      2
                    </div>
                  </div>
                </div>

                <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                  <Input
                    defaultValue="子ども"
                    className="h-6 border border-solid border-[#dcdcdc] font-normal text-[#333333] text-sm"
                  />
                </div>

                <div className="w-6 h-6 cursor-pointer flex items-center justify-center">
                  <X className="w-4 h-4 text-[#556064]" />
                </div>
              </div>

              <div className="flex flex-col items-center flex-[0_0_auto] relative self-stretch w-full">
                <Separator className="h-px relative self-stretch w-full" />
              </div>

              <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="w-10 justify-end flex items-center relative">
                  <Checkbox className="w-4 h-4" />
                  <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                    <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                      3
                    </div>
                  </div>
                </div>

                <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                  <Input
                    defaultValue="親"
                    className="h-6 border border-solid border-[#dcdcdc] font-normal text-[#333333] text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center flex-[0_0_auto] relative self-stretch w-full">
                <Separator className="h-px relative self-stretch w-full" />
              </div>

              <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="w-10 justify-end flex items-center relative">
                  <Checkbox className="w-4 h-4" />
                  <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                    <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                      4
                    </div>
                  </div>
                </div>

                <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                  <Input
                    defaultValue="一人暮らし"
                    className="h-6 border border-solid border-[#dcdcdc] font-normal text-[#333333] text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="absolute top-[146px] left-3.5 inline-flex items-center p-1">
              <GridPattern />
            </div>
          </CardContent>
        </Card>
      </Card>

      {/* セクション：職業 */}
      <Card className="flex flex-col items-start gap-4 px-6 py-4 relative self-stretch w-full flex-[0_0_auto] bg-[#f4f7f9] rounded-lg border border-solid border-[#dcdcdc]">
        <div className="items-start inline-flex gap-2 relative flex-[0_0_auto]">
          <div className="relative w-fit mt-[-1.00px] font-bold text-[#333333] text-xs whitespace-nowrap">
            セクション：職業
          </div>
        </div>

        {/* Q6 - 職業 */}
        <Card className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] bg-white rounded-lg border border-solid border-[#dcdcdc]">
          <div className="flex items-center gap-3 pl-3 pr-0 py-0 relative self-stretch w-full flex-[0_0_auto] bg-[#f5f5f5] rounded-[8px_8px_0px_0px] border border-solid border-[#dcdcdc]">
            <Checkbox className="w-4 h-4" />

            <div className="inline-flex items-center justify-center px-4 py-2 relative flex-[0_0_auto] bg-[#138fb5]">
              <div className="relative w-fit mt-[-1.00px] font-medium text-white text-xs text-center whitespace-nowrap">
                Q6
              </div>
            </div>

            <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
              <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-xs text-center whitespace-nowrap">
                GR・グループ選択
              </div>
            </div>
          </div>

          <CardContent className="flex flex-col items-start gap-4 pt-4 pb-6 px-12 relative self-stretch w-full">
            <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex items-center relative flex-1 grow">
                <div className="flex-1 font-medium text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                  あなたの職業を教えてください。
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="w-10 justify-end flex items-center relative">
                  <Checkbox className="w-4 h-4" />
                  <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                    <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                      1
                    </div>
                  </div>
                </div>
                <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                  <div className="flex items-start gap-2.5 relative flex-1 grow">
                    <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                      会社員
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="w-10 justify-end flex items-center relative">
                  <Checkbox className="w-4 h-4" />
                  <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                    <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                      2
                    </div>
                  </div>
                </div>
                <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                  <div className="flex items-start gap-2.5 relative flex-1 grow">
                    <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                      自営業
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="w-10 justify-end flex items-center relative">
                  <Checkbox className="w-4 h-4" />
                  <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                    <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                      3
                    </div>
                  </div>
                </div>
                <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                  <div className="flex items-start gap-2.5 relative flex-1 grow">
                    <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                      学生
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="w-10 justify-end flex items-center relative">
                  <Checkbox className="w-4 h-4" />
                  <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                    <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                      4
                    </div>
                  </div>
                </div>
                <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                  <div className="flex items-start gap-2.5 relative flex-1 grow">
                    <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                      主婦・主夫
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="w-10 justify-end flex items-center relative">
                  <Checkbox className="w-4 h-4" />
                  <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                    <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                      5
                    </div>
                  </div>
                </div>
                <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                  <div className="flex items-start gap-2.5 relative flex-1 grow">
                    <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                      無職
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-[380px] left-3.5 inline-flex items-center p-1">
              <GridPattern />
            </div>
          </CardContent>
        </Card>

        {/* Q7 - 家族の職業 */}
        <Card className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] bg-white rounded-lg border border-solid border-[#dcdcdc]">
          <div className="flex items-center gap-3 pl-3 pr-0 py-0 relative self-stretch w-full flex-[0_0_auto] bg-[#f5f5f5] rounded-[8px_8px_0px_0px] border border-solid border-[#dcdcdc]">
            <Checkbox className="w-4 h-4" />

            <div className="inline-flex items-center justify-center px-4 py-2 relative flex-[0_0_auto] bg-[#138fb5]">
              <div className="relative w-fit mt-[-1.00px] font-medium text-white text-xs text-center whitespace-nowrap">
                Q7
              </div>
            </div>

            <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
              <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-xs text-center whitespace-nowrap">
                GR・グループ選択
              </div>
            </div>
          </div>

          <CardContent className="flex flex-col items-start gap-4 pt-4 pb-6 px-12 relative self-stretch w-full">
            <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex items-center relative flex-1 grow">
                <div className="flex-1 font-medium text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                  ご家族の職業を教えてください。
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="w-10 justify-end flex items-center relative">
                  <Checkbox className="w-4 h-4" />
                  <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                    <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                      1
                    </div>
                  </div>
                </div>
                <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                  <div className="flex items-start gap-2.5 relative flex-1 grow">
                    <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                      会社員
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="w-10 justify-end flex items-center relative">
                  <Checkbox className="w-4 h-4" />
                  <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                    <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                      2
                    </div>
                  </div>
                </div>
                <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                  <div className="flex items-start gap-2.5 relative flex-1 grow">
                    <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                      自営業
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="w-10 justify-end flex items-center relative">
                  <Checkbox className="w-4 h-4" />
                  <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                    <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                      3
                    </div>
                  </div>
                </div>
                <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                  <div className="flex items-start gap-2.5 relative flex-1 grow">
                    <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                      学生
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="w-10 justify-end flex items-center relative">
                  <Checkbox className="w-4 h-4" />
                  <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                    <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                      4
                    </div>
                  </div>
                </div>
                <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                  <div className="flex items-start gap-2.5 relative flex-1 grow">
                    <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                      主婦・主夫
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="w-10 justify-end flex items-center relative">
                  <Checkbox className="w-4 h-4" />
                  <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                    <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                      5
                    </div>
                  </div>
                </div>
                <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                  <div className="flex items-start gap-2.5 relative flex-1 grow">
                    <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                      無職
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-[380px] left-3.5 inline-flex items-center p-1">
              <GridPattern />
            </div>
          </CardContent>
        </Card>
      </Card>
    </div>
  );

  const renderMainSurveyContent = () => (
    <div className="flex flex-col items-start gap-4 relative w-full">
      {/* 本調査セクション */}
      <div className="flex flex-col items-start gap-4 relative w-full">
        {/* セクション：男性化粧品の使用状況（使用有無、頻度） */}
        <Card className="flex flex-col items-start gap-4 px-6 py-4 relative self-stretch w-full flex-[0_0_auto] bg-[#f4f7f9] rounded-lg border border-solid border-[#dcdcdc]">
          <div className="items-start inline-flex gap-2 relative flex-[0_0_auto]">
            <div className="relative w-fit mt-[-1.00px] font-bold text-[#333333] text-xs whitespace-nowrap">
              セクション：男性化粧品の使用状況（使用有無、頻度）
            </div>
          </div>

          {/* Q8 - 化粧品使用頻度 */}
          <Card className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] bg-white rounded-lg border border-solid border-[#dcdcdc]">
            <div className="flex items-center gap-3 pl-3 pr-0 py-0 relative self-stretch w-full flex-[0_0_auto] bg-[#f5f5f5] rounded-[8px_8px_0px_0px] border border-solid border-[#dcdcdc]">
              <Checkbox className="w-4 h-4" />
              <div className="inline-flex items-center justify-center px-4 py-2 relative flex-[0_0_auto] bg-[#138fb5]">
                <div className="relative w-fit mt-[-1.00px] font-medium text-white text-xs text-center whitespace-nowrap">
                  Q8
                </div>
              </div>
              <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
                <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-xs text-center whitespace-nowrap">
                  SA・単一選択方式
                </div>
              </div>
            </div>
            <CardContent className="flex flex-col items-start gap-4 pt-4 pb-6 px-12 relative self-stretch w-full">
              <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex items-center relative flex-1 grow">
                  <div className="flex-1 font-medium text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                    あなたはどのくらいの頻度で化粧品を使用しますか？
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        1
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        毎日
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        2
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        週に数回
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        3
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        月に数回
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        4
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        ほとんど使用しない
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-[380px] left-3.5 inline-flex items-center p-1">
                <GridPattern />
              </div>
            </CardContent>
          </Card>

          {/* Q9 - 化粧品の種類 */}
          <Card className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] bg-white rounded-lg border border-solid border-[#dcdcdc]">
            <div className="flex items-center gap-3 pl-3 pr-0 py-0 relative self-stretch w-full flex-[0_0_auto] bg-[#f5f5f5] rounded-[8px_8px_0px_0px] border border-solid border-[#dcdcdc]">
              <Checkbox className="w-4 h-4" />
              <div className="inline-flex items-center justify-center px-4 py-2 relative flex-[0_0_auto] bg-[#138fb5]">
                <div className="relative w-fit mt-[-1.00px] font-medium text-white text-xs text-center whitespace-nowrap">
                  Q9
                </div>
              </div>
              <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
                <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-xs text-center whitespace-nowrap">
                  GR・グループ選択
                </div>
              </div>
            </div>
            <CardContent className="flex flex-col items-start gap-4 pt-4 pb-6 px-12 relative self-stretch w-full">
              <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex items-center relative flex-1 grow">
                  <div className="flex-1 font-medium text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                    あなたが使用している化粧品の種類を教えてください。
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        1
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        スキンケア用品
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        2
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        化粧水
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        3
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        乳液・クリーム
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        4
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        ヘアケア用品
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        5
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        日焼け止め
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-[380px] left-3.5 inline-flex items-center p-1">
                <GridPattern />
              </div>
            </CardContent>
          </Card>

          {/* Q10 - 購入時の重視要素 */}
          <Card className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] bg-white rounded-lg border border-solid border-[#dcdcdc]">
            <div className="flex items-center gap-3 pl-3 pr-0 py-0 relative self-stretch w-full flex-[0_0_auto] bg-[#f5f5f5] rounded-[8px_8px_0px_0px] border border-solid border-[#dcdcdc]">
              <Checkbox className="w-4 h-4" />
              <div className="inline-flex items-center justify-center px-4 py-2 relative flex-[0_0_auto] bg-[#138fb5]">
                <div className="relative w-fit mt-[-1.00px] font-medium text-white text-xs text-center whitespace-nowrap">
                  Q10
                </div>
              </div>
              <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
                <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-xs text-center whitespace-nowrap">
                  MA・複数選択方式
                </div>
              </div>
            </div>
            <CardContent className="flex flex-col items-start gap-4 pt-4 pb-6 px-12 relative self-stretch w-full">
              <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex items-center relative flex-1 grow">
                  <div className="flex-1 font-medium text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                    化粧品を購入する際に重視する要素を教えてください。
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        1
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        価格
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        2
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        ブランド
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        3
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        効果
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        4
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        口コミ・評価
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        5
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        パッケージデザイン
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        6
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        成分
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-[380px] left-3.5 inline-flex items-center p-1">
                <GridPattern />
              </div>
            </CardContent>
          </Card>

          {/* Q11 - 情報源 */}
          <Card className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] bg-white rounded-lg border border-solid border-[#dcdcdc]">
            <div className="flex items-center gap-3 pl-3 pr-0 py-0 relative self-stretch w-full flex-[0_0_auto] bg-[#f5f5f5] rounded-[8px_8px_0px_0px] border border-solid border-[#dcdcdc]">
              <Checkbox className="w-4 h-4" />
              <div className="inline-flex items-center justify-center px-4 py-2 relative flex-[0_0_auto] bg-[#138fb5]">
                <div className="relative w-fit mt-[-1.00px] font-medium text-white text-xs text-center whitespace-nowrap">
                  Q11
                </div>
              </div>
              <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
                <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-xs text-center whitespace-nowrap">
                  SA・単一選択方式
                </div>
              </div>
            </div>
            <CardContent className="flex flex-col items-start gap-4 pt-4 pb-6 px-12 relative self-stretch w-full">
              <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex items-center relative flex-1 grow">
                  <div className="flex-1 font-medium text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                    化粧品の情報を主にどこから得ていますか？
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        1
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        インターネット（SNS含む）
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        2
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        友人・知人
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        3
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        店舗スタッフ
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        4
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        雑誌・広告
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        5
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        テレビ
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-[380px] left-3.5 inline-flex items-center p-1">
                <GridPattern />
              </div>
            </CardContent>
          </Card>

          {/* Q12 - 月間支出額 */}
          <Card className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] bg-white rounded-lg border border-solid border-[#dcdcdc]">
            <div className="flex items-center gap-3 pl-3 pr-0 py-0 relative self-stretch w-full flex-[0_0_auto] bg-[#f5f5f5] rounded-[8px_8px_0px_0px] border border-solid border-[#dcdcdc]">
              <Checkbox className="w-4 h-4" />
              <div className="inline-flex items-center justify-center px-4 py-2 relative flex-[0_0_auto] bg-[#138fb5]">
                <div className="relative w-fit mt-[-1.00px] font-medium text-white text-xs text-center whitespace-nowrap">
                  Q12
                </div>
              </div>
              <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
                <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-xs text-center whitespace-nowrap">
                  NU・数値回答形式
                </div>
              </div>
            </div>
            <CardContent className="flex flex-col items-start gap-4 pt-4 pb-6 px-12 relative self-stretch w-full">
              <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex items-center relative flex-1 grow">
                  <div className="flex-1 font-medium text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                    化粧品に月にどの程度の金額を使いますか？（円）
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        1
                      </div>
                    </div>
                  </div>
                  <div className="gap-2 px-2 py-0 flex-1 grow flex items-center relative">
                    <Input className="h-6 relative w-[104px] rounded border border-solid border-[#dcdcdc]" />
                    <div className="w-fit font-normal text-[#333333] text-xs whitespace-nowrap relative mt-[-1.00px]">
                      円
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-[42px] left-3.5 inline-flex items-center p-1">
                <GridPattern />
              </div>
            </CardContent>
          </Card>
        </Card>

        {/* セクション：化粧品ブランドの認知・購入意向 */}
        <Card className="flex flex-col items-start gap-4 px-6 py-4 relative self-stretch w-full flex-[0_0_auto] bg-[#f4f7f9] rounded-lg border border-solid border-[#dcdcdc]">
          <div className="items-start inline-flex gap-2 relative flex-[0_0_auto]">
            <div className="relative w-fit mt-[-1.00px] font-bold text-[#333333] text-xs whitespace-nowrap">
              セクション：化粧品ブランドの認知・購入意向
            </div>
          </div>

          {/* Q13 - 信頼ブランド */}
          <Card className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] bg-white rounded-lg border border-solid border-[#dcdcdc]">
            <div className="flex items-center gap-3 pl-3 pr-0 py-0 relative self-stretch w-full flex-[0_0_auto] bg-[#f5f5f5] rounded-[8px_8px_0px_0px] border border-solid border-[#dcdcdc]">
              <Checkbox className="w-4 h-4" />
              <div className="inline-flex items-center justify-center px-4 py-2 relative flex-[0_0_auto] bg-[#138fb5]">
                <div className="relative w-fit mt-[-1.00px] font-medium text-white text-xs text-center whitespace-nowrap">
                  Q13
                </div>
              </div>
              <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
                <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-xs text-center whitespace-nowrap">
                  SA・単一選択方式
                </div>
              </div>
            </div>
            <CardContent className="flex flex-col items-start gap-4 pt-4 pb-6 px-12 relative self-stretch w-full">
              <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex items-center relative flex-1 grow">
                  <div className="flex-1 font-medium text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                    最も信頼している化粧品ブランドを教えてください。
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        1
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        資生堂
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        2
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        花王
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        3
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        ユニリーバ
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        4
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        ロレアル
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        5
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        その他
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-[380px] left-3.5 inline-flex items-center p-1">
                <GridPattern />
              </div>
            </CardContent>
          </Card>

          {/* Q14 - 使用したいカテゴリ */}
          <Card className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] bg-white rounded-lg border border-solid border-[#dcdcdc]">
            <div className="flex items-center gap-3 pl-3 pr-0 py-0 relative self-stretch w-full flex-[0_0_auto] bg-[#f5f5f5] rounded-[8px_8px_0px_0px] border border-solid border-[#dcdcdc]">
              <Checkbox className="w-4 h-4" />
              <div className="inline-flex items-center justify-center px-4 py-2 relative flex-[0_0_auto] bg-[#138fb5]">
                <div className="relative w-fit mt-[-1.00px] font-medium text-white text-xs text-center whitespace-nowrap">
                  Q14
                </div>
              </div>
              <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
                <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-xs text-center whitespace-nowrap">
                  GR・グループ選択
                </div>
              </div>
            </div>
            <CardContent className="flex flex-col items-start gap-4 pt-4 pb-6 px-12 relative self-stretch w-full">
              <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex items-center relative flex-1 grow">
                  <div className="flex-1 font-medium text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                    今後使用してみたい化粧品カテゴリを教えてください。
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        1
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        アンチエイジング製品
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        2
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        ニキビケア製品
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        3
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        美白製品
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        4
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        保湿製品
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        5
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        UV対策製品
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        6
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        メイクアップ製品
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-[380px] left-3.5 inline-flex items-center p-1">
                <GridPattern />
              </div>
            </CardContent>
          </Card>

          {/* Q15 - 購入場所 */}
          <Card className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] bg-white rounded-lg border border-solid border-[#dcdcdc]">
            <div className="flex items-center gap-3 pl-3 pr-0 py-0 relative self-stretch w-full flex-[0_0_auto] bg-[#f5f5f5] rounded-[8px_8px_0px_0px] border border-solid border-[#dcdcdc]">
              <Checkbox className="w-4 h-4" />
              <div className="inline-flex items-center justify-center px-4 py-2 relative flex-[0_0_auto] bg-[#138fb5]">
                <div className="relative w-fit mt-[-1.00px] font-medium text-white text-xs text-center whitespace-nowrap">
                  Q15
                </div>
              </div>
              <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
                <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-xs text-center whitespace-nowrap">
                  MA・複数選択方式
                </div>
              </div>
            </div>
            <CardContent className="flex flex-col items-start gap-4 pt-4 pb-6 px-12 relative self-stretch w-full">
              <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex items-center relative flex-1 grow">
                  <div className="flex-1 font-medium text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                    化粧品を購入する場所を教えてください。
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        1
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        ドラッグストア
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        2
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        デパート・百貨店
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        3
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        オンラインショップ
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        4
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        コンビニエンスストア
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        5
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        専門店
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="w-10 justify-end flex items-center relative">
                    <Checkbox className="w-4 h-4" />
                    <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                        6
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                    <div className="flex items-start gap-2.5 relative flex-1 grow">
                      <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                        ディスカウントストア
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-[380px] left-3.5 inline-flex items-center p-1">
                <GridPattern />
              </div>
            </CardContent>
          </Card>
        </Card>
      </div>
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
