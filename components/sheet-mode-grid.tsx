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

// Excel風のセル型定義
interface ExcelCell {
  value: string;
  isMerged?: boolean;
  mergeRange?: { row: number; col: number; rowSpan: number; colSpan: number };
  isSelected?: boolean;
  isEditing?: boolean;
  parameters: CellParameters;
  colspan?: number;
  rowspan?: number;
  isHidden?: boolean;
}

// Excel風の行型定義
interface ExcelRow {
  id: number;
  cells: ExcelCell[];
  height?: number;
}

// デフォルトのセルパラメータ
const getDefaultCellParameters = (): CellParameters => ({
  value: "",
  formula: "",
  format: "General",
  fontFamily: "Calibri",
  fontSize: 11,
  isBold: false,
  isItalic: false,
  isUnderline: false,
  textAlign: "left",
  backgroundColor: "#ffffff",
  textColor: "#000000",
  borderStyle: "solid",
  dataType: "text",
  validation: "",
  comment: ""
});

// 列定義
const columns = [
  { key: "A", name: "回答者設問カウント", width: 120 },
  { key: "B", name: "見積設問カウント", width: 120 },
  { key: "C", name: "セクション", width: 120 },
  { key: "D", name: "設問番号", width: 100 },
  { key: "E", name: "設問タイトル", width: 200 },
  { key: "F", name: "設問内容", width: 200 },
  { key: "G", name: "選択肢", width: 150 },
  { key: "H", name: "条件", width: 150 },
  { key: "I", name: "備考", width: 150 },
  { key: "J", name: "予備1", width: 120 },
  { key: "K", name: "予備2", width: 120 },
  { key: "L", name: "予備3", width: 120 },
  { key: "M", name: "予備4", width: 120 },
  { key: "N", name: "予備5", width: 120 },
  { key: "O", name: "予備6", width: 120 },
  { key: "P", name: "予備7", width: 120 },
  { key: "Q", name: "予備8", width: 120 },
  { key: "R", name: "予備9", width: 120 },
  { key: "S", name: "予備10", width: 120 },
  { key: "T", name: "予備11", width: 120 },
  { key: "U", name: "予備12", width: 120 },
  { key: "V", name: "予備13", width: 120 },
  { key: "W", name: "予備14", width: 120 },
  { key: "X", name: "予備15", width: 120 },
  { key: "Y", name: "予備16", width: 120 },
  { key: "Z", name: "予備17", width: 120 },
];

// セル生成時は必ず13セルにする
const padCells = (cells: ExcelCell[]): ExcelCell[] => {
  const diff = columns.length - cells.length;
  if (diff > 0) {
    for (let i = 0; i < diff; i++) {
      cells.push({ value: "", parameters: { ...getDefaultCellParameters(), value: "" } });
    }
  }
  return cells;
};

