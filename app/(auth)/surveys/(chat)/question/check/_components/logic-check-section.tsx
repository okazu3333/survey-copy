import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Background,
  Controls,
  type Edge,
  type Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { useMemo, useState } from "react";
import "@xyflow/react/dist/style.css";
import {
  GroupNode,
  MarriageQuestionNode,
  QuestionNode,
  StartNode,
} from "@/components/survey-flow-nodes";

// Data for children section settings (screening) - 編集画面と同期
const childrenSectionSettings = [
  { label: "必須回答", value: "必須オン", isToggled: true },
  { label: "回答者条件", value: "全員\nカテゴリ.2 - SC4 = 2" },
  {
    label: "回答制御",
    value: "カテゴリ.1 - ：SC5 ≠ 2 ～ 10　に該当しない場合はアラートを表示",
  },
  { label: "対象者条件", value: "なし" },
  { label: "スキップ条件", value: "なし" },
  { label: "カテゴリ表示順", value: "通常" },
  { label: "ジャンプ条件", value: "なし" },
];

// Data for main survey section settings - 編集画面と同期
const mainSurveySettings = [
  { label: "必須回答", value: "必須オン", isToggled: true },
  { label: "回答者条件", value: "全員" },
  { label: "回答制御", value: "なし" },
  { label: "対象者条件", value: "なし" },
  { label: "スキップ条件", value: "なし" },
  { label: "カテゴリ表示順", value: "通常" },
  { label: "ジャンプ条件", value: "なし" },
];

// 編集画面と同じデータ構造
const childrenSection = {
  title: "セクション：子どもの有無",
  questions: [
    {
      id: "Q5",
      type: "MA",
      typeLabel: "MA・複数選択方式",
      question: "あなたと同居している方をお知らせください。",
      options: [
        { id: 1, label: "自分のみ（一人暮らし）" },
        { id: 2, label: "配偶者" },
        { id: 3, label: "こども（未就学児）" },
        { id: 4, label: "こども（小学生）" },
        { id: 5, label: "こども（中高生）" },
        { id: 6, label: "こども（高校生を除く18歳以上）" },
        { id: 7, label: "自分（配偶者）の親" },
        { id: 8, label: "自分（配偶者）の兄弟姉妹" },
        { id: 9, label: "自分（配偶者）の祖父母" },
        { id: 10, label: "その他" },
      ],
      settings: [...childrenSectionSettings],
    },
  ],
};

