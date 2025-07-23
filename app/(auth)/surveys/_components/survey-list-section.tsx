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
import { type Project, useTableNavigation } from "@/hooks/use-table-navigation";

// サンプルデータ（実際の実装ではAPIから取得）
const generateSampleData = (): Project[] => {
  const statuses: Project["status"][] = [
    "作成中",
    "レビュー待ち",
    "レビュー完了",
    "作成完了",
    "配信中",
    "配信終了",
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

  return Array.from({ length: 50 }, (_, index) => {
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomCreator = creators[Math.floor(Math.random() * creators.length)];

    return {
      id: `SRB${String(index + 1).padStart(3, "0")}`,
      title: randomTitle,
      status: randomStatus,
      createdDate: "2025/06/04 08:00",
      updatedDate: "2025/06/10 15:30",
      creator: randomCreator,
    };
  });
};

export function SurveyListSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [allSurveys] = useState(() => generateSampleData()); // 初期化時に1回だけ実行
  const itemsPerPage = 20;
  const router = useRouter();
  const { handleRowClick, handleIconClick } = useTableNavigation();

  const totalPages = Math.ceil(allSurveys.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSurveys = allSurveys.slice(startIndex, endIndex);

  // ステータスに応じた色を取得
  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "作成中":
        return "bg-white text-[#4BBC80] border-[#4BBC80]";
      case "レビュー待ち":
        return "bg-white text-[#60ADC2] border-[#60ADC2]";
      case "レビュー完了":
        return "bg-[#60ADC2] text-white border-[#60ADC2]";
      case "作成完了":
        return "bg-[#4BBC80] text-white border-[#4BBC80]";
      case "配信中":
        return "bg-[#D96868] text-white border-[#D96868]";
      case "配信終了":
        return "bg-[#ABAEB1] text-white border-[#ABAEB1]";
      default:
        return "bg-white text-gray-600 border-gray-300";
    }
  };

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
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">調査一覧</h1>
          <p className="text-gray-600">
            作成済みの調査一覧です。調査の編集、削除、配信設定などができます。
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteSelected}
                disabled={selectedItems.length === 0}
                className="border-gray-300 hover:bg-gray-50"
              >
                選択項目を削除
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadResults}
                disabled={selectedItems.length === 0}
                className="border-gray-300 hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-1" />
                テスト結果をダウンロード
              </Button>
            </div>
            <Button
              asChild
              className="bg-[#138fb5] hover:bg-[#0f7a9e] text-white"
            >
              <Link href="/surveys/new">
                <Plus className="w-4 h-4 mr-1" />
                新規調査作成
              </Link>
            </Button>
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
                    className={`${selectedItems.includes(survey.id) ? "bg-[#BCD6E0]" : "bg-white"} hover:bg-blue-50 transition-colors cursor-pointer`}
                    onClick={(e) => handleRowClick(survey, e)}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(survey.id)}
                        onCheckedChange={(checked) =>
                          handleSelectItem(survey.id, checked as boolean)
                        }
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
                        className={`${getStatusColor(survey.status)} font-bold`}
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
                        className="border-gray-300 hover:bg-gray-50 w-8 h-8 p-0 mx-auto"
                        onClick={(e) => handleIconClick("review", survey.id, e)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-center px-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-300 hover:bg-gray-50 w-8 h-8 p-0 mx-auto"
                        onClick={(e) =>
                          handleIconClick("response", survey.id, e)
                        }
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-center px-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-300 hover:bg-gray-50 w-8 h-8 p-0 mx-auto"
                        onClick={(e) =>
                          handleIconClick("distribution", survey.id, e)
                        }
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-center px-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-300 hover:bg-gray-50 w-8 h-8 p-0 mx-auto"
                        onClick={(e) =>
                          handleIconClick("gtTable", survey.id, e)
                        }
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
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
                        onClick={() => setCurrentPage(item as number)}
                        isActive={currentPage === item}
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
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
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
          </div>
        </div>
      </div>
    </div>
  );
}