// 初期データ
const createInitialData = (): ExcelRow[] => {
  const sections = [
    { 
      name: "スクリーニング", 
      count: 5,
      questions: [
        {
          title: "年齢確認",
          content: "あなたの年齢を教えてください",
          choices: ["18歳未満", "18-24歳", "25-34歳", "35-44歳", "45-54歳", "55歳以上"],
          conditions: "18歳以上のみ継続",
          required: "必須",
          type: "単一選択"
        },
        {
          title: "居住地域",
          content: "お住まいの都道府県を教えてください",
          choices: ["北海道", "東北", "関東", "中部", "近畿", "中国", "四国", "九州・沖縄"],
          conditions: "関東在住者のみ対象",
          required: "必須",
          type: "単一選択"
        },
        {
          title: "職業",
          content: "現在の職業を教えてください",
          choices: ["会社員", "公務員", "自営業", "学生", "専業主婦", "その他"],
          conditions: "会社員・公務員のみ対象",
          required: "必須",
          type: "単一選択"
        },
        {
          title: "調査経験",
          content: "過去1年間にアンケート調査に参加したことがありますか",
          choices: ["はい", "いいえ"],
          conditions: "調査経験なしのみ対象",
          required: "必須",
          type: "単一選択"
        },
        {
          title: "インターネット利用",
          content: "1日のインターネット利用時間を教えてください",
          choices: ["1時間未満", "1-3時間", "3-5時間", "5時間以上"],
          conditions: "3時間以上利用者のみ対象",
          required: "必須",
          type: "単一選択"
        }
      ]
    },
    { 
      name: "メイン調査", 
      count: 8,
      questions: [
        {
          title: "商品認知度",
          content: "当社の商品を知っていますか",
          choices: ["よく知っている", "知っている", "少し知っている", "知らない"],
          conditions: "認知度調査",
          required: "任意",
          type: "単一選択"
        },
        {
          title: "使用経験",
          content: "当社の商品を使用したことがありますか",
          choices: ["現在使用中", "過去に使用", "使用したことがない"],
          conditions: "使用経験者対象",
          required: "必須",
          type: "単一選択"
        },
        {
          title: "満足度",
          content: "商品の満足度を教えてください",
          choices: ["非常に満足", "満足", "普通", "不満", "非常に不満"],
          conditions: "使用経験者のみ",
          required: "必須",
          type: "単一選択"
        },
        {
          title: "購入意向",
          content: "今後当社の商品を購入する意向はありますか",
          choices: ["必ず購入する", "購入したい", "どちらでもない", "購入したくない", "絶対購入しない"],
          conditions: "購入意向調査",
          required: "必須",
          type: "単一選択"
        },
        {
          title: "価格感度",
          content: "商品の価格についてどう思いますか",
          choices: ["非常に安い", "安い", "適正", "高い", "非常に高い"],
          conditions: "価格感度調査",
          required: "必須",
          type: "単一選択"
        },
        {
          title: "改善点",
          content: "商品の改善点があれば教えてください",
          choices: ["品質", "デザイン", "価格", "機能", "その他"],
          conditions: "自由回答可",
          required: "任意",
          type: "複数選択"
        },
        {
          title: "推奨度",
          content: "友人や家族に当社の商品を推奨しますか",
          choices: ["強く推奨する", "推奨する", "どちらでもない", "推奨しない", "絶対推奨しない"],
          conditions: "推奨度調査",
          required: "必須",
          type: "単一選択"
        },
        {
          title: "追加コメント",
          content: "その他ご意見・ご要望があればお聞かせください",
          choices: ["自由回答"],
          conditions: "任意回答",
          required: "任意",
          type: "自由記述"
        }
      ]
    }
  ];
  
  let id = 1;
  const rows: ExcelRow[] = [];
  
  sections.forEach((section, sectionIndex) => {
    // セクションヘッダー行を追加
    if (sectionIndex > 0) {
      // 改ページ行を追加
      rows.push({
        id: id++,
        cells: padCells([
          { 
            value: "改ページ",
            parameters: { ...getDefaultCellParameters(), value: "改ページ", backgroundColor: "#d4d4d4", isBold: true, textAlign: "center", fontSize: 14 }
          },
          { 
            value: "",
            parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#d4d4d4" }
          },
          { 
            value: "",
            parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#d4d4d4" }
          },
          { 
            value: "",
            parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#d4d4d4" }
          },
          { 
            value: "",
            parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#d4d4d4" }
          },
          { 
            value: "",
            parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#d4d4d4" }
          },
          { 
            value: "",
            parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#d4d4d4" }
          },
          { 
            value: "",
            parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#d4d4d4" }
          },
          { 
            value: "",
            parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#d4d4d4" }
          },
          { 
            value: "",
            parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#d4d4d4" }
          },
          { 
            value: "",
            parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#d4d4d4" }
          },
          { 
            value: "",
            parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#d4d4d4" }
          },
          { 
            value: "",
            parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#d4d4d4" }
          },
          { 
            value: "",
            parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#d4d4d4" }
          },
          { 
            value: "",
            parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#d4d4d4" }
          },
          { 
            value: "",
            parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#d4d4d4" }
          },
          { 
            value: "",
            parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#d4d4d4" }
          },
          { 
            value: "",
            parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#d4d4d4" }
          },
          { 
            value: "",
            parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#d4d4d4" }
          },
          { 
            value: "",
            parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#d4d4d4" }
          },
          { 
            value: "",
            parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#d4d4d4" }
          },
          { 
            value: "",
            parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#d4d4d4" }
          },
          { 
            value: "",
            parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#d4d4d4" }
          },
          { 
            value: "",
            parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#d4d4d4" }
          },
        ])
      });
    }
    
    // セクションタイトル行を追加
    rows.push({
      id: id++,
      cells: padCells([
        { 
          value: "回答者設問カウント",
          parameters: { ...getDefaultCellParameters(), value: "回答者設問カウント", backgroundColor: "#4472c4", textColor: "#ffffff", isBold: true, fontSize: 11, textAlign: "center" }
        },
        { 
          value: "見積設問カウント",
          parameters: { ...getDefaultCellParameters(), value: "見積設問カウント", backgroundColor: "#4472c4", textColor: "#ffffff", isBold: true, fontSize: 11, textAlign: "center" }
        },
        { 
          value: "セクション",
          parameters: { ...getDefaultCellParameters(), value: "セクション", backgroundColor: "#4472c4", textColor: "#ffffff", isBold: true, fontSize: 11, textAlign: "center" }
        },
        { 
          value: "設問番号",
          parameters: { ...getDefaultCellParameters(), value: "設問番号", backgroundColor: "#4472c4", textColor: "#ffffff", isBold: true, fontSize: 11, textAlign: "center" }
        },
        { 
          value: "設問タイトル",
          parameters: { ...getDefaultCellParameters(), value: "設問タイトル", backgroundColor: "#4472c4", textColor: "#ffffff", isBold: true, fontSize: 11, textAlign: "center" }
        },
        { 
          value: "設問内容",
          parameters: { ...getDefaultCellParameters(), value: "設問内容", backgroundColor: "#4472c4", textColor: "#ffffff", isBold: true, fontSize: 11, textAlign: "center" }
        },
        { 
          value: "選択肢",
          parameters: { ...getDefaultCellParameters(), value: "選択肢", backgroundColor: "#4472c4", textColor: "#ffffff", isBold: true, fontSize: 11, textAlign: "center" }
        },
        { 
          value: "条件",
          parameters: { ...getDefaultCellParameters(), value: "条件", backgroundColor: "#4472c4", textColor: "#ffffff", isBold: true, fontSize: 11, textAlign: "center" }
        },
        { 
          value: "備考",
          parameters: { ...getDefaultCellParameters(), value: "備考", backgroundColor: "#4472c4", textColor: "#ffffff", isBold: true, fontSize: 11, textAlign: "center" }
        },
        { 
          value: "予備1",
          parameters: { ...getDefaultCellParameters(), value: "予備1", backgroundColor: "#4472c4", textColor: "#ffffff", isBold: true, fontSize: 11, textAlign: "center" }
        },
        { 
          value: "予備2",
          parameters: { ...getDefaultCellParameters(), value: "予備2", backgroundColor: "#4472c4", textColor: "#ffffff", isBold: true, fontSize: 11, textAlign: "center" }
        },
        { 
          value: "予備3",
          parameters: { ...getDefaultCellParameters(), value: "予備3", backgroundColor: "#4472c4", textColor: "#ffffff", isBold: true, fontSize: 11, textAlign: "center" }
        },
        { 
          value: "予備4",
          parameters: { ...getDefaultCellParameters(), value: "予備4", backgroundColor: "#4472c4", textColor: "#ffffff", isBold: true, fontSize: 11, textAlign: "center" }
        },
      ])
    });
    
    // 設問行を追加
    for (let i = 0; i < section.count; i++) {
      const question = section.questions[i];
      const questionId = id;
      
      // 設問区切り行を追加（最初の設問以外）
      if (i > 0) {
        rows.push({
          id: id++,
          cells: padCells([
            { 
              value: "設問区切り",
              parameters: { ...getDefaultCellParameters(), value: "設問区切り", backgroundColor: "#e7e6e6", isBold: true, textAlign: "center", fontSize: 10 }
            },
            { 
              value: "",
              parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#e7e6e6" }
            },
            { 
              value: "",
              parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#e7e6e6" }
            },
            { 
              value: "",
              parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#e7e6e6" }
            },
            { 
              value: "",
              parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#e7e6e6" }
            },
            { 
              value: "",
              parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#e7e6e6" }
            },
            { 
              value: "",
              parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#e7e6e6" }
            },
            { 
              value: "",
              parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#e7e6e6" }
            },
            { 
              value: "",
              parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#e7e6e6" }
            },
            { 
              value: "",
              parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#e7e6e6" }
            },
            { 
              value: "",
              parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#e7e6e6" }
            },
            { 
              value: "",
              parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#e7e6e6" }
            },
            { 
              value: "",
              parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#e7e6e6" }
            },
            { 
              value: "",
              parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#e7e6e6" }
            },
            { 
              value: "",
              parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#e7e6e6" }
            },
            { 
              value: "",
              parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#e7e6e6" }
            },
            { 
              value: "",
              parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#e7e6e6" }
            },
            { 
              value: "",
              parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#e7e6e6" }
            },
            { 
              value: "",
              parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#e7e6e6" }
            },
            { 
              value: "",
              parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#e7e6e6" }
            },
            { 
              value: "",
              parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#e7e6e6" }
            },
            { 
              value: "",
              parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#e7e6e6" }
            },
            { 
              value: "",
              parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#e7e6e6" }
            },
            { 
              value: "",
              parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#e7e6e6" }
            },
          ])
        });
      }
      
      // 設問ヘッダー行（基本情報）
      rows.push({
        id: id++,
        cells: padCells([
          { 
            value: `${i + 1}`,
            parameters: { ...getDefaultCellParameters(), value: `${i + 1}`, backgroundColor: "#d9e1f2", textColor: "#000000", isBold: true, fontSize: 11, textAlign: "center" }
          },
          { 
            value: `${i + 1}`,
            parameters: { ...getDefaultCellParameters(), value: `${i + 1}`, backgroundColor: "#d9e1f2", textColor: "#000000", isBold: true, fontSize: 11, textAlign: "center" }
          },
          { 
            value: section.name,
            parameters: { ...getDefaultCellParameters(), value: section.name, backgroundColor: "#f2f2f2", isBold: true, fontSize: 11 }
          },
          { 
            value: `Q${questionId}`,
            parameters: { ...getDefaultCellParameters(), value: `Q${questionId}`, isBold: true, textAlign: "center", backgroundColor: "#d9e1f2", fontSize: 11 }
          },
          { 
            value: question.title,
            parameters: { ...getDefaultCellParameters(), value: question.title, isBold: true, fontSize: 11, backgroundColor: "#ffffff" }
          },
          { 
            value: question.content,
            parameters: { ...getDefaultCellParameters(), value: question.content, fontSize: 10, backgroundColor: "#ffffff" }
          },
          { 
            value: "",
            parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#fff2cc" }
          },
          { 
            value: question.conditions,
            parameters: { ...getDefaultCellParameters(), value: question.conditions, fontSize: 9, textColor: "#7030a0", backgroundColor: "#e1d5e7" }
          },
          { 
            value: "",
            parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#ffffff" }
          },
          { 
            value: "予備1",
            parameters: { ...getDefaultCellParameters(), value: "予備1", backgroundColor: "#d9e1f2", textColor: "#000000", isBold: true, fontSize: 11, textAlign: "center" }
          },
          { 
            value: "予備2",
            parameters: { ...getDefaultCellParameters(), value: "予備2", backgroundColor: "#d9e1f2", textColor: "#000000", isBold: true, fontSize: 11, textAlign: "center" }
          },
          { 
            value: "予備3",
            parameters: { ...getDefaultCellParameters(), value: "予備3", backgroundColor: "#d9e1f2", textColor: "#000000", isBold: true, fontSize: 11, textAlign: "center" }
          },
          { 
            value: "予備4",
            parameters: { ...getDefaultCellParameters(), value: "予備4", backgroundColor: "#d9e1f2", textColor: "#000000", isBold: true, fontSize: 11, textAlign: "center" }
          },
        ])
      });
      
      // 選択肢行を追加（各選択肢を1行ずつ）
      question.choices.forEach((choice, choiceIndex) => {
        rows.push({
          id: id++,
          cells: padCells([
            { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#f8f9fa" } },
            { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#f8f9fa" } },
            { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#f8f9fa" } },
            { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#f8f9fa" } },
            { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#f8f9fa" } },
            { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#f8f9fa" } },
            { value: `${choiceIndex + 1}. ${choice}`, parameters: { ...getDefaultCellParameters(), value: `${choiceIndex + 1}. ${choice}`, fontSize: 9, isItalic: true, backgroundColor: "#fff2cc", textAlign: "left" } },
            { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#f8f9fa" } },
            { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#f8f9fa" } },
            { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#f8f9fa" } },
            { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#f8f9fa" } },
            { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#f8f9fa" } },
            { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#f8f9fa" } },
            { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#f8f9fa" } },
          ])
        });
      });
    }
  });
  
  return rows;
};

interface SheetModeGridProps {
  onCellSelect?: (cellParams: CellParameters, rowIndex: number, colIndex: number) => void;
  onCellUpdate?: (cellParams: CellParameters, rowIndex: number, colIndex: number) => void;
}

export default function SheetModeGrid({ onCellSelect, onCellUpdate }: SheetModeGridProps) {
  const [data, setData] = React.useState<ExcelRow[]>(createInitialData());
  const [selectedCell, setSelectedCell] = React.useState<{ row: number; col: number } | null>(null);
  const [editingCell, setEditingCell] = React.useState<{ row: number; col: number } | null>(null);
  const [editValue, setEditValue] = React.useState("");
  const [saved, setSaved] = React.useState(true);
  const [columnWidths, setColumnWidths] = React.useState<{ [key: string]: number }>(() => {
    const widths: { [key: string]: number } = {};
    columns.forEach(col => {
      widths[col.key] = col.width;
    });
    return widths;
  });
  const [rowHeights, setRowHeights] = React.useState<{ [key: number]: number }>({});
  const [isResizing, setIsResizing] = React.useState(false);
  const [resizeType, setResizeType] = React.useState<'column' | 'row' | null>(null);
  const [resizeIndex, setResizeIndex] = React.useState<number | null>(null);
  const [resizeStart, setResizeStart] = React.useState<number>(0);
  // state追加
  const [selectedRow, setSelectedRow] = React.useState<number|null>(null);
  const [selectedCol, setSelectedCol] = React.useState<number|null>(null);

  // 現在選択されているセルのパラメータを取得
  const getCurrentCellParameters = () => {
    if (!selectedCell) return getDefaultCellParameters();
    return data[selectedCell.row]?.cells[selectedCell.col]?.parameters || getDefaultCellParameters();
  };

  // フォント変更
  const handleFontChange = (fontFamily: string) => {
    if (!selectedCell) return;
    const newData = [...data];
    newData[selectedCell.row].cells[selectedCell.col].parameters.fontFamily = fontFamily;
    setData(newData);
    setSaved(false);
  };

  // フォントサイズ変更
  const handleFontSizeChange = (fontSize: number) => {
    if (!selectedCell) return;
    const newData = [...data];
    newData[selectedCell.row].cells[selectedCell.col].parameters.fontSize = fontSize;
    setData(newData);
    setSaved(false);
  };

  // 太字切り替え
  const handleBoldToggle = () => {
    if (!selectedCell) return;
    const newData = [...data];
    const current = newData[selectedCell.row].cells[selectedCell.col].parameters.isBold;
    newData[selectedCell.row].cells[selectedCell.col].parameters.isBold = !current;
    setData(newData);
    setSaved(false);
  };

  // 斜体切り替え
  const handleItalicToggle = () => {
    if (!selectedCell) return;
    const newData = [...data];
    const current = newData[selectedCell.row].cells[selectedCell.col].parameters.isItalic;
    newData[selectedCell.row].cells[selectedCell.col].parameters.isItalic = !current;
    setData(newData);
    setSaved(false);
  };

  // 下線切り替え
  const handleUnderlineToggle = () => {
    if (!selectedCell) return;
    const newData = [...data];
    const current = newData[selectedCell.row].cells[selectedCell.col].parameters.isUnderline;
    newData[selectedCell.row].cells[selectedCell.col].parameters.isUnderline = !current;
    setData(newData);
    setSaved(false);
  };

  // テキスト配置変更
  const handleTextAlignChange = (align: string) => {
    if (!selectedCell) return;
    const newData = [...data];
    newData[selectedCell.row].cells[selectedCell.col].parameters.textAlign = align;
    setData(newData);
    setSaved(false);
  };

  // 行挿入（選択行の上）
  const handleInsertRowAbove = () => {
    if (!selectedCell) return;
    const newData = [...data];
    const newRow: ExcelRow = {
      id: Date.now(),
      cells: padCells([
        { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#ffffff" } },
        { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#ffffff" } },
        { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#ffffff" } },
        { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#ffffff" } },
        { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#ffffff" } },
        { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#ffffff" } },
        { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#ffffff" } },
        { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#ffffff" } },
        { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#ffffff" } },
      ])
    };
    newData.splice(selectedCell.row, 0, newRow);
    setData(newData);
    setSaved(false);
  };

  // 列挿入（選択列の左）
  const handleInsertColumnLeft = () => {
    if (!selectedCell) return;
    const newData = data.map(row => ({
      ...row,
      cells: [
        ...row.cells.slice(0, selectedCell.col),
        { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#ffffff" } },
        ...row.cells.slice(selectedCell.col)
      ]
    }));
    setData(newData);
    setSaved(false);
  };

  // 行削除
  const handleDeleteRow = () => {
    if (!selectedCell) return;
    const newData = [...data];
    newData.splice(selectedCell.row, 1);
    setData(newData);
    setSelectedCell(null);
    setSaved(false);
  };

  // 列削除
  const handleDeleteColumn = () => {
    if (!selectedCell) return;
    const newData = data.map(row => ({
      ...row,
      cells: row.cells.filter((_, index) => index !== selectedCell.col)
    }));
    setData(newData);
    setSelectedCell(null);
    setSaved(false);
  };

  // セル結合
  const handleMergeCells = () => {
    if (!selectedCell) return;
    const newData = [...data];
    const cell = newData[selectedCell.row].cells[selectedCell.col];
    cell.colspan = 2; // 2列分結合
    // 隣のセルを隠す
    if (selectedCell.col + 1 < newData[selectedCell.row].cells.length) {
      newData[selectedCell.row].cells[selectedCell.col + 1].isHidden = true;
    }
    setData(newData);
    setSaved(false);
  };

  // セル分割
  const handleSplitCells = () => {
    if (!selectedCell) return;
    const newData = [...data];
    const cell = newData[selectedCell.row].cells[selectedCell.col];
    cell.colspan = undefined;
    // 隠されたセルを表示
    if (selectedCell.col + 1 < newData[selectedCell.row].cells.length) {
      newData[selectedCell.row].cells[selectedCell.col + 1].isHidden = false;
    }
    setData(newData);
    setSaved(false);
  };

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    setSelectedCell({ row: rowIndex, col: colIndex });
    if (onCellSelect && data[rowIndex] && data[rowIndex].cells[colIndex]) {
      onCellSelect(data[rowIndex].cells[colIndex].parameters, rowIndex, colIndex);
    }
  };

  const handleCellDoubleClick = (rowIndex: number, colIndex: number) => {
    setEditingCell({ row: rowIndex, col: colIndex });
    setEditValue(data[rowIndex].cells[colIndex].value);
  };

  const handleCellSave = () => {
    if (editingCell) {
      const newData = [...data];
      newData[editingCell.row].cells[editingCell.col].value = editValue;
      newData[editingCell.row].cells[editingCell.col].parameters.value = editValue;
      setData(newData);
      setSaved(false);
      
      if (onCellUpdate) {
        onCellUpdate(newData[editingCell.row].cells[editingCell.col].parameters, editingCell.row, editingCell.col);
      }
      
      setEditingCell(null);
      setEditValue("");
    }
  };

  const updateCellParameters = (cellParams: CellParameters, rowIndex: number, colIndex: number) => {
    const newData = [...data];
    newData[rowIndex].cells[colIndex].parameters = cellParams;
    setData(newData);
    setSaved(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCellSave();
    } else if (e.key === "Escape") {
      setEditingCell(null);
      setEditValue("");
    }
  };

  const handleInsertRow = () => {
    // 2行目の下に5行分追加
    const targetRowIndex = 2; // 2行目（0ベースなので2）
    const insertCount = 5; // 5行分追加
    
    const newData = [...data];
    
    // 新しい行を生成
    for (let i = 0; i < insertCount; i++) {
      const newRow: ExcelRow = {
        id: Date.now() + i, // ユニークなID
        cells: padCells([
          { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#ffffff" } },
          { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#ffffff" } },
          { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#ffffff" } },
          { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#ffffff" } },
          { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#ffffff" } },
          { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#ffffff" } },
          { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#ffffff" } },
          { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#ffffff" } },
          { value: "", parameters: { ...getDefaultCellParameters(), value: "", backgroundColor: "#ffffff" } },
        ])
      };
      
      // 2行目の下に挿入
      newData.splice(targetRowIndex + 1 + i, 0, newRow);
    }
    
    setData(newData);
    setSaved(false);
  };

  const handleInsertColumn = () => {
    const newData = data.map(row => ({
      ...row,
      cells: [...row.cells, {
        value: "",
        parameters: getDefaultCellParameters()
      }]
    }));
    setData(newData);
    setSaved(false);
  };

  const getCellStyle = (cell: ExcelCell) => {
    const style: React.CSSProperties = {
      backgroundColor: cell.parameters.backgroundColor,
      color: cell.parameters.textColor,
      fontFamily: cell.parameters.fontFamily,
      fontSize: `${cell.parameters.fontSize}px`,
      fontWeight: cell.parameters.isBold ? "bold" : "normal",
      fontStyle: cell.parameters.isItalic ? "italic" : "normal",
      textDecoration: cell.parameters.isUnderline ? "underline" : "none",
      textAlign: cell.parameters.textAlign as "left" | "center" | "right",
      border: cell.parameters.borderStyle === "solid" ? "1px solid #a6a6a6" : "none"
    };
    return style;
  };

  // 列幅リサイズ機能
  const handleColumnResizeStart = (e: React.MouseEvent, colIndex: number) => {
    e.preventDefault();
    setIsResizing(true);
    setResizeType('column');
    setResizeIndex(colIndex);
    setResizeStart(e.clientX);
  };

  const handleRowResizeStart = (e: React.MouseEvent, rowIndex: number) => {
    e.preventDefault();
    setIsResizing(true);
    setResizeType('row');
    setResizeIndex(rowIndex);
    setResizeStart(e.clientY);
  };

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (!isResizing || resizeType === null || resizeIndex === null) return;

    if (resizeType === 'column') {
      const delta = e.clientX - resizeStart;
      const newWidth = Math.max(50, columnWidths[columns[resizeIndex].key] + delta);
      setColumnWidths(prev => ({
        ...prev,
        [columns[resizeIndex].key]: newWidth
      }));
      setResizeStart(e.clientX);
    } else if (resizeType === 'row') {
      const delta = e.clientY - resizeStart;
      const currentHeight = rowHeights[resizeIndex] || 20;
      const newHeight = Math.max(15, currentHeight + delta);
      setRowHeights(prev => ({
        ...prev,
        [resizeIndex]: newHeight
      }));
      setResizeStart(e.clientY);
    }
  }, [isResizing, resizeType, resizeIndex, resizeStart, columnWidths, rowHeights]);

  const handleMouseUp = React.useCallback(() => {
    setIsResizing(false);
    setResizeType(null);
    setResizeIndex(null);
  }, []);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const currentCellParams = getCurrentCellParameters();

  return (
    <>
      {/* Excel風ツールバー */}
      <div className="bg-gray-100 border-b border-gray-300 p-2 flex items-center gap-2">
        <div className="flex items-center gap-1">
          <select 
            className="px-2 py-1 bg-white border border-gray-300 rounded text-xs"
            value={currentCellParams.fontFamily}
            onChange={(e) => handleFontChange(e.target.value)}
          >
            <option value="Segoe UI">Segoe UI</option>
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Calibri">Calibri</option>
            <option value="Verdana">Verdana</option>
          </select>
          <select 
            className="px-2 py-1 bg-white border border-gray-300 rounded text-xs"
            value={currentCellParams.fontSize}
            onChange={(e) => handleFontSizeChange(Number(e.target.value))}
          >
            <option value={8}>8</option>
            <option value={9}>9</option>
            <option value={10}>10</option>
            <option value={11}>11</option>
            <option value={12}>12</option>
            <option value={14}>14</option>
            <option value={16}>16</option>
            <option value={18}>18</option>
            <option value={20}>20</option>
            <option value={24}>24</option>
          </select>
        </div>
        <div className="w-px h-6 bg-gray-300"></div>
        <div className="flex items-center gap-1">
          <button 
            className={`px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50 ${currentCellParams.isBold ? 'bg-blue-100 border-blue-500' : 'bg-white'}`}
            onClick={handleBoldToggle}
          >
            <strong>B</strong>
          </button>
          <button 
            className={`px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50 ${currentCellParams.isItalic ? 'bg-blue-100 border-blue-500' : 'bg-white'}`}
            onClick={handleItalicToggle}
          >
            <em>I</em>
          </button>
          <button 
            className={`px-3 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50 ${currentCellParams.isUnderline ? 'bg-blue-100 border-blue-500' : 'bg-white'}`}
            onClick={handleUnderlineToggle}
          >
            <u>U</u>
          </button>
        </div>
        <div className="w-px h-6 bg-gray-300"></div>
        <div className="flex items-center gap-1">
          <button 
            className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50"
            onClick={handleMergeCells}
          >
            セル結合
          </button>
          <button 
            className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50"
            onClick={handleSplitCells}
          >
            セル分割
          </button>
          <button className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50">
            境界線
          </button>
        </div>
        <div className="w-px h-6 bg-gray-300"></div>
        <div className="flex items-center gap-1">
          <button 
            className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50"
            onClick={handleInsertRowAbove}
          >
            行挿入
          </button>
          <button 
            className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50"
            onClick={handleInsertColumnLeft}
          >
            列挿入
          </button>
          <button 
            className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50"
            onClick={handleDeleteRow}
          >
            行削除
          </button>
          <button 
            className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50"
            onClick={handleDeleteColumn}
          >
            列削除
          </button>
        </div>
      </div>

            <div className="flex w-full">
  {/* 左側：固定列（# + A〜M列） */}
  <div style={{ minWidth: `${(13 + 1) * 150}px`, maxWidth: `${(13 + 1) * 150}px`, overflow: 'hidden' }}>
    <table className="border-collapse w-full">
      <thead>
        <tr>
          <th style={{ width: 50, minWidth: 50, position: 'relative' }}>#</th>
          {columns.slice(0, 13).map((col, index) => (
            <th
              key={col.key}
              style={{ width: columnWidths[col.key], minWidth: 50, position: 'relative' }}
              onClick={() => {
                setSelectedCol(index);
                setSelectedRow(null);
              }}
              className={selectedCol === index ? 'col-highlight' : ''}
            >
              {col.key}
              <div
                className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-blue-500"
                onMouseDown={(e) => handleColumnResizeStart(e, index)}
                style={{ zIndex: 20 }}
              />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <React.Fragment key={row.id}>
            <tr
              className={`
                ${rowIndex === 0 ? 'border-t-4' : ''}
                ${row.cells[0]?.value === 'セクション' ? 'border-t-2' : ''}
                ${row.cells[0]?.value === '設問区切り' ? 'border-t-2 border-t-gray-300' : ''}
              `}
              style={{ height: rowHeights[rowIndex] || 'auto', minHeight: 20 }}
            >
              {/* 行番号セル */}
              <td
                style={{
                  width: 50,
                  minWidth: 50,
                  backgroundColor: '#f8f9fa',
                  textAlign: 'center',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  color: '#666666',
                  border: '1px solid #a6a6a6',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setSelectedRow(rowIndex);
                  setSelectedCol(null);
                }}
                className={selectedRow === rowIndex ? 'row-highlight' : ''}
              >
                {rowIndex + 1}
              </td>
              {(() => {
                let visibleColIndex = 0;
                return row.cells.slice(0, 13).map((cell, colIndex) => {
                  if (cell.isHidden) return null;
                  const currentVisibleIndex = visibleColIndex;
                  visibleColIndex += cell.colspan || 1;
                  const isRowHighlight = selectedRow === rowIndex;
                  const isColHighlight = selectedCol === colIndex;
                  return (
                    <td
                      key={colIndex}
                      className={`
                        ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? 'selected' : ''}
                        ${editingCell?.row === rowIndex && editingCell?.col === colIndex ? 'editing' : ''}
                        ${isRowHighlight ? 'row-highlight' : ''}
                        ${isColHighlight ? 'col-highlight' : ''}
                      `}
                      style={{
                        ...getCellStyle(cell),
                        width: columnWidths[columns[currentVisibleIndex]?.key] || 150,
                        minWidth: 50,
                        position: 'relative'
                      }}
                      colSpan={cell.colspan}
                      rowSpan={cell.rowspan}
                      onClick={() => {
                        handleCellClick(rowIndex, colIndex);
                        setSelectedRow(null);
                        setSelectedCol(null);
                      }}
                      onDoubleClick={() => handleCellDoubleClick(rowIndex, colIndex)}
                    >
                      {editingCell?.row === rowIndex && editingCell?.col === colIndex ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                          onBlur={handleCellSave}
                          autoFocus
                          style={{
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            outline: 'none',
                            background: 'transparent',
                            fontSize: cell.parameters.fontSize,
                            fontFamily: cell.parameters.fontFamily,
                            fontWeight: cell.parameters.isBold ? 'bold' : 'normal',
                            fontStyle: cell.parameters.isItalic ? 'italic' : 'normal',
                            textAlign: cell.parameters.textAlign as 'left' | 'center' | 'right'
                          }}
                        />
                      ) : (
                        cell.value
                      )}
                    </td>
                  );
                });
              })()}
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  </div>
  {/* 右側：N列以降（スクロール） */}
  <div className="overflow-x-auto scrollbar" style={{ minWidth: '0', flex: 1 }}>
    <table className="border-collapse w-full" style={{ minWidth: `${Math.max(columns.length - 13, 1) * 150}px` }}>
      <thead>
        <tr>
          {columns.slice(13).map((col, index) => (
            <th
              key={col.key}
              style={{ width: columnWidths[col.key], minWidth: 50, position: 'relative' }}
              onClick={() => {
                setSelectedCol(13 + index);
                setSelectedRow(null);
              }}
              className={selectedCol === (13 + index) ? 'col-highlight' : ''}
            >
              {col.key}
              <div
                className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-blue-500"
                onMouseDown={(e) => handleColumnResizeStart(e, 13 + index)}
                style={{ zIndex: 20 }}
              />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <React.Fragment key={row.id}>
            <tr
              className={`
                ${rowIndex === 0 ? 'border-t-4' : ''}
                ${row.cells[0]?.value === 'セクション' ? 'border-t-2' : ''}
                ${row.cells[0]?.value === '設問区切り' ? 'border-t-2 border-t-gray-300' : ''}
              `}
              style={{ height: rowHeights[rowIndex] || 'auto', minHeight: 20 }}
            >
              {(() => {
                let visibleColIndex = 0;
                return row.cells.slice(13).map((cell, colIndex) => {
                  if (cell.isHidden) return null;
                  const currentVisibleIndex = visibleColIndex;
                  visibleColIndex += cell.colspan || 1;
                  const isRowHighlight = selectedRow === rowIndex;
                  const isColHighlight = selectedCol === (13 + colIndex);
                  return (
                    <td
                      key={colIndex}
                      className={`
                        ${selectedCell?.row === rowIndex && selectedCell?.col === (13 + colIndex) ? 'selected' : ''}
                        ${editingCell?.row === rowIndex && editingCell?.col === (13 + colIndex) ? 'editing' : ''}
                        ${isRowHighlight ? 'row-highlight' : ''}
                        ${isColHighlight ? 'col-highlight' : ''}
                      `}
                      style={{
                        ...getCellStyle(cell),
                        width: columnWidths[columns[13 + currentVisibleIndex]?.key] || 150,
                        minWidth: 50,
                        position: 'relative'
                      }}
                      colSpan={cell.colspan}
                      rowSpan={cell.rowspan}
                      onClick={() => {
                        handleCellClick(rowIndex, 13 + colIndex);
                        setSelectedRow(null);
                        setSelectedCol(null);
                      }}
                      onDoubleClick={() => handleCellDoubleClick(rowIndex, 13 + colIndex)}
                    >
                      {editingCell?.row === rowIndex && editingCell?.col === (13 + colIndex) ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                          onBlur={handleCellSave}
                          autoFocus
                          style={{
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            outline: 'none',
                            background: 'transparent',
                            fontSize: cell.parameters.fontSize,
                            fontFamily: cell.parameters.fontFamily,
                            fontWeight: cell.parameters.isBold ? 'bold' : 'normal',
                            fontStyle: cell.parameters.isItalic ? 'italic' : 'normal',
                            textAlign: cell.parameters.textAlign as 'left' | 'center' | 'right'
                          }}
                        />
                      ) : (
                        cell.value
                      )}
                    </td>
                  );
                });
              })()}
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  </div>
</div>
      <style jsx global>{`
        /* Excel風のスタイル */
        table {
          font-family: 'Calibri', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 11px;
          page-break-inside: auto;
          border-collapse: collapse;
        }
        
        th, td {
          border: 1px solid #a6a6a6;
          padding: 2px 4px;
          vertical-align: middle;
          line-height: 1.2;
        }
        
        th {
          background-color: #f8f9fa;
          font-weight: bold;
          color: #333333;
          position: sticky;
          top: 0;
          z-index: 10;
          text-align: center;
          border: 1px solid #a6a6a6;
        }
        
        /* 改ページ行のスタイル */
        tr[class*="border-t-4"] {
          page-break-before: always;
          border-top: 3px solid #a6a6a6 !important;
        }
        
        /* セクションタイトル行のスタイル */
        tr[class*="border-t-2"]:not([class*="border-t-gray-300"]) {
          border-top: 2px solid #4472c4 !important;
        }
        
        /* 設問区切り行のスタイル */
        tr[class*="border-t-gray-300"] {
          border-top: 1px solid #a6a6a6 !important;
        }
        
        /* 設問行のスタイル */
        tr:not([class*="border-t-4"]):not([class*="border-t-2"]) {
          page-break-inside: avoid;
        }
        
        /* 選択肢行のスタイル */
        tr td:nth-child(7):not(:empty) {
          border-left: 2px solid #ffd700;
          padding-left: 8px;
        }
        
        /* ホバー効果 */
        tr:hover {
          background-color: #f0f0f0;
        }
        
        /* セクション間の余白 */
        tr[class*="border-t-4"] td {
          padding-top: 6px;
        }
        
        tr[class*="border-t-2"]:not([class*="border-t-gray-300"]) td {
          padding-top: 4px;
        }
        
        tr[class*="border-t-gray-300"] td {
          padding-top: 2px;
        }
        
        /* 選択肢行のインデント */
        tr td:nth-child(7):not(:empty) {
          padding-left: 12px;
        }
        
        /* Excel風のフォーカス */
        td:focus-within {
          outline: 2px solid #0078d4;
          outline-offset: -2px;
        }
        
        /* 選択されたセル */
        td.selected {
          background-color: #0078d4 !important;
          color: #ffffff !important;
        }
        
        /* リサイズハンドル */
        .cursor-col-resize {
          cursor: col-resize;
        }
        
        .cursor-row-resize {
          cursor: row-resize;
        }
        
        /* リサイズ中のスタイル */
        .resizing {
          user-select: none;
        }
      `}</style>
      {/* スクロールバーのカスタムCSS */}
      <style jsx global>{`
        .scrollbar::-webkit-scrollbar {
          height: 12px;
        }
        .scrollbar::-webkit-scrollbar-thumb {
          background: #bdbdbd;
          border-radius: 6px;
        }
        .scrollbar::-webkit-scrollbar-track {
          background: #f0f0f0;
        }
      `}</style>
      <style jsx global>{`
        .row-highlight {
          background-color: #e3f0fd !important;
        }
        .col-highlight {
          background-color: #e3f0fd !important;
        }
      `}</style>
    </>
  );
}
