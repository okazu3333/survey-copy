"use client";

import { createContext, useContext, useState } from "react";
import type { ReviewItem } from "@/lib/types/review";

type ReviewContextType = {
  isReviewCollapsed: boolean;
  setIsReviewCollapsed: (value: boolean) => void;
  reviewItems: ReviewItem[];
  addReviewItem: (item: ReviewItem) => void;
  updateReviewItem: (id: number, updatedItem: Partial<ReviewItem>) => void;
  deleteReviewItem: (id: number) => void;
  isAnyCommentOpen: boolean;
  setIsAnyCommentOpen: (value: boolean) => void;
};

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

// 初期データ
const initialReviewItems: ReviewItem[] = [
  {
    id: 1,
    questionNo: "Q1",
    type: "AIレビュー・回答テスト結果",
    reviewerName: "佐藤花子",
    time: "1分前",
    comment:
      "スクリーニング設問の1問目で、回答者の性別を尋ねています。設問タイプは単一選択で問題ないと考えられますが、LGBTQの人々の存在を考慮して、選択肢には「男性」「女性」以外に、「その他」や「答えたくない」もあると望ましいです。",
    status: "unresolved",
    reviewType: "ai",
    sectionId: "fixed",
  },
  {
    id: 2,
    questionNo: "Q8",
    type: "AIレビュー・カバレッジ検証結果",
    reviewerName: "田中太郎",
    time: "10分前",
    comment:
      "前の設問からジャンプ条件が設定されておらず、この設問に辿り着けませんでした。",
    status: "unresolved",
    reviewType: "ai",
    sectionId: "main",
  },
  {
    id: 3,
    questionNo: "Q28",
    type: "AIレビュー・カバレッジ検証結果",
    reviewerName: "鈴木一郎",
    time: "15分前",
    comment:
      "前の設問からジャンプ条件が設定されておらず、この設問に辿り着けませんでした。",
    status: "resolved",
    reviewType: "ai",
    sectionId: "main",
  },
  {
    id: 4,
    questionNo: "Q18",
    type: "AIレビュー・回答テスト結果",
    reviewerName: "山田花子",
    time: "2時間前",
    comment:
      "他の設問では「教えてください」ですが、この設問では「教えてください」になっています。",
    status: "unresolved",
    reviewType: "ai",
    replies: 1,
    sectionId: "main",
  },
  {
    id: 5,
    questionNo: "タイトル全体",
    type: "AIレビュー・カバレッジ検証結果",
    reviewerName: "高橋次郎",
    time: "8時間前",
    comment: "セクション",
    status: "unresolved",
    reviewType: "ai",
    sectionId: "main",
  },
  {
    id: 6,
    questionNo: "Q5",
    type: "佐藤花子",
    reviewerName: "佐藤花子",
    time: "30分前",
    comment: "選択肢の順序を見直した方が良いと思います。",
    status: "unresolved",
    reviewType: "team",
    sectionId: "main",
  },
  {
    id: 7,
    questionNo: "Q3",
    type: "田中太郎",
    reviewerName: "田中太郎",
    time: "1時間前",
    comment:
      "質問文が長すぎるので、もう少し簡潔にしてください。 質問文が長すぎるので、もう少し簡潔にしてください。",
    status: "resolved",
    reviewType: "team",
    sectionId: "fixed",
  },
  // ロジックチェック専用のコメント
  {
    id: 201,
    questionNo: "Q1 → Q2",
    type: "ロジック",
    reviewerName: "AIレビュー",
    time: "5分前",
    comment:
      "性別が「男性」の場合、年齢確認のQ2に進むロジックが正しく設定されています。",
    status: "unresolved",
    reviewType: "ai",
    sectionId: "logic",
    questionId: "q1",
    position: { x: 70, y: 20 },
  },
  {
    id: 202,
    questionNo: "Q4 → Q5",
    type: "ロジック",
    reviewerName: "田中太郎",
    time: "10分前",
    comment:
      "結婚歴が「既婚」の場合、配偶者の年齢を尋ねるQ5への分岐を追加することを推奨します。",
    status: "unresolved",
    reviewType: "team",
    sectionId: "logic",
    questionId: "q4",
    position: { x: 75, y: 30 },
  },
];

export const ReviewProvider = ({ children }: { children: React.ReactNode }) => {
  const [isReviewCollapsed, setIsReviewCollapsed] = useState(false);
  const [reviewItems, setReviewItems] =
    useState<ReviewItem[]>(initialReviewItems);
  const [isAnyCommentOpen, setIsAnyCommentOpen] = useState(false);

  const addReviewItem = (item: ReviewItem) => {
    setReviewItems((prev) => [item, ...prev]);
  };

  const updateReviewItem = (id: number, updatedItem: Partial<ReviewItem>) => {
    setReviewItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedItem } : item)),
    );
  };

  const deleteReviewItem = (id: number) => {
    setReviewItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <ReviewContext.Provider
      value={{
        isReviewCollapsed,
        setIsReviewCollapsed,
        reviewItems,
        addReviewItem,
        updateReviewItem,
        deleteReviewItem,
        isAnyCommentOpen,
        setIsAnyCommentOpen,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviewContext = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error("useReviewContext must be used within a ReviewProvider");
  }
  return context;
};
