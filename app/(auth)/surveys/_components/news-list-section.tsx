"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// サンプルデータ（実際の実装ではAPIから取得）
const generateSampleNews = () => {
  const types = [
    { name: "メンテナンス", color: "bg-[#138fb5] text-white" },
    { name: "アップデート", color: "bg-[#60adc2] text-white" },
    { name: "重要", color: "bg-red-500 text-white" },
    { name: "お知らせ", color: "bg-blue-500 text-white" },
    { name: "イベント", color: "bg-green-500 text-white" },
  ];

  const contents = [
    "【07/01】メンテナンスを実施します。",
    "アップデートを実施しました。",
    "新規アカウント登録ありがとうございます。登録時の設定の確認はこちらをご確認ください。",
    "システムの不具合について",
    "新機能の追加について",
    "セキュリティ強化のお知らせ",
    "年末年始の営業時間について",
    "定期メンテナンスの実施について",
    "データベース移行作業について",
    "API仕様変更のお知らせ",
  ];

  return Array.from({ length: 50 }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const content = contents[Math.floor(Math.random() * contents.length)];
    const year = 2025;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    
    return {
      id: String(i + 1),
      date: `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`,
      type: type.name,
      typeColor: type.color,
      content: `${content} ${i + 1}`,
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export function NewsListSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const allNews = generateSampleNews();
  const totalPages = Math.ceil(allNews.length / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNews = allNews.slice(startIndex, endIndex);

  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      if (start > 1) {
        items.push(1);
        if (start > 2) {
          items.push('ellipsis-start');
        }
      }
      
      for (let i = start; i <= end; i++) {
        items.push(i);
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) {
          items.push('ellipsis-end');
        }
        items.push(totalPages);
      }
    }
    
    return items;
  };

  return (
    <Card>
      <CardHeader className="bg-[#138fb5] text-white rounded-t-lg">
        <h2 className="text-lg font-semibold">お知らせ一覧</h2>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-8">
          <p className="text-gray-700">
            システムからのお知らせ一覧です。最新の情報を確認できます。
          </p>
        </div>

        <div className="space-y-6">
          {currentNews.map((item) => (
            <div key={item.id} className="border-b border-gray-200 pb-6">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 min-w-[80px] font-medium">
                  {item.date}
                </span>
                <Badge className={`${item.typeColor} ml-1 mr-2`}>
                  {item.type}
                </Badge>
                <p className="text-sm text-gray-700 flex-1 leading-relaxed font-bold">{item.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ページネーション */}
        <div className="mt-10">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {generatePaginationItems().map((item, index) => (
                <PaginationItem key={index}>
                  {item === 'ellipsis-start' || item === 'ellipsis-end' ? (
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
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          
          <div className="mt-4 text-center text-sm text-gray-600">
            {startIndex + 1} - {Math.min(endIndex, allNews.length)} / {allNews.length} 件
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 