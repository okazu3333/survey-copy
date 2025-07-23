"use client";

import type React from "react";
import { cn } from "@/lib/utils";
import { ReviewProvider, useReviewContext } from "./review-context";

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
        <div
          className={cn(
            "flex gap-4 max-w-[1440px] mx-auto",
            // レビューコメントパネルが閉じている時は中央配置
            isReviewCollapsed && "justify-center",
          )}
        >
          <div
            className={cn(
              "flex flex-col gap-4 transition-all duration-300",
              "w-[calc(100%-500px)]", // 常に同じ幅を維持（新規調査作成画面と同様）
            )}
          >
            {children}
            {confirm}
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
