"use client";

import { Check, Copy, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UrlModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  title?: string;
};

export const UrlModal = ({
  open,
  onOpenChange,
  url,
  title = "レビュー画面URL",
}: UrlModalProps) => {
  const [copied, setCopied] = useState(false);
  const [password, setPassword] = useState("");

  // 8桁のランダムパスワードを生成する関数
  const generatePassword = useCallback(() => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }, []);

  // モーダルが開かれた時にパスワードを生成（レビュー画面URLの場合のみ）
  useEffect(() => {
    if (open && title === "レビュー画面URL") {
      setPassword(generatePassword());
    }
  }, [open, title, generatePassword]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handleCopyPassword = async () => {
    if (password) {
      try {
        await navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy password:", err);
      }
    }
  };

  const handleRegeneratePassword = () => {
    setPassword(generatePassword());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-[#333333]">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-[#333333]">URL</Label>
            <div className="flex items-center gap-2">
              <Input
                value={url}
                readOnly
                className="flex-1 bg-gray-50 text-[#333333] font-mono text-sm"
              />
              <Button
                onClick={handleCopy}
                variant="outline"
                size="icon"
                className="h-10 w-10 border-[#60ADC2] text-[#60ADC2] hover:bg-[#60ADC2] hover:text-white"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* パスワード機能はレビュー画面URLの場合のみ表示 */}
          {title === "レビュー画面URL" && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-[#333333]">
                  パスワード
                </Label>
                <Button
                  onClick={handleRegeneratePassword}
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 border-[#60ADC2] text-[#60ADC2] hover:bg-[#60ADC2] hover:text-white text-xs"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  再生成
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={password}
                  readOnly
                  className="flex-1 bg-gray-50 text-[#333333] font-mono text-sm"
                />
                <Button
                  onClick={handleCopyPassword}
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 border-[#60ADC2] text-[#60ADC2] hover:bg-[#60ADC2] hover:text-white"
                  disabled={!password}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[#dcdcdc] text-[#3a3a3a] hover:bg-gray-50"
            >
              閉じる
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
