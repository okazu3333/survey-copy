"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Page = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password.length >= 6 && displayName.trim().length > 0) {
      setIsLoggedIn(true);
    } else {
      let err = "";
      if (displayName.trim().length === 0) err = "表示名を入力してください";
      else err = "パスワードが正しくありません";
      setError(err);
    }
    setIsLoading(false);
  };

  if (!isLoggedIn) {
    // ログイン画面のみ表示
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              レビュワーログイン
            </h1>
            <p className="text-gray-600">
              表示名とパスワードを入力してください
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label
                htmlFor="displayName"
                className="text-sm font-medium text-gray-700"
              >
                表示名
              </Label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1"
                placeholder="表示名を入力"
                required
              />
            </div>
            <div>
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                パスワード
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                placeholder="パスワードを入力"
                required
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#138fb5] hover:bg-[#0f7a9e] text-white"
            >
              {isLoading ? "ログイン中..." : "ログイン"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // ログイン後はシンプルなレビュワープレビュー画面（最初のカスタムUIよりも前の状態）
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          レビュワープレビュー画面
        </h1>
        <p className="text-gray-600">ログイン後の新規画面（仮）です。</p>
      </div>
    </div>
  );
};

export default Page;