const mainSurveySections = [
  {
    title: "セクション：男性化粧品の使用状況（使用有無、頻度）",
    questions: [
      {
        id: "Q8",
        type: "SA",
        typeLabel: "SA・単一選択方式",
        question: "あなたはどのくらいの頻度で化粧品を使用しますか？",
        options: [
          { id: 1, label: "毎日" },
          { id: 2, label: "週に数回" },
          { id: 3, label: "月に数回" },
          { id: 4, label: "ほとんど使用しない" },
        ],
        settings: [...mainSurveySettings],
      },
      {
        id: "Q9",
        type: "GR",
        typeLabel: "GR・グループ選択",
        question: "あなたが使用している化粧品の種類を教えてください。",
        options: [
          { id: 1, label: "スキンケア用品" },
          { id: 2, label: "洗顔料" },
          { id: 3, label: "化粧水" },
          { id: 4, label: "乳液・クリーム" },
          { id: 5, label: "日焼け止め" },
          { id: 6, label: "ヘアケア用品" },
        ],
        settings: [...mainSurveySettings],
      },
      {
        id: "Q10",
        type: "MA",
        typeLabel: "MA・複数選択方式",
        question: "化粧品を購入する際に重視する要素を教えてください。",
        options: [
          { id: 1, label: "価格" },
          { id: 2, label: "ブランド" },
          { id: 3, label: "効果" },
          { id: 4, label: "口コミ・評価" },
          { id: 5, label: "パッケージデザイン" },
          { id: 6, label: "成分" },
        ],
        settings: [...mainSurveySettings],
      },
      {
        id: "Q11",
        type: "SA",
        typeLabel: "SA・単一選択方式",
        question: "化粧品の情報を主にどこから得ていますか？",
        options: [
          { id: 1, label: "インターネット（SNS含む）" },
          { id: 2, label: "友人・知人" },
          { id: 3, label: "店舗スタッフ" },
          { id: 4, label: "雑誌・広告" },
          { id: 5, label: "テレビ" },
        ],
        settings: [...mainSurveySettings],
      },
      {
        id: "Q12",
        type: "NU",
        typeLabel: "NU・数値回答形式",
        question: "化粧品に月にどの程度の金額を使いますか？（円）",
        settings: [...mainSurveySettings],
      },
    ],
  },
  {
    title: "セクション：化粧品ブランドの認知・購入意向",
    questions: [
      {
        id: "Q13",
        type: "SA",
        typeLabel: "SA・単一選択方式",
        question: "最も信頼している化粧品ブランドを教えてください。",
        options: [
          { id: 1, label: "資生堂" },
          { id: 2, label: "花王" },
          { id: 3, label: "ユニリーバ" },
          { id: 4, label: "ロレアル" },
          { id: 5, label: "その他" },
        ],
        settings: [...mainSurveySettings],
      },
      {
        id: "Q14",
        type: "GR",
        typeLabel: "GR・グループ選択",
        question: "今後使用してみたい化粧品カテゴリを教えてください。",
        options: [
          { id: 1, label: "アンチエイジング製品" },
          { id: 2, label: "ニキビケア製品" },
          { id: 3, label: "美白製品" },
          { id: 4, label: "保湿製品" },
          { id: 5, label: "UV対策製品" },
          { id: 6, label: "メイクアップ製品" },
        ],
        settings: [...mainSurveySettings],
      },
      {
        id: "Q15",
        type: "MA",
        typeLabel: "MA・複数選択方式",
        question: "化粧品を購入する場所を教えてください。",
        options: [
          { id: 1, label: "ドラッグストア" },
          { id: 2, label: "デパート・百貨店" },
          { id: 3, label: "オンラインショップ" },
          { id: 4, label: "コンビニエンスストア" },
          { id: 5, label: "専門店" },
          { id: 6, label: "ディスカウントストア" },
        ],
        settings: [...mainSurveySettings],
      },
    ],
  },
];

// ノードUI用のデータ構造
const createNodeTypes = () => ({
  start: StartNode,
  question: QuestionNode,
  marriageQuestion: MarriageQuestionNode,
  group: GroupNode,
});

