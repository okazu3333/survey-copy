"use client";

import { Minus, Plus } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Spreadsheet from "react-spreadsheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

// 調査票データの型定義
interface SurveyData {
  id: string;
  title: string;
  sections: SurveySection[];
}

interface SurveySection {
  id: string;
  title: string;
  questions: SurveyQuestion[];
  order: number;
}

interface SurveyQuestion {
  id: string;
  type: string;
  question: string;
  options?: string[];
  required?: boolean;
  conditions?: string;
  order: number;
  isMainSurvey?: boolean;
}

// 通常表示と同じデータ
const sampleSurveyData: SurveyData = {
  id: "survey-1",
  title: "男性化粧品調査",
  sections: [
    {
      id: "section-1",
      title: "固定セクション：性別・年齢・居住地",
      order: 1,
      questions: [
        {
          id: "Q1",
          type: "SA",
          question: "あなたの性別を教えてください。",
          required: true,
          order: 1,
        },
        {
          id: "Q2",
          type: "NU",
          question: "あなたの年齢を教えてください。",
          required: true,
          order: 2,
        },
        {
          id: "Q3",
          type: "SA",
          question: "あなたのお住まい（都道府県）を教えてください。",
          required: true,
          order: 3,
        },
      ],
    },
    {
      id: "section-2",
      title: "セクション：未既婚",
      order: 2,
      questions: [
        {
          id: "Q4",
          type: "SA",
          question: "あなたの婚姻状況を教えてください。",
          options: ["未婚", "既婚", "離婚・死別"],
          required: true,
          order: 1,
        },
      ],
    },
    {
      id: "section-3",
      title: "セクション：子どもの有無",
      order: 3,
      questions: [
        {
          id: "Q5",
          type: "MA",
          question: "あなたと同居している方をお知らせください。",
          options: ["配偶者", "子ども", "親", "その他"],
          required: false,
          order: 1,
        },
      ],
    },
    {
      id: "section-4",
      title: "セクション：職業",
      order: 4,
      questions: [
        {
          id: "Q6",
          type: "GR",
          question: "あなたの職業を教えてください。",
          required: true,
          order: 1,
        },
        {
          id: "Q7",
          type: "GR",
          question: "あなたのご家族の職業を教えてください。",
          required: true,
          order: 2,
        },
      ],
    },
    {
      id: "section-5",
      title: "セクション：男性化粧品の使用状況（使用有無、頻度）",
      order: 5,
      questions: [
        {
          id: "Q8",
          type: "SA",
          question: "あなたはどのくらいの頻度で化粧品を使用しますか？",
          options: ["毎日", "週に数回", "月に数回", "ほとんど使用しない"],
          required: true,
          order: 1,
          isMainSurvey: true,
        },
        {
          id: "Q9",
          type: "GR",
          question: "あなたが使用している化粧品の種類を教えてください。",
          required: true,
          order: 2,
          isMainSurvey: true,
        },
        {
          id: "Q10",
          type: "MA",
          question: "化粧品を購入する際に重視する要素を教えてください。",
          options: ["価格", "ブランド", "効果", "成分", "香り", "使いやすさ"],
          required: false,
          order: 3,
          isMainSurvey: true,
        },
        {
          id: "Q11",
          type: "SA",
          question: "化粧品の情報を主にどこから得ていますか？",
          options: [
            "テレビCM",
            "SNS",
            "雑誌",
            "友人・家族",
            "店舗スタッフ",
            "その他",
          ],
          required: true,
          order: 4,
          isMainSurvey: true,
        },
        {
          id: "Q12",
          type: "NU",
          question: "化粧品に月にどの程度の金額を使いますか？（円）",
          required: true,
          order: 5,
          isMainSurvey: true,
        },
      ],
    },
    {
      id: "section-6",
      title: "セクション：化粧品の購入・使用に関する意識",
      order: 6,
      questions: [
        {
          id: "Q13",
          type: "SA",
          question: "化粧品を使用する主な理由は何ですか？",
          options: [
            "肌のケア",
            "見た目の改善",
            "清潔感",
            "自信を持つため",
            "その他",
          ],
          required: true,
          order: 1,
          isMainSurvey: true,
        },
        {
          id: "Q14",
          type: "SA",
          question:
            "化粧品の使用について、周囲の人にどのように思われていると思いますか？",
          options: ["肯定的", "中立的", "否定的", "わからない"],
          required: true,
          order: 2,
          isMainSurvey: true,
        },
        {
          id: "Q15",
          type: "MA",
          question: "今後、どのような化粧品に興味がありますか？",
          options: [
            "スキンケア",
            "メイクアップ",
            "ヘアケア",
            "ボディケア",
            "香水",
            "その他",
          ],
          required: false,
          order: 3,
          isMainSurvey: true,
        },
      ],
    },
  ],
};

interface SpreadsheetViewProps {
  surveyData?: SurveyData;
}

// 列名を生成する関数（A, B, C, ... AA, AB, ...）
const getColumnName = (index: number): string => {
  let result = "";
  while (index >= 0) {
    result = String.fromCharCode(65 + (index % 26)) + result;
    index = Math.floor(index / 26) - 1;
  }
  return result;
};

