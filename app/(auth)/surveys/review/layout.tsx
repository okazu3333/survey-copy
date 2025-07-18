"use client";

import { ReviewProvider, useReviewContext } from "./review-context";
import { cn } from "@/lib/utils";

type ReviewLayoutProps = {
  children: React.ReactNode;
  review: React.ReactNode;
  confirm: React.ReactNode;
};

const ReviewLayoutContent = ({
  children,
  review,
  confirm,
}: ReviewLayoutProps) => {
  const { isReviewCollapsed } = useReviewContext();

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="w-full py-6 px-4">
        <div className={cn(
          "flex gap-4 max-w-[1440px] mx-auto",
          // レビューコメントパネルが閉じている時は中央配置
          isReviewCollapsed && "justify-center"
        )}>
          <div
            className={cn(
              "flex flex-col gap-4 transition-all duration-300",
              "w-[calc(100%-500px)]" // 常に同じ幅を維持（新規調査作成画面と同様）
            )}
          >
            {/* メインコンテンツを先に表示 */}
            <div className="flex-1">
              {children}
            </div>
            {/* 確認ボタンを後から表示 */}
            <div className="flex-shrink-0">
              {confirm}
            </div>
          </div>
          {review}
        </div>
      </main>
    </div>
  );
};

const ReviewLayout = ({ children, review, confirm }: ReviewLayoutProps) => {
  return (
    <ReviewProvider>
      <ReviewLayoutContent review={review} confirm={confirm}>
        {children}
      </ReviewLayoutContent>
    </ReviewProvider>
  );
};

export default ReviewLayout;