const initialNodes: Node[] = [
  {
    id: "start",
    type: "start",
    position: { x: 300, y: 50 },
    data: {
      label: "スクリーニング設問開始",
    },
  },
  {
    id: "group-1",
    type: "group",
    position: { x: 200, y: 200 },
    style: {
      width: 300,
      height: 400,
      backgroundColor: "#f5f5f5",
      border: "1px solid #dcdcdc",
      borderRadius: "4px",
    },
    data: {
      title: "固定セクション：性別・年齢・居住地",
    },
  },
  {
    id: "q1",
    type: "question",
    position: { x: 20, y: 40 },
    parentId: "group-1",
    extent: "parent",
    data: {
      id: "Q1",
      type: "SA",
      question: "あなたの性別を教えてください。",
    },
  },
  {
    id: "q2",
    type: "question",
    position: { x: 20, y: 160 },
    parentId: "group-1",
    extent: "parent",
    data: {
      id: "Q2",
      type: "NU",
      question: "あなたの年齢を教えてください。",
    },
  },
  {
    id: "q3",
    type: "question",
    position: { x: 20, y: 280 },
    parentId: "group-1",
    extent: "parent",
    data: {
      id: "Q3",
      type: "SA",
      question: "あなたのお住まい（都道府県）を教えてください。",
    },
  },
  {
    id: "group-marriage",
    type: "group",
    position: { x: 200, y: 650 },
    style: {
      width: 300,
      height: 220,
      backgroundColor: "#f5f5f5",
      border: "1px solid #dcdcdc",
      borderRadius: "4px",
    },
    data: {
      title: "セクション：未既婚",
    },
  },
  {
    id: "q4",
    type: "marriageQuestion",
    position: { x: 20, y: 40 },
    parentId: "group-marriage",
    extent: "parent",
    data: {},
  },
  {
    id: "group-children",
    type: "group",
    position: { x: 550, y: 650 },
    style: {
      width: 300,
      height: 180,
      backgroundColor: "#f5f5f5",
      border: "1px solid #dcdcdc",
      borderRadius: "4px",
    },
    data: {
      title: "セクション：子どもの有無",
    },
  },
  {
    id: "q5",
    type: "question",
    position: { x: 20, y: 40 },
    parentId: "group-children",
    extent: "parent",
    data: {
      id: "Q5",
      type: "MA",
      question: "あなたと同居している方をお知らせください。",
    },
  },
  {
    id: "group-3",
    type: "group",
    position: { x: 550, y: 900 },
    style: {
      width: 300,
      height: 280,
      backgroundColor: "#f5f5f5",
      border: "1px solid #dcdcdc",
      borderRadius: "4px",
    },
    data: {
      title: "セクション：職業",
    },
  },
  {
    id: "q6",
    type: "question",
    position: { x: 20, y: 40 },
    parentId: "group-3",
    extent: "parent",
    data: {
      id: "Q6",
      type: "GR",
      question: "あなたの職業を教えてください。",
    },
  },
  {
    id: "q7",
    type: "question",
    position: { x: 20, y: 160 },
    parentId: "group-3",
    extent: "parent",
    data: {
      id: "Q7",
      type: "GR",
      question: "あなたのご家族の職業を教えてください。",
    },
  },
  {
    id: "screening-end",
    type: "start",
    position: { x: 550, y: 1250 },
    data: {
      label: "スクリーニング終了",
    },
  },
  {
    id: "main-survey-start",
    type: "start",
    position: { x: 300, y: 1400 },
    data: {
      label: "本調査設問START",
    },
  },
  {
    id: "group-4",
    type: "group",
    position: { x: 200, y: 1700 },
    style: {
      width: 300,
      height: 600,
      backgroundColor: "#f5f5f5",
      border: "1px solid #dcdcdc",
      borderRadius: "4px",
    },
    data: {
      title: "セクション：男性化粧品の使用状況（使用有無、頻度）",
    },
  },
  {
    id: "q8",
    type: "question",
    position: { x: 20, y: 40 },
    parentId: "group-4",
    extent: "parent",
    data: {
      id: "Q8",
      type: "SA",
      question: "あなたはどのくらいの頻度で化粧品を使用しますか？",
      isMainSurvey: true,
    },
  },
  {
    id: "q9",
    type: "question",
    position: { x: 20, y: 160 },
    parentId: "group-4",
    extent: "parent",
    data: {
      id: "Q9",
      type: "GR",
      question: "あなたが使用している化粧品の種類を教えてください。",
      isMainSurvey: true,
    },
  },
  {
    id: "q10",
    type: "question",
    position: { x: 20, y: 280 },
    parentId: "group-4",
    extent: "parent",
    data: {
      id: "Q10",
      type: "MA",
      question: "化粧品を購入する際に重視する要素を教えてください。",
      isMainSurvey: true,
    },
  },
  {
    id: "q11",
    type: "question",
    position: { x: 20, y: 400 },
    parentId: "group-4",
    extent: "parent",
    data: {
      id: "Q11",
      type: "SA",
      question: "化粧品の情報を主にどこから得ていますか？",
      isMainSurvey: true,
    },
  },
  {
    id: "q12",
    type: "question",
    position: { x: 20, y: 520 },
    parentId: "group-4",
    extent: "parent",
    data: {
      id: "Q12",
      type: "NU",
      question: "化粧品に月にどの程度の金額を使いますか？（円）",
      isMainSurvey: true,
    },
  },
  {
    id: "group-5",
    type: "group",
    position: { x: 200, y: 2350 },
    style: {
      width: 300,
      height: 400,
      backgroundColor: "#f5f5f5",
      border: "1px solid #dcdcdc",
      borderRadius: "4px",
    },
    data: {
      title: "セクション：化粧品ブランドの認知・購入意向",
    },
  },
  {
    id: "q13",
    type: "question",
    position: { x: 20, y: 40 },
    parentId: "group-5",
    extent: "parent",
    data: {
      id: "Q13",
      type: "SA",
      question: "最も信頼している化粧品ブランドを教えてください。",
      isMainSurvey: true,
    },
  },
  {
    id: "q14",
    type: "question",
    position: { x: 20, y: 160 },
    parentId: "group-5",
    extent: "parent",
    data: {
      id: "Q14",
      type: "GR",
      question: "今後使用してみたい化粧品カテゴリを教えてください。",
      isMainSurvey: true,
    },
  },
  {
    id: "q15",
    type: "question",
    position: { x: 20, y: 280 },
    parentId: "group-5",
    extent: "parent",
    data: {
      id: "Q15",
      type: "MA",
      question: "化粧品を購入する場所を教えてください。",
      isMainSurvey: true,
    },
  },
  {
    id: "end",
    type: "start",
    position: { x: 300, y: 2800 },
    data: {
      label: "調査終了",
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e-start-q1",
    source: "start",
    target: "q1",
    animated: true,
  },
  {
    id: "e-q1-q2",
    source: "q1",
    target: "q2",
    type: "straight",
  },
  {
    id: "e-q2-q3",
    source: "q2",
    target: "q3",
    type: "straight",
  },
  {
    id: "e-q3-q4",
    source: "q3",
    target: "q4",
    type: "straight",
  },
  {
    id: "e-q4-q5",
    source: "q4",
    target: "q5",
    type: "smoothstep",
    animated: true,
    style: {
      stroke: "#22c55e",
      strokeWidth: 2,
    },
    label: "1: 未婚",
    labelStyle: {
      fill: "#22c55e",
      fontWeight: 700,
      fontSize: 12,
    },
    labelBgStyle: {
      fill: "white",
      fillOpacity: 0.9,
    },
  },
  {
    id: "e-q4-q6",
    source: "q4",
    target: "q6",
    type: "smoothstep",
    style: {
      stroke: "#ef4444",
      strokeWidth: 2,
      strokeDasharray: "5 5",
    },
    label: "2: 既婚",
    labelStyle: {
      fill: "#ef4444",
      fontWeight: 700,
      fontSize: 12,
    },
    labelBgStyle: {
      fill: "white",
      fillOpacity: 0.9,
    },
  },
  {
    id: "e-q6-q7",
    source: "q6",
    target: "q7",
    type: "straight",
  },
  {
    id: "e-q7-screening-end",
    source: "q7",
    target: "screening-end",
    type: "straight",
  },
  {
    id: "e-screening-end-main-start",
    source: "screening-end",
    target: "main-survey-start",
    type: "straight",
    animated: true,
  },
  {
    id: "e-main-start-q8",
    source: "main-survey-start",
    target: "q8",
    type: "straight",
  },
  {
    id: "e-q8-q9",
    source: "q8",
    target: "q9",
    type: "straight",
  },
  {
    id: "e-q9-q10",
    source: "q9",
    target: "q10",
    type: "straight",
  },
  {
    id: "e-q10-q11",
    source: "q10",
    target: "q11",
    type: "straight",
  },
  {
    id: "e-q11-q12",
    source: "q11",
    target: "q12",
    type: "straight",
  },
  {
    id: "e-q12-q13",
    source: "q12",
    target: "q13",
    type: "straight",
  },
  {
    id: "e-q13-q14",
    source: "q13",
    target: "q14",
    type: "straight",
  },
  {
    id: "e-q14-q15",
    source: "q14",
    target: "q15",
    type: "straight",
  },
  {
    id: "e-q15-end",
    source: "q15",
    target: "end",
    type: "straight",
    animated: true,
  },
];

type QuestionFormData = {
  Q5: string[];
  Q6: string;
  Q7: string;
  Q8: string;
  Q9: string;
  Q10: string[];
  Q11: string;
  Q12: string;
  Q13: string;
  Q14: string;
  Q15: string[];
};

export const LogicCheckSection = () => {
  const router = useRouter();
  const { handleSubmit: _handleSubmit } = useForm<QuestionFormData>({
    defaultValues: {
      Q5: [],
      Q6: "",
      Q7: "",
      Q8: "",
      Q9: "",
      Q10: [],
      Q11: "",
      Q12: "",
      Q13: "",
      Q14: "",
      Q15: [],
    },
  });

  const _onSubmit = (data: QuestionFormData) => {
    console.log("Form submitted:", data);
  };

  const handleGoToReview = () => {
    router.push("/surveys/review/preview");
  };

  // ノードUI用の状態管理
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const nodeTypes = useMemo(() => createNodeTypes(), []);

  const handleNodeClick = (_event: React.MouseEvent, node: Node) => {
    console.log("Node clicked:", node);
  };

  const handlePaneClick = () => {
    // パネルクリック時の処理
  };

  return (
    <div className="flex flex-col items-start relative self-stretch w-full">
      <div className="flex items-center justify-between w-full">
        <div></div>
      </div>
      <Card className="flex flex-col items-start gap-4 p-4 relative self-stretch w-full flex-[0_0_auto] bg-[#138fb5] rounded-lg">
        <ScrollArea className="flex flex-col h-[580px] items-start gap-4 relative self-stretch rounded-lg">
          {/* ロジックチェックの内容 */}
          <div className="w-full p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-bold mb-4">ロジックチェック結果</h2>
            
            {/* ノードUI */}
            <div className="w-full h-[3000px] mb-6 border rounded-lg overflow-hidden">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={handleNodeClick}
                onPaneClick={handlePaneClick}
                nodeTypes={nodeTypes}
                fitView
                proOptions={{ hideAttribution: true }}
                minZoom={0.1}
                maxZoom={2}
                defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
                className="bg-white"
              >
                <Background />
                <Controls />
              </ReactFlow>
            </div>
            
            {/* スクリーニング設問 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">固定セクション：性別・年齢・居住地</h3>
              <div className="mb-4 p-3 bg-white rounded border">
                <p className="font-medium mb-2">あなたの性別を教えてください。</p>
                <p className="text-sm text-gray-600">ID: Q1 | タイプ: SA・単一選択方式</p>
              </div>
              <div className="mb-4 p-3 bg-white rounded border">
                <p className="font-medium mb-2">あなたの年齢を教えてください。</p>
                <p className="text-sm text-gray-600">ID: Q2 | タイプ: NU・数値回答形式</p>
              </div>
              <div className="mb-4 p-3 bg-white rounded border">
                <p className="font-medium mb-2">あなたのお住まい（都道府県）を教えてください。</p>
                <p className="text-sm text-gray-600">ID: Q3 | タイプ: SA・単一選択方式</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">セクション：未既婚</h3>
              <div className="mb-4 p-3 bg-white rounded border">
                <p className="font-medium mb-2">あなたは結婚していますか。</p>
                <p className="text-sm text-gray-600">ID: Q4 | タイプ: SA・単一選択方式</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">{childrenSection.title}</h3>
              {childrenSection.questions.map((question) => (
                <div key={question.id} className="mb-4 p-3 bg-white rounded border">
                  <p className="font-medium mb-2">{question.question}</p>
                  <p className="text-sm text-gray-600">ID: {question.id} | タイプ: {question.typeLabel}</p>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">セクション：職業</h3>
              <div className="mb-4 p-3 bg-white rounded border">
                <p className="font-medium mb-2">あなたの職業を教えてください。</p>
                <p className="text-sm text-gray-600">ID: Q6 | タイプ: GR・グループ選択</p>
              </div>
              <div className="mb-4 p-3 bg-white rounded border">
                <p className="font-medium mb-2">ご家族の職業を教えてください。</p>
                <p className="text-sm text-gray-600">ID: Q7 | タイプ: GR・グループ選択</p>
              </div>
            </div>

            {/* 本調査設問 */}
            {mainSurveySections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-6">
                <h3 className="text-lg font-semibold mb-3">{section.title}</h3>
                {section.questions.map((question) => (
                  <div key={question.id} className="mb-4 p-3 bg-white rounded border">
                    <p className="font-medium mb-2">{question.question}</p>
                    <p className="text-sm text-gray-600">ID: {question.id} | タイプ: {question.typeLabel}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* レビューへ進むボタンを下部に配置 */}
      <div className="flex justify-center w-full mt-6 pb-6">
        <Button
          onClick={handleGoToReview}
          className="w-[340px] h-14 bg-[#556064] rounded-[34px] flex items-center justify-center gap-4 px-4 py-0"
        >
          <span className="font-bold text-white text-base text-center tracking-[0] leading-[22.4px] font-['Noto_Sans_JP',Helvetica]">
            レビューへ進む
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-right w-[6.68px] h-[11.89px]"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </Button>
      </div>
    </div>
  );
};
