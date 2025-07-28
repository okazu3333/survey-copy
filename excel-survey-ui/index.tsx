import * as React from "react";
import SheetModeGrid, {
  type CellParameters,
} from "@/components/sheet-mode-grid";

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
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
        {/* 基本情報 */}
        <div>
          <h4 className="text-xs font-bold text-gray-600 mb-2">基本情報</h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs text-gray-500">値</label>
              <input
                type="text"
                value={cellParams.value}
                onChange={(e) =>
                  onCellParamsChange({ ...cellParams, value: e.target.value })
                }
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">数式</label>
              <input
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
              <label className="text-xs text-gray-500">データ型</label>
              <select
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
              <label className="text-xs text-gray-500">フォーマット</label>
              <select
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
              <label className="text-xs text-gray-500">フォント</label>
              <select
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
              <label className="text-xs text-gray-500">サイズ</label>
              <select
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
              <label className="text-xs text-gray-500">太字</label>
            </div>
            <div className="flex items-center gap-2">
              <input
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
              <label className="text-xs text-gray-500">斜体</label>
            </div>
            <div className="flex items-center gap-2">
              <input
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
              <label className="text-xs text-gray-500">下線</label>
            </div>
            <div>
              <label className="text-xs text-gray-500">配置</label>
              <select
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
              <label className="text-xs text-gray-500">背景色</label>
              <input
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
              <label className="text-xs text-gray-500">文字色</label>
              <input
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
              <label className="text-xs text-gray-500">境界線</label>
              <select
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
              <label className="text-xs text-gray-500">検証ルール</label>
              <input
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
              <label className="text-xs text-gray-500">コメント</label>
              <textarea
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
function ExcelToolbar({
  onShowCellDetails,
}: {
  onShowCellDetails: () => void;
}) {
  const [fontFamily, setFontFamily] = React.useState("Segoe UI");
  const [fontSize, setFontSize] = React.useState("11");
  const [isBold, setIsBold] = React.useState(false);
  const [isItalic, setIsItalic] = React.useState(false);
  const [isUnderline, setIsUnderline] = React.useState(false);
  const [textAlign, setTextAlign] = React.useState("left");

  return (
    <div className="bg-gray-100 border-b border-gray-300 p-2 flex items-center gap-2">
      {/* フォント設定 */}
      <div className="flex items-center gap-1">
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="px-2 py-1 bg-white border border-gray-300 rounded text-xs"
        >
          <option>Segoe UI</option>
          <option>Arial</option>
          <option>Times New Roman</option>
          <option>Calibri</option>
          <option>Verdana</option>
        </select>
        <select
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
          className="px-2 py-1 bg-white border border-gray-300 rounded text-xs"
        >
          <option>8</option>
          <option>9</option>
          <option>10</option>
          <option>11</option>
          <option>12</option>
          <option>14</option>
          <option>16</option>
          <option>18</option>
          <option>20</option>
          <option>24</option>
        </select>
      </div>

      <div className="w-px h-6 bg-gray-300"></div>

      {/* フォーマット */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setIsBold(!isBold)}
          className={`px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50 ${
            isBold ? "bg-blue-100 border-blue-500" : "bg-white"
          }`}
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => setIsItalic(!isItalic)}
          className={`px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50 ${
            isItalic ? "bg-blue-100 border-blue-500" : "bg-white"
          }`}
        >
          <em>I</em>
        </button>
        <button
          onClick={() => setIsUnderline(!isUnderline)}
          className={`px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50 ${
            isUnderline ? "bg-blue-100 border-blue-500" : "bg-white"
          }`}
        >
          <u>U</u>
        </button>
        <button className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">
          ~~
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300"></div>

      {/* 配置 */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setTextAlign("left")}
          className={`px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50 ${
            textAlign === "left" ? "bg-blue-100 border-blue-500" : "bg-white"
          }`}
        >
          ⬅
        </button>
        <button
          onClick={() => setTextAlign("center")}
          className={`px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50 ${
            textAlign === "center" ? "bg-blue-100 border-blue-500" : "bg-white"
          }`}
        >
          ⬆
        </button>
        <button
          onClick={() => setTextAlign("right")}
          className={`px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50 ${
            textAlign === "right" ? "bg-blue-100 border-blue-500" : "bg-white"
          }`}
        >
          ➡
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300"></div>

      {/* セル操作 */}
      <div className="flex items-center gap-1">
        <button className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">
          セル結合
        </button>
        <button className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">
          セル分割
        </button>
        <button className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">
          境界線
        </button>
        <button
          onClick={onShowCellDetails}
          className="px-3 py-1 bg-blue-100 border border-blue-500 rounded text-xs hover:bg-gray-50"
        >
          セル詳細
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300"></div>

      {/* 行・列操作 */}
      <div className="flex items-center gap-1">
        <button className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">
          行挿入
        </button>
        <button className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">
          列挿入
        </button>
        <button className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">
          行削除
        </button>
        <button className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">
          列削除
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300"></div>

      {/* 追加機能 */}
      <div className="flex items-center gap-1">
        <button className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">
          フィルター
        </button>
        <button className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">
          ソート
        </button>
        <button className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">
          検索
        </button>
        <button className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">
          置換
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300"></div>

      {/* 数式機能 */}
      <div className="flex items-center gap-1">
        <button className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">
          Σ
        </button>
        <button className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">
          fx
        </button>
        <button className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">
          %
        </button>
      </div>
    </div>
  );
}

