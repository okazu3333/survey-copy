"use client";

import { CheckCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";

type TestProgressSectionProps = {
  isVisible: boolean;
};

export const TestProgressSection = ({
  isVisible,
}: TestProgressSectionProps) => {
  const [answerProgress, setAnswerProgress] = useState(0);
  const [coverageProgress, setCoverageProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentTest, setCurrentTest] = useState<
    "answer" | "coverage" | "completed"
  >("answer");

  useEffect(() => {
    if (!isVisible) {
      // 非表示時にリセット
      setAnswerProgress(0);
      setCoverageProgress(0);
      setIsCompleted(false);
      setCurrentTest("answer");
      return;
    }

    // 回答テストを開始
    const duration = 2000; // 2秒
    const interval = 50; // 50msごとに更新
    const steps = duration / interval;
    const increment = 100 / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = Math.min(currentStep * increment, 100);

      if (currentTest === "answer") {
        setAnswerProgress(progress);

        if (progress >= 100) {
          // 回答テスト完了、カバレッジテストを開始
          setCurrentTest("coverage");
          setAnswerProgress(100);
          setCoverageProgress(0);
          currentStep = 0; // カウンターをリセット
        }
      } else if (currentTest === "coverage") {
        setCoverageProgress(progress);

        if (progress >= 100) {
          // カバレッジテスト完了
          clearInterval(timer);
          setCoverageProgress(100);
          setCurrentTest("completed");
          setIsCompleted(true);
        }
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isVisible, currentTest]);

  if (!isVisible) return null;

  return (
    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
      <div className="space-y-4">
        {/* 完了ステータス */}
        {isCompleted && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-green-800">
              テスト完了
            </span>
          </div>
        )}

        {/* 回答テスト */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              回答テスト
            </span>
            <div className="flex items-center gap-2">
              {currentTest === "coverage" || currentTest === "completed" ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : currentTest === "answer" ? (
                <Clock className="w-4 h-4 text-blue-500 animate-spin" />
              ) : (
                <Clock className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-sm font-medium text-gray-600">
                {Math.round(answerProgress)}%
              </span>
            </div>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-100 ease-out ${
                currentTest === "answer"
                  ? "bg-blue-500"
                  : currentTest === "coverage" || currentTest === "completed"
                    ? "bg-green-500"
                    : "bg-gray-300"
              }`}
              style={{ width: `${answerProgress}%` }}
            />
          </div>
        </div>

        {/* カバレッジテスト */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              カバレッジテスト
            </span>
            <div className="flex items-center gap-2">
              {currentTest === "completed" ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : currentTest === "coverage" ? (
                <Clock className="w-4 h-4 text-blue-500 animate-spin" />
              ) : (
                <Clock className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-sm font-medium text-gray-600">
                {Math.round(coverageProgress)}%
              </span>
            </div>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-100 ease-out ${
                currentTest === "coverage"
                  ? "bg-blue-500"
                  : currentTest === "completed"
                    ? "bg-green-500"
                    : "bg-gray-300"
              }`}
              style={{ width: `${coverageProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
