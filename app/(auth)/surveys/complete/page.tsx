"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SurveyCardHeader } from "@/components/survey-card-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const CompletePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="w-full py-6 px-4">
        <div className="max-w-[960px] mx-auto" style={{ maxWidth: '960px' }}>
                      <SurveyCardHeader
              title="調査票の確定"
              workingTitleLabel="現在作業中のタイトル"
              workingTitle=""
              currentStep={4}
              enableDefaultNavigation={true}
            />

          {/* Main Content Container */}
          <div className="flex flex-col items-center justify-center gap-6 p-6 bg-[#f4f7f9] rounded-b-lg shadow-[0px_1px_1px_0px_rgba(0,0,0,0.25)] h-[600px] max-w-[960px]" style={{ width: '960px', height: '600px', maxWidth: '960px', maxHeight: '600px' }}>
            <Card className="w-[640px] h-[200px] max-w-[960px] bg-white rounded-lg border-0 flex items-center justify-center" style={{ width: '640px', height: '200px', maxWidth: '960px' }}>
              <CardContent className="flex flex-col items-center justify-center gap-10 px-6 py-[60px] h-full">
                {/* Success Message */}
                <h1 className="text-[#333333] text-lg font-bold text-center">
                  内容を確定しました。配信設定を開始できます。
                </h1>

                {/* Action Buttons */}
                <div className="flex items-center gap-6">
                  <Button
                    asChild
                    variant="outline"
                    className="w-[240px] h-10 rounded-[20px] border-2 border-[#0f0f0f] bg-white text-[#333333] font-bold text-sm hover:bg-gray-50"
                  >
                    <Link href="/surveys">アンケート一覧に戻る</Link>
                  </Button>

                  <Button
                    asChild
                    className="w-[240px] h-10 rounded-[32px] bg-[#d96868] hover:bg-[#c35858] border-2 border-[#d96868] text-white font-bold text-sm"
                  >
                    <Link
                      href="#"
                      className="flex items-center justify-center gap-2"
                    >
                      Element Bridgeで配信を開始
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompletePage;
