// 調査の基本型定義
export type SurveyType = "screening" | "main" | "logic";

export type QuestionType = "SA" | "MA" | "NU" | "TE" | "RA" | "CA";

export type QuestionOption = {
  id: string;
  label: string;
  value: string;
  editable?: boolean;
};

export type Question = {
  id: string;
  type: QuestionType;
  question: string;
  options?: QuestionOption[];
  required?: boolean;
  conditions?: QuestionCondition[];
};

export type QuestionCondition = {
  type: "skip" | "jump" | "show";
  targetQuestionId: string;
  condition: string;
};

export type SurveySection = {
  id: string;
  title: string;
  type: SurveyType;
  questions: Question[];
  order: number;
};

export type SurveyFormData = {
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string[];
  q8?: string;
  q9?: string[];
  q10?: string;
  q11?: string;
  q12?: string;
  q13?: string;
  q14?: string;
  q15?: string;
};

// プロジェクト管理関連の型定義
export type ProjectStatus =
  | "作成中"
  | "レビュー待ち"
  | "レビュー完了"
  | "作成完了"
  | "配信中"
  | "配信終了";

export type IconAction = "review" | "response" | "distribution" | "gtTable";

export type Project = {
  id: string;
  title: string;
  status: ProjectStatus;
  createdDate: string;
  updatedDate: string;
  creator: string;
};

// レビュー関連の型定義
export type ReviewType = "ai" | "team";

export type ReviewStatus = "resolved" | "unresolved";

export type ReviewItem = {
  id: number;
  questionNo: string;
  type: string;
  reviewerName: string;
  time: string;
  comment: string;
  status: ReviewStatus;
  reviewType: ReviewType;
  replies?: number;
  sectionId?: string;
  questionId?: string;
  position?: {
    x: number;
    y: number;
  };
};

// コンポーネントのProps型定義
export type BaseComponentProps = {
  className?: string;
  children?: React.ReactNode;
};

export type SurveyCardProps = BaseComponentProps & {
  variant?: "default" | "primary" | "secondary";
  title?: string;
  description?: string;
};

export type FormFieldProps = BaseComponentProps & {
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
};

// ユーティリティ型定義
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
