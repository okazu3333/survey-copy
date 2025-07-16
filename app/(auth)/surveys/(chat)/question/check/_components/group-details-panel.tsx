import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SurveyEditSection } from "../../edit/_components/survey-edit-section";

type GroupDetailsProps = {
  groupId: string;
  onClose: () => void;
};

export const GroupDetailsPanel = ({ groupId }: GroupDetailsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const getGroupConfigRows = (id: string) => {
    switch (id) {
      case "group-1":
        return [
          { label: "区分", value: "スクリーニング調査" },
          { label: "セクション", value: "固定セクション" },
          { label: "設問数", value: "3問" },
          { label: "設問種別", value: "SA / NU", multiline: true },
          { label: "必須回答", value: "必須" },
          { label: "回答者条件", value: "全員" },
          { label: "対象外条件", value: "なし" },
          { label: "スキップ条件", value: "なし" },
          {
            label: "備考",
            value: "性別・年齢・居住地 基本属性収集",
            multiline: true,
          },
        ];
      case "group-marriage":
        return [
          { label: "区分", value: "スクリーニング調査" },
          { label: "セクション", value: "未既婚" },
          { label: "設問数", value: "1問（Q4）" },
          { label: "設問種別", value: "SA 単一選択方式", multiline: true },
          { label: "必須回答", value: "必須" },
          { label: "回答者条件", value: "全員" },
          { label: "対象外条件", value: "なし" },
          {
            label: "ジャンプ条件",
            value: "Q4_1 = Q5, Q4_2 = Q6",
            multiline: true,
          },
          { label: "備考", value: "条件分岐あり", multiline: true },
        ];
      case "group-2":
        return [
          { label: "区分", value: "スクリーニング調査" },
          { label: "セクション", value: "子どもの有無" },
          { label: "設問数", value: "1問（Q5）" },
          { label: "設問種別", value: "SA", multiline: true },
          { label: "必須回答", value: "必須" },
          { label: "回答者条件", value: "未婚者のみ" },
          { label: "対象外条件", value: "既婚者" },
          { label: "前提条件", value: "Q4 = 1（未婚）" },
          { label: "備考", value: "同居者情報", multiline: true },
        ];
      case "group-3":
        return [
          { label: "区分", value: "スクリーニング調査" },
          { label: "セクション", value: "職業" },
          { label: "設問数", value: "2問（Q6-Q7）" },
          { label: "設問種別", value: "GR グループ選択", multiline: true },
          { label: "必須回答", value: "必須" },
          { label: "回答者条件", value: "全員" },
          {
            label: "到達経路",
            value: "既婚者：Q4から直接、未婚者：Q5経由",
            multiline: true,
          },
          { label: "備考", value: "本人・家族の職業", multiline: true },
        ];
      case "group-4":
        return [
          { label: "区分", value: "本調査" },
          { label: "セクション", value: "化粧品使用状況（前半）" },
          { label: "設問数", value: "5問（Q8-Q12）" },
          { label: "設問種別", value: "SA / GR 混合形式", multiline: true },
          { label: "必須回答", value: "必須" },
          { label: "回答者条件", value: "全員" },
          { label: "対象外条件", value: "なし" },
          { label: "スキップ条件", value: "なし" },
          { label: "備考", value: "使用頻度調査", multiline: true },
        ];
      case "group-5":
        return [
          { label: "区分", value: "本調査" },
          { label: "セクション", value: "化粧品使用状況（後半）" },
          { label: "設問数", value: "3問（Q13-Q15）" },
          { label: "設問種別", value: "SA 単一選択方式", multiline: true },
          { label: "必須回答", value: "必須" },
          { label: "回答者条件", value: "全員" },
          { label: "対象外条件", value: "なし" },
          { label: "スキップ条件", value: "なし" },
          { label: "備考", value: "使用頻度調査", multiline: true },
        ];
      default:
        return [];
    }
  };

  const configRows = getGroupConfigRows(groupId);

  return (
    <Card className="w-72 shadow-lg border border-solid border-[#138fb5] bg-white">
      <CardContent className="p-4 space-y-4">
        <div className="flex flex-col w-full">
          {configRows.map((row, index) => (
            <div
              key={`config-row-${index}`}
              className="flex items-stretch gap-0 w-full border-b border-gray-200 last:border-b-0"
            >
              <div
                className={`flex w-24 items-center justify-center px-2 ${
                  row.multiline ? "py-2" : "py-1"
                } bg-[#f5f5f5] border-r border-gray-200`}
              >
                <div className="text-[12px] font-bold text-[#333333] text-center">
                  {row.label}
                </div>
              </div>

              <div
                className={`flex-1 px-3 ${
                  row.multiline ? "py-2" : "py-1"
                } flex items-center`}
              >
                <div className="text-[12px] text-[#333333]">
                  {row.value.split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < row.value.split("\n").length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full h-10 bg-white text-[#138fb5] rounded-[20px] border border-solid border-[#dcdcdc] hover:bg-gray-50">
              <span className="font-bold text-[16px]">設問を編集する</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[#333333]">
                設問編集
              </DialogTitle>
            </DialogHeader>
            <SurveyEditSection groupId={groupId} />
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};