export default function SpreadsheetView({
  surveyData = sampleSurveyData,
}: SpreadsheetViewProps) {
  const [data, setData] = useState<any[][]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"screening" | "main">("screening");
  const spreadsheetRef = useRef<HTMLDivElement>(null);

  // 列幅と行高さの状態
  const [columnWidths, setColumnWidths] = useState<number[]>([
    100, 100, 220, 100, 400, 280, 150, 100,
  ]);
  const [rowHeights, setRowHeights] = useState<number[]>([]);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState<"column" | "row" | null>(null);
  const [resizeIndex, setResizeIndex] = useState<number>(-1);
  const [startPos, setStartPos] = useState<number>(0);
  const [startSize, setStartSize] = useState<number>(0);

  // 調査票データをスプレッドシートデータに変換
  useEffect(() => {
    try {
      // surveyDataの検証
      if (
        !surveyData ||
        !surveyData.sections ||
        !Array.isArray(surveyData.sections)
      ) {
        setError("無効な調査データです");
        setData([]);
        return;
      }

      const spreadsheetData: any[][] = [];

      // ヘッダー行（背景色とフォントを設定）
      spreadsheetData.push([
        {
          value: "回答者設問カウント",
          className: "header-cell",
        },
        {
          value: "見積設問カウント",
          className: "header-cell",
        },
        {
          value: "セクション",
          className: "header-cell",
        },
        {
          value: "設問番号",
          className: "header-cell",
        },
        {
          value: "質問内容",
          className: "header-cell",
        },
        {
          value: "選択肢",
          className: "header-cell",
        },
        {
          value: "条件",
          className: "header-cell",
        },
      ]);

      let questionCount = 0;
      let estimatedCount = 0;

      surveyData.sections.forEach((section) => {
        // セクションの検証
        if (
          !section ||
          !section.questions ||
          !Array.isArray(section.questions)
        ) {
          console.warn("無効なセクション:", section);
          return;
        }

        // セクション区切り行（背景色を設定）
        spreadsheetData.push([
          {
            value: "設問区切り",
            className: "section-divider",
          },
          {
            value: "",
            className: "section-divider",
          },
          {
            value: section.title || "無題のセクション",
            className: "section-title",
          },
          {
            value: "",
            className: "section-divider",
          },
          {
            value: "",
            className: "section-divider",
          },
          {
            value: "",
            className: "section-divider",
          },
          {
            value: "",
            className: "section-divider",
          },
        ]);

        section.questions.forEach((question) => {
          // 設問の検証
          if (!question) {
            console.warn("無効な設問:", question);
            return;
          }

          questionCount++;
          estimatedCount++;

          // 設問行
          spreadsheetData.push([
            {
              value: questionCount.toString(),
              className: "question-count",
            },
            {
              value: estimatedCount.toString(),
              className: "question-count",
            },
            {
              value: section.title,
              className: "section-name",
            },
            {
              value: question.id,
              className: "question-id",
            },
            {
              value: question.question,
              className: question.isMainSurvey
                ? "question-content-main"
                : "question-content",
            },
            {
              value: question.options ? question.options.join(", ") : "",
              className: "question-options",
            },
            {
              value: question.conditions || "",
              className: "question-conditions",
            },
          ]);

          // 選択肢がある場合は選択肢行を追加
          if (question.options && question.options.length > 0) {
            question.options.forEach((option, index) => {
              spreadsheetData.push([
                {
                  value: "",
                  className: "choice-row",
                },
                {
                  value: "",
                  className: "choice-row",
                },
                {
                  value: "",
                  className: "choice-row",
                },
                {
                  value: "",
                  className: "choice-row",
                },
                {
                  value: "",
                  className: question.isMainSurvey
                    ? "choice-row-main"
                    : "choice-row-screening",
                },
                {
                  value: `${index + 1}. ${option}`,
                  className: "choice-item",
                },
                {
                  value: "",
                  className: "choice-row",
                },
              ]);
            });
          }
        });
      });

      setData(spreadsheetData);
    } catch (err) {
      setError("データの変換中にエラーが発生しました");
      console.error("Data conversion error:", err);
    }
  }, [surveyData]);

  // タブに応じてデータをフィルタリング
  const filteredData = useMemo(() => {
    try {
      if (!data || !Array.isArray(data) || data.length === 0) {
        return [];
      }

      if (activeTab === "screening") {
        return data.filter((row, index) => {
          if (!row || !Array.isArray(row)) return false;
          if (index === 0) return true; // ヘッダー行は常に表示
          if (row.length < 7) return true; // セクション区切り行などは表示
          // 設問内容のクラス名でスクリーニングを判定
          if (row[4]?.className === "question-content") return true;
          // 選択肢行も含める
          if (row[4]?.className === "choice-row-screening") return true;
          return false;
        });
      } else {
        return data.filter((row, index) => {
          if (!row || !Array.isArray(row)) return false;
          if (index === 0) return true; // ヘッダー行は常に表示
          if (row.length < 7) return true; // セクション区切り行などは表示
          // 設問内容のクラス名で本調査を判定
          if (row[4]?.className === "question-content-main") return true;
          // 選択肢行も含める
          if (row[4]?.className === "choice-row-main") return true;
          return false;
        });
      }
    } catch (err) {
      console.error("フィルタリングエラー:", err);
      return [];
    }
  }, [data, activeTab]);

  // フルスクリーン切り替え
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // マウスホイールによるズーム機能（React-Flow風）
  const handleWheelZoomDirect = useCallback((e: WheelEvent) => {
    e.preventDefault();

    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => {
      const newZoom = Math.max(0.1, Math.min(3.0, prev + delta));
      return Math.round(newZoom * 10) / 10; // 小数点第1位まで
    });
  }, []);

  // マウスホイールイベントリスナーの設定
  useEffect(() => {
    const spreadsheetElement = spreadsheetRef.current;
    if (spreadsheetElement) {
      spreadsheetElement.addEventListener("wheel", handleWheelZoomDirect, {
        passive: false,
      });

      return () => {
        spreadsheetElement.removeEventListener("wheel", handleWheelZoomDirect);
      };
    }
    return undefined;
  }, [handleWheelZoomDirect]);

  // フルスクリーンモーダルでのマウスホイールズーム
  const handleFullscreenWheelZoom = useCallback((e: WheelEvent) => {
    e.preventDefault();

    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => {
      const newZoom = Math.max(0.1, Math.min(3.0, prev + delta));
      return Math.round(newZoom * 10) / 10; // 小数点第1位まで
    });
  }, []);

  // フルスクリーンモーダルでのマウスホイールイベントリスナーの設定
  useEffect(() => {
    if (isFullscreen) {
      const handleWheel = (e: WheelEvent) => {
        handleFullscreenWheelZoom(e);
      };

      document.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        document.removeEventListener("wheel", handleWheel);
      };
    }
    return undefined;
  }, [isFullscreen, handleFullscreenWheelZoom]);

  // 行挿入機能
  const handleInsertRow = (rowIndex: number) => {
    try {
      const newData = [...data];
      const emptyRow = Array(7).fill({ value: "", className: "empty-row" });
      newData.splice(rowIndex + 1, 0, emptyRow);
      setData(newData);
    } catch (err) {
      console.error("Insert row error:", err);
      setError(err instanceof Error ? err.message : "Failed to insert row");
    }
  };

  // 行削除機能
  const handleDeleteRow = (rowIndex: number) => {
    try {
      if (rowIndex === 0) return; // ヘッダー行は削除不可
      const newData = [...data];
      newData.splice(rowIndex, 1);
      setData(newData);
    } catch (err) {
      console.error("Delete row error:", err);
      setError(err instanceof Error ? err.message : "Failed to delete row");
    }
  };

  // 列幅リサイズ機能
  const handleColumnResizeStart = (
    e: React.MouseEvent,
    columnIndex: number,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeType("column");
    setResizeIndex(columnIndex);
    setStartPos(e.clientX);
    setStartSize(columnWidths[columnIndex]);
  };

  const handleRowResizeStart = (e: React.MouseEvent, rowIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeType("row");
    setResizeIndex(rowIndex);
    setStartPos(e.clientY);
    setStartSize(rowHeights[rowIndex] || 25);
  };

  // リサイズ中の状態表示
  const getResizeStatus = () => {
    if (!isResizing) return null;

    if (resizeType === "column") {
      const columnName = getColumnName(resizeIndex);
      const currentWidth = columnWidths[resizeIndex];
      return `列 ${columnName}: ${Math.round(currentWidth)}px`;
    } else if (resizeType === "row") {
      const currentHeight = rowHeights[resizeIndex] || 25;
      return `行 ${resizeIndex + 1}: ${Math.round(currentHeight)}px`;
    }
    return null;
  };

  // マウスイベントのリスナーを設定
  useEffect(() => {
    if (isResizing) {
      const handleMouseMove = (e: MouseEvent) => {
        if (resizeType === "column") {
          const delta = e.clientX - startPos;
          const newWidth = Math.max(50, startSize + delta);

          setColumnWidths((prev) => {
            const newWidths = [...prev];
            newWidths[resizeIndex] = newWidth;
            return newWidths;
          });
        } else if (resizeType === "row") {
          const delta = e.clientY - startPos;
          const newHeight = Math.max(20, startSize + delta);

          setRowHeights((prev) => {
            const newHeights = [...prev];
            newHeights[resizeIndex] = newHeight;
            return newHeights;
          });
        }
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        setResizeType(null);
        setResizeIndex(-1);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
    return undefined;
  }, [isResizing, resizeType, resizeIndex, startPos, startSize]);

  // 列ラベルと行ラベルの生成
  const columnLabels = Array.from({ length: 7 }, (_, i) => getColumnName(i));
  const rowLabels = useMemo(
    () =>
      Array.from({ length: filteredData.length }, (_, i) => (i + 1).toString()),
    [filteredData.length],
  );

  // エラーが発生した場合の表示
  if (error) {
    return (
      <div className="flex flex-col items-start relative self-stretch w-full">
        <Card className="flex flex-col items-start gap-4 p-4 relative self-stretch w-full flex-[0_0_auto] bg-[#138fb5] rounded-lg">
          <div className="w-full p-6 bg-red-50 rounded-lg border border-red-200">
            <h3 className="text-red-800 font-bold mb-2">
              エラーが発生しました
            </h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              再試行
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // データが空の場合の表示
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-start relative self-stretch w-full">
        <Card className="flex flex-col items-start gap-4 p-4 relative self-stretch w-full flex-[0_0_auto] bg-[#138fb5] rounded-lg">
          <div className="w-full p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-gray-800 font-bold mb-2">データがありません</h3>
            <p className="text-gray-600">表示するデータがありません。</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start relative self-stretch w-full">
      <Card className="flex flex-col items-start gap-4 p-4 relative self-stretch w-full bg-[#138fb5] rounded-lg">
        <ScrollArea className="flex flex-col h-[580px] items-start gap-4 relative self-stretch rounded-lg">
          <div className="w-full p-6 bg-gray-50 rounded-lg">
            {/* タブUI */}
            <div className="mb-4">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("screening")}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === "screening"
                      ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  スクリーニング
                </button>
                <button
                  onClick={() => setActiveTab("main")}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === "main"
                      ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  本調査
                </button>
              </div>
            </div>

            <div className="w-full h-[600px] mb-6 overflow-hidden relative">
              {/* ズームコントロール */}
              <div className="absolute top-4 left-4 z-60 flex gap-2">
                <div className="flex items-center px-2 text-sm text-gray-600 bg-white border rounded">
                  {Math.round(zoom * 100)}%
                </div>
                <button
                  onClick={toggleFullscreen}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-md text-xs h-8 w-8 p-0"
                  title="フルスクリーン表示"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-maximize2"
                    aria-hidden="true"
                  >
                    <path d="M15 3h6v6"></path>
                    <path d="m21 3-7 7"></path>
                    <path d="m3 21 7-7"></path>
                    <path d="M9 21H3v-6"></path>
                  </svg>
                </button>
              </div>

              {/* リサイズ状態表示 */}
              {isResizing && (
                <div className="absolute top-4 right-4 z-60 bg-blue-100 border border-blue-300 rounded px-3 py-1 text-sm text-blue-800">
                  {getResizeStatus()}
                </div>
              )}

              {/* スプレッドシート */}
              <div
                ref={spreadsheetRef}
                className="w-full h-full border border-gray-200 rounded-lg overflow-auto bg-white spreadsheet-container"
                style={{
                  width: "100%",
                  height: "100%",
                  maxWidth: "100%",
                  overflow: "auto",
                }}
              >
                <div
                  style={{
                    minWidth: `${(columnWidths.reduce((sum, width) => sum + width, 0) + 60) / zoom}px`,
                    minHeight: `${600}px`,
                    width: "max-content",
                    height: "max-content",
                    overflow: "auto",
                  }}
                >
                  <div
                    className={`custom-spreadsheet ${isResizing ? "resizing" : ""}`}
                    style={{
                      width: "max-content",
                      minWidth: `${(columnWidths.reduce((sum, width) => sum + width, 0) + 60) / zoom}px`,
                      transform: `scale(${zoom})`,
                      transformOrigin: "left top",
                    }}
                    onMouseDown={(e) => {
                      const target = e.target as HTMLElement;
                      const th = target.closest("th") as HTMLTableCellElement;
                      if (th) {
                        const rect = th.getBoundingClientRect();
                        const isColumnHeader = th.cellIndex > 0;
                        const isRowHeader =
                          th.parentElement &&
                          (th.parentElement as HTMLTableRowElement).rowIndex ===
                            0;

                        // 列ヘッダーの右端8px以内でリサイズ開始
                        if (isColumnHeader && e.clientX > rect.right - 8) {
                          e.preventDefault();
                          e.stopPropagation();
                          // 単一の列のみをリサイズ
                          handleColumnResizeStart(e, th.cellIndex - 1);
                        }
                        // 行ヘッダーの下端8px以内でリサイズ開始
                        else if (isRowHeader && e.clientY > rect.bottom - 8) {
                          e.preventDefault();
                          e.stopPropagation();
                          // 単一の行のみをリサイズ
                          const rowElement =
                            th.parentElement as HTMLTableRowElement;
                          handleRowResizeStart(e, rowElement.rowIndex || 0);
                        }
                      }
                    }}
                  >
                    <Spreadsheet
                      data={filteredData}
                      onChange={setData}
                      darkMode={false}
                      columnLabels={columnLabels}
                      rowLabels={rowLabels}
                      hideRowIndicators={false}
                      hideColumnIndicators={false}
                      onSelect={(selection: any) => {
                        if (selection && selection.row !== undefined) {
                          setSelectedRow(selection.row);
                        }
                      }}
                      className="custom-spreadsheet"
                    />
                  </div>
                </div>
              </div>

              {/* 行操作ボタン */}
              {selectedRow !== null && selectedRow > 0 && (
                <div
                  className="absolute left-0 z-20"
                  style={{ top: `${(selectedRow + 1) * 25 * zoom}px` }}
                >
                  <div className="flex flex-col gap-1 bg-white border rounded shadow-lg p-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleInsertRow(selectedRow)}
                      className="h-6 w-6 p-0"
                      title="行を挿入"
                    >
                      <Plus size={12} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteRow(selectedRow)}
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                      title="行を削除"
                    >
                      <Minus size={12} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </Card>

      {/* フルスクリーンモーダル */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-2">
          <div className="bg-white rounded-lg w-full h-full max-w-[95vw] max-h-[95vh] relative shadow-2xl border-[10px] border-[#138fb5] overflow-hidden fullscreen">
            {/* ツールバー */}
            <div className="absolute top-4 left-4 z-60 flex gap-2">
              <div className="flex items-center px-2 text-sm text-gray-600 bg-white border rounded">
                {Math.round(zoom * 100)}%
              </div>
            </div>

            {/* 閉じるボタン */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 z-60 p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-md hover:bg-gray-100"
            >
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
                aria-label="閉じる"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>

            {/* フルスクリーンコンテンツ */}
            <div className="w-full h-full p-4">
              {/* タブUI */}
              <div className="mb-4">
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab("screening")}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === "screening"
                        ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    スクリーニング
                  </button>
                  <button
                    onClick={() => setActiveTab("main")}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === "main"
                        ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    本調査
                  </button>
                </div>
              </div>

              <div
                className="w-full h-full border border-gray-200 rounded-lg overflow-auto bg-white spreadsheet-container"
                style={{
                  width: "100%",
                  height: "calc(100% - 60px)",
                  maxWidth: "100%",
                  overflow: "auto",
                }}
              >
                <div
                  style={{
                    minWidth: `${(columnWidths.reduce((sum, width) => sum + width, 0) + 60) / zoom}px`,
                    minHeight: `${600}px`,
                    width: "max-content",
                    height: "max-content",
                    overflow: "auto",
                  }}
                >
                  <div
                    className={`custom-spreadsheet ${isResizing ? "resizing" : ""}`}
                    style={{
                      width: "max-content",
                      minWidth: `${(columnWidths.reduce((sum, width) => sum + width, 0) + 60) / zoom}px`,
                      transform: `scale(${zoom})`,
                      transformOrigin: "left top",
                    }}
                    onMouseDown={(e) => {
                      const target = e.target as HTMLElement;
                      const th = target.closest("th") as HTMLTableCellElement;
                      if (th) {
                        const rect = th.getBoundingClientRect();
                        const isColumnHeader = th.cellIndex > 0;
                        const isRowHeader =
                          th.parentElement &&
                          (th.parentElement as HTMLTableRowElement).rowIndex ===
                            0;

                        // 列ヘッダーの右端8px以内でリサイズ開始
                        if (isColumnHeader && e.clientX > rect.right - 8) {
                          e.preventDefault();
                          e.stopPropagation();
                          // 単一の列のみをリサイズ
                          handleColumnResizeStart(e, th.cellIndex - 1);
                        }
                        // 行ヘッダーの下端8px以内でリサイズ開始
                        else if (isRowHeader && e.clientY > rect.bottom - 8) {
                          e.preventDefault();
                          e.stopPropagation();
                          // 単一の行のみをリサイズ
                          const rowElement =
                            th.parentElement as HTMLTableRowElement;
                          handleRowResizeStart(e, rowElement.rowIndex || 0);
                        }
                      }
                    }}
                  >
                    <Spreadsheet
                      data={filteredData}
                      onChange={setData}
                      darkMode={false}
                      columnLabels={columnLabels}
                      rowLabels={rowLabels}
                      hideRowIndicators={false}
                      hideColumnIndicators={false}
                      onSelect={(selection: any) => {
                        if (selection && selection.row !== undefined) {
                          setSelectedRow(selection.row);
                        }
                      }}
                      className="custom-spreadsheet"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* カスタムCSS */}
      <style jsx>{`
          /* ヘッダーセルのスタイル */
          :global(.header-cell) {
            background-color: #4472c4 !important;
            color: white !important;
            font-weight: bold !important;
            text-align: center !important;
          }
          
          /* セクション区切り行のスタイル */
          :global(.section-divider) {
            background-color: #e7e6e6 !important;
          }
          
          /* セクションタイトルのスタイル */
          :global(.section-title) {
            background-color: #e7e6e6 !important;
            font-weight: bold !important;
            color: #333 !important;
          }
          
          /* 設問カウントのスタイル */
          :global(.question-count) {
            background-color: #d9e1f2 !important;
            text-align: center !important;
            font-weight: bold !important;
          }
          
          /* セクション名のスタイル */
          :global(.section-name) {
            background-color: #f2f2f2 !important;
            font-weight: bold !important;
          }
          
          /* 設問IDのスタイル */
          :global(.question-id) {
            background-color: #d9e1f2 !important;
            text-align: center !important;
            font-weight: bold !important;
          }
          
          /* 設問内容のスタイル */
          :global(.question-content) {
            background-color: #ffffff !important;
            font-weight: bold !important;
          }
          
          /* 本調査設問内容のスタイル */
          :global(.question-content-main) {
            background-color: #e8f5e8 !important;
            font-weight: bold !important;
          }
          
          /* 選択肢のスタイル */
          :global(.question-options) {
            background-color: #fff2cc !important;
          }
          
          /* 条件のスタイル */
          :global(.question-conditions) {
            background-color: #e1d5e7 !important;
            color: #7030a0 !important;
            font-size: 0.9em !important;
          }
          
          /* 備考のスタイル */
          :global(.question-notes) {
            background-color: #ffffff !important;
            text-align: center !important;
            font-size: 0.8em !important;
          }
          
          /* 選択肢行のスタイル */
          :global(.choice-row) {
            background-color: #f8f9fa !important;
          }
          
          /* 選択肢アイテムのスタイル */
          :global(.choice-item) {
            background-color: #fff2cc !important;
            font-style: italic !important;
            font-size: 0.9em !important;
          }
          
          /* 空の行のスタイル */
          :global(.empty-row) {
            background-color: #f9f9f9 !important;
          }

          /* カスタムスプレッドシートのスタイル */
          :global(.custom-spreadsheet) {
            width: max-content !important;
            min-width: 100% !important;
            overflow: visible !important;
            position: relative !important;
            user-select: none !important;
          }
          :global(.custom-spreadsheet .Spreadsheet__table) {
            width: max-content !important;
            min-width: 100% !important;
            table-layout: fixed !important;
          }
          :global(.custom-spreadsheet.resizing) {
            cursor: col-resize !important;
          }
          :global(.custom-spreadsheet.resizing .Spreadsheet__header) {
            user-select: none !important;
          }
          :global(.custom-spreadsheet .Spreadsheet__header:hover) {
            background-color: rgba(0, 0, 0, 0.05) !important;
          }
          :global(.custom-spreadsheet .Spreadsheet__header:active) {
            background-color: rgba(0, 0, 0, 0.1) !important;
          }

          /* スプレッドシートコンテナのスクロール設定 */
          :global(.spreadsheet-container) {
            overflow-x: scroll !important;
            overflow-y: auto !important;
            position: relative !important;
            width: 100% !important;
            max-width: 100% !important;
          }

          :global(.spreadsheet-container::-webkit-scrollbar) {
            height: 12px !important;
            width: 12px !important;
          }

          :global(.spreadsheet-container::-webkit-scrollbar-track) {
            background: #f1f1f1 !important;
            border-radius: 6px !important;
          }

          :global(.spreadsheet-container::-webkit-scrollbar-thumb) {
            background: #c1c1c1 !important;
            border-radius: 6px !important;
          }

          :global(.spreadsheet-container::-webkit-scrollbar-thumb:hover) {
            background: #a8a8a8 !important;
          }

          /* スプレッドシート本体の幅設定 */
          :global(.custom-spreadsheet) {
            width: max-content !important;
            min-width: 100% !important;
            overflow: visible !important;
            position: relative !important;
            user-select: none !important;
          }

          :global(.custom-spreadsheet .Spreadsheet__table) {
            width: max-content !important;
            min-width: 100% !important;
            table-layout: fixed !important;
          }

          /* 列幅の動的設定 */
          :global(.custom-spreadsheet .Spreadsheet__table th:nth-child(1)),
          :global(.custom-spreadsheet .Spreadsheet__table td:nth-child(1)) {
            width: 60px !important;
            min-width: 60px !important;
            max-width: 60px !important;
            flex-shrink: 0 !important;
            box-sizing: border-box !important;
          }

          :global(.custom-spreadsheet .Spreadsheet__table th:nth-child(2)),
          :global(.custom-spreadsheet .Spreadsheet__table td:nth-child(2)) {
            width: 100px !important;
            min-width: 100px !important;
            max-width: 100px !important;
            flex-shrink: 0 !important;
            box-sizing: border-box !important;
          }

          :global(.custom-spreadsheet .Spreadsheet__table th:nth-child(3)),
          :global(.custom-spreadsheet .Spreadsheet__table td:nth-child(3)) {
            width: 100px !important;
            min-width: 100px !important;
            max-width: 100px !important;
            flex-shrink: 0 !important;
            box-sizing: border-box !important;
          }

          :global(.custom-spreadsheet .Spreadsheet__table th:nth-child(4)),
          :global(.custom-spreadsheet .Spreadsheet__table td:nth-child(4)) {
            width: 220px !important;
            min-width: 220px !important;
            max-width: 220px !important;
            flex-shrink: 0 !important;
            box-sizing: border-box !important;
          }

          :global(.custom-spreadsheet .Spreadsheet__table th:nth-child(5)),
          :global(.custom-spreadsheet .Spreadsheet__table td:nth-child(5)) {
            width: 100px !important;
            min-width: 100px !important;
            max-width: 100px !important;
            flex-shrink: 0 !important;
            box-sizing: border-box !important;
          }

          :global(.custom-spreadsheet .Spreadsheet__table th:nth-child(6)),
          :global(.custom-spreadsheet .Spreadsheet__table td:nth-child(6)) {
            width: 400px !important;
            min-width: 400px !important;
            max-width: 400px !important;
            flex-shrink: 0 !important;
            box-sizing: border-box !important;
          }

          :global(.custom-spreadsheet .Spreadsheet__table th:nth-child(7)),
          :global(.custom-spreadsheet .Spreadsheet__table td:nth-child(7)) {
            width: 280px !important;
            min-width: 280px !important;
            max-width: 280px !important;
            flex-shrink: 0 !important;
            box-sizing: border-box !important;
          }

          :global(.custom-spreadsheet .Spreadsheet__table th:nth-child(8)),
          :global(.custom-spreadsheet .Spreadsheet__table td:nth-child(8)) {
            width: 150px !important;
            min-width: 150px !important;
            max-width: 150px !important;
            flex-shrink: 0 !important;
            box-sizing: border-box !important;
          }

          :global(.custom-spreadsheet .Spreadsheet__table th:nth-child(9)),
          :global(.custom-spreadsheet .Spreadsheet__table td:nth-child(9)) {
            width: 100px !important;
            min-width: 100px !important;
            max-width: 100px !important;
            flex-shrink: 0 !important;
            box-sizing: border-box !important;
          }

          /* ツールバーの表示確保 */
          :global(.absolute.top-4.left-4),
          :global(.absolute.top-4.right-4) {
            z-index: 40 !important;
            position: absolute !important;
          }

          /* フルスクリーンモーダルのZ-index設定 */
          :global(.fullscreen) {
            z-index: 50 !important;
          }

          :global(.fullscreen .absolute.top-4.left-4),
          :global(.fullscreen .absolute.top-4.right-4) {
            z-index: 60 !important;
          }

          :global(.custom-spreadsheet .Spreadsheet__table th),
          :global(.custom-spreadsheet .Spreadsheet__table td) {
            position: relative !important;
            box-sizing: border-box !important;
            padding: 4px 8px !important;
            font-size: 14px !important;
            line-height: 1.4 !important;
            word-wrap: break-word !important;
            word-break: break-word !important;
            overflow-wrap: break-word !important;
          }

          /* 特定の列でのテキスト表示の調整 */
          :global(.custom-spreadsheet .Spreadsheet__table th:nth-child(1),
                  .custom-spreadsheet .Spreadsheet__table td:nth-child(1)) {
            text-align: center !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }

          :global(.custom-spreadsheet .Spreadsheet__table th:nth-child(2),
                  .custom-spreadsheet .Spreadsheet__table td:nth-child(2)) {
            text-align: center !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }

          :global(.custom-spreadsheet .Spreadsheet__table th:nth-child(3),
                  .custom-spreadsheet .Spreadsheet__table td:nth-child(3)) {
            text-align: left !important;
            white-space: normal !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            hyphens: auto !important;
            overflow: visible !important;
          }

          :global(.custom-spreadsheet .Spreadsheet__table th:nth-child(4),
                  .custom-spreadsheet .Spreadsheet__table td:nth-child(4)) {
            text-align: center !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }

          :global(.custom-spreadsheet .Spreadsheet__table th:nth-child(5),
                  .custom-spreadsheet .Spreadsheet__table td:nth-child(5)) {
            text-align: left !important;
            white-space: normal !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            hyphens: auto !important;
            line-height: 1.3 !important;
            overflow: visible !important;
          }

          :global(.custom-spreadsheet .Spreadsheet__table th:nth-child(6),
                  .custom-spreadsheet .Spreadsheet__table td:nth-child(6)) {
            text-align: left !important;
            white-space: normal !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            hyphens: auto !important;
            line-height: 1.3 !important;
            overflow: visible !important;
          }

          :global(.custom-spreadsheet .Spreadsheet__table th:nth-child(7),
                  .custom-spreadsheet .Spreadsheet__table td:nth-child(7)) {
            text-align: left !important;
            white-space: normal !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            hyphens: auto !important;
            overflow: visible !important;
          }

          :global(.custom-spreadsheet .Spreadsheet__table th:nth-child(8),
                  .custom-spreadsheet .Spreadsheet__table td:nth-child(8)) {
            text-align: center !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }

          /* セルの高さ自動調整 */
          :global(.custom-spreadsheet .Spreadsheet__table td) {
            height: auto !important;
            min-height: 36px !important;
            max-height: none !important;
            vertical-align: top !important;
            padding: 8px 10px !important;
          }

          /* ヘッダーセルの高さ固定 */
          :global(.custom-spreadsheet .Spreadsheet__table th) {
            height: 44px !important;
            vertical-align: middle !important;
            padding: 10px 10px !important;
          }

          /* 長いテキストの表示改善 */
          :global(.custom-spreadsheet .Spreadsheet__table td .Spreadsheet__data-viewer) {
            display: block !important;
            width: 100% !important;
            height: auto !important;
            min-height: 20px !important;
            overflow: visible !important;
            word-break: break-word !important;
            line-height: 1.4 !important;
            padding: 0 !important;
          }

          /* 横スクロールバーを常時表示 */
          :global(.custom-spreadsheet) {
            overflow-x: scroll !important;
            overflow-y: auto !important;
          }

          :global(.custom-spreadsheet::-webkit-scrollbar) {
            height: 12px !important;
            width: 12px !important;
          }

          :global(.custom-spreadsheet::-webkit-scrollbar-track) {
            background: #f1f1f1 !important;
            border-radius: 6px !important;
          }

          :global(.custom-spreadsheet::-webkit-scrollbar-thumb) {
            background: #c1c1c1 !important;
            border-radius: 6px !important;
          }

          :global(.custom-spreadsheet::-webkit-scrollbar-thumb:hover) {
            background: #a8a8a8 !important;
          }

          /* フルスクリーンモードでのスプレッドシートスタイル */
          :global(.fullscreen .custom-spreadsheet .Spreadsheet__table th),
          :global(.fullscreen .custom-spreadsheet .Spreadsheet__table td) {
            padding: 6px 10px !important;
            font-size: 16px !important;
            line-height: 1.5 !important;
          }

          /* フルスクリーンモードでのテーブルレイアウト */
          :global(.fullscreen .custom-spreadsheet .Spreadsheet__table) {
            table-layout: auto !important;
            width: auto !important;
          }

          /* フルスクリーンモードでのセル幅制御 */
          :global(.fullscreen .custom-spreadsheet .Spreadsheet__table th),
          :global(.fullscreen .custom-spreadsheet .Spreadsheet__table td) {
            white-space: normal !important;
            overflow: visible !important;
            text-overflow: clip !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            hyphens: auto !important;
          }

          /* フルスクリーンモードでのセル高さ調整 */
          :global(.fullscreen .custom-spreadsheet .Spreadsheet__table td) {
            height: auto !important;
            min-height: 40px !important;
            max-height: none !important;
            vertical-align: top !important;
            padding: 8px 10px !important;
          }

          :global(.fullscreen .custom-spreadsheet .Spreadsheet__table th) {
            height: 50px !important;
            vertical-align: middle !important;
            padding: 10px 10px !important;
          }

          /* フルスクリーンモードでのテキスト表示改善 */
          :global(.fullscreen .custom-spreadsheet .Spreadsheet__table td .Spreadsheet__data-viewer) {
            display: block !important;
            width: 100% !important;
            height: auto !important;
            min-height: 24px !important;
            overflow: visible !important;
            word-break: break-word !important;
            line-height: 1.5 !important;
          }

          /* フルスクリーンモードでの横スクロールバー */
          :global(.fullscreen .custom-spreadsheet) {
            overflow-x: scroll !important;
            overflow-y: auto !important;
          }

          :global(.fullscreen .custom-spreadsheet::-webkit-scrollbar) {
            height: 16px !important;
            width: 16px !important;
          }

          :global(.fullscreen .custom-spreadsheet::-webkit-scrollbar-track) {
            background: #f1f1f1 !important;
            border-radius: 8px !important;
          }

          :global(.fullscreen .custom-spreadsheet::-webkit-scrollbar-thumb) {
            background: #c1c1c1 !important;
            border-radius: 8px !important;
          }

          :global(.fullscreen .custom-spreadsheet::-webkit-scrollbar-thumb:hover) {
            background: #a8a8a8 !important;
          }

          /* 列ヘッダーのリサイズハンドル */
          :global(.custom-spreadsheet .Spreadsheet__table th) {
            position: relative !important;
          }

          :global(.custom-spreadsheet .Spreadsheet__table th::after) {
            content: '' !important;
            position: absolute !important;
            top: 0 !important;
            right: 0 !important;
            width: 8px !important;
            height: 100% !important;
            background-color: transparent !important;
            cursor: col-resize !important;
            z-index: 10 !important;
          }

          :global(.custom-spreadsheet .Spreadsheet__table th:hover::after) {
            background-color: #007bff !important;
          }

          /* 行ヘッダーのリサイズハンドル */
          :global(.custom-spreadsheet .Spreadsheet__table th:first-child) {
            position: relative !important;
          }

          :global(.custom-spreadsheet .Spreadsheet__table th:first-child::before) {
            content: '' !important;
            position: absolute !important;
            bottom: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 8px !important;
            background-color: transparent !important;
            cursor: row-resize !important;
            z-index: 10 !important;
          }

          :global(.custom-spreadsheet .Spreadsheet__table th:first-child:hover::before) {
            background-color: #007bff !important;
          }

          /* リサイズ中のスタイル */
          :global(.custom-spreadsheet.resizing) {
            user-select: none !important;
          }

          :global(.custom-spreadsheet.resizing *::selection) {
            background: transparent !important;
          }

          /* 動的な列幅と行高さの適用 */
          ${columnWidths
            .map(
              (width, index) => `
            :global(.custom-spreadsheet .Spreadsheet__table th:nth-child(${index + 2}),
                    .custom-spreadsheet .Spreadsheet__table td:nth-child(${index + 2})) {
              width: ${width}px !important;
              min-width: ${width}px !important;
              max-width: ${width}px !important;
              box-sizing: border-box !important;
              flex-shrink: 0 !important;
            }
          `,
            )
            .join("")}

          /* 行ヘッダー（最初の列）の幅設定 */
          :global(.custom-spreadsheet .Spreadsheet__table th:first-child,
                  .custom-spreadsheet .Spreadsheet__table td:first-child) {
            width: 60px !important;
            min-width: 60px !important;
            max-width: 60px !important;
            box-sizing: border-box !important;
            flex-shrink: 0 !important;
          }

          /* テーブル全体の幅設定 */
          :global(.custom-spreadsheet .Spreadsheet__table) {
            width: max-content !important;
            min-width: ${columnWidths.reduce((sum, width) => sum + width, 0) + 60}px !important;
          }

          ${rowHeights
            .map(
              (height, index) => `
            :global(.custom-spreadsheet .Spreadsheet__table tr:nth-child(${index + 2}) th,
                    .custom-spreadsheet .Spreadsheet__table tr:nth-child(${index + 2}) td) {
              height: ${height}px !important;
              min-height: ${height}px !important;
              max-height: ${height}px !important;
            }
          `,
            )
            .join("")}

          /* フルスクリーンモードでの動的な列幅と行高さの適用 */
          ${columnWidths
            .map(
              (width, index) => `
            :global(.fullscreen .custom-spreadsheet .Spreadsheet__table th:nth-child(${index + 2}),
                    .fullscreen .custom-spreadsheet .Spreadsheet__table td:nth-child(${index + 2})) {
              width: ${width}px !important;
              min-width: ${width}px !important;
              max-width: ${width}px !important;
            }
          `,
            )
            .join("")}

          ${rowHeights
            .map(
              (height, index) => `
            :global(.fullscreen .custom-spreadsheet .Spreadsheet__table tr:nth-child(${index + 2}) th,
                    .fullscreen .custom-spreadsheet .Spreadsheet__table tr:nth-child(${index + 2}) td) {
              height: ${height}px !important;
              min-height: ${height}px !important;
              max-height: ${height}px !important;
            }
          `,
            )
            .join("")}
        `}</style>
    </div>
  );
}
