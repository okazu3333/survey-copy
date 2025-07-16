"use client";

import { ChevronRight, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SurveyCardHeader } from "@/components/survey-card-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type SectionFormData = {
  fixedScreeningQuestions: string[];
  screeningQuestions: string[];
  mainSurveyQuestions: string[];
};

const Page = () => {
  const router = useRouter();
  const [screeningQuestions, setScreeningQuestions] = useState([
    "未既婚",
    "子供の有無",
    "職業",
    "家族の職業",
  ]);
  const [mainSurveyQuestions, setMainSurveyQuestions] = useState([
    "男性化粧品の使用状況（使用有無、頻度）",
    "使用している化粧品の種類とブランド",
    "化粧品を使用している理由（目的や期待する効果）",
    "化粧品購入チャネル（購入方法、購入場所）",
    "化粧品に期待する改善点や要望",
    "今後も化粧品を使いたいと考えるか、その理由",
  ]);

  const fixedScreeningQuestions = ["性別", "年齢", "居住地（都道府県単位）"];

  const { handleSubmit } = useForm<SectionFormData>();

  const onSubmit = (data: SectionFormData) => {
    const finalData = {
      ...data,
      screeningQuestions,
      mainSurveyQuestions,
      fixedScreeningQuestions,
    };
    console.log(finalData);
    // Navigate to question preview page
    router.push("/surveys/question/preview");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
      <SurveyCardHeader
        workingTitle="00008　男性化粧品についての調査"
        currentStep={1}
      />
      <div className="flex flex-col w-full items-center gap-6 p-6 bg-[#ffffff] rounded-b-lg shadow-main-bg">
        {/* Header Section */}
        <header className="flex items-start justify-center gap-4 w-full">
          <div className="w-2 h-6 bg-[#60adc2]" />
          <div className="flex flex-col items-start gap-4 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#333333] whitespace-nowrap">
                セクション入力
              </h2>
            </div>
          </div>
        </header>
        <div className="flex flex-col items-start gap-2 px-6 py-0 w-full rounded overflow-hidden">
          <div className="w-full">
            <p className="text-sm font-medium text-[#333333]">
              調査票の大まかな項目（セクション）を設定してください。
            </p>
            <p className="text-sm font-medium text-[#333333]">
              スクリーニング設問・本調査設問とも、ここまでに入力した内容からあらかじめ推奨される項目が設定されます。
            </p>
            <p className="text-sm font-medium text-[#333333]">
              <span className="inline-flex items-center whitespace-nowrap">
                調査AI
                <HelpCircle className="w-5 h-5 text-gray-400" />
                と相談しながら設定することもできます
              </span>
            </p>
          </div>
        </div>
        <Card className="w-full">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                スクリーニング設問【固定】
              </h2>
              <HelpCircle className="w-5 h-5 text-gray-400" />
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2">
                {fixedScreeningQuestions.map((question, index) => (
                  <div key={index} className="text-gray-700">
                    {question}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Screening Questions */}
        <Card className="w-full">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                スクリーニング設問
              </h2>
              <HelpCircle className="w-5 h-5 text-gray-400" />
            </div>

            <div className="flex flex-col items-end gap-2 w-full">
              <div className="flex flex-row items-stretch gap-2 w-full">
                <textarea
                  value={screeningQuestions.join("\n")}
                  onChange={(e) => {
                    const questions = e.target.value
                      .split("\n")
                      .filter((q) => q.trim() !== "");
                    setScreeningQuestions(questions);
                  }}
                  className="flex items-center px-4 py-3 w-full bg-white rounded border-2 border-solid border-[#dcdcdc] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.04)] text-sm font-medium text-[#333333] placeholder:text-[#ababab] placeholder:text-base placeholder:font-normal resize-none focus:outline-none focus:border-[#138FB5] min-h-[120px]"
                  placeholder="スクリーニング設問を入力してください。新しい行で項目を区切ってください。"
                  style={{
                    fontFamily: "Noto Sans JP",
                    lineHeight: "1.714",
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Survey Questions */}
        <Card className="w-full">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                本調査設問
              </h2>
              <HelpCircle className="w-5 h-5 text-gray-400" />
            </div>

            <div className="flex flex-col items-end gap-2 w-full">
              <div className="flex flex-row items-stretch gap-2 w-full">
                <textarea
                  value={mainSurveyQuestions.join("\n")}
                  onChange={(e) => {
                    const questions = e.target.value
                      .split("\n")
                      .filter((q) => q.trim() !== "");
                    setMainSurveyQuestions(questions);
                  }}
                  className="flex items-center px-4 py-3 w-full bg-white rounded border-2 border-solid border-[#dcdcdc] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.04)] text-sm font-medium text-[#333333] placeholder:text-[#ababab] placeholder:text-base placeholder:font-normal resize-none focus:outline-none focus:border-[#138FB5] min-h-[180px]"
                  placeholder="本調査設問を入力してください。新しい行で項目を区切ってください。"
                  style={{
                    fontFamily: "Noto Sans JP",
                    lineHeight: "1.714",
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="flex justify-center pt-6">
          <Button
            type="submit"
            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 h-14 rounded-full text-lg"
            size="lg"
          >
            調査票設問の設定に進む
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Page;
