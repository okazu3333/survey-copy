"use client";

import { FilePlus2, X } from "lucide-react";
import type React from "react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SurveyImportDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onFileImport: (file: File) => void;
};

const SurveyImportDialog = ({
  isOpen,
  onClose,
  onFileImport,
}: SurveyImportDialogProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const allowedTypes = [
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-excel", // .xls
    "text/plain", // .txt
    "application/pdf", // .pdf
  ];

  const validateFile = (file: File): boolean => {
    if (!allowedTypes.includes(file.type)) {
      setError(
        "対応していないファイル形式です。.pptx、.excel、.txt、.pdf のいずれかを選択してください。",
      );
      return false;
    }
    setError(null);
    return true;
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files?.[0]) {
        const file = e.dataTransfer.files[0];
        if (validateFile(file)) {
          setSelectedFile(file);
        }
      }
    },
    // biome-ignore lint/correctness/useExhaustiveDependencies: validateFile is stable and doesn't depend on changing values
    [validateFile],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleImport = () => {
    if (selectedFile) {
      onFileImport(selectedFile);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative bg-white w-full max-w-md mx-4 p-6 rounded-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          type="button"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2">
            ファイルから調査を作成
          </h2>
          <p className="text-sm text-gray-600">
            ファイルをアップロードしてAIが分析します
          </p>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* File upload area */}
          <div className="space-y-3">
            <Button
              className={cn(
                "border-2 border-dashed border-gray-400 bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center gap-3 h-32 transition-all duration-300 relative w-full hover:border-[#138FB5] hover:bg-[#E6F2F5]",
                dragActive && "border-[#138FB5] bg-[#E6F2F5]",
                selectedFile && "border-green-400 bg-green-50",
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              tabIndex={0}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 flex items-center justify-center bg-[#138FB5]/10 rounded-full">
                  <FilePlus2 className="w-6 h-6 text-[#138FB5]" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-800 mb-1">
                    {selectedFile
                      ? `選択: ${selectedFile.name}`
                      : "ファイルをドラッグ＆ドロップまたはクリック"}
                  </p>
                  <p className="text-xs text-gray-600">
                    対応: .pptx .xlsx .xls .txt .pdf
                  </p>
                </div>
              </div>
              <input
                type="file"
                onChange={handleFileInput}
                accept=".pptx,.xlsx,.xls,.txt,.pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </Button>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs font-medium text-red-600">{error}</p>
            </div>
          )}

          {/* Convert button */}
          <div className="flex justify-center">
            <Button
              onClick={handleImport}
              disabled={!selectedFile}
              className="w-full h-10 bg-[#138FB5] hover:bg-[#0f7a9b] text-white font-bold rounded-lg text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ファイルを変換する
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SurveyImportDialog };
