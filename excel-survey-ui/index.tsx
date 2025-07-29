import * as React from "react";

// セルの詳細パラメータ型定義
export interface CellParameters {
  value: string;
  formula?: string;
  format: string;
  fontFamily: string;
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  textAlign: string;
  backgroundColor: string;
  textColor: string;
  borderStyle: string;
  dataType: string;
  validation?: string;
  comment?: string;
}

// Excel風のセル詳細パネル
function ExcelCellDetailsPanel({
  selectedCell,
  cellParams,
  onCellParamsChange,
  isVisible,
  onClose,
}: {
  selectedCell: string;
  cellParams: CellParameters;
  onCellParamsChange: (params: CellParameters) => void;
  isVisible: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={`fixed right-4 top-20 w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-50 ${
        isVisible ? "block" : "hidden"
      }`}
    >
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-700">
          セル詳細: {selectedCell}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
        {/* 基本情報 */}
        <div>
          <h4 className="text-xs font-bold text-gray-600 mb-2">基本情報</h4>
          <div className="space-y-2">
            <div>
              <label htmlFor="cell-value" className="text-xs text-gray-500">
                値
              </label>
              <input
                id="cell-value"
                type="text"
                value={cellParams.value}
                onChange={(e) =>
                  onCellParamsChange({ ...cellParams, value: e.target.value })
                }
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              />
            </div>
            <div>
              <label htmlFor="cell-formula" className="text-xs text-gray-500">
                数式
              </label>
              <input
                id="cell-formula"
                type="text"
                value={cellParams.formula || ""}
                onChange={(e) =>
                  onCellParamsChange({ ...cellParams, formula: e.target.value })
                }
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                placeholder="=SUM(A1:A10)"
              />
            </div>
            <div>
              <label htmlFor="cell-data-type" className="text-xs text-gray-500">
                データ型
              </label>
              <select
                id="cell-data-type"
                value={cellParams.dataType}
                onChange={(e) =>
                  onCellParamsChange({
                    ...cellParams,
                    dataType: e.target.value,
                  })
                }
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              >
                <option>テキスト</option>
                <option>数値</option>
                <option>日付</option>
                <option>通貨</option>
                <option>パーセント</option>
              </select>
            </div>
          </div>
        </div>

        {/* フォーマット */}
        <div>
          <h4 className="text-xs font-bold text-gray-600 mb-2">フォーマット</h4>
          <div className="space-y-2">
            <div>
              <label htmlFor="cell-format" className="text-xs text-gray-500">
                フォーマット
              </label>
              <select
                id="cell-format"
                value={cellParams.format}
                onChange={(e) =>
                  onCellParamsChange({ ...cellParams, format: e.target.value })
                }
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              >
                <option>標準</option>
                <option>数値</option>
                <option>通貨</option>
                <option>会計</option>
                <option>日付</option>
                <option>時刻</option>
                <option>パーセント</option>
                <option>分数</option>
                <option>指数</option>
                <option>テキスト</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="cell-font-family"
                className="text-xs text-gray-500"
              >
                フォント
              </label>
              <select
                id="cell-font-family"
                value={cellParams.fontFamily}
                onChange={(e) =>
                  onCellParamsChange({
                    ...cellParams,
                    fontFamily: e.target.value,
                  })
                }
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              >
                <option>Segoe UI</option>
                <option>Arial</option>
                <option>Times New Roman</option>
                <option>Calibri</option>
                <option>Verdana</option>
              </select>
            </div>
            <div>
              <label htmlFor="cell-font-size" className="text-xs text-gray-500">
                サイズ
              </label>
              <select
                id="cell-font-size"
                value={cellParams.fontSize}
                onChange={(e) =>
                  onCellParamsChange({
                    ...cellParams,
                    fontSize: parseInt(e.target.value),
                  })
                }
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              >
                <option>8</option>
                <option>9</option>
                <option>10</option>
                <option>11</option>
                <option>12</option>
                <option>14</option>
                <option>16</option>
                <option>18</option>
              </select>
            </div>
          </div>
        </div>

        {/* スタイル */}
        <div>
          <h4 className="text-xs font-bold text-gray-600 mb-2">スタイル</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                id="cell-bold"
                type="checkbox"
                checked={cellParams.isBold}
                onChange={(e) =>
                  onCellParamsChange({
                    ...cellParams,
                    isBold: e.target.checked,
                  })
                }
                className="text-xs"
              />
              <label htmlFor="cell-bold" className="text-xs text-gray-500">
                太字
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="cell-italic"
                type="checkbox"
                checked={cellParams.isItalic}
                onChange={(e) =>
                  onCellParamsChange({
                    ...cellParams,
                    isItalic: e.target.checked,
                  })
                }
                className="text-xs"
              />
              <label htmlFor="cell-italic" className="text-xs text-gray-500">
                斜体
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="cell-underline"
                type="checkbox"
                checked={cellParams.isUnderline}
                onChange={(e) =>
                  onCellParamsChange({
                    ...cellParams,
                    isUnderline: e.target.checked,
                  })
                }
                className="text-xs"
              />
              <label htmlFor="cell-underline" className="text-xs text-gray-500">
                下線
              </label>
            </div>
            <div>
              <label
                htmlFor="cell-text-align"
                className="text-xs text-gray-500"
              >
                配置
              </label>
              <select
                id="cell-text-align"
                value={cellParams.textAlign}
                onChange={(e) =>
                  onCellParamsChange({
                    ...cellParams,
                    textAlign: e.target.value,
                  })
                }
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              >
                <option value="left">左揃え</option>
                <option value="center">中央揃え</option>
                <option value="right">右揃え</option>
              </select>
            </div>
          </div>
        </div>

        {/* 色と境界線 */}
        <div>
          <h4 className="text-xs font-bold text-gray-600 mb-2">色と境界線</h4>
          <div className="space-y-2">
            <div>
              <label htmlFor="cell-bg-color" className="text-xs text-gray-500">
                背景色
              </label>
              <input
                id="cell-bg-color"
                type="color"
                value={cellParams.backgroundColor}
                onChange={(e) =>
                  onCellParamsChange({
                    ...cellParams,
                    backgroundColor: e.target.value,
                  })
                }
                className="w-full h-8 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label
                htmlFor="cell-text-color"
                className="text-xs text-gray-500"
              >
                文字色
              </label>
              <input
                id="cell-text-color"
                type="color"
                value={cellParams.textColor}
                onChange={(e) =>
                  onCellParamsChange({
                    ...cellParams,
                    textColor: e.target.value,
                  })
                }
                className="w-full h-8 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label
                htmlFor="cell-border-style"
                className="text-xs text-gray-500"
              >
                境界線
              </label>
              <select
                id="cell-border-style"
                value={cellParams.borderStyle}
                onChange={(e) =>
                  onCellParamsChange({
                    ...cellParams,
                    borderStyle: e.target.value,
                  })
                }
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              >
                <option>なし</option>
                <option>細線</option>
                <option>中線</option>
                <option>太線</option>
                <option>二重線</option>
              </select>
            </div>
          </div>
        </div>

        {/* データ検証 */}
        <div>
          <h4 className="text-xs font-bold text-gray-600 mb-2">データ検証</h4>
          <div className="space-y-2">
            <div>
              <label
                htmlFor="cell-validation"
                className="text-xs text-gray-500"
              >
                検証ルール
              </label>
              <input
                id="cell-validation"
                type="text"
                value={cellParams.validation || ""}
                onChange={(e) =>
                  onCellParamsChange({
                    ...cellParams,
                    validation: e.target.value,
                  })
                }
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                placeholder="例: 1-100の範囲"
              />
            </div>
            <div>
              <label htmlFor="cell-comment" className="text-xs text-gray-500">
                コメント
              </label>
              <textarea
                id="cell-comment"
                value={cellParams.comment || ""}
                onChange={(e) =>
                  onCellParamsChange({ ...cellParams, comment: e.target.value })
                }
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                rows={2}
                placeholder="セルに関するコメント"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Excel風の追加機能コンポーネント
// Excel風の数式バー
function ExcelFormulaBar() {
  const [formula, setFormula] = React.useState("");
  const [selectedCell, _setSelectedCell] = React.useState("A1");
  const [isEditing, setIsEditing] = React.useState(false);

  return (
    <div className="bg-gray-100 border-b border-gray-300 p-2 flex items-center gap-2">
      <span className="text-xs font-bold text-gray-600">fx</span>
      <div className="flex-1 flex items-center gap-2">
        <span className="text-xs font-bold text-gray-600 min-w-[40px]">
          {selectedCell}
        </span>
        <input
          type="text"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          onFocus={() => setIsEditing(true)}
          onBlur={() => setIsEditing(false)}
          placeholder="数式を入力"
          className={`flex-1 px-2 py-1 border rounded text-sm ${
            isEditing ? "border-blue-500 bg-white" : "border-gray-300"
          }`}
        />
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="px-2 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50"
        >
          ✓
        </button>
        <button
          type="button"
          className="px-2 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50"
        >
          ✗
        </button>
      </div>
    </div>
  );
}

// Excel風のステータスバー
function ExcelStatusBar() {
  const [selectedRange, _setSelectedRange] = React.useState("A1");
  const [sum, _setSum] = React.useState(0);
  const [average, _setAverage] = React.useState(0);
  const [count, _setCount] = React.useState(0);
  const [max, _setMax] = React.useState(0);
  const [min, _setMin] = React.useState(0);

  return (
    <div className="bg-gray-100 border-t border-gray-300 p-1 flex items-center justify-between text-xs text-gray-600">
      <div className="flex items-center gap-4">
        <span>準備完了</span>
        <span>セル: {selectedRange}</span>
        <span>シート: Sheet1</span>
        <span>ズーム: 100%</span>
      </div>
      <div className="flex items-center gap-2">
        <span>合計: {sum}</span>
        <span>平均: {average}</span>
        <span>個数: {count}</span>
        <span>最大: {max}</span>
        <span>最小: {min}</span>
      </div>
    </div>
  );
}

// Excel風のシートタブ
function ExcelSheetTabs() {
  const [activeSheet, setActiveSheet] = React.useState("Sheet1");
  const [sheets, setSheets] = React.useState(["Sheet1", "Sheet2", "Sheet3"]);

  const addNewSheet = () => {
    const newSheetName = `Sheet${sheets.length + 1}`;
    setSheets([...sheets, newSheetName]);
    setActiveSheet(newSheetName);
  };

  return (
    <div className="bg-gray-200 border-t border-gray-300 flex items-center">
      <div className="flex items-center">
        {sheets.map((sheet, _index) => (
          <button
            type="button"
            key={sheet}
            onClick={() => setActiveSheet(sheet)}
            className={`px-4 py-2 text-sm border-r border-gray-300 hover:bg-gray-100 ${
              activeSheet === sheet
                ? "bg-white border-b-2 border-b-white"
                : "bg-gray-200"
            }`}
          >
            {sheet}
          </button>
        ))}
        <button
          type="button"
          onClick={addNewSheet}
          className="px-2 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          +
        </button>
      </div>
    </div>
  );
}

// Excel風のメニューバー
function ExcelMenuBar() {
  const [activeMenu, setActiveMenu] = React.useState("");

  return (
    <div className="bg-gray-100 border-b border-gray-300 p-1 flex items-center gap-4 text-xs">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() =>
            setActiveMenu(activeMenu === "ファイル" ? "" : "ファイル")
          }
          className={`px-2 py-1 rounded hover:bg-gray-200 ${
            activeMenu === "ファイル" ? "bg-gray-200" : ""
          }`}
        >
          ファイル
        </button>
        <button
          type="button"
          onClick={() => setActiveMenu(activeMenu === "ホーム" ? "" : "ホーム")}
          className={`px-2 py-1 rounded hover:bg-gray-200 ${
            activeMenu === "ホーム" ? "bg-gray-200" : ""
          }`}
        >
          ホーム
        </button>
        <button
          type="button"
          onClick={() => setActiveMenu(activeMenu === "挿入" ? "" : "挿入")}
          className={`px-2 py-1 rounded hover:bg-gray-200 ${
            activeMenu === "挿入" ? "bg-gray-200" : ""
          }`}
        >
          挿入
        </button>
        <button
          type="button"
          onClick={() =>
            setActiveMenu(
              activeMenu === "ページレイアウト" ? "" : "ページレイアウト",
            )
          }
          className={`px-2 py-1 rounded hover:bg-gray-200 ${
            activeMenu === "ページレイアウト" ? "bg-gray-200" : ""
          }`}
        >
          ページレイアウト
        </button>
        <button
          type="button"
          onClick={() => setActiveMenu(activeMenu === "数式" ? "" : "数式")}
          className={`px-2 py-1 rounded hover:bg-gray-200 ${
            activeMenu === "数式" ? "bg-gray-200" : ""
          }`}
        >
          数式
        </button>
        <button
          type="button"
          onClick={() => setActiveMenu(activeMenu === "データ" ? "" : "データ")}
          className={`px-2 py-1 rounded hover:bg-gray-200 ${
            activeMenu === "データ" ? "bg-gray-200" : ""
          }`}
        >
          データ
        </button>
        <button
          type="button"
          onClick={() => setActiveMenu(activeMenu === "校閲" ? "" : "校閲")}
          className={`px-2 py-1 rounded hover:bg-gray-200 ${
            activeMenu === "校閲" ? "bg-gray-200" : ""
          }`}
        >
          校閲
        </button>
        <button
          type="button"
          onClick={() => setActiveMenu(activeMenu === "表示" ? "" : "表示")}
          className={`px-2 py-1 rounded hover:bg-gray-200 ${
            activeMenu === "表示" ? "bg-gray-200" : ""
          }`}
        >
          表示
        </button>
      </div>
    </div>
  );
}

export default function ExcelSurveyUI() {
  const [selectedCellAddress] = React.useState("A1");
  const [selectedCellParams, setSelectedCellParams] =
    React.useState<CellParameters>({
      value: "",
      formula: "",
      format: "標準",
      fontFamily: "Segoe UI",
      fontSize: 11,
      isBold: false,
      isItalic: false,
      isUnderline: false,
      textAlign: "left",
      backgroundColor: "#ffffff",
      textColor: "#000000",
      borderStyle: "なし",
      dataType: "テキスト",
      validation: "",
      comment: "",
    });
  const [showCellDetails, setShowCellDetails] = React.useState(false);

  return (
    <div className="w-full max-w-[1400px] mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          設問票（Excel風シート）
        </h2>
        <p className="text-sm text-gray-600">
          完全なExcel風インターフェースで設問を管理
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        {/* Excel風メニューバー */}
        <ExcelMenuBar />

        {/* Excel風数式バー */}
        <ExcelFormulaBar />

        {/* メイングリッド */}
        <div className="p-4 text-center text-gray-500">
          SheetModeGrid component was removed
        </div>

        {/* Excel風ステータスバー */}
        <ExcelStatusBar />

        {/* Excel風シートタブ（下部） */}
        <ExcelSheetTabs />
      </div>

      {/* セル詳細パネル */}
      <ExcelCellDetailsPanel
        selectedCell={selectedCellAddress}
        cellParams={selectedCellParams}
        onCellParamsChange={setSelectedCellParams}
        isVisible={showCellDetails}
        onClose={() => setShowCellDetails(false)}
      />
    </div>
  );
}
