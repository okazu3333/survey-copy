# 📋 ページごとの対象クラスサマリー

## 🏠 メインページ構造

### 1. ルートページ (`/`)
- **レイアウト**: `min-h-screen flex flex-col`
- **メイン**: `flex-1`
- **フッター**: 固定配置

### 2. ダッシュボード (`/surveys`)
- **コンテナ**: `min-h-screen bg-gray-100`
- **メイン**: `container mx-auto px-6 py-8 space-y-8`
- **セクション**: `NewsSection`, `ProjectsSection`

## 📊 調査管理ページ

### 3. 調査一覧 (`/surveys/list`)
- **レイアウト**: `min-h-screen bg-gray-100`
- **コンテナ**: `container mx-auto px-6 py-8`
- **テーブル**: `SurveyListSection`

### 4. ニュース一覧 (`/surveys/news`)
- **レイアウト**: `min-h-screen bg-gray-100`
- **コンテナ**: `container mx-auto px-6 py-8`
- **リスト**: `NewsListSection`

## ✏️ 調査作成フロー

### 5. 新規調査作成 (`/surveys/new`)
- **レイアウト**: `flex gap-4 max-w-[1600px] mx-auto`
- **フォームエリア**: `w-[calc(100%-500px)] max-w-[1000px]` (AIチャット開時)
- **AIチャット**: `min-w-[480px] max-w-[500px]` (展開時)
- **フォーム**: `max-w-[700px]` (固定幅)
- **ボタン**: `w-[340px]` (固定幅)

### 6. セクション設定 (`/surveys/section`)
- **コンテナ**: `flex flex-col w-full items-center gap-6 p-6 bg-[#ffffff] rounded-b-lg shadow-main-bg`

## 🔧 設問編集フロー

### 7. 設問編集 (`/surveys/question/edit`)
- **コンテナ**: `flex flex-col w-full items-center gap-6 p-6 bg-[#ffffff] rounded-b-lg shadow-main-bg`
- **モード切り替え**: `ModeToggle`
- **編集エリア**: `SurveyEditSection`

### 8. 設問プレビュー (`/surveys/question/preview`)
- **コンテナ**: `flex flex-col w-full items-center gap-6 p-6 bg-[#ffffff] rounded-b-lg shadow-main-bg`
- **プレビューエリア**: `SurveyPreviewSection`

### 9. ロジックチェック (`/surveys/question/check`)
- **コンテナ**: `flex flex-col w-full items-center gap-6 p-6 bg-[#ffffff] rounded-b-lg shadow-main-bg`
- **チェックエリア**: `LogicCheckSection`
- **フロー図**: `w-full h-[3000px] bg-gray-50 rounded-lg overflow-x-auto`

## 👀 レビューフロー

### 10. レビューダッシュボード (`/surveys/review`)
- **レイアウト**: `min-h-screen bg-gray-100`
- **メイン**: `w-full py-6 px-4`
- **コンテナ**: `max-w-[1440px] mx-auto`
- **サイドバー**: `w-[500px]` (展開時), `w-12` (折りたたみ時)

### 11. レビュープレビュー (`/surveys/review/preview`)
- **コンテナ**: `flex flex-col gap-4`
- **メイン**: `flex flex-col w-full items-center gap-6 p-6 bg-[#ffffff] rounded-b-lg shadow-main-bg`
- **プレビューエリア**: `h-[620px]` (固定高さ)

### 12. レビューロジック (`/surveys/review/logic`)
- **コンテナ**: `flex flex-col gap-4`
- **メイン**: `flex flex-col w-full items-center gap-6 p-6 bg-[#ffffff] rounded-b-lg shadow-main-bg`
- **ロジックエリア**: `LogicCheckSurveyContent`

### 13. レビュアーモード
- **プレビュー**: `ReviewPreviewSection userType="reviewer"`
- **ロジック**: `PreviewLogicCheckSection`

## ✅ 完了ページ

### 14. 調査完了 (`/surveys/complete`)
- **レイアウト**: `min-h-screen bg-gray-100`
- **メイン**: `w-full py-6 px-4`
- **コンテナ**: `max-w-[1440px] mx-auto`
- **カード**: `w-[640px] bg-white rounded-lg border-0`
- **ボタン**: `w-[240px]` (固定幅)

