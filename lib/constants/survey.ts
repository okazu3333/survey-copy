/**
 * アンケート関連の定数定義
 *
 * アンケートシステムで使用される定数を一元管理します。
 */

// アンケートの設問タイプ
export const SURVEY_QUESTION_TYPES = {
  SA: "SA", // 単一選択
  MA: "MA", // 複数選択
  NU: "NU", // 数値入力
  TE: "TE", // テキスト入力
  RA: "RA", // ランキング
  CA: "CA", // カード選択
  GR: "GR", // グリッド
} as const;

// 設問タイプの表示名
export const SURVEY_QUESTION_TYPE_LABELS = {
  [SURVEY_QUESTION_TYPES.SA]: "単一選択",
  [SURVEY_QUESTION_TYPES.MA]: "複数選択",
  [SURVEY_QUESTION_TYPES.NU]: "数値入力",
  [SURVEY_QUESTION_TYPES.TE]: "テキスト入力",
  [SURVEY_QUESTION_TYPES.RA]: "ランキング",
  [SURVEY_QUESTION_TYPES.CA]: "カード選択",
  [SURVEY_QUESTION_TYPES.GR]: "グリッド",
} as const;

// アンケートのステータス
export const SURVEY_STATUS = {
  DRAFT: "draft",
  IN_REVIEW: "in_review",
  APPROVED: "approved",
  REJECTED: "rejected",
  PUBLISHED: "published",
  CLOSED: "closed",
} as const;

// ステータスの表示名
export const SURVEY_STATUS_LABELS = {
  [SURVEY_STATUS.DRAFT]: "下書き",
  [SURVEY_STATUS.IN_REVIEW]: "レビュー中",
  [SURVEY_STATUS.APPROVED]: "承認済み",
  [SURVEY_STATUS.REJECTED]: "却下",
  [SURVEY_STATUS.PUBLISHED]: "公開中",
  [SURVEY_STATUS.CLOSED]: "終了",
} as const;

// アンケートのセクションタイプ
export const SURVEY_SECTION_TYPES = {
  SCREENING: "screening",
  MAIN: "main",
  DEMOGRAPHIC: "demographic",
  CUSTOM: "custom",
} as const;

// セクションタイプの表示名
export const SURVEY_SECTION_TYPE_LABELS = {
  [SURVEY_SECTION_TYPES.SCREENING]: "スクリーニング",
  [SURVEY_SECTION_TYPES.MAIN]: "本調査",
  [SURVEY_SECTION_TYPES.DEMOGRAPHIC]: "属性",
  [SURVEY_SECTION_TYPES.CUSTOM]: "カスタム",
} as const;

// ロジックの条件タイプ
export const LOGIC_CONDITION_TYPES = {
  EQUALS: "equals",
  NOT_EQUALS: "not_equals",
  GREATER_THAN: "greater_than",
  LESS_THAN: "less_than",
  GREATER_THAN_OR_EQUAL: "greater_than_or_equal",
  LESS_THAN_OR_EQUAL: "less_than_or_equal",
  CONTAINS: "contains",
  NOT_CONTAINS: "not_contains",
  IS_EMPTY: "is_empty",
  IS_NOT_EMPTY: "is_not_empty",
} as const;

// 条件タイプの表示名
export const LOGIC_CONDITION_TYPE_LABELS = {
  [LOGIC_CONDITION_TYPES.EQUALS]: "等しい",
  [LOGIC_CONDITION_TYPES.NOT_EQUALS]: "等しくない",
  [LOGIC_CONDITION_TYPES.GREATER_THAN]: "より大きい",
  [LOGIC_CONDITION_TYPES.LESS_THAN]: "より小さい",
  [LOGIC_CONDITION_TYPES.GREATER_THAN_OR_EQUAL]: "以上",
  [LOGIC_CONDITION_TYPES.LESS_THAN_OR_EQUAL]: "以下",
  [LOGIC_CONDITION_TYPES.CONTAINS]: "含む",
  [LOGIC_CONDITION_TYPES.NOT_CONTAINS]: "含まない",
  [LOGIC_CONDITION_TYPES.IS_EMPTY]: "空",
  [LOGIC_CONDITION_TYPES.IS_NOT_EMPTY]: "空でない",
} as const;

// ロジックのアクションタイプ
export const LOGIC_ACTION_TYPES = {
  SHOW: "show",
  HIDE: "hide",
  SKIP_TO: "skip_to",
  SET_VALUE: "set_value",
  CLEAR_VALUE: "clear_value",
} as const;

// アクションタイプの表示名
export const LOGIC_ACTION_TYPE_LABELS = {
  [LOGIC_ACTION_TYPES.SHOW]: "表示",
  [LOGIC_ACTION_TYPES.HIDE]: "非表示",
  [LOGIC_ACTION_TYPES.SKIP_TO]: "スキップ",
  [LOGIC_ACTION_TYPES.SET_VALUE]: "値を設定",
  [LOGIC_ACTION_TYPES.CLEAR_VALUE]: "値をクリア",
} as const;

// レビューのステータス
export const REVIEW_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  COMMENTED: "commented",
} as const;

