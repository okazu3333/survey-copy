import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { Separator } from "@radix-ui/react-separator";
import { HelpCircle, Lock, Plus, Trash, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GripIcon } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SettingsPanel } from "@/components/common/settings-panel";

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

// Main survey sections data
const mainSurveySections = [
  {
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
      },
      {
        id: "Q12",
        type: "NU",
        typeLabel: "NU・数値回答形式",
        question: "化粧品に月にどの程度の金額を使いますか？（円）",
        options: [],
        settings: [...mainSurveySettings],
      },
    ],
  },
  {
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
      },
    ],
  },
];

// Grid pattern component for the drag handle
const GridPattern = () => (
  <div className="relative w-3 h-3">
    <div className="top-0 left-0 absolute w-1 h-1 bg-icongray rounded-sm" />
    <div className="top-0 left-2 absolute w-1 h-1 bg-icongray rounded-sm" />
    <div className="top-2 left-0 absolute w-1 h-1 bg-icongray rounded-sm" />
    <div className="top-2 left-2 absolute w-1 h-1 bg-icongray rounded-sm" />
  </div>
);

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

type SurveyEditSectionProps = {
  groupId?: string;
};

export const SurveyEditSection = ({ groupId }: SurveyEditSectionProps) => {
  const router = useRouter();

  // Function to get questions based on groupId
  const getQuestionsForGroup = (id: string) => {
    switch (id) {
      case "group-1":
        return ["Q1", "Q2", "Q3"];
      case "group-marriage":
        return ["Q4"];
      case "group-2":
        return ["Q5"];
      case "group-3":
        return ["Q6", "Q7"];
      case "group-4":
        return ["Q8", "Q9", "Q10", "Q11", "Q12"];
      case "group-5":
        return ["Q13", "Q14", "Q15"];
      default:
        return [];
    }
  };

  // Function to determine which tab the group belongs to
  const getTabForGroup = (id: string): TabType => {
    switch (id) {
      case "group-1":
      case "group-marriage":
      case "group-2":
      case "group-3":
        return "screening";
      case "group-4":
      case "group-5":
        return "main";
      default:
        return "screening";
    }
  };

  const [activeTab, setActiveTab] = useState<TabType>(
    groupId ? getTabForGroup(groupId) : "screening",
  );

  const { register, handleSubmit } = useForm<SettingsFormData>({
    defaultValues: {
      requiredAnswer: true,
      targetCondition: "全員 カテゴリ.2 - SC4 = 2",
      answerControl:
        "カテゴリ.1 - ：SC5 ≠ 2 ～ 10　に該当しない場合はアラートを表示",
      subjectCondition: "なし",
      skipCondition: "なし",
      categoryOrder: "通常",
      jumpCondition: "なし",
    },
  });

  const onSubmit = (data: SettingsFormData) => {
    console.log("Settings form submitted:", data);
  };

  const handleGoToReview = () => {
    router.push("/surveys/review/preview");
  };

  // Render screening survey content
  const renderScreeningContent = () => {
    const targetQuestions = groupId
      ? getQuestionsForGroup(groupId)
      : ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7"];

    return (
      <>
        {/* Fixed Section - Q1, Q2, Q3 */}
        {(targetQuestions.includes("Q1") ||
          targetQuestions.includes("Q2") ||
          targetQuestions.includes("Q3")) && (
          <Card className="flex flex-col items-start gap-4 px-6 py-4 relative self-stretch w-full flex-[0_0_auto] bg-[#f4f7f9] rounded-lg border border-solid border-[#dcdcdc]">
            <div className="items-center inline-flex gap-2 relative flex-[0_0_auto]">
              <GripIcon size={21} />
              <div className="relative w-fit mt-[-1.00px] font-bold text-[#333333] text-xs whitespace-nowrap">
                固定セクション：性別・年齢・居住地
              </div>
            </div>

            {/* Q1 - Gender */}
            {targetQuestions.includes("Q1") && (
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

                        <div className="w-6 h-6 cursor-pointer flex items-center justify-center">
                          <X className="w-4 h-4 text-[#556064]" />
                        </div>
                      </div>

                      <div className="flex flex-col items-center flex-[0_0_auto] relative self-stretch w-full">
                        <Separator className="h-px relative self-stretch w-full" />
                        <div className="absolute w-4 h-4 top-[-8px] left-1/2 transform -translate-x-1/2 cursor-pointer flex items-center justify-center bg-[#979BA2] rounded-full shadow-[0px_0px_8px_0px_rgba(0,0,0,0.08)]">
                          <Plus className="w-2 h-2 text-white" />
                        </div>
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

                        <div className="w-6 h-6 cursor-pointer flex items-center justify-center">
                          <X className="w-4 h-4 text-[#556064]" />
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="absolute top-[94px] left-3.5 inline-flex items-center p-1">
                    <GridPattern />
                  </div>

                  {/* 設定パネル */}
                  <div className="mt-4 w-full">
                    <SettingsPanel
                      defaultValues={{
                        requiredAnswer: true,
                        targetCondition: "全員",
                        answerControl: "なし",
                        subjectCondition: "なし",
                        skipCondition: "なし",
                        categoryOrder: "通常",
                        jumpCondition: "なし",
                      }}
                      onSave={(data) => {
                        console.log("Q1設定保存:", data);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Q2 - Age */}
            {targetQuestions.includes("Q2") && (
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

                  {/* 設定パネル */}
                  <div className="mt-4 w-full">
                    <SettingsPanel
                      defaultValues={{
                        requiredAnswer: true,
                        targetCondition: "全員",
                        answerControl: "なし",
                        subjectCondition: "なし",
                        skipCondition: "なし",
                        categoryOrder: "通常",
                        jumpCondition: "なし",
                      }}
                      onSave={(data) => {
                        console.log("Q2設定保存:", data);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Q3 - Prefecture */}
            {targetQuestions.includes("Q3") && (
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

                      <div className="flex items-center relative flex-1 grow">
                        <Select>
                          <SelectTrigger className="flex items-center justify-center gap-2.5 relative w-[104px] rounded border border-solid border-[#dcdcdc]">
                            <SelectValue className="w-fit font-normal text-[#333333] text-xs whitespace-nowrap relative mt-[-1.00px]">
                              47都道府県
                            </SelectValue>
                          </SelectTrigger>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-[42px] left-3.5 inline-flex items-center p-1">
                    <GridPattern />
                  </div>

                  {/* 設定パネル */}
                  <div className="mt-4 w-full">
                    <SettingsPanel
                      defaultValues={{
                        requiredAnswer: true,
                        targetCondition: "全員",
                        answerControl: "なし",
                        subjectCondition: "なし",
                        skipCondition: "なし",
                        categoryOrder: "通常",
                        jumpCondition: "なし",
                      }}
                      onSave={(data) => {
                        console.log("Q3設定保存:", data);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </Card>
        )}

        {/* Marriage Section - Q4 */}
        {targetQuestions.includes("Q4") && (
          <Card className="flex flex-col items-start gap-4 px-6 py-4 relative self-stretch w-full flex-[0_0_auto] bg-[#f4f7f9] rounded-lg border border-solid border-[#dcdcdc]">
            <div className="items-start inline-flex gap-2 relative flex-[0_0_auto]">
              <GripIcon size={21} />
              <div className="relative w-fit mt-[-1.00px] font-bold text-[#333333] text-xs whitespace-nowrap">
                セクション：未既婚
              </div>
            </div>

            <Card className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] bg-white rounded-lg border border-solid border-[#dcdcdc]">
              <div className="flex items-center gap-3 pl-3 pr-0 py-0 relative self-stretch w-full flex-[0_0_auto] bg-[#f5f5f5] rounded-[8px_8px_0px_0px] border border-solid border-[#dcdcdc]">
                <Checkbox className="w-4 h-4" />

                <div className="inline-flex items-center justify-center px-4 py-2 relative flex-[0_0_auto] bg-[#138fb5]">
                  <div className="relative w-fit mt-[-1.00px] font-medium text-white text-xs text-center whitespace-nowrap">
                    Q4
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
                    <div className="flex-1 font-medium text-fontdefault text-sm relative mt-[-1.00px] [font-family:'Noto_Sans_JP',Helvetica] tracking-[0] leading-6">
                      あなたは結婚していますか。
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
                  <RadioGroup className="w-full">
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
                        <div className="flex items-start gap-2.5 relative flex-1 grow">
                          <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                            未婚
                          </div>
                        </div>
                      </div>
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
                        <div className="flex items-start gap-2.5 relative flex-1 grow">
                          <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                            既婚（離別・死別含む）
                          </div>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="absolute top-[58px] left-3.5 inline-flex items-center p-1">
                  <GridPattern />
                </div>

                <div className="absolute w-4 h-4 top-[132px] left-1/2 transform -translate-x-1/2 cursor-pointer flex items-center justify-center bg-[#979BA2] rounded-full shadow-[0px_0px_8px_0px_rgba(0,0,0,0.08)]">
                  <Plus className="w-2 h-2 text-white" />
                </div>

                {/* 設定パネル */}
                <div className="mt-4 w-full">
                  <SettingsPanel
                    defaultValues={{
                      requiredAnswer: true,
                      targetCondition: "全員",
                      answerControl: "なし",
                      subjectCondition: "なし",
                      skipCondition: "なし",
                      categoryOrder: "通常",
                      jumpCondition: "なし",
                    }}
                    onSave={(data) => {
                      console.log("Q4設定保存:", data);
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </Card>
        )}

        {/* Children Section - Q5 */}
        {targetQuestions.includes("Q5") && (
          <Card className="flex flex-col items-start gap-4 px-6 py-4 relative self-stretch w-full flex-[0_0_auto] bg-[#f4f7f9] rounded-lg border border-solid border-[#dcdcdc]">
            <div className="items-start inline-flex gap-2 relative flex-[0_0_auto]">
              <GripIcon size={21} />
              <div className="relative w-fit mt-[-1.00px] font-bold text-[#333333] text-xs whitespace-nowrap">
                セクション：子どもの有無
              </div>
            </div>
            <Card className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] bg-white rounded-lg border border-solid border-[#dcdcdc]">
              <div className="flex items-center gap-3 pl-3 pr-0 py-0 relative self-stretch w-full flex-[0_0_auto] bg-[#f5f5f5] rounded-[8px_8px_0px_0px] border border-solid border-[#dcdcdc]">
                <Checkbox className="w-4 h-4" />
                <div className="inline-flex items-center justify-center px-4 py-2 relative flex-[0_0_auto] bg-[#138fb5]">
                  <div className="relative w-fit mt-[-1.00px] font-medium text-white text-xs text-center whitespace-nowrap">
                    Q5
                  </div>
                </div>
                <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
                  <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-xs text-center whitespace-nowrap">
                    MA・複数選択方式
                  </div>
                </div>
                <div className="absolute top-[3px] left-[770px] w-6 h-6 cursor-pointer flex items-center justify-center">
                  <X className="w-4 h-4 text-[#556064]" />
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
                  {childrenSection.questions[0].options.map((option) => (
                    <div
                      key={`option-${option.id}`}
                      className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]"
                    >
                      <div className="w-10 justify-end flex items-center relative">
                        <Checkbox className="w-4 h-4" />
                        <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                          <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                            {option.id}
                          </div>
                        </div>
                      </div>
                      <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                        <div className="flex items-start gap-2.5 relative flex-1 grow">
                          <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                            {option.label}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute top-[380px] left-3.5 inline-flex items-center p-1">
                  <GridPattern />
                </div>


                {/* 設定パネル */}
                <div className="mt-4 w-full">
                  <SettingsPanel
                    defaultValues={{
                      requiredAnswer: true,
                      targetCondition: "全員\nカテゴリ.2 - SC4 = 2",
                      answerControl: "カテゴリ.1 - ：SC5 ≠ 2 ～ 10　に該当しない場合はアラートを表示",
                      subjectCondition: "なし",
                      skipCondition: "なし",
                      categoryOrder: "通常",
                      jumpCondition: "なし",
                    }}
                    onSave={(data) => {
                      console.log("Q5設定保存:", data);
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </Card>
        )}

        {/* Occupation Section - Q6, Q7 */}
        {(targetQuestions.includes("Q6") || targetQuestions.includes("Q7")) && (
          <Card className="flex flex-col items-start gap-4 px-6 py-4 relative self-stretch w-full flex-[0_0_auto] bg-[#f4f7f9] rounded-lg border border-solid border-[#dcdcdc]">
            <div className="items-start inline-flex gap-2 relative flex-[0_0_auto]">
              <GripIcon size={21} />
              <div className="relative w-fit mt-[-1.00px] font-bold text-[#333333] text-xs whitespace-nowrap">
                セクション：職業
              </div>
            </div>

            {/* Q6 - Your occupation */}
            {targetQuestions.includes("Q6") && (
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
                  <div className="absolute top-[42px] left-3.5 inline-flex items-center p-1">
                    <GridPattern />
                  </div>

                  {/* 設定パネル */}
                  <div className="mt-4 w-full">
                    <SettingsPanel
                      defaultValues={{
                        requiredAnswer: true,
                        targetCondition: "全員",
                        answerControl: "なし",
                        subjectCondition: "なし",
                        skipCondition: "なし",
                        categoryOrder: "通常",
                        jumpCondition: "なし",
                      }}
                      onSave={(data) => {
                        console.log("Q6設定保存:", data);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Q7 - Family occupation */}
            {targetQuestions.includes("Q7") && (
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
                  <div className="absolute top-[42px] left-3.5 inline-flex items-center p-1">
                    <GridPattern />
                  </div>

                  {/* 設定パネル */}
                  <div className="mt-4 w-full">
                    <SettingsPanel
                      defaultValues={{
                        requiredAnswer: true,
                        targetCondition: "全員",
                        answerControl: "なし",
                        subjectCondition: "なし",
                        skipCondition: "なし",
                        categoryOrder: "通常",
                        jumpCondition: "なし",
                      }}
                      onSave={(data) => {
                        console.log("Q7設定保存:", data);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </Card>
        )}
      </>
    );
  };

  // Render main survey content
  const renderMainSurveyContent = () => {
    const targetQuestions = groupId
      ? getQuestionsForGroup(groupId)
      : ["Q8", "Q9", "Q10", "Q11", "Q12", "Q13", "Q14", "Q15"];

    return (
      <>
        {mainSurveySections.map((section, sectionIndex) => {
          const filteredQuestions = section.questions.filter((question) =>
            targetQuestions.includes(question.id),
          );

          if (filteredQuestions.length === 0) return null;

          return (
            <Card
              key={`main-section-${sectionIndex}`}
              className="flex flex-col items-start gap-4 px-6 py-4 relative self-stretch w-full flex-[0_0_auto] bg-[#f4f7f9] rounded-lg border border-solid border-[#dcdcdc]"
            >
              <div className="items-start inline-flex gap-2 relative flex-[0_0_auto]">
                <GripIcon size={21} />
                <div className="relative w-fit mt-[-1.00px] font-bold text-[#333333] text-xs whitespace-nowrap">
                  {section.title}
                </div>
              </div>

              {filteredQuestions.map((question) => (
                <Card
                  key={`question-${question.id}`}
                  className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] bg-white rounded-lg border border-solid border-[#dcdcdc]"
                >
                  <div className="flex items-center gap-3 pl-3 pr-0 py-0 relative self-stretch w-full flex-[0_0_auto] bg-[#f5f5f5] rounded-[8px_8px_0px_0px] border border-solid border-[#dcdcdc]">
                    <Checkbox className="w-4 h-4" />
                    <div className="inline-flex items-center justify-center px-4 py-2 relative flex-[0_0_auto] bg-[#138fb5]">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-white text-xs text-center whitespace-nowrap">
                        {question.id}
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
                      <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-xs text-center whitespace-nowrap">
                        {question.typeLabel}
                      </div>
                    </div>
                    <div className="absolute top-[3px] left-[770px] w-6 h-6 cursor-pointer flex items-center justify-center">
                      <X className="w-4 h-4 text-[#556064]" />
                    </div>
                  </div>

                  <CardContent className="flex flex-col items-start gap-4 pt-4 pb-6 px-12 relative self-stretch w-full">
                    <div className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]">
                      <div className="flex items-center relative flex-1 grow">
                        <div className="flex-1 font-medium text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                          {question.question}
                        </div>
                      </div>
                    </div>

                    {question.options.length > 0 && (
                      <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
                        {question.options.map((option) => (
                          <div
                            key={`option-${option.id}`}
                            className="flex items-center gap-2 relative self-stretch w-full flex-[0_0_auto]"
                          >
                            <div className="w-10 justify-end flex items-center relative">
                              <Checkbox className="w-4 h-4" />
                              <div className="flex flex-col w-6 items-center justify-center gap-2.5 relative">
                                <div className="relative w-fit mt-[-1.00px] font-medium text-[#333333] text-sm text-center whitespace-nowrap">
                                  {option.id}
                                </div>
                              </div>
                            </div>
                            <div className="px-2 py-0 flex-1 grow rounded flex items-center relative">
                              <div className="flex items-start gap-2.5 relative flex-1 grow">
                                <div className="flex-1 font-normal text-[#333333] text-sm relative mt-[-1.00px] leading-6">
                                  {option.label}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="absolute top-[380px] left-3.5 inline-flex items-center p-1">
                      <GridPattern />
                    </div>

                    {/* 設定パネル */}
                    <div className="mt-4 w-full">
                      <SettingsPanel
                        defaultValues={{
                          requiredAnswer: question.settings[0]?.isToggled || true,
                          targetCondition: question.settings[1]?.value || "全員",
                          answerControl: question.settings[2]?.value || "なし",
                          subjectCondition: question.settings[3]?.value || "なし",
                          skipCondition: question.settings[4]?.value || "なし",
                          categoryOrder: question.settings[5]?.value || "通常",
                          jumpCondition: question.settings[6]?.value || "なし",
                        }}
                        onSave={(data) => {
                          console.log(`${question.id}設定保存:`, data);
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </Card>
          );
        })}
      </>
    );
  };

  return (
    <div className="flex flex-col items-start relative self-stretch w-full">
      <div className="flex items-center justify-between w-full">
        {!groupId && (
          <TabSelectionSection
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}
      </div>
      <Card className="flex flex-col items-start gap-4 p-4 relative self-stretch w-full flex-[0_0_auto] bg-[#138fb5] rounded-lg">
        <div className="inline-flex items-start gap-1 relative flex-[0_0_auto]">
          <div className="inline-flex h-6 items-center gap-2 pl-2 pr-3 py-0 relative flex-[0_0_auto] bg-white rounded border border-solid border-white cursor-pointer">
            <Checkbox className="w-4 h-4" />
            <span className="w-fit font-bold text-[#138fb5] text-xs whitespace-nowrap relative">
              全選択・解除
            </span>
          </div>
          <div className="flex w-6 h-6 items-center justify-center gap-2 relative bg-white rounded border border-solid border-white cursor-pointer">
            <Trash className="w-5 h-5 text-[#556064]" />
          </div>
        </div>

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

      {!groupId && (
        <div className="absolute w-1 h-[230px] top-[211px] left-[870px] bg-borderdefault rounded" />
      )}
    </div>
  );
};
