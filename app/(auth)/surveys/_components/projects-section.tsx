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
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTableNavigation } from "@/hooks/use-table-navigation";
import { ProjectStatus } from "@/lib/types/survey";

export function ProjectsSection() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { handleRowClick, handleIconClick } = useTableNavigation();

  const projects: {
    id: string;
    title: string;
    status: string;
    createdDate: string;
    updatedDate: string;
    creator: string;
  }[] = [
    {
      id: "SRB008",
      title: "家族構成に関する調査",
      status: "作成中",
      createdDate: "2025/06/04 08:00",
      updatedDate: "2025/06/10 15:30",
      creator: "山田太郎",
    },
    {
      id: "SRB009",
      title: "〜〜〜〜に関するイメ…",
      status: "作成中",
      createdDate: "2025/06/04 08:00",
      updatedDate: "2025/06/10 15:30",
      creator: "山田太郎",
    },
    {
      id: "SRB010",
      title: "〜〜〜〜満足度調査",
      status: "レビュー待ち",
      createdDate: "2025/06/04 08:00",
      updatedDate: "2025/06/10 15:30",
      creator: "山田太郎",
    },
    {
      id: "SRB011",
      title: "調査タイトル横幅は切…",
      status: "レビュー完了",
      createdDate: "2025/06/04 08:00",
      updatedDate: "2025/06/10 15:30",
      creator: "山田太郎",
    },
    {
      id: "SRB012",
      title: "満足度調査",
      status: "作成完了",
      createdDate: "2025/06/04 08:00",
      updatedDate: "2025/06/10 15:30",
      creator: "山田太郎",
    },
    {
      id: "SRB013",
      title: "満足度調査",
      status: "配信中",
      createdDate: "2025/06/04 08:00",
      updatedDate: "2025/06/10 15:30",
      creator: "山田太郎",
    },
    {
      id: "SRB014",
      title: "満足度調査",
      status: "配信終了",
      createdDate: "2025/06/04 08:00",
      updatedDate: "2025/06/10 15:30",
      creator: "山田太郎",
    },
    {
      id: "SRB015",
      title: "満足度調査",
      status: "配信終了",
      createdDate: "2025/06/04 08:00",
      updatedDate: "2025/06/10 15:30",
      creator: "山田太郎",
    },
  ];

  // ステータスに応じた色を取得
  const getStatusColor = (status: string) => {
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
      setSelectedItems(projects.map((project) => project.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (projectId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, projectId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== projectId));
    }
  };

  return (
    <div className="relative">
      <div className="absolute top-0 left-1 z-10 flex items-center justify-center p-6 bg-[#138fb5] text-white rounded-t-lg w-[200px] rounded-b-none h-10">
        <h2 className="text-lg font-semibold text-center">現在進行中の案件</h2>
      </div>
      <div className="pt-10">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="mb-2">
            <p className="text-gray-700 mb-6">
              作成する調査タイトルを選択してください。新規で作成する場合は「新規調査作成」から行えます。
            </p>

            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 hover:bg-gray-50 min-w-[140px] h-9 items-center justify-center"
                >
                  選択項目を削除
                </Button>
                <Button
                  variant="outline"
                  size="sm"
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
                        selectedItems.length === projects.length &&
                        projects.length > 0
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
                {projects.map((project) => (
                  <TableRow
                    key={project.id}
                    className={`${selectedItems.includes(project.id) ? "bg-[#BCD6E0]" : "bg-white"} hover:bg-blue-50 transition-colors cursor-pointer`}
                    onClick={(e) => handleRowClick({
                      ...project,
                      status: project.status as ProjectStatus
                    }, e)}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(project.id)}
                        onCheckedChange={(checked) =>
                          handleSelectItem(project.id, checked === true)
                        }
                      />
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {project.id}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {project.title}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(project.status)} font-bold`}
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 text-center">
                      {project.createdDate}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 text-center">
                      {project.updatedDate}
                    </TableCell>
                    <TableCell className="text-gray-700 text-center">
                      {project.creator}
                    </TableCell>
                    <TableCell className="text-center px-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-300 hover:bg-gray-50 w-8 h-8 p-0 mx-auto"
                        onClick={(e) =>
                          handleIconClick("review", project.id, e)
                        }
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
                          handleIconClick("response", project.id, e)
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
                          handleIconClick("distribution", project.id, e)
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
                          handleIconClick("gtTable", project.id, e)
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
        </div>
      </div>
    </div>
  );
}
