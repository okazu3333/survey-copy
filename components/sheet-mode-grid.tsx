import * as React from "react";
import { type Column, DataGrid, type RowsChangeData } from "react-data-grid";

// モックデータ
const initialRows = [
  // スクリーニング
  {
    id: 1,
    number: "Q1",
    text: "あなたの性別を教えてください。",
    choiceA: "男性",
    choiceB: "女性",
    logic: "",
    branch: "Q2",
  },
  {
    id: 2,
    number: "Q2",
    text: "あなたの年齢を教えてください。",
    choiceA: "10代",
    choiceB: "20代",
    logic: "Q1=男性の場合",
    branch: "Q3",
  },
  {
    id: 3,
    number: "Q3",
    text: "あなたの職業を教えてください。",
    choiceA: "会社員",
    choiceB: "学生",
    logic: "Q2=20代の場合",
    branch: "Q4",
  },
  {
    id: 4,
    number: "Q4",
    text: "現在の居住地を教えてください。",
    choiceA: "東京都",
    choiceB: "大阪府",
    logic: "Q3=学生の場合",
    branch: "Q5",
  },
  {
    id: 5,
    number: "Q5",
    text: "アンケートへのご協力ありがとうございました。",
    choiceA: "終了",
    choiceB: "",
    logic: "",
    branch: "",
  },
  // 本調査
  {
    id: 6,
    number: "Q8",
    text: "普段利用する交通手段を教えてください。",
    choiceA: "電車",
    choiceB: "バス",
    logic: "Q1=女性の場合",
    branch: "Q9",
  },
  {
    id: 7,
    number: "Q9",
    text: "1ヶ月の平均利用回数を教えてください。",
    choiceA: "1-5回",
    choiceB: "6-10回",
    logic: "Q8=電車の場合",
    branch: "Q10",
  },
  {
    id: 8,
    number: "Q10",
    text: "交通手段を選ぶ際に重視する点は？",
    choiceA: "料金",
    choiceB: "利便性",
    logic: "Q9=6-10回の場合",
    branch: "Q11",
  },
  {
    id: 9,
    number: "Q11",
    text: "交通費の支払い方法を教えてください。",
    choiceA: "現金",
    choiceB: "ICカード",
    logic: "Q10=利便性の場合",
    branch: "Q12",
  },
  {
    id: 10,
    number: "Q12",
    text: "交通費の月額予算を教えてください。",
    choiceA: "〜5000円",
    choiceB: "5001円〜",
    logic: "Q11=ICカードの場合",
    branch: "Q13",
  },
  {
    id: 11,
    number: "Q13",
    text: "交通機関に求めるサービスは？",
    choiceA: "快適さ",
    choiceB: "速さ",
    logic: "Q12=〜5000円の場合",
    branch: "Q14",
  },
  {
    id: 12,
    number: "Q14",
    text: "今後利用したい交通手段は？",
    choiceA: "シェアサイクル",
    choiceB: "タクシー",
    logic: "Q13=快適さの場合",
    branch: "Q15",
  },
  {
    id: 13,
    number: "Q15",
    text: "アンケートへのご協力ありがとうございました。",
    choiceA: "終了",
    choiceB: "",
    logic: "",
    branch: "",
  },
];

const columns: Column<any>[] = [
  { key: "number", name: "設問番号", editable: false, width: 80 },
  { key: "text", name: "設問文", editable: true, width: 220 },
  { key: "choiceA", name: "選択肢A", editable: true, width: 120 },
  { key: "choiceB", name: "選択肢B", editable: true, width: 120 },
  { key: "logic", name: "分岐条件", editable: true, width: 180 },
  { key: "branch", name: "ロジック", editable: true, width: 180 },
];

export default function SheetModeGrid() {
  const [rows, setRows] = React.useState(initialRows);
  const [saved, setSaved] = React.useState(true);

  // セル編集確定時に自動保存
  const onRowsChange = (newRows: any[], data: RowsChangeData<any>) => {
    setRows(newRows);
    setSaved(false);
    // 疑似自動保存（1秒後に保存済み表示）
    setTimeout(() => setSaved(true), 1000);
  };

  return (
    <div style={{ width: "900px", margin: "40px auto" }}>
      <h2 style={{ fontWeight: "bold", fontSize: 20, marginBottom: 16 }}>
        設問票（シートモード）
      </h2>
      <DataGrid
        columns={columns}
        rows={rows}
        onRowsChange={onRowsChange}
        className="rdg-light"
      />
      <div style={{ marginTop: 8, color: saved ? "#16a34a" : "#f59e42" }}>
        {saved ? "保存済み" : "自動保存中..."}
      </div>
    </div>
  );
}
