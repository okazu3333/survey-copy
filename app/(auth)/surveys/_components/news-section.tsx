import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function NewsSection() {
  const newsItems = [
    {
      id: "1",
      date: "2025/06/10",
      type: "メンテナンス",
      typeColor: "bg-[#138fb5] text-white",
      content: "【07/01】メンテナンスを実施します。",
    },
    {
      id: "2",
      date: "2025/06/04",
      type: "アップデート",
      typeColor: "bg-[#60adc2] text-white",
      content: "アップデートを実施しました。",
    },
    {
      id: "3",
      date: "2025/06/02",
      type: "重要",
      typeColor: "bg-red-500 text-white",
      content:
        "新規アカウント登録ありがとうございます。登録時の設定の確認はこちらをご確認ください。なお、...",
    },
  ];

  return (
    <div className="rounded-t-none">
      <div className="relative">
        <div className="absolute top-0 left-1 z-10 flex items-center justify-center p-6 bg-[#138fb5] text-white rounded-t-lg w-[200px] rounded-b-none h-10">
          <h2 className="text-lg font-semibold text-center">最新のお知らせ</h2>
        </div>
        <div className="pt-10">
          <div className="bg-white rounded-lg border border-gray-200 p-5" style={{ paddingLeft: '30px' }}>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-700">山田 太郎 さん こんにちは！</p>
              <Button
                variant="outline"
                className="border-gray-300 hover:bg-gray-50 bg-transparent min-w-[140px]"
                asChild
              >
                <Link href="/surveys/news">
                  お知らせ一覧へ
                </Link>
              </Button>
            </div>

            <div className="space-y-4">
              {newsItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 border-b border-gray-200 pb-6">
                  <span className="text-sm text-gray-600 min-w-[80px] font-medium">
                    {item.date}
                  </span>
                  <Badge className={`${item.typeColor} ml-1 mr-2`}>
                    {item.type}
                  </Badge>
                  <p className="text-sm text-gray-700 flex-1 leading-relaxed font-bold">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
