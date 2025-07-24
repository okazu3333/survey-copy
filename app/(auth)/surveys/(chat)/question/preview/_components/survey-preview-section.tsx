/** biome-ignore-all lint/suspicious/noExplicitAny: so many any */

import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { Separator } from "@radix-ui/react-separator";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";

// GridPattern component from edit section
const GridPattern = () => (
  <svg
    width="100%"
    height="100%"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute inset-0 h-full w-full"
  >
    <title>Grid Pattern</title>
    <defs>
      <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
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