// レビューステータスの表示名
export const REVIEW_STATUS_LABELS = {
  [REVIEW_STATUS.PENDING]: "未レビュー",
  [REVIEW_STATUS.APPROVED]: "承認",
  [REVIEW_STATUS.REJECTED]: "却下",
  [REVIEW_STATUS.COMMENTED]: "コメント付き",
} as const;

// レビューの優先度
export const REVIEW_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
} as const;

// 優先度の表示名
export const REVIEW_PRIORITY_LABELS = {
  [REVIEW_PRIORITY.LOW]: "低",
  [REVIEW_PRIORITY.MEDIUM]: "中",
  [REVIEW_PRIORITY.HIGH]: "高",
  [REVIEW_PRIORITY.CRITICAL]: "緊急",
} as const;

// ファイルアップロードの制限
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES: 10,
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  MAX_IMAGE_DIMENSIONS: {
    width: 1920,
    height: 1080,
  },
} as const;

// バリデーションルール
export const VALIDATION_RULES = {
  SURVEY_TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 200,
  },
  SURVEY_DESCRIPTION: {
    MAX_LENGTH: 1000,
  },
  QUESTION_TEXT: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 500,
  },
  OPTION_TEXT: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 200,
  },
  MAX_QUESTIONS: 100,
  MAX_OPTIONS: 20,
  MAX_SECTIONS: 10,
} as const;

// エラーメッセージ
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: "この項目は必須です",
  INVALID_EMAIL: "有効なメールアドレスを入力してください",
  INVALID_URL: "有効なURLを入力してください",
  INVALID_NUMBER: "有効な数値を入力してください",
  MIN_LENGTH: (min: number) => `${min}文字以上で入力してください`,
  MAX_LENGTH: (max: number) => `${max}文字以下で入力してください`,
  FILE_TOO_LARGE: (maxSize: number) =>
    `ファイルサイズは${maxSize}MB以下にしてください`,
  INVALID_FILE_TYPE: "対応していないファイル形式です",
  NETWORK_ERROR: "ネットワークエラーが発生しました",
  SERVER_ERROR: "サーバーエラーが発生しました",
  UNAUTHORIZED: "認証が必要です",
  FORBIDDEN: "アクセス権限がありません",
  NOT_FOUND: "リソースが見つかりません",
} as const;

// 成功メッセージ
export const SUCCESS_MESSAGES = {
  SAVED: "保存しました",
  PUBLISHED: "公開しました",
  APPROVED: "承認しました",
  REJECTED: "却下しました",
  UPLOADED: "アップロードしました",
  DELETED: "削除しました",
} as const;

// 確認メッセージ
export const CONFIRM_MESSAGES = {
  DELETE_SURVEY: "このアンケートを削除しますか？",
  DELETE_QUESTION: "この設問を削除しますか？",
  DELETE_SECTION: "このセクションを削除しますか？",
  PUBLISH_SURVEY: "このアンケートを公開しますか？",
  CLOSE_SURVEY: "このアンケートを終了しますか？",
  LEAVE_WITHOUT_SAVE: "保存せずにページを離れますか？",
} as const;

// デフォルト値
export const DEFAULT_VALUES = {
  SURVEY_TITLE: "新しいアンケート",
  SURVEY_DESCRIPTION: "",
  QUESTION_TEXT: "新しい設問",
  OPTION_TEXT: "新しい選択肢",
  SECTION_TITLE: "新しいセクション",
  MAX_RESPONSES: 1000,
  RESPONSE_LIMIT: false,
} as const;

// 色の定数
export const COLORS = {
  PRIMARY: "#138FB5",
  SECONDARY: "#75BACF",
  SUCCESS: "#4BBC80",
  WARNING: "#FFB020",
  ERROR: "#D14343",
  INFO: "#2196F3",
  NEUTRAL: "#6B7280",
} as const;

// アイコンの定数
export const ICONS = {
  SURVEY: "ClipboardList",
  QUESTION: "HelpCircle",
  SECTION: "Folder",
  LOGIC: "GitBranch",
  REVIEW: "Eye",
  PUBLISH: "Send",
  SAVE: "Save",
  DELETE: "Trash2",
  EDIT: "Edit",
  ADD: "Plus",
  CLOSE: "X",
  CHECK: "Check",
  WARNING: "AlertTriangle",
  ERROR: "AlertCircle",
  INFO: "Info",
} as const;

// 型定義
export type SurveyQuestionType =
  (typeof SURVEY_QUESTION_TYPES)[keyof typeof SURVEY_QUESTION_TYPES];
export type SurveyStatus = (typeof SURVEY_STATUS)[keyof typeof SURVEY_STATUS];
export type SurveySectionType =
  (typeof SURVEY_SECTION_TYPES)[keyof typeof SURVEY_SECTION_TYPES];
export type LogicConditionType =
  (typeof LOGIC_CONDITION_TYPES)[keyof typeof LOGIC_CONDITION_TYPES];
export type LogicActionType =
  (typeof LOGIC_ACTION_TYPES)[keyof typeof LOGIC_ACTION_TYPES];
export type ReviewStatus = (typeof REVIEW_STATUS)[keyof typeof REVIEW_STATUS];
export type ReviewPriority =
  (typeof REVIEW_PRIORITY)[keyof typeof REVIEW_PRIORITY];