// Excel風の数式バー
function ExcelFormulaBar() {
  const [formula, setFormula] = React.useState("");
  const [selectedCell, setSelectedCell] = React.useState("A1");
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
        <button className="px-2 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">
          ✓
        </button>
        <button className="px-2 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">
          ✗
        </button>
      </div>
    </div>
  );
}

// Excel風のステータスバー
function ExcelStatusBar() {
  const [selectedRange, setSelectedRange] = React.useState("A1");
  const [sum, setSum] = React.useState(0);
  const [average, setAverage] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [max, setMax] = React.useState(0);
  const [min, setMin] = React.useState(0);

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
        {sheets.map((sheet, index) => (
          <button
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
          onClick={() => setActiveMenu(activeMenu === "ホーム" ? "" : "ホーム")}
          className={`px-2 py-1 rounded hover:bg-gray-200 ${
            activeMenu === "ホーム" ? "bg-gray-200" : ""
          }`}
        >
          ホーム
        </button>
        <button
          onClick={() => setActiveMenu(activeMenu === "挿入" ? "" : "挿入")}
          className={`px-2 py-1 rounded hover:bg-gray-200 ${
            activeMenu === "挿入" ? "bg-gray-200" : ""
          }`}
        >
          挿入
        </button>
        <button
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
          onClick={() => setActiveMenu(activeMenu === "数式" ? "" : "数式")}
          className={`px-2 py-1 rounded hover:bg-gray-200 ${
            activeMenu === "数式" ? "bg-gray-200" : ""
          }`}
        >
          数式
        </button>
        <button
          onClick={() => setActiveMenu(activeMenu === "データ" ? "" : "データ")}
          className={`px-2 py-1 rounded hover:bg-gray-200 ${
            activeMenu === "データ" ? "bg-gray-200" : ""
          }`}
        >
          データ
        </button>
        <button
          onClick={() => setActiveMenu(activeMenu === "校閲" ? "" : "校閲")}
          className={`px-2 py-1 rounded hover:bg-gray-200 ${
            activeMenu === "校閲" ? "bg-gray-200" : ""
          }`}
        >
          校閲
        </button>
        <button
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

// Excel風の名前ボックス
function ExcelNameBox() {
  const [selectedRange, setSelectedRange] = React.useState("A1");

  return (
    <div className="bg-gray-100 border-b border-gray-300 p-1 flex items-center gap-2">
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-600">名前ボックス</span>
        <input
          type="text"
          value={selectedRange}
          onChange={(e) => setSelectedRange(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded text-xs w-20"
        />
      </div>
      <div className="flex items-center gap-1">
        <button className="px-2 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">
          ▼
        </button>
      </div>
    </div>
  );
}

export default function ExcelSurveyUI() {
  const [selectedCellAddress, setSelectedCellAddress] = React.useState("A1");
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

  // セル選択時の処理
  const handleCellSelect = (
    cellParams: CellParameters,
    rowIndex: number,
    colIndex: number,
  ) => {
    const cellAddress = `${String.fromCharCode(65 + colIndex)}${rowIndex + 1}`;
    setSelectedCellAddress(cellAddress);
    setSelectedCellParams(cellParams);
    setShowCellDetails(true);
  };

  // セルパラメータ更新時の処理
  const handleCellUpdate = (
    cellParams: CellParameters,
    rowIndex: number,
    colIndex: number,
  ) => {
    setSelectedCellParams(cellParams);
  };

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
        <SheetModeGrid
          onCellSelect={handleCellSelect}
          onCellUpdate={handleCellUpdate}
        />

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