## 🧩 共通UIコンポーネント

### shadcn/ui コンポーネント
- **Button**: 全バリアント対応 (`default`, `secondary`, `destructive`, `outline`, `ghost`, `link`)
- **Card**: ヘッダー、コンテンツ、フッター対応
- **Table**: ソート、フィルタ、ページネーション対応
- **Dialog**: モーダル、シート対応
- **Form**: Input, Textarea, Select, Checkbox, Radio対応
- **Navigation**: Tabs, DropdownMenu, Pagination対応

### カスタムコンポーネント
- **SurveyCardHeader**: ステップインジケーター付きヘッダー
- **PublishStep**: 右寄せ一行表示のステップインジケーター
- **SurveyAiChat**: 折りたたみ可能なAIチャット
- **ModeToggle**: 編集/プレビュー/ロジック切り替え

## 📱 レスポンシブ対応

### ブレークポイント
- **モバイル**: `sm:` (640px以上)
- **タブレット**: `md:` (768px以上)
- **デスクトップ**: `lg:` (1024px以上)
- **大画面**: `xl:` (1280px以上)

### レイアウト調整
- **AIチャット**: 開時 `w-[calc(100%-500px)]`, 閉時 `w-[calc(100%-320px)]`
- **レビューサイドバー**: 開時 `w-[500px]`, 閉時 `w-12`
- **ステップインジケーター**: レスポンシブ幅調整

## 🎨 カラーパレット

### ブランドカラー
- **プライマリ**: `#138FB5` (青)
- **セカンダリ**: `#75BACF` (薄い青)
- **アクセント**: `#60ADC2` (中間の青)
- **成功**: `#4BBC80` (緑)
- **警告**: `#d96868` (赤)

### 背景色
- **メイン**: `bg-gray-100`
- **カード**: `bg-[#ffffff]`
- **セクション**: `bg-[#f4f7f9]`

## 📁 ファイル構造

```
app/
├── (auth)/
│   └── surveys/
│       ├── page.tsx                    # ダッシュボード
│       ├── list/page.tsx               # 調査一覧
│       ├── news/page.tsx               # ニュース一覧
│       ├── complete/page.tsx           # 完了ページ
│       ├── (chat)/
│       │   ├── new/page.tsx            # 新規作成
│       │   ├── section/page.tsx        # セクション設定
│       │   └── question/
│       │       ├── edit/page.tsx       # 設問編集
│       │       ├── preview/page.tsx    # 設問プレビュー
│       │       └── check/page.tsx      # ロジックチェック
│       └── review/
│           ├── page.tsx                # レビューダッシュボード
│           ├── preview/page.tsx        # レビュープレビュー
│           ├── logic/page.tsx          # レビューロジック
│           └── reviewer/
│               ├── preview/page.tsx    # レビュアープレビュー
│               └── logic/page.tsx      # レビュアーロジック
└── layout.tsx                          # ルートレイアウト
```

## 🔧 コンポーネント配置

```
components/
├── ui/                                 # shadcn/ui コンポーネント
│   ├── button.tsx
│   ├── card.tsx
│   ├── table.tsx
│   ├── dialog.tsx
│   └── ...
├── publish-step/
│   └── publish-step.tsx                # ステップインジケーター
├── survey-ai/
│   └── survey-ai-chat.tsx              # AIチャット
├── survey-card-header.tsx              # 調査ヘッダー
└── survey-flow-nodes/                  # フロー図ノード
    ├── QuestionNode.tsx
    ├── GroupNode.tsx
    └── ...
```

## 📝 注意事項

1. **レスポンシブ対応**: すべてのページでモバイルファースト設計
2. **アクセシビリティ**: ARIA属性とキーボードナビゲーション対応
3. **パフォーマンス**: 遅延読み込みとコード分割を実装
4. **一貫性**: デザインシステムに基づく統一されたUI
5. **保守性**: コンポーネント化と型安全性の確保

この構造により、一貫性のあるUI/UXを提供し、各ページの役割に応じた適切なレイアウトとコンポーネントが配置されています。 