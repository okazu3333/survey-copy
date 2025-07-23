"use client";

import {
  Download,
  Eye,
  FileText,
  MessageSquare,
  Plus,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// サンプルデータ（実際の実装ではAPIから取得）
const generateSampleData = () => {
  const statuses = [
    { name: "作成中", color: "bg-white text-[#4BBC80] border-[#4BBC80]" },
    { name: "レビュー待ち", color: "bg-white text-[#60ADC2] border-[#60ADC2]" },
    { name: "レビュー完了", color: "bg-[#60ADC2] text-white border-[#60ADC2]" },
    { name: "作成完了", color: "bg-[#4BBC80] text-white border-[#4BBC80]" },
    { name: "配信中", color: "bg-[#D96868] text-white border-[#D96868]" },
    { name: "配信終了", color: "bg-[#ABAEB1] text-white border-[#ABAEB1]" },
  ];

  const titles = [
    "家族構成に関する調査",
    "満足度調査",
    "顧客アンケート",
    "製品評価調査",
    "サービス利用状況調査",
    "ブランド認知度調査",
    "購買行動調査",
    "生活習慣調査",
    "健康意識調査",
    "環境意識調査",
  ];

  const creators = ["山田太郎", "佐藤花子", "田中次郎", "鈴木美咲", "高橋健一"];

  return Array.from({ length: 100 }, (_, i) => {
    const status = statuses[i % statuses.length];
    const title = titles[i % titles.length];
    const creator = creators[i % creators.length];
    const day = ((i % 30) + 1).toString().padStart(2, "0");
    const hour = (i % 24).toString().padStart(2, "0");
    const minute = (i % 60).toString().padStart(2, "0");

    return {
      id: `SRB${String(i + 1).padStart(3, "0")}`,
      title: `${title} ${i + 1}`,
      status: status.name,
      statusColor: status.color,
      createdDate: `2025/06/${day} ${hour}:${minute}`,
      updatedDate: `2025/06/${day} ${hour}:${minute}`,
      creator,
      rowColor: "bg-white",
    };
  });
};

export function SurveyListSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [allSurveys] = useState(() => generateSampleData()); // 初期化時に1回だけ実行
  const itemsPerPage = 20;
  const router = useRouter();

  const totalPages = Math.ceil(allSurveys.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSurveys = allSurveys.slice(startIndex, endIndex);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(currentSurveys.map((survey) => survey.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (surveyId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, surveyId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== surveyId));
    }
  };

  const handleDeleteSelected = () => {
    // 選択された項目の削除処理
    console.log("削除する項目:", selectedItems);
    setSelectedItems([]);
  };

  const handleDownloadResults = () => {
    // テスト結果のダウンロード処理
    console.log("テスト結果をダウンロード");
  };

  // テーブル行クリック時の遷移処理
  const handleRowClick = (
    survey: (typeof allSurveys)[number],
    event: React.MouseEvent,
  ) => {
    // クリックされた要素がインタラクティブ要素の場合は何もしない
    const tag = (event.target as HTMLElement).tagName.toLowerCase();
    if (
      tag === "button" ||
      tag === "a" ||
      tag === "input" ||
      tag === "svg" ||
      (event.target as HTMLElement).closest("button") ||
      (event.target as HTMLElement).closest("a") ||
      (event.target as HTMLElement).closest("input") ||
      (event.target as HTMLElement).closest("svg")
    ) {
      return;
    }
    if (["レビュー待ち", "レビュー完了", "作成完了"].includes(survey.status)) {
      router.push(`/surveys/review/preview`);
    } else if (survey.status === "作成中") {
      router.push(`/surveys/question/edit`);
    }
  };

  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // 全ページを表示
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      // 現在のページを中心に表示
      let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      if (start > 1) {
        items.push(1);
        if (start > 2) {
          items.push("ellipsis-start");
        }
      }

      for (let i = start; i <= end; i++) {
        items.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) {
          items.push("ellipsis-end");
        }
        items.push(totalPages);
      }
    }

    return items;
  };

  return (
    <div className="relative">
      <div className="absolute top-0 left-1 z-10 flex items-center justify-center p-6 bg-[#138fb5] text-white rounded-t-lg w-[240px] rounded-b-none h-10">
        <h2 className="text-lg font-semibold text-center">
          アンケート情報一覧
        </h2>
      </div>
      <div className="pt-10">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="mb-2">
            <p className="text-gray-700 mb-6">
              アンケート情報の一覧です。新規で作成する場合は「新規調査作成」から行えます。
            </p>

            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteSelected}
                  disabled={selectedItems.length === 0}
                  className="border-gray-300 hover:bg-gray-50 disabled:opacity-50 min-w-[140px] h-9 items-center justify-center"
                >
                  選択項目を削除
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadResults}
                  className="border-gray-300 hover:bg-gray-50 min-w-[180px] h-9 items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-1" />
                  テスト結果をダウンロード
                </Button>
              </div>
              <Button
                asChild
                className="bg-[#138fb5] hover:bg-[#0f7a9e] text-white shadow-sm min-w-[160px] h-9 items-center justify-center"
              >
                <Link href="/surveys/new">
                  <Plus className="w-4 h-4 mr-1" />
                  新規調査作成
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#75bacf] hover:bg-[#75bacf]">
                  <TableHead className="w-12 text-white">
                    <Checkbox
                      checked={
                        selectedItems.length === currentSurveys.length &&
                        currentSurveys.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="text-white font-medium">
                    調査コード
                  </TableHead>
                  <TableHead className="text-white font-medium">
                    調査タイトル
                  </TableHead>
                  <TableHead className="text-white font-medium text-center">
                    ステータス
                  </TableHead>
                  <TableHead className="text-white font-medium text-center">
                    作成日時
                  </TableHead>
                  <TableHead className="text-white font-medium text-center">
                    更新日時
                  </TableHead>
                  <TableHead className="text-white font-medium text-center">
                    作成者
                  </TableHead>
                  <TableHead className="text-white font-medium text-center w-16 whitespace-nowrap">
                    レビュー
                  </TableHead>
                  <TableHead className="text-white font-medium text-center w-16 whitespace-nowrap">
                    回答画面
                  </TableHead>
                  <TableHead className="text-white font-medium text-center w-16 whitespace-nowrap">
                    配信
                  </TableHead>
                  <TableHead className="text-white font-medium text-center w-16 whitespace-nowrap">
                    GT表
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentSurveys.map((survey) => (
                  <TableRow
                    key={survey.id}
                    className={`${selectedItems.includes(survey.id) ? "bg-[#BCD6E0]" : survey.rowColor} hover:bg-blue-50 transition-colors cursor-pointer`}
                    onClick={(e) => handleRowClick(survey, e)}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(survey.id)}
                        onCheckedChange={(checked) =>
                          handleSelectItem(survey.id, checked as boolean)
                        }
                        // チェックボックス自体のクリックイベントは選択状態の切り替えのみ
                      />
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {survey.id}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {survey.title}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={`${survey.statusColor} font-bold`}
                      >
                        {survey.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 text-center">
                      {survey.createdDate}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 text-center">
                      {survey.updatedDate}
                    </TableCell>
                    <TableCell className="text-gray-700 text-center">
                      {survey.creator}
                    </TableCell>
                    <TableCell className="text-center px-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-300 w-8 h-8 p-0 mx-auto relative z-10 transition-colors hover:bg-[#e0f2fe] focus:bg-[#bae6fd]"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push("/surveys/review/reviewer/preview");
                        }}
                        aria-label="レビュワープレビュー画面へ"
                        tabIndex={0}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-center px-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-300 hover:bg-gray-50 w-8 h-8 p-0 mx-auto"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-center px-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-300 hover:bg-gray-50 w-8 h-8 p-0 mx-auto"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-center px-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-300 hover:bg-gray-50 w-8 h-8 p-0 mx-auto"
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* ページネーション */}
          <div className="mt-10">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {generatePaginationItems().map((item, index) => (
                  <PaginationItem key={index}>
                    {item === "ellipsis-start" || item === "ellipsis-end" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        isActive={currentPage === item}
                        onClick={() => setCurrentPage(item as number)}
                        className="cursor-pointer"
                      >
                        {item}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            <div className="mt-4 text-center text-sm text-gray-600">
              {startIndex + 1} - {Math.min(endIndex, allSurveys.length)} /{" "}
              {allSurveys.length} 件
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
